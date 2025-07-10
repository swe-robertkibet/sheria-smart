"use client"

import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AuthErrorProps {
  error: {
    message: string
    code: string
  }
  onRetry?: () => void
  onGoHome?: () => void
  showRetry?: boolean
  showHome?: boolean
}

export function AuthError({ 
  error, 
  onRetry, 
  onGoHome, 
  showRetry = true, 
  showHome = true 
}: AuthErrorProps) {
  const getErrorIcon = () => {
    switch (error.code) {
      case 'TOKEN_EXPIRED':
      case 'TOKEN_INVALID':
        return <AlertTriangle className="w-16 h-16 text-orange-500" />
      case 'USER_NOT_FOUND':
        return <AlertTriangle className="w-16 h-16 text-red-500" />
      case 'NETWORK_ERROR':
        return <RefreshCw className="w-16 h-16 text-blue-500" />
      default:
        return <AlertTriangle className="w-16 h-16 text-gray-500" />
    }
  }

  const getErrorColor = () => {
    switch (error.code) {
      case 'TOKEN_EXPIRED':
      case 'TOKEN_INVALID':
        return 'border-orange-200 bg-orange-50'
      case 'USER_NOT_FOUND':
        return 'border-red-200 bg-red-50'
      case 'NETWORK_ERROR':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
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

        {/* Error Card */}
        <div className={`rounded-lg border-2 p-6 ${getErrorColor()}`}>
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            {getErrorIcon()}
          </div>

          {/* Error Message */}
          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold text-[#2D3748]">Authentication Required</h2>
            <p className="text-[#2D3748]">{error.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full bg-[#7C9885] hover:bg-[#5D7A6B] text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {showHome && onGoHome && (
              <Button 
                onClick={onGoHome}
                variant="outline"
                className="w-full border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Login
              </Button>
            )}
          </div>
        </div>

        {/* Auto-redirect notice */}
        <div className="mt-6 text-sm text-[#718096]">
          <p>You will be redirected to the login page automatically...</p>
          <div className="mt-3 w-full bg-[#F5F5F5] rounded-full h-1">
            <div 
              className="bg-[#7C9885] h-1 rounded-full"
              style={{
                width: '0%',
                animation: 'countdown 3s linear forwards'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes countdown {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}