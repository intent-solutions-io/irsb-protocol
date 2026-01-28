# IRSB Protocol - Deployment Runbook

**Last Updated:** 2026-01-28
**Maintainer:** jeremy@intentsolutions.io

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)
5. [Sepolia Deployment](#sepolia-deployment)
6. [Polygon Amoy Deployment](#polygon-amoy-deployment)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Contract Verification](#contract-verification)
9. [Multisig Transition](#multisig-transition)
10. [Rollback Procedures](#rollback-procedures)
11. [Emergency Procedures](#emergency-procedures)

---

## Overview

IRSB Protocol consists of the following deployable components:

| Component | Type | Networks |
|-----------|------|----------|
| SolverRegistry | Core Contract | Sepolia, Amoy |
| IntentReceiptHub | Core Contract | Sepolia, Amoy |
| DisputeModule | Core Contract | Sepolia, Amoy |
| ReceiptV2Extension | Extension | Sepolia, Amoy |
| EscrowVault | Extension | Sepolia, Amoy |
| OptimisticDisputeModule | Extension | Sepolia, Amoy |
| ERC8004Adapter | Adapter | Sepolia, Amoy |

**Deployment Order:**
```
1. SolverRegistry
2. IntentReceiptHub
3. DisputeModule
4. [Set authorizedCaller on SolverRegistry]
5. ReceiptV2Extension (v2)
6. EscrowVault (v2)
7. OptimisticDisputeModule (v2)
8. ERC8004Adapter (v2)
```

---

## Prerequisites

### Required Tools
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (forge, cast)
- Node.js 20+
- Git

### Required Accounts
- Deployer wallet with sufficient ETH/POL
- Etherscan API key (for Sepolia verification)
- Polygonscan API key (for Amoy verification)

### Required Access
- Repository write access
- RPC endpoint access (Alchemy/Infura)

---

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/intent-solutions-io/irsb-protocol.git
cd irsb-protocol
forge install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your RPC and API values (but NOT private keys):

```bash
# Sepolia
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY

# Polygon Amoy
AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_KEY

# Treasury (receives protocol fees)
TREASURY_ADDRESS=0x...
```

**SECURITY: Export private key in shell session (never store in files)**

```bash
# Export deployer private key in your terminal session
# This avoids storing secrets in project files
export PRIVATE_KEY=0x...your-key-here...

# Verify it's set (shows masked value)
echo "PRIVATE_KEY is ${PRIVATE_KEY:0:6}...${PRIVATE_KEY: -4}"
```

### 3. Verify Configuration

```bash
# Check deployer balance
cast balance $(cast wallet address --private-key $PRIVATE_KEY) --rpc-url $SEPOLIA_RPC_URL

# Expected: > 0.5 ETH for deployment + gas
```

---

## Pre-Deployment Checklist

Before any deployment:

- [ ] All tests pass: `forge test`
- [ ] Format check passes: `forge fmt --check`
- [ ] Slither has no critical findings: `slither .`
- [ ] Gas report reviewed: `forge test --gas-report`
- [ ] Deployer has sufficient balance
- [ ] Environment variables set correctly
- [ ] Team notified of pending deployment
- [ ] Deployment window confirmed (avoid high gas periods)

---

## Sepolia Deployment

### Existing Deployment (v1)

| Contract | Address |
|----------|---------|
| SolverRegistry | `0xB6ab964832808E49635fF82D1996D6a888ecB745` |
| IntentReceiptHub | `0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c` |
| DisputeModule | `0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D` |

### Deploy New Extensions (v2)

```bash
# Dry run first
forge script script/DeployExtensions.s.sol:DeployExtensions \
  --rpc-url $SEPOLIA_RPC_URL \
  -vvvv

# If dry run succeeds, broadcast
forge script script/DeployExtensions.s.sol:DeployExtensions \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

### Record Deployment

After successful deployment:

1. Update `deployments/sepolia.json`
2. Commit addresses to repository
3. Update SDK constants
4. Update subgraph configuration

---

## Polygon Amoy Deployment

### Prerequisites
- POL tokens for gas (faucet: https://faucet.polygon.technology/)
- Polygonscan API key configured

### Deploy

```bash
# Dry run
forge script script/DeployAmoy.s.sol:DeployAmoy \
  --rpc-url $AMOY_RPC_URL \
  -vvvv

# Broadcast
forge script script/DeployAmoy.s.sol:DeployAmoy \
  --rpc-url $AMOY_RPC_URL \
  --broadcast \
  --verify \
  --verifier-url https://api-amoy.polygonscan.com/api \
  -vvvv
```

### Record Deployment

1. Update `deployments/amoy.json`
2. Update SDK with Amoy addresses
3. Configure subgraph for Amoy

---

## Post-Deployment Verification

### 1. Verify Contract Code

```bash
# Sepolia
forge verify-contract <CONTRACT_ADDRESS> SolverRegistry \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY

# Amoy
forge verify-contract <CONTRACT_ADDRESS> SolverRegistry \
  --chain polygon-amoy \
  --verifier-url https://api-amoy.polygonscan.com/api \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

### 2. Verify Authorization Setup

```bash
# Check authorizedCaller is set
cast call <REGISTRY_ADDRESS> "authorizedCaller(address)(bool)" <HUB_ADDRESS> --rpc-url $SEPOLIA_RPC_URL
# Expected: true

cast call <REGISTRY_ADDRESS> "authorizedCaller(address)(bool)" <DISPUTE_MODULE_ADDRESS> --rpc-url $SEPOLIA_RPC_URL
# Expected: true
```

### 3. Verify Parameters

```bash
# Check minimum bond
cast call <REGISTRY_ADDRESS> "MINIMUM_BOND()(uint256)" --rpc-url $SEPOLIA_RPC_URL
# Expected: 100000000000000000 (0.1 ETH)

# Check challenge window
cast call <HUB_ADDRESS> "challengeWindow()(uint256)" --rpc-url $SEPOLIA_RPC_URL
# Expected: 3600 (1 hour)
```

### 4. Integration Test

```bash
# Run integration tests against deployed contracts
SEPOLIA_REGISTRY=0x... SEPOLIA_HUB=0x... forge test --match-path test/integration/*.sol --fork-url $SEPOLIA_RPC_URL
```

---

## Contract Verification

### Etherscan (Sepolia)

```bash
forge verify-contract \
  --chain sepolia \
  --compiler-version v0.8.24 \
  --num-of-optimizations 200 \
  --constructor-args $(cast abi-encode "constructor(address,address)" $TREASURY_ADDRESS $REGISTRY_ADDRESS) \
  <CONTRACT_ADDRESS> \
  src/IntentReceiptHub.sol:IntentReceiptHub \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Polygonscan (Amoy)

```bash
forge verify-contract \
  --chain polygon-amoy \
  --compiler-version v0.8.24 \
  --num-of-optimizations 200 \
  <CONTRACT_ADDRESS> \
  src/SolverRegistry.sol:SolverRegistry \
  --verifier-url https://api-amoy.polygonscan.com/api \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

---

## Multisig Transition

> **Note:** Production deployments should transfer ownership to a Gnosis Safe multisig.

### Setup Gnosis Safe

1. Create Safe at https://app.safe.global
2. Add signers (minimum 3 recommended)
3. Set threshold (2-of-3 or 3-of-5)

### Transfer Ownership

```bash
# For each contract:
cast send <CONTRACT_ADDRESS> "transferOwnership(address)" <SAFE_ADDRESS> \
  --private-key $PRIVATE_KEY \
  --rpc-url $SEPOLIA_RPC_URL
```

### Verify Transfer

```bash
cast call <CONTRACT_ADDRESS> "owner()(address)" --rpc-url $SEPOLIA_RPC_URL
# Expected: <SAFE_ADDRESS>
```

---

## Rollback Procedures

### Scenario: Bug in New Extension

1. **Pause the extension** (if pausable):
   ```bash
   cast send <EXTENSION_ADDRESS> "pause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL
   ```

2. **Remove authorization** from SolverRegistry:
   ```bash
   cast send <REGISTRY_ADDRESS> "setAuthorizedCaller(address,bool)" <EXTENSION_ADDRESS> false \
     --private-key $PRIVATE_KEY --rpc-url $RPC_URL
   ```

3. **Notify users** via Discord/Twitter

4. **Deploy fixed version** (new address)

### Scenario: Critical Vulnerability in Core Contract

1. **Pause all contracts immediately**
2. **Notify users** - emergency communication
3. **Assess damage** - check for exploits
4. **Deploy new contracts** if needed
5. **Migrate state** via off-chain coordination
6. **Post-mortem** - document and prevent recurrence

---

## Emergency Procedures

### Emergency Contact
- Protocol Lead: jeremy@intentsolutions.io
- Discord: [IRSB Discord]

### Pause All Contracts

```bash
# Pause SolverRegistry
cast send $REGISTRY_ADDRESS "pause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL

# Pause IntentReceiptHub
cast send $HUB_ADDRESS "pause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL

# Pause DisputeModule
cast send $DISPUTE_MODULE_ADDRESS "pause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```

### Unpause (After Resolution)

```bash
cast send $CONTRACT_ADDRESS "unpause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```

---

## Appendix: Deployment Addresses

### Sepolia Testnet

```json
{
  "chainId": 11155111,
  "network": "sepolia",
  "contracts": {
    "SolverRegistry": "0xB6ab964832808E49635fF82D1996D6a888ecB745",
    "IntentReceiptHub": "0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c",
    "DisputeModule": "0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D",
    "ReceiptV2Extension": "TBD",
    "EscrowVault": "TBD",
    "OptimisticDisputeModule": "TBD",
    "ERC8004Adapter": "TBD"
  },
  "deployedAt": {
    "SolverRegistry": 1737820800,
    "IntentReceiptHub": 1737820800,
    "DisputeModule": 1737820800
  }
}
```

### Polygon Amoy Testnet

```json
{
  "chainId": 80002,
  "network": "amoy",
  "contracts": {
    "SolverRegistry": "TBD",
    "IntentReceiptHub": "TBD",
    "DisputeModule": "TBD"
  }
}
```
