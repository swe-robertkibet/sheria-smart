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
      // Handle both absolute paths and filenames
      const filePath = path.isAbsolute(filename) ? filename : path.join(this.outputDir, filename);
      
      // Check if file exists before attempting deletion
      await fs.access(filePath);
      // File exists, proceed with deletion
      await fs.unlink(filePath);
      console.log(`✓ DOCUMENT CLEANUP: Successfully deleted ${path.basename(filePath)}`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist (already deleted or moved), this is not an error
        console.log(`ℹ️ DOCUMENT CLEANUP: File already deleted or not found: ${path.basename(filename)}`);
      } else {
        // Other errors (permission, etc.) should be logged as warnings
        console.warn(`⚠️ DOCUMENT CLEANUP: Could not delete ${path.basename(filename)}:`, error.message);
      }
    }
  }
}

export default new DocumentGeneratorService();