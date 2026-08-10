// ─── Integration Service: Google Analytics 4 Data API ────────────────────────
// Interfacing with official GA4 Data API v1beta: https://analyticsdata.googleapis.com/v1beta
// Server-side OAuth2 access token refresh & 15-minute memory caching.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL

export interface GA4OverviewData {
  users: number;
  sessions: number;
  pageViews: number;
  engagementRate: number;
  averageEngagementTime: number;
  conversions: number;
  dateRange: string;
  fetchedAt: string;
}

export interface GA4TrafficPoint {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface GA4TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
}

export interface GA4PageMetric {
  pagePath: string;
  views: number;
  users: number;
}

export interface GA4DeviceBreakdown {
  deviceCategory: string;
  users: number;
  sessions: number;
}

export interface GA4GeographyMetric {
  country: string;
  users: number;
}

const memoryCache = new Map<string, { data: any; timestamp: number }>();

export class GA4IntegrationService {
  private static getCredentials() {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const hasCreds = Boolean(propertyId && clientId && clientSecret && refreshToken);
    return { propertyId, clientId, clientSecret, refreshToken, hasCreds };
  }

  private static async getAccessToken(): Promise<string> {
    const { clientId, clientSecret, refreshToken, hasCreds } = this.getCredentials();
    if (!hasCreds) {
      throw new Error('GA4_PROPERTY_ID or OAuth credentials not configured in server/.env.');
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
    const { propertyId, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'ga4',
        name: 'Google Analytics 4 Data API',
        category: 'Analytics',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
        message: 'Authentication Required. Configure GA4_PROPERTY_ID & OAuth refresh token in server/.env.',
        configured: false,
      };
    }

    try {
      const accessToken = await this.getAccessToken();

      await axios.get(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}/metadata`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'ga4',
        name: 'Google Analytics 4 Data API',
        category: 'Analytics',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
        message: 'Google Analytics 4 Data API verified & active.',
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'ga4',
        name: 'Google Analytics 4 Data API',
        category: 'Analytics',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
        message: `GA4 Verification Notice: ${err.response?.data?.error_description || err.message}`,
        configured: true,
      };
    }
  }

  public static async getOverview(days: number = 30): Promise<{ configured: boolean; data?: GA4OverviewData; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) {
      return { configured: false, message: 'Configure GA4_PROPERTY_ID & OAuth credentials in server/.env' };
    }

    const cacheKey = `overview_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'engagementRate' },
            { name: 'userEngagementDuration' },
            { name: 'conversions' },
          ],
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const row = res.data.rows?.[0]?.metricValues || [];
      const usersCount = parseInt(row[0]?.value || '0', 10);
      const totalEngagementSecs = parseFloat(row[4]?.value || '0');
      const avgEngagementSecs = usersCount > 0 ? Math.round(totalEngagementSecs / usersCount) : 0;

      const data: GA4OverviewData = {
        users: usersCount,
        sessions: parseInt(row[1]?.value || '0', 10),
        pageViews: parseInt(row[2]?.value || '0', 10),
        engagementRate: parseFloat((parseFloat(row[3]?.value || '0') * 100).toFixed(1)),
        averageEngagementTime: avgEngagementSecs,
        conversions: parseInt(row[5]?.value || '0', 10),
        dateRange: `Last ${days} Days`,
        fetchedAt: new Date().toISOString(),
      };


      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getTraffic(days: number = 14): Promise<{ configured: boolean; data?: GA4TrafficPoint[]; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GA4 not configured' };

    const cacheKey = `traffic_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: GA4TrafficPoint[] = (res.data.rows || []).map((r: any) => ({
        date: r.dimensionValues?.[0]?.value || '',
        users: parseInt(r.metricValues?.[0]?.value || '0', 10),
        sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
        pageViews: parseInt(r.metricValues?.[2]?.value || '0', 10),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getPages(days: number = 30): Promise<{ configured: boolean; data?: GA4PageMetric[]; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GA4 not configured' };

    const cacheKey = `pages_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
          limit: 10,
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: GA4PageMetric[] = (res.data.rows || []).map((r: any) => ({
        pagePath: r.dimensionValues?.[0]?.value || '/',
        views: parseInt(r.metricValues?.[0]?.value || '0', 10),
        users: parseInt(r.metricValues?.[1]?.value || '0', 10),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getSources(days: number = 30): Promise<{ configured: boolean; data?: GA4TrafficSource[]; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GA4 not configured' };

    const cacheKey = `sources_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
          metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
          limit: 10,
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: GA4TrafficSource[] = (res.data.rows || []).map((r: any) => ({
        source: r.dimensionValues?.[0]?.value || '(direct)',
        medium: r.dimensionValues?.[1]?.value || '(none)',
        users: parseInt(r.metricValues?.[0]?.value || '0', 10),
        sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getDevices(days: number = 30): Promise<{ configured: boolean; data?: GA4DeviceBreakdown[]; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GA4 not configured' };

    const cacheKey = `devices_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: GA4DeviceBreakdown[] = (res.data.rows || []).map((r: any) => ({
        deviceCategory: r.dimensionValues?.[0]?.value || 'desktop',
        users: parseInt(r.metricValues?.[0]?.value || '0', 10),
        sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }

  public static async getGeography(days: number = 30): Promise<{ configured: boolean; data?: GA4GeographyMetric[]; message?: string }> {
    const { propertyId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'GA4 not configured' };

    const cacheKey = `geography_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const res = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 10,
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: GA4GeographyMetric[] = (res.data.rows || []).map((r: any) => ({
        country: r.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(r.metricValues?.[0]?.value || '0', 10),
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.message };
    }
  }
}
