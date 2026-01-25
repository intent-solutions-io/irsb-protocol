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
└─────────────────┘         └────────┬─────────┘
                                     │
                            ┌────────▼─────────┐
                            │  DisputeModule   │
                            ├──────────────────┤
                            │ • Evidence       │
                            │ • Escalation     │
                            │ • Arbitration    │
                            └──────────────────┘
```

**Authorization Model:**
- SolverRegistry grants `authorizedCaller` to IntentReceiptHub and DisputeModule
- Only authorized callers can slash/lock bonds
- DisputeModule has separate `arbitrator` role for resolutions

## Build Commands

```bash
forge build                                    # Build
forge test                                     # All tests
forge test --match-path test/SolverRegistry.t.sol  # Single file
forge test --match-test testDepositBond        # Single test
forge test -vvv                                # Verbose traces
forge test --gas-report                        # Gas analysis
forge fmt                                      # Format
```

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
- `vm.warp()` for time-dependent tests
- `vm.deal()` for ETH balances

## Signature Verification

Receipts use Ethereum personal_sign:
```solidity
bytes32 messageHash = keccak256(abi.encode(...));
bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
address signer = ethSignedHash.recover(receipt.solverSig);
```

## Project References

- [ERC-7683 Cross Chain Intents](https://eips.ethereum.org/EIPS/eip-7683)
- Protocol spec: `000-docs/001-RL-PROP-irsb-solver-accountability.md`
- PRD: `000-docs/002-PP-PROD-irsb-prd.md`
- EIP spec: `000-docs/003-AT-SPEC-irsb-eip-spec.md`
