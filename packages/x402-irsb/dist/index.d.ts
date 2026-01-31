/**
 * x402 ↔ IRSB Integration Types
 *
 * Core type definitions for integrating x402 HTTP Payment Protocol
 * with IRSB ReceiptV2 system.
 */
/**
 * Schema version for forward compatibility
 */
declare const X402_PAYLOAD_VERSION = "1.0.0";
/**
 * Privacy levels matching IRSB ReceiptV2
 */
declare enum PrivacyLevel {
    /** Full receipt visible on-chain */
    Public = 0,
    /** Commitment visible, payload gated via Lit or similar */
    SemiPublic = 1,
    /** Commitment only, fully encrypted payload */
    Private = 2
}
/**
 * Service identification for x402 endpoint
 */
interface X402Service {
    /** Unique service identifier (e.g., "acme-api-v1") */
    serviceId: string;
    /** HTTP method + path (e.g., "POST /api/generate") */
    endpoint: string;
    /** Host domain (e.g., "api.example.com") */
    domain: string;
}
/**
 * Payment details from x402 transaction
 */
interface X402Payment {
    /** Transaction hash or facilitator reference (NOT raw proof) */
    paymentRef: string;
    /** Token symbol or address (e.g., "ETH", "USDC", "0x...") */
    asset: string;
    /** Amount as string for precision (wei for ETH) */
    amount: string;
    /** Chain ID where payment occurred */
    chainId: number;
}
/**
 * Request identification
 */
interface X402Request {
    /** UUID for this request */
    requestId: string;
    /** Hash of canonical request components */
    requestFingerprint: string;
}
/**
 * Response artifact pointers
 */
interface X402Response {
    /** CID or URL to response artifact (off-chain storage) */
    resultPointer: string;
    /** Hash of response content for verification */
    resultDigest: string;
}
/**
 * Timing information for replay prevention
 */
interface X402Timing {
    /** Unix timestamp when receipt was issued */
    issuedAt: number;
    /** Unix timestamp when receipt expires */
    expiry: number;
    /** Unique per-receipt nonce */
    nonce: string;
}
/**
 * Complete x402 receipt payload
 *
 * This is the canonical structure for x402 payment receipts.
 * The entire payload is committed on-chain as a hash, with
 * the full data stored off-chain (IPFS/Arweave).
 */
interface X402ReceiptPayload {
    /** Schema version */
    version: string;
    /** Service identification */
    service: X402Service;
    /** Payment details */
    payment: X402Payment;
    /** Request identification */
    request: X402Request;
    /** Response artifact pointers */
    response: X402Response;
    /** Timing for replay prevention */
    timing: X402Timing;
}
/**
 * IRSB ReceiptV2 structure (matching Solidity struct)
 */
interface IntentReceiptV2 {
    intentHash: string;
    constraintsHash: string;
    routeHash: string;
    outcomeHash: string;
    evidenceHash: string;
    metadataCommitment: string;
    ciphertextPointer: string;
    privacyLevel: PrivacyLevel;
    escrowId: string;
    createdAt: bigint;
    expiry: bigint;
    solverId: string;
    solverSig: string;
    clientSig: string;
}
/**
 * Parameters for building ReceiptV2 from x402 payload
 */
interface X402ToReceiptParams {
    /** The x402 receipt payload */
    payload: X402ReceiptPayload;
    /** CID or digest string for off-chain ciphertext */
    ciphertextPointer: string;
    /** Privacy level (default: SemiPublic) */
    privacyLevel?: PrivacyLevel;
    /** Optional escrow ID for commerce mode */
    escrowId?: string;
    /** Registered IRSB solver ID */
    solverId: string;
}
/**
 * Result of building a ReceiptV2
 */
interface X402ReceiptResult {
    /** The built receipt (unsigned) */
    receiptV2: IntentReceiptV2;
    /** EIP-712 signing payloads for solver and client */
    signingPayloads: {
        solver: EIP712TypedData;
        client: EIP712TypedData;
    };
    /** Debug information */
    debug: {
        metadataCommitment: string;
        intentHash: string;
        constraintsHash: string;
        routeHash: string;
    };
}
/**
 * EIP-712 typed data structure
 */
