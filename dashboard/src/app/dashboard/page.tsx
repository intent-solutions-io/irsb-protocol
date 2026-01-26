'use client'

import { useState, useEffect } from 'react'
import SolverTable from '@/components/SolverTable'
import StatsCards from '@/components/StatsCards'
import { Solver, fetchSolverData } from '@/lib/solverData'

export default function DashboardPage() {
  const [solvers, setSolvers] = useState<Solver[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSolverData()
        setSolvers(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to fetch solver data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Solver Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Real-time reputation and performance tracking
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsCards solvers={solvers} loading={loading} />

        {/* Solver Table */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Registered Solvers
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sorted by IntentScore (highest first)
              </p>
            </div>
            <SolverTable solvers={solvers} loading={loading} />
          </div>
        </div>

        {/* Contract Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            IRSB Protocol Contracts (Sepolia)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContractLink
              name="SolverRegistry"
              address="0xB6ab964832808E49635fF82D1996D6a888ecB745"
            />
            <ContractLink
              name="IntentReceiptHub"
              address="0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c"
            />
            <ContractLink
              name="DisputeModule"
              address="0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function ContractLink({ name, address }: { name: string; address: string }) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const etherscanUrl = `https://sepolia.etherscan.io/address/${address}`

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
      <a
        href={etherscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-indigo-600 hover:text-indigo-500 font-mono"
      >
        {shortAddress} ↗
      </a>
    </div>
  )
}
