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
              Receipts, bonds, and disputes for intent-based transactions
            </p>
            <p className="mt-6 max-w-2xl mx-auto text-base text-zinc-400">
              ERC-7683 standardizes intents. IRSB standardizes what happens when solvers fail.
              On-chain proof of execution, slashable bonds, and deterministic dispute resolution.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-started"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-900 bg-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-zinc-300 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What IRSB Adds — 4 primitives */}
      <section className="py-16 lg:py-24 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              Four Primitives
            </h2>
            <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
              IRSB adds accountability to any intent execution system.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Receipts</h3>
              <p className="mt-2 text-sm text-zinc-400">
                On-chain cryptographic proof of intent execution. V1 single-sig, V2 dual attestation with EIP-712.
              </p>
            </div>

            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Bonds</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Solvers stake collateral (minimum 0.1 ETH). Slashable for violations. 80% goes to the affected user.
              </p>
            </div>

            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Disputes</h3>
              <p className="mt-2 text-sm text-zinc-400">
                1-hour challenge window. Deterministic auto-slash for timeouts. Optimistic resolution with counter-bonds.
              </p>
            </div>

            <div className="bg-zinc-800/60 rounded-xl p-6 border border-zinc-700">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-zinc-50">Reputation</h3>
              <p className="mt-2 text-sm text-zinc-400">
                IntentScore: on-chain composite metric from execution history. Portable via ERC-8004 agent registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployed & Verifiable */}
      <section className="py-16 lg:py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              Deployed on Sepolia
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              3 contracts verified on Etherscan. 308 passing tests. Open source.
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
                {shortenAddress(config.contracts.solverRegistry)} &#8599;
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
                {shortenAddress(config.contracts.intentReceiptHub)} &#8599;
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
                {shortenAddress(config.contracts.disputeModule)} &#8599;
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Audience Entry Points */}
      <section className="py-16 lg:py-24 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-50">
              Where to Start
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Understand the Protocol
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Read the one-pager, see what changes before vs after, review the roadmap.
              </p>
              <Link
                href="/one-pager"
                className="mt-4 inline-block text-sm font-medium text-zinc-200 hover:text-zinc-50"
              >
                One-Pager &rarr;
              </Link>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Explore the Architecture
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Contracts, parameters, security model, deployed addresses, all 4 repos.
              </p>
              <Link
                href="/technical"
                className="mt-4 inline-block text-sm font-medium text-zinc-200 hover:text-zinc-50"
              >
                Architecture &rarr;
              </Link>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">
                Build with IRSB
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Install the SDK, post your first receipt, integrate x402 payments.
              </p>
              <Link
                href="/developers/quickstart"
                className="mt-4 inline-block text-sm font-medium text-zinc-200 hover:text-zinc-50"
              >
                Quickstart &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 lg:py-20 bg-zinc-900 border-y border-zinc-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50">
            Interested in integrating IRSB?
          </h2>
          <p className="mt-4 text-lg text-zinc-300">
            We are working with early partners to test integration patterns.
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
    </main>
  )
}
