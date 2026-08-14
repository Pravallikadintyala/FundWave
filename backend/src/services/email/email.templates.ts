export const getPasswordResetEmailHtml = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your FundWave password</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
      line-height: 1.5;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 24px;
      color: #111827;
      margin: 0;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      margin-top: 32px;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FundWave</h1>
    </div>
    <p>Hello,</p>
    <p>You requested a password reset for your FundWave account. Click the button below to set a new password.</p>
    <div class="button-container">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 15 minutes.</p>
    <div class="footer">
      <p>If you did not request a password reset, you can safely ignore this email. Your password will not change until you access the link above and create a new one.</p>
    </div>
  </div>
</body>
</html>
`;
