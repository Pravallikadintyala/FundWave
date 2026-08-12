"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const constants_1 = require("../constants");
const sendSuccess = (res, data, statusCode = constants_1.HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
        success: true,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map