interface EIP712TypedData {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: Record<string, Array<{
        name: string;
        type: string;
    }>>;
    primaryType: string;
    message: Record<string, unknown>;
}
/**
 * Options for posting receipt to IRSB Hub
 */
interface PostX402ReceiptOptions {
    /** RPC URL for the target chain */
    rpcUrl: string;
    /** IntentReceiptHub contract address */
    hubAddress: string;
    /** Solver's private key or signer */
    solverSigner: string;
    /** Optional: Client's private key or signer for dual attestation */
    clientSigner?: string;
    /** Gas limit override */
    gasLimit?: bigint;
}
/**
 * Escrow creation parameters for commerce mode
 */
interface X402EscrowParams {
    /** Escrow ID (usually derived from payment ref) */
    escrowId: string;
    /** Receipt ID this escrow is linked to */
    receiptId: string;
    /** Depositor address (client) */
    depositor: string;
    /** Token address (address(0) for native) */
    token: string;
    /** Amount to escrow */
    amount: bigint;
    /** Deadline for escrow (must be >= receipt expiry) */
    deadline: bigint;
}
/**
 * Operational mode for x402 integration
 */
declare enum X402Mode {
    /** Payment settles immediately via x402, receipt is for reputation/disputes */
    Micropayment = "micropayment",
    /** Payment goes to escrow, released on receipt finalization */
    Commerce = "commerce"
}

/**
 * x402 Payload Schema and Commitment Generation
 *
 * Canonical serialization and hashing for x402 receipt payloads.
 * Ensures deterministic commitment generation for on-chain verification.
 */

/**
 * Canonicalize payload for deterministic hashing.
 *
 * Keys are sorted alphabetically at each level to ensure
 * the same payload always produces the same JSON string.
 *
 * @param payload - The x402 receipt payload
 * @returns Canonical JSON string
 */
declare function canonicalize(payload: X402ReceiptPayload): string;
/**
 * Compute keccak256 commitment over canonical payload.
 *
 * This is the primary commitment stored on-chain in metadataCommitment.
 *
 * @param payload - The x402 receipt payload
 * @returns bytes32 commitment hash
 */
declare function computePayloadCommitment(payload: X402ReceiptPayload): string;
/**
 * Compute request fingerprint from request parameters.
 *
 * Used for deduplication and replay prevention.
 *
 * @param method - HTTP method (GET, POST, etc.)
 * @param path - Request path
 * @param body - Request body string (will be hashed)
 * @param timestamp - Request timestamp
 * @returns bytes32 fingerprint
 */
declare function computeRequestFingerprint(method: string, path: string, body: string, timestamp: number): string;
/**
 * Compute payment terms hash for constraintsHash field.
 *
 * @param payment - Payment details
 * @param expiry - Payment expiry timestamp
 * @returns bytes32 terms hash
 */
declare function computeTermsHash(payment: X402Payment, expiry: number): string;
/**
 * Compute intent hash from service and request IDs.
 *
 * @param service - Service identification
 * @param requestId - Request UUID
 * @returns bytes32 intent hash
 */
declare function computeIntentHash(service: X402Service, requestId: string): string;
/**
 * Compute route hash from service endpoint.
 *
 * @param service - Service identification
 * @returns bytes32 route hash
 */
declare function computeRouteHash(service: X402Service): string;
/**
 * Compute evidence hash from payment reference.
 *
 * @param paymentRef - Payment transaction reference
 * @returns bytes32 evidence hash
 */
declare function computeEvidenceHash(paymentRef: string): string;
/**
 * Validate CID format (basic validation for IPFS CIDs).
 *
 * @param cid - CID string to validate
 * @returns true if valid format
 */
declare function isValidCID(cid: string): boolean;
/**
 * Format ciphertext pointer for storage.
 *
 * @param cid - IPFS CID or other pointer
 * @returns Normalized pointer string
 */
declare function formatCiphertextPointer(cid: string): string;
/**
 * Verify a commitment matches the plaintext payload.
 *
 * @param commitment - The stored commitment (bytes32)
 * @param payload - The plaintext payload to verify
 * @returns true if commitment matches
 */
