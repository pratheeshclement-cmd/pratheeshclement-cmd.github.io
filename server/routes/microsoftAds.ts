// ─── DMOS Backend: Microsoft Advertising API & OAuth Protected Router ─────────
// Authenticated endpoints secured with requireAdminAuth.
// Handles Microsoft Advertising OAuth 2.0 flow, token exchange, and campaign reporting.

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { requireAdminAuth } from '../middleware/auth';
import { MicrosoftAdsIntegrationService } from '../services/integrations/microsoftAdsService';

export const microsoftAdsRouter = Router();

// GET /api/admin/microsoft-ads/oauth/start — Initiate Microsoft Ads OAuth 2.0 Flow
microsoftAdsRouter.get('/oauth/start', requireAdminAuth as any, (req: Request, res: Response) => {
  const clientId = process.env.MICROSOFT_ADS_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID;
  const redirectUri = process.env.MICROSOFT_ADS_REDIRECT_URI || 'http://localhost:5000/api/admin/microsoft-ads/oauth/callback';
  const scope = 'https://ads.microsoft.com/msads.manage offline_access';

  if (!clientId) {
    return res.status(400).json({
      success: false,
      error: 'MICROSOFT_ADS_CLIENT_ID or MICROSOFT_CLIENT_ID is missing in server/.env.',
    });
  }

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `prompt=consent`;

  res.json({ success: true, authUrl });
});

// GET /api/admin/microsoft-ads/oauth/callback — Handle Microsoft Ads OAuth 2.0 Callback
microsoftAdsRouter.get('/oauth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const error = req.query.error as string;
  const frontendUrl = process.env.FRONTEND_URL || 'https://pratheeshclement-cmd.github.io';

  if (error) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Microsoft Ads OAuth Denied</h2>
          <p style="color: #94a3b8;">${error}</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #f59e0b;">ℹ Microsoft Ads OAuth Callback</h2>
          <p style="color: #94a3b8;">No authorization code received. Initiate connection from DMOS Admin Connections Panel.</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }

  const clientId = process.env.MICROSOFT_ADS_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_ADS_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET;
  const redirectUri = process.env.MICROSOFT_ADS_REDIRECT_URI || 'http://localhost:5000/api/admin/microsoft-ads/oauth/callback';

  try {
    const params = new URLSearchParams();
    params.append('client_id', clientId!);
    if (clientSecret) params.append('client_secret', clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);
    params.append('scope', 'https://ads.microsoft.com/msads.manage offline_access');

    const tokenRes = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const refreshToken = tokenRes.data?.refresh_token;

    if (refreshToken) {
      const envPath = path.join(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('MICROSOFT_ADS_REFRESH_TOKEN=')) {
          envContent = envContent.replace(/MICROSOFT_ADS_REFRESH_TOKEN=.*/, `MICROSOFT_ADS_REFRESH_TOKEN=${refreshToken}`);
        } else {
          envContent += `\nMICROSOFT_ADS_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
      process.env.MICROSOFT_ADS_REFRESH_TOKEN = refreshToken;
    }

    res.send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #22c55e;">✔ Microsoft Ads OAuth Successful</h2>
          <p style="color: #94a3b8;">OAuth credentials authorized and refresh token saved securely to server/.env.</p>
          <a href="${frontendUrl}/admin/connections?status=microsoftads_connected" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Microsoft Ads OAuth Token Exchange Failed</h2>
          <p style="color: #94a3b8;">${err.response?.data?.error_description || err.message}</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }
});

// POST /api/admin/microsoft-ads/disconnect — Revoke/Clear Microsoft Ads Token
microsoftAdsRouter.post('/disconnect', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/MICROSOFT_ADS_REFRESH_TOKEN=.*/, 'MICROSOFT_ADS_REFRESH_TOKEN=');
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
    delete process.env.MICROSOFT_ADS_REFRESH_TOKEN;

    res.json({ success: true, message: 'Microsoft Ads disconnected successfully.' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/microsoft-ads/status — Health & Connection Status Verification
microsoftAdsRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MicrosoftAdsIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/microsoft-ads/health — Verification Alias
microsoftAdsRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MicrosoftAdsIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/microsoft-ads/account — Get Connected Account Details
microsoftAdsRouter.get('/account', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const account = await MicrosoftAdsIntegrationService.getAccountDetails();
    res.json(account);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/microsoft-ads/campaigns — Get Real Campaigns List
microsoftAdsRouter.get('/campaigns', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const campaigns = await MicrosoftAdsIntegrationService.getCampaigns();
    res.json(campaigns);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/microsoft-ads/insights?days=28 — Get Performance Insights
microsoftAdsRouter.get('/insights', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const insights = await MicrosoftAdsIntegrationService.getInsights(isNaN(days) ? 28 : days);
    res.json(insights);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
