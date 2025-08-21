"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Lock, Globe, Users, FileText, AlertTriangle, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PrivacyPolicy() {
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

            {/* Back Button */}
            <Link href="/">
              <Button variant="outline" className="border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#2D3748]">Privacy Policy</h1>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto">
              How we protect your personal data in compliance with Kenya's Data Protection Act 2019
            </p>
            <div className="bg-[#E8F4F8] border border-[#7C9885] rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-[#7C9885] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-[#2D3748]">
                  <p className="font-medium">Last Updated: January 21, 2025</p>
                  <p>This policy complies with Kenya Data Protection Act 2019 (KDPA) and your data subject rights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          {/* KDPA Compliance Statement */}
          <Card className="border-l-4 border-[#7C9885] bg-[#E8F4F8]">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-[#7C9885] flex-shrink-0 mt-1" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#2D3748]">KDPA 2019 Compliance Statement</h2>
                  <div className="space-y-3 text-[#2D3748]">
                    <p>Sheria Smart is committed to protecting your personal data in accordance with the Kenya Data Protection Act 2019 (KDPA) and international best practices.</p>
                    <p><strong>Data Controller:</strong> Sheria Smart operates as a data controller for personal data processed through our platform.</p>
                    <p><strong>Legal Basis:</strong> We process your data based on consent, legitimate interests, and contract performance as defined in KDPA Section 30.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Introduction */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Introduction</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>This Privacy Policy explains how Sheria Smart ("we", "us", "our") collects, uses, and protects your personal data when you use our AI-powered legal assistance platform.</p>
                <p><strong>Scope:</strong> This policy applies to all users of Sheria Smart services, including website visitors, registered users, and document generation service users.</p>
                <p><strong>Data Controller Details:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Entity: Sheria Smart</li>
                  <li>Location: Nairobi, Kenya</li>
                  <li>Contact: contact-sheria@robertkibet.com</li>
                  <li>Data Protection Officer: Available upon request</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 2. Data We Collect */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data We Collect</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-[#7C9885]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Personal Information</h3>
                  </div>
                  <ul className="list-disc ml-6 space-y-1 text-[#2D3748] text-sm">
                    <li>Name (from Google OAuth)</li>
                    <li>Email address (from Google OAuth)</li>
                    <li>Profile picture (from Google OAuth)</li>
                    <li>Account creation date</li>
                    <li>Login timestamps</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-[#C99383]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Usage Data</h3>
                  </div>
                  <ul className="list-disc ml-6 space-y-1 text-[#2D3748] text-sm">
                    <li>AI chat interactions (anonymized)</li>
                    <li>Document generation requests</li>
                    <li>Platform navigation patterns</li>
                    <li>Feature usage statistics</li>
                    <li>Session duration</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-[#F7DC6F]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Technical Data</h3>
                  </div>
                  <ul className="list-disc ml-6 space-y-1 text-[#2D3748] text-sm">
                    <li>IP address (anonymized)</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Device information</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-[#7C9885]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Generated Content</h3>
                  </div>
                  <ul className="list-disc ml-6 space-y-1 text-[#2D3748] text-sm">
                    <li>Document templates used</li>
                    <li>Generated document metadata</li>
                    <li>Legal categories accessed</li>
                    <li>Search queries (anonymized)</li>
                    <li>User preferences</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="bg-[#FFF8E7] border border-[#F7DC6F] rounded-lg p-4">
              <p className="text-sm text-[#2D3748]">
                <strong>Important:</strong> We do NOT collect or store the actual content of legal documents you generate or sensitive personal information you might input during AI conversations.
              </p>
            </div>
          </div>

          {/* 3. Legal Basis for Processing */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Legal Basis for Processing (KDPA Section 30)</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We process your personal data based on the following legal grounds under KDPA:</p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-[#E8F4F8] p-4 rounded-lg">
                    <h4 className="font-bold text-[#7C9885] mb-2">Consent</h4>
                    <p className="text-sm">When you voluntarily provide information or agree to data processing for specific purposes.</p>
                  </div>
                  <div className="bg-[#FFF0ED] p-4 rounded-lg">
                    <h4 className="font-bold text-[#C99383] mb-2">Contract Performance</h4>
                    <p className="text-sm">To provide the AI legal assistance services you requested and agreed to use.</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Legitimate Interests</h4>
                    <p className="text-sm text-[#2D3748]">To improve our services, ensure security, and provide customer support.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. How We Use Your Data */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">4</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">How We Use Your Data</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We use your personal data for the following purposes:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#7C9885]">Service Provision:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Authenticate and authorize access</li>
                      <li>Provide AI legal chat services</li>
                      <li>Generate legal documents</li>
                      <li>Maintain user accounts and preferences</li>
                      <li>Process legal analysis requests</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#C99383]">Platform Improvement:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Analyze usage patterns (anonymized)</li>
                      <li>Improve AI response accuracy</li>
                      <li>Enhance user experience</li>
                      <li>Develop new features</li>
                      <li>Monitor service performance</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748]">Communication:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-[#2D3748]">
                      <li>Send service-related notifications</li>
                      <li>Respond to support inquiries</li>
                      <li>Provide platform updates</li>
                      <li>Send important legal notices</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#7C9885]">Security & Compliance:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Prevent fraud and abuse</li>
                      <li>Ensure platform security</li>
                      <li>Comply with legal obligations</li>
                      <li>Monitor for unauthorized access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5. Data Subject Rights (KDPA Chapter V) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">5</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Your Rights Under KDPA 2019</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-6 text-[#2D3748]">
                <p>Under the Kenya Data Protection Act 2019, you have the following rights:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <h4 className="font-bold text-[#7C9885] mb-2">Right to be Informed</h4>
                      <p className="text-sm">Know what data we collect and how we use it (this policy fulfills this right).</p>
                    </div>
                    
                    <div className="bg-[#FFF0ED] p-4 rounded-lg">
                      <h4 className="font-bold text-[#C99383] mb-2">Right of Access</h4>
                      <p className="text-sm">Request a copy of your personal data we hold. We will respond within 7 days as required by KDPA.</p>
                    </div>
                    
                    <div className="bg-[#FFF8E7] p-4 rounded-lg">
                      <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Right to Rectification</h4>
                      <p className="text-sm text-[#2D3748]">Correct inaccurate or incomplete personal data.</p>
                    </div>
                    
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <h4 className="font-bold text-[#7C9885] mb-2">Right to Erasure</h4>
                      <p className="text-sm">Request deletion of your personal data in certain circumstances.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[#FFF0ED] p-4 rounded-lg">
                      <h4 className="font-bold text-[#C99383] mb-2">Right to Restrict Processing</h4>
                      <p className="text-sm">Limit how we process your data in specific situations.</p>
                    </div>
                    
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <h4 className="font-bold text-[#7C9885] mb-2">Right to Data Portability</h4>
                      <p className="text-sm">Receive your data in a structured, machine-readable format.</p>
                    </div>
                    
                    <div className="bg-[#FFF8E7] p-4 rounded-lg">
                      <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Right to Object</h4>
                      <p className="text-sm text-[#2D3748]">Object to processing based on legitimate interests or direct marketing.</p>
                    </div>
                    
                    <div className="bg-[#FFF0ED] p-4 rounded-lg">
                      <h4 className="font-bold text-[#C99383] mb-2">Right to Withdraw Consent</h4>
                      <p className="text-sm">Withdraw consent at any time where processing is based on consent.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#E8F4F8] border border-[#7C9885] rounded-lg p-4">
                  <h4 className="font-bold text-[#7C9885] mb-2">How to Exercise Your Rights:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li><strong>Email:</strong> contact-sheria@robertkibet.com</li>
                    <li><strong>Response Time:</strong> Within 7 days for access requests, 30 days for other requests</li>
                    <li><strong>Verification:</strong> We may request identity verification to protect your data</li>
                    <li><strong>Free of Charge:</strong> Exercising these rights is generally free</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6. Data Sharing */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">6</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data Sharing & Third Parties</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p><strong>Limited Sharing:</strong> We share your personal data only in the following circumstances:</p>
                <div className="space-y-4 mt-4">
                  <div className="bg-[#E8F4F8] p-4 rounded-lg">
                    <h4 className="font-bold text-[#7C9885] mb-2">Service Providers:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li><strong>Google:</strong> For OAuth authentication services</li>
                      <li><strong>Cloud Hosting:</strong> For secure data storage and platform operation</li>
                      <li><strong>Analytics:</strong> Anonymized usage data for platform improvement</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#FFF0ED] p-4 rounded-lg">
                    <h4 className="font-bold text-[#C99383] mb-2">Legal Requirements:</h4>
                    <p className="text-sm">When required by Kenyan law, court order, or regulatory authority.</p>
                  </div>
                  
                  <div className="bg-[#FFF8E7] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Business Transfers:</h4>
                    <p className="text-sm text-[#2D3748]">In the event of a merger, acquisition, or business sale (with user notification).</p>
                  </div>
                </div>
                <p className="font-medium text-[#C99383]">We do NOT sell, rent, or trade your personal data to third parties for marketing purposes.</p>
              </CardContent>
            </Card>
          </div>

          {/* 7. Cross-Border Data Transfers */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">7</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Cross-Border Data Transfers</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>In compliance with KDPA Section 48, we ensure adequate protection for any cross-border data transfers:</p>
                <div className="space-y-3">
                  <div className="bg-[#E8F4F8] p-4 rounded-lg">
                    <h4 className="font-bold text-[#7C9885] mb-2">Adequacy Standards:</h4>
                    <p className="text-sm">Transfers only to countries with adequate data protection or with appropriate safeguards.</p>
                  </div>
                  <div className="bg-[#FFF0ED] p-4 rounded-lg">
                    <h4 className="font-bold text-[#C99383] mb-2">Contractual Protections:</h4>
                    <p className="text-sm">Standard contractual clauses with service providers ensuring KDPA-level protection.</p>
                  </div>
                  <div className="bg-[#FFF8E7] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">User Rights Maintained:</h4>
                    <p className="text-sm text-[#2D3748]">Your KDPA rights apply regardless of where your data is processed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 8. Data Security */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">8</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data Security Measures</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We implement comprehensive security measures to protect your personal data:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lock className="w-5 h-5 text-[#7C9885]" />
                        <h4 className="font-bold text-[#7C9885]">Technical Safeguards</h4>
                      </div>
                      <ul className="list-disc ml-6 space-y-1 text-sm">
                        <li>256-bit SSL/TLS encryption</li>
                        <li>Encrypted data storage</li>
                        <li>Secure authentication protocols</li>
                        <li>Regular security audits</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#FFF0ED] p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-[#C99383]" />
                        <h4 className="font-bold text-[#C99383]">Access Controls</h4>
                      </div>
                      <ul className="list-disc ml-6 space-y-1 text-sm">
                        <li>Role-based access control</li>
                        <li>Multi-factor authentication</li>
                        <li>Employee access logging</li>
                        <li>Regular access reviews</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[#FFF8E7] p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-5 h-5 text-[#F7DC6F] text-[#2D3748]" />
                        <h4 className="font-bold text-[#F7DC6F] text-[#2D3748]">Monitoring</h4>
                      </div>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-[#2D3748]">
                        <li>24/7 security monitoring</li>
                        <li>Intrusion detection systems</li>
                        <li>Automated threat response</li>
                        <li>Incident response procedures</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-5 h-5 text-[#7C9885]" />
                        <h4 className="font-bold text-[#7C9885]">Staff Training</h4>
                      </div>
                      <ul className="list-disc ml-6 space-y-1 text-sm">
                        <li>Data protection training</li>
                        <li>Security awareness programs</li>
                        <li>Confidentiality agreements</li>
                        <li>Regular security updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 9. Data Retention */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">9</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data Retention Periods</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We retain personal data only for as long as necessary for the purposes outlined in this policy:</p>
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-[#E8F4F8] p-4 rounded-lg">
                    <h4 className="font-bold text-[#7C9885] mb-2">Active Accounts</h4>
                    <p className="text-sm mb-2">While your account is active and for legitimate business purposes.</p>
                    <p className="text-xs text-[#718096]">Minimum: Duration of service use</p>
                  </div>
                  
                  <div className="bg-[#FFF0ED] p-4 rounded-lg">
                    <h4 className="font-bold text-[#C99383] mb-2">Inactive Accounts</h4>
                    <p className="text-sm mb-2">3 years after last login, then automatic deletion.</p>
                    <p className="text-xs text-[#718096]">Notice sent before deletion</p>
                  </div>
                  
                  <div className="bg-[#FFF8E7] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Legal Requirements</h4>
                    <p className="text-sm text-[#2D3748] mb-2">As required by Kenyan law or for legitimate legal claims.</p>
                    <p className="text-xs text-[#718096]">Maximum: 7 years for financial records</p>
                  </div>
                </div>
                
                <div className="bg-[#E8F4F8] border border-[#7C9885] rounded-lg p-4">
                  <h4 className="font-bold text-[#7C9885] mb-2">Deletion Process:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Secure deletion using industry-standard methods</li>
                    <li>Backup systems purged within 90 days</li>
                    <li>Third-party data deletion verification</li>
                    <li>Deletion confirmation available upon request</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 10. Cookies and Tracking */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">10</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Cookies and Tracking Technologies</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We use cookies and similar technologies to enhance your experience and analyze platform usage:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <h4 className="font-bold text-[#7C9885] mb-2">Essential Cookies</h4>
                      <p className="text-sm">Required for platform functionality, authentication, and security.</p>
                      <p className="text-xs text-[#718096] mt-1">Cannot be disabled</p>
                    </div>
                    
                    <div className="bg-[#FFF0ED] p-4 rounded-lg">
                      <h4 className="font-bold text-[#C99383] mb-2">Performance Cookies</h4>
                      <p className="text-sm">Help us understand how you use the platform to improve performance.</p>
                      <p className="text-xs text-[#718096] mt-1">Anonymized data only</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[#FFF8E7] p-4 rounded-lg">
                      <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Preference Cookies</h4>
                      <p className="text-sm text-[#2D3748]">Remember your settings and preferences for a better experience.</p>
                      <p className="text-xs text-[#718096] mt-1">Optional - can be managed</p>
                    </div>
                    
                    <div className="bg-[#E8F4F8] p-4 rounded-lg">
                      <h4 className="font-bold text-[#7C9885] mb-2">Third-Party Cookies</h4>
                      <p className="text-sm">From Google OAuth and other essential service providers.</p>
                      <p className="text-xs text-[#718096] mt-1">Governed by their privacy policies</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#E8F4F8] border border-[#7C9885] rounded-lg p-4">
                  <h4 className="font-bold text-[#7C9885] mb-2">Cookie Management:</h4>
                  <p className="text-sm mb-2">You can control cookies through your browser settings. Note that disabling certain cookies may limit platform functionality.</p>
                  <p className="text-xs text-[#718096]">Cookie preferences can be updated in your account settings.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 11. Data Breach Notification */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C99383] rounded-full flex items-center justify-center text-white font-bold">11</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Data Breach Response</h2>
            </div>
            <Card className="border-l-4 border-[#C99383]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>In the unlikely event of a data breach, we follow KDPA requirements:</p>
                <div className="space-y-4 mt-4">
                  <div className="bg-[#FFF0ED] p-4 rounded-lg">
                    <h4 className="font-bold text-[#C99383] mb-2">Immediate Response (Within 24 hours):</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Containment and assessment of the breach</li>
                      <li>Notification to Kenya Data Commissioner</li>
                      <li>Initiate security measures to prevent further damage</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#E8F4F8] p-4 rounded-lg">
                    <h4 className="font-bold text-[#7C9885] mb-2">User Notification (Within 72 hours):</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Direct email notification to affected users</li>
                      <li>Description of compromised data</li>
                      <li>Steps we're taking to address the breach</li>
                      <li>Recommended actions for users</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#FFF8E7] p-4 rounded-lg">
                    <h4 className="font-bold text-[#F7DC6F] text-[#2D3748] mb-2">Follow-up Actions:</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-[#2D3748]">
                      <li>Full investigation and remediation</li>
                      <li>Enhanced security measures implementation</li>
                      <li>Regular updates to affected users</li>
                      <li>Cooperation with regulatory authorities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 12. Contact & Complaints */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-white font-bold">12</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Contact Us & Complaints</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-[#7C9885]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Data Protection Contact</h3>
                  </div>
                  <div className="space-y-2 text-sm text-[#2D3748]">
                    <p><strong>Email:</strong> contact-sheria@robertkibet.com</p>
                    <p><strong>Subject Line:</strong> "KDPA Data Request" or "Privacy Inquiry"</p>
                    <p><strong>Response Time:</strong> 7 days for access requests, 30 days for others</p>
                    <p><strong>Office:</strong> Nairobi, Kenya</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-[#C99383]" />
                    <h3 className="text-lg font-bold text-[#2D3748]">Filing Complaints</h3>
                  </div>
                  <div className="space-y-2 text-sm text-[#2D3748]">
                    <p><strong>First:</strong> Contact us directly to resolve concerns</p>
                    <p><strong>If unresolved:</strong> File complaint with:</p>
                    <p><strong>Office of the Data Protection Commissioner</strong></p>
                    <p>Website: www.odpc.go.ke</p>
                    <p>Email: info@odpc.go.ke</p>
                    <p>Phone: +254 (0) 20 2628 000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 13. Policy Updates */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#F7DC6F] rounded-full flex items-center justify-center text-[#2D3748] font-bold">13</div>
              <h2 className="text-2xl font-bold text-[#2D3748]">Policy Updates</h2>
            </div>
            <Card className="border-l-4 border-[#F7DC6F]">
              <CardContent className="p-6 space-y-4 text-[#2D3748]">
                <p>We may update this Privacy Policy to reflect:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Changes in data protection laws or regulations</li>
                  <li>New platform features or services</li>
                  <li>Enhanced privacy protection measures</li>
                  <li>Feedback from users or regulatory authorities</li>
                </ul>
                
                <div className="bg-[#FFF8E7] border border-[#F7DC6F] rounded-lg p-4">
                  <h4 className="font-bold text-[#2D3748] mb-2">Notification Process:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li><strong>Major Changes:</strong> 30-day advance notice via email</li>
                    <li><strong>Minor Updates:</strong> Notice on platform and updated effective date</li>
                    <li><strong>Version History:</strong> Available upon request</li>
                    <li><strong>Continued Use:</strong> Constitutes acceptance of updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] text-white">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Your Privacy Matters</h3>
              <p className="text-white/90 max-w-2xl mx-auto">
                We're committed to protecting your personal data and respecting your privacy rights. 
                Contact us anytime with questions or concerns about how we handle your information.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Privacy Team:</strong> contact-sheria@robertkibet.com</p>
                <p><strong>General Contact:</strong> contact-sheria@robertkibet.com</p>
                <p><strong>Address:</strong> Nairobi, Kenya</p>
              </div>
            </CardContent>
          </Card>

          {/* KDPA Compliance Summary */}
          <Card className="border-2 border-[#7C9885] bg-[#E8F4F8]">
            <CardContent className="p-8 text-center space-y-4">
              <Shield className="w-12 h-12 text-[#7C9885] mx-auto" />
              <h3 className="text-2xl font-bold text-[#2D3748]">KDPA 2019 Compliant</h3>
              <p className="text-[#2D3748] max-w-2xl mx-auto">
                This privacy policy fully complies with Kenya's Data Protection Act 2019. 
                Your rights as a data subject are protected, and we maintain the highest 
                standards of data protection and privacy in accordance with Kenyan law.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#718096] mt-6">
                <div>✓ Lawful Processing</div>
                <div>✓ Data Subject Rights</div>
                <div>✓ Consent Management</div>
                <div>✓ Breach Notification</div>
              </div>
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
            <Link href="/terms" className="text-[#7C9885] hover:underline ml-1">Terms of Service</Link>
          </p>
          <p className="text-xs text-[#718096]">
            Your privacy is protected under Kenya's Data Protection Act 2019
          </p>
        </div>
      </footer>
    </div>
  )
}