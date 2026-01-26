'use client'

import { useEffect } from 'react'
import { config } from '@/lib/config'

export default function RequestDocsRedirect() {
  useEffect(() => {
    window.location.replace(config.requestDocsUrl)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Redirecting to contact form...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          <a href={config.requestDocsUrl} className="text-indigo-600 hover:text-indigo-500">
            Click here if not redirected
          </a>
        </p>
      </div>
    </div>
  )
}
