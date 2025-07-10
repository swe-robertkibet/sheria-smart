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
const express_1 = __importDefault(require("express"));
const oauth_1 = __importDefault(require("../services/oauth"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check database connectivity before starting OAuth flow
        yield prisma.$connect();
        // Test database access
        yield prisma.$queryRaw `SELECT 1`;
        const { url, state } = oauth_1.default.generateAuthUrl();
        res.cookie('oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });
        console.log('OAuth flow initiated - database connectivity verified');
        res.json({ url });
    }
    catch (error) {
        console.error('Error generating auth URL or database connectivity issue:', error);
        res.status(500).json({
            error: 'Failed to generate authentication URL',
            details: 'Database connectivity issue'
        });
    }
}));
router.get('/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
        const { code, state } = req.query;
        const storedState = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.oauth_state;
        if (!code || !state) {
            console.error('OAuth callback: Missing authorization code or state');
            return res.redirect(`${frontendUrl}/login?error=missing_auth_params`);
        }
        if (!storedState || state !== storedState) {
            console.error('OAuth callback: Invalid state parameter');
            return res.redirect(`${frontendUrl}/login?error=invalid_state`);
        }
        res.clearCookie('oauth_state');
        // Exchange code for tokens
        const tokenData = yield oauth_1.default.exchangeCodeForTokens(code);
        const userInfo = yield oauth_1.default.getUserInfo(tokenData.access_token);
        // Attempt to find or create user
        const user = yield oauth_1.default.findOrCreateUser(userInfo, tokenData);
        // Verify user was actually created/found in database
        if (!user || !user.id) {
            console.error('OAuth callback: Failed to create or find user in database');
            return res.redirect(`${frontendUrl}/login?error=user_creation_failed`);
        }
        // Generate JWT and verify it's valid
        const jwtToken = oauth_1.default.generateJWT(user);
        if (!jwtToken) {
            console.error('OAuth callback: Failed to generate JWT');
            return res.redirect(`${frontendUrl}/login?error=token_generation_failed`);
        }
        // Set auth cookie
        res.cookie('auth_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        console.log(`OAuth callback success: User ${user.email} authenticated`);
        res.redirect(`${frontendUrl}/dashboard?auth=success`);
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        // Clear any potentially set cookies on error
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.clearCookie('oauth_state');
        res.redirect(`${frontendUrl}/login?error=oauth_failed&details=${encodeURIComponent(error instanceof Error ? error.message : String(error))}`);
    }
}));
router.get('/me', (req, res, next) => {
    console.log('🎆 /api/auth/me called - BEFORE middleware');
    console.log('🎆 Request cookies:', Object.keys(req.cookies || {}));
    (0, auth_1.authenticateToken)(req, res, next);
}, (req, res) => {
    console.log('📍 AUTH /me: Route handler called, user:', req.user ? req.user.email : 'NONE');
    if (!req.user) {
        console.log('📍 AUTH /me: No user in request, returning 401');
        return res.status(401).json({ error: 'User not authenticated' });
    }
    console.log('📍 AUTH /me: Returning user data for', req.user.email);
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
    console.log('💪 LOGOUT: Forcing complete auth state cleanup');
    // Clear auth token with multiple variations to ensure it's gone
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    // Clear oauth state too
    res.clearCookie('oauth_state', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    console.log('💪 LOGOUT: All cookies cleared');
    res.json({ message: 'Logged out successfully' });
});
// Force logout endpoint for debugging
router.post('/force-logout', (req, res) => {
    console.log('💪 FORCE LOGOUT: Nuclear option - clearing everything');
    // Clear all possible cookie variations
    const cookieOptions = [
        { httpOnly: true, secure: false, sameSite: 'lax', path: '/' },
        { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
        { httpOnly: false, secure: false, sameSite: 'lax', path: '/' },
        { path: '/' },
        {}
    ];
    cookieOptions.forEach(options => {
        res.clearCookie('auth_token', options);
        res.clearCookie('oauth_state', options);
    });
    res.json({ message: 'Force logout completed - all authentication state cleared' });
});
router.get('/status', auth_1.authenticateToken, (req, res) => {
    res.json({
        authenticated: true,
        user: req.user
    });
});
// NEW: Validate token endpoint for secure auto-login
router.get('/validate-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('🔍 TOKEN VALIDATION: Endpoint called');
    console.log('🔍 TOKEN VALIDATION: Cookies present:', Object.keys(req.cookies || {}));
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    if (!token) {
        console.log('🔍 TOKEN VALIDATION: No token found');
        return res.status(401).json({
            error: 'No authentication token found',
            code: 'TOKEN_MISSING'
        });
    }
    try {
        console.log('🔍 TOKEN VALIDATION: Verifying JWT...');
        const decoded = oauth_1.default.verifyJWT(token);
        console.log('🔍 TOKEN VALIDATION: JWT decoded, userId:', decoded.userId);
        // Verify user exists in database
        console.log('🔍 TOKEN VALIDATION: Checking user existence in database...');
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            console.log('🔍 TOKEN VALIDATION: User not found in database, clearing cookie');
            res.clearCookie('auth_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            return res.status(401).json({
                error: 'User account no longer exists',
                code: 'USER_NOT_FOUND'
            });
        }
        console.log('🔍 TOKEN VALIDATION: Success for user:', user.email);
        res.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        });
    }
    catch (error) {
        console.error('🔍 TOKEN VALIDATION: Token verification failed:', error);
        // Clear invalid token
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        // Determine error type for better UX
        const errorMessage = error instanceof Error ? error.message : String(error);
        let errorCode = 'TOKEN_INVALID';
        if (errorMessage.includes('expired')) {
            errorCode = 'TOKEN_EXPIRED';
        }
        else if (errorMessage.includes('signature')) {
            errorCode = 'TOKEN_TAMPERED';
        }
        return res.status(401).json({
            error: 'Invalid or expired authentication token',
            code: errorCode,
            details: errorMessage
        });
    }
}));
exports.default = router;
