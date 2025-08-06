"use strict";
// Document generation types and interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = exports.DocumentFormat = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["NDA"] = "NDA";
    DocumentType["EMPLOYMENT_CONTRACT"] = "EMPLOYMENT_CONTRACT";
    DocumentType["SERVICE_AGREEMENT"] = "SERVICE_AGREEMENT";
    DocumentType["LEASE_AGREEMENT"] = "LEASE_AGREEMENT";
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
