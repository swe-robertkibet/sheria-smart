import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { promises as fs } from 'fs';
import path from 'path';
import { DocumentType, DocumentFormat, DocumentUserInput } from '../types/document';
import { documentGeneratorRegistry } from '../generators/document-generator-registry';

class DocumentGeneratorService {
  private outputDir: string;

  constructor() {
    // Use environment variable or default to outputs directory
    this.outputDir = process.env.DOCUMENT_OUTPUT_DIR || path.join(process.cwd(), 'outputs');
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
  }

  // New unified document generation method
  async generateDocument(
    documentType: DocumentType,
    userInput: DocumentUserInput,
    generatedContent: any,
    formats: DocumentFormat[]
  ): Promise<string[]> {
    try {
      // Check if we have a new generator for this document type
      if (documentGeneratorRegistry.isDocumentTypeSupported(documentType)) {
        return await documentGeneratorRegistry.generateDocument(
          documentType,
          userInput,
          generatedContent,
          formats
        );
      }

      throw new Error(`Document type ${documentType} is not yet implemented`);
    } catch (error) {
      console.error('Error generating document:', error);
      throw new Error('Failed to generate document');
    }
  }

  // NDA methods removed - document type has been discontinued

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