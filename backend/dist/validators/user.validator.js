"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProfile = void 0;
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const user_types_1 = require("../types/user.types");
const MAX_FULL_NAME_LENGTH = 80;
const AVATAR_URL_PATTERN = /^https?:\/\/.+/i;
const validateUpdateProfile = (req, _res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return next(new AppError_1.AppError('Request body must be a JSON object', constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const unknownFields = Object.keys(body).filter((key) => !user_types_1.EDITABLE_USER_FIELDS.includes(key));
    if (unknownFields.length > 0) {
        return next(new AppError_1.AppError(`Unknown field(s): ${unknownFields.join(', ')}. Only the following fields can be updated: ${user_types_1.EDITABLE_USER_FIELDS.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const provided = user_types_1.EDITABLE_USER_FIELDS.filter((f) => f in body);
    if (provided.length === 0) {
        return next(new AppError_1.AppError(`At least one of the following fields is required: ${user_types_1.EDITABLE_USER_FIELDS.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
    }
    const { fullName, avatar, currency, timezone } = body;
    if (fullName !== undefined) {
        if (typeof fullName !== 'string' || fullName.trim().length === 0) {
            return next(new AppError_1.AppError('fullName must be a non-empty string', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
        if (fullName.trim().length > MAX_FULL_NAME_LENGTH) {
            return next(new AppError_1.AppError(`fullName must be at most ${MAX_FULL_NAME_LENGTH} characters`, constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (avatar !== undefined) {
        if (typeof avatar !== 'string') {
            return next(new AppError_1.AppError('avatar must be a string URL', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
        if (avatar.length > 0 && !AVATAR_URL_PATTERN.test(avatar)) {
            return next(new AppError_1.AppError('avatar must be a valid http or https URL', constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (currency !== undefined) {
        if (!user_types_1.SUPPORTED_CURRENCIES.includes(currency)) {
            return next(new AppError_1.AppError(`currency must be one of: ${user_types_1.SUPPORTED_CURRENCIES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    if (timezone !== undefined) {
        if (!user_types_1.SUPPORTED_TIMEZONES.includes(timezone)) {
            return next(new AppError_1.AppError(`timezone must be one of: ${user_types_1.SUPPORTED_TIMEZONES.join(', ')}`, constants_1.HTTP_STATUS.BAD_REQUEST));
        }
    }
    next();
};
exports.validateUpdateProfile = validateUpdateProfile;
//# sourceMappingURL=user.validator.js.map