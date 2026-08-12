"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_types_1 = require("../types/user.types");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        select: false,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: [80, 'Full name must be at most 80 characters'],
    },
    avatar: {
        type: String,
        trim: true,
    },
    currency: {
        type: String,
        enum: {
            values: user_types_1.SUPPORTED_CURRENCIES,
            message: `Currency must be one of: ${user_types_1.SUPPORTED_CURRENCIES.join(', ')}`,
        },
        default: 'INR',
    },
    timezone: {
        type: String,
        enum: {
            values: user_types_1.SUPPORTED_TIMEZONES,
            message: `Timezone must be one of: ${user_types_1.SUPPORTED_TIMEZONES.join(', ')}`,
        },
        default: 'Asia/Kolkata',
    },
}, {
    timestamps: true,
    versionKey: false,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map