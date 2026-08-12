"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const savings_routes_1 = __importDefault(require("./savings.routes"));
const ai_routes_1 = __importDefault(require("./ai.routes"));
const router = (0, express_1.Router)();
router.use('/health', health_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/savings-goals', savings_routes_1.default);
router.use('/ai', ai_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map