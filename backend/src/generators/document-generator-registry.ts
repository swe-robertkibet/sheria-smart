import { DocumentType, DocumentCategory, DocumentUserInput, DocumentFormat } from '../types/document';
import { BaseDocumentGenerator } from './base/base-document-generator';

// Business generators
import { SalesPurchaseGenerator } from './business/sales-purchase-generator';
import { DistributionAgreementGenerator } from './business/distribution-agreement-generator';
import { PartnershipAgreementGenerator } from './business/partnership-agreement-generator';
import { ServiceAgreementGenerator } from './business/service-agreement-generator';

// Employment generators
import { EnhancedEmploymentContractGenerator } from './employment/enhanced-employment-generator';
import { IndependentContractorGenerator } from './employment/independent-contractor-generator';
import { NonCompeteGenerator } from './employment/non-compete-generator';

// Property generators
import { EnhancedLeaseGenerator } from './property/enhanced-lease-generator';
import { SaleOfLandGenerator } from './property/sale-of-land-generator';
import { PropertyManagementGenerator } from './property/property-management-generator';

// Family Law generators
import { PrenuptialGenerator } from './family/prenuptial-generator';
import { PostnuptialGenerator } from './family/postnuptial-generator';
import { ChildCustodyGenerator } from './family/child-custody-generator';

// Intellectual Property generators
import { CopyrightAssignmentGenerator } from './intellectual-property/copyright-assignment-generator';
import { TrademarkLicenseGenerator } from './intellectual-property/trademark-license-generator';
import { PatentLicensingGenerator } from './intellectual-property/patent-licensing-generator';

// Corporate Governance generators
import { ArticlesOfAssociationGenerator } from './corporate/articles-of-association-generator';
import { ShareholderAgreementGenerator } from './corporate/shareholder-agreement-generator';
import { BoardResolutionGenerator } from './corporate/board-resolution-generator';

// Litigation & Dispute Resolution generators
import { SettlementAgreementGenerator } from './litigation/settlement-agreement-generator';

// Document category mapping
export const DOCUMENT_CATEGORIES: Record<DocumentType, DocumentCategory> = {
  // Original documents
  [DocumentType.EMPLOYMENT_CONTRACT]: DocumentCategory.EMPLOYMENT_HR,
  [DocumentType.SERVICE_AGREEMENT]: DocumentCategory.BUSINESS_COMMERCIAL,
  [DocumentType.LEASE_AGREEMENT]: DocumentCategory.PROPERTY_REAL_ESTATE,
  
  // Business & Commercial Contracts
  [DocumentType.SALES_PURCHASE_AGREEMENT]: DocumentCategory.BUSINESS_COMMERCIAL,
  [DocumentType.DISTRIBUTION_AGREEMENT]: DocumentCategory.BUSINESS_COMMERCIAL,
  [DocumentType.PARTNERSHIP_AGREEMENT]: DocumentCategory.BUSINESS_COMMERCIAL,
  
  // Employment & HR Documents
  [DocumentType.ENHANCED_EMPLOYMENT_CONTRACT]: DocumentCategory.EMPLOYMENT_HR,
  [DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT]: DocumentCategory.EMPLOYMENT_HR,
  [DocumentType.NON_COMPETE_AGREEMENT]: DocumentCategory.EMPLOYMENT_HR,
  
  // Property & Real Estate
  [DocumentType.ENHANCED_LEASE_AGREEMENT]: DocumentCategory.PROPERTY_REAL_ESTATE,
  [DocumentType.SALE_OF_LAND_AGREEMENT]: DocumentCategory.PROPERTY_REAL_ESTATE,
  [DocumentType.PROPERTY_MANAGEMENT_AGREEMENT]: DocumentCategory.PROPERTY_REAL_ESTATE,
  
  // Family Law Documents
  [DocumentType.PRENUPTIAL_AGREEMENT]: DocumentCategory.FAMILY_LAW,
  [DocumentType.POSTNUPTIAL_AGREEMENT]: DocumentCategory.FAMILY_LAW,
  [DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT]: DocumentCategory.FAMILY_LAW,
  
  // Intellectual Property
  [DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT]: DocumentCategory.INTELLECTUAL_PROPERTY,
  [DocumentType.TRADEMARK_LICENSE_AGREEMENT]: DocumentCategory.INTELLECTUAL_PROPERTY,
  [DocumentType.PATENT_LICENSING_AGREEMENT]: DocumentCategory.INTELLECTUAL_PROPERTY,
  
  // Corporate Governance
  [DocumentType.ARTICLES_OF_ASSOCIATION]: DocumentCategory.CORPORATE_GOVERNANCE,
  [DocumentType.SHAREHOLDER_AGREEMENT]: DocumentCategory.CORPORATE_GOVERNANCE,
  [DocumentType.BOARD_RESOLUTION]: DocumentCategory.CORPORATE_GOVERNANCE,
  
  // Litigation & Dispute Resolution
  [DocumentType.SETTLEMENT_AGREEMENT]: DocumentCategory.LITIGATION_DISPUTE,
  [DocumentType.ARBITRATION_AGREEMENT]: DocumentCategory.LITIGATION_DISPUTE,
  [DocumentType.MEDIATION_AGREEMENT]: DocumentCategory.LITIGATION_DISPUTE,
  
  // Regulatory & Compliance
  [DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT]: DocumentCategory.REGULATORY_COMPLIANCE,
  [DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE]: DocumentCategory.REGULATORY_COMPLIANCE,
  [DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT]: DocumentCategory.REGULATORY_COMPLIANCE
};

