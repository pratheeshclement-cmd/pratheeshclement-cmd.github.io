// ─── DMOS Backend: Cloudflare API Router (Production Integration) ───────────
// Authenticated admin endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { CloudflareIntegrationService } from '../services/integrations/cloudflareService';

export const cloudflareRouter = Router();

// Protected Admin Endpoints
cloudflareRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await CloudflareIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

cloudflareRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await CloudflareIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

cloudflareRouter.get('/account', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const account = await CloudflareIntegrationService.getAccountDetails();
    res.json(account);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

cloudflareRouter.get('/zone', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const zone = await CloudflareIntegrationService.getZoneDetails();
    res.json(zone);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

cloudflareRouter.get('/dns', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const dns = await CloudflareIntegrationService.getDnsRecords();
    res.json(dns);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

cloudflareRouter.get('/analytics', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const analytics = await CloudflareIntegrationService.getAnalytics();
    res.json(analytics);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Legacy Endpoint for System/Monitor Backward Compatibility
cloudflareRouter.get('/stats', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const analytics = await CloudflareIntegrationService.getAnalytics();
    res.json(analytics.data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

