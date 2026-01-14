# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IRSB (Intent Receipts & Solver Bonds)** - An Ethereum protocol providing accountability for intent-based transactions. Complements ERC-7683 cross-chain intents with:
- **Intent Receipts**: On-chain records proving solver execution
- **Solver Bonds**: Staked collateral slashable for violations
- **Deterministic Enforcement**: Automated slashing for timeout, constraint violation, receipt forgery

## Architecture

Three core contracts:
1. **SolverRegistry** - Solver registration, bond management, status tracking (Active/Jailed/Banned)
2. **IntentReceiptHub** - Receipt posting, dispute windows, deterministic slashing triggers
3. **DisputeModule** - Pluggable arbitration interface (v0.2)

Key data structures defined in `000-docs/002-PP-PROD-irsb-prd.md`:
- `IntentReceipt` struct with intentHash, constraintsHash, routeHash, outcomeHash, evidenceHash
- `Solver` struct with operator, bonds, status, IntentScore

## Build Commands (Foundry)

```bash
# Build contracts
forge build

# Run all tests
forge test

# Run single test file
forge test --match-path test/SolverRegistry.t.sol

# Run single test function
forge test --match-test testDepositBond

# Test with verbosity (show traces on failure)
forge test -vvv

# Gas report
forge test --gas-report

# Coverage
forge coverage

# Deploy to testnet (requires .env with RPC_URL and PRIVATE_KEY)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast

# Format
forge fmt

# Static analysis
slither .
```

## Testing Conventions

- Test files: `test/<ContractName>.t.sol`
- Inherit from `forge-std/Test.sol`
- Use `setUp()` for test fixture initialization
- Prefix test functions with `test` (passing) or `testFail` (expected revert)
- Use `vm.prank(address)` for caller impersonation
- Use `vm.expectRevert()` for revert assertions

## Contract Patterns

This project should follow:
- OpenZeppelin contracts for standard patterns (Ownable, Pausable, ReentrancyGuard)
- EIP-712 typed data signing for receipt signatures
- Events for all state changes (indexing by The Graph)
- Checks-Effects-Interactions pattern to prevent reentrancy

## Project References

- [ERC-7683 Cross Chain Intents](https://eips.ethereum.org/EIPS/eip-7683) - Intent standard this protocol extends
- Protocol spec: `000-docs/001-RL-PROP-irsb-solver-accountability.md`
- PRD with detailed requirements: `000-docs/002-PP-PROD-irsb-prd.md`
