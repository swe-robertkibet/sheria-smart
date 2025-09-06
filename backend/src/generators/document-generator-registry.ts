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
import { ArbitrationAgreementGenerator } from './litigation/arbitration-agreement-generator';
import { MediationAgreementGenerator } from './litigation/mediation-agreement-generator';

// Regulatory & Compliance generators
import { DataProtectionComplianceGenerator } from './compliance/data-protection-compliance-generator';
import { AntiMoneyLaunderingGenerator } from './compliance/anti-money-laundering-generator';
import { EnvironmentalComplianceGenerator } from './compliance/environmental-compliance-generator';

// Document category mapping
export const DOCUMENT_CATEGORIES: Record<DocumentType, DocumentCategory> = {
  // Original documents
  [DocumentType.SERVICE_AGREEMENT]: DocumentCategory.BUSINESS_COMMERCIAL,
  
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
  private generatorFactories: Map<DocumentType, () => BaseDocumentGenerator> = new Map();
  private lastUsed: Map<DocumentType, number> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly GENERATOR_TTL = 10 * 60 * 1000; // 10 minutes

  constructor() {
    console.log('🔧 Initializing DocumentGeneratorRegistry with lazy loading');
    this.registerGeneratorFactories();
    this.startCleanupTimer();
    console.log('✅ DocumentGeneratorRegistry initialized with lazy loading');
  }

  /**
   * Register generator factories instead of creating instances immediately
   * This reduces startup memory usage from 22 instances to 0
   */
  private registerGeneratorFactories() {
    console.log('📝 Registering generator factories (lazy instantiation)');
    
    // Business generators
    this.generatorFactories.set(DocumentType.SALES_PURCHASE_AGREEMENT, () => new SalesPurchaseGenerator());
    this.generatorFactories.set(DocumentType.DISTRIBUTION_AGREEMENT, () => new DistributionAgreementGenerator());
    this.generatorFactories.set(DocumentType.PARTNERSHIP_AGREEMENT, () => new PartnershipAgreementGenerator());
    this.generatorFactories.set(DocumentType.SERVICE_AGREEMENT, () => new ServiceAgreementGenerator());
    
    // Employment generators
    this.generatorFactories.set(DocumentType.ENHANCED_EMPLOYMENT_CONTRACT, () => new EnhancedEmploymentContractGenerator());
    this.generatorFactories.set(DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT, () => new IndependentContractorGenerator());
    this.generatorFactories.set(DocumentType.NON_COMPETE_AGREEMENT, () => new NonCompeteGenerator());
    
    // Property generators
    this.generatorFactories.set(DocumentType.ENHANCED_LEASE_AGREEMENT, () => new EnhancedLeaseGenerator());
    this.generatorFactories.set(DocumentType.SALE_OF_LAND_AGREEMENT, () => new SaleOfLandGenerator());
    this.generatorFactories.set(DocumentType.PROPERTY_MANAGEMENT_AGREEMENT, () => new PropertyManagementGenerator());
    
    // Family Law generators
    this.generatorFactories.set(DocumentType.PRENUPTIAL_AGREEMENT, () => new PrenuptialGenerator());
    this.generatorFactories.set(DocumentType.POSTNUPTIAL_AGREEMENT, () => new PostnuptialGenerator());
    this.generatorFactories.set(DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT, () => new ChildCustodyGenerator());
    
    // Intellectual Property generators
    this.generatorFactories.set(DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT, () => new CopyrightAssignmentGenerator());
    this.generatorFactories.set(DocumentType.TRADEMARK_LICENSE_AGREEMENT, () => new TrademarkLicenseGenerator());
    this.generatorFactories.set(DocumentType.PATENT_LICENSING_AGREEMENT, () => new PatentLicensingGenerator());
    
    // Corporate Governance generators
    this.generatorFactories.set(DocumentType.ARTICLES_OF_ASSOCIATION, () => new ArticlesOfAssociationGenerator());
    this.generatorFactories.set(DocumentType.SHAREHOLDER_AGREEMENT, () => new ShareholderAgreementGenerator());
    this.generatorFactories.set(DocumentType.BOARD_RESOLUTION, () => new BoardResolutionGenerator());
    
    // Litigation & Dispute Resolution generators
    this.generatorFactories.set(DocumentType.SETTLEMENT_AGREEMENT, () => new SettlementAgreementGenerator());
    this.generatorFactories.set(DocumentType.ARBITRATION_AGREEMENT, () => new ArbitrationAgreementGenerator());
    this.generatorFactories.set(DocumentType.MEDIATION_AGREEMENT, () => new MediationAgreementGenerator());
    
    // Regulatory & Compliance generators
    this.generatorFactories.set(DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT, () => new DataProtectionComplianceGenerator());
    this.generatorFactories.set(DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE, () => new AntiMoneyLaunderingGenerator());
    this.generatorFactories.set(DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT, () => new EnvironmentalComplianceGenerator());

    console.log(`📋 Registered ${this.generatorFactories.size} generator factories`);
  }

  /**
   * Start cleanup timer to remove unused generators
   */
  private startCleanupTimer() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupUnusedGenerators();
    }, this.CLEANUP_INTERVAL);

    console.log('🕐 Started generator cleanup timer');
  }

  /**
   * Clean up generators that haven't been used recently
   */
  private cleanupUnusedGenerators() {
    const now = Date.now();
    const beforeCount = this.generators.size;
    
    for (const [docType, lastUsedTime] of this.lastUsed.entries()) {
      if (now - lastUsedTime > this.GENERATOR_TTL) {
        this.generators.delete(docType);
        this.lastUsed.delete(docType);
      }
    }

    const afterCount = this.generators.size;
    if (beforeCount > afterCount) {
      console.log(`🧹 Cleaned up ${beforeCount - afterCount} unused generators (${afterCount} remaining active)`);
    }
  }

  /**
   * Get generator instance, creating it lazily if needed
   */
  getGenerator(documentType: DocumentType): BaseDocumentGenerator | null {
    // Check if we already have an active generator
    if (this.generators.has(documentType)) {
      this.lastUsed.set(documentType, Date.now());
      return this.generators.get(documentType) || null;
    }

    // Create new generator if we have a factory for it
    const factory = this.generatorFactories.get(documentType);
    if (!factory) {
      return null;
    }

    console.log(`🔨 Creating new generator for ${documentType} (lazy instantiation)`);
    const generator = factory();
    this.generators.set(documentType, generator);
    this.lastUsed.set(documentType, Date.now());
    
    return generator;
  }

  isDocumentTypeSupported(documentType: DocumentType): boolean {
    return this.generatorFactories.has(documentType);
  }

  getSupportedDocumentTypes(): DocumentType[] {
    return Array.from(this.generatorFactories.keys());
  }

  /**
   * Get current status for monitoring
   */
  getStatus(): {
    activeGenerators: number;
    registeredTypes: number;
    lastCleanup: string;
  } {
    return {
      activeGenerators: this.generators.size,
      registeredTypes: this.generatorFactories.size,
      lastCleanup: new Date().toISOString()
    };
  }

  /**
   * Manual cleanup method for testing or forced cleanup
   */
  forceCleanup(): void {
    this.cleanupUnusedGenerators();
  }

  /**
   * Cleanup on shutdown
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🛑 Generator cleanup timer stopped');
    }
    
    this.generators.clear();
    this.lastUsed.clear();
    console.log('🧹 All generators cleaned up on shutdown');
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