import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import DocumentOrchestrator from '../services/document-orchestrator';
import { 
  DocumentType, 
  DocumentFormat, 
  DocumentGenerationRequest,
  NDAUserInput 
} from '../types/document';

const router = express.Router();

// Get available document types
router.get('/types', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const documentTypes = [
      {
        id: DocumentType.NDA,
        name: 'Non-Disclosure Agreement (NDA)',
        description: 'Protect confidential information shared between parties',
        isActive: true,
        requiredFields: [
          'disclosingPartyName',
          'disclosingPartyAddress', 
          'disclosingPartyEmail',
          'receivingPartyName',
          'receivingPartyAddress',
          'receivingPartyEmail',
          'purposeOfDisclosure',
          'specificConfidentialInfo',
          'effectiveDate',
          'agreementDuration',
          'isPerperual'
        ]
      },
      {
        id: DocumentType.EMPLOYMENT_CONTRACT,
        name: 'Employment Contract',
        description: 'Employment agreements compliant with Kenyan labor law',
        isActive: false, // Coming soon
        requiredFields: []
      },
      {
        id: DocumentType.SERVICE_AGREEMENT,
        name: 'Service Agreement',
        description: 'Professional service contracts and agreements',
        isActive: false, // Coming soon
        requiredFields: []
      },
      {
        id: DocumentType.LEASE_AGREEMENT,
        name: 'Lease Agreement',
        description: 'Property rental and lease agreements',
        isActive: false, // Coming soon
        requiredFields: []
      }
    ];

    res.json({ documentTypes });
  } catch (error) {
    console.error('Error fetching document types:', error);
    res.status(500).json({ error: 'Failed to fetch document types' });
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
      formats,
      emailAddress
    } = req.body;

    console.log('Document generation request:', {
      documentType,
      formats,
      userId: req.user.userId,
      emailAddress
    });

    // Validate required fields
    if (!documentType || !userInput || !backstory || !formats || !emailAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['documentType', 'userInput', 'backstory', 'formats', 'emailAddress']
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Currently only NDA is supported
    if (documentType !== DocumentType.NDA) {
      return res.status(400).json({ 
        error: `Document type ${documentType} is not yet supported`,
        supportedTypes: [DocumentType.NDA]
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
router.post('/validate-nda', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { userInput } = req.body;
    
    if (!userInput) {
      return res.status(400).json({ error: 'userInput is required' });
    }

    // Import the service here to avoid circular dependencies
    const { default: DocumentAIService } = await import('../services/document-ai');
    const validation = await DocumentAIService.validateNDAInput(userInput as NDAUserInput);

    res.json(validation);
  } catch (error) {
    console.error('Error validating NDA input:', error);
    res.status(500).json({ error: 'Failed to validate NDA input' });
  }
});

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