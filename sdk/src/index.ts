/**
 * IRSB Protocol SDK
 *
 * SDK for interacting with the IRSB (Intent Receipts & Solver Bonds) Protocol.
 *
 * @packageDocumentation
 */

// Main client
export { IRSBClient, type IRSBClientConfig } from './client';

// Types
export {
  // Enums
  SolverStatus,
  ReceiptStatus,
  DisputeReason,
  DisputeStatus,
  DisputeResolution,
  // Structs
  type SolverInfo,
  type IntentReceipt,
  type Challenge,
  type Dispute,
  // Input types
  type PostReceiptParams,
  type ChallengeParams,
  // Config
  type ChainConfig,
  CHAIN_CONFIGS,
  CONSTANTS,
} from './types';

// ABIs (for advanced usage)
export {
  SOLVER_REGISTRY_ABI,
  INTENT_RECEIPT_HUB_ABI,
  DISPUTE_MODULE_ABI,
} from './contracts/abis';

// Wallet API
export {
  WalletApi,
  createWalletApi,
  SUBGRAPH_URLS,
  type RiskScore,
  type Receipt,
  type RecentReceiptsResponse,
  type BondStatus,
} from './api/walletApi';
