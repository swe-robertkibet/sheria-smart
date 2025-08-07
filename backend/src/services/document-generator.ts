import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, PageBreak, Packer } from 'docx';
import fs from 'fs/promises';
import path from 'path';
import { DocumentFormat, NDAUserInput, GeneratedNDAContent } from '../types/document';

export class DocumentGeneratorService {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(__dirname, '../../generated-documents');
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
  }

  async generateNDA(
    userInput: NDAUserInput,
    generatedContent: GeneratedNDAContent,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `NDA_${userInput.disclosingPartyName}_${userInput.receivingPartyName}_${timestamp}`;
    const filePaths: string[] = [];

    try {
      for (const format of formats) {
        if (format === DocumentFormat.PDF) {
          const pdfPath = await this.generateNDAPDF(userInput, generatedContent, baseFilename);
          filePaths.push(pdfPath);
        } else if (format === DocumentFormat.DOCX) {
          const docxPath = await this.generateNDADOCX(userInput, generatedContent, baseFilename);
          filePaths.push(docxPath);
        }
      }

      return filePaths;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw new Error('Failed to generate documents');
    }
  }

  private async generateNDAPDF(
    userInput: NDAUserInput,
    content: GeneratedNDAContent,
    baseFilename: string
  ): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const titleFontSize = 16;
    const lineHeight = 14;
    const margin = 50;
    let yPosition = height - margin;

    // Helper function to clean text for PDF generation
    const cleanTextForPDF = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic formatting
        .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1') // Remove markdown underline formatting (only when text is between underscores)
        .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
        .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };

    // Helper function to add text with word wrapping
    const addText = (text: string, font = timesRomanFont, size = fontSize, isBold = false) => {
      const cleanedText = cleanTextForPDF(text);
      const words = cleanedText.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line + word + ' ';
        let testWidth: number;
        
        try {
          testWidth = font.widthOfTextAtSize(testLine, size);
        } catch (error) {
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
              color: rgb(0, 0, 0),
            });
          }
          yPosition -= lineHeight;
          line = word + ' ';
        } else {
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
            color: rgb(0, 0, 0),
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
      color: rgb(0, 0, 0),
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
    const signatureLines = content.signatures.replace(/\\n/g, '\n').split('\n');
    for (const line of signatureLines) {
      if (line.trim()) {
        addText(line.trim());
      } else {
        yPosition -= lineHeight; // Add empty line spacing
      }
    }

    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(this.outputDir, `${baseFilename}.pdf`);
    await fs.writeFile(filePath, pdfBytes);
    
    return filePath;
  }

  private async generateNDADOCX(
    userInput: NDAUserInput,
    content: GeneratedNDAContent,
    baseFilename: string
  ): Promise<string> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: content.title,
                bold: true,
                size: 32,
                underline: {
                  type: UnderlineType.SINGLE,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${userInput.effectiveDate}`,
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Parties Section
          new Paragraph({
            children: [
              new TextRun({
                text: 'PARTIES:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Disclosing Party:',
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Name: ${userInput.disclosingPartyName}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Address: ${userInput.disclosingPartyAddress}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${userInput.disclosingPartyEmail}`,
              }),
            ],
          }),

          ...(userInput.disclosingPartyPhone ? [new Paragraph({
            children: [
              new TextRun({
                text: `Phone: ${userInput.disclosingPartyPhone}`,
              }),
            ],
          })] : []),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Receiving Party:',
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Name: ${userInput.receivingPartyName}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Address: ${userInput.receivingPartyAddress}`,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${userInput.receivingPartyEmail}`,
              }),
            ],
          }),

          ...(userInput.receivingPartyPhone ? [new Paragraph({
            children: [
              new TextRun({
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

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(this.outputDir, `${baseFilename}.docx`);
    await fs.writeFile(filePath, buffer);
    
    return filePath;
  }

  private createDocxSections(sections: { title: string; content: string }[]) {
    const result = [];
    
    for (const section of sections) {
      result.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.title,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 400, after: 200 },
        })
      );

      // Handle signatures section with preserved line breaks
      if (section.title === 'SIGNATURES') {
        const signatureLines = section.content.replace(/\\n/g, '\n').split('\n');
        for (const line of signatureLines) {
          result.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                }),
              ],
              spacing: line.trim() === '' ? { after: 100 } : { after: 50 },
            })
          );
        }
      } else {
        // Regular content handling with markdown cleanup
        const cleanedContent = section.content
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
          .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
          .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1'); // Remove markdown underline formatting (only when text is between underscores)
        
        result.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cleanedContent,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }
    
    return result;
  }

  async getDocumentPath(filename: string): Promise<string> {
    return path.join(this.outputDir, filename);
  }

  async documentExists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.outputDir, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async deleteDocument(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.outputDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
}

export default new DocumentGeneratorService();