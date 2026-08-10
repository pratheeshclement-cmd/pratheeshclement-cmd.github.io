// ─── DMOS Content Studio Express API Router ────────────────────────────────────

import { Router, Request, Response } from 'express';

import { requireAdminAuth } from '../middleware/auth';

export const contentStudioRouter = Router();

let QUEUE_STORE: any[] = [];
let IDEAS_STORE: any[] = [];

// GET /api/content-studio/queue
contentStudioRouter.get('/queue', requireAdminAuth as any, (req: Request, res: Response) => {
  res.json({ success: true, items: QUEUE_STORE });
});

// POST /api/content-studio/queue
contentStudioRouter.post('/queue', requireAdminAuth as any, (req: Request, res: Response) => {
  try {
    const { title, platform, scheduledAt, status, tags } = req.body;
    if (!title || !platform) {
      return res.status(400).json({ success: false, error: 'Title and platform are required' });
    }

    const newItem = {
      id: `post_${Date.now()}`,
      title,
      platform,
      scheduledAt: scheduledAt || new Date().toISOString(),
      status: status || 'scheduled',
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
    };

    QUEUE_STORE.unshift(newItem);
    res.status(201).json({ success: true, item: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/content-studio/queue/:id
contentStudioRouter.delete('/queue/:id', requireAdminAuth as any, (req: Request, res: Response) => {
  const { id } = req.params;
  QUEUE_STORE = QUEUE_STORE.filter(q => q.id !== id);
  res.json({ success: true, message: 'Item removed from queue' });
});

// GET /api/content-studio/ideas
contentStudioRouter.get('/ideas', requireAdminAuth as any, (req: Request, res: Response) => {
  res.json({ success: true, ideas: IDEAS_STORE });
});
