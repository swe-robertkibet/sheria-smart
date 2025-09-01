"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"

interface AuthLoadingProps {
  message?: string
  subtitle?: string
  showProgress?: boolean
}

export function AuthLoading({ 
  message = "Sheria Smart", 
  subtitle = "Checking your session...",
  showProgress = true
}: AuthLoadingProps) {
  return (
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

        {/* Simple Loading Animation */}
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin mx-auto"></div>
        </div>

        {/* Loading Message */}
        <div className="space-y-3">
          <p className="text-sm text-[#718096]">{subtitle}</p>
        </div>

        {/* Simple Progress Indicator */}
        {showProgress && (
          <div className="mt-8">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#C99383] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}