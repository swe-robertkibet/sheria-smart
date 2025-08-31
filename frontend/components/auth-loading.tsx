"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getRandomLawQuote, type LawQuote } from "@/lib/law-quotes"

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
  const [lawQuote, setLawQuote] = useState<LawQuote | null>(null)

  useEffect(() => {
    setLawQuote(getRandomLawQuote())
  }, [])
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

        {/* Enhanced Loading Animation */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-16 h-16 mx-auto relative">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin-slow"></div>
              
              {/* Inner logo area */}
              <div className="absolute inset-2 bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-full flex items-center justify-center animate-skeleton-pulse">
                <div className="text-white font-bold text-sm">S</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-3">
          <p className="text-sm text-[#718096]">{subtitle}</p>
          
          {/* Random Law Quote */}
          <div className="border-t border-[#E2E8F0] pt-4 mt-4">
            {lawQuote ? (
              <div className="animate-fade-in">
                <blockquote className="text-sm italic text-[#718096] leading-relaxed">
                  "{lawQuote.text}"
                </blockquote>
                <cite className="text-xs text-[#A0AEC0] mt-2 block">
                  — {lawQuote.author}
                </cite>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 bg-[#F7FAFC] rounded mb-2"></div>
                <div className="h-3 bg-[#F7FAFC] rounded w-24"></div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        {showProgress && (
          <div className="mt-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7C9885] to-[#C99383] rounded-full animate-wave"></div>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2">
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