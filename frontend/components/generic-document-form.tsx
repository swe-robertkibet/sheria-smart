"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, FileText, Download } from "lucide-react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DocumentType, DocumentFormat } from "@/types/document";
import { PasteButton } from "@/components/ui/paste-button";
import { FieldReference } from "@/components/ui/field-reference";
import { mapFieldNames, type FieldMappingResult } from "@/lib/field-mapping";

interface GenericDocumentFormProps {
  onBack: () => void;
  documentType: DocumentType;
}

export function GenericDocumentForm({
  onBack,
  documentType,
}: GenericDocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedFormats, setSelectedFormats] = useState<DocumentFormat[]>([
    DocumentFormat.PDF,
  ]);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState<string | null>(null);
  const [mappingResult, setMappingResult] = useState<FieldMappingResult | null>(
    null
  );

  // Reset scroll position when component mounts
  useScrollToTop();

  const getDocumentTitle = () => {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return "Sales & Purchase Agreement";
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return "Distribution Agreement";
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return "Partnership Agreement";
      case DocumentType.SERVICE_AGREEMENT:
        return "Service Agreement";
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return "Enhanced Employment Contract";
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return "Independent Contractor Agreement";
      case DocumentType.NON_COMPETE_AGREEMENT:
        return "Non-Compete Agreement";
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return "Enhanced Lease Agreement";
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return "Sale of Land Agreement";
      case DocumentType.PROPERTY_MANAGEMENT_AGREEMENT:
        return "Property Management Agreement";
      case DocumentType.PRENUPTIAL_AGREEMENT:
        return "Prenuptial Agreement";
      case DocumentType.POSTNUPTIAL_AGREEMENT:
        return "Postnuptial Agreement";
      case DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT:
        return "Child Custody & Support Agreement";
      case DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT:
        return "Copyright Assignment Agreement";
      case DocumentType.TRADEMARK_LICENSE_AGREEMENT:
        return "Trademark License Agreement";
      case DocumentType.PATENT_LICENSING_AGREEMENT:
        return "Patent Licensing Agreement";
      case DocumentType.ARTICLES_OF_ASSOCIATION:
        return "Articles of Association";
      case DocumentType.SHAREHOLDER_AGREEMENT:
        return "Shareholder Agreement";
      case DocumentType.BOARD_RESOLUTION:
        return "Board Resolution";
      case DocumentType.SETTLEMENT_AGREEMENT:
        return "Settlement Agreement";
      case DocumentType.ARBITRATION_AGREEMENT:
        return "Arbitration Agreement";
      case DocumentType.MEDIATION_AGREEMENT:
        return "Mediation Agreement";
      case DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT:
        return "Data Protection Compliance Agreement";
      case DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE:
        return "Anti-Money Laundering Compliance";
      case DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT:
        return "Environmental Compliance Agreement";
      default:
        return "Legal Document";
    }
  };

  const getDocumentDescription = () => {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return "Create a comprehensive sales and purchase agreement for goods or services";
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return "Establish a distribution relationship between supplier and distributor";
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return "Define terms of business partnership between parties";
      case DocumentType.SERVICE_AGREEMENT:
        return "Create professional service contracts and consulting agreements";
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return "Create a comprehensive employment contract with enhanced terms";
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return "Engage independent contractors with proper classification";
      case DocumentType.NON_COMPETE_AGREEMENT:
        return "Restrict competitive activities during and after employment";
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return "Comprehensive rental agreements for residential and commercial properties";
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return "Contracts for the purchase and sale of real property";
      case DocumentType.PROPERTY_MANAGEMENT_AGREEMENT:
        return "Engage property management services for real estate assets";
      case DocumentType.PRENUPTIAL_AGREEMENT:
        return "Define financial and property arrangements before marriage";
      case DocumentType.POSTNUPTIAL_AGREEMENT:
        return "Modify financial and property arrangements after marriage";
      case DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT:
        return "Define custody arrangements and child support obligations";
      case DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT:
        return "Transfer copyright ownership from creator to assignee";
      case DocumentType.TRADEMARK_LICENSE_AGREEMENT:
        return "License trademark usage while maintaining brand control";
      case DocumentType.PATENT_LICENSING_AGREEMENT:
        return "License patented technology while protecting patent rights";
      case DocumentType.ARTICLES_OF_ASSOCIATION:
        return "Internal rules and regulations governing company operations";
      case DocumentType.SHAREHOLDER_AGREEMENT:
        return "Define relationships and obligations between company shareholders";
      case DocumentType.BOARD_RESOLUTION:
        return "Document formal board decisions and authorizations";
      case DocumentType.SETTLEMENT_AGREEMENT:
        return "Resolve disputes and avoid continued litigation through comprehensive settlement terms";
      case DocumentType.ARBITRATION_AGREEMENT:
        return "Require binding arbitration for dispute resolution";
      case DocumentType.MEDIATION_AGREEMENT:
        return "Engage in structured mediation process for dispute resolution";
      case DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT:
        return "Ensure compliance with data protection and privacy laws including Kenya Data Protection Act 2019";
      case DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE:
        return "Implement comprehensive AML compliance programs and procedures in accordance with Kenya regulations";
      case DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT:
        return "Ensure comprehensive environmental compliance with EMCA 2015, NEMA regulations, and Kenya environmental standards";
      default:
        return "Generate a professional legal document";
    }
  };

  const getRequiredFields = () => {
    // Basic fields that most documents need
    const basicFields = [
      {
        key: "effectiveDate",
        label: "Effective Date",
        type: "date",
        required: true,
      },
      {
        key: "additionalTerms",
        label: "Additional Terms",
        type: "textarea",
        required: false,
      },
    ];

    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return [
          {
            key: "sellerName",
            label: "Seller Name",
            type: "text",
            required: true,
          },
          {
            key: "sellerAddress",
            label: "Seller Address",
            type: "textarea",
            required: true,
          },
          {
            key: "sellerEmail",
            label: "Seller Email",
            type: "email",
            required: true,
          },
          {
            key: "sellerPhone",
            label: "Seller Phone",
            type: "text",
            required: false,
          },
          {
            key: "buyerName",
            label: "Buyer Name",
            type: "text",
            required: true,
          },
          {
            key: "buyerAddress",
            label: "Buyer Address",
            type: "textarea",
            required: true,
          },
          {
            key: "buyerEmail",
            label: "Buyer Email",
            type: "email",
            required: true,
          },
          {
            key: "buyerPhone",
            label: "Buyer Phone",
            type: "text",
            required: false,
          },
          {
            key: "goodsServicesDescription",
            label: "Goods/Services Description",
            type: "textarea",
            required: true,
          },
          {
            key: "purchasePrice",
            label: "Purchase Price",
            type: "text",
            required: true,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "deliveryTerms",
            label: "Delivery Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "deliveryTimeline",
            label: "Delivery Timeline",
            type: "text",
            required: true,
          },
          {
            key: "warrantyProvisions",
            label: "Warranty Provisions",
            type: "textarea",
            required: true,
          },
          ...basicFields,
        ];

      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return [
          {
            key: "employeeName",
            label: "Employee Name",
            type: "text",
            required: true,
          },
          {
            key: "employeeAddress",
            label: "Employee Address",
            type: "textarea",
            required: true,
          },
          {
            key: "employeeEmail",
            label: "Employee Email",
            type: "email",
            required: true,
          },
          {
            key: "employeeIdNumber",
            label: "Employee ID Number",
            type: "text",
            required: true,
          },
          {
            key: "employerName",
            label: "Employer Name",
            type: "text",
            required: true,
          },
          {
            key: "employerAddress",
            label: "Employer Address",
            type: "textarea",
            required: true,
          },
          {
            key: "employerEmail",
            label: "Employer Email",
            type: "email",
            required: true,
          },
          {
            key: "employerBusinessRegistration",
            label: "Business Registration",
            type: "text",
            required: true,
          },
          { key: "jobTitle", label: "Job Title", type: "text", required: true },
          {
            key: "jobDescription",
            label: "Job Description",
            type: "textarea",
            required: true,
          },
          {
            key: "department",
            label: "Department",
            type: "text",
            required: true,
          },
          {
            key: "employmentType",
            label: "Employment Type",
            type: "select",
            required: true,
            options: ["permanent", "fixed_term", "casual", "contract"],
          },
          {
            key: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
          },
          {
            key: "basicSalary",
            label: "Basic Salary",
            type: "text",
            required: true,
          },
          {
            key: "salaryPaymentFrequency",
            label: "Salary Payment Frequency",
            type: "select",
            required: true,
            options: ["monthly", "bi-weekly", "weekly"],
          },
          {
            key: "benefitsPackage",
            label: "Benefits Package",
            type: "textarea",
            required: true,
          },
          ...basicFields,
        ];

      case DocumentType.DISTRIBUTION_AGREEMENT:
        return [
          {
            key: "principalName",
            label: "Principal/Supplier Name",
            type: "text",
            required: true,
          },
          {
            key: "principalAddress",
            label: "Principal Address",
            type: "textarea",
            required: true,
          },
          {
            key: "principalBusinessRegistration",
            label: "Principal Business Registration",
            type: "text",
            required: true,
          },
          {
            key: "principalEmail",
            label: "Principal Email",
            type: "email",
            required: true,
          },
          {
            key: "principalPhone",
            label: "Principal Phone",
            type: "text",
            required: false,
          },
          {
            key: "distributorName",
            label: "Distributor Name",
            type: "text",
            required: true,
          },
          {
            key: "distributorAddress",
            label: "Distributor Address",
            type: "textarea",
            required: true,
          },
          {
            key: "distributorBusinessRegistration",
            label: "Distributor Business Registration",
            type: "text",
            required: true,
          },
          {
            key: "distributorEmail",
            label: "Distributor Email",
            type: "email",
            required: true,
          },
          {
            key: "distributorPhone",
            label: "Distributor Phone",
            type: "text",
            required: false,
          },
          {
            key: "territoryDefinition",
            label: "Territory Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "productSpecifications",
            label: "Product Specifications",
            type: "textarea",
            required: true,
          },
          {
            key: "exclusivityType",
            label: "Exclusivity Type",
            type: "select",
            required: true,
            options: ["exclusive", "non-exclusive", "sole"],
          },
          {
            key: "minimumSalesTargets",
            label: "Minimum Sales Targets",
            type: "textarea",
            required: true,
          },
          {
            key: "commissionStructure",
            label: "Commission Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "marginStructure",
            label: "Margin Structure",
            type: "textarea",
            required: false,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: false,
          },
          {
            key: "marketingObligations",
            label: "Marketing Obligations",
            type: "textarea",
            required: true,
          },
          {
            key: "distributorObligations",
            label: "Distributor Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "principalObligations",
            label: "Principal Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "agreementTerm",
            label: "Agreement Term",
            type: "text",
            required: true,
          },
          {
            key: "performanceMetrics",
            label: "Performance Metrics",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "trademarkUsage",
            label: "Trademark Usage",
            type: "textarea",
            required: false,
          },
          {
            key: "intellectualPropertyRights",
            label: "Intellectual Property Rights",
            type: "textarea",
            required: false,
          },
          ...basicFields,
        ];

      case DocumentType.PARTNERSHIP_AGREEMENT:
        return [
          {
            key: "partnershipName",
            label: "Partnership Name",
            type: "text",
            required: true,
          },
          {
            key: "businessPurpose",
            label: "Business Purpose",
            type: "textarea",
            required: true,
          },
          {
            key: "partnershipType",
            label: "Partnership Type",
            type: "select",
            required: true,
            options: ["general", "limited", "limited_liability"],
          },
          {
            key: "businessAddress",
            label: "Business Address",
            type: "textarea",
            required: true,
          },
          {
            key: "totalCapitalContribution",
            label: "Total Capital Contribution",
            type: "text",
            required: true,
          },
          {
            key: "profitDistributionMethod",
            label: "Profit Distribution Method",
            type: "textarea",
            required: true,
          },
          {
            key: "lossAllocationMethod",
            label: "Loss Allocation Method",
            type: "textarea",
            required: false,
          },
          {
            key: "capitalAccountMaintenance",
            label: "Capital Account Maintenance",
            type: "textarea",
            required: false,
          },
          {
            key: "managementStructure",
            label: "Management Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "decisionMakingProcess",
            label: "Decision Making Process",
            type: "textarea",
            required: true,
          },
          {
            key: "signatoryAuthority",
            label: "Signatory Authority",
            type: "textarea",
            required: false,
          },
          {
            key: "meetingRequirements",
            label: "Meeting Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "bankingArrangements",
            label: "Banking Arrangements",
            type: "textarea",
            required: false,
          },
          {
            key: "bookkeepingResponsibilities",
            label: "Bookkeeping Responsibilities",
            type: "textarea",
            required: false,
          },
          {
            key: "taxResponsibilities",
            label: "Tax Responsibilities",
            type: "textarea",
            required: false,
          },
          {
            key: "partnerDutiesAndRestrictions",
            label: "Partner Duties and Restrictions",
            type: "textarea",
            required: true,
          },
          {
            key: "nonCompeteProvisions",
            label: "Non-Compete Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "confidentialityObligations",
            label: "Confidentiality Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "partnerWithdrawalProcess",
            label: "Partner Withdrawal Process",
            type: "textarea",
            required: false,
          },
          {
            key: "newPartnerAdmissionProcess",
            label: "New Partner Admission Process",
            type: "textarea",
            required: false,
          },
          {
            key: "dissolutionTriggers",
            label: "Dissolution Triggers",
            type: "textarea",
            required: false,
          },
          {
            key: "dissolutionProcedures",
            label: "Dissolution Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "assetDistribution",
            label: "Asset Distribution",
            type: "textarea",
            required: false,
          },
          // NOTE: Partners array handling is simplified for now - would need dynamic form sections for full implementation
          {
            key: "partnersInfo",
            label: "Partners Information (JSON format for now)",
            type: "textarea",
            required: true,
            placeholder:
              "Enter partner details in JSON format with fields: partnerName, partnerAddress, partnerEmail, capitalContribution, contributionType, profitSharePercentage, lossSharePercentage",
          },
          ...basicFields,
        ];

      case DocumentType.SERVICE_AGREEMENT:
        return [
          // Service Provider Information
          {
            key: "serviceProviderName",
            label: "Service Provider Name",
            type: "text",
            required: true,
          },
          {
            key: "serviceProviderAddress",
            label: "Service Provider Address",
            type: "textarea",
            required: true,
          },
          {
            key: "serviceProviderEmail",
            label: "Service Provider Email",
            type: "email",
            required: true,
          },
          {
            key: "serviceProviderPhone",
            label: "Service Provider Phone",
            type: "text",
            required: false,
          },
          {
            key: "serviceProviderBusinessRegistration",
            label: "Service Provider Business Registration",
            type: "text",
            required: false,
          },

          // Client Information
          {
            key: "clientName",
            label: "Client Name",
            type: "text",
            required: true,
          },
          {
            key: "clientAddress",
            label: "Client Address",
            type: "textarea",
            required: true,
          },
          {
            key: "clientEmail",
            label: "Client Email",
            type: "email",
            required: true,
          },
          {
            key: "clientPhone",
            label: "Client Phone",
            type: "text",
            required: false,
          },

          // Service Details
          {
            key: "scopeOfServices",
            label: "Scope of Services",
            type: "textarea",
            required: true,
          },
          {
            key: "deliverablesDescription",
            label: "Deliverables Description",
            type: "textarea",
            required: true,
          },
          {
            key: "serviceTimeline",
            label: "Service Timeline",
            type: "textarea",
            required: true,
          },
          {
            key: "milestones",
            label: "Project Milestones",
            type: "textarea",
            required: false,
          },

          // Financial Terms
          {
            key: "feeStructure",
            label: "Fee Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "expenseReimbursement",
            label: "Expense Reimbursement",
            type: "textarea",
            required: false,
          },

          // Intellectual Property
          {
            key: "intellectualPropertyOwnership",
            label: "Intellectual Property Ownership",
            type: "textarea",
            required: true,
          },
          {
            key: "workProductRights",
            label: "Work Product Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "preExistingIPRights",
            label: "Pre-existing IP Rights",
            type: "textarea",
            required: false,
          },

          // Legal Terms
          {
            key: "confidentialityRequirements",
            label: "Confidentiality Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "independentContractorStatus",
            label: "Independent Contractor Status",
            type: "textarea",
            required: true,
          },
          {
            key: "liabilityLimitations",
            label: "Liability Limitations",
            type: "textarea",
            required: true,
          },

          // Termination
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: true,
          },
          {
            key: "terminationNotice",
            label: "Termination Notice Period",
            type: "text",
            required: true,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },
          {
            key: "insuranceRequirements",
            label: "Insurance Requirements",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return [
          {
            key: "contractorName",
            label: "Contractor Name",
            type: "text",
            required: true,
          },
          {
            key: "contractorAddress",
            label: "Contractor Address",
            type: "textarea",
            required: true,
          },
          {
            key: "contractorEmail",
            label: "Contractor Email",
            type: "email",
            required: true,
          },
          {
            key: "clientName",
            label: "Client Name",
            type: "text",
            required: true,
          },
          {
            key: "clientAddress",
            label: "Client Address",
            type: "textarea",
            required: true,
          },
          {
            key: "clientEmail",
            label: "Client Email",
            type: "email",
            required: true,
          },
          {
            key: "clientBusinessRegistration",
            label: "Client Business Registration",
            type: "text",
            required: true,
          },
          {
            key: "servicesDescription",
            label: "Services Description",
            type: "textarea",
            required: true,
          },
          {
            key: "projectScope",
            label: "Project Scope",
            type: "textarea",
            required: true,
          },
          {
            key: "compensationStructure",
            label: "Compensation Structure",
            type: "select",
            required: true,
            options: [
              "fixed_fee",
              "hourly_rate",
              "milestone_based",
              "retainer",
            ],
          },
          {
            key: "paymentSchedule",
            label: "Payment Schedule",
            type: "text",
            required: true,
          },
          {
            key: "projectStartDate",
            label: "Project Start Date",
            type: "date",
            required: true,
          },
          {
            key: "projectDuration",
            label: "Project Duration",
            type: "text",
            required: true,
          },
          {
            key: "intellectualPropertyOwnership",
            label: "IP Ownership",
            type: "textarea",
            required: true,
          },
          ...basicFields,
        ];

      case DocumentType.NON_COMPETE_AGREEMENT:
        return [
          // Employee Information
          {
            key: "employeeName",
            label: "Employee Name",
            type: "text",
            required: true,
          },
          {
            key: "employeeAddress",
            label: "Employee Address",
            type: "textarea",
            required: true,
          },
          {
            key: "employeeEmail",
            label: "Employee Email",
            type: "email",
            required: true,
          },
          {
            key: "employeePosition",
            label: "Employee Position",
            type: "text",
            required: true,
          },
          {
            key: "employeeId",
            label: "Employee ID (Optional)",
            type: "text",
            required: false,
          },

          // Employer Information
          {
            key: "employerName",
            label: "Employer Name",
            type: "text",
            required: true,
          },
          {
            key: "employerAddress",
            label: "Employer Address",
            type: "textarea",
            required: true,
          },
          {
            key: "employerEmail",
            label: "Employer Email",
            type: "email",
            required: true,
          },
          {
            key: "employerBusinessRegistration",
            label: "Employer Business Registration",
            type: "text",
            required: true,
          },
          {
            key: "employerBusinessType",
            label: "Employer Business Type",
            type: "text",
            required: true,
          },

          // Employment Context
          {
            key: "employmentStartDate",
            label: "Employment Start Date",
            type: "date",
            required: true,
          },
          {
            key: "currentPosition",
            label: "Current Position",
            type: "text",
            required: true,
          },
          {
            key: "accessToConfidentialInfo",
            label: "Access to Confidential Information",
            type: "textarea",
            required: true,
          },
          {
            key: "customerRelationships",
            label: "Customer Relationships",
            type: "textarea",
            required: true,
          },

          // Non-Compete Restrictions
          {
            key: "restrictedActivities",
            label: "Restricted Activities",
            type: "textarea",
            required: true,
          },
          {
            key: "competitorDefinition",
            label: "Competitor Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "restrictedServices",
            label: "Restricted Services",
            type: "textarea",
            required: true,
          },
          {
            key: "restrictedProducts",
            label: "Restricted Products",
            type: "textarea",
            required: true,
          },

          // Geographic Scope
          {
            key: "geographicScope",
            label: "Geographic Scope",
            type: "textarea",
            required: true,
          },
          {
            key: "specificLocations",
            label: "Specific Locations (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "territoryDefinition",
            label: "Territory Definition",
            type: "textarea",
            required: true,
          },

          // Temporal Scope
          {
            key: "restrictionDuration",
            label: "Restriction Duration",
            type: "text",
            required: true,
          },
          {
            key: "restrictionStartDate",
            label: "Restriction Start Date",
            type: "text",
            required: true,
          },

          // Non-Solicitation
          {
            key: "customerNonSolicitation",
            label: "Customer Non-Solicitation Clause",
            type: "textarea",
            required: true,
          },
          {
            key: "employeeNonSolicitation",
            label: "Employee Non-Solicitation Clause",
            type: "textarea",
            required: true,
          },
          {
            key: "supplierNonSolicitation",
            label: "Supplier Non-Solicitation (Optional)",
            type: "textarea",
            required: false,
          },

          // Consideration
          {
            key: "considerationProvided",
            label: "Consideration Provided",
            type: "textarea",
            required: true,
          },
          {
            key: "considerationValue",
            label: "Consideration Value (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "additionalBenefits",
            label: "Additional Benefits (Optional)",
            type: "textarea",
            required: false,
          },

          // Exceptions
          {
            key: "permittedActivities",
            label: "Permitted Activities (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "generalBusinessExceptions",
            label: "General Business Exceptions (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "investmentExceptions",
            label: "Investment Exceptions (Optional)",
            type: "textarea",
            required: false,
          },

          // Enforcement
          {
            key: "remediesAvailable",
            label: "Remedies Available",
            type: "textarea",
            required: true,
          },
          {
            key: "injunctiveReliefProvision",
            label: "Injunctive Relief Provision",
            type: "textarea",
            required: true,
          },
          {
            key: "attorneyFeesProvision",
            label: "Attorney Fees Provision (Optional)",
            type: "textarea",
            required: false,
          },

          // Severability
          {
            key: "severabilityProvisions",
            label: "Severability Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "modificationRights",
            label: "Modification Rights (Optional)",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return [
          // Landlord Information
          {
            key: "landlordName",
            label: "Landlord Name",
            type: "text",
            required: true,
          },
          {
            key: "landlordAddress",
            label: "Landlord Address",
            type: "textarea",
            required: true,
          },
          {
            key: "landlordEmail",
            label: "Landlord Email",
            type: "email",
            required: true,
          },
          {
            key: "landlordPhone",
            label: "Landlord Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "landlordIdNumber",
            label: "Landlord ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Tenant Information
          {
            key: "tenantName",
            label: "Tenant Name",
            type: "text",
            required: true,
          },
          {
            key: "tenantAddress",
            label: "Tenant Address",
            type: "textarea",
            required: true,
          },
          {
            key: "tenantEmail",
            label: "Tenant Email",
            type: "email",
            required: true,
          },
          {
            key: "tenantPhone",
            label: "Tenant Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "tenantIdNumber",
            label: "Tenant ID Number (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "tenantOccupation",
            label: "Tenant Occupation (Optional)",
            type: "text",
            required: false,
          },

          // Property Details
          {
            key: "propertyAddress",
            label: "Property Address",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyDescription",
            label: "Property Description",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyType",
            label: "Property Type",
            type: "select",
            required: true,
            options: ["residential", "commercial", "industrial", "mixed_use"],
          },
          {
            key: "propertySize",
            label: "Property Size",
            type: "text",
            required: true,
          },
          {
            key: "furnishingStatus",
            label: "Furnishing Status",
            type: "select",
            required: true,
            options: ["furnished", "semi_furnished", "unfurnished"],
          },
          {
            key: "furnishingDetails",
            label: "Furnishing Details (Optional)",
            type: "textarea",
            required: false,
          },

          // Lease Terms
          {
            key: "leaseType",
            label: "Lease Type",
            type: "select",
            required: true,
            options: ["fixed_term", "periodic", "at_will"],
          },
          {
            key: "leaseTerm",
            label: "Lease Term",
            type: "text",
            required: true,
          },
          {
            key: "leaseStartDate",
            label: "Lease Start Date",
            type: "date",
            required: true,
          },
          {
            key: "leaseEndDate",
            label: "Lease End Date (Optional)",
            type: "date",
            required: false,
          },
          {
            key: "renewalOptions",
            label: "Renewal Options (Optional)",
            type: "textarea",
            required: false,
          },

          // Financial Terms
          {
            key: "monthlyRent",
            label: "Monthly Rent",
            type: "text",
            required: true,
          },
          {
            key: "rentPaymentDate",
            label: "Rent Payment Date",
            type: "text",
            required: true,
          },
          {
            key: "rentPaymentMethod",
            label: "Rent Payment Method",
            type: "text",
            required: true,
          },
          {
            key: "securityDeposit",
            label: "Security Deposit",
            type: "text",
            required: true,
          },
          {
            key: "advanceRentPayment",
            label: "Advance Rent Payment (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "lateFees",
            label: "Late Fees (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "rentReviewClause",
            label: "Rent Review Clause (Optional)",
            type: "textarea",
            required: false,
          },

          // Property Use
          {
            key: "permittedUse",
            label: "Permitted Use",
            type: "textarea",
            required: true,
          },
          {
            key: "occupancyLimits",
            label: "Occupancy Limits (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "businessUseRestrictions",
            label: "Business Use Restrictions (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "sublettingPolicy",
            label: "Subletting Policy",
            type: "select",
            required: true,
            options: ["prohibited", "with_consent", "freely_permitted"],
          },

          // Maintenance and Repairs
          {
            key: "landlordMaintenanceResponsibilities",
            label: "Landlord Maintenance Responsibilities",
            type: "textarea",
            required: true,
          },
          {
            key: "tenantMaintenanceResponsibilities",
            label: "Tenant Maintenance Responsibilities",
            type: "textarea",
            required: true,
          },
          {
            key: "repairNotificationProcess",
            label: "Repair Notification Process",
            type: "textarea",
            required: true,
          },
          {
            key: "emergencyRepairProcedures",
            label: "Emergency Repair Procedures",
            type: "textarea",
            required: true,
          },

          // Utilities and Services
          {
            key: "utilitiesIncluded",
            label: "Utilities Included",
            type: "textarea",
            required: true,
          },
          {
            key: "utilitiesPaidByTenant",
            label: "Utilities Paid by Tenant",
            type: "textarea",
            required: true,
          },
          {
            key: "serviceCharges",
            label: "Service Charges (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "internetAndCableProvision",
            label: "Internet and Cable Provision (Optional)",
            type: "textarea",
            required: false,
          },

          // Insurance and Liability
          {
            key: "landlordInsuranceRequirements",
            label: "Landlord Insurance Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "tenantInsuranceRequirements",
            label: "Tenant Insurance Requirements (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "liabilityAllocation",
            label: "Liability Allocation",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyDamageResponsibility",
            label: "Property Damage Responsibility",
            type: "textarea",
            required: true,
          },

          // Entry and Inspection
          {
            key: "landlordEntryRights",
            label: "Landlord Entry Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "inspectionSchedule",
            label: "Inspection Schedule (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "noticeRequirements",
            label: "Notice Requirements",
            type: "textarea",
            required: true,
          },

          // Termination and Default
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: true,
          },
          {
            key: "noticePeriodsForTermination",
            label: "Notice Periods for Termination",
            type: "textarea",
            required: true,
          },
          {
            key: "defaultRemedies",
            label: "Default Remedies",
            type: "textarea",
            required: true,
          },
          {
            key: "evictionProcedures",
            label: "Eviction Procedures",
            type: "textarea",
            required: true,
          },

          // Special Provisions
          {
            key: "petPolicy",
            label: "Pet Policy (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "parkingProvisions",
            label: "Parking Provisions (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "securityMeasures",
            label: "Security Measures (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "alterationsPolicy",
            label: "Alterations Policy (Optional)",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return [
          // Vendor Information
          {
            key: "vendorName",
            label: "Vendor Name",
            type: "text",
            required: true,
          },
          {
            key: "vendorAddress",
            label: "Vendor Address",
            type: "textarea",
            required: true,
          },
          {
            key: "vendorEmail",
            label: "Vendor Email",
            type: "email",
            required: true,
          },
          {
            key: "vendorPhone",
            label: "Vendor Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "vendorIdNumber",
            label: "Vendor ID Number",
            type: "text",
            required: true,
          },
          {
            key: "vendorMaritalStatus",
            label: "Vendor Marital Status (Optional)",
            type: "text",
            required: false,
          },

          // Purchaser Information
          {
            key: "purchaserName",
            label: "Purchaser Name",
            type: "text",
            required: true,
          },
          {
            key: "purchaserAddress",
            label: "Purchaser Address",
            type: "textarea",
            required: true,
          },
          {
            key: "purchaserEmail",
            label: "Purchaser Email",
            type: "email",
            required: true,
          },
          {
            key: "purchaserPhone",
            label: "Purchaser Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "purchaserIdNumber",
            label: "Purchaser ID Number",
            type: "text",
            required: true,
          },
          {
            key: "purchaserMaritalStatus",
            label: "Purchaser Marital Status (Optional)",
            type: "text",
            required: false,
          },

          // Property Details
          {
            key: "propertyDescription",
            label: "Property Description",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyAddress",
            label: "Property Address",
            type: "textarea",
            required: true,
          },
          {
            key: "titleNumber",
            label: "Title Number",
            type: "text",
            required: true,
          },
          {
            key: "landRegistryOffice",
            label: "Land Registry Office",
            type: "text",
            required: true,
          },
          {
            key: "propertySize",
            label: "Property Size",
            type: "text",
            required: true,
          },
          {
            key: "propertyBoundaries",
            label: "Property Boundaries",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyType",
            label: "Property Type",
            type: "select",
            required: true,
            options: [
              "residential",
              "commercial",
              "agricultural",
              "industrial",
            ],
          },

          // Purchase Terms
          {
            key: "purchasePrice",
            label: "Purchase Price",
            type: "text",
            required: true,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "depositAmount",
            label: "Deposit Amount",
            type: "text",
            required: true,
          },
          {
            key: "balancePaymentSchedule",
            label: "Balance Payment Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "completionDate",
            label: "Completion Date",
            type: "date",
            required: true,
          },

          // Title and Encumbrances
          {
            key: "titleWarranties",
            label: "Title Warranties",
            type: "textarea",
            required: true,
          },
          {
            key: "existingEncumbrances",
            label: "Existing Encumbrances (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "outstandingCharges",
            label: "Outstanding Charges (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "caveatOrRestrictions",
            label: "Caveats or Restrictions (Optional)",
            type: "textarea",
            required: false,
          },

          // Conditions of Sale
          {
            key: "conditionsToCompletion",
            label: "Conditions to Completion",
            type: "textarea",
            required: true,
          },
          {
            key: "surveyRequirements",
            label: "Survey Requirements (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "soilTestRequirements",
            label: "Soil Test Requirements (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "planningPermissionStatus",
            label: "Planning Permission Status (Optional)",
            type: "textarea",
            required: false,
          },

          // Risk and Insurance
          {
            key: "riskPassageDate",
            label: "Risk Passage Date",
            type: "date",
            required: true,
          },
          {
            key: "insuranceRequirements",
            label: "Insurance Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyInsuranceTransfer",
            label: "Property Insurance Transfer",
            type: "textarea",
            required: true,
          },

          // Completion Arrangements
          {
            key: "completionVenue",
            label: "Completion Venue",
            type: "text",
            required: true,
          },
          {
            key: "documentsForCompletion",
            label: "Documents for Completion",
            type: "textarea",
            required: true,
          },
          {
            key: "possessionDate",
            label: "Possession Date",
            type: "date",
            required: true,
          },
          {
            key: "keyHandoverArrangements",
            label: "Key Handover Arrangements (Optional)",
            type: "textarea",
            required: false,
          },

          // Default and Remedies
          {
            key: "defaultProvisions",
            label: "Default Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "remediesForBreach",
            label: "Remedies for Breach",
            type: "textarea",
            required: true,
          },
          {
            key: "timeIsOfEssenceClause",
            label: "Time is of the Essence",
            type: "radio",
            required: true,
            options: ["true", "false"],
          },
          {
            key: "forfeituteClause",
            label: "Forfeiture Clause (Optional)",
            type: "textarea",
            required: false,
          },

          // Legal and Professional Costs
          {
            key: "legalCosts",
            label: "Legal Costs Allocation",
            type: "textarea",
            required: true,
          },
          {
            key: "stampDutyResponsibility",
            label: "Stamp Duty Responsibility",
            type: "textarea",
            required: true,
          },
          {
            key: "registrationFees",
            label: "Registration Fees Responsibility",
            type: "textarea",
            required: true,
          },
          {
            key: "surveyorFees",
            label: "Surveyor Fees (Optional)",
            type: "textarea",
            required: false,
          },

          // Consent Requirements
          {
            key: "landControlBoardConsent",
            label: "Land Control Board Consent (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "spouseConsent",
            label: "Spouse Consent (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "familyConsent",
            label: "Family Consent (Optional)",
            type: "textarea",
            required: false,
          },

          // Additional Provisions
          {
            key: "reservedRights",
            label: "Reserved Rights (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "easementsAndRights",
            label: "Easements and Rights (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "environmentalCompliance",
            label: "Environmental Compliance (Optional)",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.PROPERTY_MANAGEMENT_AGREEMENT:
        return [
          // Property Owner Information
          {
            key: "ownerName",
            label: "Property Owner Name",
            type: "text",
            required: true,
          },
          {
            key: "ownerAddress",
            label: "Property Owner Address",
            type: "textarea",
            required: true,
          },
          {
            key: "ownerEmail",
            label: "Property Owner Email",
            type: "email",
            required: true,
          },
          {
            key: "ownerPhone",
            label: "Property Owner Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "ownerIdNumber",
            label: "Property Owner ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Property Manager Information
          {
            key: "managerName",
            label: "Property Manager Name",
            type: "text",
            required: true,
          },
          {
            key: "managerAddress",
            label: "Property Manager Address",
            type: "textarea",
            required: true,
          },
          {
            key: "managerEmail",
            label: "Property Manager Email",
            type: "email",
            required: true,
          },
          {
            key: "managerPhone",
            label: "Property Manager Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "managerBusinessRegistration",
            label: "Property Manager Business Registration",
            type: "text",
            required: true,
          },
          {
            key: "managerLicenseNumber",
            label: "Property Manager License Number (Optional)",
            type: "text",
            required: false,
          },

          // Management Services
          {
            key: "servicesScope",
            label: "Scope of Management Services",
            type: "textarea",
            required: true,
          },
          {
            key: "tenantScreeningServices",
            label: "Tenant Screening Services",
            type: "checkbox",
            required: false,
          },
          {
            key: "rentCollectionServices",
            label: "Rent Collection Services",
            type: "checkbox",
            required: false,
          },
          {
            key: "maintenanceManagement",
            label: "Maintenance Management",
            type: "checkbox",
            required: false,
          },
          {
            key: "propertyInspections",
            label: "Property Inspections",
            type: "checkbox",
            required: false,
          },
          {
            key: "legalComplianceManagement",
            label: "Legal Compliance Management",
            type: "checkbox",
            required: false,
          },
          {
            key: "financialReporting",
            label: "Financial Reporting",
            type: "checkbox",
            required: false,
          },
          {
            key: "tenancyManagement",
            label: "Tenancy Management",
            type: "checkbox",
            required: false,
          },

          // Fee Structure
          {
            key: "managementFeeType",
            label: "Management Fee Type",
            type: "select",
            required: true,
            options: [
              "percentage",
              "fixed_monthly",
              "per_unit",
              "commission_based",
            ],
          },
          {
            key: "managementFeeRate",
            label: "Management Fee Rate/Amount",
            type: "text",
            required: true,
          },
          {
            key: "setupFees",
            label: "Setup Fees (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "renewalFees",
            label: "Renewal Fees (Optional)",
            type: "text",
            required: false,
          },

          // Financial Management
          {
            key: "rentCollectionSchedule",
            label: "Rent Collection Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "securityDepositHandling",
            label: "Security Deposit Handling",
            type: "textarea",
            required: true,
          },
          {
            key: "expenseReimbursementProcess",
            label: "Expense Reimbursement Process",
            type: "textarea",
            required: true,
          },

          // Authority and Limitations
          {
            key: "managerAuthority",
            label: "Manager Authority",
            type: "textarea",
            required: true,
          },
          {
            key: "authorityLimitations",
            label: "Authority Limitations",
            type: "textarea",
            required: true,
          },
          {
            key: "expenditureAuthorizationLimits",
            label: "Expenditure Authorization Limits",
            type: "text",
            required: true,
          },

          // Termination
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: true,
          },
          {
            key: "terminationNoticePeriod",
            label: "Termination Notice Period",
            type: "text",
            required: true,
          },
          {
            key: "handoverProcedures",
            label: "Handover Procedures",
            type: "textarea",
            required: true,
          },

          ...basicFields,
        ];

      case DocumentType.PRENUPTIAL_AGREEMENT:
        return [
          // Prospective Spouse 1 Information
          {
            key: "prospectiveSpouse1Name",
            label: "Prospective Spouse 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "prospectiveSpouse1Address",
            label: "Prospective Spouse 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "prospectiveSpouse1Email",
            label: "Prospective Spouse 1 Email",
            type: "email",
            required: true,
          },
          {
            key: "prospectiveSpouse1Phone",
            label: "Prospective Spouse 1 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "prospectiveSpouse1IdNumber",
            label: "Prospective Spouse 1 ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Prospective Spouse 2 Information
          {
            key: "prospectiveSpouse2Name",
            label: "Prospective Spouse 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "prospectiveSpouse2Address",
            label: "Prospective Spouse 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "prospectiveSpouse2Email",
            label: "Prospective Spouse 2 Email",
            type: "email",
            required: true,
          },
          {
            key: "prospectiveSpouse2Phone",
            label: "Prospective Spouse 2 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "prospectiveSpouse2IdNumber",
            label: "Prospective Spouse 2 ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Marriage Details
          {
            key: "intendedMarriageDate",
            label: "Intended Marriage Date",
            type: "date",
            required: true,
          },
          {
            key: "marriageLocation",
            label: "Marriage Location (Optional)",
            type: "text",
            required: false,
          },

          // Financial Information
          {
            key: "spouse1CurrentAssets",
            label: "Spouse 1 Current Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2CurrentAssets",
            label: "Spouse 2 Current Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1CurrentLiabilities",
            label: "Spouse 1 Current Liabilities",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2CurrentLiabilities",
            label: "Spouse 2 Current Liabilities",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1CurrentIncome",
            label: "Spouse 1 Current Income",
            type: "text",
            required: true,
          },
          {
            key: "spouse2CurrentIncome",
            label: "Spouse 2 Current Income",
            type: "text",
            required: true,
          },

          // Property Arrangements
          {
            key: "separatePropertyDefinition",
            label: "Separate Property Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "maritalPropertyDefinition",
            label: "Marital Property Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyAcquisitionRules",
            label: "Property Acquisition Rules",
            type: "textarea",
            required: true,
          },

          // Support and Inheritance
          {
            key: "spousalSupportWaiver",
            label: "Spousal Support Waiver",
            type: "checkbox",
            required: false,
          },
          {
            key: "spousalSupportTerms",
            label: "Spousal Support Terms (if not waived)",
            type: "textarea",
            required: false,
          },
          {
            key: "inheritanceRightsWaiver",
            label: "Inheritance Rights Waiver",
            type: "checkbox",
            required: false,
          },
          {
            key: "inheritanceRightsArrangements",
            label: "Inheritance Rights Arrangements (if not waived)",
            type: "textarea",
            required: false,
          },

          // Business Interests
          {
            key: "spouse1BusinessInterests",
            label: "Spouse 1 Business Interests",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2BusinessInterests",
            label: "Spouse 2 Business Interests",
            type: "textarea",
            required: true,
          },
          {
            key: "businessInterestProtection",
            label: "Business Interest Protection",
            type: "textarea",
            required: true,
          },

          // Legal Representation
          {
            key: "spouse1LegalRepresentation",
            label: "Spouse 1 Has Legal Representation",
            type: "checkbox",
            required: false,
          },
          {
            key: "spouse2LegalRepresentation",
            label: "Spouse 2 Has Legal Representation",
            type: "checkbox",
            required: false,
          },
          {
            key: "independentLegalAdviceConfirmation",
            label: "Independent Legal Advice Confirmation",
            type: "textarea",
            required: true,
          },

          // Disclosure and Fairness
          {
            key: "fullFinancialDisclosure",
            label: "Full Financial Disclosure Provided",
            type: "checkbox",
            required: true,
          },
          {
            key: "voluntaryExecution",
            label: "Voluntary Execution Confirmed",
            type: "checkbox",
            required: true,
          },
          {
            key: "fairnessAtExecution",
            label: "Fairness at Execution",
            type: "textarea",
            required: true,
          },

          // Modification and Enforcement
          {
            key: "modificationProcedures",
            label: "Modification Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "enforceabilityProvisions",
            label: "Enforceability Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeResolutionMechanism",
            label: "Dispute Resolution Mechanism",
            type: "textarea",
            required: true,
          },

          ...basicFields,
        ];

      case DocumentType.POSTNUPTIAL_AGREEMENT:
        return [
          // Married Spouse 1 Information
          {
            key: "spouse1Name",
            label: "Spouse 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "spouse1Address",
            label: "Spouse 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1Email",
            label: "Spouse 1 Email",
            type: "email",
            required: true,
          },
          {
            key: "spouse1Phone",
            label: "Spouse 1 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "spouse1IdNumber",
            label: "Spouse 1 ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Married Spouse 2 Information
          {
            key: "spouse2Name",
            label: "Spouse 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "spouse2Address",
            label: "Spouse 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2Email",
            label: "Spouse 2 Email",
            type: "email",
            required: true,
          },
          {
            key: "spouse2Phone",
            label: "Spouse 2 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "spouse2IdNumber",
            label: "Spouse 2 ID Number (Optional)",
            type: "text",
            required: false,
          },

          // Marriage Details
          {
            key: "marriageDate",
            label: "Marriage Date",
            type: "date",
            required: true,
          },
          {
            key: "marriageLocation",
            label: "Marriage Location (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "reasonForPostnuptialAgreement",
            label: "Reason for Postnuptial Agreement",
            type: "textarea",
            required: true,
          },

          // Pre-Marriage Financial Information
          {
            key: "spouse1PreMaritalAssets",
            label: "Spouse 1 Pre-Marital Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2PreMaritalAssets",
            label: "Spouse 2 Pre-Marital Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1PreMaritalLiabilities",
            label: "Spouse 1 Pre-Marital Liabilities",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2PreMaritalLiabilities",
            label: "Spouse 2 Pre-Marital Liabilities",
            type: "textarea",
            required: true,
          },

          // Current Financial Information
          {
            key: "spouse1CurrentAssets",
            label: "Spouse 1 Current Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2CurrentAssets",
            label: "Spouse 2 Current Assets",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1CurrentLiabilities",
            label: "Spouse 1 Current Liabilities",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2CurrentLiabilities",
            label: "Spouse 2 Current Liabilities",
            type: "textarea",
            required: true,
          },
          {
            key: "maritalAssetsAcquired",
            label: "Marital Assets Acquired During Marriage",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse1CurrentIncome",
            label: "Spouse 1 Current Income",
            type: "text",
            required: true,
          },
          {
            key: "spouse2CurrentIncome",
            label: "Spouse 2 Current Income",
            type: "text",
            required: true,
          },
          {
            key: "changedCircumstances",
            label: "Changed Circumstances Since Marriage",
            type: "textarea",
            required: true,
          },

          // Property Arrangements
          {
            key: "separatePropertyDefinition",
            label: "Separate Property Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "maritalPropertyDefinition",
            label: "Marital Property Definition",
            type: "textarea",
            required: true,
          },
          {
            key: "propertyAcquisitionRules",
            label: "Property Acquisition Rules",
            type: "textarea",
            required: true,
          },
          {
            key: "premaritalPropertyTransformation",
            label: "Pre-Marital Property Transformation Rules",
            type: "textarea",
            required: true,
          },

          // Support and Inheritance
          {
            key: "spousalSupportWaiver",
            label: "Spousal Support Waiver",
            type: "checkbox",
            required: false,
          },
          {
            key: "spousalSupportTerms",
            label: "Spousal Support Terms (if not waived)",
            type: "textarea",
            required: false,
          },
          {
            key: "inheritanceRightsWaiver",
            label: "Inheritance Rights Waiver",
            type: "checkbox",
            required: false,
          },
          {
            key: "inheritanceRightsArrangements",
            label: "Inheritance Rights Arrangements (if not waived)",
            type: "textarea",
            required: false,
          },

          // Business Interests
          {
            key: "spouse1BusinessInterests",
            label: "Spouse 1 Business Interests",
            type: "textarea",
            required: true,
          },
          {
            key: "spouse2BusinessInterests",
            label: "Spouse 2 Business Interests",
            type: "textarea",
            required: true,
          },
          {
            key: "businessInterestProtection",
            label: "Business Interest Protection",
            type: "textarea",
            required: true,
          },

          // Legal Representation
          {
            key: "spouse1LegalRepresentation",
            label: "Spouse 1 Has Legal Representation",
            type: "checkbox",
            required: false,
          },
          {
            key: "spouse2LegalRepresentation",
            label: "Spouse 2 Has Legal Representation",
            type: "checkbox",
            required: false,
          },
          {
            key: "independentLegalAdviceConfirmation",
            label: "Independent Legal Advice Confirmation",
            type: "textarea",
            required: true,
          },

          // Disclosure and Fairness
          {
            key: "fullFinancialDisclosure",
            label: "Full Financial Disclosure Provided",
            type: "checkbox",
            required: true,
          },
          {
            key: "voluntaryExecution",
            label: "Voluntary Execution Confirmed",
            type: "checkbox",
            required: true,
          },
          {
            key: "fairnessAtExecution",
            label: "Fairness at Execution",
            type: "textarea",
            required: true,
          },

          // Modification and Enforcement
          {
            key: "modificationProcedures",
            label: "Modification Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "enforceabilityProvisions",
            label: "Enforceability Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeResolutionMechanism",
            label: "Dispute Resolution Mechanism",
            type: "textarea",
            required: true,
          },

          ...basicFields,
        ];
      case DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT:
        return [
          // Parent/Guardian 1 Information
          {
            key: "parent1Name",
            label: "Parent/Guardian 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "parent1Address",
            label: "Parent/Guardian 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "parent1Email",
            label: "Parent/Guardian 1 Email",
            type: "email",
            required: true,
          },
          {
            key: "parent1Phone",
            label: "Parent/Guardian 1 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent1IdNumber",
            label: "Parent/Guardian 1 ID Number (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent1Occupation",
            label: "Parent/Guardian 1 Occupation (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent1MonthlyIncome",
            label: "Parent/Guardian 1 Monthly Income",
            type: "text",
            required: true,
          },
          {
            key: "parent1FinancialStatus",
            label: "Parent/Guardian 1 Financial Status",
            type: "textarea",
            required: true,
          },

          // Parent/Guardian 2 Information
          {
            key: "parent2Name",
            label: "Parent/Guardian 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "parent2Address",
            label: "Parent/Guardian 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "parent2Email",
            label: "Parent/Guardian 2 Email",
            type: "email",
            required: true,
          },
          {
            key: "parent2Phone",
            label: "Parent/Guardian 2 Phone (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent2IdNumber",
            label: "Parent/Guardian 2 ID Number (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent2Occupation",
            label: "Parent/Guardian 2 Occupation (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "parent2MonthlyIncome",
            label: "Parent/Guardian 2 Monthly Income",
            type: "text",
            required: true,
          },
          {
            key: "parent2FinancialStatus",
            label: "Parent/Guardian 2 Financial Status",
            type: "textarea",
            required: true,
          },

          // Child/Children Information
          {
            key: "childrenDetails",
            label: "Children Details (Names, Ages, Birthdates)",
            type: "textarea",
            required: true,
          },
          {
            key: "numberOfChildren",
            label: "Number of Children",
            type: "number",
            required: true,
          },
          {
            key: "childrenCurrentLivingArrangement",
            label: "Current Living Arrangement",
            type: "textarea",
            required: true,
          },
          {
            key: "childrenSchoolInformation",
            label: "School Information",
            type: "textarea",
            required: true,
          },
          {
            key: "childrenSpecialNeeds",
            label: "Special Needs (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "reasonForCustodyAgreement",
            label: "Reason for Custody Agreement",
            type: "textarea",
            required: true,
          },

          // Physical Custody Arrangements
          {
            key: "primaryPhysicalCustodyParent",
            label: "Primary Physical Custody Parent",
            type: "text",
            required: true,
          },
          {
            key: "physicalCustodySchedule",
            label: "Physical Custody Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "weekdaySchedule",
            label: "Weekday Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "weekendSchedule",
            label: "Weekend Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "holidaySchedule",
            label: "Holiday Schedule",
            type: "textarea",
            required: true,
          },
          {
            key: "pickupDropoffLocations",
            label: "Pickup/Drop-off Locations",
            type: "textarea",
            required: true,
          },
          {
            key: "transportationResponsibilities",
            label: "Transportation Responsibilities",
            type: "textarea",
            required: true,
          },

          // Legal Custody and Decision Making
          {
            key: "legalCustodyArrangement",
            label: "Legal Custody Arrangement",
            type: "select",
            required: true,
            options: ["joint", "sole_parent1", "sole_parent2"],
          },
          {
            key: "educationalDecisionMaking",
            label: "Educational Decision Making",
            type: "textarea",
            required: true,
          },
          {
            key: "medicalDecisionMaking",
            label: "Medical Decision Making",
            type: "textarea",
            required: true,
          },
          {
            key: "majorDecisionConsultation",
            label: "Major Decision Consultation Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "emergencyDecisionProcedures",
            label: "Emergency Decision Procedures",
            type: "textarea",
            required: true,
          },

          // Child Support Provisions
          {
            key: "childSupportAmount",
            label: "Child Support Amount",
            type: "text",
            required: true,
          },
          {
            key: "childSupportPayingParent",
            label: "Child Support Paying Parent",
            type: "text",
            required: true,
          },
          {
            key: "childSupportFrequency",
            label: "Child Support Payment Frequency",
            type: "select",
            required: true,
            options: ["monthly", "bi-weekly", "weekly"],
          },
          {
            key: "childSupportPaymentMethod",
            label: "Child Support Payment Method",
            type: "textarea",
            required: true,
          },
          {
            key: "childSupportCalculationBasis",
            label: "Child Support Calculation Basis",
            type: "textarea",
            required: true,
          },
          {
            key: "medicalInsuranceResponsibility",
            label: "Medical Insurance Responsibility",
            type: "textarea",
            required: true,
          },
          {
            key: "medicalExpenseSharing",
            label: "Medical Expense Sharing",
            type: "textarea",
            required: true,
          },
          {
            key: "educationalExpenseSharing",
            label: "Educational Expense Sharing",
            type: "textarea",
            required: true,
          },

          // Communication and Contact
          {
            key: "communicationBetweenParents",
            label: "Communication Between Parents",
            type: "textarea",
            required: true,
          },
          {
            key: "communicationWithChildren",
            label: "Parent-Child Communication",
            type: "textarea",
            required: true,
          },
          {
            key: "emergencyContactProcedures",
            label: "Emergency Contact Procedures",
            type: "textarea",
            required: true,
          },

          // Travel and Relocation
          {
            key: "travelPermissionRequirements",
            label: "Travel Permission Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "relocationNoticeRequirements",
            label: "Relocation Notice Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "relocationApprovalProcess",
            label: "Relocation Approval Process",
            type: "textarea",
            required: true,
          },

          // Safety and Supervision
          {
            key: "childSafetyProvisions",
            label: "Child Safety Provisions",
            type: "textarea",
            required: true,
          },

          // Modification and Dispute Resolution
          {
            key: "modificationProcedures",
            label: "Modification Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "modificationRequirements",
            label: "Modification Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "mediationRequirement",
            label: "Mediation Required Before Court",
            type: "checkbox",
            required: false,
          },
          {
            key: "disputeResolutionMechanism",
            label: "Dispute Resolution Mechanism",
            type: "textarea",
            required: true,
          },
          {
            key: "enforcementMechanisms",
            label: "Enforcement Mechanisms",
            type: "textarea",
            required: true,
          },

          // Additional Provisions
          {
            key: "childTaxExemptionAllocation",
            label: "Child Tax Exemption Allocation",
            type: "textarea",
            required: true,
          },
          {
            key: "bestInterestOfChildAcknowledgment",
            label: "Best Interest of Child Acknowledgment",
            type: "textarea",
            required: true,
          },
          {
            key: "voluntaryAgreementAcknowledgment",
            label: "Voluntary Agreement",
            type: "checkbox",
            required: false,
          },
          {
            key: "independentLegalAdviceConfirmation",
            label: "Independent Legal Advice Confirmation",
            type: "textarea",
            required: true,
          },
          {
            key: "courtJurisdictionForEnforcement",
            label: "Court Jurisdiction for Enforcement",
            type: "textarea",
            required: true,
          },

          ...basicFields,
        ];

      case DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT:
        return [
          // Author Information
          {
            key: "authorName",
            label: "Author/Creator Name",
            type: "text",
            required: true,
          },
          {
            key: "authorAddress",
            label: "Author Address",
            type: "textarea",
            required: true,
          },
          {
            key: "authorEmail",
            label: "Author Email",
            type: "email",
            required: false,
          },
          {
            key: "authorPhone",
            label: "Author Phone",
            type: "text",
            required: false,
          },

          // Assignee Information
          {
            key: "assigneeName",
            label: "Assignee Name",
            type: "text",
            required: true,
          },
          {
            key: "assigneeAddress",
            label: "Assignee Address",
            type: "textarea",
            required: true,
          },
          {
            key: "assigneeEmail",
            label: "Assignee Email",
            type: "email",
            required: false,
          },
          {
            key: "assigneePhone",
            label: "Assignee Phone",
            type: "text",
            required: false,
          },

          // Work Details
          {
            key: "workDescription",
            label: "Work Description",
            type: "textarea",
            required: true,
          },
          {
            key: "workTitle",
            label: "Work Title",
            type: "text",
            required: true,
          },
          {
            key: "creationDate",
            label: "Creation Date",
            type: "date",
            required: false,
          },
          {
            key: "copyrightRegistrationNumber",
            label: "Copyright Registration Number",
            type: "text",
            required: false,
          },

          // Assignment Terms
          {
            key: "assignmentScope",
            label: "Assignment Scope",
            type: "select",
            required: true,
            options: ["exclusive", "non-exclusive"],
          },
          {
            key: "consideration",
            label: "Consideration/Payment",
            type: "textarea",
            required: true,
          },
          {
            key: "territory",
            label: "Territory",
            type: "text",
            required: true,
          },
          { key: "duration", label: "Duration", type: "text", required: true },

          // Rights and Warranties
          {
            key: "moralRightsWaiver",
            label: "Moral Rights",
            type: "select",
            required: true,
            options: ["waived", "retained"],
          },
          {
            key: "warrantyProvisions",
            label: "Warranty Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "indemnificationTerms",
            label: "Indemnification Terms",
            type: "textarea",
            required: false,
          },

          // Additional Terms
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.TRADEMARK_LICENSE_AGREEMENT:
        return [
          // Licensor Information
          {
            key: "licensorName",
            label: "Licensor Name",
            type: "text",
            required: true,
          },
          {
            key: "licensorAddress",
            label: "Licensor Address",
            type: "textarea",
            required: true,
          },
          {
            key: "licensorEmail",
            label: "Licensor Email",
            type: "email",
            required: false,
          },
          {
            key: "licensorPhone",
            label: "Licensor Phone",
            type: "text",
            required: false,
          },
          {
            key: "licensorBusinessRegistration",
            label: "Licensor Business Registration",
            type: "text",
            required: false,
          },

          // Licensee Information
          {
            key: "licenseeName",
            label: "Licensee Name",
            type: "text",
            required: true,
          },
          {
            key: "licenseeAddress",
            label: "Licensee Address",
            type: "textarea",
            required: true,
          },
          {
            key: "licenseeEmail",
            label: "Licensee Email",
            type: "email",
            required: false,
          },
          {
            key: "licenseePhone",
            label: "Licensee Phone",
            type: "text",
            required: false,
          },
          {
            key: "licenseeBusinessRegistration",
            label: "Licensee Business Registration",
            type: "text",
            required: false,
          },

          // Trademark Details
          {
            key: "trademarkDescription",
            label: "Trademark Description",
            type: "textarea",
            required: true,
          },
          {
            key: "trademarkRegistrationNumber",
            label: "Trademark Registration Number",
            type: "text",
            required: false,
          },
          {
            key: "trademarkClasses",
            label: "Trademark Classes",
            type: "text",
            required: false,
          },
          {
            key: "registrationDate",
            label: "Registration Date",
            type: "date",
            required: false,
          },
          {
            key: "registrationJurisdiction",
            label: "Registration Jurisdiction",
            type: "text",
            required: false,
          },

          // License Terms
          {
            key: "licensedProducts",
            label: "Licensed Products",
            type: "textarea",
            required: true,
          },
          {
            key: "licensedServices",
            label: "Licensed Services",
            type: "textarea",
            required: false,
          },
          {
            key: "territory",
            label: "Territory",
            type: "text",
            required: true,
          },
          {
            key: "exclusivity",
            label: "Exclusivity",
            type: "select",
            required: true,
            options: ["exclusive", "non-exclusive"],
          },
          {
            key: "licenseDuration",
            label: "License Duration",
            type: "text",
            required: true,
          },

          // Financial Terms
          {
            key: "royaltyStructure",
            label: "Royalty Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "minimumRoyalties",
            label: "Minimum Royalties",
            type: "text",
            required: false,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "reportingRequirements",
            label: "Reporting Requirements",
            type: "textarea",
            required: false,
          },

          // Quality and Control
          {
            key: "qualityControlStandards",
            label: "Quality Control Standards",
            type: "textarea",
            required: true,
          },
          {
            key: "approvalRequirements",
            label: "Approval Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "inspectionRights",
            label: "Inspection Rights",
            type: "textarea",
            required: false,
          },

          // Marketing and Promotion
          {
            key: "marketingObligations",
            label: "Marketing Obligations",
            type: "textarea",
            required: true,
          },
          {
            key: "advertisingRequirements",
            label: "Advertising Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "promotionalMaterials",
            label: "Promotional Materials",
            type: "textarea",
            required: false,
          },

          // Legal and Compliance
          {
            key: "infringementProcedures",
            label: "Infringement Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.PATENT_LICENSING_AGREEMENT:
        return [
          // Patent Owner Information
          {
            key: "patentOwnerName",
            label: "Patent Owner Name",
            type: "text",
            required: true,
          },
          {
            key: "patentOwnerAddress",
            label: "Patent Owner Address",
            type: "textarea",
            required: true,
          },
          {
            key: "patentOwnerEmail",
            label: "Patent Owner Email",
            type: "email",
            required: false,
          },
          {
            key: "patentOwnerPhone",
            label: "Patent Owner Phone",
            type: "text",
            required: false,
          },
          {
            key: "patentOwnerBusinessRegistration",
            label: "Patent Owner Business Registration",
            type: "text",
            required: false,
          },

          // Licensee Information
          {
            key: "licenseeName",
            label: "Licensee Name",
            type: "text",
            required: true,
          },
          {
            key: "licenseeAddress",
            label: "Licensee Address",
            type: "textarea",
            required: true,
          },
          {
            key: "licenseeEmail",
            label: "Licensee Email",
            type: "email",
            required: false,
          },
          {
            key: "licenseePhone",
            label: "Licensee Phone",
            type: "text",
            required: false,
          },
          {
            key: "licenseeBusinessRegistration",
            label: "Licensee Business Registration",
            type: "text",
            required: false,
          },

          // Patent Details
          {
            key: "patentDescription",
            label: "Patent Description",
            type: "textarea",
            required: true,
          },
          {
            key: "patentNumber",
            label: "Patent Number",
            type: "text",
            required: false,
          },
          {
            key: "patentTitle",
            label: "Patent Title",
            type: "text",
            required: true,
          },
          {
            key: "patentClaims",
            label: "Patent Claims",
            type: "textarea",
            required: false,
          },
          {
            key: "filingDate",
            label: "Filing Date",
            type: "date",
            required: false,
          },
          {
            key: "grantDate",
            label: "Grant Date",
            type: "date",
            required: false,
          },
          {
            key: "patentJurisdiction",
            label: "Patent Jurisdiction",
            type: "text",
            required: false,
          },

          // License Terms
          {
            key: "licensedTechnology",
            label: "Licensed Technology",
            type: "textarea",
            required: true,
          },
          {
            key: "fieldOfUse",
            label: "Field of Use",
            type: "textarea",
            required: true,
          },
          {
            key: "territory",
            label: "Territory",
            type: "text",
            required: true,
          },
          {
            key: "exclusivity",
            label: "Exclusivity",
            type: "select",
            required: true,
            options: ["exclusive", "non-exclusive", "sole"],
          },
          {
            key: "licenseDuration",
            label: "License Duration",
            type: "text",
            required: true,
          },

          // Financial Terms
          {
            key: "royaltyStructure",
            label: "Royalty Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "minimumRoyalties",
            label: "Minimum Royalties",
            type: "text",
            required: false,
          },
          {
            key: "paymentTerms",
            label: "Payment Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "reportingRequirements",
            label: "Reporting Requirements",
            type: "textarea",
            required: false,
          },

          // Technical and Development
          {
            key: "improvementRights",
            label: "Improvement Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "technologyTransfer",
            label: "Technology Transfer",
            type: "textarea",
            required: false,
          },
          {
            key: "technicalSupport",
            label: "Technical Support",
            type: "textarea",
            required: false,
          },
          {
            key: "trainingProvisions",
            label: "Training Provisions",
            type: "textarea",
            required: false,
          },

          // Legal and Compliance
          {
            key: "patentProsecution",
            label: "Patent Prosecution",
            type: "textarea",
            required: false,
          },
          {
            key: "enforcementObligations",
            label: "Enforcement Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "infringementProcedures",
            label: "Infringement Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "validityWarranties",
            label: "Validity Warranties",
            type: "textarea",
            required: false,
          },
          {
            key: "indemnificationTerms",
            label: "Indemnification Terms",
            type: "textarea",
            required: false,
          },

          // Additional Terms
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.ARTICLES_OF_ASSOCIATION:
        return [
          // Company Information
          {
            key: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            key: "companyAddress",
            label: "Company Address",
            type: "textarea",
            required: true,
          },
          {
            key: "companyRegistrationNumber",
            label: "Company Registration Number",
            type: "text",
            required: false,
          },
          {
            key: "companyType",
            label: "Company Type",
            type: "select",
            required: true,
            options: ["private", "public", "limited", "unlimited"],
          },
          {
            key: "businessObjectives",
            label: "Business Objectives",
            type: "textarea",
            required: true,
          },

          // Share Capital Structure
          {
            key: "authorizedShareCapital",
            label: "Authorized Share Capital",
            type: "text",
            required: true,
          },
          {
            key: "shareNominalValue",
            label: "Share Nominal Value",
            type: "text",
            required: true,
          },
          {
            key: "shareClasses",
            label: "Share Classes",
            type: "textarea",
            required: false,
          },
          {
            key: "shareCapitalStructure",
            label: "Share Capital Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "initialShareAllocation",
            label: "Initial Share Allocation",
            type: "textarea",
            required: true,
          },

          // Director Information
          {
            key: "directorPowers",
            label: "Director Powers",
            type: "textarea",
            required: true,
          },
          {
            key: "directorQualifications",
            label: "Director Qualifications",
            type: "textarea",
            required: false,
          },
          {
            key: "directorLimitations",
            label: "Director Limitations",
            type: "textarea",
            required: true,
          },
          {
            key: "boardComposition",
            label: "Board Composition",
            type: "textarea",
            required: true,
          },
          {
            key: "directorAppointmentProcedure",
            label: "Director Appointment Procedure",
            type: "textarea",
            required: true,
          },
          {
            key: "directorRemovalProcedure",
            label: "Director Removal Procedure",
            type: "textarea",
            required: true,
          },

          // Shareholder Rights
          {
            key: "shareholderRights",
            label: "Shareholder Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "votingRights",
            label: "Voting Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "shareholderMeetingRights",
            label: "Shareholder Meeting Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "informationRights",
            label: "Information Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "preemptionRights",
            label: "Preemption Rights",
            type: "textarea",
            required: false,
          },

          // Meeting Procedures
          {
            key: "meetingProcedures",
            label: "Meeting Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "boardMeetingProcedures",
            label: "Board Meeting Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "generalMeetingProcedures",
            label: "General Meeting Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "noticeRequirements",
            label: "Notice Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "quorumRequirements",
            label: "Quorum Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "votingProcedures",
            label: "Voting Procedures",
            type: "textarea",
            required: true,
          },

          // Financial Provisions
          {
            key: "dividendRules",
            label: "Dividend Rules",
            type: "textarea",
            required: true,
          },
          {
            key: "dividendDeclarationProcedure",
            label: "Dividend Declaration Procedure",
            type: "textarea",
            required: true,
          },
          {
            key: "profitDistribution",
            label: "Profit Distribution",
            type: "textarea",
            required: true,
          },
          {
            key: "reserveFunds",
            label: "Reserve Funds",
            type: "textarea",
            required: false,
          },

          // Transfer and Ownership
          {
            key: "transferRestrictions",
            label: "Transfer Restrictions",
            type: "textarea",
            required: true,
          },
          {
            key: "shareTransferProcedure",
            label: "Share Transfer Procedure",
            type: "textarea",
            required: true,
          },
          {
            key: "transferApprovalRequirements",
            label: "Transfer Approval Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "rightOfFirstRefusal",
            label: "Right of First Refusal",
            type: "textarea",
            required: false,
          },

          // Company Operations
          {
            key: "auditRequirements",
            label: "Audit Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "accountingStandards",
            label: "Accounting Standards",
            type: "textarea",
            required: true,
          },
          {
            key: "financialReporting",
            label: "Financial Reporting",
            type: "textarea",
            required: true,
          },
          {
            key: "recordKeeping",
            label: "Record Keeping",
            type: "textarea",
            required: true,
          },

          // Amendment and Winding Up
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "specialResolutionRequirements",
            label: "Special Resolution Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "windingUpProcedures",
            label: "Winding Up Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "assetDistribution",
            label: "Asset Distribution",
            type: "textarea",
            required: true,
          },

          // Additional Provisions
          {
            key: "indemnityProvisions",
            label: "Indemnity Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "conflictOfInterestRules",
            label: "Conflict of Interest Rules",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceRequirements",
            label: "Compliance Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "additionalClauses",
            label: "Additional Clauses",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.SHAREHOLDER_AGREEMENT:
        return [
          // Company Information
          {
            key: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            key: "companyAddress",
            label: "Company Address",
            type: "textarea",
            required: true,
          },
          {
            key: "companyRegistrationNumber",
            label: "Company Registration Number",
            type: "text",
            required: false,
          },
          {
            key: "companyBusinessType",
            label: "Company Business Type",
            type: "text",
            required: true,
          },
          {
            key: "incorporationDate",
            label: "Incorporation Date",
            type: "date",
            required: false,
          },

          // Share Capital Information
          {
            key: "authorizedShareCapital",
            label: "Authorized Share Capital",
            type: "text",
            required: true,
          },
          {
            key: "shareholdingPercentages",
            label: "Shareholding Percentages Summary",
            type: "textarea",
            required: true,
          },
          {
            key: "totalSharesIssued",
            label: "Total Shares Issued",
            type: "text",
            required: true,
          },
          {
            key: "shareClasses",
            label: "Share Classes",
            type: "textarea",
            required: false,
          },
          {
            key: "shareNominalValue",
            label: "Share Nominal Value",
            type: "text",
            required: true,
          },
          {
            key: "paidUpCapital",
            label: "Paid-Up Capital",
            type: "text",
            required: true,
          },

          // Shareholder 1 Information
          {
            key: "shareholder1Name",
            label: "Shareholder 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "shareholder1Address",
            label: "Shareholder 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "shareholder1Email",
            label: "Shareholder 1 Email",
            type: "email",
            required: false,
          },
          {
            key: "shareholder1Percentage",
            label: "Shareholder 1 Percentage",
            type: "text",
            required: true,
          },
          {
            key: "shareholder1Shares",
            label: "Shareholder 1 Number of Shares",
            type: "text",
            required: true,
          },

          // Shareholder 2 Information
          {
            key: "shareholder2Name",
            label: "Shareholder 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "shareholder2Address",
            label: "Shareholder 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "shareholder2Email",
            label: "Shareholder 2 Email",
            type: "email",
            required: false,
          },
          {
            key: "shareholder2Percentage",
            label: "Shareholder 2 Percentage",
            type: "text",
            required: true,
          },
          {
            key: "shareholder2Shares",
            label: "Shareholder 2 Number of Shares",
            type: "text",
            required: true,
          },

          // Shareholder 3 Information (Optional)
          {
            key: "shareholder3Name",
            label: "Shareholder 3 Name (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "shareholder3Address",
            label: "Shareholder 3 Address (Optional)",
            type: "textarea",
            required: false,
          },
          {
            key: "shareholder3Email",
            label: "Shareholder 3 Email (Optional)",
            type: "email",
            required: false,
          },
          {
            key: "shareholder3Percentage",
            label: "Shareholder 3 Percentage (Optional)",
            type: "text",
            required: false,
          },
          {
            key: "shareholder3Shares",
            label: "Shareholder 3 Number of Shares (Optional)",
            type: "text",
            required: false,
          },

          // Board and Management
          {
            key: "boardRepresentation",
            label: "Board Representation",
            type: "textarea",
            required: true,
          },
          {
            key: "boardSize",
            label: "Board Size",
            type: "text",
            required: true,
          },
          {
            key: "directorAppointmentRights",
            label: "Director Appointment Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "managementStructure",
            label: "Management Structure",
            type: "textarea",
            required: true,
          },
          {
            key: "votingAgreements",
            label: "Voting Agreements",
            type: "textarea",
            required: true,
          },
          {
            key: "quorumRequirements",
            label: "Quorum Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "chairmanAppointment",
            label: "Chairman Appointment",
            type: "textarea",
            required: false,
          },

          // Transfer Restrictions
          {
            key: "transferRestrictions",
            label: "Transfer Restrictions",
            type: "textarea",
            required: true,
          },
          {
            key: "rightOfFirstRefusal",
            label: "Right of First Refusal",
            type: "textarea",
            required: true,
          },
          {
            key: "tagAlongRights",
            label: "Tag-Along Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "dragAlongRights",
            label: "Drag-Along Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "transferApprovalProcess",
            label: "Transfer Approval Process",
            type: "textarea",
            required: true,
          },
          {
            key: "valuationForTransfers",
            label: "Valuation for Transfers",
            type: "textarea",
            required: true,
          },
          {
            key: "restrictedTransferees",
            label: "Restricted Transferees",
            type: "textarea",
            required: false,
          },

          // Information Rights
          {
            key: "informationRights",
            label: "Information Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "financialReporting",
            label: "Financial Reporting",
            type: "textarea",
            required: true,
          },
          {
            key: "inspectionRights",
            label: "Inspection Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "boardMeetingRights",
            label: "Board Meeting Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "auditRights",
            label: "Audit Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "recordAccessRights",
            label: "Record Access Rights",
            type: "textarea",
            required: true,
          },

          // Financing and Dividends
          {
            key: "dividendPolicy",
            label: "Dividend Policy",
            type: "textarea",
            required: true,
          },
          {
            key: "preemptionRights",
            label: "Preemption Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "antiDilutionProvisions",
            label: "Anti-Dilution Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "capitalCallProcedures",
            label: "Capital Call Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "liquidationPreferences",
            label: "Liquidation Preferences",
            type: "textarea",
            required: false,
          },
          {
            key: "distributionPolicy",
            label: "Distribution Policy",
            type: "textarea",
            required: true,
          },

          // Exit Mechanisms
          {
            key: "exitMechanisms",
            label: "Exit Mechanisms",
            type: "textarea",
            required: true,
          },
          {
            key: "buyoutTriggers",
            label: "Buyout Triggers",
            type: "textarea",
            required: false,
          },
          {
            key: "valuationMethods",
            label: "Valuation Methods",
            type: "textarea",
            required: true,
          },
          {
            key: "compulsoryTransferEvents",
            label: "Compulsory Transfer Events",
            type: "textarea",
            required: false,
          },
          {
            key: "retirementProvisions",
            label: "Retirement Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "deathDisabilityProvisions",
            label: "Death and Disability Provisions",
            type: "textarea",
            required: false,
          },

          // Dispute Resolution and Governance
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: true,
          },
          {
            key: "deadlockResolution",
            label: "Deadlock Resolution",
            type: "textarea",
            required: true,
          },
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "arbitrationProvisions",
            label: "Arbitration Provisions",
            type: "textarea",
            required: false,
          },

          // Restrictive Covenants
          {
            key: "nonCompeteRestrictions",
            label: "Non-Compete Restrictions",
            type: "textarea",
            required: false,
          },
          {
            key: "confidentialityObligations",
            label: "Confidentiality Obligations",
            type: "textarea",
            required: true,
          },
          {
            key: "nonSolicitationClauses",
            label: "Non-Solicitation Clauses",
            type: "textarea",
            required: false,
          },
          {
            key: "businessOpportunityRights",
            label: "Business Opportunity Rights",
            type: "textarea",
            required: false,
          },

          // Additional Terms
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: true,
          },
          {
            key: "successorObligations",
            label: "Successor Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "entireAgreementClause",
            label: "Entire Agreement Clause",
            type: "textarea",
            required: false,
          },
          {
            key: "severabilityProvisions",
            label: "Severability Provisions",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.BOARD_RESOLUTION:
        return [
          // Company Information
          {
            key: "companyName",
            label: "Company Name",
            type: "text",
            required: true,
          },
          {
            key: "companyAddress",
            label: "Company Address",
            type: "textarea",
            required: true,
          },
          {
            key: "companyRegistrationNumber",
            label: "Company Registration Number",
            type: "text",
            required: false,
          },
          {
            key: "incorporationDate",
            label: "Incorporation Date",
            type: "date",
            required: false,
          },

          // Meeting Details
          {
            key: "meetingDate",
            label: "Meeting Date",
            type: "date",
            required: true,
          },
          {
            key: "meetingTime",
            label: "Meeting Time",
            type: "text",
            required: true,
          },
          {
            key: "meetingLocation",
            label: "Meeting Location",
            type: "text",
            required: true,
          },
          {
            key: "meetingType",
            label: "Meeting Type",
            type: "select",
            required: true,
            options: [
              "board",
              "annual_general",
              "extraordinary_general",
              "special",
            ],
          },
          {
            key: "meetingChairman",
            label: "Meeting Chairman",
            type: "text",
            required: true,
          },

          // Directors and Attendance
          {
            key: "totalDirectors",
            label: "Total Number of Directors",
            type: "text",
            required: true,
          },
          {
            key: "directorsPresent",
            label: "Directors Present",
            type: "textarea",
            required: true,
          },
          {
            key: "directorsAbsent",
            label: "Directors Absent",
            type: "textarea",
            required: false,
          },
          {
            key: "quorumRequired",
            label: "Quorum Required",
            type: "text",
            required: true,
          },
          {
            key: "quorumMet",
            label: "Quorum Met",
            type: "select",
            required: true,
            options: ["yes", "no"],
          },

          // Resolution Details
          {
            key: "resolutionTitle",
            label: "Resolution Title",
            type: "text",
            required: true,
          },
          {
            key: "resolutionDescription",
            label: "Resolution Description",
            type: "textarea",
            required: true,
          },
          {
            key: "resolutionType",
            label: "Resolution Type",
            type: "select",
            required: true,
            options: ["ordinary", "special", "unanimous"],
          },
          {
            key: "votingResults",
            label: "Voting Results Summary",
            type: "textarea",
            required: true,
          },
          {
            key: "votesInFavor",
            label: "Votes in Favor",
            type: "text",
            required: true,
          },
          {
            key: "votesAgainst",
            label: "Votes Against",
            type: "text",
            required: false,
          },
          {
            key: "abstentions",
            label: "Abstentions",
            type: "text",
            required: false,
          },

          // Implementation and Authority
          {
            key: "implementationAuthority",
            label: "Implementation Authority",
            type: "textarea",
            required: true,
          },
          {
            key: "implementationDeadline",
            label: "Implementation Deadline",
            type: "date",
            required: false,
          },
          {
            key: "responsiblePersons",
            label: "Responsible Persons",
            type: "textarea",
            required: true,
          },
          {
            key: "reportingRequirements",
            label: "Reporting Requirements",
            type: "textarea",
            required: false,
          },

          // Secretary and Certification
          {
            key: "companySecretary",
            label: "Company Secretary Name",
            type: "text",
            required: true,
          },
          {
            key: "secretaryAddress",
            label: "Secretary Address",
            type: "textarea",
            required: false,
          },
          {
            key: "witnessName",
            label: "Witness Name",
            type: "text",
            required: false,
          },
          {
            key: "witnessAddress",
            label: "Witness Address",
            type: "textarea",
            required: false,
          },
          {
            key: "filingRequirements",
            label: "Filing Requirements",
            type: "textarea",
            required: false,
          },

          // Additional Information
          {
            key: "previousResolutions",
            label: "Related Previous Resolutions",
            type: "textarea",
            required: false,
          },
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "additionalProvisions",
            label: "Additional Provisions",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.SETTLEMENT_AGREEMENT:
        return [
          // Disputing Party 1 Information
          {
            key: "disputeParty1Name",
            label: "Party 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "disputeParty1Address",
            label: "Party 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeParty1Email",
            label: "Party 1 Email",
            type: "email",
            required: true,
          },
          {
            key: "disputeParty1Phone",
            label: "Party 1 Phone",
            type: "text",
            required: false,
          },
          {
            key: "disputeParty1LegalRep",
            label: "Party 1 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "disputeParty1LegalRepAddress",
            label: "Party 1 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Disputing Party 2 Information
          {
            key: "disputeParty2Name",
            label: "Party 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "disputeParty2Address",
            label: "Party 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeParty2Email",
            label: "Party 2 Email",
            type: "email",
            required: true,
          },
          {
            key: "disputeParty2Phone",
            label: "Party 2 Phone",
            type: "text",
            required: false,
          },
          {
            key: "disputeParty2LegalRep",
            label: "Party 2 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "disputeParty2LegalRepAddress",
            label: "Party 2 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Additional Parties
          {
            key: "additionalParties",
            label: "Additional Parties (if applicable)",
            type: "textarea",
            required: false,
          },

          // Dispute Background and Description
          {
            key: "disputeDescription",
            label: "Dispute Description",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeBackground",
            label: "Dispute Background",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeOriginDate",
            label: "Dispute Origin Date",
            type: "date",
            required: false,
          },
          {
            key: "disputeLocation",
            label: "Dispute Location",
            type: "text",
            required: false,
          },
          {
            key: "disputeSubjectMatter",
            label: "Subject Matter of Dispute",
            type: "textarea",
            required: true,
          },
          {
            key: "claimsAndCounterclaims",
            label: "Claims and Counterclaims",
            type: "textarea",
            required: true,
          },
          {
            key: "legalProceedingsCaseNumber",
            label: "Legal Proceedings Case Number",
            type: "text",
            required: false,
          },
          {
            key: "courtJurisdiction",
            label: "Court Jurisdiction",
            type: "text",
            required: false,
          },

          // Settlement Terms and Agreements
          {
            key: "settlementTerms",
            label: "Settlement Terms",
            type: "textarea",
            required: true,
          },
          {
            key: "settlementDescription",
            label: "Settlement Description",
            type: "textarea",
            required: true,
          },
          {
            key: "settlementConsideration",
            label: "Settlement Consideration",
            type: "textarea",
            required: true,
          },

          // Payment Provisions
          {
            key: "settlementAmount",
            label: "Settlement Amount",
            type: "text",
            required: false,
          },
          {
            key: "paymentStructure",
            label: "Payment Structure",
            type: "textarea",
            required: false,
          },
          {
            key: "paymentSchedule",
            label: "Payment Schedule",
            type: "textarea",
            required: false,
          },
          {
            key: "paymentMethod",
            label: "Payment Method",
            type: "select",
            required: false,
            options: ["bank_transfer", "cheque", "cash", "other"],
          },
          {
            key: "paymentDueDate",
            label: "Payment Due Date",
            type: "date",
            required: false,
          },
          {
            key: "latePaymentPenalties",
            label: "Late Payment Penalties",
            type: "textarea",
            required: false,
          },

          // Non-Monetary Settlement Terms
          {
            key: "nonMonetaryTerms",
            label: "Non-Monetary Terms",
            type: "textarea",
            required: false,
          },
          {
            key: "performanceObligations",
            label: "Performance Obligations",
            type: "textarea",
            required: true,
          },
          {
            key: "performanceDeadlines",
            label: "Performance Deadlines",
            type: "textarea",
            required: false,
          },
          {
            key: "deliverables",
            label: "Deliverables",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceRequirements",
            label: "Compliance Requirements",
            type: "textarea",
            required: false,
          },

          // Release of Claims
          {
            key: "releaseOfClaimsScope",
            label: "Release of Claims Scope",
            type: "textarea",
            required: true,
          },
          {
            key: "mutualRelease",
            label: "Mutual Release",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "reservedRights",
            label: "Reserved Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "excludedClaims",
            label: "Excluded Claims",
            type: "textarea",
            required: false,
          },
          {
            key: "releaseCoverage",
            label: "Release Coverage",
            type: "select",
            required: true,
            options: ["specific", "broad", "mutual"],
          },
          {
            key: "thirdPartyReleases",
            label: "Third Party Releases",
            type: "textarea",
            required: false,
          },

          // Confidentiality and Non-Disclosure
          {
            key: "confidentialityProvisions",
            label: "Confidentiality Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "confidentialityDuration",
            label: "Confidentiality Duration",
            type: "text",
            required: false,
          },
          {
            key: "publicDisclosureRestrictions",
            label: "Public Disclosure Restrictions",
            type: "textarea",
            required: false,
          },
          {
            key: "mediaStatementRestrictions",
            label: "Media Statement Restrictions",
            type: "textarea",
            required: false,
          },
          {
            key: "nonDisparagement",
            label: "Non-Disparagement Clause",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "nonDisparagementTerms",
            label: "Non-Disparagement Terms",
            type: "textarea",
            required: false,
          },

          // Compliance and Monitoring
          {
            key: "complianceMonitoring",
            label: "Compliance Monitoring",
            type: "textarea",
            required: false,
          },
          {
            key: "reportingRequirements",
            label: "Reporting Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "auditRights",
            label: "Audit Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "oversightMechanisms",
            label: "Oversight Mechanisms",
            type: "textarea",
            required: false,
          },

          // Default and Enforcement
          {
            key: "defaultConsequences",
            label: "Default Consequences",
            type: "textarea",
            required: true,
          },
          {
            key: "breachRemedyProcedures",
            label: "Breach Remedy Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "enforcementMechanisms",
            label: "Enforcement Mechanisms",
            type: "textarea",
            required: true,
          },
          {
            key: "liquidatedDamages",
            label: "Liquidated Damages",
            type: "textarea",
            required: false,
          },
          {
            key: "specificPerformanceRights",
            label: "Specific Performance Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "accelerationClauses",
            label: "Acceleration Clauses",
            type: "textarea",
            required: false,
          },

          // Dispute Resolution for Future Issues
          {
            key: "futureDisputeResolution",
            label: "Future Dispute Resolution",
            type: "textarea",
            required: false,
          },
          {
            key: "mediationRequirements",
            label: "Mediation Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "arbitrationProvisions",
            label: "Arbitration Provisions",
            type: "textarea",
            required: false,
          },

          // Legal and Administrative
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "jurisdiction",
            label: "Jurisdiction",
            type: "text",
            required: false,
          },
          {
            key: "legalCosts",
            label: "Legal Costs Allocation",
            type: "textarea",
            required: false,
          },
          {
            key: "attorneyFeesAllocation",
            label: "Attorney Fees Allocation",
            type: "textarea",
            required: false,
          },

          // Execution and Effectiveness
          {
            key: "executionRequirements",
            label: "Execution Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "effectivenessConditions",
            label: "Effectiveness Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "approvalRequirements",
            label: "Approval Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "courtApprovalRequired",
            label: "Court Approval Required",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },

          // Miscellaneous Provisions
          {
            key: "entireAgreementClause",
            label: "Entire Agreement Clause",
            type: "textarea",
            required: false,
          },
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "severabilityProvisions",
            label: "Severability Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "successorObligations",
            label: "Successor Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "noticeRequirements",
            label: "Notice Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "interpretationRules",
            label: "Interpretation Rules",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.ARBITRATION_AGREEMENT:
        return [
          // Party 1 Information
          {
            key: "party1Name",
            label: "Party 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "party1Address",
            label: "Party 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "party1Email",
            label: "Party 1 Email",
            type: "email",
            required: true,
          },
          {
            key: "party1Phone",
            label: "Party 1 Phone",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRep",
            label: "Party 1 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRepFirm",
            label: "Party 1 Law Firm",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRepAddress",
            label: "Party 1 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Party 2 Information
          {
            key: "party2Name",
            label: "Party 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "party2Address",
            label: "Party 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "party2Email",
            label: "Party 2 Email",
            type: "email",
            required: true,
          },
          {
            key: "party2Phone",
            label: "Party 2 Phone",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRep",
            label: "Party 2 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRepFirm",
            label: "Party 2 Law Firm",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRepAddress",
            label: "Party 2 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Additional Parties
          {
            key: "additionalParties",
            label: "Additional Parties (if applicable)",
            type: "textarea",
            required: false,
          },

          // Agreement Form and Scope
          {
            key: "agreementType",
            label: "Agreement Type",
            type: "select",
            required: true,
            options: ["clause", "separate_agreement"],
          },
          {
            key: "disputeScope",
            label: "Dispute Scope",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeCoverage",
            label: "Dispute Coverage",
            type: "select",
            required: true,
            options: [
              "arising_from_contract",
              "arising_or_may_arise",
              "all_disputes",
              "specific_matters",
            ],
          },
          {
            key: "specificMattersDescription",
            label: "Specific Matters Description",
            type: "textarea",
            required: false,
          },
          {
            key: "contractualBasis",
            label: "Contractual Basis",
            type: "textarea",
            required: false,
          },
          {
            key: "legalRelationshipContext",
            label: "Legal Relationship Context",
            type: "textarea",
            required: true,
          },

          // Arbitration Institution and Rules
          {
            key: "arbitrationRules",
            label: "Arbitration Rules",
            type: "select",
            required: true,
            options: [
              "ncia_rules",
              "ad_hoc",
              "icc_rules",
              "lcia_rules",
              "uncitral_rules",
              "custom_rules",
            ],
          },
          {
            key: "customRulesDescription",
            label: "Custom Rules Description",
            type: "textarea",
            required: false,
          },
          {
            key: "institutionalAdministration",
            label: "Institutional Administration",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "appointingAuthority",
            label: "Appointing Authority",
            type: "text",
            required: false,
          },

          // Arbitrator Selection
          {
            key: "numberOfArbitrators",
            label: "Number of Arbitrators",
            type: "select",
            required: true,
            options: ["1", "3", "parties_to_agree"],
          },
          {
            key: "arbitratorQualifications",
            label: "Arbitrator Qualifications",
            type: "textarea",
            required: true,
          },
          {
            key: "arbitratorSelectionMethod",
            label: "Arbitrator Selection Method",
            type: "textarea",
            required: true,
          },
          {
            key: "arbitratorAppointmentProcess",
            label: "Arbitrator Appointment Process",
            type: "textarea",
            required: true,
          },
          {
            key: "arbitratorNationalityRestrictions",
            label: "Arbitrator Nationality Restrictions",
            type: "text",
            required: false,
          },
          {
            key: "arbitratorLanguageRequirements",
            label: "Arbitrator Language Requirements",
            type: "text",
            required: false,
          },
          {
            key: "arbitratorExpertiseRequired",
            label: "Required Arbitrator Expertise",
            type: "textarea",
            required: false,
          },
          {
            key: "arbitratorChallengeProcess",
            label: "Arbitrator Challenge Process",
            type: "textarea",
            required: false,
          },
          {
            key: "arbitratorIndependenceRequirements",
            label: "Arbitrator Independence Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "emergencyArbitratorProvision",
            label: "Emergency Arbitrator Provision",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "emergencyArbitratorProcedures",
            label: "Emergency Arbitrator Procedures",
            type: "textarea",
            required: false,
          },

          // Procedural Provisions
          {
            key: "arbitrationSeat",
            label: "Arbitration Seat",
            type: "text",
            required: true,
          },
          {
            key: "arbitrationVenue",
            label: "Arbitration Venue",
            type: "text",
            required: false,
          },
          {
            key: "procedureLanguage",
            label: "Procedure Language",
            type: "text",
            required: true,
          },
          {
            key: "hearingLocation",
            label: "Hearing Location",
            type: "text",
            required: false,
          },
          {
            key: "documentSubmissionLanguage",
            label: "Document Submission Language",
            type: "text",
            required: false,
          },
          {
            key: "translationRequirements",
            label: "Translation Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "timelineLimitations",
            label: "Timeline Limitations",
            type: "textarea",
            required: false,
          },
          {
            key: "proceduralSchedule",
            label: "Procedural Schedule",
            type: "textarea",
            required: false,
          },
          {
            key: "evidenceRules",
            label: "Evidence Rules",
            type: "textarea",
            required: false,
          },
          {
            key: "documentDiscovery",
            label: "Document Discovery",
            type: "select",
            required: false,
            options: ["limited", "extensive", "none"],
          },
          {
            key: "witnessExamination",
            label: "Witness Examination",
            type: "select",
            required: false,
            options: ["written_only", "oral_hearings", "both"],
          },
          {
            key: "expertWitnessRights",
            label: "Expert Witness Rights",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "expertWitnessProcedures",
            label: "Expert Witness Procedures",
            type: "textarea",
            required: false,
          },

          // Interim Measures
          {
            key: "interimMeasuresRights",
            label: "Interim Measures Rights",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "interimMeasuresProcedures",
            label: "Interim Measures Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "courtInterimMeasures",
            label: "Court Interim Measures",
            type: "select",
            required: false,
            options: ["permitted", "excluded"],
          },

          // Legal Framework
          {
            key: "governingLawSubstance",
            label: "Governing Law (Substance)",
            type: "text",
            required: true,
          },
          {
            key: "governingLawProcedure",
            label: "Governing Law (Procedure)",
            type: "text",
            required: true,
          },
          {
            key: "jurisdictionExclusion",
            label: "Jurisdiction Exclusion",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "courtJurisdictionExceptions",
            label: "Court Jurisdiction Exceptions",
            type: "textarea",
            required: false,
          },

          // Costs and Fees
          {
            key: "costAllocation",
            label: "Cost Allocation",
            type: "select",
            required: true,
            options: [
              "equal_sharing",
              "loser_pays",
              "tribunal_discretion",
              "custom_allocation",
            ],
          },
          {
            key: "customCostAllocation",
            label: "Custom Cost Allocation",
            type: "textarea",
            required: false,
          },
          {
            key: "advanceOnCosts",
            label: "Advance on Costs",
            type: "textarea",
            required: false,
          },
          {
            key: "feePaymentResponsibility",
            label: "Fee Payment Responsibility",
            type: "textarea",
            required: true,
          },
          {
            key: "legalCostsAllocation",
            label: "Legal Costs Allocation",
            type: "select",
            required: false,
            options: ["each_party_own", "loser_pays", "tribunal_discretion"],
          },
          {
            key: "currency",
            label: "Currency",
            type: "select",
            required: true,
            options: ["KES", "USD", "EUR", "GBP", "other"],
          },
          {
            key: "otherCurrency",
            label: "Other Currency",
            type: "text",
            required: false,
          },

          // Confidentiality Provisions
          {
            key: "confidentialityLevel",
            label: "Confidentiality Level",
            type: "select",
            required: true,
            options: ["standard", "enhanced", "limited", "custom"],
          },
          {
            key: "confidentialityScope",
            label: "Confidentiality Scope",
            type: "textarea",
            required: true,
          },
          {
            key: "confidentialityDuration",
            label: "Confidentiality Duration",
            type: "text",
            required: false,
          },
          {
            key: "confidentialityExceptions",
            label: "Confidentiality Exceptions",
            type: "textarea",
            required: false,
          },
          {
            key: "publicationRights",
            label: "Publication Rights",
            type: "select",
            required: false,
            options: ["none", "anonymized", "with_consent"],
          },

          // Enforcement and Appeals
          {
            key: "awardFinality",
            label: "Award Finality",
            type: "select",
            required: true,
            options: ["final_binding", "limited_appeals", "custom_review"],
          },
          {
            key: "appealRights",
            label: "Appeal Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "awardEnforcementJurisdiction",
            label: "Award Enforcement Jurisdiction",
            type: "text",
            required: true,
          },
          {
            key: "setAsideGrounds",
            label: "Set Aside Grounds",
            type: "textarea",
            required: false,
          },
          {
            key: "recognitionProcedures",
            label: "Recognition Procedures",
            type: "textarea",
            required: false,
          },

          // Special Provisions
          {
            key: "consolidationRights",
            label: "Consolidation Rights",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "consolidationProcedures",
            label: "Consolidation Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "thirdPartyJoinder",
            label: "Third Party Joinder",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "thirdPartyProcedures",
            label: "Third Party Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "multiPartyProcedures",
            label: "Multi-Party Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "expeditedProcedures",
            label: "Expedited Procedures",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },
          {
            key: "expeditedCriteria",
            label: "Expedited Criteria",
            type: "textarea",
            required: false,
          },

          // General Terms
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "severabilityProvisions",
            label: "Severability Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "successorObligations",
            label: "Successor Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "noticeRequirements",
            label: "Notice Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "waiverProvisions",
            label: "Waiver Provisions",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.MEDIATION_AGREEMENT:
        return [
          // Party 1 Information
          {
            key: "party1Name",
            label: "Party 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "party1Address",
            label: "Party 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "party1Email",
            label: "Party 1 Email",
            type: "email",
            required: false,
          },
          {
            key: "party1Phone",
            label: "Party 1 Phone",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRep",
            label: "Party 1 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRepFirm",
            label: "Party 1 Law Firm",
            type: "text",
            required: false,
          },
          {
            key: "party1LegalRepAddress",
            label: "Party 1 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Party 2 Information
          {
            key: "party2Name",
            label: "Party 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "party2Address",
            label: "Party 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "party2Email",
            label: "Party 2 Email",
            type: "email",
            required: false,
          },
          {
            key: "party2Phone",
            label: "Party 2 Phone",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRep",
            label: "Party 2 Legal Representative",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRepFirm",
            label: "Party 2 Law Firm",
            type: "text",
            required: false,
          },
          {
            key: "party2LegalRepAddress",
            label: "Party 2 Legal Rep Address",
            type: "textarea",
            required: false,
          },

          // Dispute Background and Context
          {
            key: "disputeDescription",
            label: "Dispute Description",
            type: "textarea",
            required: true,
          },
          {
            key: "disputeBackground",
            label: "Dispute Background",
            type: "textarea",
            required: false,
          },
          {
            key: "disputeSubjectMatter",
            label: "Dispute Subject Matter",
            type: "textarea",
            required: false,
          },
          {
            key: "disputeValue",
            label: "Dispute Value",
            type: "text",
            required: false,
          },
          {
            key: "priorNegotiationAttempts",
            label: "Prior Negotiation Attempts",
            type: "textarea",
            required: false,
          },
          {
            key: "urgencyFactors",
            label: "Urgency Factors",
            type: "textarea",
            required: false,
          },

          // Mediation Process and Structure
          {
            key: "mediationObjectives",
            label: "Mediation Objectives",
            type: "textarea",
            required: false,
          },
          {
            key: "mediationProcedures",
            label: "Mediation Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "mediationTimeline",
            label: "Mediation Timeline",
            type: "text",
            required: false,
          },
          {
            key: "mediationVenue",
            label: "Mediation Venue",
            type: "text",
            required: false,
          },
          {
            key: "mediationLanguage",
            label: "Mediation Language",
            type: "text",
            required: false,
          },
          {
            key: "sessionScheduling",
            label: "Session Scheduling",
            type: "textarea",
            required: false,
          },
          {
            key: "documentDisclosure",
            label: "Document Disclosure",
            type: "textarea",
            required: false,
          },
          {
            key: "preparatorySteps",
            label: "Preparatory Steps",
            type: "textarea",
            required: false,
          },

          // Mediator Selection and Qualifications
          {
            key: "mediatorSelection",
            label: "Mediator Selection",
            type: "textarea",
            required: true,
          },
          {
            key: "mediatorQualifications",
            label: "Mediator Qualifications",
            type: "textarea",
            required: false,
          },
          {
            key: "mediatorAppointmentProcess",
            label: "Mediator Appointment Process",
            type: "textarea",
            required: false,
          },
          {
            key: "mediatorChallengeProcess",
            label: "Mediator Challenge Process",
            type: "textarea",
            required: false,
          },
          {
            key: "mediatorRemunerationRate",
            label: "Mediator Remuneration Rate",
            type: "text",
            required: false,
          },
          {
            key: "alternativeMediatorProvisions",
            label: "Alternative Mediator Provisions",
            type: "textarea",
            required: false,
          },

          // Cost Sharing and Financial Arrangements
          {
            key: "costSharing",
            label: "Cost Sharing",
            type: "textarea",
            required: true,
          },
          {
            key: "mediatorFeeAllocation",
            label: "Mediator Fee Allocation",
            type: "select",
            required: false,
            options: ["equal_sharing", "requesting_party", "custom_allocation"],
          },
          {
            key: "venueAndFacilityCosts",
            label: "Venue and Facility Costs",
            type: "textarea",
            required: false,
          },
          {
            key: "administrativeFees",
            label: "Administrative Fees",
            type: "textarea",
            required: false,
          },
          {
            key: "paymentSchedule",
            label: "Payment Schedule",
            type: "textarea",
            required: false,
          },
          {
            key: "currency",
            label: "Currency",
            type: "select",
            required: false,
            options: ["KES", "USD", "EUR", "GBP", "other"],
          },

          // Confidentiality and Non-Disclosure
          {
            key: "confidentialityLevel",
            label: "Confidentiality Level",
            type: "select",
            required: false,
            options: ["strict", "standard", "limited"],
          },
          {
            key: "confidentialityProvisions",
            label: "Confidentiality Provisions",
            type: "textarea",
            required: true,
          },
          {
            key: "confidentialityScope",
            label: "Confidentiality Scope",
            type: "textarea",
            required: false,
          },
          {
            key: "confidentialityExceptions",
            label: "Confidentiality Exceptions",
            type: "textarea",
            required: false,
          },
          {
            key: "documentProtection",
            label: "Document Protection",
            type: "textarea",
            required: false,
          },
          {
            key: "mediatorDisclosureRestrictions",
            label: "Mediator Disclosure Restrictions",
            type: "textarea",
            required: false,
          },

          // Legal Framework and Compliance
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "mediationRules",
            label: "Mediation Rules",
            type: "select",
            required: false,
            options: [
              "ad_hoc",
              "ciarb_rules",
              "ncia_rules",
              "uncitral_conciliation",
              "custom_rules",
            ],
          },
          {
            key: "customRulesDescription",
            label: "Custom Rules Description",
            type: "textarea",
            required: false,
          },
          {
            key: "legalRepresentationRights",
            label: "Legal Representation Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceRequirements",
            label: "Compliance Requirements",
            type: "textarea",
            required: false,
          },

          // Settlement and Outcome Provisions
          {
            key: "settlementAuthority",
            label: "Settlement Authority",
            type: "textarea",
            required: false,
          },
          {
            key: "bindingSettlementProcess",
            label: "Binding Settlement Process",
            type: "textarea",
            required: false,
          },
          {
            key: "partialSettlementProvisions",
            label: "Partial Settlement Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "implementationProcedures",
            label: "Implementation Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "postMediationObligations",
            label: "Post-Mediation Obligations",
            type: "textarea",
            required: false,
          },

          // Termination and Alternative Procedures
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationNoticeRequirements",
            label: "Termination Notice Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "unsuccessfulMediationConsequences",
            label: "Unsuccessful Mediation Consequences",
            type: "textarea",
            required: false,
          },
          {
            key: "alternativeDisputeResolution",
            label: "Alternative Dispute Resolution",
            type: "textarea",
            required: false,
          },
          {
            key: "courtProceedingsRestrictions",
            label: "Court Proceedings Restrictions",
            type: "textarea",
            required: false,
          },

          // General Provisions
          {
            key: "communicationProtocol",
            label: "Communication Protocol",
            type: "textarea",
            required: false,
          },
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "forceeMajeureProvisions",
            label: "Force Majeure Provisions",
            type: "textarea",
            required: false,
          },
          {
            key: "noticeRequirements",
            label: "Notice Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "jurisdiction",
            label: "Jurisdiction",
            type: "text",
            required: false,
          },

          // Execution Details
          {
            key: "mediationCommencementDate",
            label: "Mediation Commencement Date",
            type: "date",
            required: false,
          },
          {
            key: "signatureRequirements",
            label: "Signature Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "witnessRequirements",
            label: "Witness Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "notarizationRequirements",
            label: "Notarization Required",
            type: "select",
            required: false,
            options: ["yes", "no"],
          },

          ...basicFields,
        ];

      case DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT:
        return [
          // Data Controller Information
          {
            key: "controllerName",
            label: "Data Controller Name",
            type: "text",
            required: true,
          },
          {
            key: "controllerAddress",
            label: "Data Controller Address",
            type: "textarea",
            required: true,
          },
          {
            key: "controllerEmail",
            label: "Data Controller Email",
            type: "email",
            required: false,
          },
          {
            key: "controllerPhone",
            label: "Data Controller Phone",
            type: "text",
            required: false,
          },
          {
            key: "controllerBusinessRegistration",
            label: "Controller Business Registration",
            type: "text",
            required: false,
          },
          {
            key: "controllerContactPerson",
            label: "Controller Contact Person",
            type: "text",
            required: false,
          },
          {
            key: "controllerContactTitle",
            label: "Controller Contact Title",
            type: "text",
            required: false,
          },
          {
            key: "controllerContactEmail",
            label: "Controller Contact Email",
            type: "email",
            required: false,
          },
          {
            key: "controllerContactPhone",
            label: "Controller Contact Phone",
            type: "text",
            required: false,
          },

          // Data Processor Information (optional)
          {
            key: "processorName",
            label: "Data Processor Name",
            type: "text",
            required: false,
          },
          {
            key: "processorAddress",
            label: "Data Processor Address",
            type: "textarea",
            required: false,
          },
          {
            key: "processorEmail",
            label: "Data Processor Email",
            type: "email",
            required: false,
          },
          {
            key: "processorPhone",
            label: "Data Processor Phone",
            type: "text",
            required: false,
          },
          {
            key: "processorBusinessRegistration",
            label: "Processor Business Registration",
            type: "text",
            required: false,
          },
          {
            key: "processorContactPerson",
            label: "Processor Contact Person",
            type: "text",
            required: false,
          },
          {
            key: "processorContactTitle",
            label: "Processor Contact Title",
            type: "text",
            required: false,
          },
          {
            key: "processorContactEmail",
            label: "Processor Contact Email",
            type: "email",
            required: false,
          },
          {
            key: "processorContactPhone",
            label: "Processor Contact Phone",
            type: "text",
            required: false,
          },

          // Data Processing Context and Purpose
          {
            key: "processingPurpose",
            label: "Processing Purpose",
            type: "textarea",
            required: true,
          },
          {
            key: "processingDescription",
            label: "Processing Description",
            type: "textarea",
            required: false,
          },
          {
            key: "dataCategories",
            label: "Data Categories",
            type: "textarea",
            required: true,
          },
          {
            key: "dataSubjectCategories",
            label: "Data Subject Categories",
            type: "textarea",
            required: true,
          },
          {
            key: "personalDataTypes",
            label: "Types of Personal Data",
            type: "textarea",
            required: false,
          },
          {
            key: "specialCategoryData",
            label: "Special Category Data",
            type: "textarea",
            required: false,
          },
          {
            key: "dataSources",
            label: "Data Sources",
            type: "textarea",
            required: false,
          },
          {
            key: "processingActivities",
            label: "Processing Activities",
            type: "textarea",
            required: false,
          },

          // Legal Basis for Processing
          {
            key: "legalBasisController",
            label: "Legal Basis for Processing",
            type: "select",
            required: true,
            options: [
              "consent",
              "contract",
              "legal_obligation",
              "vital_interests",
              "public_task",
              "legitimate_interests",
            ],
          },
          {
            key: "legalBasisDescription",
            label: "Legal Basis Description",
            type: "textarea",
            required: false,
          },
          {
            key: "consentRequirements",
            label: "Consent Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "legitimateInterestsAssessment",
            label: "Legitimate Interests Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "legalObligationSource",
            label: "Legal Obligation Source",
            type: "textarea",
            required: false,
          },

          // Data Subject Rights and Procedures
          {
            key: "dataSubjectRights",
            label: "Data Subject Rights",
            type: "textarea",
            required: true,
          },
          {
            key: "accessRequestProcedure",
            label: "Access Request Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "rectificationProcedure",
            label: "Rectification Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "erasureProcedure",
            label: "Erasure Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "portabilityProcedure",
            label: "Data Portability Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "objectionProcedure",
            label: "Objection Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "restrictionProcedure",
            label: "Restriction Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "automatedDecisionMaking",
            label: "Automated Decision Making",
            type: "textarea",
            required: false,
          },
          {
            key: "responseTimeframe",
            label: "Response Timeframe",
            type: "text",
            required: false,
          },

          // Security Measures and Safeguards
          {
            key: "securityMeasures",
            label: "Security Measures",
            type: "textarea",
            required: true,
          },
          {
            key: "technicalSafeguards",
            label: "Technical Safeguards",
            type: "textarea",
            required: false,
          },
          {
            key: "organizationalMeasures",
            label: "Organizational Measures",
            type: "textarea",
            required: false,
          },
          {
            key: "accessControls",
            label: "Access Controls",
            type: "textarea",
            required: false,
          },
          {
            key: "encryptionMeasures",
            label: "Encryption Measures",
            type: "textarea",
            required: false,
          },
          {
            key: "backupProcedures",
            label: "Backup Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "incidentResponsePlan",
            label: "Incident Response Plan",
            type: "textarea",
            required: false,
          },
          {
            key: "staffTraining",
            label: "Staff Training",
            type: "textarea",
            required: false,
          },

          // Data Breach and Notification
          {
            key: "breachNotificationProcedure",
            label: "Breach Notification Procedure",
            type: "textarea",
            required: true,
          },
          {
            key: "breachNotificationTimeframe",
            label: "Breach Notification Timeframe",
            type: "text",
            required: false,
          },
          {
            key: "supervisoryAuthorityContact",
            label: "Supervisory Authority Contact",
            type: "textarea",
            required: false,
          },
          {
            key: "dataSubjectNotificationCriteria",
            label: "Data Subject Notification Criteria",
            type: "textarea",
            required: false,
          },
          {
            key: "breachAssessmentProcedure",
            label: "Breach Assessment Procedure",
            type: "textarea",
            required: false,
          },
          {
            key: "breachDocumentationRequirements",
            label: "Breach Documentation Requirements",
            type: "textarea",
            required: false,
          },

          // Data Retention and Deletion
          {
            key: "retentionPeriod",
            label: "Retention Period",
            type: "text",
            required: true,
          },
          {
            key: "retentionCriteria",
            label: "Retention Criteria",
            type: "textarea",
            required: false,
          },
          {
            key: "deletionProcedures",
            label: "Deletion Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "archivalRequirements",
            label: "Archival Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "retentionSchedule",
            label: "Retention Schedule",
            type: "textarea",
            required: false,
          },
          {
            key: "disposalMethods",
            label: "Disposal Methods",
            type: "textarea",
            required: false,
          },

          // International Transfers (if applicable)
          {
            key: "internationalTransfers",
            label: "International Transfers",
            type: "textarea",
            required: false,
          },
          {
            key: "transferSafeguards",
            label: "Transfer Safeguards",
            type: "textarea",
            required: false,
          },
          {
            key: "adequacyDecisionCountries",
            label: "Adequacy Decision Countries",
            type: "textarea",
            required: false,
          },
          {
            key: "standardContractualClauses",
            label: "Standard Contractual Clauses",
            type: "textarea",
            required: false,
          },
          {
            key: "bindingCorporateRules",
            label: "Binding Corporate Rules",
            type: "textarea",
            required: false,
          },
          {
            key: "transferRiskAssessment",
            label: "Transfer Risk Assessment",
            type: "textarea",
            required: false,
          },

          // Compliance and Monitoring
          {
            key: "complianceMonitoring",
            label: "Compliance Monitoring",
            type: "textarea",
            required: true,
          },
          {
            key: "auditProcedures",
            label: "Audit Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "recordKeepingRequirements",
            label: "Record Keeping Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "impactAssessmentRequirements",
            label: "Impact Assessment Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "consultationRequirements",
            label: "Consultation Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceOfficerDetails",
            label: "Compliance Officer Details",
            type: "textarea",
            required: false,
          },

          // Processor Obligations (if applicable)
          {
            key: "processorObligations",
            label: "Processor Obligations",
            type: "textarea",
            required: false,
          },
          {
            key: "subProcessorArrangements",
            label: "Sub-Processor Arrangements",
            type: "textarea",
            required: false,
          },
          {
            key: "processorSecurityMeasures",
            label: "Processor Security Measures",
            type: "textarea",
            required: false,
          },
          {
            key: "processorAuditRights",
            label: "Processor Audit Rights",
            type: "textarea",
            required: false,
          },
          {
            key: "processorTerminationObligations",
            label: "Processor Termination Obligations",
            type: "textarea",
            required: false,
          },

          // Governing Law and Jurisdiction
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },
          {
            key: "supervisoryAuthority",
            label: "Supervisory Authority",
            type: "text",
            required: false,
          },

          // Amendment and Termination
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationNotice",
            label: "Termination Notice",
            type: "text",
            required: false,
          },
          {
            key: "postTerminationObligations",
            label: "Post-Termination Obligations",
            type: "textarea",
            required: false,
          },

          // Signatures and Effective Date
          {
            key: "signatureRequirements",
            label: "Signature Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "witnessRequirements",
            label: "Witness Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "notarizationRequirements",
            label: "Notarization Requirements",
            type: "textarea",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE:
        return [
          // Institution Information
          {
            key: "institutionName",
            label: "Institution Name",
            type: "text",
            required: true,
          },
          {
            key: "institutionAddress",
            label: "Institution Address",
            type: "textarea",
            required: true,
          },
          {
            key: "institutionEmail",
            label: "Institution Email",
            type: "email",
            required: false,
          },
          {
            key: "institutionPhone",
            label: "Institution Phone",
            type: "text",
            required: false,
          },
          {
            key: "institutionBusinessRegistration",
            label: "Business Registration Number",
            type: "text",
            required: false,
          },
          {
            key: "institutionLicenseNumber",
            label: "License Number",
            type: "text",
            required: false,
          },
          {
            key: "institutionType",
            label: "Institution Type",
            type: "select",
            required: true,
            options: [
              "bank",
              "microfinance",
              "sacco",
              "forex_bureau",
              "money_remittance",
              "insurance",
              "securities_dealer",
              "other",
            ],
          },
          {
            key: "institutionBusinessType",
            label: "Business Type Description",
            type: "textarea",
            required: false,
          },

          // Compliance Officer Information
          {
            key: "complianceOfficerName",
            label: "Compliance Officer Name",
            type: "text",
            required: true,
          },
          {
            key: "complianceOfficerTitle",
            label: "Compliance Officer Title",
            type: "text",
            required: false,
          },
          {
            key: "complianceOfficerEmail",
            label: "Compliance Officer Email",
            type: "email",
            required: false,
          },
          {
            key: "complianceOfficerPhone",
            label: "Compliance Officer Phone",
            type: "text",
            required: false,
          },
          {
            key: "complianceOfficerQualifications",
            label: "Compliance Officer Qualifications",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceOfficerExperience",
            label: "Compliance Officer Experience",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceOfficerDesignationDate",
            label: "Designation Date",
            type: "date",
            required: false,
          },

          // AML Policy Framework
          {
            key: "amlPolicyFramework",
            label: "AML Policy Framework",
            type: "textarea",
            required: true,
          },
          {
            key: "policyObjectives",
            label: "Policy Objectives",
            type: "textarea",
            required: false,
          },
          {
            key: "policyScope",
            label: "Policy Scope",
            type: "textarea",
            required: false,
          },
          {
            key: "policyApprovalAuthority",
            label: "Policy Approval Authority",
            type: "text",
            required: false,
          },
          {
            key: "policyReviewFrequency",
            label: "Policy Review Frequency",
            type: "text",
            required: false,
          },
          {
            key: "policyLastReviewDate",
            label: "Last Review Date",
            type: "date",
            required: false,
          },
          {
            key: "policyNextReviewDate",
            label: "Next Review Date",
            type: "date",
            required: false,
          },

          // Customer Due Diligence (CDD)
          {
            key: "customerDueDiligenceProcedures",
            label: "Customer Due Diligence Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "customerIdentificationRequirements",
            label: "Customer Identification Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "enhancedDueDiligenceThresholds",
            label: "Enhanced Due Diligence Thresholds",
            type: "textarea",
            required: false,
          },
          {
            key: "simplifiedDueDiligenceCriteria",
            label: "Simplified Due Diligence Criteria",
            type: "textarea",
            required: false,
          },
          {
            key: "ongoingMonitoringProcedures",
            label: "Ongoing Monitoring Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "customerRiskAssessmentCriteria",
            label: "Customer Risk Assessment Criteria",
            type: "textarea",
            required: false,
          },

          // Know Your Customer (KYC) Requirements
          {
            key: "kycRequirements",
            label: "KYC Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "kycDocumentationRequirements",
            label: "KYC Documentation Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "customerVerificationProcedures",
            label: "Customer Verification Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "businessRelationshipPurpose",
            label: "Business Relationship Purpose",
            type: "textarea",
            required: false,
          },
          {
            key: "sourceOfFundsVerification",
            label: "Source of Funds Verification",
            type: "textarea",
            required: false,
          },
          {
            key: "beneficialOwnershipIdentification",
            label: "Beneficial Ownership Identification",
            type: "textarea",
            required: false,
          },

          // Transaction Monitoring
          {
            key: "transactionMonitoring",
            label: "Transaction Monitoring Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "transactionMonitoringSystem",
            label: "Transaction Monitoring System",
            type: "textarea",
            required: false,
          },
          {
            key: "suspiciousTransactionThresholds",
            label: "Suspicious Transaction Thresholds",
            type: "textarea",
            required: false,
          },
          {
            key: "transactionReportingTriggers",
            label: "Transaction Reporting Triggers",
            type: "textarea",
            required: false,
          },
          {
            key: "monitoringFrequency",
            label: "Monitoring Frequency",
            type: "text",
            required: false,
          },
          {
            key: "automaticMonitoringTools",
            label: "Automatic Monitoring Tools",
            type: "textarea",
            required: false,
          },
          {
            key: "manualReviewProcedures",
            label: "Manual Review Procedures",
            type: "textarea",
            required: false,
          },

          // Suspicious Activity Reporting (SAR)
          {
            key: "suspiciousActivityReporting",
            label: "Suspicious Activity Reporting Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "sarReportingThresholds",
            label: "SAR Reporting Thresholds",
            type: "textarea",
            required: false,
          },
          {
            key: "sarReportingTimeframes",
            label: "SAR Reporting Timeframes",
            type: "textarea",
            required: false,
          },
          {
            key: "sarReportingAuthority",
            label: "SAR Reporting Authority",
            type: "text",
            required: false,
          },
          {
            key: "sarInternalReportingProcedures",
            label: "SAR Internal Reporting Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "sarInvestigationProcedures",
            label: "SAR Investigation Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "sarRecordKeeping",
            label: "SAR Record Keeping",
            type: "textarea",
            required: false,
          },

          // Record Keeping Requirements
          {
            key: "recordKeepingRequirements",
            label: "Record Keeping Requirements",
            type: "textarea",
            required: true,
          },
          {
            key: "recordRetentionPeriods",
            label: "Record Retention Periods",
            type: "textarea",
            required: false,
          },
          {
            key: "recordStorageProcedures",
            label: "Record Storage Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "recordAccessProcedures",
            label: "Record Access Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "recordBackupProcedures",
            label: "Record Backup Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "recordDestructionProcedures",
            label: "Record Destruction Procedures",
            type: "textarea",
            required: false,
          },

          // Training Programs
          {
            key: "trainingPrograms",
            label: "Training Programs",
            type: "textarea",
            required: true,
          },
          {
            key: "trainingFrequency",
            label: "Training Frequency",
            type: "text",
            required: false,
          },
          {
            key: "trainingContent",
            label: "Training Content",
            type: "textarea",
            required: false,
          },
          {
            key: "trainingTargetAudience",
            label: "Training Target Audience",
            type: "textarea",
            required: false,
          },
          {
            key: "trainingEffectivenessAssessment",
            label: "Training Effectiveness Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "trainingRecordKeeping",
            label: "Training Record Keeping",
            type: "textarea",
            required: false,
          },

          // Risk Assessment
          {
            key: "riskAssessmentProcedures",
            label: "Risk Assessment Procedures",
            type: "textarea",
            required: true,
          },
          {
            key: "institutionalRiskAssessment",
            label: "Institutional Risk Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "customerRiskRating",
            label: "Customer Risk Rating System",
            type: "textarea",
            required: false,
          },
          {
            key: "productRiskAssessment",
            label: "Product Risk Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "geographicRiskAssessment",
            label: "Geographic Risk Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "riskAssessmentFrequency",
            label: "Risk Assessment Frequency",
            type: "text",
            required: false,
          },
          {
            key: "riskMitigationMeasures",
            label: "Risk Mitigation Measures",
            type: "textarea",
            required: false,
          },

          // Reporting Obligations
          {
            key: "reportingObligations",
            label: "Reporting Obligations",
            type: "textarea",
            required: true,
          },
          {
            key: "regulatoryReportingRequirements",
            label: "Regulatory Reporting Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "frcReportingRequirements",
            label: "FRC Reporting Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "cbkReportingRequirements",
            label: "CBK Reporting Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "reportingDeadlines",
            label: "Reporting Deadlines",
            type: "textarea",
            required: false,
          },
          {
            key: "reportingFormats",
            label: "Reporting Formats",
            type: "textarea",
            required: false,
          },

          // Internal Controls and Audit
          {
            key: "internalControls",
            label: "Internal Controls",
            type: "textarea",
            required: false,
          },
          {
            key: "internalAuditProcedures",
            label: "Internal Audit Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "independentTestingRequirements",
            label: "Independent Testing Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "controlDeficiencyReporting",
            label: "Control Deficiency Reporting",
            type: "textarea",
            required: false,
          },
          {
            key: "correctiveActionProcedures",
            label: "Corrective Action Procedures",
            type: "textarea",
            required: false,
          },

          // Technology and Systems
          {
            key: "technologySystems",
            label: "Technology Systems",
            type: "textarea",
            required: false,
          },
          {
            key: "amlSoftwareSystems",
            label: "AML Software Systems",
            type: "textarea",
            required: false,
          },
          {
            key: "dataIntegrityControls",
            label: "Data Integrity Controls",
            type: "textarea",
            required: false,
          },
          {
            key: "systemAccessControls",
            label: "System Access Controls",
            type: "textarea",
            required: false,
          },
          {
            key: "systemBackupProcedures",
            label: "System Backup Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "cybersecurityMeasures",
            label: "Cybersecurity Measures",
            type: "textarea",
            required: false,
          },

          // Governing Law and Jurisdiction
          {
            key: "governingLaw",
            label: "Governing Law",
            type: "text",
            required: false,
          },
          {
            key: "regulatoryAuthority",
            label: "Regulatory Authority",
            type: "text",
            required: false,
          },
          {
            key: "disputeResolution",
            label: "Dispute Resolution",
            type: "textarea",
            required: false,
          },
          {
            key: "jurisdictionClauses",
            label: "Jurisdiction Clauses",
            type: "textarea",
            required: false,
          },

          // Implementation and Monitoring
          {
            key: "implementationTimeline",
            label: "Implementation Timeline",
            type: "textarea",
            required: false,
          },
          {
            key: "monitoringProcedures",
            label: "Monitoring Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "complianceReviewSchedule",
            label: "Compliance Review Schedule",
            type: "text",
            required: false,
          },
          {
            key: "effectivenessAssessment",
            label: "Effectiveness Assessment",
            type: "textarea",
            required: false,
          },
          {
            key: "continuousImprovement",
            label: "Continuous Improvement",
            type: "textarea",
            required: false,
          },

          // Amendment and Termination
          {
            key: "amendmentProcedures",
            label: "Amendment Procedures",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            required: false,
          },
          {
            key: "terminationNotice",
            label: "Termination Notice",
            type: "text",
            required: false,
          },
          {
            key: "postTerminationObligations",
            label: "Post-Termination Obligations",
            type: "textarea",
            required: false,
          },

          // Signatures and Effective Date
          {
            key: "signatureRequirements",
            label: "Signature Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "witnessRequirements",
            label: "Witness Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "notarizationRequirements",
            label: "Notarization Requirements",
            type: "textarea",
            required: false,
          },
          {
            key: "boardApprovalDate",
            label: "Board Approval Date",
            type: "date",
            required: false,
          },
          {
            key: "managementApprovalDate",
            label: "Management Approval Date",
            type: "date",
            required: false,
          },

          ...basicFields,
        ];

      case DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT:
        return [
          // Company/Organization Information
          { key: 'companyName', label: 'Company/Organization Name', type: 'text', required: true },
          { key: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
          { key: 'companyEmail', label: 'Company Email', type: 'email', required: false },
          { key: 'companyPhone', label: 'Company Phone', type: 'text', required: false },
          { key: 'companyBusinessRegistration', label: 'Business Registration Number', type: 'text', required: false },
          { key: 'companyLicenseNumber', label: 'License Number', type: 'text', required: false },
          { key: 'companyType', label: 'Company Type', type: 'select', required: true, options: [
            'manufacturing', 'mining', 'agriculture', 'construction', 'energy', 'transport', 'waste_management', 'hospitality', 'other'
          ]},
          { key: 'industryCategory', label: 'Industry Category', type: 'text', required: false },
          { key: 'operationalScope', label: 'Operational Scope', type: 'textarea', required: false },
          
          // Environmental Officer Information
          { key: 'environmentalOfficerName', label: 'Environmental Officer Name', type: 'text', required: true },
          { key: 'environmentalOfficerTitle', label: 'Environmental Officer Title', type: 'text', required: false },
          { key: 'environmentalOfficerEmail', label: 'Environmental Officer Email', type: 'email', required: false },
          { key: 'environmentalOfficerPhone', label: 'Environmental Officer Phone', type: 'text', required: false },
          { key: 'environmentalOfficerQualifications', label: 'Environmental Officer Qualifications', type: 'textarea', required: false },
          { key: 'environmentalOfficerExperience', label: 'Environmental Officer Experience', type: 'textarea', required: false },
          { key: 'environmentalOfficerDesignationDate', label: 'Designation Date', type: 'date', required: false },
          { key: 'environmentalOfficerCertification', label: 'Environmental Officer Certification', type: 'textarea', required: false },
          
          // Legal Framework and Compliance
          { key: 'environmentalLegalFramework', label: 'Environmental Legal Framework', type: 'textarea', required: true },
          { key: 'emcaComplianceRequirements', label: 'EMCA 2015 Compliance Requirements', type: 'textarea', required: false },
          { key: 'nemaLicensingRequirements', label: 'NEMA Licensing Requirements', type: 'textarea', required: false },
          { key: 'eiaRequirements', label: 'EIA Requirements', type: 'textarea', required: false },
          { key: 'environmentalAuditRequirements', label: 'Environmental Audit Requirements', type: 'textarea', required: false },
          { key: 'countyEnvironmentalRequirements', label: 'County Environmental Requirements', type: 'textarea', required: false },
          { key: 'internationalStandardsCompliance', label: 'International Standards Compliance', type: 'textarea', required: false },
          { key: 'sectorSpecificRegulations', label: 'Sector-Specific Regulations', type: 'textarea', required: false },
          
          // Environmental Management System (EMS)
          { key: 'environmentalManagementSystem', label: 'Environmental Management System', type: 'textarea', required: true },
          { key: 'environmentalPolicyStatement', label: 'Environmental Policy Statement', type: 'textarea', required: false },
          { key: 'environmentalObjectivesTargets', label: 'Environmental Objectives & Targets', type: 'textarea', required: false },
          { key: 'environmentalManagementPrograms', label: 'Environmental Management Programs', type: 'textarea', required: false },
          { key: 'environmentalProceduresDocumentation', label: 'Environmental Procedures Documentation', type: 'textarea', required: false },
          { key: 'environmentalResponsibilities', label: 'Environmental Responsibilities', type: 'textarea', required: false },
          { key: 'environmentalTrainingRequirements', label: 'Environmental Training Requirements', type: 'textarea', required: false },
          
          // Environmental Impact Assessment
          { key: 'environmentalImpactAssessment', label: 'Environmental Impact Assessment', type: 'textarea', required: false },
          { key: 'eiaStudyRequirements', label: 'EIA Study Requirements', type: 'textarea', required: false },
          { key: 'environmentalImpactMitigation', label: 'Environmental Impact Mitigation', type: 'textarea', required: false },
          { key: 'cumulativeImpactAssessment', label: 'Cumulative Impact Assessment', type: 'textarea', required: false },
          { key: 'strategicEnvironmentalAssessment', label: 'Strategic Environmental Assessment', type: 'textarea', required: false },
          { key: 'environmentalRiskAssessment', label: 'Environmental Risk Assessment', type: 'textarea', required: false },
          
          // Pollution Prevention and Control
          { key: 'pollutionPreventionControl', label: 'Pollution Prevention & Control', type: 'textarea', required: true },
          { key: 'airQualityManagement', label: 'Air Quality Management', type: 'textarea', required: false },
          { key: 'waterPollutionControl', label: 'Water Pollution Control', type: 'textarea', required: false },
          { key: 'soilContaminationPrevention', label: 'Soil Contamination Prevention', type: 'textarea', required: false },
          { key: 'noisePollutonControl', label: 'Noise Pollution Control', type: 'textarea', required: false },
          { key: 'lightPollutionManagement', label: 'Light Pollution Management', type: 'textarea', required: false },
          { key: 'odorControlMeasures', label: 'Odor Control Measures', type: 'textarea', required: false },
          { key: 'emissionControlSystems', label: 'Emission Control Systems', type: 'textarea', required: false },
          
          // Waste Management
          { key: 'wasteManagementProcedures', label: 'Waste Management Procedures', type: 'textarea', required: true },
          { key: 'wasteMinimizationStrategies', label: 'Waste Minimization Strategies', type: 'textarea', required: false },
          { key: 'wasteSegregationProcedures', label: 'Waste Segregation Procedures', type: 'textarea', required: false },
          { key: 'hazardousWasteManagement', label: 'Hazardous Waste Management', type: 'textarea', required: false },
          { key: 'wasteStorageRequirements', label: 'Waste Storage Requirements', type: 'textarea', required: false },
          { key: 'wasteTransportationProcedures', label: 'Waste Transportation Procedures', type: 'textarea', required: false },
          { key: 'wasteDisposalMethods', label: 'Waste Disposal Methods', type: 'textarea', required: false },
          { key: 'wasteRecyclingPrograms', label: 'Waste Recycling Programs', type: 'textarea', required: false },
          { key: 'wasteAuditProcedures', label: 'Waste Audit Procedures', type: 'textarea', required: false },
          
          // Water Resource Management
          { key: 'waterResourceManagement', label: 'Water Resource Management', type: 'textarea', required: false },
          { key: 'waterConservationMeasures', label: 'Water Conservation Measures', type: 'textarea', required: false },
          { key: 'waterQualityMonitoring', label: 'Water Quality Monitoring', type: 'textarea', required: false },
          { key: 'waterUseEfficiency', label: 'Water Use Efficiency', type: 'textarea', required: false },
          { key: 'waterRecyclingReuse', label: 'Water Recycling & Reuse', type: 'textarea', required: false },
          { key: 'groundwaterProtection', label: 'Groundwater Protection', type: 'textarea', required: false },
          { key: 'surfaceWaterProtection', label: 'Surface Water Protection', type: 'textarea', required: false },
          { key: 'waterPermitCompliance', label: 'Water Permit Compliance', type: 'textarea', required: false },
          
          // Energy Management
          { key: 'energyManagement', label: 'Energy Management', type: 'textarea', required: false },
          { key: 'energyConservationMeasures', label: 'Energy Conservation Measures', type: 'textarea', required: false },
          { key: 'energyEfficiencyPrograms', label: 'Energy Efficiency Programs', type: 'textarea', required: false },
          { key: 'renewableEnergyInitiatives', label: 'Renewable Energy Initiatives', type: 'textarea', required: false },
          { key: 'energyAuditRequirements', label: 'Energy Audit Requirements', type: 'textarea', required: false },
          { key: 'carbonFootprintReduction', label: 'Carbon Footprint Reduction', type: 'textarea', required: false },
          { key: 'climateChangeAdaptation', label: 'Climate Change Adaptation', type: 'textarea', required: false },
          
          // Biodiversity and Ecosystem Conservation
          { key: 'biodiversityConservation', label: 'Biodiversity Conservation', type: 'textarea', required: false },
          { key: 'ecosystemProtectionMeasures', label: 'Ecosystem Protection Measures', type: 'textarea', required: false },
          { key: 'wildlifeProtection', label: 'Wildlife Protection', type: 'textarea', required: false },
          { key: 'forestConservation', label: 'Forest Conservation', type: 'textarea', required: false },
          { key: 'marineProtection', label: 'Marine Protection', type: 'textarea', required: false },
          { key: 'habitatRestoration', label: 'Habitat Restoration', type: 'textarea', required: false },
          { key: 'invasiveSpeciesManagement', label: 'Invasive Species Management', type: 'textarea', required: false },
          
          // Chemical and Hazardous Substances Management
          { key: 'chemicalManagement', label: 'Chemical Management', type: 'textarea', required: false },
          { key: 'hazardousSubstancesHandling', label: 'Hazardous Substances Handling', type: 'textarea', required: false },
          { key: 'chemicalStorageRequirements', label: 'Chemical Storage Requirements', type: 'textarea', required: false },
          { key: 'chemicalTransportSafety', label: 'Chemical Transport Safety', type: 'textarea', required: false },
          { key: 'chemicalInventoryManagement', label: 'Chemical Inventory Management', type: 'textarea', required: false },
          { key: 'materialSafetyDataSheets', label: 'Material Safety Data Sheets', type: 'textarea', required: false },
          { key: 'chemicalEmergencyResponse', label: 'Chemical Emergency Response', type: 'textarea', required: false },
          
          // Environmental Monitoring and Reporting
          { key: 'environmentalMonitoring', label: 'Environmental Monitoring', type: 'textarea', required: true },
          { key: 'monitoringParameters', label: 'Monitoring Parameters', type: 'textarea', required: false },
          { key: 'monitoringFrequency', label: 'Monitoring Frequency', type: 'text', required: false },
          { key: 'monitoringMethods', label: 'Monitoring Methods', type: 'textarea', required: false },
          { key: 'monitoringEquipmentRequirements', label: 'Monitoring Equipment Requirements', type: 'textarea', required: false },
          { key: 'dataCollectionProcedures', label: 'Data Collection Procedures', type: 'textarea', required: false },
          { key: 'laboratoryAnalysisRequirements', label: 'Laboratory Analysis Requirements', type: 'textarea', required: false },
          { key: 'monitoringReportingTimelines', label: 'Monitoring Reporting Timelines', type: 'textarea', required: false },
          
          // Community Engagement and Relations
          { key: 'communityEngagement', label: 'Community Engagement', type: 'textarea', required: true },
          { key: 'stakeholderConsultationProcedures', label: 'Stakeholder Consultation Procedures', type: 'textarea', required: false },
          { key: 'publicParticipationRequirements', label: 'Public Participation Requirements', type: 'textarea', required: false },
          { key: 'communityGrievanceMechanisms', label: 'Community Grievance Mechanisms', type: 'textarea', required: false },
          { key: 'corporateSocialResponsibility', label: 'Corporate Social Responsibility', type: 'textarea', required: false },
          { key: 'communityDevelopmentPrograms', label: 'Community Development Programs', type: 'textarea', required: false },
          { key: 'culturalHeritageProtection', label: 'Cultural Heritage Protection', type: 'textarea', required: false },
          { key: 'landRightsConsiderations', label: 'Land Rights Considerations', type: 'textarea', required: false },
          
          // Environmental Training and Awareness
          { key: 'environmentalTraining', label: 'Environmental Training', type: 'textarea', required: true },
          { key: 'staffTrainingPrograms', label: 'Staff Training Programs', type: 'textarea', required: false },
          { key: 'environmentalAwarenessPrograms', label: 'Environmental Awareness Programs', type: 'textarea', required: false },
          { key: 'capacityBuildingInitiatives', label: 'Capacity Building Initiatives', type: 'textarea', required: false },
          { key: 'trainingRecordKeeping', label: 'Training Record Keeping', type: 'textarea', required: false },
          { key: 'environmentalEducationPrograms', label: 'Environmental Education Programs', type: 'textarea', required: false },
          { key: 'communityAwarenessPrograms', label: 'Community Awareness Programs', type: 'textarea', required: false },
          
          // Emergency Response and Incident Management
          { key: 'emergencyResponsePlan', label: 'Emergency Response Plan', type: 'textarea', required: false },
          { key: 'environmentalIncidentManagement', label: 'Environmental Incident Management', type: 'textarea', required: false },
          { key: 'spillResponseProcedures', label: 'Spill Response Procedures', type: 'textarea', required: false },
          { key: 'fireEmergencyProcedures', label: 'Fire Emergency Procedures', type: 'textarea', required: false },
          { key: 'evacuationProcedures', label: 'Evacuation Procedures', type: 'textarea', required: false },
          { key: 'emergencyContactProcedures', label: 'Emergency Contact Procedures', type: 'textarea', required: false },
          { key: 'incidentReportingProcedures', label: 'Incident Reporting Procedures', type: 'textarea', required: false },
          { key: 'postIncidentInvestigation', label: 'Post-Incident Investigation', type: 'textarea', required: false },
          
          // Environmental Audit and Review
          { key: 'environmentalAuditProcedures', label: 'Environmental Audit Procedures', type: 'textarea', required: false },
          { key: 'internalAuditSchedule', label: 'Internal Audit Schedule', type: 'text', required: false },
          { key: 'externalAuditRequirements', label: 'External Audit Requirements', type: 'textarea', required: false },
          { key: 'auditFindingsManagement', label: 'Audit Findings Management', type: 'textarea', required: false },
          { key: 'correctiveActionProcedures', label: 'Corrective Action Procedures', type: 'textarea', required: false },
          { key: 'managementReviewProcedures', label: 'Management Review Procedures', type: 'textarea', required: false },
          { key: 'continuousImprovementPrograms', label: 'Continuous Improvement Programs', type: 'textarea', required: false },
          
          // Compliance Monitoring and Enforcement
          { key: 'complianceMonitoring', label: 'Compliance Monitoring', type: 'textarea', required: true },
          { key: 'regulatoryInspectionProcedures', label: 'Regulatory Inspection Procedures', type: 'textarea', required: false },
          { key: 'complianceReportingRequirements', label: 'Compliance Reporting Requirements', type: 'textarea', required: false },
          { key: 'nonComplianceManagement', label: 'Non-Compliance Management', type: 'textarea', required: false },
          { key: 'enforcementActionResponse', label: 'Enforcement Action Response', type: 'textarea', required: false },
          { key: 'legalComplianceVerification', label: 'Legal Compliance Verification', type: 'textarea', required: false },
          
          // Environmental Performance Indicators
          { key: 'environmentalPerformanceIndicators', label: 'Environmental Performance Indicators', type: 'textarea', required: false },
          { key: 'kpiMonitoringProcedures', label: 'KPI Monitoring Procedures', type: 'textarea', required: false },
          { key: 'performanceBenchmarking', label: 'Performance Benchmarking', type: 'textarea', required: false },
          { key: 'improvementTargetSetting', label: 'Improvement Target Setting', type: 'textarea', required: false },
          { key: 'performanceReporting', label: 'Performance Reporting', type: 'textarea', required: false },
          
          // Documentation and Record Keeping
          { key: 'documentationRequirements', label: 'Documentation Requirements', type: 'textarea', required: true },
          { key: 'recordKeepingProcedures', label: 'Record Keeping Procedures', type: 'textarea', required: false },
          { key: 'documentControlSystems', label: 'Document Control Systems', type: 'textarea', required: false },
          { key: 'dataManagementProcedures', label: 'Data Management Procedures', type: 'textarea', required: false },
          { key: 'reportingFormats', label: 'Reporting Formats', type: 'textarea', required: false },
          { key: 'archivalRequirements', label: 'Archival Requirements', type: 'textarea', required: false },
          
          // Governing Law and Jurisdiction
          { key: 'governingLaw', label: 'Governing Law', type: 'text', required: false },
          { key: 'regulatoryAuthorities', label: 'Regulatory Authorities', type: 'textarea', required: false },
          { key: 'disputeResolutionMechanisms', label: 'Dispute Resolution Mechanisms', type: 'textarea', required: false },
          { key: 'jurisdictionClauses', label: 'Jurisdiction Clauses', type: 'textarea', required: false },
          { key: 'internationalAgreementsCompliance', label: 'International Agreements Compliance', type: 'textarea', required: false },
          
          // Implementation and Review
          { key: 'implementationTimeline', label: 'Implementation Timeline', type: 'textarea', required: false },
          { key: 'implementationPhasePlanning', label: 'Implementation Phase Planning', type: 'textarea', required: false },
          { key: 'reviewSchedule', label: 'Review Schedule', type: 'text', required: false },
          { key: 'updateProcedures', label: 'Update Procedures', type: 'textarea', required: false },
          { key: 'stakeholderFeedbackIncorporation', label: 'Stakeholder Feedback Incorporation', type: 'textarea', required: false },
          { key: 'adaptiveManagementApproach', label: 'Adaptive Management Approach', type: 'textarea', required: false },
          
          // Amendment and Termination
          { key: 'amendmentProcedures', label: 'Amendment Procedures', type: 'textarea', required: false },
          { key: 'terminationConditions', label: 'Termination Conditions', type: 'textarea', required: false },
          { key: 'terminationNoticeRequirements', label: 'Termination Notice Requirements', type: 'text', required: false },
          { key: 'postTerminationObligations', label: 'Post-Termination Obligations', type: 'textarea', required: false },
          { key: 'handoverProcedures', label: 'Handover Procedures', type: 'textarea', required: false },
          
          // Signatures and Approvals
          { key: 'signatureRequirements', label: 'Signature Requirements', type: 'textarea', required: false },
          { key: 'witnessRequirements', label: 'Witness Requirements', type: 'textarea', required: false },
          { key: 'notarizationRequirements', label: 'Notarization Requirements', type: 'textarea', required: false },
          { key: 'boardApprovalDate', label: 'Board Approval Date', type: 'date', required: false },
          { key: 'managementApprovalDate', label: 'Management Approval Date', type: 'date', required: false },
          { key: 'nemaApprovalRequirements', label: 'NEMA Approval Requirements', type: 'textarea', required: false },
          { key: 'countyGovernmentApproval', label: 'County Government Approval', type: 'textarea', required: false },
          
          ...basicFields,
        ];

      default:
        return [
          {
            key: "party1Name",
            label: "Party 1 Name",
            type: "text",
            required: true,
          },
          {
            key: "party1Address",
            label: "Party 1 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "party2Name",
            label: "Party 2 Name",
            type: "text",
            required: true,
          },
          {
            key: "party2Address",
            label: "Party 2 Address",
            type: "textarea",
            required: true,
          },
          {
            key: "documentPurpose",
            label: "Document Purpose",
            type: "textarea",
            required: true,
          },
          ...basicFields,
        ];
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormatChange = (format: DocumentFormat, checked: boolean) => {
    if (checked) {
      setSelectedFormats((prev) => [...prev, format]);
    } else {
      setSelectedFormats((prev) => prev.filter((f) => f !== format));
    }
  };

  const handlePasteData = (pastedData: Record<string, any>) => {
    setPasteError(null);
    setPasteSuccess(null);
    setMappingResult(null);

    const requiredFields = getRequiredFields();
    const validFieldKeys = requiredFields.map((field) => field.key);

    // Use smart field mapping
    const result = mapFieldNames(pastedData, validFieldKeys);
    setMappingResult(result);

    // Update form data with mapped fields
    const newFormData = { ...formData, ...result.mappedData };
    setFormData(newFormData);

    // Provide detailed user feedback
    if (result.matchedFields === 0) {
      const topSuggestions = result.suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map((s) => `"${s.provided}" → "${s.suggested}"`)
        .join(", ");

      setPasteError(
        `No fields could be matched automatically. ${
          topSuggestions
            ? `Try renaming these fields: ${topSuggestions}`
            : "Please check the field reference below for correct field names."
        }`
      );
    } else {
      // Success message with details
      let message = `Successfully filled ${result.matchedFields} field${
        result.matchedFields > 1 ? "s" : ""
      }!`;

      if (result.totalFields > result.matchedFields) {
        message += ` ${result.totalFields - result.matchedFields} field${
          result.totalFields - result.matchedFields > 1 ? "s were" : " was"
        } skipped.`;
      }

      // Add smart mapping info if any fields were auto-converted
      const autoConverted = result.suggestions.filter(
        (s) => s.confidence >= 0.7
      ).length;
      if (autoConverted > 0) {
        message += ` ${autoConverted} field${
          autoConverted > 1 ? "s were" : " was"
        } automatically converted from human-readable format.`;
      }

      setPasteSuccess(message);
    }

    // Clear messages after 6 seconds
    setTimeout(() => {
      setPasteSuccess(null);
      setPasteError(null);
    }, 6000);
  };

  const handlePasteError = (errorMessage: string) => {
    setPasteError(errorMessage);
    setPasteSuccess(null);

    // Clear error message after 5 seconds
    setTimeout(() => {
      setPasteError(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requiredFields = getRequiredFields();
      const missingFields = requiredFields
        .filter((field) => {
          const value = formData[field.key];
          if (field.required) {
            // Handle radio button fields specifically
            if (field.type === "radio") {
              // For radio buttons, check if a valid option is selected
              const options = (field as any).options || [];
              return !value || !options.includes(value);
            }
            // Handle string values
            if (typeof value === "string") {
              return !value.trim();
            }
            // Handle arrays (like partners)
            if (Array.isArray(value)) {
              return value.length === 0;
            }
            // Handle other types or undefined/null
            return !value;
          }
          return false;
        })
        .map((field) => field.label);

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      if (selectedFormats.length === 0) {
        throw new Error("Please select at least one document format");
      }

      // Handle Partnership Agreement partners array conversion
      let processedUserInput = { ...formData };
      if (
        documentType === DocumentType.PARTNERSHIP_AGREEMENT &&
        formData.partnersInfo
      ) {
        try {
          processedUserInput.partners = JSON.parse(formData.partnersInfo);
          delete processedUserInput.partnersInfo;
        } catch (error) {
          throw new Error(
            "Invalid partners information format. Please provide valid JSON."
          );
        }
      }

      const requestData = {
        documentType,
        userInput: processedUserInput,
        backstory: `Generate a ${getDocumentTitle()} based on the provided information.`,
        formats: selectedFormats,
        // SECURITY: Email address is now handled by backend using authenticated user's email only
      };

      // Debug logging to see what's being sent
      console.log("📋 FORM DEBUG: Request data being sent to backend:", {
        documentType,
        userInputKeys: Object.keys(processedUserInput),
        userInputValues: processedUserInput,
        formats: selectedFormats,
        allRequiredFields: getRequiredFields()
          .filter((f) => f.required)
          .map((f) => f.key),
      });

      const response = await fetch(
        "http://localhost:5000/api/documents/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate document");
      }

      const result = await response.json();

      // Check if the result indicates a validation failure
      if (
        result.status === "FAILED" ||
        (result.message && result.message.includes("Validation failed:"))
      ) {
        throw new Error(result.message || "Document validation failed");
      }

      setSuccess(
        `Document generated successfully! Request ID: ${result.requestId}. ${
          result.message || "Document will be sent to your email."
        }`
      );
    } catch (err) {
      console.error("Error generating document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate document"
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = getRequiredFields();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#F5F5F5] p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#7C9885]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-[#2D3748]">
              {getDocumentTitle()}
            </h1>
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
                <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                  Quick Fill from Clipboard
                </h3>
                <p className="text-sm text-[#718096]">
                  Have your form data ready in JSON format? Click the button
                  below to automatically fill all matching fields.
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
                  <p className="text-red-800 text-sm font-medium">
                    {pasteError}
                  </p>

                  {/* Show suggestions if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 rounded border">
                      <p className="text-red-700 text-xs font-medium mb-2">
                        Suggested field name corrections:
                      </p>
                      <div className="space-y-1">
                        {mappingResult.suggestions
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-600 font-mono"
                            >
                              <span className="bg-red-200 px-1 rounded">
                                "{suggestion.provided}"
                              </span>
                              {" → "}
                              <span className="bg-green-200 px-1 rounded text-green-800">
                                "{suggestion.suggested}"
                              </span>
                              <span className="text-red-500 ml-2">
                                ({Math.round(suggestion.confidence * 100)}%
                                match)
                              </span>
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
                  <p className="text-green-800 text-sm font-medium">
                    {pasteSuccess}
                  </p>

                  {/* Show mapping details if available */}
                  {mappingResult && mappingResult.suggestions.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded border">
                      <p className="text-green-700 text-xs font-medium mb-2">
                        Auto-converted field names:
                      </p>
                      <div className="space-y-1">
                        {mappingResult.suggestions
                          .filter((s) => s.confidence >= 0.7)
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="text-xs text-green-600 font-mono"
                            >
                              <span className="bg-blue-200 px-1 rounded">
                                "{suggestion.provided}"
                              </span>
                              {" → "}
                              <span className="bg-green-200 px-1 rounded">
                                "{suggestion.suggested}"
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Show skipped fields if any */}
                  {mappingResult &&
                    mappingResult.unmatchedFields.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-100 rounded border">
                        <p className="text-yellow-700 text-xs font-medium mb-2">
                          Skipped fields (not found):
                        </p>
                        <div className="text-xs text-yellow-600 font-mono">
                          {mappingResult.unmatchedFields
                            .slice(0, 10)
                            .map((field, index) => (
                              <span
                                key={index}
                                className="bg-yellow-200 px-1 rounded mr-1 mb-1 inline-block"
                              >
                                "{field}"
                              </span>
                            ))}
                          {mappingResult.unmatchedFields.length > 10 && (
                            <span className="text-yellow-500">
                              ...and {mappingResult.unmatchedFields.length - 10}{" "}
                              more
                            </span>
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
              <div
                key={field.key}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <Label
                  htmlFor={field.key}
                  className="text-sm font-medium text-[#2D3748]"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                    rows={3}
                    placeholder={(field as any).placeholder || ""}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={formData[field.key] || ""}
                    onValueChange={(value) =>
                      handleInputChange(field.key, value)
                    }
                  >
                    <SelectTrigger className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field as any).options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option
                            .replace("_", " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "radio" ? (
                  <div className="mt-1 space-y-2">
                    {(field as any).options?.map((option: string) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${field.key}-${option}`}
                          name={field.key}
                          value={option}
                          checked={formData[field.key] === option}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          className="focus:ring-[#7C9885] text-[#7C9885]"
                        />
                        <Label
                          htmlFor={`${field.key}-${option}`}
                          className="text-sm"
                        >
                          {option === "true"
                            ? "Yes"
                            : option === "false"
                            ? "No"
                            : option}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="mt-1 focus:ring-[#7C9885] focus:border-[#7C9885]"
                    placeholder={(field as any).placeholder || ""}
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
                  onCheckedChange={(checked) =>
                    handleFormatChange(DocumentFormat.PDF, !!checked)
                  }
                />
                <Label htmlFor="pdf-format" className="text-sm">
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="docx-format"
                  checked={selectedFormats.includes(DocumentFormat.DOCX)}
                  onCheckedChange={(checked) =>
                    handleFormatChange(DocumentFormat.DOCX, !!checked)
                  }
                />
                <Label htmlFor="docx-format" className="text-sm">
                  Word Document
                </Label>
              </div>
            </div>
          </div>

          {/* Email Delivery Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Document Delivery
                </p>
                <p className="text-sm text-blue-700">
                  Your generated document will be sent to your registered email
                  address for security.
                </p>
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
  );
}
