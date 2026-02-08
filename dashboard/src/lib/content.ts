/**
 * Centralized factual data for all website pages.
 * All values sourced from protocol CLAUDE.md, AI-CONTEXT.md, and contract code.
 */

// ─── Protocol Parameters ────────────────────────────────────────────────────

export const PROTOCOL_PARAMS = {
  minimumBond: '0.1 ETH',
  challengeWindow: '1 hour',
  withdrawalCooldown: '7 days',
  maxJails: 3,
  counterBondWindow: '24 hours',
  arbitrationTimeout: '7 days',
} as const

// ─── Slashing Distribution ──────────────────────────────────────────────────

export const SLASHING_STANDARD = {
  user: 80,
  challenger: 15,
  treasury: 5,
} as const

export const SLASHING_ARBITRATION = {
  user: 70,
  treasury: 20,
  arbitrator: 10,
} as const

// ─── Contract Addresses (Sepolia) ───────────────────────────────────────────

export const CONTRACTS = {
  solverRegistry: '0xB6ab964832808E49635fF82D1996D6a888ecB745',
  intentReceiptHub: '0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c',
  disputeModule: '0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D',
  erc8004Registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
} as const

export const OPERATIONAL_ACCOUNTS = {
  deployer: '0x83A5F432f02B1503765bB61a9B358942d87c9dc0',
  solverId: '0xdf816d7b86303c3452e53d84aaa02c01b0de6ae23c1e518bd2642870f9f7603b',
  safeOwner: '0xBcA0c8d0B5ce874a9E3D84d49f3614bb79189959',
  erc8004AgentId: 967,
} as const

export const EXPLORER_BASE = 'https://sepolia.etherscan.io'

// ─── Repositories ───────────────────────────────────────────────────────────

export interface RepoInfo {
  name: string
  slug: string
  github: string
  description: string
  techStack: string
  status: string
}

export const REPOS: RepoInfo[] = [
  {
    name: 'Protocol',
    slug: 'irsb-protocol',
    github: 'https://github.com/intent-solutions-io/irsb-protocol',
    description: 'On-chain contracts: receipts, bonds, disputes, escrow',
    techStack: 'Solidity 0.8.25, Foundry',
    status: 'Deployed (Sepolia)',
  },
  {
    name: 'Solver',
    slug: 'irsb-solver',
    github: 'https://github.com/intent-solutions-io/irsb-solver',
    description: 'Execute intents, produce evidence, submit receipts',
    techStack: 'TypeScript, Express',
    status: 'v0.1.0',
  },
  {
    name: 'Watchtower',
    slug: 'irsb-watchtower',
    github: 'https://github.com/intent-solutions-io/irsb-watchtower',
    description: 'Monitor receipts, detect violations, file disputes',
    techStack: 'TypeScript, Fastify (pnpm monorepo)',
    status: 'v0.3.0 — infrastructure',
  },
  {
    name: 'Agent Passkey',
    slug: 'irsb-agent-passkey',
    github: 'https://github.com/intent-solutions-io/irsb-agent-passkey',
    description: 'Policy-gated signing via Lit Protocol PKP',
    techStack: 'TypeScript, Fastify',
    status: 'Live (Cloud Run)',
  },
]

// ─── System Status (single source of truth for badges) ──────────────────────

export type StatusLevel = 'live' | 'deployed' | 'infrastructure' | 'development' | 'planned'

export interface SystemStatus {
  label: string
  level: StatusLevel
  badgeClass: string
}

export const SYSTEM_STATUS: Record<string, SystemStatus> = {
  protocol: {
    label: 'Live on Sepolia',
    level: 'live',
    badgeClass: 'bg-green-900/50 text-green-300',
  },
  solver: {
    label: 'v0.1.0 — local execution',
    level: 'development',
    badgeClass: 'bg-zinc-700 text-zinc-400',
  },
  watchtower: {
    label: 'v0.3.0 — infrastructure complete',
    level: 'infrastructure',
    badgeClass: 'bg-yellow-900/50 text-yellow-300',
  },
  agentPasskey: {
    label: 'Live on Cloud Run',
    level: 'live',
    badgeClass: 'bg-green-900/50 text-green-300',
  },
  erc8004Registration: {
    label: 'Registered (Agent ID: 967)',
    level: 'live',
    badgeClass: 'bg-green-900/50 text-green-300',
  },
  erc8004Signals: {
    label: 'Not yet enabled',
    level: 'planned',
    badgeClass: 'bg-zinc-700 text-zinc-400',
  },
} as const

// ─── Ecosystem Banner ───────────────────────────────────────────────────────

export const ECOSYSTEM_SUMMARY = 'Four systems. One accountability layer.'

