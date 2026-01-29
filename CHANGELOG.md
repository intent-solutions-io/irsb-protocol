# Changelog

All notable changes to IRSB Protocol are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Community health files (CONTRIBUTING, SECURITY, SUPPORT, GOVERNANCE)
- Issue templates (bug, feature, question, security)
- GitHub Discussions setup guide

---

## [1.0.0] - 2026-01-28

First production release on Sepolia testnet.

### Added

#### Security Audit (PRs #13-16)
- Security fixes for IRSB-SEC-001, 002, 003, 005
- Invariant tests (11 tests, 256 runs, 128k calls each)
- Slither gates in CI (blocking on high/critical)
- Security operations guide

#### Core Protocol (Phases 0-3)
- **SolverRegistry**: Registration, bonding, slashing, jail/ban system
- **IntentReceiptHub**: Receipt posting, disputes, finalization
- **DisputeModule**: Arbitration, evidence submission, timeout resolution
- **ReceiptV2Extension**: Dual attestation with EIP-712 signatures
- **EscrowVault**: Native ETH and ERC20 escrow
- **OptimisticDisputeModule**: Counter-bond mechanism

#### Privacy & Integration (Phases 4-5)
- Privacy SDK with commitment generation
- ERC-8004 validation provider adapter
- V2 Receipt Types: PrivacyLevel enum (PUBLIC, SEMI_PUBLIC, PRIVATE)

#### Multi-Chain Support (Phase 6)
- Polygon Amoy deployment configuration
- Multi-chain SDK with network switching

#### Operations (Phase 7)
- Fuzz test suites (10,000 runs in CI)
- INCIDENT_PLAYBOOK.md, MONITORING.md, MULTISIG_PLAN.md

#### x402 Integration (Phase 8)
- `@irsb/x402-integration` package
- Express example for HTTP 402 payments
- EIP-712 signing helpers

### Deployments

**Sepolia Testnet:**
- SolverRegistry: `0xB6ab964832808E49635fF82D1996D6a888ecB745`
- IntentReceiptHub: `0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c`
- DisputeModule: `0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D`

### Technical
- Solidity ^0.8.25, Foundry, 325 tests passing
- Optimizer: 200 runs, via-ir enabled

---

## [0.9.0] - 2026-01-25

Dashboard and subgraph release.

### Added
- Solver reputation dashboard (Next.js + Firebase)
- The Graph subgraph for indexing
- TypeScript SDK (`@intentsolutionsio/irsb-sdk`)
- Across Protocol pilot adapter
- Firebase deployment with Workload Identity Federation

### Fixed
- Subgraph query types
- Dashboard mobile navigation
- SSRF vulnerability

### Documentation
- 25,000+ word feasibility report
- Auditor outreach templates

---

## [0.5.0] - 2026-01-16

Dispute module release.

### Added
- `DisputeModule` with deterministic resolution
- Timeout-based disputes
- Challenger bond mechanism
- Reputation decay for inactive solvers

---

## [0.1.0] - 2026-01-14

Initial MVP release.

### Added
- `SolverRegistry`: Registration, bonding, slashing, reputation
- `IntentReceiptHub`: Receipts, disputes, finalization
- Test suite (95 tests)
- Foundry project structure

---

## [0.0.1] - 2026-01-14

Project initialization.

### Added
- Initial documentation
- CLAUDE.md architecture guide

---

[Unreleased]: https://github.com/intent-solutions-io/irsb-protocol/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/intent-solutions-io/irsb-protocol/releases/tag/v1.0.0
[0.9.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.5.0...v0.9.0
[0.5.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.1.0...v0.5.0
[0.1.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/intent-solutions-io/irsb-protocol/commits/v0.0.1
