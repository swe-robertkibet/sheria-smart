"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const googleapis_1 = require("googleapis");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class OAuthService {
    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error('Google OAuth credentials not found in environment variables');
        }
        this.redirectUri = `${process.env.BACKEND_URL}/api/auth/google/callback`;
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, this.redirectUri);
    }
    generateAuthUrl() {
        const state = crypto_1.default.randomBytes(32).toString('hex');
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
    exchangeCodeForTokens(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tokens } = yield this.oauth2Client.getToken(code);
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
            }
            catch (error) {
                console.error('Error exchanging code for tokens:', error);
                throw new Error('Failed to exchange authorization code for tokens');
            }
        });
    }
    getUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.oauth2Client.setCredentials({ access_token: accessToken });
                const response = yield fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user info: ${response.statusText}`);
                }
                const userInfo = yield response.json();
                if (!userInfo.id || !userInfo.email) {
                    throw new Error('Invalid user info received from Google');
                }
                return userInfo;
            }
            catch (error) {
                console.error('Error fetching user info:', error);
                throw new Error('Failed to fetch user information from Google');
            }
        });
    }
    findOrCreateUser(userInfo, tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield prisma.user.findUnique({
                    where: { googleId: userInfo.id }
                });
                if (!user) {
                    user = yield prisma.user.findUnique({
                        where: { email: userInfo.email }
                    });
                    if (user) {
                        user = yield prisma.user.update({
                            where: { id: user.id },
                            data: { googleId: userInfo.id }
                        });
                    }
                    else {
                        user = yield prisma.user.create({
                            data: {
                                email: userInfo.email,
                                name: userInfo.name,
                                picture: userInfo.picture,
                                googleId: userInfo.id
                            }
                        });
                    }
                }
                else {
                    user = yield prisma.user.update({
                        where: { id: user.id },
                        data: {
                            name: userInfo.name,
                            picture: userInfo.picture
                        }
                    });
                }
                yield this.upsertAccount(user.id, tokenData, userInfo.id);
                return user;
            }
            catch (error) {
                console.error('Error finding or creating user:', error);
                throw new Error('Failed to create or update user');
            }
        });
    }
    upsertAccount(userId, tokenData, providerAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.account.upsert({
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
            }
            catch (error) {
                console.error('Error upserting account:', error);
                throw new Error('Failed to save account information');
            }
        });
    }
    generateJWT(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not found in environment variables');
        }
        const payload = {
            userId: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
    }
    verifyJWT(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not found in environment variables');
        }
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.oauth2Client.setCredentials({ refresh_token: refreshToken });
                const { credentials } = yield this.oauth2Client.refreshAccessToken();
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
            }
            catch (error) {
                console.error('Error refreshing access token:', error);
                return null;
            }
        });
    }
}
exports.OAuthService = OAuthService;
exports.default = new OAuthService();
