"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../constants");
const notFoundHandler = (req, _res, next) => {
    next(new AppError_1.AppError(`Route not found: ${req.method} ${req.originalUrl}`, constants_1.HTTP_STATUS.NOT_FOUND));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.js.map