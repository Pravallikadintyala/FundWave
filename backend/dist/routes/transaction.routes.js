"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const transaction_validator_1 = require("../validators/transaction.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.post('/', transaction_validator_1.validateCreateTransaction, transaction_controller_1.createTransactionHandler);
router.get('/', transaction_validator_1.validateTransactionQuery, transaction_controller_1.getTransactionsHandler);
router.get('/:id', transaction_controller_1.getTransactionByIdHandler);
router.put('/:id', transaction_validator_1.validateUpdateTransaction, transaction_controller_1.updateTransactionHandler);
router.delete('/:id', transaction_controller_1.deleteTransactionHandler);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map