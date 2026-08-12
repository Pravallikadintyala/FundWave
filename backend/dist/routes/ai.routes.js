"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/insights', ai_controller_1.getInsights);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map