export const ECOSYSTEM_COMPONENTS = [
  { key: 'protocol', name: 'Protocol', role: 'Contracts', statusKey: 'protocol' },
  { key: 'solver', name: 'Solver', role: 'Execution', statusKey: 'solver' },
  { key: 'watchtower', name: 'Watchtower', role: 'Monitoring', statusKey: 'watchtower' },
  { key: 'agentPasskey', name: 'Agent Passkey', role: 'Signing', statusKey: 'agentPasskey' },
] as const

// ─── IntentScore Algorithm ──────────────────────────────────────────────────

export const INTENT_SCORE_WEIGHTS = {
  successRate: { weight: 40, label: 'Success Rate', calc: 'successfulTasks / totalTasks' },
  disputeWinRate: { weight: 25, label: 'Dispute Win Rate', calc: '(wins*100 + partials*50) / totalDisputes' },
  stakeFactor: { weight: 20, label: 'Stake Factor', calc: 'min(currentBond, 10 ETH) / 10 ETH' },
  longevity: { weight: 15, label: 'Longevity', calc: 'min(age, 365d) / 365d, halved if inactive 90+ days' },
  slashPenalty: { weight: -5, label: 'Slash Penalty', calc: 'slashCount * 500 bps (max 30%)' },
} as const

// ─── Roadmap Phases ─────────────────────────────────────────────────────────

export interface RoadmapPhase {
  phase: number
  title: string
  status: 'completed' | 'in-progress' | 'planned'
  items: string[]
}

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Foundation',
    status: 'completed',
    items: [
      'Core contracts deployed to Sepolia (SolverRegistry, IntentReceiptHub, DisputeModule)',
      'V1 receipts with single attestation',
      'Bond staking and deterministic slashing',
      'ERC-8004 agent registration (Agent ID: 967)',
      'TypeScript SDK and CLI tools',
      'Solver dashboard with live data',
    ],
  },
  {
    phase: 2,
    title: 'Advanced Accountability',
    status: 'in-progress',
    items: [
      'V2 receipts with dual attestation (EIP-712)',
      'Optimistic dispute resolution with counter-bonds',
      'EscrowVault for ETH + ERC20',
      'Privacy levels (public, semi-public, private)',
      'x402 HTTP payment integration package',
      'Agent Passkey signing gateway (Lit Protocol PKP)',
    ],
  },
  {
    phase: 3,
    title: 'Hardening',
    status: 'planned',
    items: [
      'Enable ERC-8004 signal publishing in production',
      'Reputation-weighted bonds',
      'Cross-chain identity resolution',
      'Watchtower v1.0 with automated dispute filing',
      'Security audit',
      'Mainnet deployment',
    ],
  },
  {
    phase: 4,
    title: 'Ecosystem Growth',
    status: 'planned',
    items: [
      'First major integration (Across, CoW, or UniswapX)',
      'Submit as ERC/EIP proposal',
      'Multi-chain deployment (Arbitrum, Base, Polygon)',
      'Decentralized arbitrator network',
      'Cross-protocol IntentScore portability',
    ],
  },
]

// ─── Standards Integration ──────────────────────────────────────────────────

export const STANDARDS = [
  {
    name: 'ERC-7683',
    role: 'Intent Format',
    description: 'Defines cross-chain intent format',
    connection: 'IRSB receipts reference intentHash from ERC-7683 orders',
  },
  {
    name: 'ERC-8004',
    role: 'Agent Registry',
    description: 'Agent identity & reputation registry',
    connection: 'IRSB is a Validation Provider — generates signals that feed the registry',
  },
  {
    name: 'x402',
    role: 'HTTP Payments',
    description: 'HTTP 402 payment protocol',
    connection: 'IRSB adds accountability to paid APIs — receipts prove service delivery',
  },
] as const