declare function verifyCommitment(commitment: string, payload: X402ReceiptPayload): boolean;
/**
 * Generate a unique nonce for replay prevention.
 *
 * @returns Random nonce string
 */
declare function generateNonce(): string;
/**
 * Create a new x402 receipt payload with defaults.
 *
 * @param params - Partial payload parameters
 * @returns Complete X402ReceiptPayload
 */
declare function createPayload(params: {
    service: X402Service;
    payment: X402Payment;
    request: Omit<X402Request, 'requestFingerprint'> & {
        requestFingerprint?: string;
    };
    response: {
        resultPointer: string;
        resultDigest: string;
    };
    timing?: Partial<X402Timing>;
}): X402ReceiptPayload;

/**
 * ReceiptV2 Building from x402 Payloads
 *
 * Transforms x402 payment artifacts into IRSB ReceiptV2 structures
 * with proper field mapping and EIP-712 signing payload generation.
 */

/**
 * EIP-712 type definitions for ReceiptV2
 */
declare const RECEIPT_V2_TYPES: {
    IntentReceiptV2: {
        name: string;
        type: string;
    }[];
};
/**
 * Get EIP-712 domain for receipt signing.
 *
 * @param chainId - Chain ID for the domain
 * @param hubAddress - IntentReceiptHub contract address
 * @returns EIP-712 domain object
 */
declare function getEIP712Domain(chainId: number, hubAddress: string): {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
};
/**
 * Build ReceiptV2 from x402 payment artifacts.
 *
 * Maps x402 payload fields to IRSB ReceiptV2 fields:
 * - intentHash: keccak256(serviceId + requestId)
 * - constraintsHash: keccak256(payment terms)
 * - routeHash: keccak256(domain + endpoint)
 * - outcomeHash: response.resultDigest
 * - evidenceHash: keccak256(paymentRef)
 * - metadataCommitment: keccak256(full canonical payload)
 *
 * @param params - Build parameters
 * @returns Receipt result with signing payloads
 */
declare function buildReceiptV2FromX402(params: X402ToReceiptParams): X402ReceiptResult;
/**
 * Create EIP-712 signing payload for a receipt.
 *
 * @param receipt - The receipt to sign
 * @param chainId - Chain ID
 * @param hubAddress - Hub contract address
 * @returns EIP-712 typed data for signing
 */
declare function createSigningPayload(receipt: IntentReceiptV2, chainId: number, hubAddress: string): EIP712TypedData;
/**
 * Compute the receipt ID (deterministic hash of receipt data).
 *
 * @param receipt - The receipt to hash
 * @returns bytes32 receipt ID
 */
declare function computeReceiptV2Id(receipt: IntentReceiptV2): string;
/**
 * Build ReceiptV2 with signing payloads configured for a specific chain.
 *
 * @param params - Build parameters
 * @param chainId - Target chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns Receipt result with properly configured signing payloads
 */
declare function buildReceiptV2WithConfig(params: X402ToReceiptParams, chainId: number, hubAddress: string): X402ReceiptResult;
/**
 * Validate that a receipt has all required fields.
 *
 * @param receipt - Receipt to validate
 * @returns true if valid
 */
declare function validateReceiptV2(receipt: IntentReceiptV2): boolean;

/**
 * EIP-712 Signing Helpers for ReceiptV2
 *
 * Provides functions for signing receipts as either solver or client.
 */

/**
 * Sign a receipt as the solver (service provider).
 *
 * @param receipt - The receipt to sign
 * @param privateKey - Solver's private key
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns Signature bytes
 */
declare function signAsService(receipt: IntentReceiptV2, privateKey: string, chainId: number, hubAddress: string): Promise<string>;
/**
 * Sign a receipt as the client (payer).
 *
 * @param receipt - The receipt to sign
 * @param privateKey - Client's private key
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns Signature bytes
 */
declare function signAsClient(receipt: IntentReceiptV2, privateKey: string, chainId: number, hubAddress: string): Promise<string>;
/**
 * Sign a receipt with both solver and client signatures.
 *
 * @param receipt - The receipt to sign (will be mutated)
 * @param solverPrivateKey - Solver's private key
 * @param clientPrivateKey - Client's private key
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns The signed receipt
 */
