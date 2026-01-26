import { ReceiptEntry } from '@/components/ReceiptHistory'
import { SlashEvent } from '@/components/SlashHistory'

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

// Demo data - in production, this would query The Graph
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
      {
        id: '0xdef4567890123456789012345678901234567def',
        intentHash: '0x67890123456789012345678901234567def12345',
        status: 'Finalized',
        postedAt: new Date(Date.now() - 900000),
        finalizedAt: new Date(Date.now() - 840000),
        settlementTime: 10,
      },
      {
        id: '0xefg567890123456789012345678901234567890e',
        intentHash: '0x890123456789012345678901234567890efg1234',
        status: 'Finalized',
        postedAt: new Date(Date.now() - 1200000),
        finalizedAt: new Date(Date.now() - 1140000),
        settlementTime: 18,
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
      {
        id: '0xccc333444555666777888999000111222333444',
        intentHash: '0x333444555666777888999000111222333444555',
        status: 'Disputed',
        postedAt: new Date(Date.now() - 86400000 * 9),
        finalizedAt: null,
        settlementTime: null,
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
      {
        id: '0xslash3',
        receiptId: '0xprev234567890',
        amount: '0.1',
        reason: 'Timeout',
        reasonCode: 1,
        timestamp: new Date(Date.now() - 86400000 * 21),
        txHash: '0xtx345678901',
      },
    ],
  },
}

// Add default for any unknown solver ID
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // In production, this would:
  // 1. Query The Graph subgraph for solver data
  // 2. Fetch receipts and slash events
  // 3. Calculate real-time scores

  // For demo, return mock data or default
  const data = DEMO_OPERATORS[solverId.toLowerCase()] || {
    ...DEFAULT_OPERATOR,
    solverId: solverId,
    operatorAddress: solverId,
  }

  return data
}

// Query example for production:
/*
const OPERATOR_QUERY = `
  query OperatorData($solverId: Bytes!) {
    solver(id: $solverId) {
      id
      operator
      metadataURI
      bondBalance
      lockedBalance
      status
      riskScore
      intentScore
      fillRate
      disputeRate
      avgSettlementTime
      totalFills
      successfulFills
      lastActiveTime
      registrationTime

      receipts(first: 20, orderBy: postedAt, orderDirection: desc) {
        id
        intentHash
        status
        postedAt
        finalizedAt
        settlementTime
      }

      slashEvents(first: 20, orderBy: timestamp, orderDirection: desc) {
        id
        receiptId
        amount
        reason
        timestamp
        txHash
      }

      bondEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
        eventType
        amount
        timestamp
      }
    }
  }
`
*/
