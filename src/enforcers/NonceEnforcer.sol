// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { ICaveatEnforcer } from "../interfaces/ICaveatEnforcer.sol";

/// @title NonceEnforcer
/// @notice Prevents replay of delegated executions via monotonically increasing nonces
/// @dev Terms: abi.encode(uint256 startNonce)
contract NonceEnforcer is ICaveatEnforcer {
    // ============ State ============

    /// @notice Current nonce per delegation: delegationHash => nonce
    mapping(bytes32 => uint256) public nonces;

    // ============ Events ============

    event NonceUsed(bytes32 indexed delegationHash, uint256 nonce);

    // ============ External Functions ============

    /// @inheritdoc ICaveatEnforcer
    function beforeHook(
        bytes calldata terms,
        bytes32 delegationHash,
        address, /* delegator */
        address, /* target */
        bytes calldata, /* callData */
        uint256 /* value */
    )
        external
        override
    {
        uint256 startNonce = abi.decode(terms, (uint256));

        uint256 currentNonce = nonces[delegationHash];

        // Initialize nonce on first use
        if (currentNonce == 0 && startNonce > 0) {
            currentNonce = startNonce;
        }

        // Increment nonce (must be sequential)
        nonces[delegationHash] = currentNonce + 1;

        emit NonceUsed(delegationHash, currentNonce);
    }

    /// @inheritdoc ICaveatEnforcer
    function afterHook(
        bytes calldata, /* terms */
        bytes32, /* delegationHash */
        address, /* delegator */
        address, /* target */
        bytes calldata, /* callData */
        uint256 /* value */
    )
        external
        pure
        override
    {
        // No post-execution validation needed for nonce tracking
    }

    // ============ View Functions ============

    /// @notice Get the current nonce for a delegation
    /// @param delegationHash The delegation hash
    /// @return nonce Current nonce value
    function getNonce(bytes32 delegationHash) external view returns (uint256) {
        return nonces[delegationHash];
    }
}
