import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Paragraph, TextRun, AlignmentType, UnderlineType, Packer } from 'docx';
import fs from 'fs/promises';
import path from 'path';
import { DocumentFormat, DocumentUserInput } from '../../types/document';

export interface DocumentSection {
  title: string;
  content: string;
}

export abstract class BaseDocumentGenerator {
  protected outputDir: string;

  constructor() {
    this.outputDir = path.join(__dirname, '../../../generated-documents');
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
  }

  // Abstract methods that must be implemented by specific document generators
  abstract getDocumentTitle(userInput: DocumentUserInput): string;
  abstract getBaseFilename(userInput: DocumentUserInput): string;
  abstract getDocumentSections(userInput: DocumentUserInput, generatedContent: any): DocumentSection[];
  abstract getPartyInformation(userInput: DocumentUserInput): string[];

  // Common document generation method
  async generateDocument(
    userInput: DocumentUserInput,
    generatedContent: any,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `${this.getBaseFilename(userInput)}_${timestamp}`;
    const filePaths: string[] = [];

    try {
      for (const format of formats) {
        if (format === DocumentFormat.PDF) {
          const pdfPath = await this.generatePDF(userInput, generatedContent, baseFilename);
          filePaths.push(pdfPath);
        } else if (format === DocumentFormat.DOCX) {
          const docxPath = await this.generateDOCX(userInput, generatedContent, baseFilename);
          filePaths.push(docxPath);
        }
      }

      return filePaths;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw new Error('Failed to generate documents');
    }
  }

  // Common PDF generation with standardized formatting
  protected async generatePDF(
    userInput: DocumentUserInput,
    generatedContent: any,
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
        .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1') // Remove markdown underline formatting
        .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
        .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };

    // Helper function to add text with word wrapping
    const addText = (text: string, font = timesRomanFont, size = fontSize, isBold = false, isSignature = false) => {
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
              color: rgb(0, 0, 0),
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
      color: rgb(0, 0, 0),
    });
    yPosition -= titleFontSize + 10;

    // Add effective date
    const effectiveDate = (userInput as any).effectiveDate || new Date().toISOString().split('T')[0];
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

    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(this.outputDir, `${baseFilename}.pdf`);
    await fs.writeFile(filePath, pdfBytes);
    
    return filePath;
  }

  // Common DOCX generation with standardized formatting
  protected async generateDOCX(
    userInput: DocumentUserInput,
    generatedContent: any,
    baseFilename: string
  ): Promise<string> {
    const effectiveDate = (userInput as any).effectiveDate || new Date().toISOString().split('T')[0];
    const documentTitle = this.getDocumentTitle(userInput);
    const partyInfo = this.getPartyInformation(userInput);
    const sections = this.getDocumentSections(userInput, generatedContent);

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: documentTitle,
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
                text: `Date: ${effectiveDate}`,
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

          // Party information paragraphs
          ...partyInfo.map(info => new Paragraph({
            children: [
              new TextRun({
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

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(this.outputDir, `${baseFilename}.docx`);
    await fs.writeFile(filePath, buffer);
    
    return filePath;
  }

  private createDocxSections(sections: DocumentSection[]) {
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
      if (section.title.includes('SIGNATURE')) {
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
          .replace(/_{2}([^_\s]+.*?[^_\s])_{2}/g, '$1'); // Remove markdown underline formatting
        
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

  // Utility methods
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