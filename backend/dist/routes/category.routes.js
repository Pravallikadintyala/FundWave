"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/', category_validator_1.validateCreateCategory, category_controller_1.createCategoryHandler);
router.get('/', category_controller_1.getCategoriesHandler);
router.put('/:id', category_validator_1.validateUpdateCategory, category_controller_1.updateCategoryHandler);
router.delete('/:id', category_controller_1.deleteCategoryHandler);
exports.default = router;
//# sourceMappingURL=category.routes.js.map