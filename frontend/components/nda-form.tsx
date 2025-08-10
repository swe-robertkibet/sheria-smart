"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Check, Loader2, Mail, FileText, Download, Shield } from "lucide-react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { NDAFormData, DocumentFormat, DocumentGenerationResponse, ValidationResult } from "@/types/document"

interface NDAFormProps {
  onBack: () => void
}

export function NDAForm({ onBack }: NDAFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [generationResult, setGenerationResult] = useState<DocumentGenerationResponse | null>(null)

  // Reset scroll position when component mounts
  useScrollToTop()

  const [formData, setFormData] = useState<NDAFormData>({
    // Disclosing Party
    disclosingPartyName: "",
    disclosingPartyAddress: "",
    disclosingPartyEmail: "",
    disclosingPartyPhone: "",
    
    // Receiving Party
    receivingPartyName: "",
    receivingPartyAddress: "",
    receivingPartyEmail: "",
    receivingPartyPhone: "",
    
    // Agreement Details
    purposeOfDisclosure: "",
    specificConfidentialInfo: "",
    agreementDuration: "2 years",
    isPerperual: false,
    effectiveDate: new Date().toISOString().split('T')[0],
    
    // Optional Fields
    additionalTerms: "",
    contactPersonName: "",
    contactPersonTitle: "",
    
    // Form-specific fields
    backstory: "",
    selectedFormats: [DocumentFormat.PDF],
    emailAddress: ""
  })

  const steps = [
    {
      id: 0,
      title: "Disclosing Party",
      description: "Information about the party sharing confidential information"
    },
    {
      id: 1,
      title: "Receiving Party",
      description: "Information about the party receiving confidential information"
    },
    {
      id: 2,
      title: "Agreement Details",
      description: "Confidentiality terms and conditions"
    },
    {
      id: 3,
      title: "Context & Background",
      description: "Additional details about the confidential information"
    },
    {
      id: 4,
      title: "Document Options",
      description: "Format preferences and delivery"
    },
    {
      id: 5,
      title: "Review & Generate",
      description: "Review your information and generate the document"
    }
  ]

  const updateFormData = (field: keyof NDAFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const validateCurrentStep = () => {
    const errors: string[] = []
    
    switch (currentStep) {
      case 0: // Disclosing Party
        if (!formData.disclosingPartyName.trim()) errors.push("Disclosing party name is required")
        if (!formData.disclosingPartyAddress.trim()) errors.push("Disclosing party address is required")
        if (!formData.disclosingPartyEmail.trim()) errors.push("Disclosing party email is required")
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.disclosingPartyEmail)) {
          errors.push("Valid email address is required")
        }
        break
        
      case 1: // Receiving Party
        if (!formData.receivingPartyName.trim()) errors.push("Receiving party name is required")
        if (!formData.receivingPartyAddress.trim()) errors.push("Receiving party address is required")
        if (!formData.receivingPartyEmail.trim()) errors.push("Receiving party email is required")
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receivingPartyEmail)) {
          errors.push("Valid email address is required")
        }
        break
        
      case 2: // Agreement Details
        if (!formData.purposeOfDisclosure.trim()) errors.push("Purpose of disclosure is required")
        if (!formData.specificConfidentialInfo.trim()) errors.push("Specific confidential information description is required")
        if (!formData.isPerperual && !formData.agreementDuration.trim()) {
          errors.push("Agreement duration is required when not perpetual")
        }
        if (!formData.effectiveDate) errors.push("Effective date is required")
        break
        
      case 3: // Context & Background
        if (!formData.backstory.trim()) errors.push("Background context is required")
        break
        
      case 4: // Document Options
        if (formData.selectedFormats.length === 0) errors.push("At least one document format must be selected")
        if (!formData.emailAddress.trim()) errors.push("Email address for delivery is required")
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
          errors.push("Valid email address is required")
        }
        break
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleGenerateDocument = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      const requestData = {
        documentType: "NDA",
        userInput: {
          disclosingPartyName: formData.disclosingPartyName,
          disclosingPartyAddress: formData.disclosingPartyAddress,
          disclosingPartyEmail: formData.disclosingPartyEmail,
          disclosingPartyPhone: formData.disclosingPartyPhone,
          receivingPartyName: formData.receivingPartyName,
          receivingPartyAddress: formData.receivingPartyAddress,
          receivingPartyEmail: formData.receivingPartyEmail,
          receivingPartyPhone: formData.receivingPartyPhone,
          purposeOfDisclosure: formData.purposeOfDisclosure,
          specificConfidentialInfo: formData.specificConfidentialInfo,
          agreementDuration: formData.agreementDuration,
          isPerperual: formData.isPerperual,
          effectiveDate: formData.effectiveDate,
          additionalTerms: formData.additionalTerms,
          contactPersonName: formData.contactPersonName,
          contactPersonTitle: formData.contactPersonTitle
        },
        backstory: formData.backstory,
        formats: formData.selectedFormats
        // SECURITY: Email address is now handled by backend using authenticated user's email only
      }

      console.log('Sending document generation request:', requestData)

      const response = await fetch('http://localhost:5000/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate document')
      }

      const result: DocumentGenerationResponse = await response.json()
      setGenerationResult(result)
      console.log('Document generation result:', result)
      
    } catch (error) {
      console.error('Error generating document:', error)
      setValidationErrors([error instanceof Error ? error.message : 'Failed to generate document'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#7C9885]" />
                Disclosing Party Information
              </CardTitle>
              <CardDescription>
                Enter details of the organization or person sharing confidential information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="disclosingPartyName">Organization/Person Name *</Label>
                <Input
                  id="disclosingPartyName"
                  value={formData.disclosingPartyName}
                  onChange={(e) => updateFormData('disclosingPartyName', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                />
              </div>
              <div>
                <Label htmlFor="disclosingPartyAddress">Full Address *</Label>
                <Textarea
                  id="disclosingPartyAddress"
                  value={formData.disclosingPartyAddress}
                  onChange={(e) => updateFormData('disclosingPartyAddress', e.target.value)}
                  placeholder="Street address, city, postal code"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="disclosingPartyEmail">Email Address *</Label>
                  <Input
                    id="disclosingPartyEmail"
                    type="email"
                    value={formData.disclosingPartyEmail}
                    onChange={(e) => updateFormData('disclosingPartyEmail', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="disclosingPartyPhone">Phone Number</Label>
                  <Input
                    id="disclosingPartyPhone"
                    value={formData.disclosingPartyPhone}
                    onChange={(e) => updateFormData('disclosingPartyPhone', e.target.value)}
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C99383]" />
                Receiving Party Information
              </CardTitle>
              <CardDescription>
                Enter details of the organization or person receiving confidential information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receivingPartyName">Organization/Person Name *</Label>
                <Input
                  id="receivingPartyName"
                  value={formData.receivingPartyName}
                  onChange={(e) => updateFormData('receivingPartyName', e.target.value)}
                  placeholder="e.g., Tech Solutions Ltd"
                />
              </div>
              <div>
                <Label htmlFor="receivingPartyAddress">Full Address *</Label>
                <Textarea
                  id="receivingPartyAddress"
                  value={formData.receivingPartyAddress}
                  onChange={(e) => updateFormData('receivingPartyAddress', e.target.value)}
                  placeholder="Street address, city, postal code"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receivingPartyEmail">Email Address *</Label>
                  <Input
                    id="receivingPartyEmail"
                    type="email"
                    value={formData.receivingPartyEmail}
                    onChange={(e) => updateFormData('receivingPartyEmail', e.target.value)}
                    placeholder="contact@recipient.com"
                  />
                </div>
                <div>
                  <Label htmlFor="receivingPartyPhone">Phone Number</Label>
                  <Input
                    id="receivingPartyPhone"
                    value={formData.receivingPartyPhone}
                    onChange={(e) => updateFormData('receivingPartyPhone', e.target.value)}
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4A90E2]" />
                Agreement Details
              </CardTitle>
              <CardDescription>
                Specify the terms and conditions of the confidentiality agreement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="purposeOfDisclosure">Purpose of Disclosure *</Label>
                <Textarea
                  id="purposeOfDisclosure"
                  value={formData.purposeOfDisclosure}
                  onChange={(e) => updateFormData('purposeOfDisclosure', e.target.value)}
                  placeholder="e.g., Business partnership evaluation, joint venture discussions"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="specificConfidentialInfo">Specific Confidential Information *</Label>
                <Textarea
                  id="specificConfidentialInfo"
                  value={formData.specificConfidentialInfo}
                  onChange={(e) => updateFormData('specificConfidentialInfo', e.target.value)}
                  placeholder="e.g., Financial data, technical specifications, business plans, customer lists"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => updateFormData('effectiveDate', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPerperual"
                    checked={formData.isPerperual}
                    onCheckedChange={(checked) => updateFormData('isPerperual', checked)}
                  />
                  <Label htmlFor="isPerperual">Perpetual confidentiality (no time limit)</Label>
                </div>
                {!formData.isPerperual && (
                  <div>
                    <Label htmlFor="agreementDuration">Agreement Duration</Label>
                    <Input
                      id="agreementDuration"
                      value={formData.agreementDuration}
                      onChange={(e) => updateFormData('agreementDuration', e.target.value)}
                      placeholder="e.g., 2 years, 5 years"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="additionalTerms">Additional Terms (Optional)</Label>
                <Textarea
                  id="additionalTerms"
                  value={formData.additionalTerms}
                  onChange={(e) => updateFormData('additionalTerms', e.target.value)}
                  placeholder="Any special conditions or additional terms"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Context & Background</CardTitle>
              <CardDescription>
                Provide context about your situation to help generate appropriate legal language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backstory">Background Context *</Label>
                <Textarea
                  id="backstory"
                  value={formData.backstory}
                  onChange={(e) => updateFormData('backstory', e.target.value)}
                  placeholder="Describe the business relationship, why confidential information is being shared, any specific concerns or requirements you have..."
                  rows={6}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-[#718096] mt-2">
                  This information helps our AI generate more relevant and specific legal language for your NDA.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonName">Contact Person (Optional)</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => updateFormData('contactPersonName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonTitle">Contact Title (Optional)</Label>
                  <Input
                    id="contactPersonTitle"
                    value={formData.contactPersonTitle}
                    onChange={(e) => updateFormData('contactPersonTitle', e.target.value)}
                    placeholder="Legal Counsel, CEO"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#7C9885]" />
                Document Options
              </CardTitle>
              <CardDescription>
                Choose your preferred format and delivery method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Document Format(s) *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="format-pdf"
                      checked={formData.selectedFormats.includes(DocumentFormat.PDF)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('selectedFormats', [...formData.selectedFormats, DocumentFormat.PDF])
                        } else {
                          updateFormData('selectedFormats', formData.selectedFormats.filter(f => f !== DocumentFormat.PDF))
                        }
                      }}
                    />
                    <Label htmlFor="format-pdf">PDF (.pdf)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="format-docx"
                      checked={formData.selectedFormats.includes(DocumentFormat.DOCX)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('selectedFormats', [...formData.selectedFormats, DocumentFormat.DOCX])
                        } else {
                          updateFormData('selectedFormats', formData.selectedFormats.filter(f => f !== DocumentFormat.DOCX))
                        }
                      }}
                    />
                    <Label htmlFor="format-docx">Word Document (.docx)</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="emailAddress">Email for Document Delivery *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => updateFormData('emailAddress', e.target.value)}
                  placeholder="your-email@example.com"
                />
                <p className="text-sm text-[#718096] mt-1">
                  Generated documents will be sent to this email address
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Generate</CardTitle>
              <CardDescription>
                Review your information and generate your NDA document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationResult ? (
                <div className="text-center space-y-4">
                  {generationResult.status === 'EMAIL_SENT' ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-600">Document Generated Successfully!</h3>
                        <p className="text-[#718096] mt-2">
                          Your NDA document has been generated and sent to <strong>{formData.emailAddress}</strong>
                        </p>
                        <p className="text-sm text-[#718096] mt-2">
                          Request ID: {generationResult.requestId}
                        </p>
                      </div>
                    </>
                  ) : generationResult.status === 'COMPLETED' ? (
                    <>
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-600">Document Generated</h3>
                        <p className="text-[#718096] mt-2">
                          Your NDA document was generated but email delivery failed. Please contact support.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-600">Generation Failed</h3>
                        <p className="text-[#718096] mt-2">{generationResult.message}</p>
                      </div>
                    </>
                  )}
                  <Button onClick={() => {
                    setGenerationResult(null)
                    setCurrentStep(0)
                    setFormData({
                      disclosingPartyName: "",
                      disclosingPartyAddress: "",
                      disclosingPartyEmail: "",
                      disclosingPartyPhone: "",
                      receivingPartyName: "",
                      receivingPartyAddress: "",
                      receivingPartyEmail: "",
                      receivingPartyPhone: "",
                      purposeOfDisclosure: "",
                      specificConfidentialInfo: "",
                      agreementDuration: "2 years",
                      isPerperual: false,
                      effectiveDate: new Date().toISOString().split('T')[0],
                      additionalTerms: "",
                      contactPersonName: "",
                      contactPersonTitle: "",
                      backstory: "",
                      selectedFormats: [DocumentFormat.PDF],
                      emailAddress: ""
                    })
                  }}>
                    Create Another Document
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-[#F8FAF9] rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Document Summary:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Disclosing Party:</strong> {formData.disclosingPartyName}</p>
                      <p><strong>Receiving Party:</strong> {formData.receivingPartyName}</p>
                      <p><strong>Purpose:</strong> {formData.purposeOfDisclosure}</p>
                      <p><strong>Duration:</strong> {formData.isPerperual ? 'Perpetual' : formData.agreementDuration}</p>
                      <p><strong>Formats:</strong> {formData.selectedFormats.join(', ').toUpperCase()}</p>
                      <p><strong>Email:</strong> {formData.emailAddress}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This document is generated for informational purposes only. 
                      Please have it reviewed by a qualified Kenyan legal professional before use.
                    </p>
                  </div>
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="text-sm text-red-600 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#F5F5F5] p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#7C9885]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[#2D3748]">Create NDA Document</h1>
            <p className="text-sm text-[#718096]">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-[#F8FAF9] border-b border-[#E2E8F0] p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-[#7C9885] text-white' 
                    : index === currentStep 
                      ? 'bg-[#7C9885] text-white ring-4 ring-[#7C9885]/20' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs mt-1 hidden md:block ${
                  index <= currentStep ? 'text-[#2D3748]' : 'text-[#718096]'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleGenerateDocument}
              disabled={isSubmitting || !!generationResult}
              className="flex items-center gap-2 bg-[#7C9885] hover:bg-[#5D7A6B]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Document
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-[#7C9885] hover:bg-[#5D7A6B]"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}