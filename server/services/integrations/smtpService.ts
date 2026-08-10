// ─── Integration Service: SMTP Email Service ─────────────────────────────────
// Interfacing with Nodemailer for transactional email delivery & gateway verification.
// All SMTP credentials remain strictly server-side in server/.env. Zero secret leakage.

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
  missingFields: string[];
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
  code?: string;
  accepted?: string[];
  rejected?: string[];
}


export class SMTPIntegrationService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST?.trim() || process.env.MAIL_HOST?.trim();
    const port = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER?.trim() || process.env.SMTP_USERNAME?.trim() || process.env.MAIL_USER?.trim();
    const pass = process.env.SMTP_PASSWORD?.trim() || process.env.SMTP_PASS?.trim() || process.env.MAIL_PASSWORD?.trim();
    const fromAddress = process.env.SMTP_FROM?.trim() || process.env.MAIL_FROM?.trim() || user || 'noreply@pratheeshclement.com';
    const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Pratheesh Control Center';

    const missingFields: string[] = [];
    if (!host) missingFields.push('SMTP_HOST');
    if (!user) missingFields.push('SMTP_USER');
    if (!pass) missingFields.push('SMTP_PASSWORD');

    const hasCreds = missingFields.length === 0;

    if (!hasCreds) {
      return { transporter: null, hasCreds: false, host, port, secure, user, pass, fromAddress, fromName, missingFields };
    }

    const isGmail = host ? host.toLowerCase().includes('gmail') : false;

    const transportOpts: any = isGmail ? {
      service: 'gmail',
      auth: { user, pass },
    } : {
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT || '5000', 10),
      greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || '5000', 10),
      socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '10000', 10),
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(transportOpts);


    return { transporter, hasCreds: true, host, port, secure, user, pass, fromAddress, fromName, missingFields };
  }

  public static getStatusInfo(): SMTPConfigInfo {
    const { hasCreds, host, port, secure, user, pass, fromAddress, missingFields } = this.getTransporter();

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
      message: hasCreds
        ? `SMTP server configured (${host}:${port}).`
        : `SMTP configuration incomplete: ${missingFields.join(', ')} missing in server/.env.`,
      missingFields,
    };
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { transporter, hasCreds, host, port, missingFields } = this.getTransporter();
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
        message: `Authentication Required: ${missingFields.join(', ')} missing in server/.env.`,
        configured: false,
      };
    }

    try {
      const verifyPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP connection timed out after 5000ms. Verify SMTP_HOST, SMTP_PORT, and local firewall settings.')), 5000)
      );
      await Promise.race([verifyPromise, timeoutPromise]);
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
      const friendlyMessage = this.classifySMTPError(err);
      return {
        id: 'smtp',
        name: 'SMTP Email Service',
        category: 'Email',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v2',
        docsUrl: 'https://nodemailer.com/',
        message: `SMTP Notice: ${friendlyMessage}`,
        configured: true,
      };
    }
  }

  public static async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    const { transporter, hasCreds, fromAddress, fromName, missingFields } = this.getTransporter();
    if (!hasCreds || !transporter) {
      return {
        success: false,
        error: `SMTP credentials incomplete in server/.env (${missingFields.join(', ')} missing).`,
        code: 'SMTP_CONFIG_MISSING',
      };
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
        accepted: Array.isArray(info.accepted) ? info.accepted.map(String) : [options.to],
        rejected: Array.isArray(info.rejected) ? info.rejected.map(String) : [],
      };

    } catch (err: any) {
      const friendlyError = this.classifySMTPError(err);
      return {
        success: false,
        error: friendlyError,
        code: err.code || 'SMTP_SEND_FAILED',
      };
    }
  }

  public static classifySMTPError(err: any): string {
    const msg = (err?.message || '').toLowerCase();
    const code = (err?.code || '').toUpperCase();

    if (code === 'EAUTH' || msg.includes('authentication failed') || msg.includes('535') || msg.includes('invalid login')) {
      return 'SMTP authentication failed. If using Gmail, a 16-character Google App Password is required in server/.env (SMTP_PASSWORD).';
    }
    if (code === 'ETIMEDOUT' || msg.includes('timeout') || msg.includes('econnrefused')) {
      return 'SMTP server connection timed out or was refused. Please check SMTP_HOST and SMTP_PORT.';
    }
    if (msg.includes('sender address rejected') || msg.includes('550') || msg.includes('553')) {
      return 'Sender address rejected by SMTP host. Verify process.env.SMTP_FROM matches your account.';
    }
    return err.message || 'Failed to dispatch email via SMTP.';
  }

  public static async sendTestEmail(toEmail: string): Promise<EmailSendResult> {
    const subject = 'Pratheesh Control Center — SMTP Integration Test';
    const text = `Hello,\n\nThis is an automated test email confirming that your server-side SMTP email service in Pratheesh Control Center is operational.\n\nTime: ${new Date().toLocaleString()}\nEnvironment: Express Backend Gateway`;
    return this.sendEmail({ to: toEmail, subject, text });
  }
}
