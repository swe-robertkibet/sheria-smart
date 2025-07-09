"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, User, ArrowLeft, Shield, CheckCircle, Loader2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FloatingIcons } from "@/components/floating-icons"
import { PasswordStrengthIndicator } from "@/components/password-strength"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    ageVerification: false,
    marketingConsent: false,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful signup - redirect to email verification or welcome page
      router.push("/verify-email") // or router.push("/welcome")
    } catch (error) {
      console.error("Signup failed:", error)
      // Handle error state here
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""

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

          {!showEmailForm ? (
            /* Initial Auth Method Selection */
            <div className="space-y-4">
              <Button
                onClick={() => setShowEmailForm(true)}
                className="w-full h-14 bg-gradient-to-r from-[#7C9885] to-[#5D7A6B] hover:from-[#5D7A6B] hover:to-[#4A6356] text-white font-semibold rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5 mr-3" />
                Continue with Email
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#718096]">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading || authLoading}
                className="w-full h-14 border-[#E2E8F0] hover:bg-[#F8FAF9] transition-colors bg-transparent"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                )}
                Continue with Google
              </Button>
            </div>
          ) : (
            /* Email Signup Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <Button
                type="button"
                onClick={() => setShowEmailForm(false)}
                variant="ghost"
                className="text-[#7C9885] hover:text-[#5D7A6B] p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to signup options
              </Button>

              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#2D3748] font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-14 pl-4 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg"
                      required
                      autoFocus
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7C9885]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#2D3748] font-medium">
                    Last Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-14 pl-4 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg"
                      required
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7C9885]" />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2D3748] font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-14 pl-4 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg ${
                      formData.email && !validateEmail(formData.email) ? "border-red-300" : ""
                    }`}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {formData.email && validateEmail(formData.email) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : formData.email && !validateEmail(formData.email) ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#7C9885]" />
                    )}
                  </div>
                </div>
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-sm text-red-500">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2D3748] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-14 pl-4 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C9885] hover:text-[#5D7A6B] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && <PasswordStrengthIndicator password={formData.password} />}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#2D3748] font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`h-14 pl-4 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg ${
                      formData.confirmPassword && !passwordsMatch ? "border-red-300" : ""
                    }`}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {formData.confirmPassword && passwordsMatch && <CheckCircle className="w-5 h-5 text-green-500" />}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#7C9885] hover:text-[#5D7A6B] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-500">Passwords don't match yet</p>
                )}
              </div>

              {/* Legal Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className="border-[#7C9885] data-[state=checked]:bg-[#7C9885] mt-1"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-[#2D3748] cursor-pointer leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#7C9885] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#7C9885] hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="age"
                    checked={formData.ageVerification}
                    onCheckedChange={(checked) => handleInputChange("ageVerification", checked as boolean)}
                    className="border-[#7C9885] data-[state=checked]:bg-[#7C9885] mt-1"
                    required
                  />
                  <Label htmlFor="age" className="text-sm text-[#2D3748] cursor-pointer">
                    I confirm I am 18 years or older
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => handleInputChange("marketingConsent", checked as boolean)}
                    className="border-[#7C9885] data-[state=checked]:bg-[#7C9885] mt-1"
                  />
                  <Label htmlFor="marketing" className="text-sm text-[#718096] cursor-pointer">
                    Send me legal tips and updates via email <span className="text-xs text-[#718096]">(Optional)</span>
                  </Label>
                </div>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms || !formData.ageVerification}
                className="w-full h-14 bg-gradient-to-r from-[#7C9885] to-[#5D7A6B] hover:from-[#5D7A6B] hover:to-[#4A6356] text-white font-semibold rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  "Create My Free Account"
                )}
              </Button>
            </form>
          )}

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
          <div className="text-center space-y-2">
            <p className="text-[#718096]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7C9885] hover:underline font-medium">
                Sign in here
              </Link>
            </p>
            <div className="flex justify-center space-x-4 text-xs text-[#718096]">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
