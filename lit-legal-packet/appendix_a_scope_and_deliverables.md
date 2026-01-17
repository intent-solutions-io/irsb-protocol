# APPENDIX A: SCOPE AND DELIVERABLES

**Agreement No.:** LIT-2026-001
**Version:** 7.3
**Date:** January 16, 2026

*This Appendix is incorporated into and forms part of the Services Agreement between Intent Solutions and Lit Protocol dated January 16, 2026.*

---

## A.1 PROJECT OBJECTIVE

Provider will develop and deliver twenty-four (24) production AI skills for Claude Code that:

1. Provide **guided workflows** for common Lit Protocol tasks
2. Enable **code generation** from natural language requests
3. Include **templates compliant with Lit Protocol SDK v6+ documentation**
4. Deliver **error handling guidance** per Lit Protocol troubleshooting documentation

**Deliverable Standard:** Each Skill is a complete, tested, documented package conforming to the Skill Deliverable Standard in Exhibit A.1.

---

## A.2 PHASE 1: FOUNDATION (P0) — 6 SKILLS

**Description:** Core Lit Protocol functionality for immediate developer productivity.

**Duration:** 4 weeks (Weeks 1-4)

**Priority:** P0

### Deliverables

| # | Skill Name | Description | Acceptance Criteria |
|---|------------|-------------|---------------------|
| 1 | PKP Wallet Setup | Create and configure Programmable Key Pairs | Skill generates working PKP wallet configuration code |
| 2 | Lit Action Builder | Build and deploy Lit Actions | Skill generates valid Lit Action code deployable to network |
| 3 | Session Signature Manager | Manage session keys and expiration | Skill generates session management code with configurable expiration |
| 4 | Auth Method Configuration | Configure OAuth, Passkeys, custom auth | Skill generates authentication configuration for specified methods |
| 5 | Access Control Conditions | Define encryption/decryption conditions | Skill generates valid access control condition objects |
| 6 | Encrypt/Decrypt Workflows | End-to-end encryption patterns | Skill generates complete encrypt/decrypt workflow code |

### Phase 1 Acceptance Checklist

- [ ] All 6 skills delivered to designated repository
- [ ] Each skill conforms to Skill Deliverable Standard (Exhibit A.1)
- [ ] Each skill includes Evidence Bundle
- [ ] All acceptance criteria satisfied
- [ ] Documentation complete and accurate

---

## A.3 PHASE 2: POWER FEATURES (P1) — 11 SKILLS

**Description:** Advanced capabilities for serious Lit Protocol integrations.

**Duration:** 6 weeks (Weeks 5-10)

**Priority:** P1

### Deliverables

| # | Skill Name | Description | Acceptance Criteria |
|---|------------|-------------|---------------------|
| 7 | Cross-Chain Signing | Unified signing across EVM and non-EVM | Skill generates cross-chain signing code for specified chains |
| 8 | Bridge Orchestration | Orchestrate cross-chain transfers | Skill generates bridge workflow code with status tracking |
| 9 | Multi-Chain Wallet Manager | Manage PKP wallets across chains | Skill generates multi-chain wallet management code |
| 10 | PKP DEX Aggregator* | Optimal swaps with MEV protection patterns | Skill generates DEX interaction code with MEV mitigation |
| 11 | Yield Optimizer | Automated yield farming patterns | Skill generates yield optimization strategy code |
| 12 | Decentralized Limit Orders | Condition-based order execution | Skill generates limit order execution code |
| 13 | MEV Protection* | Flashbots integration patterns | Skill generates MEV protection patterns and configurations |
| 14 | Lit Action Security Auditor* | Security review patterns and checklists | Skill generates security audit checklists and review patterns |
| 15 | Local Dev Environment | Local testing and simulation | Skill generates local development environment configuration |
| 16 | Chronicle Manager | Capacity Credits management | Skill generates Chronicle capacity credit management code |
| 17 | TypeScript SDK Helper | Type-safe code generation | Skill generates TypeScript code with proper type annotations |

