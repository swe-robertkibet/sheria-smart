import { Request, Response, NextFunction } from 'express';
import OAuthService from '../services/oauth';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    picture: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = OAuthService.verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (token) {
    try {
      const decoded = OAuthService.verifyJWT(token);
      req.user = decoded;
    } catch (error) {
      console.error('Optional auth token verification failed:', error);
    }
  }

  next();
};