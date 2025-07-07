import express from 'express';
import OAuthService from '../services/oauth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

router.get('/google', (req, res) => {
  try {
    const { url, state } = OAuthService.generateAuthUrl();
    
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    res.json({ url });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.oauth_state;

    if (!code || !state) {
      return res.status(400).json({ error: 'Missing authorization code or state' });
    }

    if (!storedState || state !== storedState) {
      return res.status(400).json({ error: 'Invalid state parameter - possible CSRF attack' });
    }

    res.clearCookie('oauth_state');

    const tokenData = await OAuthService.exchangeCodeForTokens(code as string);
    const userInfo = await OAuthService.getUserInfo(tokenData.access_token);
    const user = await OAuthService.findOrCreateUser(userInfo, tokenData);
    const jwtToken = OAuthService.generateJWT(user);

    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?auth=success`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

router.get('/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  res.json({
    user: {
      id: req.user.userId,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    }
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/status', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ 
    authenticated: true,
    user: req.user 
  });
});

export default router;