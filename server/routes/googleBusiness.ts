// ─── DMOS Backend: Google Business Profile Protected Router ────────────────────
// Authenticated endpoints secured with requireAdminAuth.
// Strictly Read-Only operations & OAuth 2.0 Authorization Flow.

import { Router, Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '../middleware/auth';
import { GoogleBusinessIntegrationService } from '../services/integrations/googleBusinessService';

export const googleBusinessRouter = Router();

// GET /api/admin/google-business/status
googleBusinessRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleBusinessIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-business/health
googleBusinessRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleBusinessIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-business/oauth/start
googleBusinessRouter.get('/oauth/start', requireAdminAuth as any, (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({ success: false, error: 'GOOGLE_BUSINESS_CLIENT_ID is not configured in server/.env' });
  }

  const redirectUri = process.env.GOOGLE_BUSINESS_REDIRECT_URI || 'http://localhost:5000/api/admin/google-business/oauth/callback';
  const rawScope = 'https://www.googleapis.com/auth/business.manage';
  const scope = encodeURIComponent(rawScope);

  // Diagnostic logging (strictly non-secret metadata)
  console.log('[Google Business OAuth] Initiation request:');
  console.log(`  Client ID configured: ${Boolean(clientId)}`);
  console.log(`  Redirect URI: ${redirectUri}`);
  console.log(`  Scope: ${rawScope}`);

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  res.json({
    success: true,
    authUrl,
    redirectUri,
    message: 'Visit authUrl to authorize Google Business Profile API read-only access.',
  });
});

// GET /api/admin/google-business/oauth/callback (Public endpoint hit by Google Redirect)
googleBusinessRouter.get('/oauth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const oauthError = req.query.error as string;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Safe diagnostic logging (strictly metadata, zero credential values)
  console.log('[Google Business OAuth Callback] Request received:');
  console.log(`  OAuth callback reached: true`);
  console.log(`  Authorization code received: ${Boolean(code)}`);
  console.log(`  OAuth error received: ${Boolean(oauthError)}`);

  // Handle Google OAuth error parameters (e.g. access_denied)
  if (oauthError) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">⚠ Google Authorization Cancelled or Denied</h2>
          <p style="color: #94a3b8;">Google returned error: <code>${oauthError}</code></p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }

  // Handle missing code parameter (direct browser visit without parameters)
  if (!code) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #f59e0b;">ℹ Google Business Profile OAuth Callback</h2>
          <p style="color: #94a3b8;">No authorization parameters received. Please initiate authorization from DMOS Admin Connections Panel.</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_BUSINESS_REDIRECT_URI || 'http://localhost:5000/api/admin/google-business/oauth/callback';

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const refreshToken = tokenRes.data?.refresh_token;
    console.log(`  Refresh token received: ${Boolean(refreshToken)}`);

    if (refreshToken) {
      // Securely update server/.env on disk without echoing secret values
      const envPath = path.join(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('GOOGLE_BUSINESS_REFRESH_TOKEN=')) {
          envContent = envContent.replace(/GOOGLE_BUSINESS_REFRESH_TOKEN=.*/, `GOOGLE_BUSINESS_REFRESH_TOKEN=${refreshToken}`);
        } else {
          envContent += `\nGOOGLE_BUSINESS_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
        process.env.GOOGLE_BUSINESS_REFRESH_TOKEN = refreshToken;
      }
    }

    res.send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #22c55e;">✔ Google Business Profile OAuth Successful</h2>
          <p style="color: #94a3b8;">Refresh token saved securely to server/.env.</p>
          <a href="${frontendUrl}/admin/connections?status=google_business_connected" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.log(`  Token exchange failed: ${err.message}`);
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">⚠ OAuth Token Exchange Failed</h2>
          <p style="color: #94a3b8;">Error: ${err.response?.data?.error_description || err.message}</p>
          <a href="${frontendUrl}/admin/connections" style="color: #3b63ff; text-decoration: none;">Return to DMOS Connections Panel</a>
        </body>
      </html>
    `);
  }
});

// GET /api/admin/google-business/locations
googleBusinessRouter.get('/locations', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const locations = await GoogleBusinessIntegrationService.getLocations();
    res.json(locations);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-business/performance?days=28
googleBusinessRouter.get('/performance', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const performance = await GoogleBusinessIntegrationService.getPerformance(isNaN(days) ? 28 : days);
    res.json(performance);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
