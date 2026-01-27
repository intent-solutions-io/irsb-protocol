import OperatorPageClient from './OperatorPageClient'

// Real testnet solver addresses (registered on Sepolia)
const TESTNET_SOLVER_IDS = [
  '0x83A5F432f02B1503765bB61a9B358942d87c9dc0', // IRSB Test Solver
]

export function generateStaticParams() {
  return TESTNET_SOLVER_IDS.map(solverId => ({ solverId }))
}

interface PageProps {
  params: { solverId: string }
}

export default function OperatorPage({ params }: PageProps) {
  return <OperatorPageClient solverId={params.solverId} />
}
