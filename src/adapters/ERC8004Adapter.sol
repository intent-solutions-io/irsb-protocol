// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC8004 } from "../interfaces/IERC8004.sol";
import { IValidationRegistry } from "../interfaces/IValidationRegistry.sol";

/// @title ERC8004Adapter
/// @notice Adapter that emits ERC-8004 validation signals for IRSB events
/// @dev Acts as a Validation Provider, pushing signals to external registries
/// @custom:security Non-critical module - failures should NOT revert core operations
contract ERC8004Adapter is IERC8004, Ownable {
    // ============ Constants ============

    string public constant PROVIDER_NAME = "IRSB Protocol";
    string public constant PROVIDER_VERSION = "1.0.0";

    // ============ State ============

    /// @notice External validation registry (optional)
    IValidationRegistry public registry;

    /// @notice Authorized hub addresses that can emit signals
    mapping(address => bool) public authorizedHubs;

    /// @notice Total signals emitted
    uint256 public totalSignals;

    /// @notice Signals by outcome type
    mapping(ValidationOutcome => uint256) public signalsByOutcome;

    // ============ Events ============

    /// @notice Emitted when hub authorization changes
    event HubAuthorizationChanged(address indexed hub, bool authorized);

    /// @notice Emitted when registry is updated
    event RegistryUpdated(address indexed oldRegistry, address indexed newRegistry);

    // ============ Errors ============

    /// @notice Caller not authorized to emit signals
    error UnauthorizedHub();

    /// @notice Invalid hub address
    error InvalidHubAddress();

    // ============ Constructor ============

    /// @notice Deploy adapter
    /// @param _hub Initial authorized hub address
    constructor(address _hub) Ownable(msg.sender) {
        if (_hub != address(0)) {
            authorizedHubs[_hub] = true;
            emit HubAuthorizationChanged(_hub, true);
        }
    }

    // ============ Modifiers ============

    modifier onlyAuthorizedHub() {
        if (!authorizedHubs[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedHub();
        }
        _;
    }

    // ============ Hub Signal Functions ============

    /// @notice Signal a receipt finalization
    /// @param receiptId Receipt that was finalized
    /// @param solverId Solver who fulfilled the receipt
    function signalFinalized(bytes32 receiptId, bytes32 solverId) external onlyAuthorizedHub {
        _emitSignal(receiptId, solverId, ValidationOutcome.Finalized, bytes32(0), "");
    }

    /// @notice Signal a solver slash
    /// @param receiptId Receipt that caused the slash
    /// @param solverId Solver who was slashed
    /// @param amount Amount slashed (encoded in metadata)
    function signalSlashed(bytes32 receiptId, bytes32 solverId, uint256 amount) external onlyAuthorizedHub {
        _emitSignal(receiptId, solverId, ValidationOutcome.Slashed, bytes32(0), abi.encode(amount));
    }

    /// @notice Signal dispute won by solver
    /// @param receiptId Receipt under dispute
    /// @param solverId Solver who won
    function signalDisputeWon(bytes32 receiptId, bytes32 solverId) external onlyAuthorizedHub {
        _emitSignal(receiptId, solverId, ValidationOutcome.DisputeWon, bytes32(0), "");
    }

    /// @notice Signal dispute lost by solver
    /// @param receiptId Receipt under dispute
    /// @param solverId Solver who lost
    /// @param slashAmount Amount slashed
    function signalDisputeLost(bytes32 receiptId, bytes32 solverId, uint256 slashAmount) external onlyAuthorizedHub {
        _emitSignal(receiptId, solverId, ValidationOutcome.DisputeLost, bytes32(0), abi.encode(slashAmount));
    }

    /// @notice Signal with full parameters
    /// @param receiptId Task/receipt identifier
    /// @param solverId Agent/solver identifier
    /// @param outcome Validation outcome
    /// @param evidenceHash Hash of evidence
    /// @param metadata Additional context
    function signalValidation(
        bytes32 receiptId,
        bytes32 solverId,
        ValidationOutcome outcome,
        bytes32 evidenceHash,
        bytes calldata metadata
    ) external onlyAuthorizedHub {
        _emitSignal(receiptId, solverId, outcome, evidenceHash, metadata);
    }

    // ============ Internal Functions ============

    /// @notice Internal signal emission
    function _emitSignal(
        bytes32 taskId,
        bytes32 agentId,
        ValidationOutcome outcome,
        bytes32 evidenceHash,
        bytes memory metadata
    ) internal {
        uint256 timestamp = block.timestamp;

        // Emit the validation signal event
        emit ValidationSignalEmitted(taskId, agentId, outcome, timestamp);

        // Try to record to registry (non-reverting)
        if (address(registry) != address(0)) {
            bool success = outcome == ValidationOutcome.Finalized || outcome == ValidationOutcome.DisputeWon;

            // Use low-level call to prevent registry failures from reverting
            try registry.recordValidation(taskId, agentId, success) {
                emit ValidationRecorded(taskId, agentId, address(registry));
            } catch {
                // Registry call failed - emit but don't revert
                // This ensures IRSB core operations are never blocked by registry issues
            }
        }

        // Update counters
        totalSignals++;
        signalsByOutcome[outcome]++;
    }

    // ============ IERC8004 Implementation ============

    /// @inheritdoc IERC8004
    function emitValidationSignal(ValidationSignal calldata signal) external onlyAuthorizedHub {
        _emitSignal(signal.taskId, signal.agentId, signal.outcome, signal.evidenceHash, signal.metadata);
    }

    /// @inheritdoc IERC8004
    function getProviderInfo() external view returns (string memory name, string memory version, uint256 chainId) {
        return (PROVIDER_NAME, PROVIDER_VERSION, block.chainid);
    }

    /// @inheritdoc IERC8004
    function supportsERC8004() external pure returns (bool supported) {
        return true;
    }

    // ============ View Functions ============

    /// @notice Get statistics for an outcome type
    /// @param outcome Outcome to query
    /// @return count Number of signals with this outcome
    function getOutcomeCount(ValidationOutcome outcome) external view returns (uint256 count) {
        return signalsByOutcome[outcome];
    }

    /// @notice Get all outcome statistics
    /// @return finalized Count of finalized signals
    /// @return slashed Count of slashed signals
    /// @return disputeWon Count of dispute won signals
    /// @return disputeLost Count of dispute lost signals
    function getAllOutcomeStats()
        external
        view
        returns (uint256 finalized, uint256 slashed, uint256 disputeWon, uint256 disputeLost)
    {
        return (
            signalsByOutcome[ValidationOutcome.Finalized],
            signalsByOutcome[ValidationOutcome.Slashed],
            signalsByOutcome[ValidationOutcome.DisputeWon],
            signalsByOutcome[ValidationOutcome.DisputeLost]
        );
    }

    /// @notice Check if hub is authorized
    /// @param hub Address to check
    /// @return authorized Whether hub can emit signals
    function isAuthorizedHub(address hub) external view returns (bool authorized) {
        return authorizedHubs[hub];
    }

    // ============ Admin Functions ============

    /// @notice Set hub authorization
    /// @param hub Hub address
    /// @param authorized Whether to authorize
    function setAuthorizedHub(address hub, bool authorized) external onlyOwner {
        if (hub == address(0)) revert InvalidHubAddress();
        authorizedHubs[hub] = authorized;
        emit HubAuthorizationChanged(hub, authorized);
    }

    /// @notice Set validation registry
    /// @param _registry New registry address (can be zero to disable)
    function setRegistry(address _registry) external onlyOwner {
        address oldRegistry = address(registry);
        registry = IValidationRegistry(_registry);
        emit RegistryUpdated(oldRegistry, _registry);
    }
}
