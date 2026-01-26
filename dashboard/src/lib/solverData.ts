import { graphqlClient, SOLVERS_QUERY, PROTOCOL_STATS_QUERY } from './graphql'

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

interface SubgraphSolver {
  id: string
  operator: string
  metadataURI: string
  bondBalance: string
  status: number
  intentScore: number
  fillRate: number
  avgSettlementTime: number
  totalFills: number
  lastActiveTime: string
  slashEvents: Array<{ id: string }>
}

interface SubgraphResponse {
  solvers: SubgraphSolver[]
}

// Map subgraph status enum to our status
function mapStatus(status: number): 'active' | 'jailed' | 'inactive' {
  switch (status) {
    case 1: return 'active'
    case 2: return 'jailed'
    default: return 'inactive'
  }
}

// Allowed IPFS gateways for metadata fetching
const ALLOWED_IPFS_GATEWAYS = [
  'https://ipfs.io',
  'https://gateway.pinata.cloud',
  'https://cloudflare-ipfs.com',
  'https://dweb.link',
]

// Validate URL to prevent SSRF attacks
function isValidMetadataUrl(uri: string): boolean {
  // Only allow IPFS URIs (we convert them to safe gateways)
  if (uri.startsWith('ipfs://')) return true

  try {
    const url = new URL(uri)

    // Only allow HTTPS
    if (url.protocol !== 'https:') return false

    // Block private/internal IP ranges
    const hostname = url.hostname.toLowerCase()

    // Block localhost and common internal hostnames
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') return false
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return false

    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') return false

    // Block private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
    const ipMatch = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
    if (ipMatch) {
      const [, a, b] = ipMatch.map(Number)
      if (a === 10) return false
      if (a === 172 && b >= 16 && b <= 31) return false
      if (a === 192 && b === 168) return false
      if (a === 127) return false
      if (a === 169 && b === 254) return false
    }

    return true
  } catch {
    return false
  }
}

// Try to fetch solver name from metadata URI (IPFS/HTTP)
async function fetchSolverName(metadataURI: string, fallback: string): Promise<string> {
  if (!metadataURI) return fallback

  // Validate URL before fetching (SSRF prevention)
  if (!isValidMetadataUrl(metadataURI)) return fallback

  try {
    // Convert IPFS URI to safe HTTP gateway
    const url = metadataURI.startsWith('ipfs://')
      ? `${ALLOWED_IPFS_GATEWAYS[0]}/ipfs/${metadataURI.slice(7)}`
      : metadataURI
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
    const data = await res.json()
    return data.name || fallback
  } catch {
    return fallback
  }
}

// Transform subgraph data to our Solver interface
async function transformSolver(s: SubgraphSolver): Promise<Solver> {
  const name = await fetchSolverName(s.metadataURI, `Solver ${s.id.slice(0, 8)}`)
  return {
    address: s.id,
    name,
    intentScore: s.intentScore || 0,
    fillRate: s.fillRate || 0,
    avgSpeed: s.avgSettlementTime || 0,
    totalIntents: s.totalFills || 0,
    slashingEvents: s.slashEvents?.length || 0,
    bondAmount: (parseFloat(s.bondBalance || '0') / 1e18).toFixed(2),
    status: mapStatus(s.status),
    lastActive: new Date(parseInt(s.lastActiveTime || '0') * 1000),
  }
}

// Demo data fallback when subgraph unavailable
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
  try {
    const data = await graphqlClient.request<SubgraphResponse>(SOLVERS_QUERY, {
      first: 100,
      orderBy: 'intentScore',
      orderDirection: 'desc',
    })

    if (data.solvers && data.solvers.length > 0) {
      const solvers = await Promise.all(data.solvers.map(transformSolver))
      return solvers.sort((a, b) => b.intentScore - a.intentScore)
    }
  } catch (error) {
    console.warn('Subgraph unavailable, using demo data:', error)
  }

  // Fallback to demo data
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate delay
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
