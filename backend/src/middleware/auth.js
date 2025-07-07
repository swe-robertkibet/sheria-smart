"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const oauth_1 = __importDefault(require("../services/oauth"));
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = oauth_1.default.verifyJWT(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    if (token) {
        try {
            const decoded = oauth_1.default.verifyJWT(token);
            req.user = decoded;
        }
        catch (error) {
            console.error('Optional auth token verification failed:', error);
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
