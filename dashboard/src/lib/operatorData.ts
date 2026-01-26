import { ReceiptEntry } from '@/components/ReceiptHistory'
import { SlashEvent } from '@/components/SlashHistory'
import { graphqlClient, SOLVER_DETAIL_QUERY } from './graphql'

export interface OperatorData {
  // Identity
  solverId: string
  name: string
  operatorAddress: string
  metadataURI: string
  status: 'Active' | 'Jailed' | 'Inactive' | 'Banned'

  // Bond
  bondBalance: string
  availableBond: string
  lockedBond: string
  isAboveMinimum: boolean
  recentBondEvents: Array<{
    type: 'Deposit' | 'Withdrawal'
    amount: string
    timestamp: Date
  }>

  // Score
  intentScore: number
  fillRate: number
  speedScore: number
  volumeScore: number
  disputeScore: number

  // SLA Metrics
  timeoutRate: number
  disputeRate: number
  avgSettlementTime: number // seconds
  totalFills: number

  // Activity
  lastActive: Date
  registeredAt: Date

  // History
  recentReceipts: ReceiptEntry[]
  slashEvents: SlashEvent[]
}

interface SubgraphSolverDetail {
  id: string
  operator: string
  metadataURI: string
  bondBalance: string
  lockedBalance: string
  status: number
  intentScore: number
  riskScore: number
  fillRate: number
  disputeRate: number
  avgSettlementTime: number
  totalFills: number
  successfulFills: number
  lastActiveTime: string
  registrationTime: string
  receipts: Array<{
    id: string
    intentHash: string
    status: number
    postedAt: string
    finalizedAt: string | null
    settlementTime: number | null
  }>
  slashEvents: Array<{
    id: string
    receiptId: string
    amount: string
    reason: number
    timestamp: string
    txHash: string
  }>
  bondEvents: Array<{
    id: string
    eventType: string
    amount: string
    timestamp: string
  }>
}

interface SubgraphDetailResponse {
  solver: SubgraphSolverDetail | null
}

// Map status number to string
function mapStatus(status: number): 'Active' | 'Jailed' | 'Inactive' | 'Banned' {
  switch (status) {
    case 1: return 'Active'
    case 2: return 'Jailed'
    case 3: return 'Banned'
    default: return 'Inactive'
  }
}

// Map receipt status number to string
function mapReceiptStatus(status: number): 'Pending' | 'Disputed' | 'Finalized' | 'Slashed' {
  switch (status) {
    case 0: return 'Pending'
    case 1: return 'Disputed'
    case 2: return 'Finalized'
    case 3: return 'Slashed'
    default: return 'Pending'
  }
}

// Dispute reason codes
const REASON_LABELS: Record<number, string> = {
  1: 'Timeout',
  2: 'Min Output Violation',
  3: 'Wrong Token',
  4: 'Wrong Chain',
  5: 'Wrong Recipient',
  6: 'Receipt Mismatch',
  7: 'Invalid Signature',
  8: 'Subjective',
}

// Fetch solver name from metadata
async function fetchSolverName(metadataURI: string, fallback: string): Promise<string> {
  if (!metadataURI) return fallback
  try {
    const url = metadataURI.startsWith('ipfs://')
      ? `https://ipfs.io/ipfs/${metadataURI.slice(7)}`
      : metadataURI
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
    const data = await res.json()
    return data.name || fallback
  } catch {
    return fallback
  }
}

