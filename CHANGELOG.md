# Changelog

All notable changes to IRSB Protocol will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-28

### Added

#### Core Protocol (Phases 0-3)
- **SolverRegistry**: Solver registration, bonding, slashing, jail/ban system
- **IntentReceiptHub**: Receipt posting, disputes, finalization, settlement proofs
- **DisputeModule**: Arbitration for complex disputes, evidence submission, timeout resolution
- **ReceiptV2Extension**: Dual attestation with EIP-712 typed signatures
- **EscrowVault**: Native ETH and ERC20 escrow tied to receipt lifecycle
- **OptimisticDisputeModule**: Counter-bond mechanism with timeout-based resolution

#### Privacy & Integration (Phases 4-5)
- **Privacy SDK**: Commitment generation, Lit Protocol integration, ciphertext pointers
- **ERC-8004 Adapter**: Validation provider for external registries
- **V2 Receipt Types**: PrivacyLevel enum (PUBLIC, SEMI_PUBLIC, PRIVATE)

#### Multi-Chain Support (Phase 6)
- Polygon Amoy deployment scripts and configuration
- Multi-chain SDK with network switching
- Dashboard chain selector component
- Subgraph multi-network configuration

#### Operations (Phase 7)
- Comprehensive fuzz test suites (10,000 runs)
- INCIDENT_PLAYBOOK.md for emergency procedures
- MONITORING.md checklist
- MULTISIG_PLAN.md for Gnosis Safe transition
- Security hardening: nonReentrant on withdrawFees()

#### x402 Integration (Phase 8)
- `@irsb/x402-integration` package for HTTP 402 payment flows
- Express example service demonstrating micropayment receipts
- Canonical X402ReceiptPayload schema
- EIP-712 signing helpers for dual attestation

#### Documentation
- ADR (Architecture Decision Record) for vNext scope
- PRIVACY.md explaining on-chain vs off-chain data separation
- VALIDATION_PROVIDER.md for ERC-8004 integration
- DEPLOYMENT.md comprehensive runbook

### Deployments

#### Sepolia Testnet
- SolverRegistry: `0xB6ab964832808E49635fF82D1996D6a888ecB745`
- IntentReceiptHub: `0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c`
- DisputeModule: `0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D`

### Technical Details

- **Solidity**: ^0.8.25
- **Foundry**: Latest
- **Tests**: 308 passing (14 test suites)
- **Optimizer**: 200 runs, via-ir enabled

---

[1.0.0]: https://github.com/intent-solutions-io/irsb-protocol/releases/tag/v1.0.0
