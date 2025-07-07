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
const router = express_1.default.Router();
router.get('/google', (req, res) => {
    try {
        const { url, state } = oauth_1.default.generateAuthUrl();
        res.cookie('oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });
        res.json({ url });
    }
    catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: 'Failed to generate authentication URL' });
    }
});
router.get('/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { code, state } = req.query;
        const storedState = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.oauth_state;
        if (!code || !state) {
            return res.status(400).json({ error: 'Missing authorization code or state' });
        }
        if (!storedState || state !== storedState) {
            return res.status(400).json({ error: 'Invalid state parameter - possible CSRF attack' });
        }
        res.clearCookie('oauth_state');
        const tokenData = yield oauth_1.default.exchangeCodeForTokens(code);
        const userInfo = yield oauth_1.default.getUserInfo(tokenData.access_token);
        const user = yield oauth_1.default.findOrCreateUser(userInfo, tokenData);
        const jwtToken = oauth_1.default.generateJWT(user);
        res.cookie('auth_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/dashboard?auth=success`);
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
}));
router.get('/me', auth_1.authenticateToken, (req, res) => {
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
router.get('/status', auth_1.authenticateToken, (req, res) => {
    res.json({
        authenticated: true,
        user: req.user
    });
});
exports.default = router;
