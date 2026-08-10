// ─── DMOS Settings & System Audit Router ─────────────────────────────────────

import { Router, Request, Response } from 'express';

import { requireAdminAuth } from '../middleware/auth';

export const settingsRouter = Router();

let SYSTEM_SETTINGS = {
  appName: 'DMOS Enterprise OS',
  siteUrl: 'https://pratheeshclement-cmd.github.io/',
  maintenanceMode: false,
  allowRegistration: false,
  requireMfa: true,
  sessionTimeoutMinutes: 60,
  logLevel: 'info',
};

// GET /api/settings/system
settingsRouter.get('/system', (req: Request, res: Response) => {
  res.json({ success: true, settings: SYSTEM_SETTINGS });
});

// POST /api/settings/system
settingsRouter.post('/system', requireAdminAuth as any, (req: Request, res: Response) => {
  try {
    SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...req.body };
    res.json({ success: true, settings: SYSTEM_SETTINGS, message: 'Settings saved cleanly' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