*Skills marked with * have security scope limitations. See Appendix E.*

### Phase 2 Acceptance Checklist

- [ ] All 11 skills delivered to designated repository
- [ ] Each skill conforms to Skill Deliverable Standard (Exhibit A.1)
- [ ] Each skill includes Evidence Bundle
- [ ] All acceptance criteria satisfied
- [ ] Documentation complete and accurate
- [ ] Security disclaimers included for marked skills

---

## A.4 PHASE 3: ADVANCED (P2) — 7 SKILLS

**Description:** Specialized capabilities for advanced use cases.

**Duration:** 4 weeks (Weeks 11-14)

**Priority:** P2

### Deliverables

| # | Skill Name | Description | Acceptance Criteria |
|---|------------|-------------|---------------------|
| 18 | Token Gated Access | NFT/token holder verification | Skill generates token gating verification code |
| 19 | Private Transaction Builder* | Private mempool submission patterns | Skill generates private transaction submission code |
| 20 | PKP Usage Analytics | Usage tracking and reporting | Skill generates analytics tracking code and dashboards |
| 21 | Network Health Monitor | Lit network status monitoring | Skill generates network health monitoring code |
| 22 | Key Rotation Strategies | PKP key rotation and migration | Skill generates key rotation workflow code |
| 23 | Lit Action Debugger | Debugging and profiling | Skill generates debugging utilities and profiling code |
| 24 | Python SDK Helper | Python code generation | Skill generates Python SDK code with proper patterns |

*Skills marked with * have security scope limitations. See Appendix E.*

### Phase 3 Acceptance Checklist

- [ ] All 7 skills delivered to designated repository
- [ ] Each skill conforms to Skill Deliverable Standard (Exhibit A.1)
- [ ] Each skill includes Evidence Bundle
- [ ] All acceptance criteria satisfied
- [ ] Documentation complete and accurate
- [ ] Security disclaimers included for marked skills

---

## A.5 OUT OF SCOPE

The following are expressly **excluded** from this engagement:

| Item | Rationale |
|------|-----------|
| Custom integrations beyond skill scope | Requires separate SOW |
| API development or backend services | Not part of skill development |
| Infrastructure provisioning or management | Client responsibility |
| Production support | Available via maintenance agreement (Appendix F) |
| Security audits or penetration testing | Skills provide patterns only; professional audit recommended |
| Guaranteed security outcomes | Skills are developer tools, not security products (Appendix E) |

---

## A.6 TECHNOLOGIES

The Deliverables will utilize:

- Claude Code Skills (Intent Solutions Enterprise Standard)
- Lit Protocol TypeScript SDK (v6 or later)
- Lit Actions
- PKP Wallets
- Session Signatures
- Chronicle (Capacity Credits)

---

## A.7 DELIVERY LOCATION

All Deliverables shall be delivered to:

**Repository:** [To be designated by Client]

**Structure:** Each skill in its own directory following the Skill Deliverable Standard (Exhibit A.1)

**Evidence:** Evidence Bundles in `/evidence` directory per phase

---

## A.8 QUALITY STANDARDS

All Deliverables will be verified against the following before submission:

### Code Quality
- [ ] Code follows Claude Code skill guidelines
- [ ] No critical linting errors
- [ ] Unit tests pass (where applicable)
- [ ] Documentation complete

### Documentation Quality
- [ ] SKILL.md present and accurate
- [ ] At least 2 usage examples included
- [ ] Setup instructions provided
- [ ] Expected failure modes documented

### General Quality
- [ ] Meets functional requirements as specified
- [ ] Performs within expected parameters
- [ ] Compatible with Supported Environment
- [ ] Free of critical Defects

---

*End of Appendix A*

*Agreement No. LIT-2026-001 | Version 7.3*
