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
import { PasteButton } from "@/components/ui/paste-button"
import { FieldReference } from "@/components/ui/field-reference"
import { mapFieldNames, type FieldMappingResult } from "@/lib/field-mapping"

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
  const [pasteError, setPasteError] = useState<string | null>(null)
  const [pasteSuccess, setPasteSuccess] = useState<string | null>(null)
  const [mappingResult, setMappingResult] = useState<FieldMappingResult | null>(null)

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
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return 'Enhanced Lease Agreement'
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return 'Sale of Land Agreement'
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
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return 'Comprehensive rental agreements for residential and commercial properties'
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return 'Contracts for the purchase and sale of real property'
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

      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return [
          // Landlord Information
          { key: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
          { key: 'landlordAddress', label: 'Landlord Address', type: 'textarea', required: true },
          { key: 'landlordEmail', label: 'Landlord Email', type: 'email', required: true },
          { key: 'landlordPhone', label: 'Landlord Phone (Optional)', type: 'text', required: false },
          { key: 'landlordIdNumber', label: 'Landlord ID Number (Optional)', type: 'text', required: false },
          
          // Tenant Information
          { key: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
          { key: 'tenantAddress', label: 'Tenant Address', type: 'textarea', required: true },
          { key: 'tenantEmail', label: 'Tenant Email', type: 'email', required: true },
          { key: 'tenantPhone', label: 'Tenant Phone (Optional)', type: 'text', required: false },
          { key: 'tenantIdNumber', label: 'Tenant ID Number (Optional)', type: 'text', required: false },
          { key: 'tenantOccupation', label: 'Tenant Occupation (Optional)', type: 'text', required: false },
          
          // Property Details
          { key: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
          { key: 'propertyDescription', label: 'Property Description', type: 'textarea', required: true },
          { key: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['residential', 'commercial', 'industrial', 'mixed_use'] },
          { key: 'propertySize', label: 'Property Size', type: 'text', required: true },
          { key: 'furnishingStatus', label: 'Furnishing Status', type: 'select', required: true, options: ['furnished', 'semi_furnished', 'unfurnished'] },
          { key: 'furnishingDetails', label: 'Furnishing Details (Optional)', type: 'textarea', required: false },
          
          // Lease Terms
          { key: 'leaseType', label: 'Lease Type', type: 'select', required: true, options: ['fixed_term', 'periodic', 'at_will'] },
          { key: 'leaseTerm', label: 'Lease Term', type: 'text', required: true },
          { key: 'leaseStartDate', label: 'Lease Start Date', type: 'date', required: true },
          { key: 'leaseEndDate', label: 'Lease End Date (Optional)', type: 'date', required: false },
          { key: 'renewalOptions', label: 'Renewal Options (Optional)', type: 'textarea', required: false },
          
          // Financial Terms
          { key: 'monthlyRent', label: 'Monthly Rent', type: 'text', required: true },
          { key: 'rentPaymentDate', label: 'Rent Payment Date', type: 'text', required: true },
          { key: 'rentPaymentMethod', label: 'Rent Payment Method', type: 'text', required: true },
          { key: 'securityDeposit', label: 'Security Deposit', type: 'text', required: true },
          { key: 'advanceRentPayment', label: 'Advance Rent Payment (Optional)', type: 'text', required: false },
          { key: 'lateFees', label: 'Late Fees (Optional)', type: 'text', required: false },
          { key: 'rentReviewClause', label: 'Rent Review Clause (Optional)', type: 'textarea', required: false },
          
          // Property Use
          { key: 'permittedUse', label: 'Permitted Use', type: 'textarea', required: true },
          { key: 'occupancyLimits', label: 'Occupancy Limits (Optional)', type: 'text', required: false },
          { key: 'businessUseRestrictions', label: 'Business Use Restrictions (Optional)', type: 'textarea', required: false },
          { key: 'sublettingPolicy', label: 'Subletting Policy', type: 'select', required: true, options: ['prohibited', 'with_consent', 'freely_permitted'] },
          
          // Maintenance and Repairs
          { key: 'landlordMaintenanceResponsibilities', label: 'Landlord Maintenance Responsibilities', type: 'textarea', required: true },
          { key: 'tenantMaintenanceResponsibilities', label: 'Tenant Maintenance Responsibilities', type: 'textarea', required: true },
          { key: 'repairNotificationProcess', label: 'Repair Notification Process', type: 'textarea', required: true },
          { key: 'emergencyRepairProcedures', label: 'Emergency Repair Procedures', type: 'textarea', required: true },
          
          // Utilities and Services
          { key: 'utilitiesIncluded', label: 'Utilities Included', type: 'textarea', required: true },
          { key: 'utilitiesPaidByTenant', label: 'Utilities Paid by Tenant', type: 'textarea', required: true },
          { key: 'serviceCharges', label: 'Service Charges (Optional)', type: 'textarea', required: false },
          { key: 'internetAndCableProvision', label: 'Internet and Cable Provision (Optional)', type: 'textarea', required: false },
          
          // Insurance and Liability
          { key: 'landlordInsuranceRequirements', label: 'Landlord Insurance Requirements', type: 'textarea', required: true },
          { key: 'tenantInsuranceRequirements', label: 'Tenant Insurance Requirements (Optional)', type: 'textarea', required: false },
          { key: 'liabilityAllocation', label: 'Liability Allocation', type: 'textarea', required: true },
          { key: 'propertyDamageResponsibility', label: 'Property Damage Responsibility', type: 'textarea', required: true },
          
          // Entry and Inspection
          { key: 'landlordEntryRights', label: 'Landlord Entry Rights', type: 'textarea', required: true },
          { key: 'inspectionSchedule', label: 'Inspection Schedule (Optional)', type: 'textarea', required: false },
          { key: 'noticeRequirements', label: 'Notice Requirements', type: 'textarea', required: true },
          
          // Termination and Default
          { key: 'terminationConditions', label: 'Termination Conditions', type: 'textarea', required: true },
          { key: 'noticePeriodsForTermination', label: 'Notice Periods for Termination', type: 'textarea', required: true },
          { key: 'defaultRemedies', label: 'Default Remedies', type: 'textarea', required: true },
          { key: 'evictionProcedures', label: 'Eviction Procedures', type: 'textarea', required: true },
          
          // Special Provisions
          { key: 'petPolicy', label: 'Pet Policy (Optional)', type: 'textarea', required: false },
          { key: 'parkingProvisions', label: 'Parking Provisions (Optional)', type: 'textarea', required: false },
          { key: 'securityMeasures', label: 'Security Measures (Optional)', type: 'textarea', required: false },
          { key: 'alterationsPolicy', label: 'Alterations Policy (Optional)', type: 'textarea', required: false },
          
          ...basicFields
        ]
      
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return [
          // Vendor Information
          { key: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
          { key: 'vendorAddress', label: 'Vendor Address', type: 'textarea', required: true },
          { key: 'vendorEmail', label: 'Vendor Email', type: 'email', required: true },
          { key: 'vendorPhone', label: 'Vendor Phone (Optional)', type: 'text', required: false },
          { key: 'vendorIdNumber', label: 'Vendor ID Number', type: 'text', required: true },
          { key: 'vendorMaritalStatus', label: 'Vendor Marital Status (Optional)', type: 'text', required: false },
          
          // Purchaser Information
          { key: 'purchaserName', label: 'Purchaser Name', type: 'text', required: true },
          { key: 'purchaserAddress', label: 'Purchaser Address', type: 'textarea', required: true },
          { key: 'purchaserEmail', label: 'Purchaser Email', type: 'email', required: true },
          { key: 'purchaserPhone', label: 'Purchaser Phone (Optional)', type: 'text', required: false },
          { key: 'purchaserIdNumber', label: 'Purchaser ID Number', type: 'text', required: true },
          { key: 'purchaserMaritalStatus', label: 'Purchaser Marital Status (Optional)', type: 'text', required: false },
          
          // Property Details
          { key: 'propertyDescription', label: 'Property Description', type: 'textarea', required: true },
          { key: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
          { key: 'titleNumber', label: 'Title Number', type: 'text', required: true },
          { key: 'landRegistryOffice', label: 'Land Registry Office', type: 'text', required: true },
          { key: 'propertySize', label: 'Property Size', type: 'text', required: true },
          { key: 'propertyBoundaries', label: 'Property Boundaries', type: 'textarea', required: true },
          { key: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['residential', 'commercial', 'agricultural', 'industrial'] },
          
          // Purchase Terms
          { key: 'purchasePrice', label: 'Purchase Price', type: 'text', required: true },
          { key: 'paymentTerms', label: 'Payment Terms', type: 'textarea', required: true },
          { key: 'depositAmount', label: 'Deposit Amount', type: 'text', required: true },
          { key: 'balancePaymentSchedule', label: 'Balance Payment Schedule', type: 'textarea', required: true },
          { key: 'completionDate', label: 'Completion Date', type: 'date', required: true },
          
          // Title and Encumbrances
          { key: 'titleWarranties', label: 'Title Warranties', type: 'textarea', required: true },
          { key: 'existingEncumbrances', label: 'Existing Encumbrances (Optional)', type: 'textarea', required: false },
          { key: 'outstandingCharges', label: 'Outstanding Charges (Optional)', type: 'textarea', required: false },
          { key: 'caveatOrRestrictions', label: 'Caveats or Restrictions (Optional)', type: 'textarea', required: false },
          
          // Conditions of Sale
          { key: 'conditionsToCompletion', label: 'Conditions to Completion', type: 'textarea', required: true },
          { key: 'surveyRequirements', label: 'Survey Requirements (Optional)', type: 'textarea', required: false },
          { key: 'soilTestRequirements', label: 'Soil Test Requirements (Optional)', type: 'textarea', required: false },
          { key: 'planningPermissionStatus', label: 'Planning Permission Status (Optional)', type: 'textarea', required: false },
          
          // Risk and Insurance
          { key: 'riskPassageDate', label: 'Risk Passage Date', type: 'date', required: true },
          { key: 'insuranceRequirements', label: 'Insurance Requirements', type: 'textarea', required: true },
          { key: 'propertyInsuranceTransfer', label: 'Property Insurance Transfer', type: 'textarea', required: true },
          
          // Completion Arrangements
          { key: 'completionVenue', label: 'Completion Venue', type: 'text', required: true },
          { key: 'documentsForCompletion', label: 'Documents for Completion', type: 'textarea', required: true },
          { key: 'possessionDate', label: 'Possession Date', type: 'date', required: true },
          { key: 'keyHandoverArrangements', label: 'Key Handover Arrangements (Optional)', type: 'textarea', required: false },
          
          // Default and Remedies
          { key: 'defaultProvisions', label: 'Default Provisions', type: 'textarea', required: true },
          { key: 'remediesForBreach', label: 'Remedies for Breach', type: 'textarea', required: true },
          { key: 'timeIsOfEssenceClause', label: 'Time is of the Essence', type: 'radio', required: true, options: ['true', 'false'] },
          { key: 'forfeituteClause', label: 'Forfeiture Clause (Optional)', type: 'textarea', required: false },
          
          // Legal and Professional Costs
          { key: 'legalCosts', label: 'Legal Costs Allocation', type: 'textarea', required: true },
          { key: 'stampDutyResponsibility', label: 'Stamp Duty Responsibility', type: 'textarea', required: true },
          { key: 'registrationFees', label: 'Registration Fees Responsibility', type: 'textarea', required: true },
          { key: 'surveyorFees', label: 'Surveyor Fees (Optional)', type: 'textarea', required: false },
          
          // Consent Requirements
          { key: 'landControlBoardConsent', label: 'Land Control Board Consent (Optional)', type: 'textarea', required: false },
          { key: 'spouseConsent', label: 'Spouse Consent (Optional)', type: 'textarea', required: false },
          { key: 'familyConsent', label: 'Family Consent (Optional)', type: 'textarea', required: false },
          
          // Additional Provisions
          { key: 'reservedRights', label: 'Reserved Rights (Optional)', type: 'textarea', required: false },
          { key: 'easementsAndRights', label: 'Easements and Rights (Optional)', type: 'textarea', required: false },
          { key: 'environmentalCompliance', label: 'Environmental Compliance (Optional)', type: 'textarea', required: false },
          
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

  const handlePasteData = (pastedData: Record<string, any>) => {
    setPasteError(null)
    setPasteSuccess(null)
    setMappingResult(null)
    
    const requiredFields = getRequiredFields()
    const validFieldKeys = requiredFields.map(field => field.key)
    
    // Use smart field mapping
    const result = mapFieldNames(pastedData, validFieldKeys)
    setMappingResult(result)
    
    // Update form data with mapped fields
    const newFormData = { ...formData, ...result.mappedData }
    setFormData(newFormData)
    
    // Provide detailed user feedback
    if (result.matchedFields === 0) {
      const topSuggestions = result.suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(s => `"${s.provided}" → "${s.suggested}"`)
        .join(', ')
      
      setPasteError(
        `No fields could be matched automatically. ${
          topSuggestions 
            ? `Try renaming these fields: ${topSuggestions}` 
            : 'Please check the field reference below for correct field names.'
        }`
      )
    } else {
      // Success message with details
      let message = `Successfully filled ${result.matchedFields} field${result.matchedFields > 1 ? 's' : ''}!`
      
      if (result.totalFields > result.matchedFields) {
        message += ` ${result.totalFields - result.matchedFields} field${result.totalFields - result.matchedFields > 1 ? 's were' : ' was'} skipped.`
      }
      
      // Add smart mapping info if any fields were auto-converted
      const autoConverted = result.suggestions.filter(s => s.confidence >= 0.7).length
      if (autoConverted > 0) {
        message += ` ${autoConverted} field${autoConverted > 1 ? 's were' : ' was'} automatically converted from human-readable format.`
      }
      
      setPasteSuccess(message)
    }
    
    // Clear messages after 6 seconds
    setTimeout(() => {
      setPasteSuccess(null)
      setPasteError(null)
    }, 6000)
  }

  const handlePasteError = (errorMessage: string) => {
    setPasteError(errorMessage)
    setPasteSuccess(null)
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      setPasteError(null)
    }, 5000)
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
            // Handle radio button fields specifically
            if (field.type === 'radio') {
              // For radio buttons, check if a valid option is selected
              const options = (field as any).options || []
              return !value || !options.includes(value)
            }
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
          {/* Paste Button Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#2D3748] mb-2">Quick Fill from Clipboard</h3>
                <p className="text-sm text-[#718096]">
                  Have your form data ready in JSON format? Click the button below to automatically fill all matching fields.
                </p>
              </div>
              <div className="flex-shrink-0">
                <PasteButton
                  onPaste={handlePasteData}
                  onError={handlePasteError}
                  size="lg"
                  variant="default"
                  className="bg-[#7C9885] hover:bg-[#7C9885]/90 text-white"
                />
              </div>
            </div>
            
            {/* Paste Feedback Messages */}
            {pasteError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="space-y-2">
                  <p className="text-red-800 text-sm font-medium">{pasteError}</p>
                  
                  {/* Show suggestions if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 rounded border">
                      <p className="text-red-700 text-xs font-medium mb-2">Suggested field name corrections:</p>
                      <div className="space-y-1">
                        {mappingResult.suggestions.slice(0, 5).map((suggestion, index) => (
                          <div key={index} className="text-xs text-red-600 font-mono">
                            <span className="bg-red-200 px-1 rounded">"{suggestion.provided}"</span>
                            {' → '}
                            <span className="bg-green-200 px-1 rounded text-green-800">"{suggestion.suggested}"</span>
                            <span className="text-red-500 ml-2">({Math.round(suggestion.confidence * 100)}% match)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {pasteSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="space-y-2">
                  <p className="text-green-800 text-sm font-medium">{pasteSuccess}</p>
                  
                  {/* Show mapping details if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded border">
                      <p className="text-green-700 text-xs font-medium mb-2">Auto-converted field names:</p>
                      <div className="space-y-1">
                        {mappingResult.suggestions
                          .filter(s => s.confidence >= 0.7)
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <div key={index} className="text-xs text-green-600 font-mono">
                              <span className="bg-blue-200 px-1 rounded">"{suggestion.provided}"</span>
                              {' → '}
                              <span className="bg-green-200 px-1 rounded">"{suggestion.suggested}"</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show skipped fields if any */}
                  {mappingResult && mappingResult.unmatchedFields.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-100 rounded border">
                      <p className="text-yellow-700 text-xs font-medium mb-2">Skipped fields (not found):</p>
                      <div className="text-xs text-yellow-600 font-mono">
                        {mappingResult.unmatchedFields.slice(0, 10).map((field, index) => (
                          <span key={index} className="bg-yellow-200 px-1 rounded mr-1 mb-1 inline-block">
                            "{field}"
                          </span>
                        ))}
                        {mappingResult.unmatchedFields.length > 10 && (
                          <span className="text-yellow-500">...and {mappingResult.unmatchedFields.length - 10} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Field Reference */}
            <div className="mt-4">
              <FieldReference fields={getRequiredFields()} />
            </div>
          </div>
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
                ) : field.type === 'radio' ? (
                  <div className="mt-1 space-y-2">
                    {(field as any).options?.map((option: string) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${field.key}-${option}`}
                          name={field.key}
                          value={option}
                          checked={formData[field.key] === option}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="focus:ring-[#7C9885] text-[#7C9885]"
                        />
                        <Label htmlFor={`${field.key}-${option}`} className="text-sm">
                          {option === 'true' ? 'Yes' : option === 'false' ? 'No' : option}
                        </Label>
                      </div>
                    ))}
                  </div>
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