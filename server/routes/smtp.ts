// ─── DMOS Backend: SMTP Protected Router ─────────────────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { SMTPIntegrationService } from '../services/integrations/smtpService';

export const smtpRouter = Router();

// GET /api/admin/smtp/status
smtpRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await SMTPIntegrationService.verify();
    const info = SMTPIntegrationService.getStatusInfo();
    res.json({ ...status, info });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/smtp/health
smtpRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await SMTPIntegrationService.verify();
    const info = SMTPIntegrationService.getStatusInfo();
    res.json({ success: true, details: { ...status, info } });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/smtp/verify
smtpRouter.post('/verify', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await SMTPIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/smtp/test
smtpRouter.post('/test', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { to } = req.body;
    if (!to || !to.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid recipient email address (to) is required.' });
    }

    const result = await SMTPIntegrationService.sendTestEmail(to);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
