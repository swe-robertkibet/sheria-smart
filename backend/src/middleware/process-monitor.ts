import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import AIServiceManager from '../lib/ai-service-manager';

const execAsync = promisify(exec);

/**
 * Process monitoring middleware for tracking resource usage
 * Helps detect and prevent the 120+ process spike issue
 */

interface ProcessInfo {
  pid: number;
  memory: {
    rss: number; // Resident Set Size
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  uptime: number;
  processCount?: number;
}

interface MonitoringThresholds {
  maxMemoryMB: number;
  maxProcessCount: number;
  warningMemoryMB: number;
  warningProcessCount: number;
}

class ProcessMonitor {
  private static instance: ProcessMonitor;
  private lastCpuUsage: NodeJS.CpuUsage | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly thresholds: MonitoringThresholds = {
    maxMemoryMB: 400, // cPanel shared hosting typical limit
    maxProcessCount: 80, // Warning threshold (cPanel limit is 100)
    warningMemoryMB: 250,
    warningProcessCount: 50
  };

  private constructor() {
    this.startPeriodicChecks();
  }

  public static getInstance(): ProcessMonitor {
    if (!ProcessMonitor.instance) {
      ProcessMonitor.instance = new ProcessMonitor();
    }
    return ProcessMonitor.instance;
  }

  /**
   * Express middleware to monitor process usage on each request
   */
  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const startTime = process.hrtime.bigint();
      
      // Monitor memory before request
      const beforeInfo = this.getCurrentProcessInfo();
      
      // Add process info to request for debugging
      (req as any).processInfo = {
        before: beforeInfo,
        route: `${req.method} ${req.path}`
      };

      // Continue with request
      next();

      // Monitor memory after response is sent
      res.on('finish', async () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        
        const afterInfo = this.getCurrentProcessInfo();
        const memoryDelta = afterInfo.memory.heapUsed - beforeInfo.memory.heapUsed;

        // Log significant memory increases or long requests
        if (memoryDelta > 10 * 1024 * 1024 || duration > 5000) { // 10MB or 5 seconds
          console.warn(`⚠️ Resource spike detected:`, {
            route: `${req.method} ${req.path}`,
            duration: `${duration.toFixed(2)}ms`,
            memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`,
            totalMemory: `${(afterInfo.memory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            processCount: afterInfo.processCount
          });
        }

        // Check thresholds and trigger cleanup if needed
        await this.checkThresholds(afterInfo);
      });
    };
  }

  /**
   * Get current process information
   */
  private getCurrentProcessInfo(): ProcessInfo {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage(this.lastCpuUsage || undefined);
    this.lastCpuUsage = process.cpuUsage();

    return {
      pid: process.pid,
      memory: memUsage,
      cpuUsage,
      uptime: process.uptime()
    };
  }

  /**
   * Get system-wide process count (Linux/cPanel specific)
   */
  private async getProcessCount(): Promise<number> {
    try {
      // Count processes owned by current user on cPanel
      const { stdout } = await execAsync(`ps -u $(whoami) --no-headers | wc -l`);
      return parseInt(stdout.trim(), 10) || 0;
    } catch (error) {
      console.warn('Failed to get process count:', error);
      return 0;
    }
  }

  /**
   * Check resource thresholds and take action if needed
   */
  private async checkThresholds(info: ProcessInfo): Promise<void> {
    const memoryMB = info.memory.heapUsed / 1024 / 1024;
    const processCount = await this.getProcessCount();

    // Update process count in info
    info.processCount = processCount;

    // Check memory thresholds
    if (memoryMB > this.thresholds.maxMemoryMB) {
      console.error(`🚨 CRITICAL: Memory usage ${memoryMB.toFixed(2)}MB exceeds limit ${this.thresholds.maxMemoryMB}MB`);
      await this.emergencyCleanup();
    } else if (memoryMB > this.thresholds.warningMemoryMB) {
      console.warn(`⚠️ WARNING: Memory usage ${memoryMB.toFixed(2)}MB approaching limit`);
      this.triggerGarbageCollection();
    }

    // Check process count thresholds  
    if (processCount > this.thresholds.maxProcessCount) {
      console.error(`🚨 CRITICAL: Process count ${processCount} exceeds warning threshold ${this.thresholds.maxProcessCount}`);
      await this.emergencyCleanup();
    } else if (processCount > this.thresholds.warningProcessCount) {
      console.warn(`⚠️ WARNING: Process count ${processCount} approaching limit`);
    }
  }

  /**
   * Start periodic resource monitoring
   */
  private startPeriodicChecks(): void {
    this.checkInterval = setInterval(async () => {
      const info = this.getCurrentProcessInfo();
      info.processCount = await this.getProcessCount();
      
      await this.checkThresholds(info);
      
      // Log status every 5 minutes in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Process Status:', {
          memory: `${(info.memory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          processes: info.processCount,
          uptime: `${(info.uptime / 60).toFixed(1)}min`,
          aiService: AIServiceManager.getStatus()
        });
      }
    }, 2 * 60 * 1000); // Check every 2 minutes

    console.log('🕐 Started periodic process monitoring');
  }

  /**
   * Trigger garbage collection if available
   */
  private triggerGarbageCollection(): void {
    if (global.gc) {
      console.log('🧹 Triggering garbage collection');
      global.gc();
    } else {
      console.log('💡 Garbage collection not available (run with --expose-gc)');
    }
  }

  /**
   * Emergency cleanup when thresholds are exceeded
   */
  private async emergencyCleanup(): Promise<void> {
    console.log('🆘 Initiating emergency cleanup...');
    
    // Trigger garbage collection
    this.triggerGarbageCollection();
    
    // Force cleanup of document generators
    const { documentGeneratorRegistry } = await import('../generators/document-generator-registry');
    documentGeneratorRegistry.forceCleanup();
    
    // Additional cleanup hints
    if (global.gc) {
      // Multiple GC runs for thorough cleanup
      setTimeout(() => global.gc && global.gc(), 100);
      setTimeout(() => global.gc && global.gc(), 500);
    }

    console.log('✅ Emergency cleanup completed');
  }

  /**
   * Get monitoring statistics
   */
  public async getStats(): Promise<{
    current: ProcessInfo;
    thresholds: MonitoringThresholds;
    aiServiceStatus: any;
  }> {
    const current = this.getCurrentProcessInfo();
    current.processCount = await this.getProcessCount();
    
    return {
      current,
      thresholds: this.thresholds,
      aiServiceStatus: AIServiceManager.getStatus()
    };
  }

  /**
   * Update monitoring thresholds
   */
  public updateThresholds(newThresholds: Partial<MonitoringThresholds>): void {
    Object.assign(this.thresholds, newThresholds);
    console.log('📊 Updated monitoring thresholds:', this.thresholds);
  }

  /**
   * Cleanup on shutdown
   */
  public shutdown(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 Process monitoring stopped');
    }
  }
}

// Export singleton instance and middleware
const processMonitor = ProcessMonitor.getInstance();
export const processMonitorMiddleware = processMonitor.middleware();
export default processMonitor;