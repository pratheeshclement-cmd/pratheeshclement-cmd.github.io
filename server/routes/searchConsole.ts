// ─── DMOS Backend: Search Console Protected Router ───────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { requireAdminAuth } from '../middleware/auth';
import { GSCIntegrationService } from '../services/integrations/gscService';

export const searchConsoleRouter = Router();

// GET /api/admin/search-console/oauth/start — Initiate Search Console OAuth Flow
searchConsoleRouter.get('/oauth/start', requireAdminAuth as any, (req: Request, res: Response) => {
  const clientId = process.env.GSC_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GSC_REDIRECT_URI || 'http://localhost:5000/api/admin/search-console/oauth/callback';
  const scope = 'https://www.googleapis.com/auth/webmasters.readonly';

  if (!clientId) {
    return res.status(400).json({
      success: false,
      error: 'GSC_CLIENT_ID or GOOGLE_CLIENT_ID is missing in server/.env.',
    });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `access_type=offline&` +
    `prompt=consent`;

  if (req.headers.accept?.includes('application/json') || req.query.json === 'true') {
    return res.json({ success: true, authUrl });
  }

  res.redirect(authUrl);
});

// GET /api/admin/search-console/oauth/callback — Handle OAuth Callback
searchConsoleRouter.get('/oauth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const error = req.query.error as string;
  const frontendUrl = process.env.FRONTEND_URL || 'https://pratheeshclement-cmd.github.io';

  if (error) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Google Search Console OAuth Denied</h2>
          <p style="color: #94a3b8;">${error}</p>
          <a href="${frontendUrl}/admin/seo" style="color: #3b63ff; text-decoration: none;">Return to DMOS SEO Center</a>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #f59e0b;">ℹ Search Console OAuth Callback</h2>
          <p style="color: #94a3b8;">No authorization code received.</p>
          <a href="${frontendUrl}/admin/seo" style="color: #3b63ff; text-decoration: none;">Return to DMOS SEO Center</a>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GSC_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GSC_REDIRECT_URI || 'http://localhost:5000/api/admin/search-console/oauth/callback';

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
        if (envContent.includes('GSC_REFRESH_TOKEN=')) {
          envContent = envContent.replace(/GSC_REFRESH_TOKEN=.*/, `GSC_REFRESH_TOKEN=${refreshToken}`);
        } else {
          envContent += `\nGSC_REFRESH_TOKEN=${refreshToken}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
      process.env.GSC_REFRESH_TOKEN = refreshToken;
    }

    GSCIntegrationService.clearCache();

    res.redirect(`${frontendUrl}/admin/seo?status=gsc_connected`);
  } catch (err: any) {
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">❌ Search Console OAuth Token Exchange Failed</h2>
          <p style="color: #94a3b8;">${err.response?.data?.error_description || err.message}</p>
          <a href="${frontendUrl}/admin/seo" style="color: #3b63ff; text-decoration: none;">Return to DMOS SEO Center</a>
        </body>
      </html>
    `);
  }
});

// POST /api/admin/search-console/disconnect
searchConsoleRouter.post('/disconnect', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/GSC_REFRESH_TOKEN=.*/, 'GSC_REFRESH_TOKEN=');
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
    delete process.env.GSC_REFRESH_TOKEN;
    GSCIntegrationService.clearCache();

    res.json({ success: true, message: 'Google Search Console disconnected successfully.' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/diagnostics (Phase 25)
searchConsoleRouter.get('/diagnostics', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const diag = await GSCIntegrationService.getDiagnostics();
    res.json(diag);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/status
searchConsoleRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const health = await GSCIntegrationService.verify();
    res.json(health);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/sites
searchConsoleRouter.get('/sites', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const result = await GSCIntegrationService.listSites();
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/overview?days=28&siteUrl=...
searchConsoleRouter.get('/overview', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getOverview(isNaN(days) ? 28 : days, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/performance?days=28&siteUrl=...
searchConsoleRouter.get('/performance', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getPerformanceByDate(isNaN(days) ? 28 : days, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/queries?days=28&limit=50&siteUrl=...
searchConsoleRouter.get('/queries', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getQueries(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/pages?days=28&limit=50&siteUrl=...
searchConsoleRouter.get('/pages', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getPages(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/countries?days=28&limit=50&siteUrl=...
searchConsoleRouter.get('/countries', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getCountries(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/devices?days=28&siteUrl=...
searchConsoleRouter.get('/devices', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getDevices(isNaN(days) ? 28 : days, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/search-appearance?days=28&siteUrl=...
searchConsoleRouter.get('/search-appearance', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getSearchAppearance(isNaN(days) ? 28 : days, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/sitemaps?siteUrl=...
searchConsoleRouter.get('/sitemaps', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const siteUrl = req.query.siteUrl as string | undefined;
    const result = await GSCIntegrationService.getSitemaps(siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/search-console/inspect-url
searchConsoleRouter.post('/inspect-url', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { url, siteUrl } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ success: false, error: 'Valid URL starting with http:// or https:// is required.' });
    }
    const result = await GSCIntegrationService.inspectUrl(url, siteUrl);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
