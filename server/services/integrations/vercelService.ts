// ─── Integration Service: Vercel Deployment API ──────────────────────────────
import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

export class VercelIntegrationService {
  public static async verify(): Promise<ProviderHealthResult> {
    const token = process.env.VERCEL_TOKEN;
    const hasCreds = Boolean(token && token.trim().length > 0);

    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'vercel',
        name: 'Vercel Deployment API',
        category: 'Hosting',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v9',
        docsUrl: 'https://vercel.com/docs/rest-api',
        message: 'Authentication Required. Configure VERCEL_TOKEN in server/.env.',
        configured: false,
      };
    }

    try {
      await axios.get('https://api.vercel.com/v9/projects', {
        headers: { Authorization: `Bearer ${token!.trim()}` },
        timeout: 8000,
      });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'vercel',
        name: 'Vercel Deployment API',
        category: 'Hosting',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v9',
        docsUrl: 'https://vercel.com/docs/rest-api',
        message: 'Vercel Deployment API token verified & active.',
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'vercel',
        name: 'Vercel Deployment API',
        category: 'Hosting',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v9',
        docsUrl: 'https://vercel.com/docs/rest-api',
        message: `Vercel Verification: ${err.response?.data?.error?.message || err.message}`,
        configured: true,
      };
    }
  }
}
