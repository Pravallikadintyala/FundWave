"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const response_1 = require("../utils/response");
const getHealth = (_req, res) => {
    (0, response_1.sendSuccess)(res, { status: 'OK' });
};
exports.getHealth = getHealth;
//# sourceMappingURL=health.controller.js.map