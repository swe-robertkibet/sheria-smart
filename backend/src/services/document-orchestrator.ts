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

      // Send email with attachments and immediate cleanup
      const emailResult = await this.sendDocumentEmailWithCleanup(
        documentRequestId,
        request,
        filePaths
      );

      return {
        requestId: documentRequestId,
        status: emailResult.status,
        filePaths: emailResult.success ? [] : filePaths, // Don't return paths if files were cleaned up
        emailSent: emailResult.success,
        message: emailResult.message
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

  private async sendDocumentEmailWithCleanup(
    requestId: string,
    request: DocumentGenerationRequest,
    filePaths: string[]
  ): Promise<{ success: boolean; status: RequestStatus; message: string }> {
    try {
      console.log('📧 EMAIL FLOW: Preparing to send document email with cleanup...');

      // Get user info for personalization
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      });

      if (!user) {
        console.error('❌ EMAIL FLOW: User not found for document request');
        await this.updateRequestStatus(requestId, RequestStatus.FAILED);
        return {
          success: false,
          status: RequestStatus.FAILED,
          message: 'User not found for document request'
        };
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

      // Send email with retry logic
      const emailResult = await EmailService.sendDocumentEmail(emailData, 3);
      
      // Update database with email attempt info
      await prisma.documentRequest.update({
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
        await this.deleteDocumentFiles(filePaths);
        console.log(`🗑️ FILE CLEANUP: Deleted ${filePaths.length} files immediately after email success`);
        
        // Update status to EMAIL_QUEUED (email accepted by SMTP, files deleted)
        await this.updateRequestStatus(requestId, RequestStatus.EMAIL_QUEUED);
        
        return {
          success: true,
          status: RequestStatus.EMAIL_QUEUED,
          message: 'Documents generated and sent successfully to your email'
        };
      } else {
        console.error(`❌ EMAIL FLOW: All retry attempts failed: ${emailResult.error}`);
        await this.updateRequestStatus(requestId, RequestStatus.FAILED);
        
        return {
          success: false,
          status: RequestStatus.FAILED,
          message: `Email delivery failed after ${emailResult.attempt} attempts: ${emailResult.error}`
        };
      }
    } catch (error) {
      console.error('❌ EMAIL FLOW: Error in email and cleanup process:', error);
      
      // Update database with error info
      await prisma.documentRequest.update({
        where: { id: requestId },
        data: {
          emailError: error instanceof Error ? error.message : 'Unknown error',
          lastEmailAttempt: new Date()
        }
      });
      
      await this.updateRequestStatus(requestId, RequestStatus.FAILED);
      
      return {
        success: false,
        status: RequestStatus.FAILED,
        message: 'Email sending and file cleanup failed due to system error'
      };
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

      console.log(`🗑️ SCHEDULED CLEANUP: Cleaned up documents from ${oldRequests.length} old requests`);
    } catch (error) {
      console.error('❌ SCHEDULED CLEANUP: Error during document cleanup:', error);
    }
  }

  // Clean up failed email requests (documents older than 1 day that failed email delivery)
  async cleanupFailedEmailRequests(): Promise<void> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const failedRequests = await prisma.documentRequest.findMany({
        where: {
          status: RequestStatus.FAILED,
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
          const filePaths = JSON.parse(request.filePaths) as string[];
          await this.deleteDocumentFiles(filePaths);
          
          await prisma.documentRequest.update({
            where: { id: request.id },
            data: { filePaths: null }
          });
        }
      }

      console.log(`🗑️ FAILED EMAIL CLEANUP: Cleaned up ${failedRequests.length} failed email requests`);
    } catch (error) {
      console.error('❌ FAILED EMAIL CLEANUP: Error during failed email cleanup:', error);
    }
  }
}

export default new DocumentOrchestrator();