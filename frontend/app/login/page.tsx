"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, ArrowLeft, Shield, CheckCircle, Loader2, AlertTriangle, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FloatingIcons } from "@/components/floating-icons"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  // OAuth-only authentication - no password field needed
  const [isLoading, setIsLoading] = useState(false)
  // OAuth-only authentication - no email form needed

  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading, authError, isValidatingToken, clearAuthError } = useAuth()

  // Clear auth error on mount if user navigated here manually
  useEffect(() => {
    if (authError) {
      clearAuthError()
    }
  }, [])
  
  // Redirect if already authenticated (after token validation is complete)
  useEffect(() => {
    if (isAuthenticated && !isValidatingToken && !authLoading) {
      console.log('Already authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [isAuthenticated, isValidatingToken, authLoading, router])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await login()
    } catch (error) {
      console.error('Google login failed:', error)
      setIsLoading(false)
    }
  }

  // OAuth-only authentication - no email form submission needed

  // Show loading during token validation
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
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
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[#7C9885]" />
          <p className="text-lg font-medium text-[#2D3748]">Logging you in...</p>
          <p className="text-sm text-[#718096] mt-2">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branded Section */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#5D7A6B] to-[#7C9885] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Icons */}
        <FloatingIcons />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/sheria-smart-ico.png"
                alt="Sheria Smart Icon"
                width={32}
                height={32}
                className="h-8 w-8 brightness-0 invert"
              />
              <div className="text-2xl font-bold">
                <span className="text-white">Sheria</span>
                <span className="text-[#F7DC6F]"> Smart</span>
              </div>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Welcome Back</h1>
              <p className="text-xl text-white/80">Continue your legal journey</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {["Access your legal consultations", "Continue document generation", "Review your legal history"].map(
                (benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#F7DC6F]" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ),
              )}
            </div>

            {/* Testimonial Carousel */}
            <TestimonialCarousel />
          </div>

          {/* Bottom Quote */}
          <div className="space-y-4">
            <p className="text-white/70 italic">"Legal help made simple for every Kenyan"</p>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#FF0000] rounded-full"></div>
                <div className="w-2 h-2 bg-[#FFFFFF] rounded-full"></div>
                <div className="w-2 h-2 bg-[#000000] rounded-full"></div>
              </div>
              <span className="text-sm text-white/60">Proudly Kenyan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-[#7C9885] hover:text-[#5D7A6B] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-[#2D3748]">Sign In</h2>
              <p className="text-[#718096]">Access your legal assistant</p>
            </div>

            {/* Auth Error Display */}
            {authError && authError.showToUser && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Authentication Required</p>
                  <p className="text-sm text-red-600 mt-1">{authError.message}</p>
                </div>
                <button 
                  onClick={clearAuthError}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* OAuth-Only Authentication */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-[#2D3748]">Sign in to continue</h3>
              <p className="text-sm text-[#718096]">Secure authentication with your Google account</p>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || authLoading}
              className="w-full h-16 bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAF9] hover:border-[#7C9885] transition-all duration-300 text-[#2D3748] font-semibold rounded-lg shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin text-[#7C9885]" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-[#718096]">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#7C9885] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#7C9885] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Security Indicators */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-xs text-[#718096]">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-[#7C9885]" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                <span>KDPA 2019 Compliant</span>
              </div>
            </div>

            <p className="text-center text-sm text-[#718096]">Your data is encrypted and secure</p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[#718096]">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#7C9885] hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
