export interface Solver {
  address: string
  name: string
  intentScore: number
  fillRate: number
  avgSpeed: number // seconds
  totalIntents: number
  slashingEvents: number
  bondAmount: string
  status: 'active' | 'jailed' | 'inactive'
  lastActive: Date
}

// Calculate IntentScore based on metrics
// Formula: (SuccessRate × 0.4) + (SpeedScore × 0.2) + (VolumeScore × 0.2) + (DisputeScore × 0.2)
export function calculateIntentScore(solver: {
  fillRate: number
  avgSpeed: number
  totalIntents: number
  slashingEvents: number
}): number {
  // Success rate component (0-40)
  const successScore = solver.fillRate * 0.4

  // Speed score: faster = better, normalize to 0-100 (12s = 100, 60s = 0)
  const speedNormalized = Math.max(0, Math.min(100, ((60 - solver.avgSpeed) / 48) * 100))
  const speedScore = speedNormalized * 0.002 // 0-20

  // Volume score: logarithmic scale
  const volumeNormalized = Math.min(100, Math.log10(solver.totalIntents + 1) * 25)
  const volumeScore = volumeNormalized * 0.002 // 0-20

  // Dispute score: fewer slashing events = better
  const disputeNormalized = Math.max(0, 100 - solver.slashingEvents * 20)
  const disputeScore = disputeNormalized * 0.002 // 0-20

  return Math.round(successScore + speedScore + volumeScore + disputeScore)
}

// Demo data - in production this would come from The Graph or contract reads
const DEMO_SOLVERS: Solver[] = [
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Beaver Builder',
    intentScore: 94,
    fillRate: 99.8,
    avgSpeed: 12,
    totalIntents: 15420,
    slashingEvents: 0,
    bondAmount: '5.0',
    status: 'active',
    lastActive: new Date(Date.now() - 60000),
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    name: 'PMM Solver',
    intentScore: 91,
    fillRate: 99.2,
    avgSpeed: 15,
    totalIntents: 12350,
    slashingEvents: 1,
    bondAmount: '3.5',
    status: 'active',
    lastActive: new Date(Date.now() - 120000),
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    name: 'CowDAO Solver',
    intentScore: 87,
    fillRate: 98.1,
    avgSpeed: 18,
    totalIntents: 28900,
    slashingEvents: 3,
    bondAmount: '10.0',
    status: 'active',
    lastActive: new Date(Date.now() - 300000),
  },
  {
    address: '0x4567890123456789012345678901234567890123',
    name: 'Flashbots Relay',
    intentScore: 89,
    fillRate: 98.9,
    avgSpeed: 14,
    totalIntents: 8750,
    slashingEvents: 1,
    bondAmount: '2.0',
    status: 'active',
    lastActive: new Date(Date.now() - 180000),
  },
  {
    address: '0x5678901234567890123456789012345678901234',
    name: 'MEV Blocker',
    intentScore: 85,
    fillRate: 97.5,
    avgSpeed: 20,
    totalIntents: 6200,
    slashingEvents: 2,
    bondAmount: '1.5',
    status: 'active',
    lastActive: new Date(Date.now() - 600000),
  },
  {
    address: '0x6789012345678901234567890123456789012345',
    name: 'GlueX',
    intentScore: 45,
    fillRate: 92.1,
    avgSpeed: 25,
    totalIntents: 4100,
    slashingEvents: 8,
    bondAmount: '0.5',
    status: 'jailed',
    lastActive: new Date(Date.now() - 86400000 * 7),
  },
  {
    address: '0x7890123456789012345678901234567890123456',
    name: 'Barter',
    intentScore: 0,
    fillRate: 0,
    avgSpeed: 0,
    totalIntents: 2890,
    slashingEvents: 15,
    bondAmount: '0.0',
    status: 'inactive',
    lastActive: new Date(Date.now() - 86400000 * 30),
  },
]

export async function fetchSolverData(): Promise<Solver[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // In production, this would:
  // 1. Query The Graph for CoWSwap settlement events
  // 2. Read IRSB SolverRegistry for bond/status info
  // 3. Calculate IntentScores from on-chain data

  return DEMO_SOLVERS.sort((a, b) => b.intentScore - a.intentScore)
}

export function getScoreClass(score: number): string {
  if (score >= 90) return 'score-excellent'
  if (score >= 75) return 'score-good'
  if (score >= 50) return 'score-warning'
  return 'score-danger'
}

export function getStatusColor(status: Solver['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'jailed':
      return 'bg-red-100 text-red-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
  }
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
