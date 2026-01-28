# x402 + IRSB Express Service Example

This example demonstrates integrating [x402 HTTP Payment Protocol](https://x402.org) with [IRSB (Intent Receipts & Solver Bonds)](../../) for accountable paid API services.

## Overview

The service exposes a paid AI generation endpoint that:

1. **Requires payment** via x402 protocol (HTTP 402 Payment Required)
2. **Generates IRSB ReceiptV2** for every successful request
3. **Supports dual attestation** (solver + client signatures)
4. **Enables on-chain accountability** through the IRSB protocol

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start the server
pnpm dev

# 4. Test the endpoints
# Get service info
curl http://localhost:3000/

# Check pricing
curl http://localhost:3000/api/generate/price

# Try without payment (will get 402)
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello world"}'

# Request with mock payment proof
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: {\"paymentRef\":\"0x$(printf '%064d' 123)\",\"payer\":\"0x$(printf '%040d' 456)\"}" \
  -d '{"prompt": "Generate something cool"}'
```

## Architecture

```
┌─────────────┐        ┌─────────────────────────────────────┐
│   Client    │        │     x402 Express Service            │
├─────────────┤        ├─────────────────────────────────────┤
│             │  402   │  ┌─────────────────────────────┐    │
│ 1. Request  ├───────►│  │   x402 Middleware           │    │
│             │◄───────┤  │   - Check X-Payment-Proof   │    │
│             │ Need   │  │   - Verify payment          │    │
│             │ Pay    │  │   - Return 402 if missing   │    │
│             │        │  └──────────────┬──────────────┘    │
│             │        │                 │ Payment OK        │
│ 2. Pay      │ Pay    │                 ▼                   │
│    on-chain ├───────►│  ┌─────────────────────────────┐    │
│             │        │  │   Business Logic            │    │
│             │        │  │   - Process request         │    │
│             │        │  │   - Generate result         │    │
│             │        │  └──────────────┬──────────────┘    │
│             │        │                 │                   │
│             │        │                 ▼                   │
│             │        │  ┌─────────────────────────────┐    │
│ 3. Request  │ 200    │  │   IRSB Receipt Service      │    │
│    w/ proof ├───────►│  │   - Create x402 payload     │    │
│             │◄───────┤  │   - Build ReceiptV2         │    │
│             │ Result │  │   - Sign as solver          │    │
│             │ +      │  │   - Return with result      │    │
│             │ Receipt│  └─────────────────────────────┘    │
└─────────────┘        └─────────────────────────────────────┘
```

## Endpoints

### GET /
Returns service information and available endpoints.

### GET /health
Health check endpoint.

### GET /api/generate/price
Returns current pricing (no payment required).

```json
{
  "price": {
    "amount": "1000000000000000",
    "asset": "ETH",
    "chainId": 11155111
  },
  "paymentMethods": ["native-transfer", "erc20-transfer"]
}
```

### POST /api/generate
AI generation endpoint (requires x402 payment).

**Request:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: {\"paymentRef\":\"0x...\",\"payer\":\"0x...\"}" \
  -d '{"prompt": "Your prompt here"}'
```

**Response (402 - No Payment):**
```json
{
  "error": "Payment Required",
  "message": "This endpoint requires payment. Include X-Payment-Proof header.",
  "payment": {
    "asset": "ETH",
    "amount": "1000000000000000",
    "chainId": 11155111
  }
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "result": { /* AI generation result */ },
  "requestId": "uuid-v4-here",
  "receipt": {
    "intentHash": "0x...",
    "constraintsHash": "0x...",
    "routeHash": "0x...",
    "outcomeHash": "0x...",
    "evidenceHash": "0x...",
    "metadataCommitment": "0x...",
    "ciphertextPointer": "ipfs://...",
    "privacyLevel": 1,
    "escrowId": "0x0000...",
    "createdAt": "1700000000",
    "expiry": "1700003600",
    "solverId": "0x...",
    "solverSig": "0x..."
  },
  "signingPayload": { /* EIP-712 typed data for client attestation */ },
  "instructions": { /* How to complete dual attestation */ }
}
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `localhost` |
| `RPC_URL` | Ethereum RPC endpoint | `https://rpc.sepolia.org` |
| `CHAIN_ID` | Chain ID | `11155111` (Sepolia) |
| `SERVICE_PRIVATE_KEY` | Solver's private key for signing | Required |
| `SERVICE_SOLVER_ID` | Registered solver ID (bytes32) | Required |
| `IRSB_HUB_ADDRESS` | IntentReceiptHub contract address | Required |
| `PRICE_WEI` | Price per request in wei | `1000000000000000` |
| `PAYMENT_ASSET` | Accepted payment asset | `ETH` |
| `SERVICE_DOMAIN` | Service domain for route hash | `api.example.com` |

## Dual Attestation Flow

For full accountability, both the service (solver) and client should sign the receipt:

1. **Service signs** automatically when generating the receipt
2. **Client signs** using the `signingPayload` returned in the response:

```javascript
// Client-side (using ethers.js)
const signer = await provider.getSigner();
const clientSig = await signer.signTypedData(
  response.signingPayload.domain,
  { IntentReceiptV2: response.signingPayload.types.IntentReceiptV2 },
  response.signingPayload.message
);

// Add to receipt
receipt.clientSig = clientSig;

// Post to IRSB
const hub = new Contract(hubAddress, HUB_ABI, signer);
await hub.postReceiptV2(receipt);
```

## Production Considerations

### Payment Verification
The included payment verifier is a **mock implementation**. For production:

1. Query blockchain for transaction confirmation
2. Verify recipient, amount, and asset
3. Check sufficient block confirmations
4. Or integrate with a payment facilitator (Coinbase Commerce, etc.)

### Result Storage
Currently, result data is hashed but not stored. For production:

1. Upload results to IPFS/Arweave
2. Use the CID as `ciphertextPointer`
3. Optionally encrypt with Lit Protocol

### Error Handling
Add comprehensive error handling for:
- RPC failures
- Transaction verification timeouts
- Contract interaction errors

## Related

- [x402-irsb Package](../../packages/x402-irsb/) - Core integration library
- [IRSB Protocol](../../) - Intent Receipts & Solver Bonds
- [x402 Specification](https://x402.org) - HTTP Payment Protocol
