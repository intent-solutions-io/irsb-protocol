import { GraphQLClient } from 'graphql-request'

// Subgraph endpoints
const SUBGRAPH_URLS = {
  // The Graph Studio (decentralized)
  studio: 'https://api.studio.thegraph.com/query/YOUR_ID/irsb-protocol/version/latest',
  // The Graph Hosted Service
  hosted: 'https://api.thegraph.com/subgraphs/name/intentsolutionsio/irsb-protocol',
  // Local development
  local: 'http://localhost:8000/subgraphs/name/irsb-protocol',
}

// Use environment variable or default to hosted
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || SUBGRAPH_URLS.hosted

export const graphqlClient = new GraphQLClient(SUBGRAPH_URL)

// Solver queries
export const SOLVERS_QUERY = `
  query GetSolvers($first: Int!, $orderBy: String!, $orderDirection: String!) {
    solvers(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { status_not: 3 }
    ) {
      id
      operator
      metadataURI
      bondBalance
      lockedBalance
      status
      intentScore
      riskScore
      fillRate
      disputeRate
      avgSettlementTime
      totalFills
      successfulFills
      lastActiveTime
      registrationTime
      slashEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        amount
        reason
        timestamp
      }
    }
  }
`

export const SOLVER_DETAIL_QUERY = `
  query GetSolver($id: ID!) {
    solver(id: $id) {
      id
      operator
      metadataURI
      bondBalance
      lockedBalance
      status
      intentScore
      riskScore
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
        id
        eventType
        amount
        timestamp
      }
    }
  }
`

export const PROTOCOL_STATS_QUERY = `
  query GetProtocolStats {
    protocolStats(id: "singleton") {
      totalSolvers
      activeSolvers
      totalBonded
      totalSlashed
      totalReceipts
      totalDisputes
      resolvedDisputes
    }
  }
`