declare function signReceiptDual(receipt: IntentReceiptV2, solverPrivateKey: string, clientPrivateKey: string, chainId: number, hubAddress: string): Promise<IntentReceiptV2>;
/**
 * Recover the signer address from a receipt signature.
 *
 * @param receipt - The signed receipt
 * @param signature - The signature to verify
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns The signer's address
 */
declare function recoverSigner(receipt: IntentReceiptV2, signature: string, chainId: number, hubAddress: string): string;
/**
 * Verify a solver signature on a receipt.
 *
 * @param receipt - The signed receipt
 * @param expectedSolver - Expected solver address
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns true if signature is valid and from expected solver
 */
declare function verifySolverSignature(receipt: IntentReceiptV2, expectedSolver: string, chainId: number, hubAddress: string): boolean;
/**
 * Verify a client signature on a receipt.
 *
 * @param receipt - The signed receipt
 * @param expectedClient - Expected client address
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns true if signature is valid and from expected client
 */
declare function verifyClientSignature(receipt: IntentReceiptV2, expectedClient: string, chainId: number, hubAddress: string): boolean;
/**
 * Get the typed data hash for a receipt (for manual verification).
 *
 * @param receipt - The receipt
 * @param chainId - Chain ID
 * @param hubAddress - IntentReceiptHub address
 * @returns The EIP-712 typed data hash
 */
declare function getReceiptTypedDataHash(receipt: IntentReceiptV2, chainId: number, hubAddress: string): string;
/**
 * Create a personal_sign compatible message hash (for V1 compatibility).
 *
 * This is used when the hub expects personal_sign instead of EIP-712.
 *
 * @param receipt - The receipt
 * @returns Message hash for personal_sign
 */
declare function getPersonalSignHash(receipt: IntentReceiptV2): string;

/**
 * Receipt Posting Helpers
 *
 * Functions for posting signed receipts to the IRSB IntentReceiptHub.
 */

/**
 * Result of posting a receipt
 */
interface PostReceiptResult {
    /** Transaction hash */
    txHash: string;
    /** Receipt ID returned by the contract */
    receiptId: string;
    /** Block number where receipt was posted */
    blockNumber: number;
    /** Gas used */
    gasUsed: bigint;
}
/**
 * Post a signed ReceiptV2 to the IntentReceiptHub.
 *
 * @param receipt - The signed receipt
 * @param options - Posting options
 * @returns Post result with receipt ID
 */
declare function postReceiptV2(receipt: IntentReceiptV2, options: PostX402ReceiptOptions): Promise<PostReceiptResult>;
/**
 * Build, sign, and post a receipt from x402 payload in one call.
 *
 * @param params - Receipt build parameters
 * @param options - Posting options
 * @returns Post result with receipt ID
 */
declare function postReceiptV2FromX402(params: X402ToReceiptParams, options: PostX402ReceiptOptions): Promise<PostReceiptResult>;
/**
 * Estimate gas for posting a receipt.
 *
 * @param receipt - The receipt to post
 * @param options - Posting options
 * @returns Estimated gas
 */
declare function estimatePostGas(receipt: IntentReceiptV2, options: Omit<PostX402ReceiptOptions, 'gasLimit'>): Promise<bigint>;
/**
 * Check if a receipt has already been posted.
 *
 * @param receiptId - The receipt ID to check
 * @param rpcUrl - RPC URL
 * @param hubAddress - Hub address
 * @returns true if receipt exists
 */
declare function receiptExists(receiptId: string, rpcUrl: string, hubAddress: string): Promise<boolean>;

/**
 * Escrow Helpers for Commerce Mode
 *
 * Functions for integrating x402 payments with IRSB EscrowVault
 * for higher-stakes commerce operations.
 */

/**
 * Escrow status enum
 */
declare enum EscrowStatus {
    Active = 0,
    Released = 1,
    Refunded = 2
}
/**
 * Escrow information
 */
