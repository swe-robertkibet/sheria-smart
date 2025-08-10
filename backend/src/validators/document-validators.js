"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentValidators = void 0;
const document_1 = require("../types/document");
// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation regex (Kenya format)
const phoneRegex = /^(\+254|0)[17]\d{8}$/;
class DocumentValidators {
    static validateSalesPurchaseInput(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const errors = [];
        // Required fields validation
        if (!((_a = input.sellerName) === null || _a === void 0 ? void 0 : _a.trim()))
            errors.push('Seller name is required');
        if (!((_b = input.sellerAddress) === null || _b === void 0 ? void 0 : _b.trim()))
            errors.push('Seller address is required');
        if (!((_c = input.sellerEmail) === null || _c === void 0 ? void 0 : _c.trim()))
            errors.push('Seller email is required');
        if (!((_d = input.buyerName) === null || _d === void 0 ? void 0 : _d.trim()))
            errors.push('Buyer name is required');
        if (!((_e = input.buyerAddress) === null || _e === void 0 ? void 0 : _e.trim()))
            errors.push('Buyer address is required');
        if (!((_f = input.buyerEmail) === null || _f === void 0 ? void 0 : _f.trim()))
            errors.push('Buyer email is required');
        if (!((_g = input.goodsServicesDescription) === null || _g === void 0 ? void 0 : _g.trim()))
            errors.push('Goods/services description is required');
        if (!((_h = input.purchasePrice) === null || _h === void 0 ? void 0 : _h.trim()))
            errors.push('Purchase price is required');
        if (!((_j = input.paymentTerms) === null || _j === void 0 ? void 0 : _j.trim()))
            errors.push('Payment terms are required');
        if (!((_k = input.deliveryTerms) === null || _k === void 0 ? void 0 : _k.trim()))
            errors.push('Delivery terms are required');
        if (!((_l = input.deliveryTimeline) === null || _l === void 0 ? void 0 : _l.trim()))
            errors.push('Delivery timeline is required');
        if (!((_m = input.warrantyProvisions) === null || _m === void 0 ? void 0 : _m.trim()))
            errors.push('Warranty provisions are required');
        if (!((_o = input.effectiveDate) === null || _o === void 0 ? void 0 : _o.trim()))
            errors.push('Effective date is required');
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
    static validateDistributionAgreementInput(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const errors = [];
        // Required fields validation
        if (!((_a = input.principalName) === null || _a === void 0 ? void 0 : _a.trim()))
            errors.push('Principal name is required');
        if (!((_b = input.principalAddress) === null || _b === void 0 ? void 0 : _b.trim()))
            errors.push('Principal address is required');
        if (!((_c = input.principalEmail) === null || _c === void 0 ? void 0 : _c.trim()))
            errors.push('Principal email is required');
        if (!((_d = input.principalBusinessRegistration) === null || _d === void 0 ? void 0 : _d.trim()))
            errors.push('Principal business registration is required');
        if (!((_e = input.distributorName) === null || _e === void 0 ? void 0 : _e.trim()))
            errors.push('Distributor name is required');
        if (!((_f = input.distributorAddress) === null || _f === void 0 ? void 0 : _f.trim()))
            errors.push('Distributor address is required');
        if (!((_g = input.distributorEmail) === null || _g === void 0 ? void 0 : _g.trim()))
            errors.push('Distributor email is required');
        if (!((_h = input.distributorBusinessRegistration) === null || _h === void 0 ? void 0 : _h.trim()))
            errors.push('Distributor business registration is required');
        if (!((_j = input.territoryDefinition) === null || _j === void 0 ? void 0 : _j.trim()))
            errors.push('Territory definition is required');
        if (!((_k = input.productSpecifications) === null || _k === void 0 ? void 0 : _k.trim()))
            errors.push('Product specifications are required');
        if (!input.exclusivityType)
            errors.push('Exclusivity type is required');
        if (!((_l = input.minimumSalesTargets) === null || _l === void 0 ? void 0 : _l.trim()))
            errors.push('Minimum sales targets are required');
        if (!((_m = input.commissionStructure) === null || _m === void 0 ? void 0 : _m.trim()))
            errors.push('Commission structure is required');
        if (!((_o = input.marketingObligations) === null || _o === void 0 ? void 0 : _o.trim()))
            errors.push('Marketing obligations are required');
        if (!((_p = input.agreementTerm) === null || _p === void 0 ? void 0 : _p.trim()))
            errors.push('Agreement term is required');
        if (!((_q = input.effectiveDate) === null || _q === void 0 ? void 0 : _q.trim()))
            errors.push('Effective date is required');
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
    static validatePartnershipAgreementInput(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const errors = [];
        // Required fields validation
        if (!((_a = input.partnershipName) === null || _a === void 0 ? void 0 : _a.trim()))
            errors.push('Partnership name is required');
        if (!((_b = input.businessPurpose) === null || _b === void 0 ? void 0 : _b.trim()))
            errors.push('Business purpose is required');
        if (!input.partnershipType)
            errors.push('Partnership type is required');
        if (!((_c = input.businessAddress) === null || _c === void 0 ? void 0 : _c.trim()))
            errors.push('Business address is required');
        if (!input.partners || input.partners.length < 2)
            errors.push('At least 2 partners are required');
        if (!((_d = input.totalCapitalContribution) === null || _d === void 0 ? void 0 : _d.trim()))
            errors.push('Total capital contribution is required');
        if (!((_e = input.profitDistributionMethod) === null || _e === void 0 ? void 0 : _e.trim()))
            errors.push('Profit distribution method is required');
        if (!((_f = input.managementStructure) === null || _f === void 0 ? void 0 : _f.trim()))
            errors.push('Management structure is required');
        if (!((_g = input.decisionMakingProcess) === null || _g === void 0 ? void 0 : _g.trim()))
            errors.push('Decision making process is required');
        if (!((_h = input.partnerDutiesAndRestrictions) === null || _h === void 0 ? void 0 : _h.trim()))
            errors.push('Partner duties and restrictions are required');
        if (!((_j = input.effectiveDate) === null || _j === void 0 ? void 0 : _j.trim()))
            errors.push('Effective date is required');
        // Partnership type validation
        if (input.partnershipType && !['general', 'limited', 'limited_liability'].includes(input.partnershipType)) {
            errors.push('Partnership type must be general, limited, or limited_liability');
        }
        // Partners validation
        if (input.partners) {
            input.partners.forEach((partner, index) => {
                var _a, _b, _c, _d, _e, _f;
                if (!((_a = partner.partnerName) === null || _a === void 0 ? void 0 : _a.trim()))
                    errors.push(`Partner ${index + 1} name is required`);
                if (!((_b = partner.partnerAddress) === null || _b === void 0 ? void 0 : _b.trim()))
                    errors.push(`Partner ${index + 1} address is required`);
                if (!((_c = partner.partnerEmail) === null || _c === void 0 ? void 0 : _c.trim()))
                    errors.push(`Partner ${index + 1} email is required`);
                if (!((_d = partner.capitalContribution) === null || _d === void 0 ? void 0 : _d.trim()))
                    errors.push(`Partner ${index + 1} capital contribution is required`);
                if (!partner.contributionType)
                    errors.push(`Partner ${index + 1} contribution type is required`);
                if (!((_e = partner.profitSharePercentage) === null || _e === void 0 ? void 0 : _e.trim()))
                    errors.push(`Partner ${index + 1} profit share percentage is required`);
                if (!((_f = partner.lossSharePercentage) === null || _f === void 0 ? void 0 : _f.trim()))
                    errors.push(`Partner ${index + 1} loss share percentage is required`);
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
    static validateEnhancedEmploymentContractInput(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const errors = [];
        // Required fields validation
        if (!((_a = input.employeeName) === null || _a === void 0 ? void 0 : _a.trim()))
            errors.push('Employee name is required');
        if (!((_b = input.employeeAddress) === null || _b === void 0 ? void 0 : _b.trim()))
            errors.push('Employee address is required');
        if (!((_c = input.employeeEmail) === null || _c === void 0 ? void 0 : _c.trim()))
            errors.push('Employee email is required');
        if (!((_d = input.employeeIdNumber) === null || _d === void 0 ? void 0 : _d.trim()))
            errors.push('Employee ID number is required');
        if (!((_e = input.employerName) === null || _e === void 0 ? void 0 : _e.trim()))
            errors.push('Employer name is required');
        if (!((_f = input.employerAddress) === null || _f === void 0 ? void 0 : _f.trim()))
            errors.push('Employer address is required');
        if (!((_g = input.employerEmail) === null || _g === void 0 ? void 0 : _g.trim()))
            errors.push('Employer email is required');
        if (!((_h = input.employerBusinessRegistration) === null || _h === void 0 ? void 0 : _h.trim()))
            errors.push('Employer business registration is required');
        if (!((_j = input.jobTitle) === null || _j === void 0 ? void 0 : _j.trim()))
            errors.push('Job title is required');
        if (!((_k = input.jobDescription) === null || _k === void 0 ? void 0 : _k.trim()))
            errors.push('Job description is required');
        if (!((_l = input.department) === null || _l === void 0 ? void 0 : _l.trim()))
            errors.push('Department is required');
        if (!input.employmentType)
            errors.push('Employment type is required');
        if (!((_m = input.startDate) === null || _m === void 0 ? void 0 : _m.trim()))
            errors.push('Start date is required');
        if (!((_o = input.basicSalary) === null || _o === void 0 ? void 0 : _o.trim()))
            errors.push('Basic salary is required');
        if (!input.salaryPaymentFrequency)
            errors.push('Salary payment frequency is required');
        if (!((_p = input.benefitsPackage) === null || _p === void 0 ? void 0 : _p.trim()))
            errors.push('Benefits package is required');
        if (!((_q = input.effectiveDate) === null || _q === void 0 ? void 0 : _q.trim()))
            errors.push('Effective date is required');
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
    static validateIndependentContractorInput(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const errors = [];
        // Required fields validation
        if (!((_a = input.contractorName) === null || _a === void 0 ? void 0 : _a.trim()))
            errors.push('Contractor name is required');
        if (!((_b = input.contractorAddress) === null || _b === void 0 ? void 0 : _b.trim()))
            errors.push('Contractor address is required');
        if (!((_c = input.contractorEmail) === null || _c === void 0 ? void 0 : _c.trim()))
            errors.push('Contractor email is required');
        if (!((_d = input.clientName) === null || _d === void 0 ? void 0 : _d.trim()))
            errors.push('Client name is required');
        if (!((_e = input.clientAddress) === null || _e === void 0 ? void 0 : _e.trim()))
            errors.push('Client address is required');
        if (!((_f = input.clientEmail) === null || _f === void 0 ? void 0 : _f.trim()))
            errors.push('Client email is required');
        if (!((_g = input.clientBusinessRegistration) === null || _g === void 0 ? void 0 : _g.trim()))
            errors.push('Client business registration is required');
        if (!((_h = input.servicesDescription) === null || _h === void 0 ? void 0 : _h.trim()))
            errors.push('Services description is required');
        if (!((_j = input.projectScope) === null || _j === void 0 ? void 0 : _j.trim()))
            errors.push('Project scope is required');
        if (!input.compensationStructure)
            errors.push('Compensation structure is required');
        if (!((_k = input.paymentSchedule) === null || _k === void 0 ? void 0 : _k.trim()))
            errors.push('Payment schedule is required');
        if (!((_l = input.projectStartDate) === null || _l === void 0 ? void 0 : _l.trim()))
            errors.push('Project start date is required');
        if (!((_m = input.projectDuration) === null || _m === void 0 ? void 0 : _m.trim()))
            errors.push('Project duration is required');
        if (!((_o = input.intellectualPropertyOwnership) === null || _o === void 0 ? void 0 : _o.trim()))
            errors.push('Intellectual property ownership is required');
        if (!((_p = input.effectiveDate) === null || _p === void 0 ? void 0 : _p.trim()))
            errors.push('Effective date is required');
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
    static validateDocumentInput(documentType, userInput) {
        switch (documentType) {
            case document_1.DocumentType.SALES_PURCHASE_AGREEMENT:
                return this.validateSalesPurchaseInput(userInput);
            case document_1.DocumentType.DISTRIBUTION_AGREEMENT:
                return this.validateDistributionAgreementInput(userInput);
            case document_1.DocumentType.PARTNERSHIP_AGREEMENT:
                return this.validatePartnershipAgreementInput(userInput);
            case document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
                return this.validateEnhancedEmploymentContractInput(userInput);
            case document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
                return this.validateIndependentContractorInput(userInput);
            default:
                return {
                    isValid: true,
                    errors: []
                };
        }
    }
}
exports.DocumentValidators = DocumentValidators;
exports.default = DocumentValidators;
