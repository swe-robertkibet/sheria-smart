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
                // Generate AI content based on document type
                let filePaths = [];
                if (request.documentType === document_1.DocumentType.NDA) {
                    filePaths = yield this.generateNDADocument(request.userInput, request.backstory, request.formats);
                }
                else {
                    throw new Error(`Document type ${request.documentType} is not yet supported`);
                }
                // Update database with generated file paths
                yield prisma.documentRequest.update({
                    where: { id: documentRequestId },
                    data: {
                        filePaths: JSON.stringify(filePaths.map(fp => path_1.default.basename(fp))),
                        status: document_1.RequestStatus.COMPLETED
                    }
                });
                // Send email with attachments
                const emailSent = yield this.sendDocumentEmail(documentRequestId, request, filePaths);
                if (emailSent) {
                    yield this.updateRequestStatus(documentRequestId, document_1.RequestStatus.EMAIL_SENT);
                }
                return {
                    requestId: documentRequestId,
                    status: emailSent ? document_1.RequestStatus.EMAIL_SENT : document_1.RequestStatus.COMPLETED,
                    filePaths: filePaths,
                    emailSent: emailSent,
                    message: emailSent
                        ? 'Documents generated and sent successfully to your email'
                        : 'Documents generated successfully but email delivery failed'
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
    sendDocumentEmail(requestId, request, filePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Preparing to send document email...');
                // Get user info for personalization
                const user = yield prisma.user.findUnique({
                    where: { id: request.userId }
                });
                if (!user) {
                    console.error('User not found for document request');
                    return false;
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
                const success = yield email_service_1.default.sendDocumentEmail(emailData);
                if (success) {
                    yield prisma.documentRequest.update({
                        where: { id: requestId },
                        data: { emailSent: true }
                    });
                    console.log('Document email sent successfully');
                }
                else {
                    console.error('Failed to send document email');
                }
                return success;
            }
            catch (error) {
                console.error('Error sending document email:', error);
                return false;
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
                console.log(`Cleaned up documents from ${oldRequests.length} old requests`);
            }
            catch (error) {
                console.error('Error during document cleanup:', error);
            }
        });
    }
}
exports.DocumentOrchestrator = DocumentOrchestrator;
exports.default = new DocumentOrchestrator();
