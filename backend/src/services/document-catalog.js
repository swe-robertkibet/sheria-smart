"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCatalog = void 0;
const document_1 = require("../types/document");
// Document metadata catalog
class DocumentCatalog {
    static getAllDocumentTypes() {
        return Object.entries(this.documentTypeMetadata).map(([id, metadata]) => (Object.assign({ id: id }, metadata)));
    }
    static getDocumentTypeInfo(documentType) {
        const metadata = this.documentTypeMetadata[documentType];
        if (!metadata)
            return null;
        return Object.assign({ id: documentType }, metadata);
    }
    static getAllCategories() {
        const categories = [];
        Object.values(document_1.DocumentCategory).forEach(categoryId => {
            const categoryMetadata = this.categoryMetadata[categoryId];
            const documentsInCategory = this.getAllDocumentTypes().filter(doc => doc.category === categoryId);
            categories.push(Object.assign(Object.assign({ id: categoryId }, categoryMetadata), { documents: documentsInCategory }));
        });
        return categories;
    }
    static getCategoryInfo(category) {
        const metadata = this.categoryMetadata[category];
        if (!metadata)
            return null;
        const documentsInCategory = this.getAllDocumentTypes().filter(doc => doc.category === category);
        return Object.assign(Object.assign({ id: category }, metadata), { documents: documentsInCategory });
    }
    static getActiveDocumentTypes() {
        return this.getAllDocumentTypes().filter(doc => doc.isActive);
    }
    static isDocumentTypeActive(documentType) {
        const info = this.getDocumentTypeInfo(documentType);
        return (info === null || info === void 0 ? void 0 : info.isActive) || false;
    }
}
exports.DocumentCatalog = DocumentCatalog;
DocumentCatalog.documentTypeMetadata = {
    // Original documents
    [document_1.DocumentType.NDA]: {
        name: 'Non-Disclosure Agreement (NDA)',
        category: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
        description: 'Protect confidential information shared between parties',
        isActive: true,
        complexity: 'Low',
        requiredFields: [
            'disclosingPartyName', 'disclosingPartyAddress', 'disclosingPartyEmail',
            'receivingPartyName', 'receivingPartyAddress', 'receivingPartyEmail',
            'purposeOfDisclosure', 'specificConfidentialInfo', 'effectiveDate',
            'agreementDuration', 'isPerperual'
        ]
    },
    [document_1.DocumentType.EMPLOYMENT_CONTRACT]: {
        name: 'Employment Contract',
        category: document_1.DocumentCategory.EMPLOYMENT_HR,
        description: 'Employment agreements compliant with Kenyan labor law',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.SERVICE_AGREEMENT]: {
        name: 'Service Agreement',
        category: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
        description: 'Professional service contracts and agreements',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.LEASE_AGREEMENT]: {
        name: 'Lease Agreement',
        category: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
        description: 'Residential and commercial property rental agreements',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    // Business & Commercial Contracts
    [document_1.DocumentType.SALES_PURCHASE_AGREEMENT]: {
        name: 'Sales & Purchase Agreement',
        category: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
        description: 'Govern the transfer of ownership of goods or services from seller to buyer',
        isActive: true,
        complexity: 'Medium',
        requiredFields: [
            'sellerName', 'sellerAddress', 'sellerEmail', 'buyerName', 'buyerAddress', 'buyerEmail',
            'goodsServicesDescription', 'purchasePrice', 'paymentTerms', 'deliveryTerms',
            'deliveryTimeline', 'warrantyProvisions', 'effectiveDate'
        ]
    },
    [document_1.DocumentType.DISTRIBUTION_AGREEMENT]: {
        name: 'Distribution Agreement',
        category: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
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
    [document_1.DocumentType.PARTNERSHIP_AGREEMENT]: {
        name: 'Partnership Agreement',
        category: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
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
    [document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT]: {
        name: 'Enhanced Employment Contract',
        category: document_1.DocumentCategory.EMPLOYMENT_HR,
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
    [document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT]: {
        name: 'Independent Contractor Agreement',
        category: document_1.DocumentCategory.EMPLOYMENT_HR,
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
    [document_1.DocumentType.NON_COMPETE_AGREEMENT]: {
        name: 'Non-Compete Agreement',
        category: document_1.DocumentCategory.EMPLOYMENT_HR,
        description: 'Restrict employee competitive activities during and after employment',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    // Property & Real Estate (simplified for now)
    [document_1.DocumentType.ENHANCED_LEASE_AGREEMENT]: {
        name: 'Enhanced Lease Agreement',
        category: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
        description: 'Comprehensive rental agreements for residential and commercial properties',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.SALE_OF_LAND_AGREEMENT]: {
        name: 'Sale of Land Agreement',
        category: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
        description: 'Contracts for the purchase and sale of real property',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.PROPERTY_MANAGEMENT_AGREEMENT]: {
        name: 'Property Management Agreement',
        category: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
        description: 'Engage property management services for real estate assets',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    // Family Law Documents (simplified for now)
    [document_1.DocumentType.PRENUPTIAL_AGREEMENT]: {
        name: 'Prenuptial Agreement',
        category: document_1.DocumentCategory.FAMILY_LAW,
        description: 'Define financial and property arrangements before marriage',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.POSTNUPTIAL_AGREEMENT]: {
        name: 'Postnuptial Agreement',
        category: document_1.DocumentCategory.FAMILY_LAW,
        description: 'Modify financial arrangements during marriage',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT]: {
        name: 'Child Custody & Support Agreement',
        category: document_1.DocumentCategory.FAMILY_LAW,
        description: 'Define custody arrangements and child support obligations',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    // Intellectual Property (simplified for now)
    [document_1.DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT]: {
        name: 'Copyright Assignment Agreement',
        category: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
        description: 'Transfer copyright ownership from creator to assignee',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.TRADEMARK_LICENSE_AGREEMENT]: {
        name: 'Trademark License Agreement',
        category: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
        description: 'License trademark usage while maintaining brand control',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.PATENT_LICENSING_AGREEMENT]: {
        name: 'Patent Licensing Agreement',
        category: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
        description: 'License patented technology while protecting patent rights',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    // Corporate Governance (simplified for now)
    [document_1.DocumentType.ARTICLES_OF_ASSOCIATION]: {
        name: 'Articles of Association',
        category: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
        description: 'Internal rules and regulations governing company operations',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.SHAREHOLDER_AGREEMENT]: {
        name: 'Shareholder Agreement',
        category: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
        description: 'Define relationships and obligations between company shareholders',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.BOARD_RESOLUTION]: {
        name: 'Board Resolution',
        category: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
        description: 'Document formal board decisions and authorizations',
        isActive: false,
        complexity: 'Low',
        requiredFields: []
    },
    // Litigation & Dispute Resolution (simplified for now)
    [document_1.DocumentType.SETTLEMENT_AGREEMENT]: {
        name: 'Settlement Agreement',
        category: document_1.DocumentCategory.LITIGATION_DISPUTE,
        description: 'Resolve disputes and avoid continued litigation',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.ARBITRATION_AGREEMENT]: {
        name: 'Arbitration Agreement',
        category: document_1.DocumentCategory.LITIGATION_DISPUTE,
        description: 'Require binding arbitration for dispute resolution',
        isActive: false,
        complexity: 'Medium',
        requiredFields: []
    },
    [document_1.DocumentType.MEDIATION_AGREEMENT]: {
        name: 'Mediation Agreement',
        category: document_1.DocumentCategory.LITIGATION_DISPUTE,
        description: 'Engage in structured mediation process for dispute resolution',
        isActive: false,
        complexity: 'Low',
        requiredFields: []
    },
    // Regulatory & Compliance (simplified for now)
    [document_1.DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT]: {
        name: 'Data Protection Compliance Agreement',
        category: document_1.DocumentCategory.REGULATORY_COMPLIANCE,
        description: 'Ensure compliance with data protection and privacy laws',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE]: {
        name: 'Anti-Money Laundering Compliance',
        category: document_1.DocumentCategory.REGULATORY_COMPLIANCE,
        description: 'Implement AML compliance programs and procedures',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    },
    [document_1.DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT]: {
        name: 'Environmental Compliance Agreement',
        category: document_1.DocumentCategory.REGULATORY_COMPLIANCE,
        description: 'Ensure compliance with environmental regulations and standards',
        isActive: false,
        complexity: 'High',
        requiredFields: []
    }
};
DocumentCatalog.categoryMetadata = {
    [document_1.DocumentCategory.BUSINESS_COMMERCIAL]: {
        name: 'Business & Commercial',
        description: 'Contracts and agreements for business operations and commercial transactions',
        icon: 'Briefcase'
    },
    [document_1.DocumentCategory.EMPLOYMENT_HR]: {
        name: 'Employment & HR',
        description: 'Employment contracts, HR documents, and workforce agreements',
        icon: 'Users'
    },
    [document_1.DocumentCategory.PROPERTY_REAL_ESTATE]: {
        name: 'Property & Real Estate',
        description: 'Property transactions, lease agreements, and real estate contracts',
        icon: 'Home'
    },
    [document_1.DocumentCategory.FAMILY_LAW]: {
        name: 'Family Law',
        description: 'Marriage, divorce, custody, and family-related legal documents',
        icon: 'Heart'
    },
    [document_1.DocumentCategory.INTELLECTUAL_PROPERTY]: {
        name: 'Intellectual Property',
        description: 'Patents, trademarks, copyrights, and IP licensing agreements',
        icon: 'Lightbulb'
    },
    [document_1.DocumentCategory.CORPORATE_GOVERNANCE]: {
        name: 'Corporate Governance',
        description: 'Company formation, shareholder agreements, and corporate documents',
        icon: 'Building'
    },
    [document_1.DocumentCategory.LITIGATION_DISPUTE]: {
        name: 'Litigation & Dispute Resolution',
        description: 'Settlement agreements, arbitration, and dispute resolution documents',
        icon: 'Scale'
    },
    [document_1.DocumentCategory.REGULATORY_COMPLIANCE]: {
        name: 'Regulatory & Compliance',
        description: 'Regulatory compliance, data protection, and legal compliance documents',
        icon: 'Shield'
    }
};
exports.default = DocumentCatalog;
