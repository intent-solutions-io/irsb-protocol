# IRSB Protocol Security Audit Report v1

**Version:** 1.0.0-draft
**Audit Date:** 2026-01-28
**Auditor:** Security-driven review (automated + manual)
**Status:** Phase 0 - Baseline Complete

---

## Executive Summary

This document tracks the security audit of the IRSB Protocol smart contracts. The audit covers:
- 3 core contracts: SolverRegistry, IntentReceiptHub, DisputeModule
- Supporting contracts: EscrowVault, ReceiptV2Extension, OptimisticDisputeModule
- TypeScript SDK and subgraph integration

**Current Baseline:**
- 308 tests passing
- Deployed on Sepolia testnet
- CI with Slither configured (non-blocking)

---

## 1. Attack Surface Analysis

### 1.1 Contract Entry Points

| Contract | Function | Access | ETH Flow | Description |
|----------|----------|--------|----------|-------------|
| **SolverRegistry** |
| `registerSolver()` | Public | - | Register new solver |
| `depositBond()` | Public | Payable | Deposit bond to solver |
| `initiateWithdrawal()` | onlyOperator | - | Start withdrawal cooldown |
| `withdrawBond()` | onlyOperator | Sends ETH | Withdraw bond after cooldown |
| `setSolverKey()` | onlyOperator | - | Rotate operator key |
| `lockBond()` | onlyAuthorized | - | Lock bond for dispute |
| `unlockBond()` | onlyAuthorized | - | Unlock bond after dispute |
| `slash()` | onlyAuthorized | Sends ETH | Slash solver bond |
| `jailSolver()` | onlyAuthorized | - | Jail solver |
| `unjailSolver()` | onlyOwner | - | Unjail solver |
| `banSolver()` | onlyOwner | - | Permanently ban solver |
| **IntentReceiptHub** |
| `postReceipt()` | whenNotPaused | - | Post new receipt |
| `batchPostReceipts()` | whenNotPaused | - | Batch post receipts |
| `openDispute()` | whenNotPaused | Payable | Open dispute with bond |
| `resolveDeterministic()` | Public | Sends ETH | Resolve deterministic dispute |
| `finalize()` | Public | - | Finalize receipt after window |
| `submitSettlementProof()` | Solver only | - | Submit settlement proof |
| `resolveEscalatedDispute()` | onlyDisputeModule | - | Resolve escalated dispute |
| `sweepForfeitedBonds()` | onlyOwner | Sends ETH | Sweep forfeited bonds |
| **DisputeModule** |
| `submitEvidence()` | Dispute parties | - | Submit dispute evidence |
| `escalate()` | Public | Payable | Escalate to arbitration |
| `resolve()` | onlyArbitrator | - | Arbitrator resolves dispute |
| `resolveByTimeout()` | Public | Sends ETH | Resolve by timeout |
| `withdrawFees()` | onlyOwner | Sends ETH | Withdraw forfeited fees |

### 1.2 Authorization Model

```
┌─────────────────────────────────────────────────────────────┐
│                           OWNER                             │
│  (Single EOA - RISK: no multisig, no timelock)             │
├─────────────────────────────────────────────────────────────┤
│  Controls:                                                  │
│  - setAuthorizedCaller() on SolverRegistry                  │
│  - setDisputeModule() on IntentReceiptHub                   │
│  - setArbitrator() on DisputeModule                         │
│  - pause()/unpause() on all contracts                       │
│  - unjailSolver(), banSolver()                              │
│  - sweepForfeitedBonds(), withdrawFees()                    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│ SolverRegistry   │ │ IntentReceiptHub│ │ DisputeModule    │
│ authorizedCaller │ │ disputeModule   │ │ arbitrator       │
│ mapping          │ │ address         │ │ address          │
└────────┬─────────┘ └────────┬────────┘ └────────┬─────────┘
         │                    │                    │
         │              AUTHORIZED                 │
         │◄──────────── CALLER ──────────────────►│
         │              (Hub→Registry)             │
         │                                         │
         └──────────── Can call: ─────────────────►│
           lockBond(), unlockBond(),               │
           slash(), jailSolver(),                  │
           updateScore(), incrementDisputes()      │
```

### 1.3 Trust Assumptions

| Actor | Trust Level | Risk if Compromised |
|-------|-------------|---------------------|
| Owner (EOA) | Full trust | Can pause all, change all settings, sweep funds |
| Arbitrator | High trust | Can resolve disputes, takes 10% of slashes |
| Authorized Callers | Medium trust | Can slash solvers, lock/unlock bonds |
| Solver Operator | Low trust | Can only affect their own solver |
| Challenger | Untrusted | Must post bond, can lose it |

---

## 2. Known Risks (from Operator Doc)

These risks are documented and require mitigation before mainnet:

