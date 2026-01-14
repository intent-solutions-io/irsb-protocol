# IRSB Protocol

**Intent Receipts & Solver Bonds** - An accountability layer for intent-based transactions.

## Overview

IRSB provides a standardized framework for solver accountability in the intent-based transaction ecosystem. It enables:

- **Solver Registration & Bonding** - Solvers stake ETH as collateral
- **Receipt Posting** - Cryptographically signed proof of intent execution
- **Deterministic Disputes** - On-chain verification of solver violations
- **Reputation Tracking** - IntentScore metrics for solver performance

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      IRSB Protocol                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│ SolverRegistry  │ IntentReceiptHub│    DisputeModule        │
│                 │                 │                         │
│ • Registration  │ • Post Receipts │ • Arbitration           │
│ • Bond Mgmt     │ • Open Disputes │ • Complex Disputes      │
│ • Slashing      │ • Finalization  │ • Evidence Review       │
│ • Jail/Ban      │ • Settlement    │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Contracts

| Contract | Description |
|----------|-------------|
| `SolverRegistry` | Solver registration, bonding, slashing, jail/ban lifecycle |
| `IntentReceiptHub` | Receipt posting, disputes, finalization, settlement proofs |
| `DisputeModule` | Arbitration interface for complex (non-deterministic) disputes |
| `Types.sol` | Shared data structures and constants |

## Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Build

```bash
forge build
```

### Test

```bash
forge test -vv
```

### Deploy (Local)

```bash
# Start local node
anvil &

# Deploy
forge script script/Deploy.s.sol:DeployLocal --fork-url http://localhost:8545 --broadcast
```

### Deploy (Sepolia)

```bash
# Set environment variables
cp .env.example .env
# Edit .env with PRIVATE_KEY and SEPOLIA_RPC_URL

# Deploy
source .env
forge script script/Deploy.s.sol:DeploySepolia --rpc-url $SEPOLIA_RPC_URL --broadcast -vvvv
```

## Key Features

### Solver Lifecycle

```
Inactive → Active → Jailed → Banned
    ↑         │         │
    └─────────┴─────────┘ (can recover with bond)
```

### Receipt Flow

```
1. Solver executes intent off-chain
2. Solver posts signed receipt on-chain
3. Challenge window opens (1 hour default)
4. If disputed → Deterministic resolution or arbitration
5. If no dispute → Receipt finalized, reputation updated
```

### Dispute Reasons

| Code | Reason | Resolution |
|------|--------|------------|
| `0x01` | Timeout | Deterministic (on-chain) |
| `0x02` | MinOutViolation | Requires evidence |
| `0x03` | WrongToken | Requires evidence |
| `0x04` | WrongChain | Requires evidence |
| `0x05` | WrongRecipient | Requires evidence |
| `0x07` | InvalidSignature | Deterministic (on-chain) |

## Configuration

### Constants

| Parameter | Value | Description |
|-----------|-------|-------------|
| `MINIMUM_BOND` | 0.1 ETH | Min stake to activate solver |
| `CHALLENGE_WINDOW` | 1 hour | Time to dispute a receipt |
| `WITHDRAWAL_COOLDOWN` | 7 days | Delay before withdrawing bond |
| `MAX_JAILS` | 3 | Jails before permanent ban |

## Development

### Project Structure

```
├── src/
│   ├── interfaces/      # Contract interfaces
│   ├── libraries/       # Shared types and utilities
│   ├── SolverRegistry.sol
│   ├── IntentReceiptHub.sol
│   └── DisputeModule.sol
├── test/                # Foundry tests
├── script/              # Deployment scripts
└── foundry.toml         # Foundry configuration
```

### Running Tests

```bash
# All tests
forge test

# Verbose output
forge test -vvvv

# Specific test
forge test --match-test test_RegisterSolver

# Gas report
forge test --gas-report
```

## License

MIT

## Links

- [ERC-7683 Standard](https://eips.ethereum.org/EIPS/eip-7683) - Cross-chain intents
- [Foundry Book](https://book.getfoundry.sh/) - Development framework
