"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const dashboard_service_1 = require("../services/dashboard.service");
exports.getDashboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const data = await (0, dashboard_service_1.getDashboardData)(req.user.id);
    (0, response_1.sendSuccess)(res, data);
});
//# sourceMappingURL=dashboard.controller.js.map