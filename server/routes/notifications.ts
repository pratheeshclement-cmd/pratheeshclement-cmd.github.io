// ─── DMOS Notifications Express Router ───────────────────────────────────────

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';

export const notificationsRouter = Router();

let NOTIFICATIONS_STORE: any[] = [];

// GET /api/notifications
notificationsRouter.get('/', requireAdminAuth as any, (req: Request, res: Response) => {
  res.json({ success: true, notifications: NOTIFICATIONS_STORE });
});

// POST /api/notifications/read-all
notificationsRouter.post('/read-all', requireAdminAuth as any, (req: Request, res: Response) => {
  NOTIFICATIONS_STORE = NOTIFICATIONS_STORE.map(n => ({ ...n, read: true }));
  res.json({ success: true, message: 'All notifications marked as read' });
});
