import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared AI Service Manager - Singleton Pattern
 * Manages a single GoogleGenerativeAI instance across all services
 * Prevents multiple connection pools and resource waste
 */
class AIServiceManager {
  private static instance: AIServiceManager;
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  /**
   * Get the singleton instance of AIServiceManager
   */
  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  /**
   * Initialize the GoogleGenerativeAI instance
   * Called lazily on first use
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log('🔧 Initializing shared GoogleGenerativeAI instance...');
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.isInitialized = true;
    console.log('✅ Shared GoogleGenerativeAI instance initialized successfully');
  }

  /**
   * Get the shared GoogleGenerativeAI instance
   * Initializes on first call
   */
  public getGenerativeAI(): GoogleGenerativeAI {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (!this.genAI) {
      throw new Error('Failed to initialize GoogleGenerativeAI instance');
    }

    return this.genAI;
  }

  /**
   * Get a configured model instance
   * @param modelConfig Configuration for the model
   */
  public getModel(modelConfig: {
    model: string;
    generationConfig?: any;
  }) {
    const genAI = this.getGenerativeAI();
    return genAI.getGenerativeModel(modelConfig);
  }

  /**
   * Check if the service is initialized
   */
  public isReady(): boolean {
    return this.isInitialized && this.genAI !== null;
  }

  /**
   * Get initialization status for monitoring
   */
  public getStatus(): {
    initialized: boolean;
    hasGenAI: boolean;
    processId: number;
  } {
    return {
      initialized: this.isInitialized,
      hasGenAI: this.genAI !== null,
      processId: process.pid
    };
  }

  /**
   * Graceful cleanup (if needed in future)
   * Currently GoogleGenerativeAI doesn't expose cleanup methods
   */
  public cleanup(): void {
    console.log('🧹 AIServiceManager cleanup called (no-op for GoogleGenerativeAI)');
    // Note: GoogleGenerativeAI doesn't expose cleanup methods
    // HTTP connections should be cleaned up automatically by Node.js
  }
}

// Export the singleton instance
export default AIServiceManager.getInstance();