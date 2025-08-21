"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Scale, Shield, AlertTriangle, FileText, User, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TermsOfService() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleBackClick = async () => {
    setIsNavigating(true)
    try {
      // Check if there's history to go back to
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        // Fallback to home page
        router.push('/')
      }
    } catch (error) {
      // Fallback on error
      router.push('/')
    } finally {
      setTimeout(() => setIsNavigating(false), 500) // Brief delay to show loading state
    }
  }
  return (
    <div className="min-h-screen bg-[#FEFCF3]">
      {/* Header */}
      <header className="bg-[#FEFCF3] border-b border-[#E2E8F0] sticky top-0 z-50 backdrop-blur-md">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/sheria-smart-ico.png"
                alt="Sheria Smart Icon"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="text-xl font-bold">
                <span className="text-[#7C9885]">Sheria</span>
                <span className="text-[#C99383]"> Smart</span>
              </div>
            </Link>

            {/* Dynamic Back Button */}
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              disabled={isNavigating}
              className="border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isNavigating ? "Going Back..." : "Back"}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-full flex items-center justify-center mx-auto">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#2D3748]">Terms of Service</h1>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto">
              Important legal information about using Sheria Smart's AI-powered legal assistance platform
            </p>
            <div className="bg-[#FFF8E7] border border-[#F7DC6F] rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-[#F7DC6F] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-[#2D3748]">
                  <p className="font-medium">Last Updated: August 21, 2025</p>
                  <p>These terms govern your use of Sheria Smart's services. Please read carefully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          {/* Important Disclaimers */}
          <Card className="border-l-4 border-[#C99383] bg-[#FFF0ED]">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-[#C99383] flex-shrink-0 mt-1" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#2D3748]">Important Legal Disclaimers</h2>
                  <div className="space-y-3 text-[#2D3748]">
                    <p><strong>NOT LEGAL ADVICE:</strong> Sheria Smart provides AI-generated information and document templates for educational purposes only. This is NOT legal advice and does NOT create an attorney-client relationship.</p>
                    <p><strong>NO SUBSTITUTE FOR LAWYER:</strong> Our AI assistant cannot replace professional legal counsel. Always consult a qualified Kenyan advocate for legal matters.</p>
                    <p><strong>USER RESPONSIBILITY:</strong> You are solely responsible for verifying all information and seeking professional legal advice before taking any legal action.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Acceptance of Terms */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Acceptance of Terms</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>By accessing, using, or registering for Sheria Smart services ("Service", "Platform", "We", "Us"), you ("User", "You") agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations of Kenya.</p>
                <p>If you do not agree with these Terms, you must not use our Service. Your continued use constitutes acceptance of any updates to these Terms.</p>
                <p>These Terms are governed by the laws of Kenya, including but not limited to the Kenya Data Protection Act 2019, Consumer Protection Act 2012, and the Advocates Act.</p>
              </CardContent>
            </Card>
          </div>

          {/* 2. Service Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Service Description</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>Sheria Smart provides:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>AI Legal Chat:</strong> Artificial intelligence-powered responses to legal questions based on publicly available legal information</li>
                  <li><strong>Legal Analysis:</strong> Structured analysis of legal scenarios using AI technology</li>
                  <li><strong>Document Generation:</strong> Template-based legal document creation tools across multiple categories</li>
                  <li><strong>Legal Information:</strong> Educational content about Kenyan law and legal procedures</li>
                </ul>
                <div className="bg-[#FFF8E7] border border-[#F7DC6F] rounded-lg p-4">
                  <p className="font-medium text-[#2D3748]">IMPORTANT: All services are informational tools only. They do not constitute legal practice, legal advice, or create any attorney-client relationship.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. No Attorney-Client Relationship */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">No Attorney-Client Relationship</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>NO LEGAL REPRESENTATION:</strong> Sheria Smart, its AI technology, and its operators do not act as your legal counsel, attorney, or advocate under Kenyan law.</p>
                <p><strong>NO CONFIDENTIALITY:</strong> Communications with our AI system are not protected by attorney-client privilege. Do not share confidential or sensitive information.</p>
                <p><strong>NO LEGAL OPINIONS:</strong> Our AI provides general information based on publicly available sources. This does not constitute legal opinions or advice specific to your circumstances.</p>
                <p><strong>SEEK PROFESSIONAL COUNSEL:</strong> For all legal matters, consult with a qualified advocate admitted to practice in Kenya under the Advocates Act.</p>
              </CardContent>
            </Card>
          </div>

          {/* 4. User Responsibilities */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">4</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">User Responsibilities</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>You agree to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Use the Service only for lawful purposes in compliance with Kenyan law</li>
                  <li>Verify all information independently before relying on it</li>
                  <li>Seek professional legal advice for all legal matters</li>
                  <li>Not use the Service to engage in unauthorized practice of law</li>
                  <li>Not share confidential, sensitive, or privileged information</li>
                  <li>Not attempt to circumvent security measures or access unauthorized areas</li>
                  <li>Not use the Service for any illegal, harmful, or malicious purposes</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 5. Limitation of Liability */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">5</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Limitation of Liability</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>MAXIMUM LIABILITY LIMITATION:</strong> To the fullest extent permitted by Kenyan law, Sheria Smart's total liability to you for any claims arising from use of the Service shall not exceed the amount you paid for the Service in the 12 months preceding the claim.</p>
                <p><strong>NO LIABILITY FOR:</strong> We shall not be liable for:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Indirect, incidental, consequential, or punitive damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages arising from reliance on AI-generated content</li>
                  <li>Legal consequences of actions taken based on our information</li>
                  <li>Third-party actions or content</li>
                  <li>Service interruptions or technical issues</li>
                </ul>
                <div className="bg-[#FFF0ED] border border-[#C99383] rounded-lg p-4">
                  <p className="font-medium">This limitation applies regardless of the legal theory and even if we have been advised of the possibility of such damages.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6. Disclaimers */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#F7DC6F] rounded-full flex items-center justify-center text-[#2D3748] font-bold">6</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Disclaimers</h2>
            </div>
            <Card className="border-l-4 border-[#F7DC6F]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>SERVICE PROVIDED "AS IS":</strong> The Service is provided on an "as is" and "as available" basis without warranties of any kind.</p>
                <p><strong>NO WARRANTIES:</strong> We disclaim all warranties, express or implied, including:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Accuracy, completeness, or currentness of information</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Merchantability or quality</li>
                  <li>Non-infringement of third-party rights</li>
                  <li>Uninterrupted or error-free operation</li>
                </ul>
                <p><strong>AI LIMITATIONS:</strong> Artificial intelligence technology has inherent limitations and may produce inaccurate, incomplete, or outdated information. AI responses should never be considered definitive legal guidance.</p>
              </CardContent>
            </Card>
          </div>

          {/* 7. Indemnification */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">7</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Indemnification</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>You agree to indemnify, defend, and hold harmless Sheria Smart, its developers, operators, and affiliates from and against all claims, damages, losses, costs, and expenses (including reasonable attorney fees) arising from:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Your use or misuse of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any law or regulation</li>
                  <li>Any legal action you take based on information from the Service</li>
                  <li>Any unauthorized practice of law using our platform</li>
                  <li>Any harm to third parties caused by your reliance on Service content</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 8. Intellectual Property */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">8</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Intellectual Property</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>PLATFORM OWNERSHIP:</strong> Sheria Smart retains all rights, title, and interest in the platform, AI technology, and underlying systems.</p>
                <p><strong>GENERATED DOCUMENTS:</strong> You own the documents you generate using our templates, but we retain rights to the templates and generation technology.</p>
                <p><strong>USER CONTENT:</strong> You retain ownership of content you submit, but grant us a license to use it for service operation and improvement.</p>
                <p><strong>RESTRICTIONS:</strong> You may not copy, modify, distribute, or reverse-engineer our platform or AI technology.</p>
              </CardContent>
            </Card>
          </div>

          {/* 9. Data Protection & Privacy */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">9</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data Protection & Privacy</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>Our collection, use, and protection of your personal data is governed by our Privacy Policy and the Kenya Data Protection Act 2019.</p>
                <p><strong>KEY POINTS:</strong></p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>We collect minimal personal data necessary for service operation</li>
                  <li>Your data is processed with appropriate security measures</li>
                  <li>You have rights under KDPA 2019 to access, rectify, and erase your data</li>
                  <li>We do not share personal data except as described in our Privacy Policy</li>
                </ul>
                <Link href="/privacy" className="inline-flex items-center text-[#7C9885] hover:text-[#5D7A6B] font-medium">
                  Read our Privacy Policy →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 10. Termination */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">10</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Termination</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>YOUR RIGHT TO TERMINATE:</strong> You may terminate your account at any time by contacting us or deleting your account through the platform.</p>
                <p><strong>OUR RIGHT TO TERMINATE:</strong> We may suspend or terminate your access immediately for:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Illegal or harmful use of the Service</li>
                  <li>Misrepresentation or fraud</li>
                  <li>Extended periods of inactivity</li>
                </ul>
                <p><strong>EFFECT OF TERMINATION:</strong> Upon termination, your right to use the Service ceases, but these Terms continue to apply to prior use.</p>
              </CardContent>
            </Card>
          </div>

          {/* 11. Governing Law & Dispute Resolution */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">11</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Governing Law & Dispute Resolution</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>GOVERNING LAW:</strong> These Terms are governed by and construed in accordance with the laws of Kenya.</p>
                <p><strong>JURISDICTION:</strong> Any disputes arising from these Terms or use of the Service shall be resolved in the courts of Kenya with exclusive jurisdiction in Nairobi.</p>
                <p><strong>DISPUTE RESOLUTION:</strong> Before filing any legal action, parties agree to attempt resolution through:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Good faith negotiation</li>
                  <li>Mediation if negotiation fails</li>
                  <li>Arbitration under Kenyan arbitration law if mediation fails</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 12. Changes to Terms */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#F7DC6F] rounded-full flex items-center justify-center text-[#2D3748] font-bold">12</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Changes to Terms</h2>
            </div>
            <Card className="border-l-4 border-[#F7DC6F]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We reserve the right to update these Terms at any time to reflect:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Changes in Kenyan law or regulation</li>
                  <li>New features or service modifications</li>
                  <li>Enhanced user protection measures</li>
                  <li>Legal or regulatory requirements</li>
                </ul>
                <p><strong>NOTIFICATION:</strong> We will notify users of material changes via email or platform notification. Continued use after notification constitutes acceptance of the updated Terms.</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] text-white">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Questions About These Terms?</h3>
              <p className="text-white/90">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> contact-sheria@robertkibet.com</p>
                <p><strong>Address:</strong> Nairobi, Kenya</p>
                <p><strong>Platform:</strong> Through our contact form at sheriasmart.co.ke</p>
              </div>
            </CardContent>
          </Card>

          {/* Final Disclaimer */}
          <Card className="border-2 border-[#C99383] bg-[#FFF0ED]">
            <CardContent className="p-8 text-center space-y-4">
              <Shield className="w-12 h-12 text-[#C99383] mx-auto" />
              <h3 className="text-2xl font-bold text-[#2D3748]">Final Reminder</h3>
              <p className="text-[#2D3748] max-w-2xl mx-auto">
                Sheria Smart is an educational technology platform providing AI-powered legal information tools. 
                We are not a law firm, do not practice law, and do not provide legal advice. 
                Always consult with qualified legal professionals for your specific legal needs.
              </p>
              <p className="text-sm text-[#718096] italic">
                "Making legal information accessible, not replacing legal professionals."
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3748] text-[#E2E8F0] py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Image
              src="/sheria-smart-ico.png"
              alt="Sheria Smart Icon"
              width={24}
              height={24}
              className="h-6 w-6 brightness-0 invert"
            />
            <div className="text-xl font-bold">
              <span className="text-white">Sheria</span>
              <span className="text-[#F7DC6F]"> Smart</span>
            </div>
          </div>
          <p className="text-sm text-[#A0AEC0]">
            © 2025 Sheria Smart. All rights reserved. | 
            <Link href="/privacy" className="text-[#7C9885] hover:underline ml-1">Privacy Policy</Link>
          </p>
          <p className="text-xs text-[#718096]">
            Made with ❤️ for the people of Kenya
          </p>
        </div>
      </footer>
    </div>
  )
}