import { DocumentType, DocumentUserInput } from '../types/document';
import { 
  SalesPurchaseUserInput,
  DistributionAgreementUserInput,
  PartnershipAgreementUserInput,
  EnhancedEmploymentContractUserInput,
  IndependentContractorUserInput
} from '../types/documents';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (Kenya format)
const phoneRegex = /^(\+254|0)[17]\d{8}$/;

export class DocumentValidators {
  static validateSalesPurchaseInput(input: SalesPurchaseUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.sellerName?.trim()) errors.push('Seller name is required');
    if (!input.sellerAddress?.trim()) errors.push('Seller address is required');
    if (!input.sellerEmail?.trim()) errors.push('Seller email is required');
    if (!input.buyerName?.trim()) errors.push('Buyer name is required');
    if (!input.buyerAddress?.trim()) errors.push('Buyer address is required');
    if (!input.buyerEmail?.trim()) errors.push('Buyer email is required');
    if (!input.goodsServicesDescription?.trim()) errors.push('Goods/services description is required');
    if (!input.purchasePrice?.trim()) errors.push('Purchase price is required');
    if (!input.paymentTerms?.trim()) errors.push('Payment terms are required');
    if (!input.deliveryTerms?.trim()) errors.push('Delivery terms are required');
    if (!input.deliveryTimeline?.trim()) errors.push('Delivery timeline is required');
    if (!input.warrantyProvisions?.trim()) errors.push('Warranty provisions are required');
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.sellerEmail && !emailRegex.test(input.sellerEmail)) {
      errors.push('Invalid seller email format');
    }
    if (input.buyerEmail && !emailRegex.test(input.buyerEmail)) {
      errors.push('Invalid buyer email format');
    }

    // Phone format validation (optional fields)
    if (input.sellerPhone && !phoneRegex.test(input.sellerPhone)) {
      errors.push('Invalid seller phone format (use Kenya format: +254... or 07.../01...)');
    }
    if (input.buyerPhone && !phoneRegex.test(input.buyerPhone)) {
      errors.push('Invalid buyer phone format (use Kenya format: +254... or 07.../01...)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateDistributionAgreementInput(input: DistributionAgreementUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.principalName?.trim()) errors.push('Principal name is required');
    if (!input.principalAddress?.trim()) errors.push('Principal address is required');
    if (!input.principalEmail?.trim()) errors.push('Principal email is required');
    if (!input.principalBusinessRegistration?.trim()) errors.push('Principal business registration is required');
    if (!input.distributorName?.trim()) errors.push('Distributor name is required');
    if (!input.distributorAddress?.trim()) errors.push('Distributor address is required');
    if (!input.distributorEmail?.trim()) errors.push('Distributor email is required');
    if (!input.distributorBusinessRegistration?.trim()) errors.push('Distributor business registration is required');
    if (!input.territoryDefinition?.trim()) errors.push('Territory definition is required');
    if (!input.productSpecifications?.trim()) errors.push('Product specifications are required');
    if (!input.exclusivityType) errors.push('Exclusivity type is required');
    if (!input.minimumSalesTargets?.trim()) errors.push('Minimum sales targets are required');
    if (!input.commissionStructure?.trim()) errors.push('Commission structure is required');
    if (!input.marketingObligations?.trim()) errors.push('Marketing obligations are required');
    if (!input.agreementTerm?.trim()) errors.push('Agreement term is required');
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.principalEmail && !emailRegex.test(input.principalEmail)) {
      errors.push('Invalid principal email format');
    }
    if (input.distributorEmail && !emailRegex.test(input.distributorEmail)) {
      errors.push('Invalid distributor email format');
    }

    // Exclusivity type validation
    if (input.exclusivityType && !['exclusive', 'non-exclusive', 'sole'].includes(input.exclusivityType)) {
      errors.push('Exclusivity type must be exclusive, non-exclusive, or sole');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePartnershipAgreementInput(input: PartnershipAgreementUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.partnershipName?.trim()) errors.push('Partnership name is required');
    if (!input.businessPurpose?.trim()) errors.push('Business purpose is required');
    if (!input.partnershipType) errors.push('Partnership type is required');
    if (!input.businessAddress?.trim()) errors.push('Business address is required');
    if (!input.partners || input.partners.length < 2) errors.push('At least 2 partners are required');
    if (!input.totalCapitalContribution?.trim()) errors.push('Total capital contribution is required');
    if (!input.profitDistributionMethod?.trim()) errors.push('Profit distribution method is required');
    if (!input.managementStructure?.trim()) errors.push('Management structure is required');
    if (!input.decisionMakingProcess?.trim()) errors.push('Decision making process is required');
    if (!input.partnerDutiesAndRestrictions?.trim()) errors.push('Partner duties and restrictions are required');
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Partnership type validation
    if (input.partnershipType && !['general', 'limited', 'limited_liability'].includes(input.partnershipType)) {
      errors.push('Partnership type must be general, limited, or limited_liability');
    }

    // Partners validation
    if (input.partners) {
      input.partners.forEach((partner, index) => {
        if (!partner.partnerName?.trim()) errors.push(`Partner ${index + 1} name is required`);
        if (!partner.partnerAddress?.trim()) errors.push(`Partner ${index + 1} address is required`);
        if (!partner.partnerEmail?.trim()) errors.push(`Partner ${index + 1} email is required`);
        if (!partner.capitalContribution?.trim()) errors.push(`Partner ${index + 1} capital contribution is required`);
        if (!partner.contributionType) errors.push(`Partner ${index + 1} contribution type is required`);
        if (!partner.profitSharePercentage?.trim()) errors.push(`Partner ${index + 1} profit share percentage is required`);
        if (!partner.lossSharePercentage?.trim()) errors.push(`Partner ${index + 1} loss share percentage is required`);

        // Email validation for partners
        if (partner.partnerEmail && !emailRegex.test(partner.partnerEmail)) {
          errors.push(`Invalid email format for Partner ${index + 1}`);
        }

        // Phone validation for partners (optional)
        if (partner.partnerPhone && !phoneRegex.test(partner.partnerPhone)) {
          errors.push(`Invalid phone format for Partner ${index + 1} (use Kenya format: +254... or 07.../01...)`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEnhancedEmploymentContractInput(input: EnhancedEmploymentContractUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.employeeName?.trim()) errors.push('Employee name is required');
    if (!input.employeeAddress?.trim()) errors.push('Employee address is required');
    if (!input.employeeEmail?.trim()) errors.push('Employee email is required');
    if (!input.employeeIdNumber?.trim()) errors.push('Employee ID number is required');
    if (!input.employerName?.trim()) errors.push('Employer name is required');
    if (!input.employerAddress?.trim()) errors.push('Employer address is required');
    if (!input.employerEmail?.trim()) errors.push('Employer email is required');
    if (!input.employerBusinessRegistration?.trim()) errors.push('Employer business registration is required');
    if (!input.jobTitle?.trim()) errors.push('Job title is required');
    if (!input.jobDescription?.trim()) errors.push('Job description is required');
    if (!input.department?.trim()) errors.push('Department is required');
    if (!input.employmentType) errors.push('Employment type is required');
    if (!input.startDate?.trim()) errors.push('Start date is required');
    if (!input.basicSalary?.trim()) errors.push('Basic salary is required');
    if (!input.salaryPaymentFrequency) errors.push('Salary payment frequency is required');
    if (!input.benefitsPackage?.trim()) errors.push('Benefits package is required');
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.employeeEmail && !emailRegex.test(input.employeeEmail)) {
      errors.push('Invalid employee email format');
    }
    if (input.employerEmail && !emailRegex.test(input.employerEmail)) {
      errors.push('Invalid employer email format');
    }

    // Employment type validation
    if (input.employmentType && !['permanent', 'fixed_term', 'casual', 'contract'].includes(input.employmentType)) {
      errors.push('Employment type must be permanent, fixed_term, casual, or contract');
    }

    // Salary payment frequency validation
    if (input.salaryPaymentFrequency && !['monthly', 'bi-weekly', 'weekly'].includes(input.salaryPaymentFrequency)) {
      errors.push('Salary payment frequency must be monthly, bi-weekly, or weekly');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateIndependentContractorInput(input: IndependentContractorUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.contractorName?.trim()) errors.push('Contractor name is required');
    if (!input.contractorAddress?.trim()) errors.push('Contractor address is required');
    if (!input.contractorEmail?.trim()) errors.push('Contractor email is required');
    if (!input.clientName?.trim()) errors.push('Client name is required');
    if (!input.clientAddress?.trim()) errors.push('Client address is required');
    if (!input.clientEmail?.trim()) errors.push('Client email is required');
    if (!input.clientBusinessRegistration?.trim()) errors.push('Client business registration is required');
    if (!input.servicesDescription?.trim()) errors.push('Services description is required');
    if (!input.projectScope?.trim()) errors.push('Project scope is required');
    if (!input.compensationStructure) errors.push('Compensation structure is required');
    if (!input.paymentSchedule?.trim()) errors.push('Payment schedule is required');
    if (!input.projectStartDate?.trim()) errors.push('Project start date is required');
    if (!input.projectDuration?.trim()) errors.push('Project duration is required');
    if (!input.intellectualPropertyOwnership?.trim()) errors.push('Intellectual property ownership is required');
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.contractorEmail && !emailRegex.test(input.contractorEmail)) {
      errors.push('Invalid contractor email format');
    }
    if (input.clientEmail && !emailRegex.test(input.clientEmail)) {
      errors.push('Invalid client email format');
    }

    // Compensation structure validation
    if (input.compensationStructure && !['fixed_fee', 'hourly_rate', 'milestone_based', 'retainer'].includes(input.compensationStructure)) {
      errors.push('Compensation structure must be fixed_fee, hourly_rate, milestone_based, or retainer');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateDocumentInput(documentType: DocumentType, userInput: DocumentUserInput): ValidationResult {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return this.validateSalesPurchaseInput(userInput as SalesPurchaseUserInput);
      
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return this.validateDistributionAgreementInput(userInput as DistributionAgreementUserInput);
      
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return this.validatePartnershipAgreementInput(userInput as PartnershipAgreementUserInput);
      
      case DocumentType.EMPLOYMENT_CONTRACT:
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return this.validateEnhancedEmploymentContractInput(userInput as EnhancedEmploymentContractUserInput);
      
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return this.validateIndependentContractorInput(userInput as IndependentContractorUserInput);
      
      default:
        return {
          isValid: true,
          errors: []
        };
    }
  }
}

export default DocumentValidators;