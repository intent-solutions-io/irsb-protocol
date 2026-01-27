# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IRSB (Intent Receipts & Solver Bonds)** - An Ethereum protocol providing accountability for intent-based transactions. Complements ERC-7683 cross-chain intents with:
- **Intent Receipts**: On-chain records proving solver execution
- **Solver Bonds**: Staked collateral slashable for violations
- **Deterministic Enforcement**: Automated slashing for timeout, constraint violation, receipt forgery

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│ SolverRegistry  │◄────────► IntentReceiptHub │
├─────────────────┤         ├──────────────────┤
│ • Registration  │         │ • Receipt post   │
│ • Bond mgmt     │         │ • Disputes       │
│ • Slashing      │         │ • Finalization   │
│ • Reputation    │         │ • Settlement     │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │                  ┌────────▼─────────┐
         │                  │  DisputeModule   │
         │                  ├──────────────────┤
         │                  │ • Evidence       │
         │                  │ • Escalation     │
         │                  │ • Arbitration    │
         │                  └──────────────────┘
         │
┌────────▼─────────┐
│  AcrossAdapter   │
├──────────────────┤
│ • Across→IRSB    │
│ • Receipt prep   │
│ • Fill validation│
└──────────────────┘
```

**Authorization Model:**
- SolverRegistry grants `authorizedCaller` to IntentReceiptHub and DisputeModule
- Only authorized callers can slash/lock bonds
- DisputeModule has separate `arbitrator` role for resolutions

**Contract Interaction Flow:**
1. Solver registers via `SolverRegistry.registerSolver()` → deposits bond → becomes Active
2. Solver posts signed receipts via `IntentReceiptHub.postReceipt()`
3. Anyone can challenge within `CHALLENGE_WINDOW` via `openDispute()` (requires bond)
4. Disputes resolve via `resolveDeterministic()` or escalate to `DisputeModule`
5. Receipts finalize after challenge window via `finalize()`

## Build Commands

```bash
forge build                                    # Build (via_ir enabled, optimizer 200 runs)
forge test                                     # All tests
forge test --match-path test/SolverRegistry.t.sol  # Single file
forge test --match-test testDepositBond        # Single test
forge test -vvv                                # Verbose stack traces
forge test -vvvv                               # Full trace including calls
forge test --gas-report                        # Gas analysis
forge fmt                                      # Format (120 char line length)
forge doc                                      # Generate docs to docs/
```

**CI Profile** (more thorough): `FOUNDRY_PROFILE=ci forge test` runs 1000 fuzz iterations

## Environment Setup

Copy `.env.example` to `.env` and set:
- `PRIVATE_KEY` - Deployer key
- `SEPOLIA_RPC_URL` - Sepolia endpoint
- `ETHERSCAN_API_KEY` - For verification

## Deployment

```bash
# Local (anvil)
anvil &
forge script script/Deploy.s.sol:DeployLocal --fork-url http://localhost:8545 --broadcast

# Sepolia
source .env
forge script script/Deploy.s.sol:DeploySepolia --rpc-url $SEPOLIA_RPC_URL --broadcast -vvvv
```

**Deploy order:** SolverRegistry → IntentReceiptHub → DisputeModule → call `setAuthorizedCaller()` on registry

## Key Constants

| Parameter | Value | Purpose |
|-----------|-------|---------|
| MINIMUM_BOND | 0.1 ETH | Solver activation threshold |
| WITHDRAWAL_COOLDOWN | 7 days | Bond withdrawal delay |
| MAX_JAILS | 3 | Jails before permanent ban |
| CHALLENGE_WINDOW | 1 hour | Time to dispute receipt |
| CHALLENGER_BOND_BPS | 1000 (10%) | Anti-griefing bond |
| EVIDENCE_WINDOW | 24 hours | Evidence submission period |
| ARBITRATION_TIMEOUT | 7 days | Default resolution deadline |
| DECAY_HALF_LIFE | 30 days | Reputation decay rate |

## Slashing Distribution

| Recipient | Standard Slash | Arbitration |
|-----------|---------------|-------------|
| User | 80% | 70% |
| Challenger | 15% | - |
| Treasury | 5% | 20% |
| Arbitrator | - | 10% |

## Testing Conventions

- Test files: `test/<ContractName>.t.sol`
- Use `setUp()` for fixture initialization
- `vm.prank(address)` for caller impersonation
- `vm.expectRevert()` for error assertions
- `vm.warp()` for time-dependent tests (disputes, cooldowns)
- `vm.deal()` for ETH balances
- `vm.expectEmit()` for event verification

**Common test patterns:**
```solidity
// Expect custom error
vm.expectRevert(abi.encodeWithSignature("SolverNotActive()"));

// Fast-forward past challenge window
vm.warp(block.timestamp + 1 hours + 1);

// Deposit bond as operator
vm.deal(operator, 1 ether);
vm.prank(operator);
registry.depositBond{value: 0.1 ether}(solverId);
```

## Signature Verification

Receipts use Ethereum personal_sign:
```solidity
bytes32 messageHash = keccak256(abi.encode(...));
bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
address signer = ethSignedHash.recover(receipt.solverSig);
```

## File Structure

```
src/
├── SolverRegistry.sol       # Solver lifecycle and bonding
├── IntentReceiptHub.sol     # Receipt posting and disputes
├── DisputeModule.sol        # Arbitration for subjective disputes
├── adapters/
│   └── AcrossAdapter.sol    # Across Protocol integration
├── interfaces/              # Contract interfaces (ISolverRegistry, etc.)
└── libraries/
    ├── Types.sol            # Shared structs, enums, constants
    └── Events.sol           # Shared events
```

## Project References

- [ERC-7683 Cross Chain Intents](https://eips.ethereum.org/EIPS/eip-7683)
- Protocol spec: `000-docs/001-RL-PROP-irsb-solver-accountability.md`
- PRD: `000-docs/002-PP-PROD-irsb-prd.md`
- EIP spec: `000-docs/003-AT-SPEC-irsb-eip-spec.md`
- Receipt schema: `000-docs/007-AT-SPEC-irsb-receipt-schema.md`
