import nodemailer from 'nodemailer';
import path from 'path';
import { DocumentEmailData, DocumentType } from '../types/document';

export class EmailService {
  private transporter;
  private lastEmailSent: number = 0;
  private readonly EMAIL_RATE_LIMIT_MS = 5000; // 5 seconds between emails

  constructor() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Email configuration missing in environment variables');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Connection pooling for better performance
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Connection timeout optimizations  
      connectionTimeout: 60000, // 60 seconds
      socketTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      // Additional performance settings
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      },
      debug: process.env.NODE_ENV === 'development'
    });
  }

  async sendDocumentEmail(emailData: DocumentEmailData, maxRetries: number = 3): Promise<{ success: boolean; attempt: number; error?: string; rateDelayMs?: number }> {
    // Implement rate limiting to prevent overwhelming SMTP server
    const now = Date.now();
    const timeSinceLastEmail = now - this.lastEmailSent;
    
    if (timeSinceLastEmail < this.EMAIL_RATE_LIMIT_MS) {
      const delayMs = this.EMAIL_RATE_LIMIT_MS - timeSinceLastEmail;
      console.log(`⏳ RATE LIMIT: Waiting ${delayMs}ms before sending email to ${emailData.recipientEmail}`);
      await this.delay(delayMs);
    }

    const subject = `Your Legal Document is Ready`;
    const htmlContent = this.generateEmailHTML(emailData);
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Sheria Smart'}" <${process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER}>`,
      to: emailData.recipientEmail,
      subject: subject,
      html: htmlContent,
      attachments: emailData.attachments,
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📧 EMAIL ATTEMPT ${attempt}/${maxRetries}: Sending to ${emailData.recipientEmail}`);
        
        // Start performance monitoring
        const startTime = Date.now();
        const info = await this.transporter.sendMail(mailOptions);
        const handoffTime = Date.now();
        const smtpHandoffDuration = handoffTime - startTime;
        
        // Update last email sent timestamp for rate limiting
        this.lastEmailSent = handoffTime;
        
        console.log(`✅ EMAIL SUCCESS: Document email sent successfully on attempt ${attempt}`);
        console.log(`📊 PERFORMANCE: SMTP handoff took ${smtpHandoffDuration}ms`);
        console.log(`📨 EMAIL INFO:`, { messageId: info.messageId, recipientEmail: emailData.recipientEmail });
        
        return { success: true, attempt };
      } catch (error) {
        console.error(`❌ EMAIL ATTEMPT ${attempt}/${maxRetries} FAILED:`, error);
        
        if (attempt === maxRetries) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown email error';
          console.error(`🚫 EMAIL FAILED: All ${maxRetries} attempts exhausted for ${emailData.recipientEmail}`);
          return { success: false, attempt, error: errorMessage };
        }
        
        // Exponential backoff: 1s, 4s, 16s delays
        const delayMs = Math.pow(4, attempt - 1) * 1000;
        console.log(`⏳ EMAIL RETRY: Waiting ${delayMs}ms before attempt ${attempt + 1}`);
        await this.delay(delayMs);
      }
    }
    
    return { success: false, attempt: maxRetries, error: 'Unexpected retry loop exit' };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateEmailHTML(emailData: DocumentEmailData): string {
    const attachmentsList = emailData.attachments.map(att => 
      `${att.filename}`
    ).join(', ');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Legal Document is Ready</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #7C9885, #5D7A6B);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .document-details {
            background-color: #F8FAF9;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .document-details h3 {
            margin-top: 0;
            color: #7C9885;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .document-details ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .document-details li {
            margin: 8px 0;
            color: #4A5568;
        }
        .footer {
            background-color: #F7F8FC;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Legal Document is Ready</h1>
        </div>
        
        <div class="content">
            <p>Dear ${emailData.recipientName},</p>
            
            <p>Thank you for using Sheria Smart for your legal document needs. Your document has been successfully generated and is attached to this email.</p>
            
            <div class="document-details">
                <h3>Document Details</h3>
                <ul>
                    <li>• <strong>Type:</strong> ${emailData.documentType}</li>
                    <li>• <strong>Generated On:</strong> ${emailData.generatedDate}</li>
                    <li>• <strong>Format:</strong> PDF</li>
                    <li>• <strong>Attached Document:</strong> ${attachmentsList}</li>
                </ul>
            </div>
            
            <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            
            <p>Kind regards,<br>
            <strong>Sheria Smart</strong><br>
            Professional Legal Assistance for Kenya</p>
        </div>
        
        <div class="footer">
            This email was sent automatically. Please do not reply directly to this email.
        </div>
    </div>
</body>
</html>`;
  }

  async testEmailConfiguration(): Promise<boolean> {
    try {
      console.log('🔧 Testing SMTP configuration...');
      const startTime = Date.now();
      await this.transporter.verify();
      const verifyTime = Date.now() - startTime;
      
      console.log(`✅ Email configuration verified successfully in ${verifyTime}ms`);
      console.log('📊 SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || '587',
        secure: process.env.SMTP_SECURE === 'true',
        poolEnabled: true,
        maxConnections: 5,
        maxMessages: 100
      });
      
      return true;
    } catch (error) {
      console.error('❌ Email configuration test failed:', error);
      return false;
    }
  }

  async sendTestEmail(recipientEmail: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Sheria Smart'}" <${process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Test Email - Sheria Smart Document Service',
        html: `
          <h2>Email Service Test</h2>
          <p>This is a test email from Sheria Smart document generation service.</p>
          <p>If you received this email, the email configuration is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent successfully:', info.messageId);
      
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  private getDocumentTypeDisplayName(type: DocumentType): string {
    switch (type) {
      case DocumentType.SERVICE_AGREEMENT:
        return 'Service Agreement';
      default:
        return 'Legal Document';
    }
  }
}

export default new EmailService();