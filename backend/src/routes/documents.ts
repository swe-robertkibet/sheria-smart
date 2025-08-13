import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import DocumentOrchestrator from '../services/document-orchestrator';
import DocumentCatalog from '../services/document-catalog';
import { 
  DocumentType, 
  DocumentFormat, 
  DocumentGenerationRequest,
  DocumentUserInput
} from '../types/document';

const router = express.Router();

// Get available document types
router.get('/types', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const documentTypes = DocumentCatalog.getAllDocumentTypes();
    res.json({ documentTypes });
  } catch (error) {
    console.error('Error fetching document types:', error);
    res.status(500).json({ error: 'Failed to fetch document types' });
  }
});

// Get document categories with grouped document types
router.get('/categories', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const categories = DocumentCatalog.getAllCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching document categories:', error);
    res.status(500).json({ error: 'Failed to fetch document categories' });
  }
});

// Generate a document
router.post('/generate', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      documentType,
      userInput,
      backstory,
      formats
    } = req.body;

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
    console.log('🔍 DEBUG: req.user.email:', req.user?.email);
    console.log('🔍 DEBUG: typeof req.user.email:', typeof req.user?.email);
    console.log('🔍 DEBUG: emailAddress variable:', emailAddress);
    console.log('✅ SECURITY VALIDATED: Document will be sent to authenticated user email:', emailAddress);
    console.log('Document generation request:', {
      documentType,
      formats,
      userId: req.user.userId,
      emailAddress: emailAddress, // This is the correct value being passed to document orchestrator
      userEmail: req.user?.email,
      hasUserEmail: !!req.user?.email
    });

    // Validate required fields
    if (!documentType || !userInput || !backstory || !formats) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['documentType', 'userInput', 'backstory', 'formats']
      });
    }


    // Validate document type
    if (!Object.values(DocumentType).includes(documentType)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        validTypes: Object.values(DocumentType)
      });
    }

    // Validate formats
    if (!Array.isArray(formats) || formats.length === 0) {
      return res.status(400).json({ 
        error: 'At least one format must be specified',
        validFormats: Object.values(DocumentFormat)
      });
    }

    for (const format of formats) {
      if (!Object.values(DocumentFormat).includes(format)) {
        return res.status(400).json({ 
          error: `Invalid format: ${format}`,
          validFormats: Object.values(DocumentFormat)
        });
      }
    }

    // Email validation not needed - authenticated user's email is already validated during OAuth

    // Check if the document type is supported by either legacy or new generator
    const supportedTypes = [
      DocumentType.SALES_PURCHASE_AGREEMENT,
      DocumentType.DISTRIBUTION_AGREEMENT,
      DocumentType.PARTNERSHIP_AGREEMENT,
      DocumentType.SERVICE_AGREEMENT,
      DocumentType.ENHANCED_EMPLOYMENT_CONTRACT,
      DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT,
      DocumentType.NON_COMPETE_AGREEMENT,
      DocumentType.ENHANCED_LEASE_AGREEMENT,
      DocumentType.SALE_OF_LAND_AGREEMENT,
      DocumentType.PROPERTY_MANAGEMENT_AGREEMENT,
      DocumentType.PRENUPTIAL_AGREEMENT,
      DocumentType.POSTNUPTIAL_AGREEMENT
    ];
    
    if (!supportedTypes.includes(documentType)) {
      return res.status(400).json({ 
        error: `Document type ${documentType} is not yet supported`,
        supportedTypes
      });
    }

    // Create generation request
    const generationRequest: DocumentGenerationRequest = {
      userId: req.user.userId,
      documentType,
      userInput,
      backstory,
      formats,
      emailAddress
    };

    // Start document generation (async process)
    const response = await DocumentOrchestrator.generateDocument(generationRequest);

    res.json(response);
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ 
      error: 'Failed to generate document',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get document request status
router.get('/requests/:requestId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { requestId } = req.params;
    
    const documentRequest = await DocumentOrchestrator.getDocumentRequest(requestId, req.user.userId);
    
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
  } catch (error) {
    console.error('Error fetching document request:', error);
    res.status(500).json({ error: 'Failed to fetch document request' });
  }
});

// Get user's document requests history
router.get('/requests', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { limit = '20', cursor } = req.query;
    
    const requests = await DocumentOrchestrator.getUserDocumentRequests(
      req.user.userId,
      parseInt(limit as string),
      cursor as string
    );

    res.json({
      requests,
      hasMore: requests.length === parseInt(limit as string),
      nextCursor: requests.length > 0 ? requests[requests.length - 1].createdAt.toISOString() : null
    });
  } catch (error) {
    console.error('Error fetching document requests:', error);
    res.status(500).json({ error: 'Failed to fetch document requests' });
  }
});

// Validate NDA input (helper endpoint for frontend)
// NDA validation route removed - document type has been discontinued

// Test email configuration (admin endpoint)
router.post('/test-email', authenticateToken, async (req: AuthenticatedRequest, res) => {
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
    const { default: EmailService } = await import('../services/email-service');
    const success = await EmailService.sendTestEmail(email);

    if (success) {
      res.json({ success: true, message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Health check for document service
router.get('/health', async (req, res) => {
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
      const { default: EmailService } = await import('../services/email-service');
      health.services.emailService = await EmailService.testEmailConfiguration();
    } catch (error) {
      health.services.emailService = false;
    }

    const overallStatus = Object.values(health.services).every(status => status === true) ? 'healthy' : 'degraded';
    health.status = overallStatus;

    res.status(overallStatus === 'healthy' ? 200 : 503).json(health);
  } catch (error) {
    console.error('Error checking document service health:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;