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
exports.DocumentGeneratorService = void 0;
const pdf_lib_1 = require("pdf-lib");
const docx_1 = require("docx");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const document_1 = require("../types/document");
class DocumentGeneratorService {
    constructor() {
        this.outputDir = path_1.default.join(__dirname, '../../generated-documents');
        this.ensureOutputDirectory();
    }
    ensureOutputDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.mkdir(this.outputDir, { recursive: true });
            }
            catch (error) {
                console.error('Error creating output directory:', error);
            }
        });
    }
    generateNDA(userInput, generatedContent, formats) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const baseFilename = `NDA_${userInput.disclosingPartyName}_${userInput.receivingPartyName}_${timestamp}`;
            const filePaths = [];
            try {
                for (const format of formats) {
                    if (format === document_1.DocumentFormat.PDF) {
                        const pdfPath = yield this.generateNDAPDF(userInput, generatedContent, baseFilename);
                        filePaths.push(pdfPath);
                    }
                    else if (format === document_1.DocumentFormat.DOCX) {
                        const docxPath = yield this.generateNDADOCX(userInput, generatedContent, baseFilename);
                        filePaths.push(docxPath);
                    }
                }
                return filePaths;
            }
            catch (error) {
                console.error('Error generating documents:', error);
                throw new Error('Failed to generate documents');
            }
        });
    }
    generateNDAPDF(userInput, content, baseFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfDoc = yield pdf_lib_1.PDFDocument.create();
            const timesRomanFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRoman);
            const timesRomanBoldFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRomanBold);
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const fontSize = 12;
            const titleFontSize = 16;
            const lineHeight = 14;
            const margin = 50;
            let yPosition = height - margin;
            // Helper function to clean text for PDF generation
            const cleanTextForPDF = (text) => {
                return text
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold formatting
                    .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic formatting
                    .replace(/_{2,}(.*?)_{2,}/g, '$1') // Remove markdown underline formatting
                    .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
                    .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
                    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                    .trim();
            };
            // Helper function to add text with word wrapping
            const addText = (text, font = timesRomanFont, size = fontSize, isBold = false) => {
                const cleanedText = cleanTextForPDF(text);
                const words = cleanedText.split(' ');
                let line = '';
                for (const word of words) {
                    const testLine = line + word + ' ';
                    let testWidth;
                    try {
                        testWidth = font.widthOfTextAtSize(testLine, size);
                    }
                    catch (error) {
                        console.warn('Error calculating text width, skipping word:', word);
                        continue;
                    }
                    if (testWidth > width - 2 * margin && line.length > 0) {
                        const finalLine = line.trim();
                        if (finalLine) {
                            page.drawText(finalLine, {
                                x: margin,
                                y: yPosition,
                                size: size,
                                font: font,
                                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                            });
                        }
                        yPosition -= lineHeight;
                        line = word + ' ';
                    }
                    else {
                        line = testLine;
                    }
                    // Check if we need a new page
                    if (yPosition < margin) {
                        page = pdfDoc.addPage();
                        yPosition = height - margin;
                    }
                }
                if (line.trim().length > 0) {
                    const finalLine = line.trim();
                    if (finalLine) {
                        page.drawText(finalLine, {
                            x: margin,
                            y: yPosition,
                            size: size,
                            font: font,
                            color: (0, pdf_lib_1.rgb)(0, 0, 0),
                        });
                    }
                    yPosition -= lineHeight;
                }
                yPosition -= 5; // Extra spacing
            };
            // Title
            const cleanTitle = cleanTextForPDF(content.title);
            page.drawText(cleanTitle, {
                x: margin,
                y: yPosition,
                size: titleFontSize,
                font: timesRomanBoldFont,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
            });
            yPosition -= titleFontSize + 10;
            // Date
            addText(`Date: ${userInput.effectiveDate}`, timesRomanFont, fontSize);
            yPosition -= lineHeight;
            // Parties
            addText('PARTIES:', timesRomanBoldFont, fontSize, true);
            addText(`Disclosing Party: ${userInput.disclosingPartyName}`);
            addText(`Address: ${userInput.disclosingPartyAddress}`);
            addText(`Email: ${userInput.disclosingPartyEmail}`);
            if (userInput.disclosingPartyPhone) {
                addText(`Phone: ${userInput.disclosingPartyPhone}`);
            }
            yPosition -= lineHeight;
            addText(`Receiving Party: ${userInput.receivingPartyName}`);
            addText(`Address: ${userInput.receivingPartyAddress}`);
            addText(`Email: ${userInput.receivingPartyEmail}`);
            if (userInput.receivingPartyPhone) {
                addText(`Phone: ${userInput.receivingPartyPhone}`);
            }
            yPosition -= lineHeight;
            // Main Content Sections
            const sections = [
                { title: 'RECITALS', content: content.recitals },
                { title: 'DEFINITIONS', content: content.definitions },
                { title: 'CONFIDENTIALITY OBLIGATIONS', content: content.confidentialityObligations },
                { title: 'PERMITTED USES', content: content.permittedUses },
                { title: 'EXCLUSIONS', content: content.exclusions },
                { title: 'TERM AND DURATION', content: content.termDuration },
                { title: 'REMEDIES AND ENFORCEMENT', content: content.remediesAndEnforcement },
                { title: 'GENERAL PROVISIONS', content: content.generalProvisions },
                { title: 'GOVERNING LAW', content: content.governingLaw },
            ];
            for (const section of sections) {
                addText(section.title, timesRomanBoldFont, fontSize, true);
                addText(section.content);
                yPosition -= lineHeight;
            }
            // Signatures - handle with preserved line breaks
            addText('SIGNATURES', timesRomanBoldFont, fontSize, true);
            // Handle signatures with preserved line breaks
            const signatureLines = content.signatures.split('\\n');
            for (const line of signatureLines) {
                if (line.trim()) {
                    addText(line.trim());
                }
                else {
                    yPosition -= lineHeight; // Add empty line spacing
                }
            }
            const pdfBytes = yield pdfDoc.save();
            const filePath = path_1.default.join(this.outputDir, `${baseFilename}.pdf`);
            yield promises_1.default.writeFile(filePath, pdfBytes);
            return filePath;
        });
    }
    generateNDADOCX(userInput, content, baseFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new docx_1.Document({
                sections: [{
                        properties: {},
                        children: [
                            // Title
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: content.title,
                                        bold: true,
                                        size: 32,
                                        underline: {
                                            type: docx_1.UnderlineType.SINGLE,
                                        },
                                    }),
                                ],
                                alignment: docx_1.AlignmentType.CENTER,
                                spacing: { after: 400 },
                            }),
                            // Date
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Date: ${userInput.effectiveDate}`,
                                        bold: true,
                                    }),
                                ],
                                spacing: { after: 200 },
                            }),
                            // Parties Section
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: 'PARTIES:',
                                        bold: true,
                                        size: 24,
                                    }),
                                ],
                                spacing: { after: 200 },
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: 'Disclosing Party:',
                                        bold: true,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Name: ${userInput.disclosingPartyName}`,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Address: ${userInput.disclosingPartyAddress}`,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Email: ${userInput.disclosingPartyEmail}`,
                                    }),
                                ],
                            }),
                            ...(userInput.disclosingPartyPhone ? [new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: `Phone: ${userInput.disclosingPartyPhone}`,
                                        }),
                                    ],
                                })] : []),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: 'Receiving Party:',
                                        bold: true,
                                    }),
                                ],
                                spacing: { before: 200 },
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Name: ${userInput.receivingPartyName}`,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Address: ${userInput.receivingPartyAddress}`,
                                    }),
                                ],
                            }),
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: `Email: ${userInput.receivingPartyEmail}`,
                                    }),
                                ],
                            }),
                            ...(userInput.receivingPartyPhone ? [new docx_1.Paragraph({
                                    children: [
                                        new docx_1.TextRun({
                                            text: `Phone: ${userInput.receivingPartyPhone}`,
                                        }),
                                    ],
                                })] : []),
                            // Main Content Sections
                            ...this.createDocxSections([
                                { title: 'RECITALS', content: content.recitals },
                                { title: 'DEFINITIONS', content: content.definitions },
                                { title: 'CONFIDENTIALITY OBLIGATIONS', content: content.confidentialityObligations },
                                { title: 'PERMITTED USES', content: content.permittedUses },
                                { title: 'EXCLUSIONS', content: content.exclusions },
                                { title: 'TERM AND DURATION', content: content.termDuration },
                                { title: 'REMEDIES AND ENFORCEMENT', content: content.remediesAndEnforcement },
                                { title: 'GENERAL PROVISIONS', content: content.generalProvisions },
                                { title: 'GOVERNING LAW', content: content.governingLaw },
                                { title: 'SIGNATURES', content: content.signatures },
                            ]),
                        ],
                    }],
            });
            const buffer = yield docx_1.Packer.toBuffer(doc);
            const filePath = path_1.default.join(this.outputDir, `${baseFilename}.docx`);
            yield promises_1.default.writeFile(filePath, buffer);
            return filePath;
        });
    }
    createDocxSections(sections) {
        const result = [];
        for (const section of sections) {
            result.push(new docx_1.Paragraph({
                children: [
                    new docx_1.TextRun({
                        text: section.title,
                        bold: true,
                        size: 24,
                    }),
                ],
                spacing: { before: 400, after: 200 },
            }));
            // Handle signatures section with preserved line breaks
            if (section.title === 'SIGNATURES') {
                const signatureLines = section.content.split('\\n');
                for (const line of signatureLines) {
                    result.push(new docx_1.Paragraph({
                        children: [
                            new docx_1.TextRun({
                                text: line,
                            }),
                        ],
                        spacing: line.trim() === '' ? { after: 100 } : { after: 50 },
                    }));
                }
            }
            else {
                // Regular content handling with markdown cleanup
                const cleanedContent = section.content
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
                    .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
                    .replace(/_{2,}/g, ''); // Remove underlines
                result.push(new docx_1.Paragraph({
                    children: [
                        new docx_1.TextRun({
                            text: cleanedContent,
                        }),
                    ],
                    spacing: { after: 200 },
                }));
            }
        }
        return result;
    }
    getDocumentPath(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return path_1.default.join(this.outputDir, filename);
        });
    }
    documentExists(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(this.outputDir, filename);
                yield promises_1.default.access(filePath);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    deleteDocument(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(this.outputDir, filename);
                yield promises_1.default.unlink(filePath);
            }
            catch (error) {
                console.error('Error deleting document:', error);
            }
        });
    }
}
exports.DocumentGeneratorService = DocumentGeneratorService;
exports.default = new DocumentGeneratorService();
