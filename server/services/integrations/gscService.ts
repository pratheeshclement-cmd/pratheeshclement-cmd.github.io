// ─── Integration Service: Google Search Console API ───────────────────────────
// Interfacing with official Google Webmasters / Search Console API v3 & URL Inspection API v1.
// Server-side OAuth2 authentication & 15-minute memory caching.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface GSCOverviewData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dateRange: string;
  siteUrl: string;
  fetchedAt: string;
}

export interface GSCPerformancePoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCRowMetric {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSitemapInfo {
  path: string;
  lastSubmitted: string;
  lastDownloaded: string;
  isPending: boolean;
  isSitemap: boolean;
  warnings: number;
  errors: number;
}

export interface GSCInspectionResult {
  inspectionUrl: string;
  verdict: string;
  coverageState: string;
  indexingState: string;
  robotsTxtState: string;
  pageFetchState: string;
  crawledAs: string;
  lastCrawlTime: string;
}

export class GSCIntegrationService {
  private static getCredentials() {
    const siteUrl = process.env.GSC_SITE_URL || 'https://pratheeshclement-cmd.github.io/';
    const clientId = process.env.GSC_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GSC_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GSC_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
    const hasCreds = Boolean(clientId && clientSecret && refreshToken);
    return { siteUrl, clientId, clientSecret, refreshToken, hasCreds };
  }

  private static async getAccessToken(): Promise<string> {
    const { clientId, clientSecret, refreshToken, hasCreds } = this.getCredentials();
    if (!hasCreds) {
      throw new Error('GSC OAuth credentials not configured in server/.env.');
    }

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }, { timeout: 8000 });

    return tokenRes.data.access_token;
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { siteUrl, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'gsc',
        name: 'Google Search Console API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
        message: 'Authentication Required. Configure GSC_SITE_URL & OAuth credentials in server/.env.',
        configured: false,
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      await axios.get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'gsc',
        name: 'Google Search Console API',
        category: 'SEO',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
        message: `Search Console API verified for property: ${siteUrl}`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'gsc',
        name: 'Google Search Console API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
        message: `Search Console Verification Notice: ${err.response?.data?.error?.message || err.message}`,
        configured: true,
      };
    }
  }

  public static async listSites(): Promise<{ configured: boolean; sites?: any[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure Search Console credentials in server/.env' };

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.get('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      return { configured: true, sites: res.data.siteEntry || [] };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  private static async querySearchAnalytics(dimensions: string[] = [], days: number = 28, rowLimit: number = 100): Promise<any[]> {
    const { siteUrl } = this.getCredentials();
    const accessToken = await this.getAccessToken();

    const endDate = new Date().toISOString().split('T')[0];
    const startDateDate = new Date();
    startDateDate.setDate(startDateDate.getDate() - days);
    const startDate = startDateDate.toISOString().split('T')[0];

    const body: any = {
      startDate,
      endDate,
      rowLimit,
    };
    if (dimensions.length > 0) {
      body.dimensions = dimensions;
    }

    const res = await axios.post(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
    );

    return res.data.rows || [];
  }

  public static async getOverview(days: number = 28): Promise<{ configured: boolean; data?: GSCOverviewData; message?: string }> {
    const { siteUrl, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure Search Console credentials in server/.env' };

    const cacheKey = `overview_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics([], days, 1);
      const row = rows[0] || {};
      const clicks = row.clicks || 0;
      const impressions = row.impressions || 0;
      const ctr = parseFloat(((row.ctr || 0) * 100).toFixed(2));
      const position = parseFloat((row.position || 0).toFixed(1));

      const data: GSCOverviewData = {
        clicks,
        impressions,
        ctr,
        position,
        dateRange: `Last ${days} Days`,
        siteUrl,
        fetchedAt: new Date().toISOString(),
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getPerformanceByDate(days: number = 28): Promise<{ configured: boolean; data?: GSCPerformancePoint[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `performance_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['date'], days, 100);
      const data: GSCPerformancePoint[] = rows.map((r: any) => ({
        date: r.keys?.[0] || '',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      })).sort((a, b) => a.date.localeCompare(b.date));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getQueries(days: number = 28, limit: number = 50): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `queries_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['query'], days, limit);
      const data: GSCRowMetric[] = rows.map((r: any) => ({
        key: r.keys?.[0] || '(not set)',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getPages(days: number = 28, limit: number = 50): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `pages_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['page'], days, limit);
      const data: GSCRowMetric[] = rows.map((r: any) => ({
        key: r.keys?.[0] || '/',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getCountries(days: number = 28, limit: number = 50): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `countries_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['country'], days, limit);
      const data: GSCRowMetric[] = rows.map((r: any) => ({
        key: r.keys?.[0] || 'Unknown',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getDevices(days: number = 28): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `devices_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['device'], days, 10);
      const data: GSCRowMetric[] = rows.map((r: any) => ({
        key: r.keys?.[0] || 'DESKTOP',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getSearchAppearance(days: number = 28): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `appearance_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['searchAppearance'], days, 20);
      const data: GSCRowMetric[] = rows.map((r: any) => ({
        key: r.keys?.[0] || 'Standard',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: parseFloat(((r.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((r.position || 0).toFixed(1)),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getSitemaps(): Promise<{ configured: boolean; data?: GSCSitemapInfo[]; message?: string }> {
    const { siteUrl, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const data: GSCSitemapInfo[] = (res.data.sitemap || []).map((s: any) => ({
        path: s.path || '',
        lastSubmitted: s.lastSubmitted || '—',
        lastDownloaded: s.lastDownloaded || '—',
        isPending: Boolean(s.isPending),
        isSitemap: Boolean(s.isSitemap),
        warnings: parseInt(s.warnings || '0', 10),
        errors: parseInt(s.errors || '0', 10),
      }));

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async inspectUrl(inspectionUrl: string): Promise<{ configured: boolean; data?: GSCInspectionResult; message?: string }> {
    const { siteUrl, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
        {
          inspectionUrl,
          siteUrl,
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const result = res.data.inspectionResult?.indexStatusResult || {};
      const data: GSCInspectionResult = {
        inspectionUrl,
        verdict: result.verdict || 'NEUTRAL',
        coverageState: result.coverageState || 'UNKNOWN',
        indexingState: result.indexingState || 'UNKNOWN',
        robotsTxtState: result.robotsTxtState || 'ALLOWED',
        pageFetchState: result.pageFetchState || 'SUCCESSFUL',
        crawledAs: result.crawledAs || 'DESKTOP',
        lastCrawlTime: result.lastCrawlTime || new Date().toISOString(),
      };

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }
}
