// ─── Integration Service: SMTP Email Service ─────────────────────────────────
// Interfacing with Nodemailer for transactional email delivery & gateway verification.
// All SMTP credentials remain strictly server-side in server/.env.

import nodemailer from 'nodemailer';
import { ProviderHealthResult } from './integrationTypes';

export interface SMTPConfigInfo {
  configured: boolean;
  host: string;
  port: number;
  secure: boolean;
  userConfigured: boolean;
  passConfigured: boolean;
  fromConfigured: boolean;
  fromAddress: string;
  status: string;
  message: string;
}

export interface EmailSendOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SMTPIntegrationService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST?.trim();
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASSWORD?.trim();
    const fromAddress = process.env.SMTP_FROM?.trim() || user || 'noreply@pratheeshclement.com';
    const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Pratheesh Clement OS';

    const hasCreds = Boolean(host && user && pass);

    if (!hasCreds) {
      return { transporter: null, hasCreds: false, host, port, secure, user, pass, fromAddress, fromName };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT || '10000', 10),
      greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || '5000', 10),
      socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '15000', 10),
    });

    return { transporter, hasCreds: true, host, port, secure, user, pass, fromAddress, fromName };
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { transporter, hasCreds, host, port } = this.getTransporter();
    const start = Date.now();

    if (!hasCreds || !transporter) {
      return {
        id: 'smtp',
        name: 'SMTP Email Service',
        category: 'Email',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v2',
        docsUrl: 'https://nodemailer.com/',
        message: 'Authentication Required. Configure SMTP_HOST, SMTP_USER, & SMTP_PASSWORD in server/.env.',
        configured: false,
      };
    }

    try {
      await transporter.verify();
      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'smtp',
        name: 'SMTP Email Service',
        category: 'Email',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v2',
        docsUrl: 'https://nodemailer.com/',
        message: `SMTP Host ${host}:${port} authenticated & verified.`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'smtp',
        name: 'SMTP Email Service',
        category: 'Email',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v2',
        docsUrl: 'https://nodemailer.com/',
        message: `SMTP Authentication Notice: ${err.message}`,
        configured: true,
      };
    }
  }

  public static getStatusInfo(): SMTPConfigInfo {
    const { hasCreds, host, port, secure, user, pass, fromAddress } = this.getTransporter();

    return {
      configured: hasCreds,
      host: host || 'smtp.gmail.com',
      port: port || 587,
      secure,
      userConfigured: Boolean(user && user.length > 0),
      passConfigured: Boolean(pass && pass.length > 0),
      fromConfigured: Boolean(fromAddress && fromAddress.length > 0),
      fromAddress: fromAddress || 'pratheesh.clement@gmail.com',
      status: hasCreds ? 'configured' : 'auth_required',
      message: hasCreds ? 'SMTP server configuration loaded.' : 'SMTP credentials missing in server/.env.',
    };
  }

  public static async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    const { transporter, hasCreds, fromAddress, fromName } = this.getTransporter();
    if (!hasCreds || !transporter) {
      return { success: false, error: 'SMTP credentials missing in server/.env file.' };
    }

    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text.replace(/\n/g, '<br/>'),
        replyTo: options.replyTo || process.env.SMTP_REPLY_TO || fromAddress,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to dispatch email via SMTP.',
      };
    }
  }

  public static async sendTestEmail(toEmail: string): Promise<EmailSendResult> {
    const subject = 'Pratheesh OS — SMTP Email Integration Verification Test';
    const text = `Hello,\n\nThis is an automated test email confirming that your server-side SMTP email service in Pratheesh OS is operational.\n\nTime: ${new Date().toLocaleString()}\nEnvironment: Express Backend Gateway`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #6366f1; margin-top: 0;">Pratheesh OS — SMTP Gateway Active</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          This test email confirms that your server-side <strong>Nodemailer SMTP Integration</strong> is successfully authenticated and delivering emails.
        </p>
        <div style="padding: 16px; background-color: #1e293b; border-left: 4px solid #10b981; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8; font-family: monospace;">STATUS: HTTP 200 OK — VERIFIED AT ${new Date().toISOString()}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">Pratheesh Clement Personal Portfolio & Admin Control Center</p>
      </div>
    `;

    return this.sendEmail({ to: toEmail, subject, text, html });
  }
}
