// ─── DMOS Connections Gateway Router ──────────────────────────────────────────
// Live production-grade health monitor and verification endpoints for all 12 providers.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { verifyAllConnections, verifySingleProvider } from '../services/integrations';

export const connectionsRouter = Router();

// GET /api/admin/connections - Authenticated live check across all 12 providers
connectionsRouter.get('/', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const providers = await verifyAllConnections();
    res.json({
      success: true,
      providers,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/connections/health - Backward-compatible public health summary (no secrets)
connectionsRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const providers = await verifyAllConnections();
    res.json({
      success: true,
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
        latencyMs: p.latencyMs,
        lastCheckedAt: p.lastCheckedAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/connections/verify/:providerId - Single provider verification
connectionsRouter.post('/verify/:providerId', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const result = await verifySingleProvider(providerId);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message || `Error verifying provider ${req.params.providerId}`,
    });
  }
});
