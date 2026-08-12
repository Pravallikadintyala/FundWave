"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateSignup = void 0;
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validateSignup = (req, _res, next) => {
    const { email, password, fullName } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return next(new AppError_1.AppError('A valid email is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
        return next(new AppError_1.AppError('Full name is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
        return next(new AppError_1.AppError('Password is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return next(new AppError_1.AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateSignup = validateSignup;
const validateLogin = (req, _res, next) => {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return next(new AppError_1.AppError('A valid email is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
        return next(new AppError_1.AppError('Password is required', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
exports.validateLogin = validateLogin;
//# sourceMappingURL=auth.validator.js.map