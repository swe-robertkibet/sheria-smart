import { google } from 'googleapis';
import { PrismaClient, User, Account } from '@prisma/client';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
}

export class OAuthService {
  private oauth2Client: any;
  private redirectUri: string;

  constructor() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not found in environment variables');
    }

    this.redirectUri = `${process.env.BACKEND_URL}/api/auth/google/callback`;
    
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      this.redirectUri
    );
  }

  generateAuthUrl(): { url: string; state: string } {
    const state = crypto.randomBytes(32).toString('hex');
    
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state,
      prompt: 'consent'
    });

    return { url, state };
  }

  async exchangeCodeForTokens(code: string): Promise<TokenData> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new Error('No access token received from Google');
      }

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || undefined,
        expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
        token_type: tokens.token_type || 'Bearer',
        scope: tokens.scope || '',
        id_token: tokens.id_token || undefined
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      const userInfo = await response.json();
      
      if (!userInfo.id || !userInfo.email) {
        throw new Error('Invalid user info received from Google');
      }

      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user information from Google');
    }
  }

  async findOrCreateUser(userInfo: GoogleUserInfo, tokenData: TokenData): Promise<User> {
    try {
      let user = await prisma.user.findUnique({
        where: { googleId: userInfo.id }
      });

      if (!user) {
        user = await prisma.user.findUnique({
          where: { email: userInfo.email }
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: userInfo.id }
          });
        } else {
          user = await prisma.user.create({
            data: {
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              googleId: userInfo.id
            }
          });
        }
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: userInfo.name,
            picture: userInfo.picture
          }
        });
      }

      await this.upsertAccount(user.id, tokenData, userInfo.id);

      return user;
    } catch (error) {
      console.error('Error finding or creating user:', error);
      throw new Error('Failed to create or update user');
    }
  }

  private async upsertAccount(userId: string, tokenData: TokenData, providerAccountId: string): Promise<Account> {
    try {
      return await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId
          }
        },
        update: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          id_token: tokenData.id_token
        },
        create: {
          userId,
          type: 'oauth',
          provider: 'google',
          providerAccountId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_in ? Math.floor(Date.now() / 1000) + tokenData.expires_in : null,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          id_token: tokenData.id_token
        }
      });
    } catch (error) {
      console.error('Error upserting account:', error);
      throw new Error('Failed to save account information');
    }
  }

  generateJWT(user: User): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not found in environment variables');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as jwt.SignOptions);
  }

  verifyJWT(token: string): any {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not found in environment variables');
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenData | null> {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        return null;
      }

      return {
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || refreshToken,
        expires_in: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600,
        token_type: credentials.token_type || 'Bearer',
        scope: credentials.scope || ''
      };
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }
}

export default new OAuthService();