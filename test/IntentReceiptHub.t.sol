// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {IntentReceiptHub} from "../src/IntentReceiptHub.sol";
import {SolverRegistry} from "../src/SolverRegistry.sol";
import {Types} from "../src/libraries/Types.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract IntentReceiptHubTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    IntentReceiptHub public hub;
    SolverRegistry public registry;

    address public owner = address(this);
    uint256 public operatorPrivateKey = 0x1234;
    address public operator;
    address public challenger = address(0x2);

    uint256 public constant MINIMUM_BOND = 0.1 ether;

    bytes32 public solverId;

    event ReceiptPosted(bytes32 indexed receiptId, bytes32 indexed intentHash, bytes32 indexed solverId, uint64 expiry);
    event DisputeOpened(bytes32 indexed receiptId, bytes32 indexed solverId, address indexed challenger, Types.DisputeReason reason);
    event DisputeResolved(bytes32 indexed receiptId, bytes32 indexed solverId, bool slashed, uint256 slashAmount);
    event ReceiptFinalized(bytes32 indexed receiptId, bytes32 indexed solverId);
    event SettlementProofSubmitted(bytes32 indexed receiptId, bytes32 proofHash);

    function setUp() public {
        operator = vm.addr(operatorPrivateKey);

        // Fund test contract
        vm.deal(address(this), 10 ether);

        // Deploy contracts
        registry = new SolverRegistry();
        hub = new IntentReceiptHub(address(registry));

        // Authorize hub to call registry
        registry.setAuthorizedCaller(address(hub), true);

        // Register and fund solver
        solverId = registry.registerSolver("ipfs://metadata", operator);
        registry.depositBond{value: MINIMUM_BOND}(solverId);
    }

    // Allow test contract to receive ETH (for slashing)
    receive() external payable {}

    // ============ Helper Functions ============

    function _createReceipt(
        bytes32 intentHash,
        uint64 expiry
    ) internal view returns (Types.IntentReceipt memory) {
        Types.IntentReceipt memory receipt = Types.IntentReceipt({
            intentHash: intentHash,
            constraintsHash: keccak256("constraints"),
            routeHash: keccak256("route"),
            outcomeHash: keccak256("outcome"),
            evidenceHash: keccak256("evidence"),
            createdAt: uint64(block.timestamp),
            expiry: expiry,
            solverId: solverId,
            solverSig: ""
        });

        // Sign receipt
        bytes32 messageHash = keccak256(abi.encode(
            receipt.intentHash,
            receipt.constraintsHash,
            receipt.routeHash,
            receipt.outcomeHash,
            receipt.evidenceHash,
            receipt.createdAt,
            receipt.expiry,
            receipt.solverId
        ));
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(operatorPrivateKey, ethSignedHash);
        receipt.solverSig = abi.encodePacked(r, s, v);

        return receipt;
    }

    function _postReceipt(bytes32 intentHash, uint64 expiry) internal returns (bytes32 receiptId) {
        Types.IntentReceipt memory receipt = _createReceipt(intentHash, expiry);

        vm.prank(operator);
        receiptId = hub.postReceipt(receipt);
    }

    // ============ Post Receipt Tests ============

    function test_PostReceipt() public {
        bytes32 intentHash = keccak256("intent1");
        uint64 expiry = uint64(block.timestamp + 1 hours);

        Types.IntentReceipt memory receipt = _createReceipt(intentHash, expiry);

        vm.prank(operator);
        bytes32 receiptId = hub.postReceipt(receipt);

        assertTrue(receiptId != bytes32(0));
        assertEq(hub.totalReceipts(), 1);

        (Types.IntentReceipt memory stored, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        assertEq(stored.intentHash, intentHash);
        assertEq(uint256(status), uint256(Types.ReceiptStatus.Pending));
    }

    function test_PostReceipt_RevertInvalidSolver() public {
        // Create receipt with unregistered solver
        address fakeSolver = address(0x999);
        bytes32 fakeId = keccak256(abi.encodePacked(fakeSolver, block.timestamp));

        Types.IntentReceipt memory receipt = Types.IntentReceipt({
            intentHash: keccak256("intent"),
            constraintsHash: keccak256("constraints"),
            routeHash: keccak256("route"),
            outcomeHash: keccak256("outcome"),
            evidenceHash: keccak256("evidence"),
            createdAt: uint64(block.timestamp),
            expiry: uint64(block.timestamp + 1 hours),
            solverId: fakeId,
            solverSig: ""
        });

        vm.expectRevert(abi.encodeWithSignature("InvalidSolver()"));
        hub.postReceipt(receipt);
    }

    function test_PostReceipt_RevertDuplicate() public {
        bytes32 intentHash = keccak256("intent1");
        uint64 expiry = uint64(block.timestamp + 1 hours);

        Types.IntentReceipt memory receipt = _createReceipt(intentHash, expiry);

        vm.startPrank(operator);
        hub.postReceipt(receipt);

        vm.expectRevert(abi.encodeWithSignature("ReceiptAlreadyExists()"));
        hub.postReceipt(receipt);
        vm.stopPrank();
    }

    function test_PostReceipt_RevertInvalidSignature() public {
        // Sign with a different private key to produce wrong signature
        uint256 wrongPrivateKey = 0x5678;

        Types.IntentReceipt memory receipt = Types.IntentReceipt({
            intentHash: keccak256("intent"),
            constraintsHash: keccak256("constraints"),
            routeHash: keccak256("route"),
            outcomeHash: keccak256("outcome"),
            evidenceHash: keccak256("evidence"),
            createdAt: uint64(block.timestamp),
            expiry: uint64(block.timestamp + 1 hours),
            solverId: solverId,
            solverSig: ""
        });

        // Sign with wrong key
        bytes32 messageHash = keccak256(abi.encode(
            receipt.intentHash,
            receipt.constraintsHash,
            receipt.routeHash,
            receipt.outcomeHash,
            receipt.evidenceHash,
            receipt.createdAt,
            receipt.expiry,
            receipt.solverId
        ));
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivateKey, ethSignedHash);
        receipt.solverSig = abi.encodePacked(r, s, v);

        vm.prank(operator);
        vm.expectRevert(abi.encodeWithSignature("InvalidReceiptSignature()"));
        hub.postReceipt(receipt);
    }

    // ============ Open Dispute Tests ============

    function test_OpenDispute() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        vm.prank(challenger);
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));

        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        assertEq(uint256(status), uint256(Types.ReceiptStatus.Disputed));

        Types.Dispute memory dispute = hub.getDispute(receiptId);
        assertEq(dispute.challenger, challenger);
        assertEq(uint256(dispute.reason), uint256(Types.DisputeReason.Timeout));
        assertFalse(dispute.resolved);

        assertEq(hub.totalDisputes(), 1);
    }

    function test_OpenDispute_RevertNotPending() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        // Open first dispute
        vm.prank(challenger);
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));

        // Try to open second dispute
        vm.prank(challenger);
        vm.expectRevert(abi.encodeWithSignature("ReceiptNotPending()"));
        hub.openDispute(receiptId, Types.DisputeReason.MinOutViolation, keccak256("evidence2"));
    }

    function test_OpenDispute_RevertChallengeWindowExpired() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        // Fast forward past challenge window
        vm.warp(block.timestamp + 2 hours);

        vm.prank(challenger);
        vm.expectRevert(abi.encodeWithSignature("ChallengeWindowExpired()"));
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));
    }

    function test_OpenDispute_RevertInvalidReason() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        vm.prank(challenger);
        vm.expectRevert(abi.encodeWithSignature("InvalidDisputeReason()"));
        hub.openDispute(receiptId, Types.DisputeReason.None, keccak256("evidence"));
    }

    // ============ Resolve Dispute Tests ============

    function test_ResolveDeterministic_SlashOnTimeout() public {
        bytes32 intentHash = keccak256("intent");
        uint64 expiry = uint64(block.timestamp + 30 minutes);

        bytes32 receiptId = _postReceipt(intentHash, expiry);

        // Open timeout dispute
        vm.prank(challenger);
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));

        // Fast forward past expiry
        vm.warp(expiry + 1);

        uint256 challengerBalanceBefore = challenger.balance;

        // Resolve - should slash since no settlement proof and past expiry
        hub.resolveDeterministic(receiptId);

        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        assertEq(uint256(status), uint256(Types.ReceiptStatus.Slashed));

        assertTrue(hub.totalSlashed() > 0);

        // Challenger should receive slashed funds
        assertTrue(challenger.balance > challengerBalanceBefore);
    }

    function test_ResolveDeterministic_NoSlashWithProof() public {
        bytes32 intentHash = keccak256("intent");
        uint64 expiry = uint64(block.timestamp + 30 minutes);

        bytes32 receiptId = _postReceipt(intentHash, expiry);

        // Submit settlement proof
        vm.prank(operator);
        hub.submitSettlementProof(receiptId, keccak256("proof"));

        // Open timeout dispute
        vm.prank(challenger);
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));

        // Fast forward past expiry
        vm.warp(expiry + 1);

        // Resolve - should not slash since settlement proof exists
        hub.resolveDeterministic(receiptId);

        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        assertEq(uint256(status), uint256(Types.ReceiptStatus.Pending));
    }

    function test_ResolveDeterministic_RevertAlreadyResolved() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 30 minutes));

        vm.prank(challenger);
        hub.openDispute(receiptId, Types.DisputeReason.Timeout, keccak256("evidence"));

        vm.warp(block.timestamp + 31 minutes);

        hub.resolveDeterministic(receiptId);

        vm.expectRevert(abi.encodeWithSignature("ReceiptNotPending()"));
        hub.resolveDeterministic(receiptId);
    }

    // ============ Finalize Tests ============

    function test_Finalize() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        // Fast forward past challenge window
        vm.warp(block.timestamp + 2 hours);

        hub.finalize(receiptId);

        (, Types.ReceiptStatus status) = hub.getReceipt(receiptId);
        assertEq(uint256(status), uint256(Types.ReceiptStatus.Finalized));
    }

    function test_Finalize_RevertChallengeWindowActive() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        vm.expectRevert(abi.encodeWithSignature("ChallengeWindowActive()"));
        hub.finalize(receiptId);
    }

    function test_Finalize_RevertNotPending() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        vm.warp(block.timestamp + 2 hours);
        hub.finalize(receiptId);

        vm.expectRevert(abi.encodeWithSignature("ReceiptNotPending()"));
        hub.finalize(receiptId);
    }

    function test_CanFinalize() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        assertFalse(hub.canFinalize(receiptId));

        vm.warp(block.timestamp + 2 hours);

        assertTrue(hub.canFinalize(receiptId));
    }

    // ============ Settlement Proof Tests ============

    function test_SubmitSettlementProof() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        bytes32 proofHash = keccak256("settlement_proof");

        vm.prank(operator);
        hub.submitSettlementProof(receiptId, proofHash);

        // Proof stored (no direct getter, but affects dispute resolution)
    }

    function test_SubmitSettlementProof_RevertNonOperator() public {
        bytes32 receiptId = _postReceipt(keccak256("intent"), uint64(block.timestamp + 1 hours));

        vm.prank(challenger);
        vm.expectRevert("Not solver operator");
        hub.submitSettlementProof(receiptId, keccak256("proof"));
    }

    // ============ Batch Post Tests ============

    function test_BatchPostReceipts() public {
        Types.IntentReceipt[] memory receipts = new Types.IntentReceipt[](3);

        for (uint256 i = 0; i < 3; i++) {
            receipts[i] = _createReceipt(
                keccak256(abi.encodePacked("intent", i)),
                uint64(block.timestamp + 1 hours)
            );
            // Need to update createdAt to make unique receipt IDs
            receipts[i].createdAt = uint64(block.timestamp + i);

            // Re-sign with updated createdAt
            bytes32 messageHash = keccak256(abi.encode(
                receipts[i].intentHash,
                receipts[i].constraintsHash,
                receipts[i].routeHash,
                receipts[i].outcomeHash,
                receipts[i].evidenceHash,
                receipts[i].createdAt,
                receipts[i].expiry,
                receipts[i].solverId
            ));
            bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(operatorPrivateKey, ethSignedHash);
            receipts[i].solverSig = abi.encodePacked(r, s, v);
        }

        vm.prank(operator);
        bytes32[] memory receiptIds = hub.batchPostReceipts(receipts);

        assertEq(receiptIds.length, 3);
        assertEq(hub.totalReceipts(), 3);
    }

    function test_BatchPostReceipts_SkipsDuplicates() public {
        Types.IntentReceipt memory receipt = _createReceipt(
            keccak256("intent"),
            uint64(block.timestamp + 1 hours)
        );

        Types.IntentReceipt[] memory receipts = new Types.IntentReceipt[](2);
        receipts[0] = receipt;
        receipts[1] = receipt; // Duplicate

        vm.prank(operator);
        bytes32[] memory receiptIds = hub.batchPostReceipts(receipts);

        // Second one should be bytes32(0) since it's a duplicate
        assertTrue(receiptIds[0] != bytes32(0));
        assertEq(receiptIds[1], bytes32(0));
        assertEq(hub.totalReceipts(), 1);
    }

    // ============ View Function Tests ============

    function test_GetReceiptsBySolver() public {
        _postReceipt(keccak256("intent1"), uint64(block.timestamp + 1 hours));

        // Need different timestamps for unique receipts
        vm.warp(block.timestamp + 1);
        _postReceipt(keccak256("intent2"), uint64(block.timestamp + 1 hours));

        vm.warp(block.timestamp + 1);
        _postReceipt(keccak256("intent3"), uint64(block.timestamp + 1 hours));

        bytes32[] memory receipts = hub.getReceiptsBySolver(solverId, 0, 10);
        assertEq(receipts.length, 3);

        // Test pagination
        bytes32[] memory page = hub.getReceiptsBySolver(solverId, 1, 1);
        assertEq(page.length, 1);
    }

    function test_GetReceiptsByIntent() public {
        bytes32 intentHash = keccak256("intent1");

        _postReceipt(intentHash, uint64(block.timestamp + 1 hours));

        bytes32[] memory receipts = hub.getReceiptsByIntent(intentHash);
        assertEq(receipts.length, 1);
    }

    function test_GetChallengeWindow() public {
        assertEq(hub.getChallengeWindow(), 1 hours);
    }

    // ============ Admin Function Tests ============

    function test_SetChallengeWindow() public {
        hub.setChallengeWindow(30 minutes);
        assertEq(hub.getChallengeWindow(), 30 minutes);
    }

    function test_SetChallengeWindow_RevertTooShort() public {
        vm.expectRevert("Window too short");
        hub.setChallengeWindow(10 minutes);
    }

    function test_SetChallengeWindow_RevertTooLong() public {
        vm.expectRevert("Window too long");
        hub.setChallengeWindow(48 hours);
    }

    function test_SetDisputeModule() public {
        address module = address(0x999);
        hub.setDisputeModule(module);
        assertEq(hub.disputeModule(), module);
    }

    function test_SetSolverRegistry() public {
        address newRegistry = address(0x888);
        hub.setSolverRegistry(newRegistry);
        assertEq(address(hub.solverRegistry()), newRegistry);
    }

    function test_PauseUnpause() public {
        hub.pause();

        Types.IntentReceipt memory receipt = _createReceipt(
            keccak256("intent"),
            uint64(block.timestamp + 1 hours)
        );

        vm.prank(operator);
        vm.expectRevert();
        hub.postReceipt(receipt);

        hub.unpause();

        vm.prank(operator);
        hub.postReceipt(receipt);
    }
}
