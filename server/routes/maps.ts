// ─── DMOS Backend: Google Maps Protected Router ──────────────────────────────
// Authenticated administrative endpoints secured with requireAdminAuth.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { MapsIntegrationService } from '../services/integrations/mapsService';

export const mapsRouter = Router();

// GET /api/admin/google-maps/status
mapsRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MapsIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/admin/google-maps/health
mapsRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MapsIntegrationService.verify();
    res.json({ success: true, details: status });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/google-maps/verify
mapsRouter.post('/verify', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await MapsIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/google-maps/geocode
mapsRouter.post('/geocode', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ success: false, error: 'Address parameter is required.' });
    }
    const result = await MapsIntegrationService.geocodeAddress(address);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/admin/google-maps/reverse-geocode
mapsRouter.post('/reverse-geocode', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ success: false, error: 'Valid numeric lat and lng parameters are required.' });
    }
    const result = await MapsIntegrationService.reverseGeocode(lat, lng);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});
