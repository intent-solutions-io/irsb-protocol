'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useMemo } from 'react'
import { NETWORKS, DEFAULT_NETWORK, type NetworkConfig } from '@/lib/config'

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Request Docs', href: '/request-docs' },
  { name: 'Book a Call', href: '/go/book' },
]

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Network selector component
function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState(DEFAULT_NETWORK)
  const [isOpen, setIsOpen] = useState(false)

  const currentNetwork = NETWORKS[selectedNetwork]

  // Memoize network lists to avoid recomputing on every render
  const { availableNetworks, comingSoonNetworks } = useMemo(() => {
    const available: [string, NetworkConfig][] = []
    const comingSoon: [string, NetworkConfig][] = []

    Object.entries(NETWORKS).forEach(([key, config]) => {
      if (config.contracts.solverRegistry !== ZERO_ADDRESS) {
        available.push([key, config])
      } else {
        comingSoon.push([key, config])
      }
    })

    return { availableNetworks: available, comingSoonNetworks: comingSoon }
  }, [])

  const handleNetworkChange = (networkKey: string) => {
    setSelectedNetwork(networkKey)
    setIsOpen(false)
    // In a real app, you'd update the app state/context here
    // For now, just update local state
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm text-zinc-300">{currentNetwork.shortName}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Select Network
            </div>
            {availableNetworks.map(([key, network]) => (
              <button
                key={key}
                onClick={() => handleNetworkChange(key)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  key === selectedNetwork
                    ? 'bg-zinc-700 text-zinc-50'
                    : 'text-zinc-300 hover:bg-zinc-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{network.name}</span>
                  {network.isTestnet && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300">
                      Testnet
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {network.nativeToken} · Chain {network.chainId}
                </div>
              </button>
            ))}
            {/* Show coming soon networks */}
            {comingSoonNetworks.map(([key, network]) => (
                <div
                  key={key}
                  className="w-full px-3 py-2 text-left text-sm text-zinc-500 cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <span>{network.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400">
                      Soon
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-zinc-900 border-b border-zinc-700 overflow-x-hidden">
      {/* Announcement Banner */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm font-medium text-zinc-300">
            <span className="inline-flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="hidden sm:inline">Testnet Preview — Live contracts on Sepolia with sample data</span>
              <span className="sm:hidden">Testnet Preview — Sepolia</span>
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="flex w-7 h-7 sm:w-8 sm:h-8 bg-zinc-200 rounded-lg items-center justify-center">
              <span className="text-zinc-900 font-bold text-xs sm:text-sm">IR</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-zinc-50">
              IRSB
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-900/50 text-amber-300 border border-amber-700">
              Experimental
            </span>
          </Link>

          {/* Desktop Navigation Links + Network Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const isBookCall = item.href === '/go/book'

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isBookCall
                        ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        : isActive
                          ? 'bg-zinc-700 text-zinc-50'
                          : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="border-l border-zinc-700 h-6 mx-2"></div>
            <NetworkSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <NetworkSelector />
            <button
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-lg text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 active:bg-zinc-700 transition-colors touch-target-min"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-700">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isBookCall = item.href === '/go/book'

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isBookCall
                      ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-50'
                      : isActive
                        ? 'bg-zinc-700 text-zinc-50'
                        : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
