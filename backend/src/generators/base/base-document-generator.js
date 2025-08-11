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
exports.BaseDocumentGenerator = void 0;
const pdf_lib_1 = require("pdf-lib");
const docx_1 = require("docx");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const document_1 = require("../../types/document");
class BaseDocumentGenerator {
    constructor() {
        this.outputDir = path_1.default.join(__dirname, '../../../generated-documents');
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
    // Common document generation method
    generateDocument(userInput, generatedContent, formats) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const baseFilename = `${this.getBaseFilename(userInput)}_${timestamp}`;
            const filePaths = [];
            try {
                for (const format of formats) {
                    if (format === document_1.DocumentFormat.PDF) {
                        const pdfPath = yield this.generatePDF(userInput, generatedContent, baseFilename);
                        filePaths.push(pdfPath);
                    }
                    else if (format === document_1.DocumentFormat.DOCX) {
                        const docxPath = yield this.generateDOCX(userInput, generatedContent, baseFilename);
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
    // Common PDF generation with standardized formatting
    generatePDF(userInput, generatedContent, baseFilename) {
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
                    .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1') // Remove markdown underline formatting
                    .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
                    .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
                    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                    .trim();
            };
            // Helper function to add text with word wrapping
            const addText = (text, font = timesRomanFont, size = fontSize, isBold = false, isSignature = false) => {
                // For signature sections, preserve line breaks to match DOCX formatting
                if (isSignature) {
                    const lines = text.split('\n');
                    for (const line of lines) {
                        const cleanedLine = line.replace(/[^\x20-\x7E]/g, '').trim(); // Clean but preserve structure
                        // Check if we need a new page
                        if (yPosition < margin) {
                            page = pdfDoc.addPage();
                            yPosition = height - margin;
                        }
                        if (cleanedLine || line.trim() === '') {
                            page.drawText(cleanedLine, {
                                x: margin,
                                y: yPosition,
                                size: size,
                                font: font,
                                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                            });
                        }
                        yPosition -= lineHeight;
                    }
                    yPosition -= 5; // Extra spacing after signature section
                    return;
                }
                // Regular text handling with word wrapping
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
            // Add document title (centered to match DOCX)
            const documentTitle = this.getDocumentTitle(userInput);
            const cleanTitle = cleanTextForPDF(documentTitle);
            const titleWidth = timesRomanBoldFont.widthOfTextAtSize(cleanTitle, titleFontSize);
            const titleX = (width - titleWidth) / 2; // Center the title
            page.drawText(cleanTitle, {
                x: titleX,
                y: yPosition,
                size: titleFontSize,
                font: timesRomanBoldFont,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
            });
            yPosition -= titleFontSize + 10;
            // Add effective date
            const effectiveDate = userInput.effectiveDate || new Date().toISOString().split('T')[0];
            addText(`Date: ${effectiveDate}`, timesRomanFont, fontSize);
            yPosition -= lineHeight;
            // Add party information
            const partyInfo = this.getPartyInformation(userInput);
            addText('PARTIES:', timesRomanBoldFont, fontSize, true);
            for (const info of partyInfo) {
                addText(info);
            }
            yPosition -= lineHeight;
            // Add document sections
            const sections = this.getDocumentSections(userInput, generatedContent);
            for (const section of sections) {
                addText(section.title, timesRomanBoldFont, fontSize, true);
                // Check if this is a signature section to preserve line breaks
                const isSignatureSection = section.title.includes('SIGNATURE');
                addText(section.content, timesRomanFont, fontSize, false, isSignatureSection);
                yPosition -= lineHeight;
            }
            const pdfBytes = yield pdfDoc.save();
            const filePath = path_1.default.join(this.outputDir, `${baseFilename}.pdf`);
            yield promises_1.default.writeFile(filePath, pdfBytes);
            return filePath;
        });
    }
    // Common DOCX generation with standardized formatting
    generateDOCX(userInput, generatedContent, baseFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            const effectiveDate = userInput.effectiveDate || new Date().toISOString().split('T')[0];
            const documentTitle = this.getDocumentTitle(userInput);
            const partyInfo = this.getPartyInformation(userInput);
            const sections = this.getDocumentSections(userInput, generatedContent);
            const doc = new docx_1.Document({
                sections: [{
                        properties: {},
                        children: [
                            // Title
                            new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: documentTitle,
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
                                        text: `Date: ${effectiveDate}`,
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
                            // Party information paragraphs
                            ...partyInfo.map(info => new docx_1.Paragraph({
                                children: [
                                    new docx_1.TextRun({
                                        text: info,
                                    }),
                                ],
                                spacing: { after: 100 },
                            })),
                            // Main Content Sections
                            ...this.createDocxSections(sections),
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
            if (section.title.includes('SIGNATURE')) {
                const signatureLines = section.content.replace(/\\n/g, '\n').split('\n');
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
                    .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1'); // Remove markdown underline formatting
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
    // Utility methods
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
exports.BaseDocumentGenerator = BaseDocumentGenerator;
