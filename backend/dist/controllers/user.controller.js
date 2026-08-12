"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const user_service_1 = require("../services/user.service");
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const profile = await (0, user_service_1.getUserProfile)(req.user.id);
    (0, response_1.sendSuccess)(res, { user: profile });
});
exports.updateMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const body = req.body;
    const profile = await (0, user_service_1.updateUserProfile)(req.user.id, body);
    (0, response_1.sendSuccess)(res, { user: profile });
});
//# sourceMappingURL=user.controller.js.map