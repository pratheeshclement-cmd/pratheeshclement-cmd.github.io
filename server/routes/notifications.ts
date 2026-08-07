// ─── DMOS Notifications Express Router ───────────────────────────────────────

import { Router, Request, Response } from 'express';

export const notificationsRouter = Router();

let NOTIFICATIONS_STORE: any[] = [];

// GET /api/notifications
notificationsRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, notifications: NOTIFICATIONS_STORE });
});

// POST /api/notifications/read-all
notificationsRouter.post('/read-all', (req: Request, res: Response) => {
  NOTIFICATIONS_STORE = NOTIFICATIONS_STORE.map(n => ({ ...n, read: true }));
  res.json({ success: true, message: 'All notifications marked as read' });
});
