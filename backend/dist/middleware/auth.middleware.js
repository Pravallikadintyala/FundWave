"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const isJwtPayload = (value) => {
    return (typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'email' in value &&
        typeof value.id === 'string' &&
        typeof value.email === 'string');
};
exports.protect = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError_1.AppError('No token provided', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AppError_1.AppError('No token provided', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const blacklisted = await models_1.BlacklistedToken.findOne({ token });
    if (blacklisted) {
        throw new AppError_1.AppError('Token has been revoked. Please log in again.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
    if (!isJwtPayload(decoded)) {
        throw new AppError_1.AppError('Invalid token payload', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    req.user = decoded;
    next();
});
//# sourceMappingURL=auth.middleware.js.map