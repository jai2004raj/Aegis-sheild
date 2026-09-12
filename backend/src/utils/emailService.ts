import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface SendCredentialsParams {
  to: string;
  recipientName: string;
  role: 'COMPANY' | 'WORKER';
  id: string;
  email: string;
  password: string;
  loginUrl?: string;
}

// Create a transporter using environment variables or fallback to a local ethereal/test transporter
const createTransporter = async () => {
  dotenv.config();
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim().replace(/\s+/g, '');

  // Option 1: Direct Gmail Service
  if (emailUser && emailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Option 2: Custom SMTP Host (SendGrid, Brevo, Mailgun, etc.)
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '');
  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Option 3: Fallback simulated test account (Ethereal Email)
  console.warn('[EmailService] ⚠️ No real SMTP or Gmail credentials configured in backend/.env.');
  console.warn('[EmailService] 💡 To deliver real emails to actual inboxes, configure EMAIL_USER and EMAIL_PASS in backend/.env.');
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
};

export const sendCredentialsEmail = async (params: SendCredentialsParams): Promise<{ success: boolean; previewUrl?: string | false }> => {
  try {
    const { to, recipientName, role, id, email, password, loginUrl } = params;
    const resolvedLoginUrl = loginUrl || process.env.FRONTEND_URL || 'http://localhost:5173/login';
    const fromAddress =
      process.env.EMAIL_FROM ||
      (process.env.EMAIL_USER
        ? `"Security Agency Platform" <${process.env.EMAIL_USER}>`
        : '"Security Agency Platform" <noreply@securityagency.com>');

    const roleTitle = role === 'COMPANY' ? 'Client Organization Portal' : 'Security Guard & Worker Portal';
    const roleBadgeColor = role === 'COMPANY' ? '#3b82f6' : '#f59e0b';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a, #1e1b4b); padding: 30px; text-align: center; border-bottom: 1px solid #1e293b; }
        .header h1 { margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px; }
        .badge { display: inline-block; padding: 4px 12px; margin-top: 10px; background-color: ${roleBadgeColor}20; color: ${roleBadgeColor}; border: 1px solid ${roleBadgeColor}50; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .content { padding: 30px; }
        .greeting { font-size: 15px; color: #cbd5e1; margin-bottom: 20px; }
        .credentials-card { background-color: #020617; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .cred-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #1e293b; }
        .cred-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .cred-label { font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
        .cred-value { font-size: 14px; font-family: monospace; font-weight: bold; color: #ffffff; }
        .password-val { color: #f59e0b; }
        .btn-container { text-align: center; margin: 30px 0 10px 0; }
        .btn { display: inline-block; background-color: #f59e0b; color: #020617; text-decoration: none; padding: 12px 30px; border-radius: 10px; font-weight: 800; font-size: 14px; }
        .notice { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 25px; border-top: 1px solid #1e293b; padding-top: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #475569; background-color: #020617; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Security Agency Portal</h1>
          <span class="badge">${roleTitle}</span>
        </div>
        <div class="content">
          <p class="greeting">Hello <strong>${recipientName}</strong>,</p>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            Your account has been successfully registered on the Security Agency Management & Workforce Allocation Platform. Below are your official login credentials to access your portal:
          </p>

          <div class="credentials-card">
            <div class="cred-row">
              <span class="cred-label">Assigned ID</span>
              <span class="cred-value">${id}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Email / Username</span>
              <span class="cred-value">${email}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Initial Password</span>
              <span class="cred-value password-val">${password}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">System Role</span>
              <span class="cred-value">${role}</span>
            </div>
          </div>

          <div class="btn-container">
            <a href="${resolvedLoginUrl}" class="btn">Log In To Portal &rarr;</a>
          </div>

          <div class="notice">
            <strong>Security Notice:</strong> For your security, please update your temporary password immediately after logging into your dashboard. If you did not request this account, please contact our security administration team.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Security Agency Platform. Confidential & Privileged Dispatch.
        </div>
      </div>
    </body>
    </html>
    `;

    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `🛡️ Your Security Agency Portal Login Credentials [${id}]`,
      text: `Hello ${recipientName},\n\nYour account has been registered on the Security Agency Platform.\n\nAssigned ID: ${id}\nEmail: ${email}\nPassword: ${password}\nRole: ${role}\nLogin URL: ${resolvedLoginUrl}\n\nPlease update your password after logging in.`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[EmailService] Credentials email dispatched to ${to} (${id}). MessageId: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[EmailService] 🔗 Preview Email Online: ${previewUrl}`);
    }

    return { success: true, previewUrl };
  } catch (error: any) {
    console.error(`[EmailService] Failed to send credentials email to ${params.to}:`, error.message);
    return { success: false };
  }
};
