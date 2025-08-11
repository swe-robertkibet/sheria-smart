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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentOrchestrator = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const document_1 = require("../types/document");
const document_generator_1 = __importDefault(require("./document-generator"));
const document_ai_1 = __importDefault(require("./document-ai"));
const email_service_1 = __importDefault(require("./email-service"));
const document_validators_1 = __importDefault(require("../validators/document-validators"));
const prisma = new client_1.PrismaClient();
class DocumentOrchestrator {
    constructor() {
        // Service instances are imported as singletons
    }
    generateDocument(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let documentRequestId = null;
            try {
                console.log('Starting document generation process:', {
                    documentType: request.documentType,
                    formats: request.formats,
                    userId: request.userId
                });
                // Create database record for tracking
                const documentRequest = yield prisma.documentRequest.create({
                    data: {
                        userId: request.userId,
                        documentType: request.documentType,
                        userInput: JSON.stringify(request.userInput),
                        backstory: request.backstory,
                        formats: JSON.stringify(request.formats),
                        emailAddress: request.emailAddress,
                        status: document_1.RequestStatus.PROCESSING
                    }
                });
                documentRequestId = documentRequest.id;
                // Validate user input
                if (request.documentType === document_1.DocumentType.NDA) {
                    const validation = yield document_ai_1.default.validateNDAInput(request.userInput);
                    if (!validation.isValid) {
                        yield this.updateRequestStatus(documentRequestId, document_1.RequestStatus.FAILED);
                        return {
                            requestId: documentRequestId,
                            status: document_1.RequestStatus.FAILED,
                            emailSent: false,
                            message: `Validation failed: ${validation.errors.join(', ')}`
                        };
                    }
                }
                else {
                    // Use new validation system for other document types
                    // Debug logging for validation
                    console.log('🔍 VALIDATION DEBUG:', {
                        documentType: request.documentType,
                        userInputKeys: Object.keys(request.userInput || {}),
                        userInputSample: request.userInput
                    });
                    const validation = document_validators_1.default.validateDocumentInput(request.documentType, request.userInput);
                    if (!validation.isValid) {
                        console.log('❌ VALIDATION FAILED:', validation.errors);
                        yield this.updateRequestStatus(documentRequestId, document_1.RequestStatus.FAILED);
                        return {
                            requestId: documentRequestId,
                            status: document_1.RequestStatus.FAILED,
                            emailSent: false,
                            message: `Validation failed: ${validation.errors.join(', ')}`
                        };
                    }
                    console.log('✅ VALIDATION PASSED');
                }
                // Generate AI content based on document type
                let filePaths = [];
                if (request.documentType === document_1.DocumentType.NDA) {
                    filePaths = yield this.generateNDADocument(request.userInput, request.backstory, request.formats);
                }
                else {
                    // Use new document generator for other document types
                    filePaths = yield this.generateNewDocument(request.documentType, request.userInput, request.backstory, request.formats);
                }
                // Update database with generated file paths
                yield prisma.documentRequest.update({
                    where: { id: documentRequestId },
                    data: {
                        filePaths: JSON.stringify(filePaths.map(fp => path_1.default.basename(fp))),
                        status: document_1.RequestStatus.COMPLETED
                    }
                });
                // Send email with attachments and immediate cleanup
                const emailResult = yield this.sendDocumentEmailWithCleanup(documentRequestId, request, filePaths);
                return {
                    requestId: documentRequestId,
                    status: emailResult.status,
                    filePaths: emailResult.success ? [] : filePaths, // Don't return paths if files were cleaned up
                    emailSent: emailResult.success,
                    message: emailResult.message
                };
            }
            catch (error) {
                console.error('Error in document generation process:', error);
                if (documentRequestId) {
                    yield this.updateRequestStatus(documentRequestId, document_1.RequestStatus.FAILED);
                }
                return {
                    requestId: documentRequestId || 'unknown',
                    status: document_1.RequestStatus.FAILED,
                    emailSent: false,
                    message: error instanceof Error ? error.message : 'Unknown error occurred during document generation'
                };
            }
        });
    }
    generateNDADocument(userInput, backstory, formats) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Generating NDA content with AI...');
            // Generate AI content for NDA
            const generatedContent = yield document_ai_1.default.generateNDAContent(userInput, backstory);
            console.log('AI content generated, creating document files...');
            // Generate document files
            const filePaths = yield document_generator_1.default.generateNDA(userInput, generatedContent, formats);
            console.log('Document files created:', filePaths.map(fp => path_1.default.basename(fp)));
            return filePaths;
        });
    }
    generateNewDocument(documentType, userInput, backstory, formats) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Generating ${documentType} content with AI...`);
            // For now, generate minimal content structure for new document types
            // In a full implementation, each document type would have its own AI generation logic
            const generatedContent = {
                title: this.getDocumentTitle(documentType),
                content: `This ${documentType} has been generated based on your requirements.`
            };
            console.log('AI content generated, creating document files...');
            // Generate document files using the unified generator
            const filePaths = yield document_generator_1.default.generateDocument(documentType, userInput, generatedContent, formats);
            return filePaths;
        });
    }
    getDocumentTitle(documentType) {
        switch (documentType) {
            case document_1.DocumentType.SALES_PURCHASE_AGREEMENT:
                return 'SALES AND PURCHASE AGREEMENT';
            case document_1.DocumentType.DISTRIBUTION_AGREEMENT:
                return 'DISTRIBUTION AGREEMENT';
            case document_1.DocumentType.PARTNERSHIP_AGREEMENT:
                return 'PARTNERSHIP AGREEMENT';
            case document_1.DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
                return 'EMPLOYMENT CONTRACT';
            case document_1.DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
                return 'INDEPENDENT CONTRACTOR AGREEMENT';
            default:
                return 'LEGAL DOCUMENT';
        }
    }
    sendDocumentEmailWithCleanup(requestId, request, filePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📧 EMAIL FLOW: Preparing to send document email with cleanup...');
                // Get user info for personalization
                const user = yield prisma.user.findUnique({
                    where: { id: request.userId }
                });
                if (!user) {
                    console.error('❌ EMAIL FLOW: User not found for document request');
                    yield this.updateRequestStatus(requestId, document_1.RequestStatus.FAILED);
                    return {
                        success: false,
                        status: document_1.RequestStatus.FAILED,
                        message: 'User not found for document request'
                    };
                }
                // Prepare email attachments
                const attachments = filePaths.map(filePath => {
                    const filename = path_1.default.basename(filePath);
                    const ext = path_1.default.extname(filename).toLowerCase();
                    let contentType = 'application/octet-stream';
                    if (ext === '.pdf') {
                        contentType = 'application/pdf';
                    }
                    else if (ext === '.docx') {
                        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    }
                    return {
                        filename: filename,
                        path: filePath,
                        contentType: contentType
                    };
                });
                const emailData = {
                    recipientName: user.name || user.email.split('@')[0],
                    recipientEmail: request.emailAddress,
                    documentType: this.getDocumentTypeDisplayName(request.documentType),
                    attachments: attachments,
                    generatedDate: new Date().toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                // Send email with retry logic
                const emailResult = yield email_service_1.default.sendDocumentEmail(emailData, 3);
                // Update database with email attempt info
                yield prisma.documentRequest.update({
                    where: { id: requestId },
                    data: {
                        emailRetryCount: emailResult.attempt,
                        lastEmailAttempt: new Date(),
                        emailError: emailResult.error || null,
                        emailSent: emailResult.success
                    }
                });
                if (emailResult.success) {
                    console.log(`✅ EMAIL FLOW: Email sent successfully on attempt ${emailResult.attempt}, cleaning up files...`);
                    // CRITICAL: Delete files immediately after successful email send
                    yield this.deleteDocumentFiles(filePaths);
                    console.log(`🗑️ FILE CLEANUP: Deleted ${filePaths.length} files immediately after email success`);
                    // Update status to EMAIL_QUEUED (email accepted by SMTP, files deleted)
                    yield this.updateRequestStatus(requestId, document_1.RequestStatus.EMAIL_QUEUED);
                    return {
                        success: true,
                        status: document_1.RequestStatus.EMAIL_QUEUED,
                        message: 'Documents generated and sent successfully to your email'
                    };
                }
                else {
                    console.error(`❌ EMAIL FLOW: All retry attempts failed: ${emailResult.error}`);
                    yield this.updateRequestStatus(requestId, document_1.RequestStatus.FAILED);
                    return {
                        success: false,
                        status: document_1.RequestStatus.FAILED,
                        message: `Email delivery failed after ${emailResult.attempt} attempts: ${emailResult.error}`
                    };
                }
            }
            catch (error) {
                console.error('❌ EMAIL FLOW: Error in email and cleanup process:', error);
                // Update database with error info
                yield prisma.documentRequest.update({
                    where: { id: requestId },
                    data: {
                        emailError: error instanceof Error ? error.message : 'Unknown error',
                        lastEmailAttempt: new Date()
                    }
                });
                yield this.updateRequestStatus(requestId, document_1.RequestStatus.FAILED);
                return {
                    success: false,
                    status: document_1.RequestStatus.FAILED,
                    message: 'Email sending and file cleanup failed due to system error'
                };
            }
        });
    }
    updateRequestStatus(requestId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.documentRequest.update({
                    where: { id: requestId },
                    data: { status: status }
                });
            }
            catch (error) {
                console.error('Error updating request status:', error);
            }
        });
    }
    getDocumentRequest(requestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.documentRequest.findFirst({
                where: {
                    id: requestId,
                    userId: userId
                }
            });
        });
    }
    getUserDocumentRequests(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, cursor) {
            return yield prisma.documentRequest.findMany({
                where: Object.assign({ userId: userId }, (cursor && {
                    createdAt: {
                        lt: new Date(cursor)
                    }
                })),
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                select: {
                    id: true,
                    documentType: true,
                    status: true,
                    emailSent: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        });
    }
    deleteDocumentFiles(filePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const filePath of filePaths) {
                try {
                    const filename = path_1.default.basename(filePath);
                    yield document_generator_1.default.deleteDocument(filename);
                }
                catch (error) {
                    console.error('Error deleting document file:', error);
                }
            }
        });
    }
    getDocumentTypeDisplayName(type) {
        switch (type) {
            case document_1.DocumentType.NDA:
                return 'Non-Disclosure Agreement (NDA)';
            case document_1.DocumentType.EMPLOYMENT_CONTRACT:
                return 'Employment Contract';
            case document_1.DocumentType.SERVICE_AGREEMENT:
                return 'Service Agreement';
            case document_1.DocumentType.LEASE_AGREEMENT:
                return 'Lease Agreement';
            default:
                return 'Legal Document';
        }
    }
    // Clean up old documents (call this periodically)
    cleanupOldDocuments() {
        return __awaiter(this, arguments, void 0, function* (olderThanDays = 30) {
            try {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
                const oldRequests = yield prisma.documentRequest.findMany({
                    where: {
                        createdAt: {
                            lt: cutoffDate
                        },
                        filePaths: {
                            not: null
                        }
                    }
                });
                for (const request of oldRequests) {
                    if (request.filePaths) {
                        const filePaths = JSON.parse(request.filePaths);
                        yield this.deleteDocumentFiles(filePaths);
                        yield prisma.documentRequest.update({
                            where: { id: request.id },
                            data: { filePaths: null }
                        });
                    }
                }
                console.log(`🗑️ SCHEDULED CLEANUP: Cleaned up documents from ${oldRequests.length} old requests`);
            }
            catch (error) {
                console.error('❌ SCHEDULED CLEANUP: Error during document cleanup:', error);
            }
        });
    }
    // Clean up failed email requests (documents older than 1 day that failed email delivery)
    cleanupFailedEmailRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                const failedRequests = yield prisma.documentRequest.findMany({
                    where: {
                        status: document_1.RequestStatus.FAILED,
                        lastEmailAttempt: {
                            lt: oneDayAgo
                        },
                        filePaths: {
                            not: null
                        }
                    }
                });
                for (const request of failedRequests) {
                    if (request.filePaths) {
                        const filePaths = JSON.parse(request.filePaths);
                        yield this.deleteDocumentFiles(filePaths);
                        yield prisma.documentRequest.update({
                            where: { id: request.id },
                            data: { filePaths: null }
                        });
                    }
                }
                console.log(`🗑️ FAILED EMAIL CLEANUP: Cleaned up ${failedRequests.length} failed email requests`);
            }
            catch (error) {
                console.error('❌ FAILED EMAIL CLEANUP: Error during failed email cleanup:', error);
            }
        });
    }
}
exports.DocumentOrchestrator = DocumentOrchestrator;
exports.default = new DocumentOrchestrator();
