'use client'

import { useState, useEffect } from 'react'
import SolverTable from '@/components/SolverTable'
import StatsCards from '@/components/StatsCards'
import { Solver, fetchSolverData } from '@/lib/solverData'

export default function Home() {
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                IRSB Solver Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Intent Solver Reputation & Performance Tracking
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Sepolia Testnet
              </span>
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

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

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            IRSB Protocol - The Credit Score Layer for Intent Solvers
          </p>
          <p className="mt-1">
            <a
              href="https://github.com/intent-solutions-io/irsb-protocol"
              className="text-indigo-600 hover:text-indigo-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {' · '}
            <a
              href="mailto:jeremy@intentsolutions.io"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Contact
            </a>
          </p>
        </footer>
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
