"use strict";
// TypeScript interfaces for structured legal responses
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = exports.UrgencyLevel = exports.LegalArea = void 0;
var LegalArea;
(function (LegalArea) {
    LegalArea["CONTRACT_LAW"] = "Contract Law";
    LegalArea["EMPLOYMENT_LAW"] = "Employment Law";
    LegalArea["PROPERTY_LAW"] = "Property Law";
    LegalArea["FAMILY_LAW"] = "Family Law";
    LegalArea["CRIMINAL_LAW"] = "Criminal Law";
    LegalArea["BUSINESS_LAW"] = "Business Law";
    LegalArea["CONSUMER_PROTECTION"] = "Consumer Protection";
    LegalArea["TENANCY_LAW"] = "Tenancy Law";
    LegalArea["CONSTITUTIONAL_LAW"] = "Constitutional Law";
    LegalArea["CIVIL_PROCEDURE"] = "Civil Procedure";
    LegalArea["OTHER"] = "Other";
})(LegalArea || (exports.LegalArea = LegalArea = {}));
var UrgencyLevel;
(function (UrgencyLevel) {
    UrgencyLevel["LOW"] = "low";
    UrgencyLevel["MEDIUM"] = "medium";
    UrgencyLevel["HIGH"] = "high";
    UrgencyLevel["URGENT"] = "urgent";
})(UrgencyLevel || (exports.UrgencyLevel = UrgencyLevel = {}));
var ActionType;
(function (ActionType) {
    ActionType["CONSULT_LAWYER"] = "consult_lawyer";
    ActionType["GATHER_DOCUMENTS"] = "gather_documents";
    ActionType["FILE_COMPLAINT"] = "file_complaint";
    ActionType["NEGOTIATE"] = "negotiate";
    ActionType["MEDIATION"] = "mediation";
    ActionType["COURT_PROCEEDINGS"] = "court_proceedings";
    ActionType["DOCUMENTATION"] = "documentation";
    ActionType["COMPLIANCE"] = "compliance";
})(ActionType || (exports.ActionType = ActionType = {}));
