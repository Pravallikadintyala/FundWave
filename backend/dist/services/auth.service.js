"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.handleGoogleCallback = exports.getGoogleAuthUrl = exports.logoutUser = exports.loginUser = exports.signupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../config/env");
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const category_service_1 = require("./category.service");
const email_service_1 = require("./email.service");
const constants_1 = require("../constants");
const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '7d';
const googleClient = new google_auth_library_1.OAuth2Client(env_1.config.googleClientId, env_1.config.googleClientSecret, env_1.config.googleCallbackUrl);
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwtSecret, { expiresIn: JWT_EXPIRES_IN });
};
const buildPublicUser = (user) => ({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    currency: user.currency,
    timezone: user.timezone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
const signupUser = async (body) => {
    const { email, password, fullName } = body;
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await models_1.User.findOne({ email: normalizedEmail });
    if (existing) {
        throw new AppError_1.AppError('Email is already registered', constants_1.HTTP_STATUS.CONFLICT);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const newUser = await models_1.User.create({
        email: normalizedEmail,
        fullName: fullName.trim(),
        password: hashedPassword,
        authProvider: 'local',
    });
    await (0, category_service_1.seedDefaultCategories)(newUser._id.toString());
    return {
        user: buildPublicUser(newUser),
    };
};
exports.signupUser = signupUser;
const loginUser = async (body) => {
    const { email, password } = body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await models_1.User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || user.authProvider !== 'local') {
        throw new AppError_1.AppError('Invalid email or password', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new AppError_1.AppError('Invalid email or password', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const token = signToken({ id: user._id.toString(), email: user.email });
    return {
        token,
        user: buildPublicUser(user),
    };
};
exports.loginUser = loginUser;
const logoutUser = async (token) => {
    await models_1.BlacklistedToken.create({ token });
};
exports.logoutUser = logoutUser;
const getGoogleAuthUrl = () => {
    return googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent'
    });
};
exports.getGoogleAuthUrl = getGoogleAuthUrl;
const handleGoogleCallback = async (code) => {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);
    const response = await googleClient.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' });
    const data = response.data;
    if (!data.email_verified) {
        throw new AppError_1.AppError('Google email is not verified', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const normalizedEmail = data.email.toLowerCase();
    let user = await models_1.User.findOne({ email: normalizedEmail });
    if (user) {
        if (user.authProvider !== 'google') {
            user.authProvider = 'google';
            await user.save();
        }
    }
    else {
        user = await models_1.User.create({
            email: normalizedEmail,
            fullName: data.name,
            avatar: data.picture,
            authProvider: 'google',
        });
        await (0, category_service_1.seedDefaultCategories)(user._id.toString());
    }
    const token = signToken({ id: user._id.toString(), email: user.email });
    return {
        token,
        user: buildPublicUser(user),
    };
};
exports.handleGoogleCallback = handleGoogleCallback;
const forgotPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await models_1.User.findOne({ email: normalizedEmail, authProvider: 'local' });
    if (!user) {
        return;
    }
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await (0, email_service_1.sendPasswordResetEmail)(user.email, resetToken);
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await models_1.User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new AppError_1.AppError('Token is invalid or has expired', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    user.password = await bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.service.js.map