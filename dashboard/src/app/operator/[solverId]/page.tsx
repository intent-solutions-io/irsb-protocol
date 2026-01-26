import OperatorPageClient from './OperatorPageClient'

// Demo solver addresses for static export
const DEMO_SOLVER_IDS = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012',
  '0x4567890123456789012345678901234567890123',
  '0x5678901234567890123456789012345678901234',
  '0x6789012345678901234567890123456789012345',
  '0x7890123456789012345678901234567890123456',
]

export function generateStaticParams() {
  return DEMO_SOLVER_IDS.map(solverId => ({ solverId }))
}

interface PageProps {
  params: { solverId: string }
}

export default function OperatorPage({ params }: PageProps) {
  return <OperatorPageClient solverId={params.solverId} />
}
