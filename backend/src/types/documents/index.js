"use strict";
// Export all document type interfaces
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Business & Commercial
__exportStar(require("./business/sales-purchase"), exports);
__exportStar(require("./business/distribution-agreement"), exports);
__exportStar(require("./business/partnership-agreement"), exports);
// Employment & HR
__exportStar(require("./employment/enhanced-employment-contract"), exports);
__exportStar(require("./employment/independent-contractor"), exports);
__exportStar(require("./employment/non-compete"), exports);
// Property & Real Estate
__exportStar(require("./property/enhanced-lease"), exports);
__exportStar(require("./property/sale-of-land"), exports);
__exportStar(require("./property/property-management"), exports);