| Risk | Severity | Current State | Required Mitigation |
|------|----------|---------------|---------------------|
| Single-key owner | HIGH | EOA | Gnosis Safe multisig (see MULTISIG_PLAN.md) |
| Centralized arbitrator | MEDIUM | Single address | Decentralized arbitration v2 |
| No timelock | MEDIUM | Instant changes | TimelockController for params |
| Slither non-blocking | LOW | continue-on-error | Make blocking in CI |
| No formal verification | LOW | Fuzz tests only | Certora/Echidna |

---

## 3. Findings Summary

### 3.1 HIGH Severity

| ID | Finding | Contract | Location | Status |
|----|---------|----------|----------|--------|
| IRSB-SEC-001 | No chainId in receipt signature - cross-chain replay | IntentReceiptHub | L120-131 | **OPEN** |
| IRSB-SEC-002 | escalate() callable by anyone - DoS griefing | DisputeModule | L110 | **OPEN** |
| IRSB-SEC-003 | Failed dispute reverts to Pending - re-challenge | IntentReceiptHub | L276 | **OPEN** |
| IRSB-SEC-004 | Hub authorization is SPOF for slashing | SolverRegistry | - | **DOCUMENTED** |
| IRSB-SEC-005 | Slash with zero amount silent failure | SolverRegistry | L247 | **OPEN** |

### 3.2 MEDIUM Severity

| ID | Finding | Contract | Location | Status |
|----|---------|----------|----------|--------|
| IRSB-SEC-006 | No nonce in receipt signature - same-chain replay | IntentReceiptHub | L120-131 | **OPEN** |
| IRSB-SEC-007 | setSolverKey has no timelock | SolverRegistry | L209-226 | **DOCUMENTED** |
| IRSB-SEC-008 | Arbitrator receives 10% - perverse incentive | DisputeModule | L162-173 | **DOCUMENTED** |
| IRSB-SEC-009 | batchPostReceipts skips signature verification | IntentReceiptHub | L322-349 | **OPEN** |
| IRSB-SEC-010 | No minimum slash amount validation | DisputeModule | L153-157 | **OPEN** |

### 3.3 LOW Severity

| ID | Finding | Contract | Location | Status |
|----|---------|----------|----------|--------|
| IRSB-SEC-011 | Volume hardcoded to 0 on finalize | IntentReceiptHub | L303 | **DOCUMENTED** |
| IRSB-SEC-012 | lastActivityAt not updated on receipt post | SolverRegistry | - | **DOCUMENTED** |
| IRSB-SEC-013 | Forfeited bonds sweepable anytime | IntentReceiptHub | L461-469 | **DOCUMENTED** |
| IRSB-SEC-014 | Duplicate slash calls to same recipient | IntentReceiptHub | L253-268 | **INFO** |
| IRSB-SEC-015 | Evidence array unbounded growth | DisputeModule | L102-104 | **DOCUMENTED** |

---

## 4. Detailed Findings

### IRSB-SEC-001: No chainId in Receipt Signature (HIGH)

**Location:** `IntentReceiptHub.sol:120-131`

**Current Code:**
```solidity
bytes32 messageHash = keccak256(
    abi.encode(
        receipt.intentHash,
        receipt.constraintsHash,
        receipt.routeHash,
        receipt.outcomeHash,
        receipt.evidenceHash,
        receipt.createdAt,
        receipt.expiry,
        receipt.solverId
    )
);
```

**Exploit Scenario:**
1. Solver signs receipt on Sepolia testnet
2. Attacker replays identical signature on mainnet
3. Receipt is accepted despite being from different chain
4. Solver reputation affected on wrong network

**Recommended Fix:**
```solidity
bytes32 messageHash = keccak256(
    abi.encode(
        block.chainid,
        address(this),
        receipt.intentHash,
        // ... rest
    )
);
```

**Status:** OPEN - To be fixed in Phase 1

---

### IRSB-SEC-002: escalate() Callable by Anyone (HIGH)

**Location:** `DisputeModule.sol:110`

**Current Code:**
```solidity
function escalate(bytes32 disputeId) external payable nonReentrant {
    Types.Dispute memory dispute = receiptHub.getDispute(disputeId);
    // No caller restriction!
```

**Exploit Scenario:**
1. Legitimate dispute opened between solver and challenger
2. Random third party calls escalate() with arbitration fee
3. Dispute parties have no control over escalation
4. Can be used for DoS/griefing

**Recommended Fix:**
```solidity
function escalate(bytes32 disputeId) external payable nonReentrant {
    Types.Dispute memory dispute = receiptHub.getDispute(disputeId);
    Types.Solver memory solver = solverRegistry.getSolver(dispute.solverId);
    if (msg.sender != dispute.challenger && msg.sender != solver.operator) {
        revert NotDisputeParty();
    }
```

**Status:** OPEN - To be fixed in Phase 1

---

### IRSB-SEC-003: Failed Dispute Reverts to Pending (HIGH)

**Location:** `IntentReceiptHub.sol:276`

