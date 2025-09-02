import express, { Response } from 'express';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth';
import AdminService, { RateLimitUpdate } from '../services/admin';
import { FeatureType } from '@prisma/client';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get paginated list of users with search functionality
 */
router.get('/users', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    console.log('👑 ADMIN API: Getting users list, page:', page, 'limit:', limit, 'search:', search);

    const result = await AdminService.getUsers(page, Math.min(limit, 100), search);
    
    console.log('👑 ADMIN API: Users retrieved successfully, count:', result.users.length);
    res.json(result);
  } catch (error) {
    console.error('👑 ADMIN API: Error getting users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

/**
 * GET /api/admin/users/:userId
 * Get specific user details
 */
router.get('/users/:userId', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    console.log('👑 ADMIN API: Getting user details for:', userId);
    const user = await AdminService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('👑 ADMIN API: User details retrieved for:', user.email);
    res.json(user);
  } catch (error) {
    console.error('👑 ADMIN API: Error getting user details:', error);
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

/**
 * GET /api/admin/rate-limits
 * Get current rate limit configuration
 */
router.get('/rate-limits', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('👑 ADMIN API: Getting rate limit configuration');
    const config = await AdminService.getRateLimitConfig();
    
    console.log('👑 ADMIN API: Rate limit configuration retrieved');
    res.json(config);
  } catch (error) {
    console.error('👑 ADMIN API: Error getting rate limits:', error);
    res.status(500).json({ error: 'Failed to retrieve rate limits' });
  }
});

/**
 * PUT /api/admin/rate-limits
 * Update rate limit configuration
 * Body: { featureType: string, newLimit: number } or { updates: RateLimitUpdate[] }
 */
router.put('/rate-limits', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { featureType, newLimit, updates } = req.body;
    
    console.log('👑 ADMIN API: Updating rate limits, body:', req.body);

    if (updates && Array.isArray(updates)) {
      // Bulk update
      const validUpdates: RateLimitUpdate[] = updates.filter(update => 
        Object.values(FeatureType).includes(update.featureType) &&
        typeof update.newLimit === 'number' &&
        update.newLimit >= 0 && update.newLimit <= 100
      );

      if (validUpdates.length === 0) {
        return res.status(400).json({ error: 'No valid updates provided' });
      }

      const results = await AdminService.updateRateLimits(validUpdates);
      console.log('👑 ADMIN API: Bulk rate limits updated successfully');
      res.json({ success: true, updated: results });
    } else if (featureType && typeof newLimit === 'number') {
      // Single update
      if (!Object.values(FeatureType).includes(featureType)) {
        return res.status(400).json({ error: 'Invalid feature type' });
      }

      if (newLimit < 0 || newLimit > 100) {
        return res.status(400).json({ error: 'Rate limit must be between 0 and 100' });
      }

      const result = await AdminService.updateRateLimit(featureType, newLimit);
      console.log('👑 ADMIN API: Rate limit updated successfully for:', featureType);
      res.json({ success: true, updated: result });
    } else {
      return res.status(400).json({ 
        error: 'Invalid request format. Provide either featureType+newLimit or updates array' 
      });
    }
  } catch (error) {
    console.error('👑 ADMIN API: Error updating rate limits:', error);
    res.status(500).json({ error: 'Failed to update rate limits' });
  }
});

/**
 * POST /api/admin/users/:userId/toggle-admin
 * Toggle admin status for a user
 */
router.post('/users/:userId/toggle-admin', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    console.log('👑 ADMIN API: Toggling admin status for user:', userId);
    const updatedUser = await AdminService.toggleUserAdmin(userId);
    
    console.log('👑 ADMIN API: Admin status toggled for:', updatedUser.email, 'isAdmin:', updatedUser.isAdmin);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('👑 ADMIN API: Error toggling admin status:', error);
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else if (error instanceof Error && error.message === 'Cannot remove admin privileges from primary admin') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to toggle admin status' });
    }
  }
});

/**
 * GET /api/admin/stats
 * Get platform statistics for admin dashboard
 */
router.get('/stats', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('👑 ADMIN API: Getting platform statistics');
    const stats = await AdminService.getPlatformStats();
    
    console.log('👑 ADMIN API: Platform statistics retrieved');
    res.json(stats);
  } catch (error) {
    console.error('👑 ADMIN API: Error getting platform stats:', error);
    res.status(500).json({ error: 'Failed to retrieve platform statistics' });
  }
});

/**
 * GET /api/admin/health
 * Simple health check endpoint for admin routes
 */
router.get('/health', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  console.log('👑 ADMIN API: Health check accessed by:', req.user?.email);
  res.json({ 
    status: 'healthy', 
    admin: req.user?.email,
    timestamp: new Date().toISOString()
  });
});

export default router;