// Transform subgraph data to OperatorData
async function transformOperatorData(s: SubgraphSolverDetail): Promise<OperatorData> {
  const bondBalance = parseFloat(s.bondBalance || '0') / 1e18
  const lockedBalance = parseFloat(s.lockedBalance || '0') / 1e18
  const availableBond = bondBalance - lockedBalance
  const name = await fetchSolverName(s.metadataURI, `Solver ${s.id.slice(0, 8)}`)

  // Calculate score components (simplified)
  const fillRate = s.fillRate || 0
  const speedScore = Math.max(0, Math.min(100, ((60 - (s.avgSettlementTime || 30)) / 48) * 100))
  const volumeScore = Math.min(100, Math.log10((s.totalFills || 1) + 1) * 25)
  const disputeScore = Math.max(0, 100 - (s.disputeRate || 0) * 10)

  return {
    solverId: s.id,
    name,
    operatorAddress: s.operator,
    metadataURI: s.metadataURI,
    status: mapStatus(s.status),

    bondBalance: bondBalance.toFixed(2),
    availableBond: availableBond.toFixed(2),
    lockedBond: lockedBalance.toFixed(2),
    isAboveMinimum: bondBalance >= 0.1,
    recentBondEvents: (s.bondEvents || []).map(e => ({
      type: e.eventType === 'deposit' ? 'Deposit' as const : 'Withdrawal' as const,
      amount: (parseFloat(e.amount) / 1e18).toFixed(2),
      timestamp: new Date(parseInt(e.timestamp) * 1000),
    })),

    intentScore: s.intentScore || 0,
    fillRate,
    speedScore,
    volumeScore,
    disputeScore,

    timeoutRate: s.disputeRate || 0, // Simplified - in reality would be separate
    disputeRate: s.disputeRate || 0,
    avgSettlementTime: s.avgSettlementTime || 0,
    totalFills: s.totalFills || 0,

    lastActive: new Date(parseInt(s.lastActiveTime || '0') * 1000),
    registeredAt: new Date(parseInt(s.registrationTime || '0') * 1000),

    recentReceipts: (s.receipts || []).map(r => ({
      id: r.id,
      intentHash: r.intentHash,
      status: mapReceiptStatus(r.status),
      postedAt: new Date(parseInt(r.postedAt) * 1000),
      finalizedAt: r.finalizedAt ? new Date(parseInt(r.finalizedAt) * 1000) : null,
      settlementTime: r.settlementTime,
    })),

    slashEvents: (s.slashEvents || []).map(e => ({
      id: e.id,
      receiptId: e.receiptId,
      amount: (parseFloat(e.amount) / 1e18).toFixed(3),
      reason: REASON_LABELS[e.reason] || 'Unknown',
      reasonCode: e.reason,
      timestamp: new Date(parseInt(e.timestamp) * 1000),
      txHash: e.txHash,
    })),
  }
}

