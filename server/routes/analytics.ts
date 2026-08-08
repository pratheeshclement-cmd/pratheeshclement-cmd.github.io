// ─── DMOS Backend: GA4 Analytics Data Router ───────────────────────────────
// Authenticated GA4 API endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { GA4IntegrationService } from '../services/integrations/ga4Service';

export const analyticsRouter = Router();

// GET /api/admin/analytics/status
analyticsRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const health = await GA4IntegrationService.verify();
    res.json(health);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/overview?days=30
analyticsRouter.get('/overview', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 90);
    const result = await GA4IntegrationService.getOverview(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/traffic?days=14
analyticsRouter.get('/traffic', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '14', 10);
    const validDays = isNaN(days) || days <= 0 ? 14 : Math.min(days, 90);
    const result = await GA4IntegrationService.getTraffic(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/pages?days=30
analyticsRouter.get('/pages', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 90);
    const result = await GA4IntegrationService.getPages(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/sources?days=30
analyticsRouter.get('/sources', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 90);
    const result = await GA4IntegrationService.getSources(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/devices?days=30
analyticsRouter.get('/devices', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 90);
    const result = await GA4IntegrationService.getDevices(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/analytics/geography?days=30
analyticsRouter.get('/geography', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 90);
    const result = await GA4IntegrationService.getGeography(validDays);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/analytics/kpis (Public/Legacy compatibility)
analyticsRouter.get('/kpis', async (req: Request, res: Response) => {
  try {
    const overview = await GA4IntegrationService.getOverview(30);
    if (overview.configured && overview.data) {
      res.json({
        activeUsers: { value: overview.data.users, change: 0, changeLabel: 'last 30 days' },
        totalSessions: { value: overview.data.sessions, change: 0, changeLabel: 'last 30 days' },
        pageViews: { value: overview.data.pageViews, change: 0, changeLabel: 'last 30 days' },
        avgSessionDuration: { value: `${Math.floor(overview.data.averageEngagementTime / 60)}m ${overview.data.averageEngagementTime % 60}s`, change: 0, changeLabel: 'vs last month' },
        engagementRate: { value: overview.data.engagementRate, change: 0, changeLabel: 'vs last month', isPercent: true },
      });
    } else {
      res.json({
        activeUsers: { value: '—', change: 0, changeLabel: 'not configured' },
        totalSessions: { value: '—', change: 0, changeLabel: 'not configured' },
        pageViews: { value: '—', change: 0, changeLabel: 'not configured' },
        avgSessionDuration: { value: '—', change: 0, changeLabel: 'not configured' },
        engagementRate: { value: '—', change: 0, changeLabel: 'not configured', isPercent: true },
      });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
