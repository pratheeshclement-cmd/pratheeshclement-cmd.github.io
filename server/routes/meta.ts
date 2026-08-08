// ─── DMOS Backend: Meta Graph API Protected Router ───────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { MetaIntegrationService } from '../services/integrations/metaService';

export const metaRouter = Router();

// GET /api/admin/meta/status
metaRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MetaIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/meta/health
metaRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MetaIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/meta/account
metaRouter.get('/account', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const account = await MetaIntegrationService.getAccountDetails();
    res.json(account);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/meta/campaigns
metaRouter.get('/campaigns', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const campaigns = await MetaIntegrationService.getCampaigns();
    res.json(campaigns);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/meta/insights?days=28
metaRouter.get('/insights', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string || '28', 10);
    const insights = await MetaIntegrationService.getInsights(isNaN(days) ? 28 : days);
    res.json(insights);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/meta/leads
metaRouter.get('/leads', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const leads = await MetaIntegrationService.getLeads();
    res.json(leads);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
