'use client'

export interface ReceiptEntry {
  id: string
  intentHash: string
  status: 'Pending' | 'Disputed' | 'Finalized' | 'Slashed'
  postedAt: Date
  finalizedAt: Date | null
  settlementTime: number | null // seconds
}

interface ReceiptHistoryProps {
  receipts: ReceiptEntry[]
}

export default function ReceiptHistory({ receipts }: ReceiptHistoryProps) {
  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Disputed: 'bg-red-100 text-red-800',
    Finalized: 'bg-green-100 text-green-800',
    Slashed: 'bg-red-200 text-red-900',
  }

  const statusIcons: Record<string, string> = {
    Pending: '⏳',
    Disputed: '⚠️',
    Finalized: '✓',
    Slashed: '✗',
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Receipts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last {receipts.length} intent executions
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Finalized: {receipts.filter(r => r.status === 'Finalized').length}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
              Pending: {receipts.filter(r => r.status === 'Pending').length}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Issues: {receipts.filter(r => r.status === 'Disputed' || r.status === 'Slashed').length}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Receipt ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Intent Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Posted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Settlement Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {receipts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No receipts found
                </td>
              </tr>
            ) : (
              receipts.map(receipt => (
                <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {receipt.id.slice(0, 10)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {receipt.intentHash.slice(0, 10)}...
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[receipt.status]}`}
                    >
                      <span className="mr-1">{statusIcons[receipt.status]}</span>
                      {receipt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatTimeSince(receipt.postedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {receipt.settlementTime !== null ? (
                      <span className={receipt.settlementTime < 60 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}>
                        {formatDuration(receipt.settlementTime)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Success Rate Summary */}
      {receipts.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Success Rate: {calculateSuccessRate(receipts)}%
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Avg Settlement: {calculateAvgSettlement(receipts)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function calculateSuccessRate(receipts: ReceiptEntry[]): string {
  if (receipts.length === 0) return '0'
  const finalized = receipts.filter(r => r.status === 'Finalized').length
  return ((finalized / receipts.length) * 100).toFixed(1)
}

function calculateAvgSettlement(receipts: ReceiptEntry[]): string {
  const withSettlement = receipts.filter(r => r.settlementTime !== null)
  if (withSettlement.length === 0) return '—'
  const avg = withSettlement.reduce((sum, r) => sum + (r.settlementTime || 0), 0) / withSettlement.length
  return formatDuration(Math.round(avg))
}
