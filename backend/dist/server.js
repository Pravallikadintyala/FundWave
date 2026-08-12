"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
const startServer = async () => {
    await (0, database_1.connectDB)();
    const app = (0, app_1.default)();
    const server = app.listen(env_1.config.port, () => {
        console.log(`FundWave API running on http://localhost:${env_1.config.port} [${env_1.config.nodeEnv}]`);
    });
    const shutdown = (signal) => {
        console.log(`\n ${signal} received. Shutting down gracefully...`);
        server.close(() => {
            console.log(' HTTP server closed');
            process.exit(0);
        });
        setTimeout(() => {
            console.error(' Forced shutdown after timeout');
            process.exit(1);
        }, 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        console.error(' Unhandled Rejection:', reason);
        server.close(() => process.exit(1));
    });
    process.on('uncaughtException', (error) => {
        console.error(' Uncaught Exception:', error.message);
        process.exit(1);
    });
};
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map