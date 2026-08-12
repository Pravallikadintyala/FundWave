"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const user_types_1 = require("../types/user.types");
const toProfileData = (user) => ({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    currency: user.currency,
    timezone: user.timezone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
const getUserProfile = async (userId) => {
    const user = await models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    return toProfileData(user);
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (userId, body) => {
    const updates = {};
    for (const field of user_types_1.EDITABLE_USER_FIELDS) {
        if (field in body) {
            const value = body[field];
            updates[field] = typeof value === 'string' ? value.trim() : value;
        }
    }
    const updatedUser = await models_1.User.findByIdAndUpdate(userId, { $set: updates }, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!updatedUser) {
        throw new AppError_1.AppError('User not found', constants_1.HTTP_STATUS.NOT_FOUND);
    }
    return toProfileData(updatedUser);
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.service.js.map