"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blacklistedTokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
}, {
    versionKey: false,
});
const BlacklistedToken = (0, mongoose_1.model)('BlacklistedToken', blacklistedTokenSchema);
exports.default = BlacklistedToken;
//# sourceMappingURL=blacklistedToken.model.js.map