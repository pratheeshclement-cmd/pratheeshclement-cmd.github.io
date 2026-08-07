// ─── DMOS Production Data Schemas (Zero Mock Data) ─────────────────────────
// All mock arrays have been removed in compliance with Production Audit.
// Components query live Firestore collections or Express backend endpoints.
// If backend or Firestore is unavailable, UI renders "No data available".

export interface CampaignSchema {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: string;
  cpa: string;
  ctr: string;
  status: 'active' | 'paused' | 'ended';
  createdAt: string;
}

export interface ScheduledPostSchema {
  id: string;
  title: string;
  platform: string;
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'draft';
  seoScore?: number;
}