// ─── FAQ Items ──────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'technical' | 'security' | 'integration'
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is IRSB?',
    answer: 'IRSB (Intent Receipts & Solver Bonds) is the accountability layer for intent-based transactions. It provides on-chain receipts, solver bonds, and dispute resolution to answer the question: "What happens when the solver fails?"',
    category: 'general',
  },
  {
    question: 'How does IRSB relate to ERC-7683?',
    answer: 'ERC-7683 standardizes the cross-chain intent format. IRSB builds on top of it by adding accountability — receipts reference the intentHash from ERC-7683 orders, and solvers must post cryptographic proof of execution.',
    category: 'general',
  },
  {
    question: 'What is a Solver Bond?',
    answer: 'A solver bond is staked ETH collateral (minimum 0.1 ETH) that can be slashed if the solver violates protocol rules. This creates economic "skin in the game" — solvers have a financial incentive to execute intents correctly.',
    category: 'technical',
  },
  {
    question: 'How does the dispute process work?',
    answer: 'After a receipt is posted, there is a 1-hour challenge window. Anyone can open a dispute by providing evidence and a bond. Deterministic violations (timeout, wrong amount) are resolved automatically. Complex disputes use an optimistic resolution with counter-bonds and optional arbitrator escalation.',
    category: 'technical',
  },
  {
    question: 'What happens when a solver is slashed?',
    answer: 'In standard slashing, the solver\'s bond is distributed: 80% to the affected user, 15% to the challenger who filed the dispute, and 5% to the protocol treasury. After 3 jailings, the solver is permanently banned.',
    category: 'security',
  },
  {
    question: 'What is IntentScore?',
    answer: 'IntentScore is an on-chain reputation metric computed from a solver\'s execution history. It combines success rate (40%), dispute win rate (25%), stake factor (20%), and longevity (15%), minus slash penalties. Protocols can query this score to filter solvers before routing intents.',
    category: 'technical',
  },
  {
    question: 'What is ERC-8004?',
    answer: 'ERC-8004 is an Ethereum standard for trustless agent identity and reputation. IRSB acts as a Validation Provider — it publishes signals (receipt finalized, dispute outcome, slashing events) that feed into an agent\'s on-chain reputation.',
    category: 'integration',
  },
  {
    question: 'How does Agent Passkey work?',
    answer: 'Agent Passkey is a policy-gated signing gateway using Lit Protocol PKP (Programmable Key Pairs). Keys are split across 2/3 TEE nodes — no single point of compromise. It only signs typed actions (SUBMIT_RECEIPT, OPEN_DISPUTE, SUBMIT_EVIDENCE), never arbitrary data. Live on Cloud Run.',
    category: 'security',
  },
  {
    question: 'What is x402 integration?',
    answer: 'x402 is an HTTP 402 payment protocol. The irsb-x402 package bridges HTTP payments to IRSB accountability — when a paid API fulfills a request, a receipt is posted proving service delivery. This extends IRSB beyond DeFi to any HTTP-based service.',
    category: 'integration',
  },
  {
    question: 'Is IRSB audited?',
    answer: 'IRSB is currently experimental software deployed on Sepolia testnet. It has 308 passing tests including fuzz tests, but has not yet undergone a formal security audit. A security audit is planned before mainnet deployment.',
    category: 'security',
  },
  {
    question: 'Can I try IRSB today?',
    answer: 'Yes. IRSB contracts are live on Sepolia testnet. You can view live solver data on the Dashboard, install the SDK (npm install irsb), or explore the contracts on Etherscan. All code is open source under MIT license.',
    category: 'general',
  },
  {
    question: 'What chains does IRSB support?',
    answer: 'Currently Sepolia testnet only. The roadmap includes mainnet deployment followed by multi-chain expansion to Arbitrum, Base, and Polygon.',
    category: 'general',
  },
]

// ─── Use Cases ──────────────────────────────────────────────────────────────

export interface UseCase {
  title: string
  category: string
  problem: string
  solution: string
  example: string
}

export const USE_CASES: UseCase[] = [
  {
    title: 'DeFi Intent Execution',
    category: 'DeFi',
    problem: 'Users submit swap intents but have no proof solvers executed them correctly. Bad fills go unpunished.',
    solution: 'Solvers post receipts proving execution. Bonds ensure economic accountability. Disputes catch violations automatically.',
    example: 'A user submits a cross-chain swap intent. The solver executes it, posts a V2 receipt with dual attestation, and the receipt finalizes after the 1-hour challenge window.',
  },
  {
    title: 'AI Agent Accountability',
    category: 'AI Agents',
    problem: 'AI agents execute on-chain actions on behalf of users with no standardized audit trail or recourse mechanism.',
    solution: 'Agent Passkey restricts signing to typed actions only. Every signing decision is designed to produce deterministic audit artifacts. IntentScore will create portable reputation across protocols.',
    example: 'An AI trading agent would use IRSB receipts to prove every trade it executed. Its IntentScore would let new protocols trust it based on historical performance, not just identity.',
  },
  {
    title: 'x402 HTTP Payment Verification',
    category: 'x402',
    problem: 'Paid API services have no on-chain proof of delivery. Users pay but can\'t verify they got what they paid for.',
    solution: 'The irsb-x402 package bridges HTTP 402 payments to IRSB receipts. After a paid API request is fulfilled, a receipt proves service delivery on-chain.',
    example: 'A developer pays for an AI inference API call via x402. The irsb-x402 middleware automatically posts a receipt linking the payment to the response hash.',
  },
  {
    title: 'Portable Solver Reputation',
    category: 'Reputation',
    problem: 'Solver reputation is siloed within individual protocols. A solver with 10,000 successful fills on UniswapX starts at zero on Across.',
    solution: 'IRSB publishes validation signals to ERC-8004, creating portable reputation. Any protocol can query a solver\'s IntentScore before routing intents.',
    example: 'A solver registers on ERC-8004 (Agent ID: 967), executes intents through IRSB, and builds a queryable on-chain track record visible across all integrated protocols.',
  },
]

