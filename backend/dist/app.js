"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.config.isDevelopment ? '*' : process.env.ALLOWED_ORIGINS?.split(',') ?? [],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)(env_1.config.isDevelopment ? 'dev' : 'combined'));
    app.use(express_1.default.json({ limit: '10kb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
    app.use('/api', routes_1.default);
    app.use(middleware_1.notFoundHandler);
    app.use(middleware_1.errorHandler);
    return app;
};
exports.default = createApp;
//# sourceMappingURL=app.js.map