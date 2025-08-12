"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, FileText, Download } from "lucide-react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { DocumentType, DocumentFormat } from "@/types/document"

interface GenericDocumentFormProps {
  onBack: () => void
  documentType: DocumentType
}

export function GenericDocumentForm({ onBack, documentType }: GenericDocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [selectedFormats, setSelectedFormats] = useState<DocumentFormat[]>([DocumentFormat.PDF])

  // Reset scroll position when component mounts
  useScrollToTop()

  const getDocumentTitle = () => {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return 'Sales & Purchase Agreement'
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return 'Distribution Agreement'
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return 'Partnership Agreement'
      case DocumentType.SERVICE_AGREEMENT:
        return 'Service Agreement'
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return 'Enhanced Employment Contract'
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return 'Independent Contractor Agreement'
      case DocumentType.NON_COMPETE_AGREEMENT:
        return 'Non-Compete Agreement'
      default:
        return 'Legal Document'
    }
  }

  const getDocumentDescription = () => {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return 'Create a comprehensive sales and purchase agreement for goods or services'
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return 'Establish a distribution relationship between supplier and distributor'
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return 'Define terms of business partnership between parties'
      case DocumentType.SERVICE_AGREEMENT:
        return 'Create professional service contracts and consulting agreements'
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return 'Create a comprehensive employment contract with enhanced terms'
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return 'Engage independent contractors with proper classification'
      case DocumentType.NON_COMPETE_AGREEMENT:
        return 'Restrict competitive activities during and after employment'
      default:
        return 'Generate a professional legal document'
    }
  }

  const getRequiredFields = () => {
    // Basic fields that most documents need
    const basicFields = [
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { key: 'additionalTerms', label: 'Additional Terms', type: 'textarea', required: false }
    ]

    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return [
          { key: 'sellerName', label: 'Seller Name', type: 'text', required: true },
          { key: 'sellerAddress', label: 'Seller Address', type: 'textarea', required: true },
          { key: 'sellerEmail', label: 'Seller Email', type: 'email', required: true },
          { key: 'sellerPhone', label: 'Seller Phone', type: 'text', required: false },
          { key: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
          { key: 'buyerAddress', label: 'Buyer Address', type: 'textarea', required: true },
          { key: 'buyerEmail', label: 'Buyer Email', type: 'email', required: true },
          { key: 'buyerPhone', label: 'Buyer Phone', type: 'text', required: false },
          { key: 'goodsServicesDescription', label: 'Goods/Services Description', type: 'textarea', required: true },
          { key: 'purchasePrice', label: 'Purchase Price', type: 'text', required: true },
          { key: 'paymentTerms', label: 'Payment Terms', type: 'textarea', required: true },
          { key: 'deliveryTerms', label: 'Delivery Terms', type: 'textarea', required: true },
          { key: 'deliveryTimeline', label: 'Delivery Timeline', type: 'text', required: true },
          { key: 'warrantyProvisions', label: 'Warranty Provisions', type: 'textarea', required: true },
          ...basicFields
        ]

      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return [
          { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { key: 'employeeAddress', label: 'Employee Address', type: 'textarea', required: true },
          { key: 'employeeEmail', label: 'Employee Email', type: 'email', required: true },
          { key: 'employeeIdNumber', label: 'Employee ID Number', type: 'text', required: true },
          { key: 'employerName', label: 'Employer Name', type: 'text', required: true },
          { key: 'employerAddress', label: 'Employer Address', type: 'textarea', required: true },
          { key: 'employerEmail', label: 'Employer Email', type: 'email', required: true },
          { key: 'employerBusinessRegistration', label: 'Business Registration', type: 'text', required: true },
          { key: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { key: 'jobDescription', label: 'Job Description', type: 'textarea', required: true },
          { key: 'department', label: 'Department', type: 'text', required: true },
          { key: 'employmentType', label: 'Employment Type', type: 'select', required: true, options: ['permanent', 'fixed_term', 'casual', 'contract'] },
          { key: 'startDate', label: 'Start Date', type: 'date', required: true },
          { key: 'basicSalary', label: 'Basic Salary', type: 'text', required: true },
          { key: 'salaryPaymentFrequency', label: 'Salary Payment Frequency', type: 'select', required: true, options: ['monthly', 'bi-weekly', 'weekly'] },
          { key: 'benefitsPackage', label: 'Benefits Package', type: 'textarea', required: true },
          ...basicFields
        ]

      case DocumentType.DISTRIBUTION_AGREEMENT:
        return [
          { key: 'principalName', label: 'Principal/Supplier Name', type: 'text', required: true },
          { key: 'principalAddress', label: 'Principal Address', type: 'textarea', required: true },
          { key: 'principalBusinessRegistration', label: 'Principal Business Registration', type: 'text', required: true },
          { key: 'principalEmail', label: 'Principal Email', type: 'email', required: true },
          { key: 'principalPhone', label: 'Principal Phone', type: 'text', required: false },
          { key: 'distributorName', label: 'Distributor Name', type: 'text', required: true },
          { key: 'distributorAddress', label: 'Distributor Address', type: 'textarea', required: true },
          { key: 'distributorBusinessRegistration', label: 'Distributor Business Registration', type: 'text', required: true },
          { key: 'distributorEmail', label: 'Distributor Email', type: 'email', required: true },
          { key: 'distributorPhone', label: 'Distributor Phone', type: 'text', required: false },
          { key: 'territoryDefinition', label: 'Territory Definition', type: 'textarea', required: true },
          { key: 'productSpecifications', label: 'Product Specifications', type: 'textarea', required: true },
          { key: 'exclusivityType', label: 'Exclusivity Type', type: 'select', required: true, options: ['exclusive', 'non-exclusive', 'sole'] },
          { key: 'minimumSalesTargets', label: 'Minimum Sales Targets', type: 'textarea', required: true },
          { key: 'commissionStructure', label: 'Commission Structure', type: 'textarea', required: true },
          { key: 'marginStructure', label: 'Margin Structure', type: 'textarea', required: false },
          { key: 'paymentTerms', label: 'Payment Terms', type: 'textarea', required: false },
          { key: 'marketingObligations', label: 'Marketing Obligations', type: 'textarea', required: true },
          { key: 'distributorObligations', label: 'Distributor Obligations', type: 'textarea', required: false },
          { key: 'principalObligations', label: 'Principal Obligations', type: 'textarea', required: false },
          { key: 'agreementTerm', label: 'Agreement Term', type: 'text', required: true },
          { key: 'performanceMetrics', label: 'Performance Metrics', type: 'textarea', required: false },
          { key: 'terminationConditions', label: 'Termination Conditions', type: 'textarea', required: false },
          { key: 'trademarkUsage', label: 'Trademark Usage', type: 'textarea', required: false },
          { key: 'intellectualPropertyRights', label: 'Intellectual Property Rights', type: 'textarea', required: false },
          ...basicFields
        ]

      case DocumentType.PARTNERSHIP_AGREEMENT:
        return [
          { key: 'partnershipName', label: 'Partnership Name', type: 'text', required: true },
          { key: 'businessPurpose', label: 'Business Purpose', type: 'textarea', required: true },
          { key: 'partnershipType', label: 'Partnership Type', type: 'select', required: true, options: ['general', 'limited', 'limited_liability'] },
          { key: 'businessAddress', label: 'Business Address', type: 'textarea', required: true },
          { key: 'totalCapitalContribution', label: 'Total Capital Contribution', type: 'text', required: true },
          { key: 'profitDistributionMethod', label: 'Profit Distribution Method', type: 'textarea', required: true },
          { key: 'lossAllocationMethod', label: 'Loss Allocation Method', type: 'textarea', required: false },
          { key: 'capitalAccountMaintenance', label: 'Capital Account Maintenance', type: 'textarea', required: false },
          { key: 'managementStructure', label: 'Management Structure', type: 'textarea', required: true },
          { key: 'decisionMakingProcess', label: 'Decision Making Process', type: 'textarea', required: true },
          { key: 'signatoryAuthority', label: 'Signatory Authority', type: 'textarea', required: false },
          { key: 'meetingRequirements', label: 'Meeting Requirements', type: 'textarea', required: false },
          { key: 'bankingArrangements', label: 'Banking Arrangements', type: 'textarea', required: false },
          { key: 'bookkeepingResponsibilities', label: 'Bookkeeping Responsibilities', type: 'textarea', required: false },
          { key: 'taxResponsibilities', label: 'Tax Responsibilities', type: 'textarea', required: false },
          { key: 'partnerDutiesAndRestrictions', label: 'Partner Duties and Restrictions', type: 'textarea', required: true },
          { key: 'nonCompeteProvisions', label: 'Non-Compete Provisions', type: 'textarea', required: false },
          { key: 'confidentialityObligations', label: 'Confidentiality Obligations', type: 'textarea', required: false },
          { key: 'partnerWithdrawalProcess', label: 'Partner Withdrawal Process', type: 'textarea', required: false },
          { key: 'newPartnerAdmissionProcess', label: 'New Partner Admission Process', type: 'textarea', required: false },
          { key: 'dissolutionTriggers', label: 'Dissolution Triggers', type: 'textarea', required: false },
          { key: 'dissolutionProcedures', label: 'Dissolution Procedures', type: 'textarea', required: false },
          { key: 'assetDistribution', label: 'Asset Distribution', type: 'textarea', required: false },
          // NOTE: Partners array handling is simplified for now - would need dynamic form sections for full implementation
          { key: 'partnersInfo', label: 'Partners Information (JSON format for now)', type: 'textarea', required: true, placeholder: 'Enter partner details in JSON format with fields: partnerName, partnerAddress, partnerEmail, capitalContribution, contributionType, profitSharePercentage, lossSharePercentage' },
          ...basicFields
        ]

      case DocumentType.SERVICE_AGREEMENT:
        return [
          // Service Provider Information
          { key: 'serviceProviderName', label: 'Service Provider Name', type: 'text', required: true },
          { key: 'serviceProviderAddress', label: 'Service Provider Address', type: 'textarea', required: true },
          { key: 'serviceProviderEmail', label: 'Service Provider Email', type: 'email', required: true },
          { key: 'serviceProviderPhone', label: 'Service Provider Phone', type: 'text', required: false },
          { key: 'serviceProviderBusinessRegistration', label: 'Service Provider Business Registration', type: 'text', required: false },
          
          // Client Information
          { key: 'clientName', label: 'Client Name', type: 'text', required: true },
          { key: 'clientAddress', label: 'Client Address', type: 'textarea', required: true },
          { key: 'clientEmail', label: 'Client Email', type: 'email', required: true },
          { key: 'clientPhone', label: 'Client Phone', type: 'text', required: false },
          
          // Service Details
          { key: 'scopeOfServices', label: 'Scope of Services', type: 'textarea', required: true },
          { key: 'deliverablesDescription', label: 'Deliverables Description', type: 'textarea', required: true },
          { key: 'serviceTimeline', label: 'Service Timeline', type: 'textarea', required: true },
          { key: 'milestones', label: 'Project Milestones', type: 'textarea', required: false },
          
          // Financial Terms
          { key: 'feeStructure', label: 'Fee Structure', type: 'textarea', required: true },
          { key: 'paymentTerms', label: 'Payment Terms', type: 'textarea', required: true },
          { key: 'expenseReimbursement', label: 'Expense Reimbursement', type: 'textarea', required: false },
          
          // Intellectual Property
          { key: 'intellectualPropertyOwnership', label: 'Intellectual Property Ownership', type: 'textarea', required: true },
          { key: 'workProductRights', label: 'Work Product Rights', type: 'textarea', required: true },
          { key: 'preExistingIPRights', label: 'Pre-existing IP Rights', type: 'textarea', required: false },
          
          // Legal Terms
          { key: 'confidentialityRequirements', label: 'Confidentiality Requirements', type: 'textarea', required: true },
          { key: 'independentContractorStatus', label: 'Independent Contractor Status', type: 'textarea', required: true },
          { key: 'liabilityLimitations', label: 'Liability Limitations', type: 'textarea', required: true },
          
          // Termination
          { key: 'terminationConditions', label: 'Termination Conditions', type: 'textarea', required: true },
          { key: 'terminationNotice', label: 'Termination Notice Period', type: 'text', required: true },
          { key: 'disputeResolution', label: 'Dispute Resolution', type: 'textarea', required: false },
          { key: 'insuranceRequirements', label: 'Insurance Requirements', type: 'textarea', required: false },
          
          ...basicFields
        ]

      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return [
          { key: 'contractorName', label: 'Contractor Name', type: 'text', required: true },
          { key: 'contractorAddress', label: 'Contractor Address', type: 'textarea', required: true },
          { key: 'contractorEmail', label: 'Contractor Email', type: 'email', required: true },
          { key: 'clientName', label: 'Client Name', type: 'text', required: true },
          { key: 'clientAddress', label: 'Client Address', type: 'textarea', required: true },
          { key: 'clientEmail', label: 'Client Email', type: 'email', required: true },
          { key: 'clientBusinessRegistration', label: 'Client Business Registration', type: 'text', required: true },
          { key: 'servicesDescription', label: 'Services Description', type: 'textarea', required: true },
          { key: 'projectScope', label: 'Project Scope', type: 'textarea', required: true },
          { key: 'compensationStructure', label: 'Compensation Structure', type: 'select', required: true, options: ['fixed_fee', 'hourly_rate', 'milestone_based', 'retainer'] },
          { key: 'paymentSchedule', label: 'Payment Schedule', type: 'text', required: true },
          { key: 'projectStartDate', label: 'Project Start Date', type: 'date', required: true },
          { key: 'projectDuration', label: 'Project Duration', type: 'text', required: true },
          { key: 'intellectualPropertyOwnership', label: 'IP Ownership', type: 'textarea', required: true },
          ...basicFields
        ]

      case DocumentType.NON_COMPETE_AGREEMENT:
        return [
          // Employee Information
          { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { key: 'employeeAddress', label: 'Employee Address', type: 'textarea', required: true },
          { key: 'employeeEmail', label: 'Employee Email', type: 'email', required: true },
          { key: 'employeePosition', label: 'Employee Position', type: 'text', required: true },
          { key: 'employeeId', label: 'Employee ID (Optional)', type: 'text', required: false },
          
          // Employer Information
          { key: 'employerName', label: 'Employer Name', type: 'text', required: true },
          { key: 'employerAddress', label: 'Employer Address', type: 'textarea', required: true },
          { key: 'employerEmail', label: 'Employer Email', type: 'email', required: true },
          { key: 'employerBusinessRegistration', label: 'Employer Business Registration', type: 'text', required: true },
          { key: 'employerBusinessType', label: 'Employer Business Type', type: 'text', required: true },
          
          // Employment Context
          { key: 'employmentStartDate', label: 'Employment Start Date', type: 'date', required: true },
          { key: 'currentPosition', label: 'Current Position', type: 'text', required: true },
          { key: 'accessToConfidentialInfo', label: 'Access to Confidential Information', type: 'textarea', required: true },
          { key: 'customerRelationships', label: 'Customer Relationships', type: 'textarea', required: true },
          
          // Non-Compete Restrictions
          { key: 'restrictedActivities', label: 'Restricted Activities', type: 'textarea', required: true },
          { key: 'competitorDefinition', label: 'Competitor Definition', type: 'textarea', required: true },
          { key: 'restrictedServices', label: 'Restricted Services', type: 'textarea', required: true },
          { key: 'restrictedProducts', label: 'Restricted Products', type: 'textarea', required: true },
          
          // Geographic Scope
          { key: 'geographicScope', label: 'Geographic Scope', type: 'textarea', required: true },
          { key: 'specificLocations', label: 'Specific Locations (Optional)', type: 'textarea', required: false },
          { key: 'territoryDefinition', label: 'Territory Definition', type: 'textarea', required: true },
          
          // Temporal Scope
          { key: 'restrictionDuration', label: 'Restriction Duration', type: 'text', required: true },
          { key: 'restrictionStartDate', label: 'Restriction Start Date', type: 'text', required: true },
          
          // Non-Solicitation
          { key: 'customerNonSolicitation', label: 'Customer Non-Solicitation Clause', type: 'textarea', required: true },
          { key: 'employeeNonSolicitation', label: 'Employee Non-Solicitation Clause', type: 'textarea', required: true },
          { key: 'supplierNonSolicitation', label: 'Supplier Non-Solicitation (Optional)', type: 'textarea', required: false },
          
          // Consideration
          { key: 'considerationProvided', label: 'Consideration Provided', type: 'textarea', required: true },
          { key: 'considerationValue', label: 'Consideration Value (Optional)', type: 'text', required: false },
          { key: 'additionalBenefits', label: 'Additional Benefits (Optional)', type: 'textarea', required: false },
          
          // Exceptions
          { key: 'permittedActivities', label: 'Permitted Activities (Optional)', type: 'textarea', required: false },
          { key: 'generalBusinessExceptions', label: 'General Business Exceptions (Optional)', type: 'textarea', required: false },
          { key: 'investmentExceptions', label: 'Investment Exceptions (Optional)', type: 'textarea', required: false },
          
          // Enforcement
          { key: 'remediesAvailable', label: 'Remedies Available', type: 'textarea', required: true },
          { key: 'injunctiveReliefProvision', label: 'Injunctive Relief Provision', type: 'textarea', required: true },
          { key: 'attorneyFeesProvision', label: 'Attorney Fees Provision (Optional)', type: 'textarea', required: false },
          
          // Severability
          { key: 'severabilityProvisions', label: 'Severability Provisions', type: 'textarea', required: true },
          { key: 'modificationRights', label: 'Modification Rights (Optional)', type: 'textarea', required: false },
          
          ...basicFields
        ]

      default:
        return [
          { key: 'party1Name', label: 'Party 1 Name', type: 'text', required: true },
          { key: 'party1Address', label: 'Party 1 Address', type: 'textarea', required: true },
          { key: 'party2Name', label: 'Party 2 Name', type: 'text', required: true },
          { key: 'party2Address', label: 'Party 2 Address', type: 'textarea', required: true },
          { key: 'documentPurpose', label: 'Document Purpose', type: 'textarea', required: true },
          ...basicFields
        ]
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFormatChange = (format: DocumentFormat, checked: boolean) => {
    if (checked) {
      setSelectedFormats(prev => [...prev, format])
    } else {
      setSelectedFormats(prev => prev.filter(f => f !== format))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const requiredFields = getRequiredFields()
      const missingFields = requiredFields
        .filter(field => {
          const value = formData[field.key]
          if (field.required) {
            // Handle string values
            if (typeof value === 'string') {
              return !value.trim()
            }
            // Handle arrays (like partners)
            if (Array.isArray(value)) {
              return value.length === 0
            }
            // Handle other types or undefined/null
            return !value
          }
          return false
        })
        .map(field => field.label)

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      }

      if (selectedFormats.length === 0) {
        throw new Error('Please select at least one document format')
      }

      // Handle Partnership Agreement partners array conversion
      let processedUserInput = { ...formData }
      if (documentType === DocumentType.PARTNERSHIP_AGREEMENT && formData.partnersInfo) {
        try {
          processedUserInput.partners = JSON.parse(formData.partnersInfo)
          delete processedUserInput.partnersInfo
        } catch (error) {
          throw new Error('Invalid partners information format. Please provide valid JSON.')
        }
      }

      const requestData = {
        documentType,
        userInput: processedUserInput,
        backstory: `Generate a ${getDocumentTitle()} based on the provided information.`,
        formats: selectedFormats
        // SECURITY: Email address is now handled by backend using authenticated user's email only
      }

      // Debug logging to see what's being sent
      console.log('📋 FORM DEBUG: Request data being sent to backend:', {
        documentType,
        userInputKeys: Object.keys(processedUserInput),
        userInputValues: processedUserInput,
        formats: selectedFormats,
        allRequiredFields: getRequiredFields().filter(f => f.required).map(f => f.key)
      })

      const response = await fetch('http://localhost:5000/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate document')
      }

      const result = await response.json()
      
      // Check if the result indicates a validation failure
      if (result.status === 'FAILED' || (result.message && result.message.includes('Validation failed:'))) {
        throw new Error(result.message || 'Document validation failed')
      }
      
      setSuccess(`Document generated successfully! Request ID: ${result.requestId}. ${result.message || 'Document will be sent to your email.'}`)
    } catch (err) {
      console.error('Error generating document:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate document')
    } finally {
      setLoading(false)
    }
  }

  const fields = getRequiredFields()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#F5F5F5] p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#7C9885]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-[#2D3748]">{getDocumentTitle()}</h1>
            <p className="text-sm text-[#718096]">{getDocumentDescription()}</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={field.key} className="text-sm font-medium text-[#2D3748]">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                    rows={3}
                    placeholder={(field as any).placeholder || ''}
                  />
                ) : field.type === 'select' ? (
                  <Select value={formData[field.key] || ''} onValueChange={(value) => handleInputChange(field.key, value)}>
                    <SelectTrigger className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field as any).options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option.replace('_', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                    placeholder={(field as any).placeholder || ''}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Document Formats */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#2D3748]">
              Document Formats <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdf-format"
                  checked={selectedFormats.includes(DocumentFormat.PDF)}
                  onCheckedChange={(checked) => handleFormatChange(DocumentFormat.PDF, !!checked)}
                />
                <Label htmlFor="pdf-format" className="text-sm">PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="docx-format"
                  checked={selectedFormats.includes(DocumentFormat.DOCX)}
                  onCheckedChange={(checked) => handleFormatChange(DocumentFormat.DOCX, !!checked)}
                />
                <Label htmlFor="docx-format" className="text-sm">Word Document</Label>
              </div>
            </div>
          </div>

          {/* Email Delivery Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Document Delivery</p>
                <p className="text-sm text-blue-700">Your generated document will be sent to your registered email address for security.</p>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6 py-3 border-[#E2E8F0] text-[#718096] hover:bg-[#F8FAF9]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#7C9885] hover:bg-[#7C9885]/90 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Document
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}