// Demo data - fallback when subgraph unavailable
const DEMO_OPERATORS: Record<string, OperatorData> = {
  '0x1234567890123456789012345678901234567890': {
    solverId: '0x1234567890123456789012345678901234567890',
    name: 'Beaver Builder',
    operatorAddress: '0xA1b2C3d4E5f6789012345678901234567890abcd',
    metadataURI: 'ipfs://QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
    status: 'Active',

    bondBalance: '5.0',
    availableBond: '4.5',
    lockedBond: '0.5',
    isAboveMinimum: true,
    recentBondEvents: [
      { type: 'Deposit', amount: '1.0', timestamp: new Date(Date.now() - 86400000 * 2) },
      { type: 'Withdrawal', amount: '0.5', timestamp: new Date(Date.now() - 86400000 * 7) },
      { type: 'Deposit', amount: '2.0', timestamp: new Date(Date.now() - 86400000 * 14) },
    ],

    intentScore: 94,
    fillRate: 99.8,
    speedScore: 95,
    volumeScore: 88,
    disputeScore: 100,

    timeoutRate: 0.2,
    disputeRate: 0,
    avgSettlementTime: 12,
    totalFills: 15420,

    lastActive: new Date(Date.now() - 60000),
    registeredAt: new Date(Date.now() - 86400000 * 90),

    recentReceipts: [
      {
        id: '0xabc123def456789012345678901234567890abcdef',
        intentHash: '0xdef456789012345678901234567890abcdef1234',
        status: 'Finalized',
        postedAt: new Date(Date.now() - 300000),
        finalizedAt: new Date(Date.now() - 240000),
        settlementTime: 12,
      },
      {
        id: '0xbcd234ef5678901234567890123456789012bcde',
        intentHash: '0xef5678901234567890123456789012bcdef12345',
        status: 'Finalized',
        postedAt: new Date(Date.now() - 600000),
        finalizedAt: new Date(Date.now() - 540000),
        settlementTime: 15,
      },
      {
        id: '0xcde345f67890123456789012345678901234cdef',
        intentHash: '0xf67890123456789012345678901234cdef123456',
        status: 'Pending',
        postedAt: new Date(Date.now() - 120000),
        finalizedAt: null,
        settlementTime: null,
      },
    ],

    slashEvents: [],
  },

  '0x6789012345678901234567890123456789012345': {
    solverId: '0x6789012345678901234567890123456789012345',
    name: 'GlueX',
    operatorAddress: '0xB2c3D4e5F6789012345678901234567890bcde',
    metadataURI: 'ipfs://QmXYZ123',
    status: 'Jailed',

    bondBalance: '0.5',
    availableBond: '0.0',
    lockedBond: '0.5',
    isAboveMinimum: true,
    recentBondEvents: [
      { type: 'Withdrawal', amount: '0.5', timestamp: new Date(Date.now() - 86400000) },
    ],

    intentScore: 45,
    fillRate: 92.1,
    speedScore: 65,
    volumeScore: 72,
    disputeScore: 20,

    timeoutRate: 5.2,
    disputeRate: 4.8,
    avgSettlementTime: 25,
    totalFills: 4100,

    lastActive: new Date(Date.now() - 86400000 * 7),
    registeredAt: new Date(Date.now() - 86400000 * 180),

    recentReceipts: [
      {
        id: '0xaaa111222333444555666777888999000111222',
        intentHash: '0x111222333444555666777888999000111222333',
        status: 'Slashed',
        postedAt: new Date(Date.now() - 86400000 * 7),
        finalizedAt: null,
        settlementTime: null,
      },
      {
        id: '0xbbb222333444555666777888999000111222333',
        intentHash: '0x222333444555666777888999000111222333444',
        status: 'Finalized',
        postedAt: new Date(Date.now() - 86400000 * 8),
        finalizedAt: new Date(Date.now() - 86400000 * 8 + 30000),
        settlementTime: 30,
      },
    ],

    slashEvents: [
      {
        id: '0xslash1',
        receiptId: '0xaaa111222333444555666777888999000111222',
        amount: '0.1',
        reason: 'Timeout',
        reasonCode: 1,
        timestamp: new Date(Date.now() - 86400000 * 7),
        txHash: '0xtx123456789',
      },
      {
        id: '0xslash2',
        receiptId: '0xprev123456789',
        amount: '0.1',
        reason: 'Min Output Violation',
        reasonCode: 2,
        timestamp: new Date(Date.now() - 86400000 * 14),
        txHash: '0xtx234567890',
      },
    ],
  },
}

// Default for unknown solvers
const DEFAULT_OPERATOR: OperatorData = {
  solverId: '0x0000000000000000000000000000000000000000',
  name: 'Unknown Operator',
  operatorAddress: '0x0000000000000000000000000000000000000000',
  metadataURI: '',
  status: 'Inactive',
  bondBalance: '0.0',
  availableBond: '0.0',
  lockedBond: '0.0',
  isAboveMinimum: false,
  recentBondEvents: [],
  intentScore: 0,
  fillRate: 0,
  speedScore: 0,
  volumeScore: 0,
  disputeScore: 0,
  timeoutRate: 0,
  disputeRate: 0,
  avgSettlementTime: 0,
  totalFills: 0,
  lastActive: new Date(0),
  registeredAt: new Date(0),
  recentReceipts: [],
  slashEvents: [],
}

export async function fetchOperatorData(solverId: string): Promise<OperatorData> {
  try {
    const data = await graphqlClient.request<SubgraphDetailResponse>(SOLVER_DETAIL_QUERY, {
      id: solverId.toLowerCase(),
    })

    if (data.solver) {
      return await transformOperatorData(data.solver)
    }
  } catch (error) {
    console.warn('Subgraph unavailable, using demo data:', error)
  }

  // Fallback to demo data
  await new Promise(resolve => setTimeout(resolve, 300))
  const demoData = DEMO_OPERATORS[solverId.toLowerCase()]
  if (demoData) return demoData

  return {
    ...DEFAULT_OPERATOR,
    solverId: solverId,
    operatorAddress: solverId,
  }
}
