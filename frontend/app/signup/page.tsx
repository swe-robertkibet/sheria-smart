"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Phone, User, ArrowLeft, Shield, CheckCircle, Loader2, Check, X } from "lucide-react"
import Link from "next/link"
import { FloatingIcons } from "@/components/floating-icons"
import { PasswordStrengthIndicator } from "@/components/password-strength"
import { CounterAnimation } from "@/components/counter-animation"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    ageVerification: false,
    marketingConsent: false,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const router = useRouter()

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

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
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
            <Link href="/" className="text-3xl font-bold">
              <span className="text-white">Sheria</span>
              <span className="text-[#F7DC6F]"> Smart</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-12 flex-1 flex flex-col justify-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">Join Sheria Smart</h1>
              <p className="text-xl text-white/80">Start your legal journey today</p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              {["Free legal guidance", "Document generation", "24/7 AI assistance", "Privacy protected"].map(
                (benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#F7DC6F] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-[#2D3748]" />
                    </div>
                    <span className="text-lg text-white/90">{benefit}</span>
                  </div>
                ),
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white/15 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-[#F7DC6F]">
                  <CounterAnimation end={10000} suffix="+" />
                </div>
                <p className="text-xl text-white/90">Kenyans getting smart legal help</p>
                <div className="flex justify-center space-x-6 text-sm text-white/70">
                  <div className="text-center">
                    <div className="font-semibold text-white">5,000+</div>
                    <div>Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">98%</div>
                    <div>Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#F7DC6F]" />
                <span className="text-white/90">Bank-level security & encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-[#F7DC6F]" />
                <span className="text-white/90">Reviewed by Kenyan legal experts</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#F7DC6F]" />
                <span className="text-white/90">KDPA 2019 compliant</span>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-12 space-y-6">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <p className="text-white/90 italic text-lg text-center">"Legal help made simple for every Kenyan"</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-[#FF0000] rounded-full"></div>
                <div className="w-3 h-3 bg-[#FFFFFF] rounded-full"></div>
                <div className="w-3 h-3 bg-[#000000] rounded-full"></div>
              </div>
              <span className="text-white/70 font-medium">Proudly Kenyan</span>
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#2D3748] font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#718096] text-sm">+254</div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="712 345 678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-14 pl-16 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-lg"
                  required
                />
                <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7C9885]" />
              </div>
              <p className="text-xs text-[#718096]">Format: 712 345 678</p>
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#718096]">OR</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-[#E2E8F0] hover:bg-[#F8FAF9] transition-colors bg-transparent"
              >
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
                Sign up with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-[#E2E8F0] hover:bg-[#F8FAF9] transition-colors bg-transparent"
              >
                <span className="text-lg mr-3">📱</span>
                Sign up with Phone
              </Button>
            </div>
          </form>

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
