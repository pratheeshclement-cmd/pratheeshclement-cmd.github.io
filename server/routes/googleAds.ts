// ─── DMOS Backend: Google Ads REST API & OAuth Protected Router ─────────────────
// Authenticated endpoints secured with requireAdminAuth.
// Handles Google Ads OAuth 2.0 flow, token exchange, and campaign reporting.

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { requireAdminAuth } from '../middleware/auth';
import { GoogleAdsIntegrationService } from '../services/integrations/googleAdsService';

export const googleAdsRouter = Router();

// GET /api/admin/google-ads/oauth/start — Initiate Google Ads OAuth 2.0 Flow
googleAdsRouter.get('/oauth/start', requireAdminAuth as any, (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || 'http://localhost:5000/api/admin/google-ads/oauth/callback';
  const scope = 'https://www.googleapis.com/auth/adwords';

  if (!clientId) {
    return res.status(400).json({
      success: false,
      error: 'GOOGLE_ADS_CLIENT_ID or GOOGLE_CLIENT_ID is missing in server/.env.',
    });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.json({ success: true, authUrl });
});

// GET /api/admin/google-ads/oauth/callback — Handle Google Ads OAuth 2.0 Callback
googleAdsRouter.get('/oauth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const error = req.query.error as string;
  const frontendUrl = process.env.FRONTEND_URL || 'https://pratheeshclement-cmd.github.io';

  if (error) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Google Ads OAuth Denied</h2>
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
          <h2 style="color: #f59e0b;">ℹ Google Ads OAuth Callback</h2>
          <p style="color: #94a3b8;">No authorization code received. Initiate connection from DMOS Admin Connections Panel.</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI || 'http://localhost:5000/api/admin/google-ads/oauth/callback';

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const refreshToken = tokenRes.data?.refresh_token;

    if (refreshToken) {
      const envPath = path.join(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('GOOGLE_ADS_REFRESH_TOKEN=')) {
          envContent = envContent.replace(/GOOGLE_ADS_REFRESH_TOKEN=.*/, `GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}`);
        } else {
          envContent += `\nGOOGLE_ADS_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
      process.env.GOOGLE_ADS_REFRESH_TOKEN = refreshToken;
    }

    res.send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #22c55e;">✔ Google Ads OAuth Successful</h2>
          <p style="color: #94a3b8;">OAuth credentials authorized and token saved securely to server/.env.</p>
          <a href="${frontendUrl}/admin/connections?status=googleads_connected" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Google Ads OAuth Token Exchange Failed</h2>
          <p style="color: #94a3b8;">${err.response?.data?.error_description || err.message}</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }
});

// POST /api/admin/google-ads/disconnect — Revoke/Clear Google Ads Token
googleAdsRouter.post('/disconnect', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/GOOGLE_ADS_REFRESH_TOKEN=.*/, 'GOOGLE_ADS_REFRESH_TOKEN=');
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
    delete process.env.GOOGLE_ADS_REFRESH_TOKEN;

    res.json({ success: true, message: 'Google Ads disconnected successfully.' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/status — Health & Connection Status Verification
googleAdsRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleAdsIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/health — Verification Alias
googleAdsRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleAdsIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/account — Get Connected Account Details
googleAdsRouter.get('/account', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const account = await GoogleAdsIntegrationService.getAccountDetails();
    res.json(account);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/campaigns — Get Real Campaigns List
googleAdsRouter.get('/campaigns', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const campaigns = await GoogleAdsIntegrationService.getCampaigns();
    res.json(campaigns);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/insights?days=28 — Get Performance Insights
googleAdsRouter.get('/insights', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const insights = await GoogleAdsIntegrationService.getInsights(isNaN(days) ? 28 : days);
    res.json(insights);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
