// ─── DMOS Backend: Search Console Protected Router ───────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { GSCIntegrationService } from '../services/integrations/gscService';

export const searchConsoleRouter = Router();

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

// GET /api/admin/search-console/overview?days=28
searchConsoleRouter.get('/overview', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const result = await GSCIntegrationService.getOverview(isNaN(days) ? 28 : days);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/performance?days=28
searchConsoleRouter.get('/performance', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const result = await GSCIntegrationService.getPerformanceByDate(isNaN(days) ? 28 : days);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/queries?days=28&limit=50
searchConsoleRouter.get('/queries', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const result = await GSCIntegrationService.getQueries(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/pages?days=28&limit=50
searchConsoleRouter.get('/pages', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const result = await GSCIntegrationService.getPages(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/countries?days=28&limit=50
searchConsoleRouter.get('/countries', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const result = await GSCIntegrationService.getCountries(isNaN(days) ? 28 : days, isNaN(limit) ? 50 : limit);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/devices?days=28
searchConsoleRouter.get('/devices', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const result = await GSCIntegrationService.getDevices(isNaN(days) ? 28 : days);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/search-appearance?days=28
searchConsoleRouter.get('/search-appearance', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const result = await GSCIntegrationService.getSearchAppearance(isNaN(days) ? 28 : days);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/search-console/sitemaps
searchConsoleRouter.get('/sitemaps', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const result = await GSCIntegrationService.getSitemaps();
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/search-console/inspect-url
searchConsoleRouter.post('/inspect-url', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ success: false, error: 'Valid URL starting with http:// or https:// is required.' });
    }
    const result = await GSCIntegrationService.inspectUrl(url);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
