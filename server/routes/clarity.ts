// ─── Express Router: Microsoft Clarity Admin Endpoints ──────────────────────
// Secured admin routes for Microsoft Clarity status, verification, and live insights.

import { Router, Request, Response } from 'express';
import { ClarityService } from '../services/clarityService';
import { requireAdminAuth } from '../middleware/auth';

export const clarityRouter = Router();

// GET /api/admin/clarity/status - Public status check (returns configured flag, no secrets)
clarityRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const configStatus = ClarityService.getStatus();
    res.json({
      success: true,
      projectId: configStatus.projectId,
      configured: configStatus.configured,
      status: configStatus.configured ? 'configured' : 'not_configured',
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/clarity/verify - Authenticated admin connection test
clarityRouter.post('/verify', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const verification = await ClarityService.verifyConnection();
    res.json(verification);
  } catch (e: any) {
    res.status(500).json({
      success: false,
      message: e.message || 'Verification error',
      status: 'auth_failed',
    });
  }
});

// GET /api/admin/clarity/insights?days=1|2|3 - Authenticated admin insights
clarityRouter.get('/insights', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const daysParam = parseInt(req.query.days as string, 10);
    const days = [1, 2, 3].includes(daysParam) ? daysParam : 1;

    const insights = await ClarityService.getLiveInsights(days);
    res.json({
      success: true,
      ...insights,
    });
  } catch (e: any) {
    const errorMsg = e.message || 'Error fetching Microsoft Clarity insights';
    const isAuthErr = errorMsg.includes('Authentication Failed') || errorMsg.includes('401');
    const isRateLimit = errorMsg.includes('Rate Limit') || errorMsg.includes('429');

    res.status(isAuthErr ? 401 : isRateLimit ? 429 : 500).json({
      success: false,
      error: errorMsg,
      code: isAuthErr ? 'AUTH_FAILED' : isRateLimit ? 'RATE_LIMITED' : 'SERVER_ERROR',
    });
  }
});