interface EscrowInfo {
    receiptId: string;
    depositor: string;
    token: string;
    amount: bigint;
    status: EscrowStatus;
    createdAt: number;
    deadline: number;
}
/**
 * Result of creating an escrow
 */
interface CreateEscrowResult {
    txHash: string;
    escrowId: string;
    blockNumber: number;
    gasUsed: bigint;
}
/**
 * Generate a deterministic escrow ID from payment reference.
 *
 * @param paymentRef - Payment transaction reference
 * @param chainId - Chain ID where escrow is created
 * @returns bytes32 escrow ID
 */
declare function generateEscrowId(paymentRef: string, chainId: number): string;
/**
 * Generate escrow ID from x402 payment details.
 *
 * @param payment - x402 payment details
 * @param targetChainId - Chain ID for IRSB escrow
 * @returns bytes32 escrow ID
 */
declare function escrowIdFromPayment(payment: X402Payment, targetChainId: number): string;
/**
 * Create a native ETH escrow for commerce mode.
 *
 * @param params - Escrow parameters
 * @param escrowAddress - EscrowVault contract address
 * @param rpcUrl - RPC URL
 * @param signerKey - Private key of authorized caller
 * @returns Escrow creation result
 */
declare function createNativeEscrow(params: X402EscrowParams, escrowAddress: string, rpcUrl: string, signerKey: string): Promise<CreateEscrowResult>;
/**
 * Create an ERC20 escrow for commerce mode.
 *
 * Note: Token must be pre-approved to the escrow contract.
 *
 * @param params - Escrow parameters
 * @param escrowAddress - EscrowVault contract address
 * @param rpcUrl - RPC URL
 * @param signerKey - Private key of authorized caller
 * @returns Escrow creation result
 */
declare function createERC20Escrow(params: X402EscrowParams, escrowAddress: string, rpcUrl: string, signerKey: string): Promise<CreateEscrowResult>;
/**
 * Approve ERC20 tokens for escrow deposit.
 *
 * @param tokenAddress - ERC20 token address
 * @param escrowAddress - EscrowVault address
 * @param amount - Amount to approve
 * @param rpcUrl - RPC URL
 * @param signerKey - Token holder's private key
 * @returns Transaction hash
 */
declare function approveERC20ForEscrow(tokenAddress: string, escrowAddress: string, amount: bigint, rpcUrl: string, signerKey: string): Promise<string>;
/**
 * Get escrow information.
 *
 * @param escrowId - Escrow ID to query
 * @param escrowAddress - EscrowVault address
 * @param rpcUrl - RPC URL
 * @returns Escrow info or null if not found
 */
declare function getEscrowInfo(escrowId: string, escrowAddress: string, rpcUrl: string): Promise<EscrowInfo | null>;
/**
 * Check if an escrow can be created (doesn't already exist).
 *
 * @param escrowId - Escrow ID to check
 * @param escrowAddress - EscrowVault address
 * @param rpcUrl - RPC URL
 * @returns true if escrow can be created
 */
declare function canCreateEscrow(escrowId: string, escrowAddress: string, rpcUrl: string): Promise<boolean>;
/**
 * Calculate escrow parameters from x402 payment.
 *
 * @param payment - x402 payment details
 * @param receiptId - IRSB receipt ID
 * @param depositor - Client/payer address
 * @param targetChainId - Chain ID for IRSB escrow
 * @param deadlineOffset - Seconds to add to current time for deadline
 * @returns Escrow parameters
 */
declare function calculateEscrowParams(payment: X402Payment, receiptId: string, depositor: string, targetChainId: number, deadlineOffset?: number): X402EscrowParams;
/**
 * Create escrow from x402 payment (auto-detects native vs ERC20).
 *
 * @param payment - x402 payment details
 * @param receiptId - IRSB receipt ID
 * @param depositor - Client/payer address
 * @param escrowAddress - EscrowVault address
 * @param rpcUrl - RPC URL
 * @param signerKey - Authorized caller key
 * @param targetChainId - Chain ID
 * @returns Escrow creation result
 */
