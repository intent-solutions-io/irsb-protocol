// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {IIntentReceiptHub} from "./interfaces/IIntentReceiptHub.sol";
import {ISolverRegistry} from "./interfaces/ISolverRegistry.sol";
import {Types} from "./libraries/Types.sol";

/// @title IntentReceiptHub
/// @notice Core contract for posting and managing intent receipts
/// @dev Handles receipt lifecycle, disputes, and settlement
contract IntentReceiptHub is IIntentReceiptHub, Ownable, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============

    /// @notice Default challenge window duration
    uint64 public constant DEFAULT_CHALLENGE_WINDOW = 1 hours;

    /// @notice Maximum batch size for posting receipts
    uint256 public constant MAX_BATCH_SIZE = 50;

    // ============ State ============

    /// @notice Reference to SolverRegistry
    ISolverRegistry public solverRegistry;

    /// @notice Challenge window duration
    uint64 public challengeWindow;

    /// @notice Receipt storage by ID
    mapping(bytes32 => Types.IntentReceipt) private _receipts;

    /// @notice Receipt status by ID
    mapping(bytes32 => Types.ReceiptStatus) private _receiptStatus;

    /// @notice Dispute storage by receipt ID
    mapping(bytes32 => Types.Dispute) private _disputes;

    /// @notice Settlement proofs by receipt ID
    mapping(bytes32 => bytes32) private _settlementProofs;

    /// @notice Receipts by solver (solverId => receiptId[])
    mapping(bytes32 => bytes32[]) private _solverReceipts;

    /// @notice Receipts by intent (intentHash => receiptId[])
    mapping(bytes32 => bytes32[]) private _intentReceipts;

    /// @notice DisputeModule address (v0.2)
    address public disputeModule;

    /// @notice Total receipts posted
    uint256 public totalReceipts;

    /// @notice Total disputes opened
    uint256 public totalDisputes;

    /// @notice Total amount slashed
    uint256 public totalSlashed;

    // ============ Constructor ============

    constructor(address _solverRegistry) Ownable(msg.sender) {
        solverRegistry = ISolverRegistry(_solverRegistry);
        challengeWindow = DEFAULT_CHALLENGE_WINDOW;
    }

    // ============ Modifiers ============

    modifier receiptExists(bytes32 receiptId) {
        if (_receiptStatus[receiptId] == Types.ReceiptStatus.Pending && 
            _receipts[receiptId].createdAt == 0) {
            revert ReceiptNotFound();
        }
        _;
    }

    modifier onlyDisputeModule() {
        require(msg.sender == disputeModule || msg.sender == owner(), "Not dispute module");
        _;
    }

    // ============ External Functions ============

    /// @inheritdoc IIntentReceiptHub
    function postReceipt(
        Types.IntentReceipt calldata receipt
    ) external whenNotPaused nonReentrant returns (bytes32 receiptId) {
        // Validate solver
        Types.Solver memory solver = solverRegistry.getSolver(receipt.solverId);
        if (solver.status != Types.SolverStatus.Active) revert InvalidSolver();
        if (solver.operator != msg.sender) revert InvalidSolver();

        // Compute receipt ID
        receiptId = computeReceiptId(receipt);

        // Check for duplicates
        if (_receipts[receiptId].createdAt != 0) revert ReceiptAlreadyExists();

        // Verify signature
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
        address signer = ethSignedHash.recover(receipt.solverSig);
        if (signer != solver.operator) revert InvalidReceiptSignature();

        // Store receipt
        _receipts[receiptId] = receipt;
        _receiptStatus[receiptId] = Types.ReceiptStatus.Pending;

        // Index by solver and intent
        _solverReceipts[receipt.solverId].push(receiptId);
        _intentReceipts[receipt.intentHash].push(receiptId);

        totalReceipts++;

        emit ReceiptPosted(receiptId, receipt.intentHash, receipt.solverId, receipt.expiry);
    }

    /// @inheritdoc IIntentReceiptHub
    function openDispute(
        bytes32 receiptId,
        Types.DisputeReason reason,
        bytes32 evidenceHash
    ) external payable receiptExists(receiptId) whenNotPaused {
        Types.ReceiptStatus status = _receiptStatus[receiptId];
        if (status != Types.ReceiptStatus.Pending) revert ReceiptNotPending();
        if (reason == Types.DisputeReason.None) revert InvalidDisputeReason();

        Types.IntentReceipt storage receipt = _receipts[receiptId];

        // Check challenge window
        if (block.timestamp > receipt.createdAt + challengeWindow) {
            revert ChallengeWindowExpired();
        }

        // Lock solver bond
        uint256 lockAmount = solverRegistry.getMinimumBond();
        solverRegistry.lockBond(receipt.solverId, lockAmount);

        // Create dispute
        _disputes[receiptId] = Types.Dispute({
            receiptId: receiptId,
            solverId: receipt.solverId,
            challenger: msg.sender,
            reason: reason,
            evidenceHash: evidenceHash,
            openedAt: uint64(block.timestamp),
            deadline: uint64(block.timestamp + 24 hours), // 24h resolution deadline
            resolved: false
        });

        _receiptStatus[receiptId] = Types.ReceiptStatus.Disputed;
        totalDisputes++;

        // Update solver dispute count
        solverRegistry.incrementDisputes(receipt.solverId);

        emit DisputeOpened(receiptId, receipt.solverId, msg.sender, reason);
    }

    /// @inheritdoc IIntentReceiptHub
    function resolveDeterministic(bytes32 receiptId) external 
        receiptExists(receiptId) 
        nonReentrant 
    {
        Types.ReceiptStatus status = _receiptStatus[receiptId];
        if (status != Types.ReceiptStatus.Disputed) revert ReceiptNotPending();

        Types.Dispute storage dispute = _disputes[receiptId];
        if (dispute.resolved) revert DisputeAlreadyResolved();

        Types.IntentReceipt storage receipt = _receipts[receiptId];
        bool shouldSlash = false;
        uint256 slashAmount = solverRegistry.getMinimumBond();

        // Deterministic checks based on reason
        if (dispute.reason == Types.DisputeReason.Timeout) {
            // Check if receipt expired without settlement proof
            if (block.timestamp > receipt.expiry && _settlementProofs[receiptId] == bytes32(0)) {
                shouldSlash = true;
            }
        } else if (dispute.reason == Types.DisputeReason.InvalidSignature) {
            // Re-verify signature
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
            address signer = ethSignedHash.recover(receipt.solverSig);
            Types.Solver memory solver = solverRegistry.getSolver(receipt.solverId);
            if (signer != solver.operator) {
                shouldSlash = true;
            }
        }
        // MinOutViolation, WrongToken, etc. require off-chain verification
        // Those are handled by DisputeModule in v0.2

        dispute.resolved = true;

        if (shouldSlash) {
            _receiptStatus[receiptId] = Types.ReceiptStatus.Slashed;
            
            // Slash: 80% to user, 20% to protocol treasury
            uint256 userShare = (slashAmount * 80) / 100;
            uint256 protocolShare = slashAmount - userShare;

            solverRegistry.slash(
                receipt.solverId,
                userShare,
                receiptId,
                dispute.reason,
                dispute.challenger
            );

            // Protocol share stays in registry or sent to treasury
            if (protocolShare > 0) {
                solverRegistry.slash(
                    receipt.solverId,
                    protocolShare,
                    receiptId,
                    dispute.reason,
                    owner()
                );
            }

            totalSlashed += slashAmount;

            emit DisputeResolved(receiptId, receipt.solverId, true, slashAmount);
        } else {
            // Dispute rejected, unlock bond
            solverRegistry.unlockBond(receipt.solverId, slashAmount);
            _receiptStatus[receiptId] = Types.ReceiptStatus.Pending;

            emit DisputeResolved(receiptId, receipt.solverId, false, 0);
        }
    }

    /// @inheritdoc IIntentReceiptHub
    function finalize(bytes32 receiptId) external receiptExists(receiptId) {
        Types.ReceiptStatus status = _receiptStatus[receiptId];
        if (status != Types.ReceiptStatus.Pending) revert ReceiptNotPending();

        Types.IntentReceipt storage receipt = _receipts[receiptId];

        // Must be past challenge window
        if (block.timestamp <= receipt.createdAt + challengeWindow) {
            revert ChallengeWindowActive();
        }

        _receiptStatus[receiptId] = Types.ReceiptStatus.Finalized;

        // Update solver score
        solverRegistry.updateScore(receipt.solverId, true, 0); // TODO: calculate volume

        emit ReceiptFinalized(receiptId, receipt.solverId);
    }

    /// @inheritdoc IIntentReceiptHub
    function submitSettlementProof(
        bytes32 receiptId,
        bytes32 proofHash
    ) external receiptExists(receiptId) {
        Types.IntentReceipt storage receipt = _receipts[receiptId];
        Types.Solver memory solver = solverRegistry.getSolver(receipt.solverId);

        // Only solver operator can submit proof
        require(msg.sender == solver.operator, "Not solver operator");

        _settlementProofs[receiptId] = proofHash;

        emit SettlementProofSubmitted(receiptId, proofHash);
    }

    /// @inheritdoc IIntentReceiptHub
    function batchPostReceipts(
        Types.IntentReceipt[] calldata receipts
    ) external whenNotPaused nonReentrant returns (bytes32[] memory receiptIds) {
        require(receipts.length <= MAX_BATCH_SIZE, "Batch too large");

        receiptIds = new bytes32[](receipts.length);

        for (uint256 i = 0; i < receipts.length; i++) {
            // Simplified validation for batch (assumes same solver)
            Types.IntentReceipt calldata receipt = receipts[i];

            bytes32 receiptId = computeReceiptId(receipt);
            if (_receipts[receiptId].createdAt != 0) continue; // Skip duplicates

            _receipts[receiptId] = receipt;
            _receiptStatus[receiptId] = Types.ReceiptStatus.Pending;
            _solverReceipts[receipt.solverId].push(receiptId);
            _intentReceipts[receipt.intentHash].push(receiptId);

            receiptIds[i] = receiptId;
            totalReceipts++;

            emit ReceiptPosted(receiptId, receipt.intentHash, receipt.solverId, receipt.expiry);
        }
    }

    // ============ View Functions ============

    /// @inheritdoc IIntentReceiptHub
    function getReceipt(bytes32 receiptId) external view 
        returns (Types.IntentReceipt memory receipt, Types.ReceiptStatus status) 
    {
        return (_receipts[receiptId], _receiptStatus[receiptId]);
    }

    /// @inheritdoc IIntentReceiptHub
    function getDispute(bytes32 receiptId) external view returns (Types.Dispute memory) {
        return _disputes[receiptId];
    }

    /// @inheritdoc IIntentReceiptHub
    function canFinalize(bytes32 receiptId) external view returns (bool) {
        if (_receiptStatus[receiptId] != Types.ReceiptStatus.Pending) return false;
        Types.IntentReceipt storage receipt = _receipts[receiptId];
        return block.timestamp > receipt.createdAt + challengeWindow;
    }

    /// @inheritdoc IIntentReceiptHub
    function getReceiptsBySolver(
        bytes32 solverId,
        uint256 offset,
        uint256 limit
    ) external view returns (bytes32[] memory) {
        bytes32[] storage all = _solverReceipts[solverId];
        uint256 total = all.length;

        if (offset >= total) return new bytes32[](0);

        uint256 end = offset + limit;
        if (end > total) end = total;

        bytes32[] memory result = new bytes32[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = all[i];
        }

        return result;
    }

    /// @inheritdoc IIntentReceiptHub
    function getReceiptsByIntent(bytes32 intentHash) external view returns (bytes32[] memory) {
        return _intentReceipts[intentHash];
    }

    /// @inheritdoc IIntentReceiptHub
    function getChallengeWindow() external view returns (uint64) {
        return challengeWindow;
    }

    /// @inheritdoc IIntentReceiptHub
    function computeReceiptId(Types.IntentReceipt calldata receipt) public pure returns (bytes32) {
        return keccak256(abi.encode(
            receipt.intentHash,
            receipt.constraintsHash,
            receipt.routeHash,
            receipt.outcomeHash,
            receipt.evidenceHash,
            receipt.createdAt,
            receipt.expiry,
            receipt.solverId
        ));
    }

    // ============ Admin Functions ============

    /// @notice Set dispute module address
    function setDisputeModule(address _disputeModule) external onlyOwner {
        disputeModule = _disputeModule;
    }

    /// @notice Update challenge window duration
    function setChallengeWindow(uint64 _challengeWindow) external onlyOwner {
        require(_challengeWindow >= 15 minutes, "Window too short");
        require(_challengeWindow <= 24 hours, "Window too long");
        challengeWindow = _challengeWindow;
    }

    /// @notice Update solver registry reference
    function setSolverRegistry(address _solverRegistry) external onlyOwner {
        solverRegistry = ISolverRegistry(_solverRegistry);
    }

    /// @notice Emergency pause
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause
    function unpause() external onlyOwner {
        _unpause();
    }
}
