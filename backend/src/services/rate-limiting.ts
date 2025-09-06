import { FeatureType } from '@prisma/client';
import prisma from '../lib/prisma';

// Default fallback rate limits (used if database is unavailable)
const DEFAULT_RATE_LIMITS: Record<FeatureType, number> = {
  [FeatureType.QUICK_CHAT]: 2,
  [FeatureType.STRUCTURED_ANALYSIS]: 2,
  [FeatureType.DOCUMENT_GENERATION]: 1,
};

// In-memory cache for rate limits (loaded from database)
export let RATE_LIMITS: Record<FeatureType, number> = { ...DEFAULT_RATE_LIMITS };

// Load rate limits from database with caching
let rateLimitCache: { data: Record<FeatureType, number> | null; lastFetch: number } = {
  data: null,
  lastFetch: 0
};

const CACHE_TTL = 60000; // 1 minute cache

export interface RateLimitResult {
  allowed: boolean;
  remainingUsage: number;
  totalLimit: number;
  resetTime: Date;
  currentUsage: number;
}

export interface RateLimitError {
  code: 'RATE_LIMIT_EXCEEDED';
  message: string;
  remainingUsage: number;
  totalLimit: number;
  resetTime: Date;
  currentUsage: number;
}

async function loadRateLimitsFromDb(): Promise<Record<FeatureType, number>> {
  try {
    const configs = await prisma.rateLimitConfig.findMany();
    const limits: Record<FeatureType, number> = { ...DEFAULT_RATE_LIMITS };
    
    for (const config of configs) {
      limits[config.featureType] = config.limit;
    }
    
    return limits;
  } catch (error) {
    console.error('Failed to load rate limits from database:', error);
    return DEFAULT_RATE_LIMITS;
  }
}

async function getRateLimits(): Promise<Record<FeatureType, number>> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (rateLimitCache.data && (now - rateLimitCache.lastFetch) < CACHE_TTL) {
    return rateLimitCache.data;
  }
  
  // Load fresh data from database
  const limits = await loadRateLimitsFromDb();
  
  // Update cache and global RATE_LIMITS
  rateLimitCache = {
    data: limits,
    lastFetch: now
  };
  
  RATE_LIMITS = { ...limits };
  
  return limits;
}

export class RateLimitingService {
  /**
   * Check if user can perform action and increment usage if allowed
   */
  static async checkAndIncrementRateLimit(
    userId: string,
    featureType: FeatureType
  ): Promise<RateLimitResult> {
    const limits = await getRateLimits();
    const limit = limits[featureType];
    const now = new Date();
    const resetTime = this.getNextResetTime(now);

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Get or create rate limit record
      let rateLimit = await tx.rateLimit.findUnique({
        where: {
          userId_featureType: {
            userId,
            featureType,
          },
        },
      });

      // Create new record if doesn't exist or reset if past reset date
      if (!rateLimit || now >= rateLimit.resetDate) {
        rateLimit = await tx.rateLimit.upsert({
          where: {
            userId_featureType: {
              userId,
              featureType,
            },
          },
          create: {
            userId,
            featureType,
            usageCount: 0,
            resetDate: resetTime,
          },
          update: {
            usageCount: 0,
            resetDate: resetTime,
          },
        });
      }

      // Check if user has exceeded limit
      if (rateLimit.usageCount >= limit) {
        return {
          allowed: false,
          remainingUsage: 0,
          totalLimit: limit,
          resetTime: rateLimit.resetDate,
          currentUsage: rateLimit.usageCount,
        };
      }

      // Increment usage count
      const updatedRateLimit = await tx.rateLimit.update({
        where: { id: rateLimit.id },
        data: { usageCount: rateLimit.usageCount + 1 },
      });

      return {
        allowed: true,
        remainingUsage: limit - updatedRateLimit.usageCount,
        totalLimit: limit,
        resetTime: updatedRateLimit.resetDate,
        currentUsage: updatedRateLimit.usageCount,
      };
    });

    return result;
  }

  /**
   * Get current rate limit status without incrementing
   */
  static async getRateLimitStatus(
    userId: string,
    featureType: FeatureType
  ): Promise<RateLimitResult> {
    const limits = await getRateLimits();
    const limit = limits[featureType];
    const now = new Date();
    const resetTime = this.getNextResetTime(now);

    const rateLimit = await prisma.rateLimit.findUnique({
      where: {
        userId_featureType: {
          userId,
          featureType,
        },
      },
    });

    // If no record exists or past reset date, user has full limit available
    if (!rateLimit || now >= rateLimit.resetDate) {
      return {
        allowed: true,
        remainingUsage: limit,
        totalLimit: limit,
        resetTime,
        currentUsage: 0,
      };
    }

    const remainingUsage = Math.max(0, limit - rateLimit.usageCount);

    return {
      allowed: remainingUsage > 0,
      remainingUsage,
      totalLimit: limit,
      resetTime: rateLimit.resetDate,
      currentUsage: rateLimit.usageCount,
    };
  }

  /**
   * Get rate limit status for all features for a user
   */
  static async getAllRateLimitStatus(userId: string): Promise<{
    [K in FeatureType]: RateLimitResult;
  }> {
    const results = await Promise.all([
      this.getRateLimitStatus(userId, FeatureType.QUICK_CHAT),
      this.getRateLimitStatus(userId, FeatureType.STRUCTURED_ANALYSIS),
      this.getRateLimitStatus(userId, FeatureType.DOCUMENT_GENERATION),
    ]);

    return {
      QUICK_CHAT: results[0],
      STRUCTURED_ANALYSIS: results[1],
      DOCUMENT_GENERATION: results[2],
    };
  }

  /**
   * Reset expired rate limits (cleanup job)
   */
  static async resetExpiredLimits(): Promise<number> {
    const now = new Date();

    const result = await prisma.rateLimit.updateMany({
      where: {
        resetDate: {
          lte: now,
        },
      },
      data: {
        usageCount: 0,
        resetDate: this.getNextResetTime(now),
      },
    });

    return result.count;
  }

  /**
   * Calculate next reset time (next midnight UTC)
   */
  private static getNextResetTime(from: Date): Date {
    const resetTime = new Date(from);
    resetTime.setUTCHours(24, 0, 0, 0); // Next midnight UTC
    return resetTime;
  }

  /**
   * Format time remaining until reset
   */
  static getTimeUntilReset(resetTime: Date): string {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Now';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Invalidate the rate limit cache (called when limits are updated)
   */
  static invalidateCache(): void {
    rateLimitCache = {
      data: null,
      lastFetch: 0
    };
  }

  /**
   * Create rate limit error object
   */
  static createRateLimitError(result: RateLimitResult): RateLimitError {
    return {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. You can make ${result.remainingUsage} more requests. Limit resets at ${result.resetTime.toISOString()}.`,
      remainingUsage: result.remainingUsage,
      totalLimit: result.totalLimit,
      resetTime: result.resetTime,
      currentUsage: result.currentUsage,
    };
  }
}

export default RateLimitingService;