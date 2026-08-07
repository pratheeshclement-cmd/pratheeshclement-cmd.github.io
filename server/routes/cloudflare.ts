// ─── DMOS Backend: Cloudflare API Router ──────────────────────────────────

import { Router } from 'express';

export const cloudflareRouter = Router();

// GET /api/cloudflare/stats
cloudflareRouter.get('/stats', async (req, res) => {
  try {
    res.json({
      zone: 'pratheeshclement-cmd.github.io',
      status: 'active',
      sslStatus: 'active_tls13',
      cacheHitRatio: '94.2%',
      bandwidthServed: '1.4 GB',
      threatsBlocked: 42,
      dnsResolutionMs: 18,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
