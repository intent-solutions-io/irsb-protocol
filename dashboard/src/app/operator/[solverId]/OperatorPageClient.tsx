'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BondStatusWidget from '@/components/BondStatusWidget'
import ReceiptHistory from '@/components/ReceiptHistory'
import SlashHistory from '@/components/SlashHistory'
import { fetchOperatorData, OperatorData } from '@/lib/operatorData'

// Validate and sanitize metadata URI for safe rendering
function getSafeMetadataUrl(uri: string): string | null {
  if (!uri) return null

  // IPFS URIs are safe - convert to gateway
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`
  }

  try {
    const url = new URL(uri)
    // Only allow HTTPS
    if (url.protocol !== 'https:') return null
    // Block dangerous protocols that made it through
    if (uri.toLowerCase().startsWith('javascript:')) return null
    if (uri.toLowerCase().startsWith('data:')) return null
    return uri
  } catch {
    return null
  }
}

interface OperatorPageClientProps {
  solverId: string
}

export default function OperatorPageClient({ solverId }: OperatorPageClientProps) {
  const [data, setData] = useState<OperatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const operatorData = await fetchOperatorData(solverId)
        setData(operatorData)
      } catch (err) {
        setError('Failed to load operator data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (solverId) {
      loadData()
    }
  }, [solverId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading operator data...</p>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Operator not found'}</p>
          <Link href="/" className="mt-4 text-indigo-600 hover:text-indigo-500">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  ← Back
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.name || 'Relayer Operator'}
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-mono">
                {solverId.slice(0, 10)}...{solverId.slice(-8)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={data.status} />
              <ScoreBadge score={data.intentScore} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row: Bond + SLA Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bond Status */}
          <BondStatusWidget
            totalBond={data.bondBalance}
            availableBond={data.availableBond}
            lockedBond={data.lockedBond}
            isAboveMinimum={data.isAboveMinimum}
            bondEvents={data.recentBondEvents}
          />

          {/* SLA Metrics */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SLA Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Fill Rate"
                value={`${data.fillRate.toFixed(1)}%`}
                trend={data.fillRate >= 95 ? 'good' : data.fillRate >= 80 ? 'warning' : 'bad'}
              />
              <MetricCard
                label="Timeout Rate"
                value={`${data.timeoutRate.toFixed(2)}%`}
                trend={data.timeoutRate < 1 ? 'good' : data.timeoutRate < 5 ? 'warning' : 'bad'}
              />
              <MetricCard
                label="Dispute Rate"
                value={`${data.disputeRate.toFixed(2)}%`}
                trend={data.disputeRate < 1 ? 'good' : data.disputeRate < 3 ? 'warning' : 'bad'}
              />
              <MetricCard
                label="Avg Settlement"
                value={formatTime(data.avgSettlementTime)}
                trend={data.avgSettlementTime < 60 ? 'good' : data.avgSettlementTime < 300 ? 'warning' : 'bad'}
              />
            </div>
          </div>
        </div>

        {/* Intent Score Visualization */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              IntentScore Breakdown
            </h3>
            <span className="text-3xl font-bold text-indigo-600">{data.intentScore}</span>
          </div>
          <div className="space-y-3">
            <ScoreBar label="Success Rate" value={data.fillRate} weight={40} />
            <ScoreBar label="Speed" value={data.speedScore} weight={20} />
            <ScoreBar label="Volume" value={data.volumeScore} weight={20} />
            <ScoreBar label="Dispute Score" value={data.disputeScore} weight={20} />
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Score decays by 50% every 30 days of inactivity. Last active: {formatTimeSince(data.lastActive)}
          </p>
        </div>

        {/* Recent Receipts */}
        <div className="mt-6">
          <ReceiptHistory receipts={data.recentReceipts} />
        </div>

        {/* Slash History */}
        <div className="mt-6">
          <SlashHistory slashEvents={data.slashEvents} />
        </div>

        {/* Contract Links */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Verification
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://sepolia.etherscan.io/address/${data.operatorAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm"
            >
              View on Etherscan ↗
            </a>
            {getSafeMetadataUrl(data.metadataURI) && (
              <a
                href={getSafeMetadataUrl(data.metadataURI)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm"
              >
                View Metadata ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Jailed: 'bg-red-100 text-red-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Banned: 'bg-red-200 text-red-900',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.Inactive}`}>
      {status}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass = 'bg-green-100 text-green-800'
  if (score < 50) colorClass = 'bg-red-100 text-red-800'
  else if (score < 75) colorClass = 'bg-yellow-100 text-yellow-800'

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorClass}`}>
      Score: {score}
    </span>
  )
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend: 'good' | 'warning' | 'bad'
}) {
  const trendColors = {
    good: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    bad: 'text-red-600 dark:text-red-400',
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${trendColors[trend]}`}>{value}</p>
    </div>
  )
}

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  const contribution = (value / 100) * weight
  const percentage = Math.min(100, value)

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white font-medium">
          +{contribution.toFixed(1)} ({weight}% weight)
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
