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

  public static clearCache(): void {
    memoryCache.clear();
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
        message: 'Authentication Required. Connect your Google account to authorize Search Console API.',
        configured: false,
      };
    }

    let accessToken: string;
    try {
      accessToken = await this.getAccessToken();
    } catch (tokenErr: any) {
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
        message: `OAuth Token Refresh Failed: ${tokenErr.response?.data?.error_description || tokenErr.message}`,
        configured: true,
      };
    }

    try {
      const sitesRes = await axios.get('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const sites = sitesRes.data?.siteEntry || [];
      const latencyMs = Math.max(1, Date.now() - start);

      if (sites.length === 0) {
        return {
          id: 'gsc',
          name: 'Google Search Console API',
          category: 'SEO',
          status: 'error',
          latencyMs,
          lastCheckedAt: new Date().toISOString(),
          apiVersion: 'v3',
          docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
          message: 'Authenticated Google account has 0 verified Search Console properties.',
          configured: true,
        };
      }

      return {
        id: 'gsc',
        name: 'Google Search Console API',
        category: 'SEO',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
        message: `Search Console API verified with ${sites.length} accessible property(ies).`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'gsc',
        name: 'Google Search Console API',
        category: 'SEO',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
        message: `Search Console API Error (${err.response?.status || 'Network'}): ${err.response?.data?.error?.message || err.message}`,
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
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getDiagnostics(): Promise<any> {
    const { siteUrl, clientId, clientSecret, refreshToken } = this.getCredentials();
    const oauthConfigured = Boolean(clientId && clientSecret);
    const refreshTokenConfigured = Boolean(refreshToken);

    if (!oauthConfigured || !refreshTokenConfigured) {
      return {
        oauthConfigured,
        refreshTokenConfigured,
        tokenRefresh: 'unconfigured',
        sitesList: 'unconfigured',
        propertyCount: 0,
        selectedProperty: siteUrl,
        propertyAccess: 'unconfigured',
        searchAnalytics: 'unconfigured',
        sitemaps: 'unconfigured',
        urlInspection: 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
        error: 'GSC credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN) not fully configured in server/.env',
      };
    }

    let tokenRefresh = 'failure';
    let accessToken = '';
    let tokenError = '';
    try {
      accessToken = await this.getAccessToken();
      tokenRefresh = 'success';
    } catch (err: any) {
      tokenError = err.response?.data?.error_description || err.message;
    }

    if (tokenRefresh !== 'success') {
      return {
        oauthConfigured,
        refreshTokenConfigured,
        tokenRefresh: 'failure',
        sitesList: 'unconfigured',
        propertyCount: 0,
        selectedProperty: siteUrl,
        propertyAccess: 'unconfigured',
        searchAnalytics: 'unconfigured',
        sitemaps: 'unconfigured',
        urlInspection: 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
        error: `Token refresh failed: ${tokenError}`,
      };
    }

    let sitesList = 'failure';
    let propertyCount = 0;
    let properties: any[] = [];
    try {
      const res = await axios.get('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      sitesList = 'success';
      properties = res.data.siteEntry || [];
      propertyCount = properties.length;
    } catch (err: any) {
      tokenError = err.response?.data?.error?.message || err.message;
    }

    const activeProperty = propertyCount > 0 ? (properties.find(p => p.siteUrl === siteUrl)?.siteUrl || properties[0].siteUrl) : siteUrl;

    let propertyAccess = 'failure';
    try {
      await axios.get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(activeProperty)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      propertyAccess = 'success';
    } catch (err: any) {}

    let searchAnalytics = 'failure';
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDateDate = new Date();
      startDateDate.setDate(startDateDate.getDate() - 28);
      const startDate = startDateDate.toISOString().split('T')[0];
      await axios.post(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(activeProperty)}/searchAnalytics/query`,
        { startDate, endDate, rowLimit: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
      );
      searchAnalytics = 'success';
    } catch (err: any) {}

    let sitemaps = 'failure';
    try {
      await axios.get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(activeProperty)}/sitemaps`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      sitemaps = 'success';
    } catch (err: any) {}

    return {
      oauthConfigured,
      refreshTokenConfigured,
      tokenRefresh,
      sitesList,
      propertyCount,
      selectedProperty: activeProperty,
      propertyAccess,
      searchAnalytics,
      sitemaps,
      urlInspection: 'ready',
      lastCheckedAt: new Date().toISOString(),
    };
  }

  private static async querySearchAnalytics(dimensions: string[] = [], days: number = 28, rowLimit: number = 100, customSiteUrl?: string): Promise<any[]> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
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

  public static async getOverview(days: number = 28, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCOverviewData; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure Search Console credentials in server/.env' };

    const cacheKey = `overview_${siteUrl}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics([], days, 1, siteUrl);
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

  public static async getPerformanceByDate(days: number = 28, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCPerformancePoint[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `performance_${siteUrl}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['date'], days, 100, siteUrl);
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

  public static async getQueries(days: number = 28, limit: number = 50, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `queries_${siteUrl}_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['query'], days, limit, siteUrl);
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

  public static async getOpportunities(days: number = 28, customSiteUrl?: string): Promise<{ configured: boolean; opportunities?: Array<{ type: string; query: string; impressions: number; clicks: number; ctr: number; position: number; recommendation: string }>; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const queriesRes = await this.getQueries(days, 50, siteUrl);
    if (!queriesRes.configured || !queriesRes.data) {
      return { configured: queriesRes.configured, message: queriesRes.message };
    }

    const opportunities: Array<{ type: string; query: string; impressions: number; clicks: number; ctr: number; position: number; recommendation: string }> = [];

    queriesRes.data.forEach(q => {
      if (q.position >= 4.0 && q.position <= 10.0 && q.impressions >= 3) {
        opportunities.push({
          type: 'Striking Distance (Page 1 Potential)',
          query: q.key,
          impressions: q.impressions,
          clicks: q.clicks,
          ctr: q.ctr,
          position: q.position,
          recommendation: `Query ranks on Page 1 (Position ${q.position}). Potential improvement by refining title tags and user intent alignment.`
        });
      } else if (q.impressions >= 10 && q.ctr < 15.0) {
        opportunities.push({
          type: 'CTR Optimization Opportunity',
          query: q.key,
          impressions: q.impressions,
          clicks: q.clicks,
          ctr: q.ctr,
          position: q.position,
          recommendation: `High visibility (${q.impressions} impressions) with ${q.ctr}% CTR. Requires review of meta descriptions and snippet appeal.`
        });
      }
    });

    return { configured: true, opportunities };
  }

  public static async getPages(days: number = 28, limit: number = 50, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {

    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `pages_${siteUrl}_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['page'], days, limit, siteUrl);
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

  public static async getCountries(days: number = 28, limit: number = 50, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `countries_${siteUrl}_${days}_${limit}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['country'], days, limit, siteUrl);
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

  public static async getDevices(days: number = 28, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `devices_${siteUrl}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['device'], days, 10, siteUrl);
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

  public static async getSearchAppearance(days: number = 28, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCRowMetric[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    const cacheKey = `appearance_${siteUrl}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const rows = await this.querySearchAnalytics(['searchAppearance'], days, 20, siteUrl);
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

  public static async getSitemaps(customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCSitemapInfo[]; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
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

  public static async inspectUrl(inspectionUrl: string, customSiteUrl?: string): Promise<{ configured: boolean; data?: GSCInspectionResult; message?: string }> {
    const siteUrl = customSiteUrl || this.getCredentials().siteUrl;
    const { hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GSC not configured' };

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
        {
          inspectionUrl,
          siteUrl,
          languageCode: 'en-US',
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
