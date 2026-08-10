// ─── DMOS Profile Express Router ────────────────────────────────────────────

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';

export const profileRouter = Router();

// GET /api/profile
profileRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    profile: {
      displayName: 'Pratheesh Clement',
      email: 'pratheesh.clement@gmail.com',
      phone: '+91 86678 76102',
      location: 'Vadalur, Tamil Nadu, India',
      jobTitle: 'Digital Marketing Specialist & AI Enthusiast',
      role: 'Owner',
    },
  });
});

// POST /api/profile
profileRouter.post('/', requireAdminAuth as any, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Profile metadata updated cleanly',
    profile: req.body,
  });
});