// ─── Before vs After Comparison ─────────────────────────────────────────────

export interface ComparisonRow {
  aspect: string
  before: string
  after: string
}

export const COMPARISONS: ComparisonRow[] = [
  {
    aspect: 'Execution Proof',
    before: 'No standardized proof. Solvers claim execution without verifiable evidence.',
    after: 'Cryptographic receipts with intentHash, evidenceHash, and solver signatures on-chain.',
  },
  {
    aspect: 'Solver Accountability',
    before: 'No consequences for bad fills, missed deadlines, or front-running.',
    after: 'Staked bonds (min 0.1 ETH) slashable for violations. 3 strikes = permanent ban.',
  },
  {
    aspect: 'Dispute Resolution',
    before: 'Manual, off-chain complaints. No formal process. Users are on their own.',
    after: '1-hour challenge window. Deterministic auto-slash for timeouts. Optimistic resolution with counter-bonds for complex cases.',
  },
  {
    aspect: 'Solver Reputation',
    before: 'Siloed per protocol. Opaque. Based on informal trust, not data.',
    after: 'On-chain IntentScore. Portable via ERC-8004. Weighted composite of success rate, dispute history, and stake.',
  },
  {
    aspect: 'User Compensation',
    before: 'None. Users absorb losses from bad solver behavior.',
    after: '80% of slashed bond goes to affected user. Challenger gets 15%.',
  },
  {
    aspect: 'Intent Verification',
    before: 'Users trust the solver blindly. No way to audit execution path.',
    after: 'V2 dual attestation (solver + client EIP-712 signatures). Privacy levels for sensitive data.',
  },
  {
    aspect: 'Cross-Protocol Identity',
    before: 'Solvers start from zero reputation on every new protocol.',
    after: 'ERC-8004 agent registration. IRSB publishes validation signals readable by any protocol.',
  },
  {
    aspect: 'Payment Accountability',
    before: 'HTTP payments (x402) have no proof of delivery on-chain.',
    after: 'irsb-x402 package links HTTP 402 payments to on-chain receipts proving service delivery.',
  },
  {
    aspect: 'Key Security',
    before: 'Hot wallets with private keys. Single point of compromise.',
    after: 'Lit Protocol PKP: 2/3 threshold signatures across TEE nodes. No extractable keys.',
  },
  {
    aspect: 'Signing Policy',
    before: 'Sign anything requested. No typed action constraints.',
    after: 'Only 3 typed actions allowed: SUBMIT_RECEIPT, OPEN_DISPUTE, SUBMIT_EVIDENCE. Everything else rejected.',
  },
]

// ─── Company Info ───────────────────────────────────────────────────────────

export const COMPANY = {
  name: 'Intent Solutions',
  url: 'https://intentsolutions.io',
  email: 'jeremy@intentsolutions.io',
  github: 'https://github.com/intent-solutions-io',
} as const

// ─── Navigation Structure ───────────────────────────────────────────────────

export interface NavItem {
  name: string
  href: string
  description?: string
}

export interface NavGroup {
  name: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    name: 'Learn',
    items: [
      { name: 'How It Works', href: '/how-it-works', description: 'Visual intent lifecycle in 5 steps' },
      { name: 'Use Cases', href: '/use-cases', description: 'DeFi, AI agents, x402, reputation' },
      { name: 'Before vs After', href: '/before-after', description: 'Side-by-side comparison' },
      { name: 'FAQ', href: '/faq', description: 'Common questions answered' },
      { name: 'One-Pager', href: '/one-pager', description: 'Executive summary' },
    ],
  },
  {
    name: 'Technical',
    items: [
      { name: 'Architecture', href: '/technical', description: 'Contracts, parameters, receipt structs' },
      { name: 'Security', href: '/security', description: 'Bonds, slashing, disputes, identity' },
      { name: 'Ecosystem', href: '/ecosystem', description: 'All 4 repos explained' },
      { name: 'Deployments', href: '/deployments', description: 'Live contracts on Etherscan' },
      { name: 'Roadmap', href: '/roadmap', description: '4-phase timeline' },
    ],
  },
  {
    name: 'Developers',
    items: [
      { name: 'Quickstart', href: '/developers/quickstart', description: '5-minute first receipt' },
      { name: 'SDK Reference', href: '/developers/sdk', description: 'TypeScript SDK API' },
      { name: 'x402 Guide', href: '/developers/x402', description: 'HTTP payment integration' },
      { name: 'Contract Reference', href: '/developers/contracts', description: 'ABI & event reference' },
    ],
  },
]
