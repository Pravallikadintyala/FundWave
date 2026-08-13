"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.config.smtpHost,
    port: env_1.config.smtpPort,
    auth: {
        user: env_1.config.smtpUser,
        pass: env_1.config.smtpPass,
    },
});
const sendPasswordResetEmail = async (to, resetToken) => {
    const resetUrl = `${env_1.config.frontendUrl}/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: env_1.config.emailFrom,
        to,
        subject: 'FundWave Password Reset Request',
        html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email.service.js.map