/**
 * Contract ABIs for IRSB Protocol
 * Simplified to essential functions for SDK usage
 */

export const SOLVER_REGISTRY_ABI = [
  // Read functions
  'function MINIMUM_BOND() view returns (uint256)',
  'function WITHDRAWAL_COOLDOWN() view returns (uint64)',
  'function MAX_JAILS() view returns (uint8)',
  'function solvers(address) view returns (uint256 bondAmount, uint256 lockedAmount, uint256 reputation, uint64 registrationTime, uint64 lastActiveTime, uint64 totalIntents, uint64 successfulIntents, uint8 jailCount, uint8 status, uint256 pendingWithdrawal, uint64 withdrawalRequestTime)',
  'function isActiveSolver(address solver) view returns (bool)',
  'function getSolverBond(address solver) view returns (uint256)',
  'function getAvailableBond(address solver) view returns (uint256)',
  'function owner() view returns (address)',

  // Write functions
  'function register() payable',
  'function depositBond() payable',
  'function requestWithdrawal(uint256 amount)',
  'function cancelWithdrawal()',
  'function executeWithdrawal()',
  'function unjail() payable',

  // Events
  'event SolverRegistered(address indexed solver, uint256 bondAmount)',
  'event BondDeposited(address indexed solver, uint256 amount, uint256 newTotal)',
  'event WithdrawalRequested(address indexed solver, uint256 amount)',
  'event WithdrawalExecuted(address indexed solver, uint256 amount)',
  'event WithdrawalCancelled(address indexed solver)',
  'event SolverSlashed(address indexed solver, uint256 amount, bytes32 reason)',
  'event SolverJailed(address indexed solver, uint8 jailCount)',
  'event SolverUnjailed(address indexed solver)',
  'event SolverBanned(address indexed solver)',
] as const;

export const INTENT_RECEIPT_HUB_ABI = [
  // Read functions
  'function challengeWindow() view returns (uint64)',
  'function challengerBondBps() view returns (uint16)',
  'function receipts(bytes32) view returns (address solver, bytes32 intentHash, bytes32 constraintsHash, bytes32 outcomeHash, bytes32 evidenceHash, uint64 postedAt, uint64 deadline, bytes solverSig, uint8 status)',
  'function challenges(bytes32) view returns (address challenger, uint8 reason, uint256 bond, uint64 timestamp)',
  'function getReceipt(bytes32 intentHash) view returns (tuple(address solver, bytes32 intentHash, bytes32 constraintsHash, bytes32 outcomeHash, bytes32 evidenceHash, uint64 postedAt, uint64 deadline, bytes solverSig, uint8 status))',
  'function getChallenge(bytes32 intentHash) view returns (tuple(address challenger, uint8 reason, uint256 bond, uint64 timestamp))',
  'function solverRegistry() view returns (address)',

  // Write functions
  'function postReceipt(bytes32 intentHash, bytes32 constraintsHash, bytes32 outcomeHash, bytes32 evidenceHash, uint64 deadline, bytes solverSig)',
  'function challengeReceipt(bytes32 intentHash, uint8 reason) payable',
  'function finalizeReceipt(bytes32 intentHash)',
  'function resolveDeterministic(bytes32 intentHash, bytes settlementProof)',

  // Events
  'event ReceiptPosted(bytes32 indexed intentHash, address indexed solver, uint64 deadline)',
  'event ReceiptChallenged(bytes32 indexed intentHash, address indexed challenger, uint8 reason, uint256 bond)',
  'event ReceiptFinalized(bytes32 indexed intentHash)',
  'event ReceiptSlashed(bytes32 indexed intentHash, address indexed solver, uint256 slashAmount)',
  'event ChallengeResolved(bytes32 indexed intentHash, bool solverWins)',
] as const;

export const DISPUTE_MODULE_ABI = [
  // Read functions
  'function evidenceWindow() view returns (uint64)',
  'function arbitrationTimeout() view returns (uint64)',
  'function arbitrator() view returns (address)',
  'function disputes(bytes32) view returns (bytes32 intentHash, address challenger, address solver, uint8 reason, bytes32 solverEvidence, bytes32 challengerEvidence, uint64 createdAt, uint64 evidenceDeadline, uint8 status, uint8 resolution)',
  'function getDispute(bytes32 intentHash) view returns (tuple(bytes32 intentHash, address challenger, address solver, uint8 reason, bytes32 solverEvidence, bytes32 challengerEvidence, uint64 createdAt, uint64 evidenceDeadline, uint8 status, uint8 resolution))',

  // Write functions
  'function submitEvidence(bytes32 intentHash, bytes32 evidenceHash)',
  'function escalateToArbitration(bytes32 intentHash)',
  'function resolveArbitration(bytes32 intentHash, uint8 resolution, uint16 solverShareBps)',
  'function resolveByTimeout(bytes32 intentHash)',

  // Events
  'event DisputeCreated(bytes32 indexed intentHash, address indexed challenger, address indexed solver, uint8 reason)',
  'event EvidenceSubmitted(bytes32 indexed intentHash, address indexed submitter, bytes32 evidenceHash)',
  'event DisputeEscalated(bytes32 indexed intentHash)',
  'event DisputeResolved(bytes32 indexed intentHash, uint8 resolution)',
] as const;
