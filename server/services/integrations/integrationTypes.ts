// ─── DMOS Integration Gateway: Standard Types ────────────────────────────────

export type ProviderStatus = 'connected' | 'auth_required' | 'not_connected' | 'error';

export interface ProviderHealthResult {
  id: string;
  name: string;
  category: string;
  status: ProviderStatus;
  latencyMs: number;
  lastCheckedAt: string;
  apiVersion: string;
  docsUrl: string;
  message: string;
  configured: boolean;
  metadata?: Record<string, any>;
}
