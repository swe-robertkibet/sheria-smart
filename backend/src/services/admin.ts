import { FeatureType } from '@prisma/client';
import RateLimitingService from './rate-limiting';
import prisma from '../lib/prisma';

export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    chatSessions: number;
    documentRequests: number;
  };
}

export interface RateLimitConfig {
  featureType: FeatureType;
  limit: number;
  description: string;
}

export interface RateLimitUpdate {
  featureType: FeatureType;
  newLimit: number;
}

export class AdminService {
  /**
   * Get paginated list of users with their stats
   */
  static async getUsers(page: number = 1, limit: number = 20, search?: string): Promise<{
    users: UserListItem[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { email: { contains: search } },
        { name: { contains: search } },
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              chatSessions: true,
              documentRequests: true,
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users: users as UserListItem[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  /**
   * Get current rate limit configuration from database
   */
  static async getRateLimitConfig(): Promise<RateLimitConfig[]> {
    const configs = await prisma.rateLimitConfig.findMany();
    
    const descriptions = {
      [FeatureType.QUICK_CHAT]: 'Quick Chat - Instant legal answers',
      [FeatureType.STRUCTURED_ANALYSIS]: 'Structured Analysis - Detailed legal guidance',
      [FeatureType.DOCUMENT_GENERATION]: 'Document Generation - Create legal documents'
    };

    return configs.map(config => ({
      featureType: config.featureType,
      limit: config.limit,
      description: descriptions[config.featureType]
    }));
  }

  /**
   * Update rate limit for a specific feature
   * Persists changes to database for persistence across server restarts
   */
  static async updateRateLimit(featureType: FeatureType, newLimit: number): Promise<RateLimitConfig> {
    if (newLimit < 0 || newLimit > 100) {
      throw new Error('Rate limit must be between 0 and 100');
    }

    // Update in database
    await prisma.rateLimitConfig.upsert({
      where: { featureType },
      update: { limit: newLimit },
      create: { featureType, limit: newLimit }
    });

    // Invalidate the cache so new limits are loaded
    RateLimitingService.invalidateCache();

    // Return the updated configuration
    const descriptions = {
      [FeatureType.QUICK_CHAT]: 'Quick Chat - Instant legal answers',
      [FeatureType.STRUCTURED_ANALYSIS]: 'Structured Analysis - Detailed legal guidance',
      [FeatureType.DOCUMENT_GENERATION]: 'Document Generation - Create legal documents'
    };

    return {
      featureType,
      limit: newLimit,
      description: descriptions[featureType]
    };
  }

  /**
   * Update multiple rate limits at once
   */
  static async updateRateLimits(updates: RateLimitUpdate[]): Promise<RateLimitConfig[]> {
    const results: RateLimitConfig[] = [];
    
    for (const update of updates) {
      const result = await this.updateRateLimit(update.featureType, update.newLimit);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Get user details by ID
   */
  static async getUserById(userId: string): Promise<UserListItem | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            chatSessions: true,
            documentRequests: true,
          }
        }
      }
    });

    return user as UserListItem | null;
  }

  /**
   * Get user details by email
   */
  static async getUserByEmail(email: string): Promise<UserListItem | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            chatSessions: true,
            documentRequests: true,
          }
        }
      }
    });

    return user as UserListItem | null;
  }

  /**
   * Toggle admin status for a user
   */
  static async toggleUserAdmin(userId: string): Promise<UserListItem> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, email: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Prevent removing admin status from the primary admin
    if (user.email === 'swe.robertkibet@gmail.com' && user.isAdmin) {
      throw new Error('Cannot remove admin privileges from primary admin');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !user.isAdmin },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            chatSessions: true,
            documentRequests: true,
          }
        }
      }
    });

    return updatedUser as UserListItem;
  }

  /**
   * Get platform statistics for admin dashboard
   */
  static async getPlatformStats(): Promise<{
    totalUsers: number;
    totalChatSessions: number;
    totalDocumentRequests: number;
    recentUsers: number; // Users created in last 30 days
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, totalChatSessions, totalDocumentRequests, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.chatSession.count(),
      prisma.documentRequest.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ]);

    return {
      totalUsers,
      totalChatSessions,
      totalDocumentRequests,
      recentUsers
    };
  }
}

export default AdminService;