"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"

interface AuthLoadingProps {
  message?: string
  subtitle?: string
  showProgress?: boolean
}

export function AuthLoading({ 
  message = "Logging you in...", 
  subtitle = "Please wait a moment...",
  showProgress = true 
}: AuthLoadingProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
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

        {/* Loading Animation */}
        <div className="mb-6">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#7C9885]" />
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-[#2D3748]">{message}</p>
          <p className="text-sm text-[#718096]">{subtitle}</p>
        </div>

        {/* Loading Progress Indicator */}
        {showProgress && (
          <div className="mt-8">
            <div className="w-full bg-[#F5F5F5] rounded-full h-1">
              <div 
                className="bg-[#7C9885] h-1 rounded-full animate-pulse"
                style={{
                  width: '60%',
                  animation: 'loading-progress 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% { width: 30%; }
          50% { width: 80%; }
          100% { width: 30%; }
        }
      `}</style>
    </div>
  )
}