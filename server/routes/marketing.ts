// ─── DMOS Marketing Hub Express API Router ────────────────────────────────────

import { Router, Request, Response } from 'express';

export const marketingRouter = Router();

// Storage / in-memory store for campaigns if Firestore is offline, plus API contract
let CAMPAIGN_STORE: any[] = [];

// GET /api/marketing/campaigns
marketingRouter.get('/campaigns', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      campaigns: CAMPAIGN_STORE,
      totalCount: CAMPAIGN_STORE.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketing/campaigns
marketingRouter.post('/campaigns', (req: Request, res: Response) => {
  try {
    const { name, platform, spend, budget, status, notes } = req.body;
    if (!name || !platform) {
      return res.status(400).json({ success: false, error: 'Name and platform are required' });
    }

    const newCampaign = {
      id: `camp_${Date.now()}`,
      name,
      platform,
      spend: spend || 0,
      budget: budget || 0,
      status: status || 'active',
      notes: notes || '',
      revenue: 0,
      roas: '0.0x',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    CAMPAIGN_STORE.unshift(newCampaign);
    res.status(201).json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/marketing/campaigns/:id
marketingRouter.put('/campaigns/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = CAMPAIGN_STORE.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    CAMPAIGN_STORE[index] = {
      ...CAMPAIGN_STORE[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json({ success: true, campaign: CAMPAIGN_STORE[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/marketing/campaigns/:id
marketingRouter.delete('/campaigns/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    CAMPAIGN_STORE = CAMPAIGN_STORE.filter(c => c.id !== id);
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
