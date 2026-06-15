const transporter = require("../config/nodemailer");

class EmailService {
  async sendEmail({ to, subject, html }) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Quality Caps Registry" <registry@qwality-caps.com>',
        to,
        subject,
        html,
      });
      console.log(`Email dispatched successfully to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error("Nodemailer Email dispatch failed: ", error);
      // Fail silently in development/mock environments to prevent blocking workflows
      return null;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CORS_ORIGIN || "http://localhost:3000"}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ECEAE3;">
        <h2 style="color: #0F2744; font-family: Cinzel, serif;">Welcome to Quality Caps</h2>
        <p>Please click the button below to verify your email registry and unlock access to the boutique:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #C8A96A; color: #0F2744; text-decoration: none; font-weight: bold; margin: 20px 0;">Verify Account</a>
        <p>If you did not request this, please disregard this notification.</p>
      </div>
    `;
    return await this.sendEmail({ to: email, subject: "Verify your Quality Caps Account", html });
  }

  async sendResetPasswordEmail(email, token) {
    const resetUrl = `${process.env.CORS_ORIGIN || "http://localhost:3000"}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ECEAE3;">
        <h2 style="color: #0F2744; font-family: Cinzel, serif;">Password Reset Request</h2>
        <p>We received a passcode reset request. Click the link below to configure your new credentials:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0F2744; color: #C8A96A; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p>This credential reset link will expire in 1 hour.</p>
      </div>
    `;
    return await this.sendEmail({ to: email, subject: "Quality Caps Password Reset", html });
  }
}

module.exports = new EmailService();
