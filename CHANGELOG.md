# Changelog

All notable changes to IRSB Protocol are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [1.2.0] - 2026-02-08

Website ecosystem hub, ERC-8004 agent registration, and SDK/x402 public release.

### Added

#### Website Ecosystem Hub (#23, #24, #25)
- 14 new website pages with grouped navigation and developer docs
- Ecosystem banner showing all 4 IRSB components with status badges
- Comparison page: IRSB vs UniswapX, CoW, 1inch, Across, Ethos, EigenLayer
- Expandable EcosystemCards component on homepage
- Developer quickstart, SDK reference, x402 guide, contract reference

#### ERC-8004 Agent Registration
- Registered IRSB solver on ERC-8004 IdentityRegistry (Agent ID: 967)
- On-chain identity enabling cross-protocol reputation

#### SDK & CLI
- `irsb verify <receipt-id>` CLI command for on-chain receipt verification
- Receipt verification SDK module with V1/V2 support
- npm provenance for all package releases
- `RELEASING.md` release process documentation
- CI guards to prevent publishing under wrong package names

#### x402 HTTP Payments (Epic C, #20)
- Complete x402 integration package (`irsb-x402` v0.1.0)
- 30-minute quickstart guide
- Express example service with x402 payment flow
- Client script for testing

### Changed
- **BREAKING**: SDK package renamed from `@intentsolutionsio/irsb-sdk` to `irsb`
- **BREAKING**: x402 package renamed from `@irsb/x402-integration` to `irsb-x402`
- Old package names deprecated on npm with redirect messages

### Fixed
- Update badges to reflect agent-passkey now live on Cloud Run
- Ecosystem accuracy sweep with honest status badges (#24)
- CI using stable Foundry version instead of nightly
- SDK package-lock.json regenerated for CI

### Documentation
- AI-CONTEXT.md cross-reference added to CLAUDE.md
- Canonical standards synced from irsb-solver (#22)
- ERC-8004 publishing guide
- Adapter integration guide
- Optimistic dispute and counter-bond documentation
- Operational accounts documented in CLAUDE.md
- Epics and tasks roadmap
- LLM briefing document for external brainstorming
- IRSB-SEC-008 marked as accepted risk

### Published
- `irsb` v0.1.0 on npm
- `irsb-x402` v0.1.0 on npm

---

## [1.1.0] - 2026-01-30

ERC-8004 credibility publishing and security hardening release.

### Added

#### ERC-8004 Credibility Publishing (Epic B)
- **ERC8004Adapter v2.0**: Full implementation of ERC-8004 validation signals standard
- **IntentReceiptHub hooks**: Non-reverting signal emission on finalize
- **SolverRegistry hooks**: Non-reverting signal emission on slash
- **Integration test suite**: 6 tests covering full signal flow
- IntentScore algorithm: 40% success + 25% disputes + 20% stake + 15% longevity
- Cross-chain reputation proofs via Merkle trees

#### Security Hardening (PRs #17-19)
- IRSB-SEC-006/010 implementation with economic invariants
- CI hardening with security gates
- Document filing system standard v4.2

### Fixed
- Broken documentation links in README
- Security audit report organization
- Mobile UX improvements in dashboard

### Documentation
- Comprehensive operator-grade system analysis (appaudit)
- 6767 document filing system standard
- Repository housekeeping and community health improvements

### Technical
- 355 tests passing (up from 325)
- 4 economic invariant tests (256 runs, 128k calls each)
- All lint checks passing

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
- `irsb-x402` package
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
- TypeScript SDK (`irsb`)
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

[Unreleased]: https://github.com/intent-solutions-io/irsb-protocol/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/intent-solutions-io/irsb-protocol/releases/tag/v1.0.0
[0.9.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.5.0...v0.9.0
[0.5.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.1.0...v0.5.0
[0.1.0]: https://github.com/intent-solutions-io/irsb-protocol/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/intent-solutions-io/irsb-protocol/commits/v0.0.1