declare function createEscrowFromX402(payment: X402Payment, receiptId: string, depositor: string, escrowAddress: string, rpcUrl: string, signerKey: string, targetChainId: number): Promise<CreateEscrowResult>;

/**
 * Network Configuration Helpers
 *
 * Pre-configured contract addresses for supported networks.
 */
/**
 * Network configuration for IRSB contracts
 */
interface NetworkConfig {
    /** Chain ID */
    chainId: number;
    /** Network name */
    name: string;
    /** IntentReceiptHub contract address */
    hubAddress: string;
    /** SolverRegistry contract address */
    registryAddress: string;
    /** DisputeModule contract address */
    disputeModuleAddress: string;
    /** EscrowVault contract address (if deployed) */
    escrowAddress?: string;
    /** Public RPC URL (for convenience, not for production) */
    publicRpcUrl?: string;
    /** Block explorer URL */
    explorerUrl?: string;
}
/**
 * Sepolia testnet configuration
 */
declare const SEPOLIA_CONFIG: NetworkConfig;
/**
 * Get network configuration by chain ID.
 *
 * @param chainId - The chain ID to look up
 * @returns Network configuration or undefined if not supported
 */
declare function getNetworkConfig(chainId: number): NetworkConfig | undefined;
/**
 * Get network configuration by chain ID, throwing if not found.
 *
 * @param chainId - The chain ID to look up
 * @returns Network configuration
 * @throws Error if chain ID is not supported
 */
declare function requireNetworkConfig(chainId: number): NetworkConfig;
/**
 * Check if a chain ID is supported.
 *
 * @param chainId - The chain ID to check
 * @returns true if supported
 */
declare function isSupportedChain(chainId: number): boolean;
/**
 * Get list of all supported chain IDs.
 *
 * @returns Array of supported chain IDs
 */
declare function getSupportedChainIds(): number[];
/**
 * Get Etherscan link for a transaction.
 *
 * @param txHash - Transaction hash
 * @param chainId - Chain ID
 * @returns Etherscan URL or undefined if chain not supported
 */
declare function getTransactionUrl(txHash: string, chainId: number): string | undefined;
/**
 * Get Etherscan link for a contract address.
 *
 * @param address - Contract address
 * @param chainId - Chain ID
 * @returns Etherscan URL or undefined if chain not supported
 */
declare function getAddressUrl(address: string, chainId: number): string | undefined;
/**
 * Get Etherscan link for the IntentReceiptHub on a given chain.
 *
 * @param chainId - Chain ID
 * @returns Etherscan URL or undefined if chain not supported
 */
declare function getHubUrl(chainId: number): string | undefined;

export { type CreateEscrowResult, type EIP712TypedData, type EscrowInfo, EscrowStatus, type IntentReceiptV2, type NetworkConfig, type PostReceiptResult, type PostX402ReceiptOptions, PrivacyLevel, RECEIPT_V2_TYPES, SEPOLIA_CONFIG, type X402EscrowParams, X402Mode, type X402Payment, type X402ReceiptPayload, type X402ReceiptResult, type X402Request, type X402Response, type X402Service, type X402Timing, type X402ToReceiptParams, X402_PAYLOAD_VERSION, approveERC20ForEscrow, buildReceiptV2FromX402, buildReceiptV2WithConfig, calculateEscrowParams, canCreateEscrow, canonicalize, computeEvidenceHash, computeIntentHash, computePayloadCommitment, computeReceiptV2Id, computeRequestFingerprint, computeRouteHash, computeTermsHash, createERC20Escrow, createEscrowFromX402, createNativeEscrow, createPayload, createSigningPayload, escrowIdFromPayment, estimatePostGas, formatCiphertextPointer, generateEscrowId, generateNonce, getAddressUrl, getEIP712Domain, getEscrowInfo, getHubUrl, getNetworkConfig, getPersonalSignHash, getReceiptTypedDataHash, getSupportedChainIds, getTransactionUrl, isSupportedChain, isValidCID, postReceiptV2, postReceiptV2FromX402, receiptExists, recoverSigner, requireNetworkConfig, signAsClient, signAsService, signReceiptDual, validateReceiptV2, verifyClientSignature, verifyCommitment, verifySolverSignature };
