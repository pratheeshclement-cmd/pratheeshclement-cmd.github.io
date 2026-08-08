// ─── DMOS Backend: Google PageSpeed Insights Router ──────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { PageSpeedIntegrationService } from '../services/integrations/pagespeedService';

export const pageSpeedRouter = Router();

// GET /api/admin/pagespeed/status
pageSpeedRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await PageSpeedIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/pagespeed/health
pageSpeedRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await PageSpeedIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/pagespeed/verify
pageSpeedRouter.post('/verify', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await PageSpeedIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/pagespeed/analyze
pageSpeedRouter.post('/analyze', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { url, strategy } = req.body;
    const targetStrategy = strategy === 'desktop' ? 'desktop' : 'mobile';
    const result = await PageSpeedIntegrationService.analyzeUrl(url, targetStrategy);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
