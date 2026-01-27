'use client'

import Link from 'next/link'
import { Solver, getScoreClass, getStatusColor, formatAddress, formatTimeSince } from '@/lib/solverData'

interface SolverTableProps {
  solvers: Solver[]
  loading: boolean
}

export default function SolverTable({ solvers, loading }: SolverTableProps) {
  if (loading) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-200 mx-auto"></div>
        <p className="mt-4 text-sm text-zinc-400">Loading solver data...</p>
      </div>
    )
  }

  if (solvers.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-zinc-400">No solvers registered yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-700">
        <thead className="bg-zinc-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Solver
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              IntentScore
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Fill Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Avg Speed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Total Intents
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Slashing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Bond
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Last Active
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-zinc-800 divide-y divide-zinc-700">
          {solvers.map((solver, index) => (
            <tr key={solver.address} className="hover:bg-zinc-700/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-50">
                #{index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/operator/${solver.address}`} className="flex items-center group">
                  <div>
                    <div className="text-sm font-medium text-zinc-50 group-hover:text-zinc-200">
                      {solver.name}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono group-hover:text-zinc-400">
                      {formatAddress(solver.address)}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`score-badge ${getScoreClass(solver.intentScore)}`}>
                  {solver.intentScore}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-50">
                {solver.fillRate.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-50">
                {solver.avgSpeed}s
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-50">
                {solver.totalIntents.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {solver.slashingEvents > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-700">
                    {solver.slashingEvents}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                    0
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-50">
                {solver.bondAmount} ETH
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(solver.status)}`}>
                  {solver.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                {formatTimeSince(solver.lastActive)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/operator/${solver.address}`}
                  className="text-zinc-200 hover:text-zinc-50 font-medium"
                >
                  View Details →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