// Document generator registry
export class DocumentGeneratorRegistry {
  private generators: Map<DocumentType, BaseDocumentGenerator> = new Map();

  constructor() {
    this.registerGenerators();
  }

  private registerGenerators() {
    // Business generators
    this.generators.set(DocumentType.SALES_PURCHASE_AGREEMENT, new SalesPurchaseGenerator());
    this.generators.set(DocumentType.DISTRIBUTION_AGREEMENT, new DistributionAgreementGenerator());
    this.generators.set(DocumentType.PARTNERSHIP_AGREEMENT, new PartnershipAgreementGenerator());
    this.generators.set(DocumentType.SERVICE_AGREEMENT, new ServiceAgreementGenerator());
    
    // Employment generators
    this.generators.set(DocumentType.EMPLOYMENT_CONTRACT, new EnhancedEmploymentContractGenerator());
    this.generators.set(DocumentType.ENHANCED_EMPLOYMENT_CONTRACT, new EnhancedEmploymentContractGenerator());
    this.generators.set(DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT, new IndependentContractorGenerator());
    this.generators.set(DocumentType.NON_COMPETE_AGREEMENT, new NonCompeteGenerator());
    
    // Property generators
    this.generators.set(DocumentType.ENHANCED_LEASE_AGREEMENT, new EnhancedLeaseGenerator());
    this.generators.set(DocumentType.SALE_OF_LAND_AGREEMENT, new SaleOfLandGenerator());
    this.generators.set(DocumentType.PROPERTY_MANAGEMENT_AGREEMENT, new PropertyManagementGenerator());
    
    // Family Law generators
    this.generators.set(DocumentType.PRENUPTIAL_AGREEMENT, new PrenuptialGenerator());
    this.generators.set(DocumentType.POSTNUPTIAL_AGREEMENT, new PostnuptialGenerator());
    this.generators.set(DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT, new ChildCustodyGenerator());
    
    // Intellectual Property generators
    this.generators.set(DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT, new CopyrightAssignmentGenerator());
    this.generators.set(DocumentType.TRADEMARK_LICENSE_AGREEMENT, new TrademarkLicenseGenerator());
    this.generators.set(DocumentType.PATENT_LICENSING_AGREEMENT, new PatentLicensingGenerator());
    
    // Corporate Governance generators
    this.generators.set(DocumentType.ARTICLES_OF_ASSOCIATION, new ArticlesOfAssociationGenerator());
    this.generators.set(DocumentType.SHAREHOLDER_AGREEMENT, new ShareholderAgreementGenerator());
    this.generators.set(DocumentType.BOARD_RESOLUTION, new BoardResolutionGenerator());
    
    // Litigation & Dispute Resolution generators
    this.generators.set(DocumentType.SETTLEMENT_AGREEMENT, new SettlementAgreementGenerator());
  }

  getGenerator(documentType: DocumentType): BaseDocumentGenerator | null {
    return this.generators.get(documentType) || null;
  }

  isDocumentTypeSupported(documentType: DocumentType): boolean {
    return this.generators.has(documentType);
  }

  getSupportedDocumentTypes(): DocumentType[] {
    return Array.from(this.generators.keys());
  }

  getDocumentCategory(documentType: DocumentType): DocumentCategory {
    return DOCUMENT_CATEGORIES[documentType];
  }

  async generateDocument(
    documentType: DocumentType,
    userInput: DocumentUserInput,
    generatedContent: any,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    const generator = this.getGenerator(documentType);
    if (!generator) {
      throw new Error(`No generator found for document type: ${documentType}`);
    }

    return generator.generateDocument(userInput, generatedContent, formats);
  }
}

// Export singleton instance
export const documentGeneratorRegistry = new DocumentGeneratorRegistry();