import { Resend } from 'resend';
import { config } from '../../config/env';
import { getPasswordResetEmailHtml } from './email.templates';

const resend = new Resend(config.resendApiKey);

export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
  if (!config.resendApiKey) {
    console.warn('[Email Service] RESEND_API_KEY is not configured. Email will not be sent.');
    return;
  }

  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const htmlContent = getPasswordResetEmailHtml(resetUrl);

  try {
    const { error } = await resend.emails.send({
      from: config.emailFrom,
      to,
      subject: 'Reset your FundWave password',
      html: htmlContent,
    });

    if (error) {
      console.error('[Email Service] Resend API error:', error.message);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[Email Service] Failed to send password reset email:', errMsg);
  }
};
