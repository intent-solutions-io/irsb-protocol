# IRSB Protocol

**The accountability layer for intent-based transactions.**

> Intents need receipts. Solvers need skin in the game.

---

## The Problem

[ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) standardizes how users express cross-chain intents. But it doesn't answer:

**"What happens when the solver fails?"**

Today: Nothing. Users lose money. Solvers face no consequences. Trust is informal.

## The Solution

IRSB (Intent Receipts & Solver Bonds) adds the missing accountability layer:

| Component | What It Does |
|-----------|--------------|
| **Receipts** | On-chain proof that a solver executed an intent |
| **Bonds** | Staked collateral that can be slashed for violations |
| **Disputes** | Automated enforcement for timeouts, wrong outputs, fraud |
| **Reputation** | Portable trust scores that follow solvers across protocols |

```mermaid
flowchart LR
    A[User Intent] --> B[Solver Executes]
    B --> C[Posts Receipt]
    C --> D{Challenge Window}
    D -->|No Dispute| E[✓ Finalized]
    D -->|Disputed| F[Evidence Review]
    F -->|Solver Fault| G[Slash Bond → Compensate User]
    F -->|No Fault| E
```

## Why IRSB?

- **ERC-7683 compatible** - Works with the emerging intent standard
- **Protocol-agnostic** - One accountability layer for all intent systems
- **Economically enforced** - Bonds ensure solvers have skin in the game
- **Portable reputation** - Solver track records move across protocols

## How IRSB Connects to Other Standards

```mermaid
flowchart TB
    subgraph Standards
        ERC7683[ERC-7683<br/>Intent Format]
        ERC8004[ERC-8004<br/>Agent Registry]
        X402[x402<br/>HTTP Payments]
    end

    subgraph IRSB[IRSB Protocol]
        Core[Receipts + Bonds + Disputes]
    end

    ERC7683 -->|"intentHash"| Core
    Core -->|"validation signals"| ERC8004
    X402 -->|"payment proof"| Core
    Core -->|"service accountability"| X402

    style IRSB fill:#1a1a2e,stroke:#16213e
    style Core fill:#0f3460,stroke:#e94560,color:#fff
```

| Standard | What It Does | How IRSB Connects |
|----------|--------------|-------------------|
| **ERC-7683** | Defines intent format | IRSB receipts reference `intentHash` from ERC-7683 orders |
| **ERC-8004** | Agent identity & reputation registry | IRSB is a **Validation Provider** - generates signals that feed the registry |
| **x402** | HTTP 402 payment protocol | IRSB adds accountability to paid APIs - receipts prove service delivery |

### IRSB + ERC-8004: The Scoreboard & The Referee

ERC-8004 is the **scoreboard** - it stores agent identities and reputation scores.

IRSB is the **referee** - it generates the validation signals that update those scores.

```
Agent executes intent
    → IRSB receipt posted
    → Challenge window passes
    → finalize() called
    → ERC8004Adapter.signalFinalized()
    → Agent reputation updated in ERC-8004 registry
```

### IRSB + x402: Accountability for Paid APIs

When AI agents pay for services via x402, IRSB ensures accountability:

```
Client sends x402 payment → Service executes → IRSB receipt posted
                                                    ↓
                                            Dispute? → Slash bond
                                            No dispute? → Reputation++
```

The `@irsb/x402-integration` package handles this flow.

## Quick Start

```bash
# Install
forge install

# Build
forge build

# Test (308 tests)
forge test
```

## Deployments

### Sepolia Testnet

| Contract | Address |
|----------|---------|
| SolverRegistry | `0xB6ab964832808E49635fF82D1996D6a888ecB745` |
| IntentReceiptHub | `0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c` |
| DisputeModule | `0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D` |

## Architecture

```mermaid
flowchart TB
    subgraph IRSB Protocol
        SR[SolverRegistry]
        IRH[IntentReceiptHub]
        DM[DisputeModule]
    end

    SR <--> IRH
    IRH <--> DM

    SR --- SR1[Registration]
    SR --- SR2[Bond Staking]
    SR --- SR3[Slashing]
    SR --- SR4[Reputation]

    IRH --- IRH1[Post Receipts]
    IRH --- IRH2[Open Disputes]
    IRH --- IRH3[Finalization]

    DM --- DM1[Evidence]
    DM --- DM2[Escalation]
    DM --- DM3[Arbitration]
```

## Solver Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Inactive: Register
    Inactive --> Active: Deposit Bond ≥ 0.1 ETH
    Active --> Jailed: Violation
    Jailed --> Active: Wait + Deposit
    Jailed --> Banned: 3rd Jail
    Active --> Inactive: Withdraw Bond
    Banned --> [*]
```

## Receipt Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Solver
    participant H as IntentReceiptHub
    participant R as SolverRegistry

    U->>S: Submit Intent
    S->>S: Execute Off-chain
    S->>H: postReceipt(receipt)
    H->>H: Validate Signature
    H-->>U: Challenge Window (1 hr)

    alt No Dispute
        H->>H: finalize()
        H->>R: updateScore(success)
    else Disputed
        U->>H: openDispute(evidence)
        H->>R: slash(solver, amount)
        R-->>U: Compensation
    end
```

## Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Minimum Bond | 0.1 ETH | Solver activation threshold |
| Challenge Window | 1 hour | Time to dispute a receipt |
| Withdrawal Cooldown | 7 days | Delay before withdrawing bond |
| Max Jails | 3 | Strikes before permanent ban |

## Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG](./CHANGELOG.md) | Release history |
| [000-docs/](./000-docs/) | Architecture decisions, specs, guides |
| [x402 Integration](./000-docs/016-AT-INTG-x402-integration.md) | HTTP 402 payment integration |
| [Privacy Design](./000-docs/014-AT-DSGN-privacy-design.md) | On-chain vs off-chain data model |

## Packages

| Package | Description |
|---------|-------------|
| `packages/x402-irsb` | x402 HTTP payment integration |
| `examples/x402-express-service` | Express example with 402 flow |

## Development

```bash
# Run all tests
forge test

# Run specific test file
forge test --match-path test/SolverRegistry.t.sol -vvv

# Gas report
forge test --gas-report

# Coverage report
forge coverage --report summary --ir-minimum

# Deploy locally
anvil &
forge script script/Deploy.s.sol:DeployLocal --fork-url http://localhost:8545 --broadcast
```

### Security Testing

```bash
# Run with CI-equivalent fuzz iterations (10,000 runs)
FOUNDRY_PROFILE=ci forge test

# Or set fuzz runs directly
FOUNDRY_FUZZ_RUNS=10000 forge test

# Run invariant tests
forge test --match-path "test/invariants/*.sol"

# Static analysis with Slither
slither . --config-file slither.config.json

# Full security check
./scripts/security.sh
```

## Contributing

IRSB aims to be the standard accountability layer for intents. Contributions welcome:

1. Open an issue to discuss changes
2. Fork and create a feature branch
3. Submit a PR with tests

## License

MIT - See [LICENSE](./LICENSE)

---

**IRSB v1.1.0** | [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) | [Foundry](https://book.getfoundry.sh/)
