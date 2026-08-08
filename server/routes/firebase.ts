// ─── DMOS Backend: Firebase Protected Router ─────────────────────────────────
// Authenticated endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { FirebaseIntegrationService } from '../services/integrations/firebaseService';

export const firebaseRouter = Router();

// GET /api/admin/firebase/status
firebaseRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await FirebaseIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/firebase/health
firebaseRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const details = await FirebaseIntegrationService.getHealthDetails();
    res.json({ success: true, details });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
