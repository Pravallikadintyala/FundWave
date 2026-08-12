"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const savings_validator_1 = require("../validators/savings.validator");
const savings_controller_1 = require("../controllers/savings.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/', savings_validator_1.validateCreateSavingsGoal, savings_controller_1.createGoal);
router.get('/', savings_controller_1.getGoals);
router.get('/:id', savings_controller_1.getGoalById);
router.put('/:id', savings_validator_1.validateUpdateSavingsGoal, savings_controller_1.updateGoal);
router.delete('/:id', savings_controller_1.deleteGoal);
router.post('/:id/contribute', savings_validator_1.validateContribute, savings_controller_1.contributeToGoal);
exports.default = router;
//# sourceMappingURL=savings.routes.js.map