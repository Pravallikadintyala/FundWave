import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: config.emailFrom,
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
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // In production, you might want to throw this or handle it depending on requirements.
    // For local dev without a real SMTP, it will fail but we shouldn't crash the app if they don't have SMTP set up.
  }
};
