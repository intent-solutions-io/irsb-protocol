import Link from 'next/link'
import { config, getEtherscanUrl, shortenAddress } from '@/lib/config'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-50 tracking-tight">
              IRSB Protocol
            </h1>
            <p className="mt-2 text-xl sm:text-2xl font-medium text-zinc-200">
              The accountability layer for intent-based transactions
            </p>
            <p className="mt-4 text-lg italic text-zinc-300">
              "Intents need receipts. Solvers need skin in the game."
            </p>
            <p className="mt-6 max-w-2xl mx-auto text-base text-zinc-400">
              ERC-7683 standardizes intents. IRSB standardizes what happens when solvers fail.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/go/request-docs"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-900 bg-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Request Docs
              </Link>
              <Link
                href="/go/book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-300 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 transition-colors"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 lg:py-24 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              The Problem
            </h2>
            <p className="mt-6 text-2xl font-semibold text-red-400">
              "What happens when the solver fails?"
            </p>
            <p className="mt-4 text-lg text-zinc-300">
              Today: <span className="text-zinc-100">Nothing.</span> Users lose money. Solvers face no consequences. Trust is informal.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Delegated Execution</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Users express intent; solvers decide how to fulfill it. Outcomes are opaque.
              </p>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Opaque Routing</h3>
              <p className="mt-2 text-sm text-zinc-400">
                No standardized proof of execution. Users can't verify what actually happened.
              </p>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Weak Enforcement</h3>
              <p className="mt-2 text-sm text-zinc-400">
                When solvers underperform or misbehave, there's no recourse mechanism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What IRSB Adds */}
      <section className="py-16 lg:py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              What IRSB Adds
            </h2>
            <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
              Four primitives that bring accountability to intent execution.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">
                Verifiable Receipts
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Solvers post cryptographic receipts proving they executed an intent.
                Receipts are on-chain, immutable, and auditable.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">
                Solver Bonds
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Solvers stake collateral that can be slashed for violations.
                Economic skin-in-the-game aligns incentives.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">
                Deterministic Enforcement
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Timeout, constraint violations, and signature failures trigger
                automatic slashing. No manual intervention needed.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">
                Portable Reputation
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                IntentScore — a queryable on-chain signal derived from execution
                history. Protocols can filter solvers by track record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Work */}
      <section className="py-16 lg:py-24 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              Proof of Work
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Deployed and testable on Sepolia today.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-zinc-900 bg-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Open Dashboard
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <a
              href={getEtherscanUrl(config.contracts.solverRegistry)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-700/60 transition-colors group text-center"
            >
              <p className="text-sm font-medium text-zinc-50">SolverRegistry</p>
              <p className="mt-1 font-mono text-xs text-zinc-400 group-hover:text-zinc-200">
                {shortenAddress(config.contracts.solverRegistry)} ↗
              </p>
            </a>
            <a
              href={getEtherscanUrl(config.contracts.intentReceiptHub)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-700/60 transition-colors group text-center"
            >
              <p className="text-sm font-medium text-zinc-50">IntentReceiptHub</p>
              <p className="mt-1 font-mono text-xs text-zinc-400 group-hover:text-zinc-200">
                {shortenAddress(config.contracts.intentReceiptHub)} ↗
              </p>
            </a>
            <a
              href={getEtherscanUrl(config.contracts.disputeModule)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-700/60 transition-colors group text-center"
            >
              <p className="text-sm font-medium text-zinc-50">DisputeModule</p>
              <p className="mt-1 font-mono text-xs text-zinc-400 group-hover:text-zinc-200">
                {shortenAddress(config.contracts.disputeModule)} ↗
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 lg:py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              Who It's For
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Protocol Teams
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Add accountability to your intent system without building enforcement from scratch.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Solver / Relayer Operators
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Build verifiable reputation. Stand out from anonymous competition.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Wallets & Agents
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Query solver reputation before routing. Protect users automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 lg:py-20 bg-zinc-800 border-y border-zinc-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50">
            Interested in piloting IRSB?
          </h2>
          <p className="mt-4 text-lg text-zinc-300">
            We're working with early partners to test integration patterns.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/go/request-docs"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-900 bg-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Request Docs
            </Link>
            <Link
              href="/go/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-200 border-2 border-zinc-400 hover:bg-zinc-700 transition-colors"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-900 font-bold text-sm">IR</span>
                </div>
                <span className="text-lg font-bold text-zinc-50">IRSB</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                The accountability layer for intent-based transactions.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200">
                    Solver Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/request-docs" className="text-sm text-zinc-400 hover:text-zinc-200">
                    Request Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-50 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`mailto:${config.email}`} className="text-sm text-zinc-400 hover:text-zinc-200">
                    {config.email}
                  </a>
                </li>
                <li>
                  <a href={config.companyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-zinc-200">
                    {config.company}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-700">
            <p className="text-xs text-zinc-500 text-center">
              This is experimental software on Sepolia testnet. Not audited. Do not use with mainnet funds.
            </p>
            <p className="mt-2 text-xs text-zinc-600 text-center">
              © 2026 {config.company}
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
