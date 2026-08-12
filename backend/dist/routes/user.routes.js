"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/me', user_controller_1.getMe);
router.put('/me', user_validator_1.validateUpdateProfile, user_controller_1.updateMe);
exports.default = router;
//# sourceMappingURL=user.routes.js.map