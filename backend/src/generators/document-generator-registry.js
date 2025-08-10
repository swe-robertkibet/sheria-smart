"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentGeneratorRegistry = exports.DocumentGeneratorRegistry = exports.DOCUMENT_CATEGORIES = void 0;
const document_1 = require("../types/document");
// Business generators
const sales_purchase_generator_1 = require("./business/sales-purchase-generator");
const distribution_agreement_generator_1 = require("./business/distribution-agreement-generator");
const partnership_agreement_generator_1 = require("./business/partnership-agreement-generator");
// Employment generators
const enhanced_employment_generator_1 = require("./employment/enhanced-employment-generator");
const independent_contractor_generator_1 = require("./employment/independent-contractor-generator");
// Document category mapping
exports.DOCUMENT_CATEGORIES = {
    // Original documents
    [document_1.DocumentType.NDA]: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
    [document_1.DocumentType.EMPLOYMENT_CONTRACT]: document_1.DocumentCategory.EMPLOYMENT_HR,
    [document_1.DocumentType.SERVICE_AGREEMENT]: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
    [document_1.DocumentType.LEASE_AGREEMENT]: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
    // Business & Commercial Contracts
    [document_1.DocumentType.SALES_PURCHASE_AGREEMENT]: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
    [document_1.DocumentType.DISTRIBUTION_AGREEMENT]: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
    [document_1.DocumentType.PARTNERSHIP_AGREEMENT]: document_1.DocumentCategory.BUSINESS_COMMERCIAL,
    // Employment & HR Documents
    [document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT]: document_1.DocumentCategory.EMPLOYMENT_HR,
    [document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT]: document_1.DocumentCategory.EMPLOYMENT_HR,
    [document_1.DocumentType.NON_COMPETE_AGREEMENT]: document_1.DocumentCategory.EMPLOYMENT_HR,
    // Property & Real Estate
    [document_1.DocumentType.ENHANCED_LEASE_AGREEMENT]: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
    [document_1.DocumentType.SALE_OF_LAND_AGREEMENT]: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
    [document_1.DocumentType.PROPERTY_MANAGEMENT_AGREEMENT]: document_1.DocumentCategory.PROPERTY_REAL_ESTATE,
    // Family Law Documents
    [document_1.DocumentType.PRENUPTIAL_AGREEMENT]: document_1.DocumentCategory.FAMILY_LAW,
    [document_1.DocumentType.POSTNUPTIAL_AGREEMENT]: document_1.DocumentCategory.FAMILY_LAW,
    [document_1.DocumentType.CHILD_CUSTODY_SUPPORT_AGREEMENT]: document_1.DocumentCategory.FAMILY_LAW,
    // Intellectual Property
    [document_1.DocumentType.COPYRIGHT_ASSIGNMENT_AGREEMENT]: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
    [document_1.DocumentType.TRADEMARK_LICENSE_AGREEMENT]: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
    [document_1.DocumentType.PATENT_LICENSING_AGREEMENT]: document_1.DocumentCategory.INTELLECTUAL_PROPERTY,
    // Corporate Governance
    [document_1.DocumentType.ARTICLES_OF_ASSOCIATION]: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
    [document_1.DocumentType.SHAREHOLDER_AGREEMENT]: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
    [document_1.DocumentType.BOARD_RESOLUTION]: document_1.DocumentCategory.CORPORATE_GOVERNANCE,
    // Litigation & Dispute Resolution
    [document_1.DocumentType.SETTLEMENT_AGREEMENT]: document_1.DocumentCategory.LITIGATION_DISPUTE,
    [document_1.DocumentType.ARBITRATION_AGREEMENT]: document_1.DocumentCategory.LITIGATION_DISPUTE,
    [document_1.DocumentType.MEDIATION_AGREEMENT]: document_1.DocumentCategory.LITIGATION_DISPUTE,
    // Regulatory & Compliance
    [document_1.DocumentType.DATA_PROTECTION_COMPLIANCE_AGREEMENT]: document_1.DocumentCategory.REGULATORY_COMPLIANCE,
    [document_1.DocumentType.ANTI_MONEY_LAUNDERING_COMPLIANCE]: document_1.DocumentCategory.REGULATORY_COMPLIANCE,
    [document_1.DocumentType.ENVIRONMENTAL_COMPLIANCE_AGREEMENT]: document_1.DocumentCategory.REGULATORY_COMPLIANCE
};
// Document generator registry
class DocumentGeneratorRegistry {
    constructor() {
        this.generators = new Map();
        this.registerGenerators();
    }
    registerGenerators() {
        // Business generators
        this.generators.set(document_1.DocumentType.SALES_PURCHASE_AGREEMENT, new sales_purchase_generator_1.SalesPurchaseGenerator());
        this.generators.set(document_1.DocumentType.DISTRIBUTION_AGREEMENT, new distribution_agreement_generator_1.DistributionAgreementGenerator());
        this.generators.set(document_1.DocumentType.PARTNERSHIP_AGREEMENT, new partnership_agreement_generator_1.PartnershipAgreementGenerator());
        // Employment generators
        this.generators.set(document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT, new enhanced_employment_generator_1.EnhancedEmploymentContractGenerator());
        this.generators.set(document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT, new independent_contractor_generator_1.IndependentContractorGenerator());
    }
    getGenerator(documentType) {
        return this.generators.get(documentType) || null;
    }
    isDocumentTypeSupported(documentType) {
        return this.generators.has(documentType);
    }
    getSupportedDocumentTypes() {
        return Array.from(this.generators.keys());
    }
    getDocumentCategory(documentType) {
        return exports.DOCUMENT_CATEGORIES[documentType];
    }
    generateDocument(documentType, userInput, generatedContent, formats) {
        return __awaiter(this, void 0, void 0, function* () {
            const generator = this.getGenerator(documentType);
            if (!generator) {
                throw new Error(`No generator found for document type: ${documentType}`);
            }
            return generator.generateDocument(userInput, generatedContent, formats);
        });
    }
}
exports.DocumentGeneratorRegistry = DocumentGeneratorRegistry;
// Export singleton instance
exports.documentGeneratorRegistry = new DocumentGeneratorRegistry();
