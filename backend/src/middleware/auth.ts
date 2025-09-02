import { Request, Response, NextFunction } from 'express';
import OAuthService from '../services/oauth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    picture: string;
    isAdmin: boolean;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('🔐 AUTH MIDDLEWARE: Request to', req.path);
  const token = req.cookies?.auth_token;
  console.log('🔐 AUTH MIDDLEWARE: Token exists:', !!token);
  
  if (!token) {
    console.log('🔐 AUTH MIDDLEWARE: No token, returning 401');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('🔐 AUTH MIDDLEWARE: Verifying JWT...');
    const decoded = OAuthService.verifyJWT(token);
    console.log('🔐 AUTH MIDDLEWARE: JWT decoded, userId:', decoded.userId);
    
    // Verify user actually exists in database
    console.log('🔐 AUTH MIDDLEWARE: Checking user existence in database...');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    console.log('🔐 AUTH MIDDLEWARE: Database user lookup result:', user ? `Found: ${user.email}` : 'NOT FOUND');
    
    if (!user) {
      console.log('🔐 AUTH MIDDLEWARE: User not found, clearing cookie and returning 401');
      res.clearCookie('auth_token');
      return res.status(401).json({ error: 'User not found in database' });
    }
    
    console.log('🔐 AUTH MIDDLEWARE: Full user object from database:', JSON.stringify(user, null, 2));
    console.log('🔐 AUTH MIDDLEWARE: user.email value:', user.email);
    console.log('🔐 AUTH MIDDLEWARE: typeof user.email:', typeof user.email);
    console.log('🔐 AUTH MIDDLEWARE: user.email === null:', user.email === null);
    console.log('🔐 AUTH MIDDLEWARE: user.email === undefined:', user.email === undefined);
    
    console.log('🔐 AUTH MIDDLEWARE: Authentication successful for', user.email);
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name || '',
      picture: user.picture || '',
      isAdmin: user.isAdmin || false
    };
    
    console.log('🔐 AUTH MIDDLEWARE: req.user object set to:', JSON.stringify(req.user, null, 2));
    console.log('🔐 AUTH MIDDLEWARE: req.user.email after setting:', req.user.email);
    next();
  } catch (error) {
    console.error('🔐 AUTH MIDDLEWARE: Token verification failed:', error);
    res.clearCookie('auth_token');
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (token) {
    try {
      const decoded = OAuthService.verifyJWT(token);
      
      // Verify user actually exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
          name: user.name || '',
          picture: user.picture || '',
          isAdmin: user.isAdmin || false
        };
      } else {
        // Clear invalid cookie
        res.clearCookie('auth_token');
      }
    } catch (error) {
      console.error('Optional auth token verification failed:', error);
      res.clearCookie('auth_token');
    }
  }

  next();
};

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('👑 ADMIN MIDDLEWARE: Checking admin privileges');
  
  if (!req.user) {
    console.log('👑 ADMIN MIDDLEWARE: No user found, authentication required');
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has admin privileges (both database flag and hardcoded email)
  const isAdminByEmail = req.user.email === 'swe.robertkibet@gmail.com';
  const isAdminByFlag = req.user.isAdmin === true;
  
  console.log('👑 ADMIN MIDDLEWARE: Email check:', req.user.email, '-> isAdmin:', isAdminByEmail);
  console.log('👑 ADMIN MIDDLEWARE: Database flag check:', isAdminByFlag);
  
  if (!isAdminByEmail && !isAdminByFlag) {
    console.log('👑 ADMIN MIDDLEWARE: Access denied - user is not admin');
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to access this resource'
    });
  }
  
  console.log('👑 ADMIN MIDDLEWARE: Admin access granted for', req.user.email);
  next();
};

// Convenience middleware that combines authentication and admin check
export const requireAdminAuth = [authenticateToken, requireAdmin];