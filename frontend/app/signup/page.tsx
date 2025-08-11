"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, User, ArrowLeft, Shield, CheckCircle, Loader2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FloatingIcons } from "@/components/floating-icons"
// OAuth-only authentication - no password strength needed
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"

export default function SignupPage() {
  // OAuth-only authentication - no password fields needed
  const [isLoading, setIsLoading] = useState(false)
  // OAuth-only authentication - no email form needed

  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading, isValidatingToken } = useAuth()

  // Handle auth errors from OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    
    if (error) {
      console.error('Authentication error:', error, urlParams.get('details'))
      // Clear any stale auth state
      if (isAuthenticated) {
        console.log('Clearing stale auth state due to error')
      }
    }
  }, [])
  
  // Redirect if already authenticated, but not during error handling
  useEffect(() => {
    const hasError = window.location.search.includes('error=')
    if (isAuthenticated && !hasError && !authLoading) {
      console.log('Already authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [isAuthenticated, router, authLoading])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await login()
    } catch (error) {
      console.error('Google signup failed:', error)
      setIsLoading(false)
    }
  }

  // OAuth-only authentication - no email form submission needed

  // Show loading while validating token on app load
  if (isValidatingToken) {
    return <AuthLoading message="Logging you in..." />
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

        <div className="relative z-10 flex flex-col justify-center p-12 text-white min-h-full">
          {/* Logo */}
          <div className="mb-12">
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
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="text-5xl font-bold leading-tight">Join Sheria Smart</h1>
              <p className="text-xl text-white/90">Get instant legal guidance from Kenya's trusted AI assistant</p>
            </div>

            {/* Single Trust Signal */}
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-[#F7DC6F]" />
              <span className="text-lg text-white/90">Trusted by 10,000+ Kenyans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-[#7C9885] hover:text-[#5D7A6B] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-[#2D3748]">Create Your Account</h2>
              <p className="text-[#718096]">Get started in less than 2 minutes</p>
            </div>
          </div>

          {/* OAuth-Only Authentication */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-[#2D3748]">Create your account</h3>
              <p className="text-sm text-[#718096]">Get started with secure Google authentication in seconds</p>
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
                  <span>Creating your account...</span>
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
                  <span>Sign up with Google</span>
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-[#718096]">
                By signing up, you agree to our{" "}
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

            <p className="text-center text-sm text-[#718096]">
              Your data is encrypted and secure. We never share your information.
            </p>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[#718096]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7C9885] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
