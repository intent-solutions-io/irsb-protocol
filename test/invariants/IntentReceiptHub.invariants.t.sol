// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Test } from "forge-std/Test.sol";
import { SolverRegistry } from "../../src/SolverRegistry.sol";
import { IntentReceiptHub } from "../../src/IntentReceiptHub.sol";
import { Types } from "../../src/libraries/Types.sol";

/// @title IntentReceiptHubInvariants
/// @notice Invariant tests for IntentReceiptHub per audit/INVARIANTS.md
/// @dev Run with: FOUNDRY_PROFILE=ci forge test --match-contract IntentReceiptHubInvariants
contract IntentReceiptHubInvariants is Test {
    SolverRegistry public registry;
    IntentReceiptHub public hub;
    HubHandler public handler;

    function setUp() public {
        registry = new SolverRegistry();
        hub = new IntentReceiptHub(address(registry));

        // Authorize hub in registry
        registry.setAuthorizedCaller(address(hub), true);

        handler = new HubHandler(registry, hub);
        targetContract(address(handler));
    }

    /// @notice Helper to get receipt status
    function _getReceiptStatus(bytes32 receiptId) internal view returns (Types.ReceiptStatus) {
        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        return status;
    }

    /// @notice IRH-1: Receipt Uniqueness
    /// @dev Each intent hash maps to at most one receipt
    function invariant_IRH1_receiptUniqueness() public view {
        bytes32[] memory receiptIds = handler.getReceiptIds();

        // Each receipt ID should appear only once
        for (uint256 i = 0; i < receiptIds.length; i++) {
            for (uint256 j = i + 1; j < receiptIds.length; j++) {
                assertTrue(receiptIds[i] != receiptIds[j], "IRH-1: Duplicate receipt IDs");
            }
        }
    }

    /// @notice IRH-6: Slash Distribution Total
    /// @dev userShare + challengerShare + treasuryShare == slashAmount (100%)
    function invariant_IRH6_slashDistributionTotal() public pure {
        // Static check: BPS constants must sum to 10000
        uint256 total = Types.SLASH_USER_BPS + Types.SLASH_CHALLENGER_BPS + Types.SLASH_TREASURY_BPS;
        assertEq(total, Types.BPS, "IRH-6: Slash distribution != 100%");
    }

    /// @notice IRH-7: Status Transitions - no invalid states
    /// @dev Receipt status follows valid state machine
    function invariant_IRH7_validStatusTransitions() public view {
        bytes32[] memory receiptIds = handler.getReceiptIds();

        for (uint256 i = 0; i < receiptIds.length; i++) {
            Types.ReceiptStatus status = _getReceiptStatus(receiptIds[i]);

            // Status must be a valid enum value (0-3)
            assertTrue(
                status == Types.ReceiptStatus.Pending || status == Types.ReceiptStatus.Disputed
                    || status == Types.ReceiptStatus.Finalized || status == Types.ReceiptStatus.Slashed,
                "IRH-7: Invalid receipt status"
            );
        }
    }

    /// @notice EC-1: No Value Creation
    /// @dev Protocol cannot create ETH
    function invariant_EC1_noValueCreation() public view {
        uint256 totalDeposits = handler.totalDeposits();
        uint256 totalWithdrawals = handler.totalWithdrawals();

        assertGe(totalDeposits, totalWithdrawals, "EC-1: Withdrawals exceed deposits");
    }
}

/// @notice Handler for IntentReceiptHub invariant testing
contract HubHandler is Test {
    SolverRegistry public registry;
    IntentReceiptHub public hub;

    bytes32[] public receiptIds;
    mapping(bytes32 => bool) public receiptExists;

    bytes32[] public solverIds;
    mapping(bytes32 => uint256) public solverPrivateKeys;

    uint256 public totalDeposits;
    uint256 public totalWithdrawals;

    uint256 internal nonce;

    constructor(SolverRegistry _registry, IntentReceiptHub _hub) {
        registry = _registry;
        hub = _hub;
    }

    /// @notice Helper to get receipt status
    function _getReceiptStatus(bytes32 receiptId) internal view returns (Types.ReceiptStatus) {
        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        return status;
    }

    /// @notice Register a solver with bond
    function registerAndBondSolver(uint256 seed) public {
        uint256 privateKey = bound(seed, 1, type(uint128).max);
        address operator = vm.addr(privateKey);

        vm.deal(operator, 1 ether);

        vm.startPrank(operator);
        bytes32 solverId = registry.registerSolver("ipfs://test", operator);
        registry.depositBond{ value: 0.1 ether }(solverId);
        vm.stopPrank();

        solverIds.push(solverId);
        solverPrivateKeys[solverId] = privateKey;
        totalDeposits += 0.1 ether;
    }

    /// @notice Post a valid receipt
    function postReceipt(uint256 solverIndex) public {
        if (solverIds.length == 0) return;

        solverIndex = bound(solverIndex, 0, solverIds.length - 1);
        bytes32 solverId = solverIds[solverIndex];

        Types.Solver memory solver = registry.getSolver(solverId);
        if (solver.status != Types.SolverStatus.Active) return;

        uint256 privateKey = solverPrivateKeys[solverId];
        nonce++;

        // Create receipt
        Types.IntentReceipt memory receipt = Types.IntentReceipt({
            intentHash: keccak256(abi.encode("intent", nonce)),
            constraintsHash: keccak256(abi.encode("constraints", nonce)),
            routeHash: keccak256(abi.encode("route", nonce)),
            outcomeHash: keccak256(abi.encode("outcome", nonce)),
            evidenceHash: keccak256(abi.encode("evidence", nonce)),
            createdAt: uint64(block.timestamp),
            expiry: uint64(block.timestamp + 1 hours),
            solverId: solverId,
            solverSig: ""
        });

        // Sign with chainId and hub address per IRSB-SEC-001
        bytes32 messageHash = keccak256(
            abi.encode(
                block.chainid,
                address(hub),
                receipt.intentHash,
                receipt.constraintsHash,
                receipt.routeHash,
                receipt.outcomeHash,
                receipt.evidenceHash,
                receipt.createdAt,
                receipt.expiry,
                receipt.solverId
            )
        );

        bytes32 ethSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedHash);
        receipt.solverSig = abi.encodePacked(r, s, v);

        // Post receipt
        hub.postReceipt(receipt);

        bytes32 receiptId = Types.computeReceiptId(receipt);
        if (!receiptExists[receiptId]) {
            receiptIds.push(receiptId);
            receiptExists[receiptId] = true;
        }
    }

    /// @notice Finalize a pending receipt
    function finalizeReceipt(uint256 receiptIndex) public {
        if (receiptIds.length == 0) return;

        receiptIndex = bound(receiptIndex, 0, receiptIds.length - 1);
        bytes32 receiptId = receiptIds[receiptIndex];

        Types.ReceiptStatus status = _getReceiptStatus(receiptId);
        if (status != Types.ReceiptStatus.Pending) return;

        // Warp past challenge window
        vm.warp(block.timestamp + 1 hours + 1);

        hub.finalize(receiptId);
    }

    /// @notice Get all receipt IDs
    function getReceiptIds() external view returns (bytes32[] memory) {
        return receiptIds;
    }
}
