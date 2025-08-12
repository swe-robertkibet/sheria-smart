import { DocumentType, DocumentUserInput } from '../types/document';
import { 
  SalesPurchaseUserInput,
  DistributionAgreementUserInput,
  PartnershipAgreementUserInput,
  EnhancedEmploymentContractUserInput,
  IndependentContractorUserInput,
  ServiceAgreementUserInput,
  NonCompeteUserInput,
  EnhancedLeaseUserInput,
  SaleOfLandUserInput
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
        if (!partner.capitalContribution || !String(partner.capitalContribution).trim()) errors.push(`Partner ${index + 1} capital contribution is required`);
        if (!partner.contributionType) errors.push(`Partner ${index + 1} contribution type is required`);
        if (!partner.profitSharePercentage || !String(partner.profitSharePercentage).trim()) errors.push(`Partner ${index + 1} profit share percentage is required`);
        if (!partner.lossSharePercentage || !String(partner.lossSharePercentage).trim()) errors.push(`Partner ${index + 1} loss share percentage is required`);

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

  static validateServiceAgreementInput(input: ServiceAgreementUserInput): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!input.serviceProviderName?.trim()) errors.push('Service provider name is required');
    if (!input.serviceProviderAddress?.trim()) errors.push('Service provider address is required');
    if (!input.serviceProviderEmail?.trim()) errors.push('Service provider email is required');
    if (!input.clientName?.trim()) errors.push('Client name is required');
    if (!input.clientAddress?.trim()) errors.push('Client address is required');
    if (!input.clientEmail?.trim()) errors.push('Client email is required');
    if (!input.scopeOfServices?.trim()) errors.push('Scope of services is required');
    if (!input.deliverablesDescription?.trim()) errors.push('Deliverables description is required');
    if (!input.serviceTimeline?.trim()) errors.push('Service timeline is required');
    if (!input.feeStructure?.trim()) errors.push('Fee structure is required');
    if (!input.paymentTerms?.trim()) errors.push('Payment terms are required');
    if (!input.intellectualPropertyOwnership?.trim()) errors.push('Intellectual property ownership is required');
    if (!input.workProductRights?.trim()) errors.push('Work product rights are required');
    if (!input.confidentialityRequirements?.trim()) errors.push('Confidentiality requirements are required');
    if (!input.independentContractorStatus?.trim()) errors.push('Independent contractor status is required');
    if (!input.liabilityLimitations?.trim()) errors.push('Liability limitations are required');
    if (!input.terminationConditions?.trim()) errors.push('Termination conditions are required');
    if (!input.terminationNotice?.trim()) errors.push('Termination notice period is required');

    // Email validation
    if (input.serviceProviderEmail && !emailRegex.test(input.serviceProviderEmail)) {
      errors.push('Invalid service provider email format');
    }
    if (input.clientEmail && !emailRegex.test(input.clientEmail)) {
      errors.push('Invalid client email format');
    }

    // Phone validation (optional fields)
    if (input.serviceProviderPhone && !phoneRegex.test(input.serviceProviderPhone)) {
      errors.push('Invalid service provider phone format. Use format: +254XXXXXXXXX or 07XXXXXXXX');
    }
    if (input.clientPhone && !phoneRegex.test(input.clientPhone)) {
      errors.push('Invalid client phone format. Use format: +254XXXXXXXXX or 07XXXXXXXX');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateNonCompeteInput(input: NonCompeteUserInput): ValidationResult {
    const errors: string[] = [];

    // Employee Information - Required fields
    if (!input.employeeName?.trim()) errors.push('Employee name is required');
    if (!input.employeeAddress?.trim()) errors.push('Employee address is required');
    if (!input.employeeEmail?.trim()) errors.push('Employee email is required');
    if (!input.employeePosition?.trim()) errors.push('Employee position is required');

    // Employer Information - Required fields
    if (!input.employerName?.trim()) errors.push('Employer name is required');
    if (!input.employerAddress?.trim()) errors.push('Employer address is required');
    if (!input.employerEmail?.trim()) errors.push('Employer email is required');
    if (!input.employerBusinessRegistration?.trim()) errors.push('Employer business registration is required');
    if (!input.employerBusinessType?.trim()) errors.push('Employer business type is required');

    // Employment Context - Required fields
    if (!input.employmentStartDate?.trim()) errors.push('Employment start date is required');
    if (!input.currentPosition?.trim()) errors.push('Current position is required');
    if (!input.accessToConfidentialInfo?.trim()) errors.push('Access to confidential info description is required');
    if (!input.customerRelationships?.trim()) errors.push('Customer relationships description is required');

    // Non-Compete Restrictions - Required fields
    if (!input.restrictedActivities?.trim()) errors.push('Restricted activities description is required');
    if (!input.competitorDefinition?.trim()) errors.push('Competitor definition is required');
    if (!input.restrictedServices?.trim()) errors.push('Restricted services description is required');
    if (!input.restrictedProducts?.trim()) errors.push('Restricted products description is required');

    // Geographic Scope - Required fields
    if (!input.geographicScope?.trim()) errors.push('Geographic scope is required');
    if (!input.territoryDefinition?.trim()) errors.push('Territory definition is required');

    // Temporal Scope - Required fields
    if (!input.restrictionDuration?.trim()) errors.push('Restriction duration is required');
    if (!input.restrictionStartDate?.trim()) errors.push('Restriction start date is required');

    // Non-Solicitation - Required fields
    if (!input.customerNonSolicitation?.trim()) errors.push('Customer non-solicitation clause is required');
    if (!input.employeeNonSolicitation?.trim()) errors.push('Employee non-solicitation clause is required');

    // Consideration - Required fields
    if (!input.considerationProvided?.trim()) errors.push('Consideration provided description is required');

    // Enforcement - Required fields
    if (!input.remediesAvailable?.trim()) errors.push('Remedies available description is required');
    if (!input.injunctiveReliefProvision?.trim()) errors.push('Injunctive relief provision is required');

    // Severability - Required fields
    if (!input.severabilityProvisions?.trim()) errors.push('Severability provisions are required');

    // Base document fields
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.employeeEmail && !emailRegex.test(input.employeeEmail)) {
      errors.push('Invalid employee email format');
    }
    if (input.employerEmail && !emailRegex.test(input.employerEmail)) {
      errors.push('Invalid employer email format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEnhancedLeaseInput(input: EnhancedLeaseUserInput): ValidationResult {
    const errors: string[] = [];

    // Landlord Information - Required fields
    if (!input.landlordName?.trim()) errors.push('Landlord name is required');
    if (!input.landlordAddress?.trim()) errors.push('Landlord address is required');
    if (!input.landlordEmail?.trim()) errors.push('Landlord email is required');

    // Tenant Information - Required fields
    if (!input.tenantName?.trim()) errors.push('Tenant name is required');
    if (!input.tenantAddress?.trim()) errors.push('Tenant address is required');
    if (!input.tenantEmail?.trim()) errors.push('Tenant email is required');

    // Property Details - Required fields
    if (!input.propertyAddress?.trim()) errors.push('Property address is required');
    if (!input.propertyDescription?.trim()) errors.push('Property description is required');
    if (!input.propertyType) errors.push('Property type is required');
    if (!input.propertySize?.trim()) errors.push('Property size is required');
    if (!input.furnishingStatus) errors.push('Furnishing status is required');

    // Lease Terms - Required fields
    if (!input.leaseType) errors.push('Lease type is required');
    if (!input.leaseTerm?.trim()) errors.push('Lease term is required');
    if (!input.leaseStartDate?.trim()) errors.push('Lease start date is required');

    // Financial Terms - Required fields
    if (!input.monthlyRent?.trim()) errors.push('Monthly rent is required');
    if (!input.rentPaymentDate?.trim()) errors.push('Rent payment date is required');
    if (!input.rentPaymentMethod?.trim()) errors.push('Rent payment method is required');
    if (!input.securityDeposit?.trim()) errors.push('Security deposit is required');

    // Property Use - Required fields
    if (!input.permittedUse?.trim()) errors.push('Permitted use description is required');
    if (!input.sublettingPolicy) errors.push('Subletting policy is required');

    // Maintenance and Repairs - Required fields
    if (!input.landlordMaintenanceResponsibilities?.trim()) errors.push('Landlord maintenance responsibilities are required');
    if (!input.tenantMaintenanceResponsibilities?.trim()) errors.push('Tenant maintenance responsibilities are required');
    if (!input.repairNotificationProcess?.trim()) errors.push('Repair notification process is required');
    if (!input.emergencyRepairProcedures?.trim()) errors.push('Emergency repair procedures are required');

    // Utilities and Services - Required fields
    if (!input.utilitiesIncluded?.trim()) errors.push('Utilities included description is required');
    if (!input.utilitiesPaidByTenant?.trim()) errors.push('Utilities paid by tenant description is required');

    // Insurance and Liability - Required fields
    if (!input.landlordInsuranceRequirements?.trim()) errors.push('Landlord insurance requirements are required');
    if (!input.liabilityAllocation?.trim()) errors.push('Liability allocation is required');
    if (!input.propertyDamageResponsibility?.trim()) errors.push('Property damage responsibility is required');

    // Entry and Inspection - Required fields
    if (!input.landlordEntryRights?.trim()) errors.push('Landlord entry rights are required');
    if (!input.noticeRequirements?.trim()) errors.push('Notice requirements are required');

    // Termination and Default - Required fields
    if (!input.terminationConditions?.trim()) errors.push('Termination conditions are required');
    if (!input.noticePeriodsForTermination?.trim()) errors.push('Notice periods for termination are required');
    if (!input.defaultRemedies?.trim()) errors.push('Default remedies are required');
    if (!input.evictionProcedures?.trim()) errors.push('Eviction procedures are required');

    // Base document fields
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.landlordEmail && !emailRegex.test(input.landlordEmail)) {
      errors.push('Invalid landlord email format');
    }
    if (input.tenantEmail && !emailRegex.test(input.tenantEmail)) {
      errors.push('Invalid tenant email format');
    }

    // Phone format validation (optional fields)
    if (input.landlordPhone && !phoneRegex.test(input.landlordPhone)) {
      errors.push('Invalid landlord phone format (use Kenya format: +254... or 07.../01...)');
    }
    if (input.tenantPhone && !phoneRegex.test(input.tenantPhone)) {
      errors.push('Invalid tenant phone format (use Kenya format: +254... or 07.../01...)');
    }

    // Property type validation
    if (input.propertyType && !['residential', 'commercial', 'industrial', 'mixed_use'].includes(input.propertyType)) {
      errors.push('Property type must be residential, commercial, industrial, or mixed_use');
    }

    // Furnishing status validation
    if (input.furnishingStatus && !['furnished', 'semi_furnished', 'unfurnished'].includes(input.furnishingStatus)) {
      errors.push('Furnishing status must be furnished, semi_furnished, or unfurnished');
    }

    // Lease type validation
    if (input.leaseType && !['fixed_term', 'periodic', 'at_will'].includes(input.leaseType)) {
      errors.push('Lease type must be fixed_term, periodic, or at_will');
    }

    // Subletting policy validation
    if (input.sublettingPolicy && !['prohibited', 'with_consent', 'freely_permitted'].includes(input.sublettingPolicy)) {
      errors.push('Subletting policy must be prohibited, with_consent, or freely_permitted');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSaleOfLandInput(input: SaleOfLandUserInput): ValidationResult {
    const errors: string[] = [];

    // Vendor Information - Required fields
    if (!input.vendorName?.trim()) errors.push('Vendor name is required');
    if (!input.vendorAddress?.trim()) errors.push('Vendor address is required');
    if (!input.vendorEmail?.trim()) errors.push('Vendor email is required');
    if (!input.vendorIdNumber?.trim()) errors.push('Vendor ID number is required');

    // Purchaser Information - Required fields
    if (!input.purchaserName?.trim()) errors.push('Purchaser name is required');
    if (!input.purchaserAddress?.trim()) errors.push('Purchaser address is required');
    if (!input.purchaserEmail?.trim()) errors.push('Purchaser email is required');
    if (!input.purchaserIdNumber?.trim()) errors.push('Purchaser ID number is required');

    // Property Details - Required fields
    if (!input.propertyDescription?.trim()) errors.push('Property description is required');
    if (!input.propertyAddress?.trim()) errors.push('Property address is required');
    if (!input.titleNumber?.trim()) errors.push('Title number is required');
    if (!input.landRegistryOffice?.trim()) errors.push('Land registry office is required');
    if (!input.propertySize?.trim()) errors.push('Property size is required');
    if (!input.propertyBoundaries?.trim()) errors.push('Property boundaries are required');
    if (!input.propertyType) errors.push('Property type is required');

    // Purchase Terms - Required fields
    if (!input.purchasePrice?.trim()) errors.push('Purchase price is required');
    if (!input.paymentTerms?.trim()) errors.push('Payment terms are required');
    if (!input.depositAmount?.trim()) errors.push('Deposit amount is required');
    if (!input.balancePaymentSchedule?.trim()) errors.push('Balance payment schedule is required');
    if (!input.completionDate?.trim()) errors.push('Completion date is required');

    // Title and Encumbrances - Required fields
    if (!input.titleWarranties?.trim()) errors.push('Title warranties are required');

    // Conditions of Sale - Required fields
    if (!input.conditionsToCompletion?.trim()) errors.push('Conditions to completion are required');

    // Risk and Insurance - Required fields
    if (!input.riskPassageDate?.trim()) errors.push('Risk passage date is required');
    if (!input.insuranceRequirements?.trim()) errors.push('Insurance requirements are required');
    if (!input.propertyInsuranceTransfer?.trim()) errors.push('Property insurance transfer is required');

    // Completion Arrangements - Required fields
    if (!input.completionVenue?.trim()) errors.push('Completion venue is required');
    if (!input.documentsForCompletion?.trim()) errors.push('Documents for completion are required');
    if (!input.possessionDate?.trim()) errors.push('Possession date is required');

    // Default and Remedies - Required fields
    if (!input.defaultProvisions?.trim()) errors.push('Default provisions are required');
    if (!input.remediesForBreach?.trim()) errors.push('Remedies for breach are required');
    if (input.timeIsOfEssenceClause === undefined || input.timeIsOfEssenceClause === null || input.timeIsOfEssenceClause === '') errors.push('Time is of essence clause selection is required');

    // Legal and Professional Costs - Required fields
    if (!input.legalCosts?.trim()) errors.push('Legal costs allocation is required');
    if (!input.stampDutyResponsibility?.trim()) errors.push('Stamp duty responsibility is required');
    if (!input.registrationFees?.trim()) errors.push('Registration fees responsibility is required');

    // Base document fields
    if (!input.effectiveDate?.trim()) errors.push('Effective date is required');

    // Email format validation
    if (input.vendorEmail && !emailRegex.test(input.vendorEmail)) {
      errors.push('Invalid vendor email format');
    }
    if (input.purchaserEmail && !emailRegex.test(input.purchaserEmail)) {
      errors.push('Invalid purchaser email format');
    }

    // Phone format validation (optional fields)
    if (input.vendorPhone && !phoneRegex.test(input.vendorPhone)) {
      errors.push('Invalid vendor phone format (use Kenya format: +254... or 07.../01...)');
    }
    if (input.purchaserPhone && !phoneRegex.test(input.purchaserPhone)) {
      errors.push('Invalid purchaser phone format (use Kenya format: +254... or 07.../01...)');
    }

    // Property type validation
    if (input.propertyType && !['residential', 'commercial', 'agricultural', 'industrial'].includes(input.propertyType)) {
      errors.push('Property type must be residential, commercial, agricultural, or industrial');
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
      
      case DocumentType.SERVICE_AGREEMENT:
        return this.validateServiceAgreementInput(userInput as unknown as ServiceAgreementUserInput);
      
      case DocumentType.NON_COMPETE_AGREEMENT:
        return this.validateNonCompeteInput(userInput as NonCompeteUserInput);
      
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
        return this.validateEnhancedLeaseInput(userInput as EnhancedLeaseUserInput);
      
      case DocumentType.SALE_OF_LAND_AGREEMENT:
        return this.validateSaleOfLandInput(userInput as SaleOfLandUserInput);
      
      default:
        return {
          isValid: true,
          errors: []
        };
    }
  }
}

export default DocumentValidators;