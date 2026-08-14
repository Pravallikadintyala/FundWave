"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
exports.config = {
    port: parseInt(process.env.PORT ?? '5000', 10),
    mongodbUri: requireEnv('MONGODB_URI'),
    jwtSecret: requireEnv('JWT_SECRET'),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/auth/callback',
    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'noreply@fundwave.com',
};
//# sourceMappingURL=env.js.map