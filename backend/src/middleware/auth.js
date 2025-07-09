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
exports.optionalAuth = exports.authenticateToken = void 0;
const oauth_1 = __importDefault(require("../services/oauth"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('🔐 AUTH MIDDLEWARE: Request to', req.path);
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    console.log('🔐 AUTH MIDDLEWARE: Token exists:', !!token);
    if (!token) {
        console.log('🔐 AUTH MIDDLEWARE: No token, returning 401');
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        console.log('🔐 AUTH MIDDLEWARE: Verifying JWT...');
        const decoded = oauth_1.default.verifyJWT(token);
        console.log('🔐 AUTH MIDDLEWARE: JWT decoded, userId:', decoded.userId);
        // Verify user actually exists in database
        console.log('🔐 AUTH MIDDLEWARE: Checking user existence in database...');
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        console.log('🔐 AUTH MIDDLEWARE: Database user lookup result:', user ? `Found: ${user.email}` : 'NOT FOUND');
        if (!user) {
            console.log('🔐 AUTH MIDDLEWARE: User not found, clearing cookie and returning 401');
            res.clearCookie('auth_token');
            return res.status(401).json({ error: 'User not found in database' });
        }
        console.log('🔐 AUTH MIDDLEWARE: Authentication successful for', user.email);
        req.user = {
            userId: user.id,
            email: user.email,
            name: user.name || '',
            picture: user.picture || ''
        };
        next();
    }
    catch (error) {
        console.error('🔐 AUTH MIDDLEWARE: Token verification failed:', error);
        res.clearCookie('auth_token');
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
});
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    if (token) {
        try {
            const decoded = oauth_1.default.verifyJWT(token);
            // Verify user actually exists in database
            const user = yield prisma.user.findUnique({
                where: { id: decoded.userId }
            });
            if (user) {
                req.user = {
                    userId: user.id,
                    email: user.email,
                    name: user.name || '',
                    picture: user.picture || ''
                };
            }
            else {
                // Clear invalid cookie
                res.clearCookie('auth_token');
            }
        }
        catch (error) {
            console.error('Optional auth token verification failed:', error);
            res.clearCookie('auth_token');
        }
    }
    next();
});
exports.optionalAuth = optionalAuth;
