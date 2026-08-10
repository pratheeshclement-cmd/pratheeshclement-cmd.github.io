// ─── DMOS Integration Gateway: Standard Types ────────────────────────────────

export type ProviderStatus =
  | 'connected'
  | 'healthy'
  | 'degraded'
  | 'offline'
  | 'not_configured'
  | 'auth_required'
  | 'authentication_failed'
  | 'permission_denied'
  | 'no_data'
  | 'stale'
  | 'timeout'
  | 'unavailable'
  | 'unknown'
  | 'not_connected'
  | 'disconnected'
  | 'error';

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

