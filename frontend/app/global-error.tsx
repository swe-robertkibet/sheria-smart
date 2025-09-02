'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#FEFCF3] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Image
                src="/sheria-smart-ico.png"
                alt="Sheria Smart Icon"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="text-2xl font-bold">
                <span className="text-[#7C9885]">Sheria</span>
                <span className="text-[#C99383]"> Smart</span>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-semibold text-[#2D3748] mb-4">
                Something went wrong
              </h1>
              <p className="text-[#718096] mb-8">
                We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
              </p>
              
              {/* Error details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left text-sm text-red-600 bg-red-50 p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 overflow-auto">{error.message}</pre>
                  {error.digest && (
                    <p className="mt-2 text-xs text-gray-500">Digest: {error.digest}</p>
                  )}
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={reset}
                className="bg-[#7C9885] hover:bg-[#5D7A6B] text-white flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white flex items-center gap-2"
              >
                <Link href="/">
                  <Home size={16} />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}