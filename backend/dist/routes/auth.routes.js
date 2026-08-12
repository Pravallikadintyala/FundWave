"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/signup', auth_validator_1.validateSignup, auth_controller_1.signup);
router.post('/login', auth_validator_1.validateLogin, auth_controller_1.login);
router.get('/google', auth_controller_1.googleAuth);
router.get('/google/callback', auth_controller_1.googleCallback);
router.post('/forgot-password', auth_controller_1.requestPasswordReset);
router.post('/reset-password', auth_controller_1.confirmPasswordReset);
router.get('/profile', auth_middleware_1.protect, auth_controller_1.getProfile);
router.post('/logout', auth_middleware_1.protect, auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map