**Current Code:**
```solidity
} else {
    // Dispute rejected: unlock solver bond, forfeit challenger bond to treasury
    solverRegistry.unlockBond(receipt.solverId, slashAmount);
    _receiptStatus[receiptId] = Types.ReceiptStatus.Pending;  // <-- Problem
```

**Exploit Scenario:**
1. Challenger opens invalid dispute
2. Dispute is rejected, receipt reverts to Pending
3. Same or different challenger can open another dispute
4. Unlimited re-challenges possible

**Recommended Fix:**
```solidity
// Mark as finalized (dispute was invalid, receipt is now confirmed)
_receiptStatus[receiptId] = Types.ReceiptStatus.Finalized;
emit ReceiptFinalized(receiptId, dispute.solverId);
```

**Status:** OPEN - To be fixed in Phase 1

---

### IRSB-SEC-005: Zero Slash Amount Silent Failure (HIGH)

**Location:** `SolverRegistry.sol:247`

**Current Code:**
```solidity
function slash(bytes32 solverId, uint256 amount, ...) external onlyAuthorized {
    Types.Solver storage solver = _solvers[solverId];
    // No validation that amount > 0
```

**Exploit Scenario:**
1. slashPercentage = 1% on small bond
2. Rounding: `(0.1 ether * 1) / 100 = 0.001 ether` (OK)
3. But with very small bonds: `(0.001 ether * 1) / 100 = 0`
4. Zero slash = no actual punishment

**Recommended Fix:**
```solidity
if (amount == 0) revert ZeroSlashAmount();
```

**Status:** OPEN - To be fixed in Phase 1

---

### IRSB-SEC-009: batchPostReceipts Skips Signature Verification (MEDIUM)

**Location:** `IntentReceiptHub.sol:322-349`

**Current Code:**
```solidity
function batchPostReceipts(Types.IntentReceipt[] calldata receipts)
    external
    whenNotPaused
    nonReentrant
    returns (bytes32[] memory receiptIds)
{
    require(receipts.length <= MAX_BATCH_SIZE, "Batch too large");

    for (uint256 i = 0; i < receipts.length; i++) {
        // Simplified validation for batch (assumes same solver)
        Types.IntentReceipt calldata receipt = receipts[i];

        bytes32 receiptId = computeReceiptId(receipt);
        if (_receipts[receiptId].createdAt != 0) continue; // Skip duplicates

        _receipts[receiptId] = receipt;  // <-- No signature verification!
```

**Exploit Scenario:**
1. Attacker creates receipt with forged signature
2. Uses batchPostReceipts() to bypass signature check
3. Invalid receipts stored in contract
4. Affects solver reputation unfairly

**Recommended Fix:**
Add signature verification in batch loop, or mark batch as internal-only.

**Status:** OPEN - To be fixed in Phase 1

---

## 5. Baseline Metrics

### 5.1 Test Coverage

```
Ran 14 test suites: 308 tests passed, 0 failed, 0 skipped
```

### 5.2 Contract Sizes

| Contract | Runtime Size (B) | Margin (B) |
|----------|------------------|------------|
| SolverRegistry | 8,012 | 16,564 |
| IntentReceiptHub | 11,148 | 13,428 |
| DisputeModule | 7,268 | 17,308 |
| EscrowVault | 4,305 | 20,271 |
| OptimisticDisputeModule | 10,415 | 14,161 |
| ReceiptV2Extension | 10,480 | 14,096 |

### 5.3 Slither Findings (Baseline)

**Status:** Not yet run (Slither to be installed and run in CI)

---

## 6. Phase Tracking

| Phase | Branch | Status | PR |
|-------|--------|--------|-----|
| 0 - Baseline | `security/ph0-baseline-and-tooling` | **IN PROGRESS** | - |
| 1 - Contract Fixes | `security/ph1-contract-findings` | PENDING | - |
| 2 - CI Gates | `security/ph2-ci-gates-and-fuzz` | PENDING | - |
| 3 - Ops Hardening | `security/ph3-ops-hardening-docs` | PENDING | - |

---

## 7. Remaining Risks (Post-Audit)

These require business decisions before mainnet:

| Risk | Mitigation Options | Decision Owner |
|------|-------------------|----------------|
| Single EOA owner | Deploy Gnosis Safe, 2-of-3 | Protocol team |
| Centralized arbitrator | Multiple arbitrators / DAO | Protocol team |
| No timelock | Add TimelockController | Protocol team |
| Cross-chain deployment | EIP-712 with chainId binding | Technical team |

---

## 8. Verification Commands

```bash
# Run all tests
forge test

# Run with gas report
forge test --gas-report

# Check formatting
forge fmt --check

# Run security script
./scripts/security.sh

# Run CI-equivalent fuzz (10k runs)
FOUNDRY_PROFILE=ci forge test
```

---

## Appendix A: Contract Invariants

See `audit/INVARIANTS.md` for formal invariants to be implemented as tests.

---

**Document History:**
- 2026-01-28: Initial draft (Phase 0 baseline)
