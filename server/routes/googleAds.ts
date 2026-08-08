// ─── DMOS Backend: Google Ads REST API Protected Router ─────────────────────
// Authenticated endpoints secured with requireAdminAuth.
// Strictly Read-Only operations.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { GoogleAdsIntegrationService } from '../services/integrations/googleAdsService';

export const googleAdsRouter = Router();

// GET /api/admin/google-ads/status
googleAdsRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleAdsIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/health
googleAdsRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GoogleAdsIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/account
googleAdsRouter.get('/account', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const account = await GoogleAdsIntegrationService.getAccountDetails();
    res.json(account);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/campaigns
googleAdsRouter.get('/campaigns', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const campaigns = await GoogleAdsIntegrationService.getCampaigns();
    res.json(campaigns);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-ads/insights?days=28
googleAdsRouter.get('/insights', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const insights = await GoogleAdsIntegrationService.getInsights(isNaN(days) ? 28 : days);
    res.json(insights);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
