import { 
  DocumentType, 
  DocumentCategory, 
  DocumentTypeInfo, 
  DocumentCategoryInfo 
} from '../types/document';
import { documentGeneratorRegistry } from '../generators/document-generator-registry';

// Document metadata catalog
export class DocumentCatalog {
  private static documentTypeMetadata: Record<DocumentType, Omit<DocumentTypeInfo, 'id'>> = {
    // Original documents
    [DocumentType.SERVICE_AGREEMENT]: {
      name: 'Service Agreement',
      category: DocumentCategory.BUSINESS_COMMERCIAL,
      description: 'Professional service contracts and agreements',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'serviceProviderName', 'serviceProviderAddress', 'serviceProviderEmail',
        'clientName', 'clientAddress', 'clientEmail', 'scopeOfServices',
        'deliverablesDescription', 'serviceTimeline', 'feeStructure', 'paymentTerms',
        'intellectualPropertyOwnership', 'workProductRights', 'confidentialityRequirements',
        'independentContractorStatus', 'liabilityLimitations', 'terminationConditions',
        'terminationNotice', 'effectiveDate'
      ]
    },

    // Business & Commercial Contracts
    [DocumentType.SALES_PURCHASE_AGREEMENT]: {
      name: 'Sales & Purchase Agreement',
      category: DocumentCategory.BUSINESS_COMMERCIAL,
      description: 'Govern the transfer of ownership of goods or services from seller to buyer',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'sellerName', 'sellerAddress', 'sellerEmail', 'buyerName', 'buyerAddress', 'buyerEmail',
        'goodsServicesDescription', 'purchasePrice', 'paymentTerms', 'deliveryTerms',
        'deliveryTimeline', 'warrantyProvisions', 'effectiveDate'
      ]
    },
    [DocumentType.DISTRIBUTION_AGREEMENT]: {
      name: 'Distribution Agreement',
      category: DocumentCategory.BUSINESS_COMMERCIAL,
      description: 'Establish relationship between manufacturer/supplier and distributor',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'principalName', 'principalAddress', 'principalEmail', 'principalBusinessRegistration',
        'distributorName', 'distributorAddress', 'distributorEmail', 'distributorBusinessRegistration',
        'territoryDefinition', 'productSpecifications', 'exclusivityType', 'minimumSalesTargets',
        'commissionStructure', 'marketingObligations', 'agreementTerm', 'effectiveDate'
      ]
    },
    [DocumentType.PARTNERSHIP_AGREEMENT]: {
      name: 'Partnership Agreement',
      category: DocumentCategory.BUSINESS_COMMERCIAL,
      description: 'Define terms of business partnership between two or more parties',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'partnershipName', 'businessPurpose', 'partnershipType', 'businessAddress',
        'partners', 'totalCapitalContribution', 'profitDistributionMethod', 'managementStructure',
        'decisionMakingProcess', 'partnerDutiesAndRestrictions', 'effectiveDate'
      ]
    },

    // Employment & HR Documents
    [DocumentType.ENHANCED_EMPLOYMENT_CONTRACT]: {
      name: 'Enhanced Employment Contract',
      category: DocumentCategory.EMPLOYMENT_HR,
      description: 'Comprehensive employment terms and conditions',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'employeeName', 'employeeAddress', 'employeeEmail', 'employeeIdNumber',
        'employerName', 'employerAddress', 'employerEmail', 'employerBusinessRegistration',
        'jobTitle', 'jobDescription', 'department', 'employmentType', 'startDate',
        'basicSalary', 'salaryPaymentFrequency', 'benefitsPackage', 'effectiveDate'
      ]
    },
    [DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT]: {
      name: 'Independent Contractor Agreement',
      category: DocumentCategory.EMPLOYMENT_HR,
      description: 'Engage independent contractors while maintaining proper classification',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'contractorName', 'contractorAddress', 'contractorEmail', 'clientName', 'clientAddress',
        'clientEmail', 'clientBusinessRegistration', 'servicesDescription', 'projectScope',
        'compensationStructure', 'paymentSchedule', 'projectStartDate', 'projectDuration',
        'intellectualPropertyOwnership', 'effectiveDate'
      ]
    },
    [DocumentType.NON_COMPETE_AGREEMENT]: {
      name: 'Non-Compete Agreement',
      category: DocumentCategory.EMPLOYMENT_HR,
      description: 'Restrict employee competitive activities during and after employment',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'employeeName', 'employeeAddress', 'employeeEmail', 'employeePosition',
        'employerName', 'employerAddress', 'employerEmail', 'employerBusinessRegistration',
        'employerBusinessType', 'employmentStartDate', 'currentPosition',
        'accessToConfidentialInfo', 'customerRelationships', 'restrictedActivities',
        'competitorDefinition', 'restrictedServices', 'restrictedProducts',
        'geographicScope', 'territoryDefinition', 'restrictionDuration',
        'restrictionStartDate', 'customerNonSolicitation', 'employeeNonSolicitation',
        'considerationProvided', 'remediesAvailable', 'injunctiveReliefProvision',
        'severabilityProvisions', 'effectiveDate'
      ]
    },

    // Property & Real Estate (simplified for now)
    [DocumentType.ENHANCED_LEASE_AGREEMENT]: {
      name: 'Enhanced Lease Agreement',
      category: DocumentCategory.PROPERTY_REAL_ESTATE,
      description: 'Comprehensive rental agreements for residential and commercial properties',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'landlordName', 'landlordAddress', 'landlordEmail', 'tenantName', 'tenantAddress', 
        'tenantEmail', 'propertyAddress', 'propertyDescription', 'propertyType', 'propertySize',
        'furnishingStatus', 'leaseType', 'leaseTerm', 'leaseStartDate', 'monthlyRent',
        'rentPaymentDate', 'rentPaymentMethod', 'securityDeposit', 'permittedUse', 
        'sublettingPolicy', 'landlordMaintenanceResponsibilities', 'tenantMaintenanceResponsibilities',
        'repairNotificationProcess', 'emergencyRepairProcedures', 'utilitiesIncluded',
        'utilitiesPaidByTenant', 'landlordInsuranceRequirements', 'liabilityAllocation',
        'propertyDamageResponsibility', 'landlordEntryRights', 'noticeRequirements',
        'terminationConditions', 'noticePeriodsForTermination', 'defaultRemedies',
        'evictionProcedures', 'effectiveDate'
      ]
    },
    [DocumentType.SALE_OF_LAND_AGREEMENT]: {
      name: 'Sale of Land Agreement',
      category: DocumentCategory.PROPERTY_REAL_ESTATE,
      description: 'Contracts for the purchase and sale of real property',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'vendorName', 'vendorAddress', 'vendorEmail', 'vendorIdNumber', 'purchaserName', 
        'purchaserAddress', 'purchaserEmail', 'purchaserIdNumber', 'propertyDescription', 
        'propertyAddress', 'titleNumber', 'landRegistryOffice', 'propertySize', 
        'propertyBoundaries', 'propertyType', 'purchasePrice', 'paymentTerms', 
        'depositAmount', 'balancePaymentSchedule', 'completionDate', 'titleWarranties', 
        'conditionsToCompletion', 'riskPassageDate', 'insuranceRequirements', 
        'propertyInsuranceTransfer', 'completionVenue', 'documentsForCompletion', 
        'possessionDate', 'defaultProvisions', 'remediesForBreach', 'timeIsOfEssenceClause', 
        'legalCosts', 'stampDutyResponsibility', 'registrationFees', 'effectiveDate'
      ]
    },
    [DocumentType.PROPERTY_MANAGEMENT_AGREEMENT]: {
      name: 'Property Management Agreement',
      category: DocumentCategory.PROPERTY_REAL_ESTATE,
      description: 'Engage property management services for real estate assets',
      isActive: true,
      complexity: 'Medium',
      requiredFields: []
    },

    // Family Law Documents (simplified for now)
    [DocumentType.PRENUPTIAL_AGREEMENT]: {
      name: 'Prenuptial Agreement',
      category: DocumentCategory.FAMILY_LAW,
      description: 'Define financial and property arrangements before marriage',
      isActive: true,
      complexity: 'High',
      requiredFields: []
    },
    [DocumentType.POSTNUPTIAL_AGREEMENT]: {
      name: 'Postnuptial Agreement',
      category: DocumentCategory.FAMILY_LAW,
      description: 'Modify financial arrangements during marriage',
      isActive: true,
      complexity: 'High',
      requiredFields: []
    },
    [DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT]: {
      name: 'Child Custody & Support Agreement',
      category: DocumentCategory.FAMILY_LAW,
      description: 'Define custody arrangements and child support obligations',
      isActive: true,
      complexity: 'Medium',
      requiredFields: []
    },

    // Intellectual Property (simplified for now)
    [DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT]: {
      name: 'Copyright Assignment Agreement',
      category: DocumentCategory.INTELLECTUAL_PROPERTY,
      description: 'Transfer copyright ownership from creator to assignee',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'authorName', 'authorAddress', 'assigneeName', 'assigneeAddress',
        'workDescription', 'workTitle', 'assignmentScope', 'consideration', 
        'territory', 'duration', 'moralRightsWaiver', 'warrantyProvisions', 
        'effectiveDate'
      ]
    },
    [DocumentType.TRADEMARK_LICENSE_AGREEMENT]: {
      name: 'Trademark License Agreement',
      category: DocumentCategory.INTELLECTUAL_PROPERTY,
      description: 'License trademark usage while maintaining brand control',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'licensorName', 'licensorAddress', 'licenseeName', 'licenseeAddress',
        'trademarkDescription', 'licensedProducts', 'territory', 'exclusivity',
        'licenseDuration', 'royaltyStructure', 'paymentTerms', 'qualityControlStandards',
        'marketingObligations', 'effectiveDate'
      ]
    },
    [DocumentType.PATENT_LICENSING_AGREEMENT]: {
      name: 'Patent Licensing Agreement',
      category: DocumentCategory.INTELLECTUAL_PROPERTY,
      description: 'License patented technology while protecting patent rights',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'patentOwnerName', 'patentOwnerAddress', 'licenseeName', 'licenseeAddress',
        'patentDescription', 'patentTitle', 'licensedTechnology', 'fieldOfUse',
        'territory', 'exclusivity', 'licenseDuration', 'royaltyStructure',
        'paymentTerms', 'effectiveDate'
      ]
    },

    // Corporate Governance (simplified for now)
    [DocumentType.ARTICLES_OF_ASSOCIATION]: {
      name: 'Articles of Association',
      category: DocumentCategory.CORPORATE_GOVERNANCE,
      description: 'Internal rules and regulations governing company operations',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'companyName', 'companyAddress', 'companyType', 'businessObjectives',
        'authorizedShareCapital', 'shareNominalValue', 'shareCapitalStructure', 'initialShareAllocation',
        'directorPowers', 'directorLimitations', 'boardComposition', 'directorAppointmentProcedure', 'directorRemovalProcedure',
        'shareholderRights', 'votingRights', 'shareholderMeetingRights', 'informationRights',
        'meetingProcedures', 'boardMeetingProcedures', 'generalMeetingProcedures', 'noticeRequirements', 'quorumRequirements', 'votingProcedures',
        'dividendRules', 'dividendDeclarationProcedure', 'profitDistribution',
        'transferRestrictions', 'shareTransferProcedure',
        'auditRequirements', 'accountingStandards', 'financialReporting', 'recordKeeping',
        'amendmentProcedures', 'specialResolutionRequirements', 'windingUpProcedures', 'assetDistribution',
        'effectiveDate'
      ]
    },
    [DocumentType.SHAREHOLDER_AGREEMENT]: {
      name: 'Shareholder Agreement',
      category: DocumentCategory.CORPORATE_GOVERNANCE,
      description: 'Define relationships and obligations between company shareholders',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'companyName', 'companyAddress', 'companyBusinessType', 'authorizedShareCapital',
        'shareholdingPercentages', 'totalSharesIssued', 'shareNominalValue', 'paidUpCapital',
        'shareholder1Name', 'shareholder1Address', 'shareholder1Percentage', 'shareholder1Shares',
        'shareholder2Name', 'shareholder2Address', 'shareholder2Percentage', 'shareholder2Shares',
        'boardRepresentation', 'boardSize', 'directorAppointmentRights', 'managementStructure', 'votingAgreements', 'quorumRequirements',
        'transferRestrictions', 'rightOfFirstRefusal', 'transferApprovalProcess', 'valuationForTransfers',
        'informationRights', 'financialReporting', 'inspectionRights', 'boardMeetingRights', 'recordAccessRights',
        'dividendPolicy', 'preemptionRights', 'distributionPolicy',
        'exitMechanisms', 'valuationMethods',
        'disputeResolution', 'deadlockResolution', 'confidentialityObligations',
        'amendmentProcedures', 'terminationConditions', 'effectiveDate'
      ]
    },
    [DocumentType.BOARD_RESOLUTION]: {
      name: 'Board Resolution',
      category: DocumentCategory.CORPORATE_GOVERNANCE,
      description: 'Document formal board decisions and authorizations',
      isActive: true,
      complexity: 'Low',
      requiredFields: [
        'companyName', 'companyAddress', 'meetingDate', 'meetingTime', 'meetingLocation', 
        'meetingType', 'meetingChairman', 'totalDirectors', 'directorsPresent', 
        'quorumRequired', 'quorumMet', 'resolutionTitle', 'resolutionDescription', 
        'resolutionType', 'votingResults', 'votesInFavor', 'implementationAuthority', 
        'responsiblePersons', 'companySecretary', 'effectiveDate'
      ]
    },

    // Litigation & Dispute Resolution (simplified for now)
    [DocumentType.SETTLEMENT_AGREEMENT]: {
      name: 'Settlement Agreement',
      category: DocumentCategory.LITIGATION_DISPUTE,
      description: 'Resolve disputes and avoid continued litigation',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'disputeParty1Name', 'disputeParty1Address', 'disputeParty1Email',
        'disputeParty2Name', 'disputeParty2Address', 'disputeParty2Email',
        'disputeDescription', 'disputeBackground', 'disputeSubjectMatter', 'claimsAndCounterclaims',
        'settlementTerms', 'settlementDescription', 'settlementConsideration',
        'performanceObligations', 'releaseOfClaimsScope', 'releaseCoverage',
        'confidentialityProvisions', 'defaultConsequences', 'breachRemedyProcedures',
        'enforcementMechanisms', 'effectiveDate'
      ]
    },
    [DocumentType.ARBITRATION_AGREEMENT]: {
      name: 'Arbitration Agreement',
      category: DocumentCategory.LITIGATION_DISPUTE,
      description: 'Require binding arbitration for dispute resolution',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'party1Name', 'party1Address', 'party1Email',
        'party2Name', 'party2Address', 'party2Email',
        'agreementType', 'disputeScope', 'disputeCoverage', 'legalRelationshipContext',
        'arbitrationRules', 'numberOfArbitrators', 'arbitratorQualifications',
        'arbitratorSelectionMethod', 'arbitratorAppointmentProcess', 'arbitratorIndependenceRequirements',
        'arbitrationSeat', 'procedureLanguage', 'governingLawSubstance', 'governingLawProcedure',
        'costAllocation', 'feePaymentResponsibility', 'currency',
        'confidentialityLevel', 'confidentialityScope',
        'awardFinality', 'awardEnforcementJurisdiction', 'effectiveDate'
      ]
    },
    [DocumentType.MEDIATION_AGREEMENT]: {
      name: 'Mediation Agreement',
      category: DocumentCategory.LITIGATION_DISPUTE,
      description: 'Engage in structured mediation process for dispute resolution',
      isActive: true,
      complexity: 'Medium',
      requiredFields: [
        'party1Name', 'party1Address', 'party2Name', 'party2Address',
        'disputeDescription', 'mediatorSelection', 'mediationProcedures', 'costSharing',
        'confidentialityProvisions', 'effectiveDate'
      ]
    },

    // Regulatory & Compliance (simplified for now)
    [DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT]: {
      name: 'Data Protection Compliance Agreement',
      category: DocumentCategory.REGULATORY_COMPLIANCE,
      description: 'Ensure compliance with data protection and privacy laws',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'controllerName', 'controllerAddress', 'processingPurpose', 'dataCategories',
        'dataSubjectCategories', 'legalBasisController', 'dataSubjectRights',
        'securityMeasures', 'breachNotificationProcedure', 'retentionPeriod',
        'complianceMonitoring', 'effectiveDate'
      ]
    },
    [DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE]: {
      name: 'Anti-Money Laundering Compliance',
      category: DocumentCategory.REGULATORY_COMPLIANCE,
      description: 'Implement AML compliance programs and procedures',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'institutionName', 'institutionAddress', 'institutionType', 'complianceOfficerName',
        'amlPolicyFramework', 'customerDueDiligenceProcedures', 'kycRequirements',
        'transactionMonitoring', 'suspiciousActivityReporting', 'recordKeepingRequirements',
        'trainingPrograms', 'riskAssessmentProcedures', 'reportingObligations', 'effectiveDate'
      ]
    },
    [DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT]: {
      name: 'Environmental Compliance Agreement',
      category: DocumentCategory.REGULATORY_COMPLIANCE,
      description: 'Ensure compliance with environmental regulations and standards',
      isActive: true,
      complexity: 'High',
      requiredFields: [
        'companyName', 'companyAddress', 'companyType', 'environmentalOfficerName',
        'environmentalLegalFramework', 'environmentalManagementSystem', 'pollutionPreventionControl',
        'wasteManagementProcedures', 'environmentalMonitoring', 'communityEngagement',
        'environmentalTraining', 'complianceMonitoring', 'documentationRequirements', 'effectiveDate'
      ]
    }
  };

  private static categoryMetadata: Record<DocumentCategory, Omit<DocumentCategoryInfo, 'id' | 'documents'>> = {
    [DocumentCategory.BUSINESS_COMMERCIAL]: {
      name: 'Business & Commercial',
      description: 'Contracts and agreements for business operations and commercial transactions',
      icon: 'Briefcase'
    },
    [DocumentCategory.EMPLOYMENT_HR]: {
      name: 'Employment & HR',
      description: 'Employment contracts, HR documents, and workforce agreements',
      icon: 'Users'
    },
    [DocumentCategory.PROPERTY_REAL_ESTATE]: {
      name: 'Property & Real Estate',
      description: 'Property transactions, lease agreements, and real estate contracts',
      icon: 'Home'
    },
    [DocumentCategory.FAMILY_LAW]: {
      name: 'Family Law',
      description: 'Marriage, divorce, custody, and family-related legal documents',
      icon: 'Heart'
    },
    [DocumentCategory.INTELLECTUAL_PROPERTY]: {
      name: 'Intellectual Property',
      description: 'Patents, trademarks, copyrights, and IP licensing agreements',
      icon: 'Lightbulb'
    },
    [DocumentCategory.CORPORATE_GOVERNANCE]: {
      name: 'Corporate Governance',
      description: 'Company formation, shareholder agreements, and corporate documents',
      icon: 'Building'
    },
    [DocumentCategory.LITIGATION_DISPUTE]: {
      name: 'Litigation & Dispute Resolution',
      description: 'Settlement agreements, arbitration, and dispute resolution documents',
      icon: 'Scale'
    },
    [DocumentCategory.REGULATORY_COMPLIANCE]: {
      name: 'Regulatory & Compliance',
      description: 'Regulatory compliance, data protection, and legal compliance documents',
      icon: 'Shield'
    }
  };

  static getAllDocumentTypes(): DocumentTypeInfo[] {
    return Object.entries(this.documentTypeMetadata).map(([id, metadata]) => ({
      id: id as DocumentType,
      ...metadata
    }));
  }

  static getDocumentTypeInfo(documentType: DocumentType): DocumentTypeInfo | null {
    const metadata = this.documentTypeMetadata[documentType];
    if (!metadata) return null;

    return {
      id: documentType,
      ...metadata
    };
  }

  static getAllCategories(): DocumentCategoryInfo[] {
    const categories: DocumentCategoryInfo[] = [];

    Object.values(DocumentCategory).forEach(categoryId => {
      const categoryMetadata = this.categoryMetadata[categoryId];
      const documentsInCategory = this.getAllDocumentTypes().filter(
        doc => doc.category === categoryId
      );

      categories.push({
        id: categoryId,
        ...categoryMetadata,
        documents: documentsInCategory
      });
    });

    return categories;
  }

  static getCategoryInfo(category: DocumentCategory): DocumentCategoryInfo | null {
    const metadata = this.categoryMetadata[category];
    if (!metadata) return null;

    const documentsInCategory = this.getAllDocumentTypes().filter(
      doc => doc.category === category
    );

    return {
      id: category,
      ...metadata,
      documents: documentsInCategory
    };
  }

  static getActiveDocumentTypes(): DocumentTypeInfo[] {
    return this.getAllDocumentTypes().filter(doc => doc.isActive);
  }

  static isDocumentTypeActive(documentType: DocumentType): boolean {
    const info = this.getDocumentTypeInfo(documentType);
    return info?.isActive || false;
  }

  static getDocumentSuggestions(legalArea: string, keywords: string[] = [], userMessage: string = ''): DocumentTypeInfo[] {
    const activeDocuments = this.getActiveDocumentTypes();
    const suggestions: DocumentTypeInfo[] = [];
    const messageLower = userMessage.toLowerCase();

    // Enhanced context-specific document mapping
    const contextSpecificDocs: { [key: string]: string[] } = {
      'land sale': ['SALE_OF_LAND_AGREEMENT'],
      'property sale': ['SALE_OF_LAND_AGREEMENT'],
      'land purchase': ['SALE_OF_LAND_AGREEMENT'],
      'buy land': ['SALE_OF_LAND_AGREEMENT'],
      'sell land': ['SALE_OF_LAND_AGREEMENT'],
      'employment contract': ['ENHANCED_EMPLOYMENT_CONTRACT'],
      'job contract': ['ENHANCED_EMPLOYMENT_CONTRACT'],
      'work agreement': ['ENHANCED_EMPLOYMENT_CONTRACT'],
      'lease agreement': ['ENHANCED_LEASE_AGREEMENT'],
      'rental agreement': ['ENHANCED_LEASE_AGREEMENT'],
      'tenancy agreement': ['ENHANCED_LEASE_AGREEMENT'],
      'service agreement': ['SERVICE_AGREEMENT'],
      'partnership': ['PARTNERSHIP_AGREEMENT'],
      'company formation': ['ARTICLES_OF_ASSOCIATION'],
      'shareholder agreement': ['SHAREHOLDER_AGREEMENT'],
      'settlement': ['SETTLEMENT_AGREEMENT'],
      'mediation': ['MEDIATION_AGREEMENT'],
      'arbitration': ['ARBITRATION_AGREEMENT']
    };

    // Track context-specific matches and category matches separately
    const contextMatches: DocumentTypeInfo[] = [];
    const categoryMatches: DocumentTypeInfo[] = [];

    // Check for specific context matches first
    for (const [context, docTypes] of Object.entries(contextSpecificDocs)) {
      if (messageLower.includes(context)) {
        docTypes.forEach(docType => {
          const doc = activeDocuments.find(d => d.id === docType);
          if (doc && !contextMatches.find(s => s.id === doc.id)) {
            contextMatches.push(doc);
          }
        });
      }
    }

    // Only do category-based matching if we don't have enough context matches
    if (contextMatches.length < 3) {
      const legalAreaToCategory: { [key: string]: DocumentCategory[] } = {
        'Contract Law': [DocumentCategory.BUSINESS_COMMERCIAL],
        'Employment Law': [DocumentCategory.EMPLOYMENT_HR],
        'Property Law': [DocumentCategory.PROPERTY_REAL_ESTATE],
        'Family Law': [DocumentCategory.FAMILY_LAW],
        'Business Law': [DocumentCategory.BUSINESS_COMMERCIAL, DocumentCategory.CORPORATE_GOVERNANCE],
        'Intellectual Property': [DocumentCategory.INTELLECTUAL_PROPERTY],
        'Tenancy Law': [DocumentCategory.PROPERTY_REAL_ESTATE],
        'Civil Procedure': [DocumentCategory.LITIGATION_DISPUTE],
        'Criminal Law': [DocumentCategory.LITIGATION_DISPUTE],
        'Consumer Protection': [DocumentCategory.BUSINESS_COMMERCIAL],
        'Constitutional Law': [DocumentCategory.LITIGATION_DISPUTE],
        'Other': Object.values(DocumentCategory)
      };

      // Get relevant categories for the legal area
      const relevantCategories = legalAreaToCategory[legalArea] || [];

      // Filter documents by category, excluding those already found in context matches
      const categoryDocs = activeDocuments.filter(doc => 
        relevantCategories.includes(doc.category) && 
        !contextMatches.find(cm => cm.id === doc.id)
      );

      // Keyword-based matching for more specific suggestions
      if (keywords.length > 0) {
        const keywordMatches = activeDocuments.filter(doc => {
          const searchText = `${doc.name} ${doc.description}`.toLowerCase();
          return keywords.some(keyword => 
            searchText.includes(keyword.toLowerCase())
          ) && !contextMatches.find(cm => cm.id === doc.id);
        });
        
        // Add keyword matches to category matches
        keywordMatches.forEach(doc => {
          if (!categoryMatches.find(s => s.id === doc.id)) {
            categoryMatches.push(doc);
          }
        });
      }

      // Add category docs to category matches
      categoryDocs.forEach(doc => {
        if (!categoryMatches.find(s => s.id === doc.id)) {
          categoryMatches.push(doc);
        }
      });
    }

    // Combine results: context matches first, then category matches
    const finalSuggestions = [
      ...contextMatches,
      ...categoryMatches.slice(0, 3 - contextMatches.length)
    ];

    // Limit to top 3 suggestions to avoid overwhelming the user
    return finalSuggestions.slice(0, 3);
  }

  static getDocumentNavigationSteps(documentType: DocumentType): string[] {
    const categoryInfo = this.getCategoryInfo(this.getDocumentTypeInfo(documentType)?.category!);
    const documentInfo = this.getDocumentTypeInfo(documentType);
    
    if (!categoryInfo || !documentInfo) {
      return ['Go to Documents section', 'Search for the document type'];
    }

    return [
      'Click on "Documents" from the main dashboard',
      `Select "${categoryInfo.name}" category`,
      `Choose "${documentInfo.name}" document type`,
      'Fill in the required information',
      'Review and generate your document'
    ];
  }

  static getEstimatedCompletionTime(documentType: DocumentType): string {
    const info = this.getDocumentTypeInfo(documentType);
    if (!info) return '15-30 minutes';

    switch (info.complexity) {
      case 'Low':
        return '10-15 minutes';
      case 'Medium':
        return '20-30 minutes';
      case 'High':
        return '45-60 minutes';
      default:
        return '15-30 minutes';
    }
  }
}

export default DocumentCatalog;