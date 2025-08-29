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

        {/* Loading Animation */}
        <div className="mb-6">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#7C9885]" />
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
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}