'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Request Docs', href: '/request-docs' },
  { name: 'Book a Call', href: '/go/book' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-zinc-900 border-b border-zinc-700">
      {/* Announcement Banner */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm font-medium text-zinc-300">
            <span className="inline-flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sepolia testnet live
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="hidden sm:flex w-8 h-8 bg-zinc-200 rounded-lg items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">IR</span>
            </div>
            <span className="text-xl font-bold text-zinc-50">
              IRSB
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-900/50 text-amber-300 border border-amber-700">
              Experimental
            </span>
          </Link>

          {/* Navigation Links */}
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
        </div>
      </div>
    </nav>
  )
}
