// ─── Microsoft Clarity Data Export API Service ──────────────────────────────
// Interfacing with official Clarity endpoint: https://www.clarity.ms/export-data/api/v1/project-live-insights
// Enforces 15-minute server-side memory caching to respect the 10 requests/day limit per project.

import axios from 'axios';

const CLARITY_EXPORT_API_URL = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL

export interface ClarityMetricInformation {
  [key: string]: any;
}

export interface ClarityMetricItem {
  metricName: string;
  information: ClarityMetricInformation[];
}

export interface ClarityLiveInsightsResponse {
  projectId: string;
  numOfDays: number;
  data: ClarityMetricItem[];
  cachedAt: string;
  isCached: boolean;
}

interface CacheEntry {
  data: ClarityMetricItem[];
  timestamp: number;
}

const memoryCache = new Map<number, CacheEntry>();

export class ClarityService {
  /**
   * Retrieves server-side Clarity configuration status without exposing credentials.
   */
  public static getStatus(): {
    projectId: string;
    configured: boolean;
    hasToken: boolean;
  } {
    const projectId = process.env.CLARITY_PROJECT_ID || 'xz1njtkayn';
    const token = process.env.CLARITY_API_TOKEN;
    const hasToken = Boolean(token && token.trim().length > 0);

    return {
      projectId,
      configured: hasToken,
      hasToken,
    };
  }

  /**
   * Fetches Live Insights from Microsoft Clarity Export API.
   * Uses 15-minute in-memory caching to strictly respect the 10 requests/day limit.
   */
  public static async getLiveInsights(days: number = 1): Promise<ClarityLiveInsightsResponse> {
    const projectId = process.env.CLARITY_PROJECT_ID || 'xz1njtkayn';
    const token = process.env.CLARITY_API_TOKEN;

    // Validate supported range (1, 2, or 3 days as per Microsoft specification)
    const validDays = [1, 2, 3].includes(days) ? days : 1;

    // Check 15-minute server-side memory cache
    const cached = memoryCache.get(validDays);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return {
        projectId,
        numOfDays: validDays,
        data: cached.data,
        cachedAt: new Date(cached.timestamp).toISOString(),
        isCached: true,
      };
    }

    if (!token || token.trim().length === 0) {
      throw new Error('CLARITY_API_TOKEN is not configured on the backend server.');
    }

    try {
      const response = await axios.get(CLARITY_EXPORT_API_URL, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/json',
        },
        params: {
          numOfDays: validDays,
        },
        timeout: 10000,
      });

      const responseData = Array.isArray(response.data) ? response.data : [];

      // Update cache
      memoryCache.set(validDays, {
        data: responseData,
        timestamp: now,
      });

      return {
        projectId,
        numOfDays: validDays,
        data: responseData,
        cachedAt: new Date(now).toISOString(),
        isCached: false,
      };
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          throw new Error('Clarity API Authentication Failed (401/403 Invalid API Token).');
        } else if (status === 429) {
          throw new Error('Clarity API Daily Rate Limit Reached (Max 10 calls/day per project).');
        } else if (status === 400) {
          throw new Error('Clarity API Invalid Parameters (Supported numOfDays: 1, 2, or 3).');
        }
      }
      throw new Error(error.message || 'Failed to communicate with Microsoft Clarity Data Export API.');
    }
  }

  /**
   * Performs connection test against Microsoft Clarity Export API.
   */
  public static async verifyConnection(): Promise<{
    success: boolean;
    message: string;
    status: 'connected' | 'auth_failed' | 'rate_limited' | 'not_configured';
  }> {
    const statusInfo = this.getStatus();
    if (!statusInfo.hasToken) {
      return {
        success: false,
        message: 'CLARITY_API_TOKEN is missing in server environment file (server/.env).',
        status: 'not_configured',
      };
    }

    try {
      await this.getLiveInsights(1);
      return {
        success: true,
        message: 'Microsoft Clarity API connected successfully.',
        status: 'connected',
      };
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('403') || msg.includes('Authentication Failed')) {
        return {
          success: false,
          message: 'Microsoft Clarity API authentication failed. Verify CLARITY_API_TOKEN in server/.env.',
          status: 'auth_failed',
        };
      }
      if (msg.includes('429') || msg.includes('Rate Limit')) {
        return {
          success: false,
          message: 'Microsoft Clarity API daily rate limit reached (10 requests/day). Existing cached data will be used.',
          status: 'rate_limited',
        };
      }
      return {
        success: false,
        message: msg,
        status: 'auth_failed',
      };
    }
  }
}
