"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const document_orchestrator_1 = __importDefault(require("../services/document-orchestrator"));
const document_catalog_1 = __importDefault(require("../services/document-catalog"));
const document_1 = require("../types/document");
const router = express_1.default.Router();
// Get available document types
router.get('/types', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentTypes = document_catalog_1.default.getAllDocumentTypes();
        res.json({ documentTypes });
    }
    catch (error) {
        console.error('Error fetching document types:', error);
        res.status(500).json({ error: 'Failed to fetch document types' });
    }
}));
// Get document categories with grouped document types
router.get('/categories', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = document_catalog_1.default.getAllCategories();
        res.json({ categories });
    }
    catch (error) {
        console.error('Error fetching document categories:', error);
        res.status(500).json({ error: 'Failed to fetch document categories' });
    }
}));
// Generate a document
router.post('/generate', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { documentType, userInput, backstory, formats } = req.body;
        // SECURITY: Use authenticated user's email ONLY - never trust frontend email input
        const emailAddress = req.user.email;
        // CRITICAL: Validate email address is available before proceeding
        if (!emailAddress || typeof emailAddress !== 'string' || emailAddress.trim() === '') {
            console.error('❌ SECURITY: User email missing or invalid:', {
                userId: req.user.userId,
                emailAddress: emailAddress,
                userObject: req.user
            });
            return res.status(400).json({
                error: 'User email not available',
                message: 'Your account does not have an email address associated with it. Please contact support or try logging in again.',
                code: 'EMAIL_MISSING'
            });
        }
        console.log('🔍 DEBUG: Full req.user object:', JSON.stringify(req.user, null, 2));
        console.log('🔍 DEBUG: req.user exists:', !!req.user);
        console.log('🔍 DEBUG: req.user.email:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.email);
        console.log('🔍 DEBUG: typeof req.user.email:', typeof ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email));
        console.log('🔍 DEBUG: emailAddress variable:', emailAddress);
        console.log('✅ SECURITY VALIDATED: Document will be sent to authenticated user email:', emailAddress);
        console.log('Document generation request:', {
            documentType,
            formats,
            userId: req.user.userId,
            emailAddress: emailAddress, // This is the correct value being passed to document orchestrator
            userEmail: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email,
            hasUserEmail: !!((_d = req.user) === null || _d === void 0 ? void 0 : _d.email)
        });
        // Validate required fields
        if (!documentType || !userInput || !backstory || !formats) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['documentType', 'userInput', 'backstory', 'formats']
            });
        }
        // Validate document type
        if (!Object.values(document_1.DocumentType).includes(documentType)) {
            return res.status(400).json({
                error: 'Invalid document type',
                validTypes: Object.values(document_1.DocumentType)
            });
        }
        // Validate formats
        if (!Array.isArray(formats) || formats.length === 0) {
            return res.status(400).json({
                error: 'At least one format must be specified',
                validFormats: Object.values(document_1.DocumentFormat)
            });
        }
        for (const format of formats) {
            if (!Object.values(document_1.DocumentFormat).includes(format)) {
                return res.status(400).json({
                    error: `Invalid format: ${format}`,
                    validFormats: Object.values(document_1.DocumentFormat)
                });
            }
        }
        // Email validation not needed - authenticated user's email is already validated during OAuth
        // Check if the document type is supported by either legacy or new generator
        const supportedTypes = [
            document_1.DocumentType.NDA,
            document_1.DocumentType.SALES_PURCHASE_AGREEMENT,
            document_1.DocumentType.DISTRIBUTION_AGREEMENT,
            document_1.DocumentType.PARTNERSHIP_AGREEMENT,
            document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT,
            document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT
        ];
        if (!supportedTypes.includes(documentType)) {
            return res.status(400).json({
                error: `Document type ${documentType} is not yet supported`,
                supportedTypes
            });
        }
        // Create generation request
        const generationRequest = {
            userId: req.user.userId,
            documentType,
            userInput,
            backstory,
            formats,
            emailAddress
        };
        // Start document generation (async process)
        const response = yield document_orchestrator_1.default.generateDocument(generationRequest);
        res.json(response);
    }
    catch (error) {
        console.error('Error generating document:', error);
        res.status(500).json({
            error: 'Failed to generate document',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get document request status
router.get('/requests/:requestId', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { requestId } = req.params;
        const documentRequest = yield document_orchestrator_1.default.getDocumentRequest(requestId, req.user.userId);
        if (!documentRequest) {
            return res.status(404).json({ error: 'Document request not found' });
        }
        res.json({
            id: documentRequest.id,
            documentType: documentRequest.documentType,
            status: documentRequest.status,
            emailSent: documentRequest.emailSent,
            createdAt: documentRequest.createdAt,
            updatedAt: documentRequest.updatedAt
        });
    }
    catch (error) {
        console.error('Error fetching document request:', error);
        res.status(500).json({ error: 'Failed to fetch document request' });
    }
}));
// Get user's document requests history
router.get('/requests', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { limit = '20', cursor } = req.query;
        const requests = yield document_orchestrator_1.default.getUserDocumentRequests(req.user.userId, parseInt(limit), cursor);
        res.json({
            requests,
            hasMore: requests.length === parseInt(limit),
            nextCursor: requests.length > 0 ? requests[requests.length - 1].createdAt.toISOString() : null
        });
    }
    catch (error) {
        console.error('Error fetching document requests:', error);
        res.status(500).json({ error: 'Failed to fetch document requests' });
    }
}));
// Validate NDA input (helper endpoint for frontend)
router.post('/validate-nda', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { userInput } = req.body;
        if (!userInput) {
            return res.status(400).json({ error: 'userInput is required' });
        }
        // Import the service here to avoid circular dependencies
        const { default: DocumentAIService } = yield Promise.resolve().then(() => __importStar(require('../services/document-ai')));
        const validation = yield DocumentAIService.validateNDAInput(userInput);
        res.json(validation);
    }
    catch (error) {
        console.error('Error validating NDA input:', error);
        res.status(500).json({ error: 'Failed to validate NDA input' });
    }
}));
// Test email configuration (admin endpoint)
router.post('/test-email', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email address is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address format' });
        }
        // Import the service here to avoid circular dependencies
        const { default: EmailService } = yield Promise.resolve().then(() => __importStar(require('../services/email-service')));
        const success = yield EmailService.sendTestEmail(email);
        if (success) {
            res.json({ success: true, message: 'Test email sent successfully' });
        }
        else {
            res.status(500).json({ success: false, message: 'Failed to send test email' });
        }
    }
    catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ error: 'Failed to send test email' });
    }
}));
// Health check for document service
router.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if required services are available
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                documentGenerator: true,
                emailService: false, // Will be updated based on actual check
                database: true
            }
        };
        // Test email service
        try {
            const { default: EmailService } = yield Promise.resolve().then(() => __importStar(require('../services/email-service')));
            health.services.emailService = yield EmailService.testEmailConfiguration();
        }
        catch (error) {
            health.services.emailService = false;
        }
        const overallStatus = Object.values(health.services).every(status => status === true) ? 'healthy' : 'degraded';
        health.status = overallStatus;
        res.status(overallStatus === 'healthy' ? 200 : 503).json(health);
    }
    catch (error) {
        console.error('Error checking document service health:', error);
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
}));
exports.default = router;
