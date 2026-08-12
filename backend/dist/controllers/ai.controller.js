"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const ai_service_1 = require("../services/ai.service");
exports.getInsights = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const insights = await (0, ai_service_1.getAIInsights)(req.user.id);
    (0, response_1.sendSuccess)(res, { insights });
});
//# sourceMappingURL=ai.controller.js.map