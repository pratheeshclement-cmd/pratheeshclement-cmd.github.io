// ─── DMOS Connections Gateway Router ──────────────────────────────────────────
// Live production-grade health monitor, verification & disconnect endpoints for all providers.

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '../middleware/auth';
import { verifyAllConnections, verifySingleProvider } from '../services/integrations';

export const connectionsRouter = Router();

// GET /api/admin/connections - Authenticated live check across all providers
connectionsRouter.get('/', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const providers = await verifyAllConnections();
    res.json({
      success: true,
      providers,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/connections/health - Backward-compatible public health summary (no secrets)
connectionsRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const providers = await verifyAllConnections();
    res.json({
      success: true,
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
        latencyMs: p.latencyMs,
        lastCheckedAt: p.lastCheckedAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/connections/verify/:providerId - Single provider verification
connectionsRouter.post('/verify/:providerId', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const result = await verifySingleProvider(providerId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message || `Error verifying provider ${req.params.providerId}`,
    });
  }
});

// POST /api/admin/connections/disconnect/:providerId - Server-side provider disconnect
connectionsRouter.post('/disconnect/:providerId', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;

    const envMap: Record<string, string> = {
      googleads: 'GOOGLE_ADS_REFRESH_TOKEN',
      googlebusiness: 'GOOGLE_BUSINESS_REFRESH_TOKEN',
      microsoftads: 'MICROSOFT_ADS_REFRESH_TOKEN',
      ga4: 'GOOGLE_REFRESH_TOKEN',
      gsc: 'GSC_REFRESH_TOKEN',
      meta: 'META_ACCESS_TOKEN',
      cloudflare: 'CLOUDFLARE_API_TOKEN',
      smtp: 'SMTP_PASSWORD',
      gmaps: 'GOOGLE_MAPS_API_KEY',
      vercel: 'VERCEL_TOKEN',
    };

    const targetVar = envMap[providerId];
    if (targetVar) {
      const envPath = path.join(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        const regex = new RegExp(`${targetVar}=.*`, 'g');
        envContent = envContent.replace(regex, `${targetVar}=`);
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
      delete process.env[targetVar];
    }

    const updatedResult = await verifySingleProvider(providerId);
    res.json({
      success: true,
      message: `${providerId.toUpperCase()} disconnected successfully.`,
      provider: updatedResult,
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message || `Failed to disconnect provider ${req.params.providerId}`,
    });
  }
});
