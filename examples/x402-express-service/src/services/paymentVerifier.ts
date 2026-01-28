/**
 * Payment Verifier
 *
 * Mock payment verification for demonstration.
 * In production, this would verify on-chain transactions or use a payment facilitator.
 */

export interface PaymentProof {
  /** Transaction hash or payment reference */
  paymentRef: string;
  /** Payer's address */
  payer: string;
  /** Optional signature for additional verification */
  signature?: string;
  /** Timestamp of payment */
  timestamp?: number;
}

export interface VerificationOptions {
  expectedAmount: string;
  expectedAsset: string;
  expectedChainId: number;
}

export interface VerificationResult {
  valid: boolean;
  reason?: string;
  confirmedAmount?: string;
  confirmedAsset?: string;
}

/**
 * Verify a payment proof.
 *
 * NOTE: This is a MOCK implementation for demonstration.
 * In production, you would:
 * 1. Query the blockchain for the transaction
 * 2. Verify the recipient, amount, and asset
 * 3. Check block confirmations
 * 4. Or use a payment facilitator API (e.g., Coinbase Commerce, etc.)
 *
 * @param proof - The payment proof from the client
 * @param options - Expected payment parameters
 * @returns Verification result
 */
export async function verifyPayment(
  proof: PaymentProof,
  options: VerificationOptions
): Promise<VerificationResult> {
  // Basic validation
  if (!proof.paymentRef) {
    return { valid: false, reason: 'Missing paymentRef' };
  }

  if (!proof.payer) {
    return { valid: false, reason: 'Missing payer address' };
  }

  // Validate paymentRef format (should be a transaction hash)
  if (!/^0x[a-fA-F0-9]{64}$/.test(proof.paymentRef)) {
    // Allow mock proof for testing
    if (!proof.paymentRef.startsWith('mock-proof-')) {
      return { valid: false, reason: 'Invalid paymentRef format' };
    }
  }

  // Validate payer address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(proof.payer)) {
    return { valid: false, reason: 'Invalid payer address format' };
  }

  // ============================================
  // MOCK VERIFICATION
  // In production, replace this with real verification:
  //
  // const provider = new JsonRpcProvider(process.env.RPC_URL);
  // const tx = await provider.getTransaction(proof.paymentRef);
  // if (!tx) return { valid: false, reason: 'Transaction not found' };
  //
  // const receipt = await tx.wait();
  // if (!receipt) return { valid: false, reason: 'Transaction not confirmed' };
  //
  // // Verify recipient, amount, asset...
  // ============================================

  console.log(`[Payment Verifier] Verifying payment:`, {
    paymentRef: proof.paymentRef,
    payer: proof.payer,
    expected: {
      amount: options.expectedAmount,
      asset: options.expectedAsset,
      chainId: options.expectedChainId,
    },
  });

  // For demonstration, accept all mock proofs and valid-looking tx hashes
  return {
    valid: true,
    confirmedAmount: options.expectedAmount,
    confirmedAsset: options.expectedAsset,
  };
}

/**
 * Generate a mock payment proof for testing.
 *
 * @param payer - Payer address
 * @returns Mock payment proof
 */
export function generateMockPaymentProof(payer: string): PaymentProof {
  const mockTxHash =
    '0x' +
    Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  return {
    paymentRef: mockTxHash,
    payer,
    timestamp: Math.floor(Date.now() / 1000),
  };
}
