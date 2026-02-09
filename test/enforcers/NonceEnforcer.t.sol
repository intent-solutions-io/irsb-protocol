// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Test } from "forge-std/Test.sol";
import { NonceEnforcer } from "../../src/enforcers/NonceEnforcer.sol";

/// @title NonceEnforcer Tests
/// @notice Unit tests for nonce-based replay prevention
contract NonceEnforcerTest is Test {
    NonceEnforcer public enforcer;

    address public delegator = address(0x1);
    address public target = address(0x2);
    bytes32 public constant DELEGATION_HASH = keccak256("delegation1");
    bytes32 public constant DELEGATION_HASH_2 = keccak256("delegation2");

    event NonceUsed(bytes32 indexed delegationHash, uint256 nonce);

    function setUp() public {
        enforcer = new NonceEnforcer();
    }

    // ============ Happy Path ============

    function test_BeforeHook_IncrementsNonce() public {
        bytes memory terms = abi.encode(uint256(0));

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
        assertEq(enforcer.getNonce(DELEGATION_HASH), 1);

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
        assertEq(enforcer.getNonce(DELEGATION_HASH), 2);

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
        assertEq(enforcer.getNonce(DELEGATION_HASH), 3);
    }

    function test_BeforeHook_CustomStartNonce() public {
        bytes memory terms = abi.encode(uint256(100));

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
        assertEq(enforcer.getNonce(DELEGATION_HASH), 101);
    }

    function test_BeforeHook_IsolatedPerDelegation() public {
        bytes memory terms = abi.encode(uint256(0));

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);

        enforcer.beforeHook(terms, DELEGATION_HASH_2, delegator, target, "", 0);

        assertEq(enforcer.getNonce(DELEGATION_HASH), 2);
        assertEq(enforcer.getNonce(DELEGATION_HASH_2), 1);
    }

    // ============ Event Tests ============

    function test_BeforeHook_EmitsNonceUsed() public {
        bytes memory terms = abi.encode(uint256(0));

        vm.expectEmit(true, false, false, true);
        emit NonceUsed(DELEGATION_HASH, 0);

        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
    }

    function test_BeforeHook_EmitsSequentialNonces() public {
        bytes memory terms = abi.encode(uint256(0));

        vm.expectEmit(true, false, false, true);
        emit NonceUsed(DELEGATION_HASH, 0);
        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);

        vm.expectEmit(true, false, false, true);
        emit NonceUsed(DELEGATION_HASH, 1);
        enforcer.beforeHook(terms, DELEGATION_HASH, delegator, target, "", 0);
    }

    // ============ View Tests ============

    function test_GetNonce_ReturnsZeroInitially() public view {
        assertEq(enforcer.getNonce(DELEGATION_HASH), 0);
    }

    // ============ AfterHook ============

    function test_AfterHook_NoOp() public {
        enforcer.afterHook("", DELEGATION_HASH, delegator, target, "", 0);
    }
}
