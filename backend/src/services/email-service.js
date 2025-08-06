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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const document_1 = require("../types/document");
class EmailService {
    constructor() {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('Email configuration missing in environment variables');
        }
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    sendDocumentEmail(emailData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = `Your ${emailData.documentType} Document - Sheria Smart`;
                const htmlContent = this.generateEmailHTML(emailData);
                const mailOptions = {
                    from: `"${process.env.SMTP_FROM_NAME || 'Sheria Smart'}" <${process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER}>`,
                    to: emailData.recipientEmail,
                    subject: subject,
                    html: htmlContent,
                    attachments: emailData.attachments,
                };
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Document email sent successfully:', info.messageId);
                return true;
            }
            catch (error) {
                console.error('Error sending document email:', error);
                return false;
            }
        });
    }
    generateEmailHTML(emailData) {
        const attachmentsList = emailData.attachments.map(att => `<li>${att.filename}</li>`).join('');
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Legal Document - Sheria Smart</title>
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
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #7C9885, #5D7A6B);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header .subtitle {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #2D3748;
            margin-bottom: 25px;
        }
        .document-info {
            background-color: #F8FAF9;
            border-left: 4px solid #7C9885;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .document-info h3 {
            margin-top: 0;
            color: #7C9885;
            font-size: 20px;
        }
        .document-info p {
            margin: 8px 0;
            color: #4A5568;
        }
        .attachments {
            background-color: #E6F3E7;
            border: 1px solid #C6E2C8;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .attachments h4 {
            color: #2F855A;
            margin-top: 0;
            font-size: 16px;
        }
        .attachments ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
            color: #2F855A;
        }
        .attachments li {
            margin: 5px 0;
            font-weight: 500;
        }
        .important-notice {
            background-color: #FFF5E6;
            border: 1px solid #FBD38D;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .important-notice h4 {
            color: #C05621;
            margin-top: 0;
            font-size: 16px;
            display: flex;
            align-items: center;
        }
        .important-notice p {
            color: #744210;
            margin: 10px 0 0 0;
        }
        .footer {
            background-color: #F7F8FC;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E2E8F0;
        }
        .footer p {
            margin: 5px 0;
            color: #718096;
            font-size: 14px;
        }
        .logo {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .logo .smart {
            color: #FED7C3;
        }
        .warning-icon {
            display: inline-block;
            margin-right: 8px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                Sheria <span class="smart">Smart</span>
            </div>
            <h1>Your Legal Document is Ready</h1>
            <p class="subtitle">Professional Legal Assistance for Kenya</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear ${emailData.recipientName},
            </div>
            
            <p>Thank you for using Sheria Smart for your legal document needs. We're pleased to provide you with your professionally generated ${emailData.documentType} document.</p>
            
            <div class="document-info">
                <h3>Document Details</h3>
                <p><strong>Document Type:</strong> ${emailData.documentType}</p>
                <p><strong>Generated On:</strong> ${emailData.generatedDate}</p>
                <p><strong>Format(s):</strong> ${emailData.attachments.map(att => { var _a; return (_a = att.filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toUpperCase(); }).join(', ')}</p>
            </div>
            
            <div class="attachments">
                <h4>📎 Attached Documents</h4>
                <p>The following files are attached to this email:</p>
                <ul>
                    ${attachmentsList}
                </ul>
            </div>
            
            <div class="important-notice">
                <h4>
                    <span class="warning-icon">⚠️</span>
                    Important Legal Notice
                </h4>
                <p>This document has been generated using AI assistance and is provided for informational purposes only. While we strive for accuracy and compliance with Kenyan law, we strongly recommend that you have this document reviewed by a qualified Kenyan legal professional before use or execution.</p>
                <p><strong>This does not constitute legal advice.</strong> Consult with a licensed attorney for specific legal guidance related to your situation.</p>
            </div>
            
            <p>If you have any questions about your document or need additional assistance, please don't hesitate to contact our support team or visit our platform.</p>
            
            <p>Thank you for choosing Sheria Smart for your legal documentation needs.</p>
            
            <p>Best regards,<br>
            <strong>The Sheria Smart Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Sheria Smart</strong></p>
            <p>AI-Powered Legal Assistance for Kenya</p>
            <p style="margin-top: 15px;">This email was sent automatically. Please do not reply directly to this email.</p>
            <p>For support, please visit our platform or contact our customer service.</p>
        </div>
    </div>
</body>
</html>`;
    }
    testEmailConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.verify();
                console.log('Email configuration verified successfully');
                return true;
            }
            catch (error) {
                console.error('Email configuration test failed:', error);
                return false;
            }
        });
    }
    sendTestEmail(recipientEmail) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Test email sent successfully:', info.messageId);
                return true;
            }
            catch (error) {
                console.error('Error sending test email:', error);
                return false;
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
}
exports.EmailService = EmailService;
exports.default = new EmailService();
