"use strict";
// Document generation types and interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.DocumentFormat = exports.DocumentType = exports.DocumentCategory = void 0;
var DocumentCategory;
(function (DocumentCategory) {
    DocumentCategory["BUSINESS_COMMERCIAL"] = "BUSINESS_COMMERCIAL";
    DocumentCategory["EMPLOYMENT_HR"] = "EMPLOYMENT_HR";
    DocumentCategory["PROPERTY_REAL_ESTATE"] = "PROPERTY_REAL_ESTATE";
    DocumentCategory["FAMILY_LAW"] = "FAMILY_LAW";
    DocumentCategory["INTELLECTUAL_PROPERTY"] = "INTELLECTUAL_PROPERTY";
    DocumentCategory["CORPORATE_GOVERNANCE"] = "CORPORATE_GOVERNANCE";
    DocumentCategory["LITIGATION_DISPUTE"] = "LITIGATION_DISPUTE";
    DocumentCategory["REGULATORY_COMPLIANCE"] = "REGULATORY_COMPLIANCE";
})(DocumentCategory || (exports.DocumentCategory = DocumentCategory = {}));
var DocumentType;
(function (DocumentType) {
    // Original
    DocumentType["NDA"] = "NDA";
    DocumentType["EMPLOYMENT_CONTRACT"] = "EMPLOYMENT_CONTRACT";
    DocumentType["SERVICE_AGREEMENT"] = "SERVICE_AGREEMENT";
    DocumentType["LEASE_AGREEMENT"] = "LEASE_AGREEMENT";
    // Business & Commercial Contracts
    DocumentType["SALES_PURCHASE_AGREEMENT"] = "SALES_PURCHASE_AGREEMENT";
    DocumentType["DISTRIBUTION_AGREEMENT"] = "DISTRIBUTION_AGREEMENT";
    DocumentType["PARTNERSHIP_AGREEMENT"] = "PARTNERSHIP_AGREEMENT";
    // Employment & HR Documents
    DocumentType["ENHANCED_EMPLOYMENT_CONTRACT"] = "ENHANCED_EMPLOYMENT_CONTRACT";
    DocumentType["INDEPENDENT_CONTRACTOR_AGREEMENT"] = "INDEPENDENT_CONTRACTOR_AGREEMENT";
    DocumentType["NON_COMPETE_AGREEMENT"] = "NON_COMPETE_AGREEMENT";
    // Property & Real Estate
    DocumentType["ENHANCED_LEASE_AGREEMENT"] = "ENHANCED_LEASE_AGREEMENT";
    DocumentType["SALE_OF_LAND_AGREEMENT"] = "SALE_OF_LAND_AGREEMENT";
    DocumentType["PROPERTY_MANAGEMENT_AGREEMENT"] = "PROPERTY_MANAGEMENT_AGREEMENT";
    // Family Law Documents
    DocumentType["PRENUPTIAL_AGREEMENT"] = "PRENUPTIAL_AGREEMENT";
    DocumentType["POSTNUPTIAL_AGREEMENT"] = "POSTNUPTIAL_AGREEMENT";
    DocumentType["CHILD_CUSTODY_SUPPORT_AGREEMENT"] = "CHILD_CUSTODY_SUPPORT_AGREEMENT";
    // Intellectual Property
    DocumentType["COPYRIGHT_ASSIGNMENT_AGREEMENT"] = "COPYRIGHT_ASSIGNMENT_AGREEMENT";
    DocumentType["TRADEMARK_LICENSE_AGREEMENT"] = "TRADEMARK_LICENSE_AGREEMENT";
    DocumentType["PATENT_LICENSING_AGREEMENT"] = "PATENT_LICENSING_AGREEMENT";
    // Corporate Governance
    DocumentType["ARTICLES_OF_ASSOCIATION"] = "ARTICLES_OF_ASSOCIATION";
    DocumentType["SHAREHOLDER_AGREEMENT"] = "SHAREHOLDER_AGREEMENT";
    DocumentType["BOARD_RESOLUTION"] = "BOARD_RESOLUTION";
    // Litigation & Dispute Resolution
    DocumentType["SETTLEMENT_AGREEMENT"] = "SETTLEMENT_AGREEMENT";
    DocumentType["ARBITRATION_AGREEMENT"] = "ARBITRATION_AGREEMENT";
    DocumentType["MEDIATION_AGREEMENT"] = "MEDIATION_AGREEMENT";
    // Regulatory & Compliance
    DocumentType["DATA_PROTECTION_COMPLIANCE_AGREEMENT"] = "DATA_PROTECTION_COMPLIANCE_AGREEMENT";
    DocumentType["ANTI_MONEY_LAUNDERING_COMPLIANCE"] = "ANTI_MONEY_LAUNDERING_COMPLIANCE";
    DocumentType["ENVIRONMENTAL_COMPLIANCE_AGREEMENT"] = "ENVIRONMENTAL_COMPLIANCE_AGREEMENT";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentFormat;
(function (DocumentFormat) {
    DocumentFormat["PDF"] = "pdf";
    DocumentFormat["DOCX"] = "docx";
})(DocumentFormat || (exports.DocumentFormat = DocumentFormat = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["PROCESSING"] = "PROCESSING";
    RequestStatus["COMPLETED"] = "COMPLETED";
    RequestStatus["FAILED"] = "FAILED";
    RequestStatus["EMAIL_SENT"] = "EMAIL_SENT";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
