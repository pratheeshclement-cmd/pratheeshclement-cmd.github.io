// ─── DMOS Backend: Search Console & PageSpeed Router ──────────────────────

import { Router, Request, Response } from 'express';
import { PageSpeedIntegrationService } from '../services/integrations/pagespeedService';

export const seoRouter = Router();

// GET /api/seo/queries
seoRouter.get('/queries', async (req: Request, res: Response) => {
  try {
    res.json([
      { keyword: 'pratheesh clement', position: 1, volume: 320, ctr: 42.1, page: '/' },
      { keyword: 'digital marketing specialist india', position: 4, volume: 1900, ctr: 12.4, page: '/digital-marketing/' },
      { keyword: 'technical seo expert', position: 6, volume: 1300, ctr: 8.2, page: '/seo/' },
      { keyword: 'seo consultant tamil nadu', position: 3, volume: 480, ctr: 18.7, page: '/seo/' },
    ]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/seo/pagespeed
seoRouter.get('/pagespeed', async (req: Request, res: Response) => {
  try {
    const targetUrl = (req.query.url as string) || 'https://pratheeshclement-cmd.github.io/';
    const strategy = (req.query.strategy as string) === 'desktop' ? 'desktop' : 'mobile';

    const result = await PageSpeedIntegrationService.analyzeUrl(targetUrl, strategy);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
