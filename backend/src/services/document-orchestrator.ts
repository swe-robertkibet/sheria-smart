import { PrismaClient } from '@prisma/client';
import path from 'path';
import { 
  DocumentGenerationRequest, 
  DocumentGenerationResponse, 
  DocumentType, 
  DocumentFormat, 
  RequestStatus,
  DocumentUserInput,
  NDAUserInput,
  DocumentEmailData
} from '../types/document';
import DocumentGeneratorService from './document-generator';
import DocumentAIService from './document-ai';
import EmailService from './email-service';
import DocumentValidators from '../validators/document-validators';

const prisma = new PrismaClient();

export class DocumentOrchestrator {
  constructor() {
    // Service instances are imported as singletons
  }

  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
    let documentRequestId: string | null = null;
    
    try {
      console.log('Starting document generation process:', {
        documentType: request.documentType,
        formats: request.formats,
        userId: request.userId
      });

      // Create database record for tracking
      const documentRequest = await prisma.documentRequest.create({
        data: {
          userId: request.userId,
          documentType: request.documentType,
          userInput: JSON.stringify(request.userInput),
          backstory: request.backstory,
          formats: JSON.stringify(request.formats),
          emailAddress: request.emailAddress,
          status: RequestStatus.PROCESSING
        }
      });
      
      documentRequestId = documentRequest.id;

      // Validate user input
      if (request.documentType === DocumentType.NDA) {
        const validation = await DocumentAIService.validateNDAInput(request.userInput as NDAUserInput);
        if (!validation.isValid) {
          await this.updateRequestStatus(documentRequestId, RequestStatus.FAILED);
          return {
            requestId: documentRequestId,
            status: RequestStatus.FAILED,
            emailSent: false,
            message: `Validation failed: ${validation.errors.join(', ')}`
          };
        }
      } else {
        // Use new validation system for other document types
        // Debug logging for validation
        console.log('🔍 VALIDATION DEBUG:', {
          documentType: request.documentType,
          userInputKeys: Object.keys(request.userInput || {}),
          userInputSample: request.userInput
        });

        const validation = DocumentValidators.validateDocumentInput(request.documentType, request.userInput);
        
        if (!validation.isValid) {
          console.log('❌ VALIDATION FAILED:', validation.errors);
          await this.updateRequestStatus(documentRequestId, RequestStatus.FAILED);
          return {
            requestId: documentRequestId,
            status: RequestStatus.FAILED,
            emailSent: false,
            message: `Validation failed: ${validation.errors.join(', ')}`
          };
        }
        
        console.log('✅ VALIDATION PASSED');
      }

      // Generate AI content based on document type
      let filePaths: string[] = [];
      
      if (request.documentType === DocumentType.NDA) {
        filePaths = await this.generateNDADocument(
          request.userInput as NDAUserInput, 
          request.backstory, 
          request.formats
        );
      } else {
        // Use new document generator for other document types
        filePaths = await this.generateNewDocument(
          request.documentType,
          request.userInput,
          request.backstory,
          request.formats
        );
      }

      // Update database with generated file paths
      await prisma.documentRequest.update({
        where: { id: documentRequestId },
        data: {
          filePaths: JSON.stringify(filePaths.map(fp => path.basename(fp))),
          status: RequestStatus.COMPLETED
        }
      });

      // Send email with attachments
      const emailSent = await this.sendDocumentEmail(
        documentRequestId,
        request,
        filePaths
      );

      if (emailSent) {
        await this.updateRequestStatus(documentRequestId, RequestStatus.EMAIL_SENT);
      }

      return {
        requestId: documentRequestId,
        status: emailSent ? RequestStatus.EMAIL_SENT : RequestStatus.COMPLETED,
        filePaths: filePaths,
        emailSent: emailSent,
        message: emailSent 
          ? 'Documents generated and sent successfully to your email'
          : 'Documents generated successfully but email delivery failed'
      };

    } catch (error) {
      console.error('Error in document generation process:', error);
      
      if (documentRequestId) {
        await this.updateRequestStatus(documentRequestId, RequestStatus.FAILED);
      }

      return {
        requestId: documentRequestId || 'unknown',
        status: RequestStatus.FAILED,
        emailSent: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred during document generation'
      };
    }
  }

  private async generateNDADocument(
    userInput: NDAUserInput,
    backstory: string,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    console.log('Generating NDA content with AI...');
    
    // Generate AI content for NDA
    const generatedContent = await DocumentAIService.generateNDAContent(userInput, backstory);
    
    console.log('AI content generated, creating document files...');
    
    // Generate document files
    const filePaths = await DocumentGeneratorService.generateNDA(
      userInput,
      generatedContent,
      formats
    );
    
    console.log('Document files created:', filePaths.map(fp => path.basename(fp)));
    
    return filePaths;
  }

  private async generateNewDocument(
    documentType: DocumentType,
    userInput: DocumentUserInput,
    backstory: string,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    console.log(`Generating ${documentType} content with AI...`);
    
    // For now, generate minimal content structure for new document types
    // In a full implementation, each document type would have its own AI generation logic
    const generatedContent = {
      title: this.getDocumentTitle(documentType),
      content: `This ${documentType} has been generated based on your requirements.`
    };
    
    console.log('AI content generated, creating document files...');
    
    // Generate document files using the unified generator
    const filePaths = await DocumentGeneratorService.generateDocument(
      documentType,
      userInput,
      generatedContent,
      formats
    );
    
    return filePaths;
  }

  private getDocumentTitle(documentType: DocumentType): string {
    switch (documentType) {
      case DocumentType.SALES_PURCHASE_AGREEMENT:
        return 'SALES AND PURCHASE AGREEMENT';
      case DocumentType.DISTRIBUTION_AGREEMENT:
        return 'DISTRIBUTION AGREEMENT';
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return 'PARTNERSHIP AGREEMENT';
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
        return 'EMPLOYMENT CONTRACT';
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
        return 'INDEPENDENT CONTRACTOR AGREEMENT';
      default:
        return 'LEGAL DOCUMENT';
    }
  }

  private async sendDocumentEmail(
    requestId: string,
    request: DocumentGenerationRequest,
    filePaths: string[]
  ): Promise<boolean> {
    try {
      console.log('Preparing to send document email...');

      // Get user info for personalization
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      });

      if (!user) {
        console.error('User not found for document request');
        return false;
      }

      // Prepare email attachments
      const attachments = filePaths.map(filePath => {
        const filename = path.basename(filePath);
        const ext = path.extname(filename).toLowerCase();
        
        let contentType = 'application/octet-stream';
        if (ext === '.pdf') {
          contentType = 'application/pdf';
        } else if (ext === '.docx') {
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }

        return {
          filename: filename,
          path: filePath,
          contentType: contentType
        };
      });

      const emailData: DocumentEmailData = {
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

      const success = await EmailService.sendDocumentEmail(emailData);
      
      if (success) {
        await prisma.documentRequest.update({
          where: { id: requestId },
          data: { emailSent: true }
        });
        console.log('Document email sent successfully');
      } else {
        console.error('Failed to send document email');
      }

      return success;
    } catch (error) {
      console.error('Error sending document email:', error);
      return false;
    }
  }

  private async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
    try {
      await prisma.documentRequest.update({
        where: { id: requestId },
        data: { status: status }
      });
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }

  async getDocumentRequest(requestId: string, userId: string) {
    return await prisma.documentRequest.findFirst({
      where: {
        id: requestId,
        userId: userId
      }
    });
  }

  async getUserDocumentRequests(userId: string, limit: number = 20, cursor?: string) {
    return await prisma.documentRequest.findMany({
      where: {
        userId: userId,
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor)
          }
        })
      },
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
  }

  async deleteDocumentFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        const filename = path.basename(filePath);
        await DocumentGeneratorService.deleteDocument(filename);
      } catch (error) {
        console.error('Error deleting document file:', error);
      }
    }
  }

  private getDocumentTypeDisplayName(type: DocumentType): string {
    switch (type) {
      case DocumentType.NDA:
        return 'Non-Disclosure Agreement (NDA)';
      case DocumentType.EMPLOYMENT_CONTRACT:
        return 'Employment Contract';
      case DocumentType.SERVICE_AGREEMENT:
        return 'Service Agreement';
      case DocumentType.LEASE_AGREEMENT:
        return 'Lease Agreement';
      default:
        return 'Legal Document';
    }
  }

  // Clean up old documents (call this periodically)
  async cleanupOldDocuments(olderThanDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const oldRequests = await prisma.documentRequest.findMany({
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
          const filePaths = JSON.parse(request.filePaths) as string[];
          await this.deleteDocumentFiles(filePaths);
          
          await prisma.documentRequest.update({
            where: { id: request.id },
            data: { filePaths: null }
          });
        }
      }

      console.log(`Cleaned up documents from ${oldRequests.length} old requests`);
    } catch (error) {
      console.error('Error during document cleanup:', error);
    }
  }
}

export default new DocumentOrchestrator();