"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    let statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
        const messages = Object.values(err.errors).map((e) => e.message);
        message = messages.join(', ');
    }
    else if (err.code === '11000') {
        statusCode = constants_1.HTTP_STATUS.CONFLICT;
        message = 'A resource with the provided value already exists';
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
        message = `Invalid value for field: ${err.path}`;
    }
    if (!env_1.config.isProduction) {
        console.error('💥 ERROR:', err);
    }
    const body = { success: false, message };
    if (env_1.config.isDevelopment && err.stack) {
        body.stack = err.stack;
    }
    res.status(statusCode).json(body);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map