"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPasswordReset = exports.requestPasswordReset = exports.googleCallback = exports.googleAuth = exports.getProfile = exports.logout = exports.login = exports.signup = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const constants_1 = require("../constants");
const env_1 = require("../config/env");
const auth_service_1 = require("../services/auth.service");
const AppError_1 = require("../utils/AppError");
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = req.body;
    const data = await (0, auth_service_1.signupUser)(body);
    (0, response_1.sendSuccess)(res, data, constants_1.HTTP_STATUS.CREATED);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = req.body;
    const data = await (0, auth_service_1.loginUser)(body);
    (0, response_1.sendSuccess)(res, data);
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError('No token provided', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    await (0, auth_service_1.logoutUser)(token);
    (0, response_1.sendSuccess)(res, { message: 'Logged out successfully' });
});
const getProfile = (req, res) => {
    (0, response_1.sendSuccess)(res, { user: req.user });
};
exports.getProfile = getProfile;
exports.googleAuth = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const url = (0, auth_service_1.getGoogleAuthUrl)();
    res.redirect(url);
});
exports.googleCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.redirect(`${env_1.config.frontendUrl}/login?error=oauth_failed`);
        return;
    }
    try {
        const data = await (0, auth_service_1.handleGoogleCallback)(code);
        res.redirect(`${env_1.config.frontendUrl}/auth/callback?token=${data.token}`);
    }
    catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error('[Google OAuth] Callback failed:', errMsg);
        if (err instanceof Error && err.stack) {
            console.error('[Google OAuth] Stack:', err.stack);
        }
        res.redirect(`${env_1.config.frontendUrl}/login?error=oauth_failed&reason=${encodeURIComponent(errMsg)}`);
    }
});
exports.requestPasswordReset = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.AppError('Email is required', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    await (0, auth_service_1.forgotPassword)(email);
    (0, response_1.sendSuccess)(res, { message: 'If an account with that email exists, we sent a password reset link.' });
});
exports.confirmPasswordReset = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        throw new AppError_1.AppError('Token and new password are required', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    await (0, auth_service_1.resetPassword)(token, newPassword);
    (0, response_1.sendSuccess)(res, { message: 'Password has been reset successfully.' });
});
//# sourceMappingURL=auth.controller.js.map