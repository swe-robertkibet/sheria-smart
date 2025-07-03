"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResendEmail = async () => {
    setIsResending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsResending(false)
    setResendCooldown(60) // 60 second cooldown
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#FEFCF3] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <Link
                href="/signup"
                className="inline-flex items-center text-[#7C9885] hover:text-[#5D7A6B] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Signup
              </Link>

              <div className="w-20 h-20 bg-[#7C9885] rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-[#2D3748]">Check Your Email</h1>
                <p className="text-[#718096]">
                  We've sent a verification link to your email address. Click the link to activate your account.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#F8FAF9] rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#7C9885] mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#2D3748]">Check your inbox</p>
                  <p className="text-xs text-[#718096]">Look for an email from Sheria Smart</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#7C9885] mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#2D3748]">Click the verification link</p>
                  <p className="text-xs text-[#718096]">This will activate your account</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#7C9885] mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#2D3748]">Start using Sheria Smart</p>
                  <p className="text-xs text-[#718096]">Access your legal assistant</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button onClick={handleContinue} className="w-full bg-[#7C9885] hover:bg-[#5D7A6B] text-white">
                I've Verified My Email
              </Button>

              <div className="space-y-2">
                <p className="text-sm text-[#718096]">Didn't receive the email?</p>
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  variant="outline"
                  className="w-full border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white bg-transparent"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>
            </div>

            {/* Help */}
            <div className="text-xs text-[#718096] space-y-1">
              <p>Check your spam folder if you don't see the email.</p>
              <p>
                Need help?{" "}
                <Link href="/support" className="text-[#7C9885] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
