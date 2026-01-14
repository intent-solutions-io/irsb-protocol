// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IDisputeModule} from "./interfaces/IDisputeModule.sol";
import {IIntentReceiptHub} from "./interfaces/IIntentReceiptHub.sol";
import {ISolverRegistry} from "./interfaces/ISolverRegistry.sol";
import {Types} from "./libraries/Types.sol";

/// @title DisputeModule
/// @notice Pluggable dispute resolution for subjective cases (v0.2)
/// @dev Handles evidence submission, escalation, and arbitration
contract DisputeModule is IDisputeModule, Ownable, ReentrancyGuard {
    // ============ Constants ============

    /// @notice Evidence submission window after dispute opening
    uint64 public constant EVIDENCE_WINDOW = 24 hours;

    /// @notice Default arbitration fee
    uint256 public constant DEFAULT_ARBITRATION_FEE = 0.01 ether;

    // ============ State ============

    /// @notice Reference to IntentReceiptHub
    IIntentReceiptHub public receiptHub;

    /// @notice Reference to SolverRegistry
    ISolverRegistry public solverRegistry;

    /// @notice Authorized arbitrator address
    address public arbitrator;

    /// @notice Current arbitration fee
    uint256 public arbitrationFee;

    /// @notice Evidence history (disputeId => Evidence[])
    struct Evidence {
        bytes32 hash;
        address submitter;
        uint64 timestamp;
    }
    mapping(bytes32 => Evidence[]) private _evidenceHistory;

    /// @notice Escalation status by dispute ID
    mapping(bytes32 => bool) private _escalated;

    /// @notice Arbitration fees collected by dispute ID
    mapping(bytes32 => uint256) private _arbitrationFees;

    /// @notice Treasury for collected fees
    address public treasury;

    // ============ Constructor ============

    constructor(
        address _receiptHub,
        address _solverRegistry,
        address _arbitrator
    ) Ownable(msg.sender) {
        receiptHub = IIntentReceiptHub(_receiptHub);
        solverRegistry = ISolverRegistry(_solverRegistry);
        arbitrator = _arbitrator;
        arbitrationFee = DEFAULT_ARBITRATION_FEE;
        treasury = msg.sender;
    }

    // ============ Modifiers ============

    modifier onlyArbitrator() {
        if (msg.sender != arbitrator) revert NotAuthorizedArbitrator();
        _;
    }

    // ============ External Functions ============

    /// @inheritdoc IDisputeModule
    function submitEvidence(bytes32 disputeId, bytes32 evidenceHash) external {
        Types.Dispute memory dispute = receiptHub.getDispute(disputeId);

        // Only parties can submit evidence
        Types.Solver memory solver = solverRegistry.getSolver(dispute.solverId);
        if (msg.sender != dispute.challenger && msg.sender != solver.operator) {
            revert NotDisputeParty();
        }

        // Check evidence window
        if (block.timestamp > dispute.openedAt + EVIDENCE_WINDOW) {
            revert EvidenceWindowClosed();
        }

        // Store evidence
        _evidenceHistory[disputeId].push(Evidence({
            hash: evidenceHash,
            submitter: msg.sender,
            timestamp: uint64(block.timestamp)
        }));

        emit EvidenceSubmitted(disputeId, msg.sender, evidenceHash);
    }

    /// @inheritdoc IDisputeModule
    function escalate(bytes32 disputeId) external payable nonReentrant {
        Types.Dispute memory dispute = receiptHub.getDispute(disputeId);

        // Only subjective disputes can be escalated
        if (dispute.reason != Types.DisputeReason.Subjective) {
            revert DisputeNotSubjective();
        }

        // Check if already escalated
        if (_escalated[disputeId]) revert AlreadyEscalated();

        // Check fee
        if (msg.value < arbitrationFee) revert ArbitrationFeeTooLow();

        _escalated[disputeId] = true;
        _arbitrationFees[disputeId] = msg.value;

        emit DisputeEscalated(disputeId, arbitrator);
    }

    /// @inheritdoc IDisputeModule
    function resolve(
        bytes32 disputeId,
        bool solverFault,
        uint8 slashPercentage,
        string calldata reason
    ) external onlyArbitrator nonReentrant {
        if (slashPercentage > 100) revert InvalidResolution();

        Types.Dispute memory dispute = receiptHub.getDispute(disputeId);

        // Must be escalated
        require(_escalated[disputeId], "Not escalated");

        uint256 slashAmount = 0;

        if (solverFault && slashPercentage > 0) {
            // Calculate slash amount based on solver's bond
            Types.Solver memory solver = solverRegistry.getSolver(dispute.solverId);
            uint256 availableBond = solver.bondBalance + solver.lockedBalance;
            slashAmount = (availableBond * slashPercentage) / 100;

            // Execute slash: 70% to user, 20% to treasury, 10% to arbitrator
            uint256 userShare = (slashAmount * 70) / 100;
            uint256 treasuryShare = (slashAmount * 20) / 100;
            uint256 arbitratorShare = slashAmount - userShare - treasuryShare;

            if (userShare > 0) {
                solverRegistry.slash(
                    dispute.solverId,
                    userShare,
                    dispute.receiptId,
                    dispute.reason,
                    dispute.challenger
                );
            }

            if (treasuryShare > 0) {
                solverRegistry.slash(
                    dispute.solverId,
                    treasuryShare,
                    dispute.receiptId,
                    dispute.reason,
                    treasury
                );
            }

            if (arbitratorShare > 0) {
                solverRegistry.slash(
                    dispute.solverId,
                    arbitratorShare,
                    dispute.receiptId,
                    dispute.reason,
                    arbitrator
                );
            }
        } else {
            // Solver not at fault, unlock bond
            Types.Solver memory solver = solverRegistry.getSolver(dispute.solverId);
            solverRegistry.unlockBond(dispute.solverId, solver.lockedBalance);

            // Return arbitration fee to challenger (minus gas stipend)
            uint256 fee = _arbitrationFees[disputeId];
            if (fee > 0) {
                (bool success, ) = payable(dispute.challenger).call{value: fee}("");
                require(success, "Fee refund failed");
            }
        }

        emit ArbitrationResolved(disputeId, solverFault, slashAmount, reason);
    }

    // ============ View Functions ============

    /// @inheritdoc IDisputeModule
    function getEvidenceHistory(bytes32 disputeId) external view 
        returns (
            bytes32[] memory evidenceHashes,
            address[] memory submitters,
            uint64[] memory timestamps
        ) 
    {
        Evidence[] storage history = _evidenceHistory[disputeId];
        uint256 length = history.length;

        evidenceHashes = new bytes32[](length);
        submitters = new address[](length);
        timestamps = new uint64[](length);

        for (uint256 i = 0; i < length; i++) {
            evidenceHashes[i] = history[i].hash;
            submitters[i] = history[i].submitter;
            timestamps[i] = history[i].timestamp;
        }
    }

    /// @inheritdoc IDisputeModule
    function canEscalate(bytes32 disputeId) external view returns (bool) {
        Types.Dispute memory dispute = receiptHub.getDispute(disputeId);
        return dispute.reason == Types.DisputeReason.Subjective && 
               !_escalated[disputeId] &&
               !dispute.resolved;
    }

    /// @inheritdoc IDisputeModule
    function getArbitrationFee() external view returns (uint256) {
        return arbitrationFee;
    }

    /// @inheritdoc IDisputeModule
    function getArbitrator() external view returns (address) {
        return arbitrator;
    }

    // ============ Admin Functions ============

    /// @notice Set arbitrator address
    function setArbitrator(address _arbitrator) external onlyOwner {
        require(_arbitrator != address(0), "Zero address");
        arbitrator = _arbitrator;
    }

    /// @notice Set arbitration fee
    function setArbitrationFee(uint256 _fee) external onlyOwner {
        arbitrationFee = _fee;
    }

    /// @notice Set treasury address
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
    }

    /// @notice Update contract references
    function setContracts(
        address _receiptHub,
        address _solverRegistry
    ) external onlyOwner {
        receiptHub = IIntentReceiptHub(_receiptHub);
        solverRegistry = ISolverRegistry(_solverRegistry);
    }

    /// @notice Withdraw collected arbitration fees to treasury
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = payable(treasury).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /// @notice Receive ETH for arbitration fees
    receive() external payable {}
}
