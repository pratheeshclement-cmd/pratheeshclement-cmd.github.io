// ─── Integration Service: Google Business Profile REST API ────────────────────
// Interfacing with official Google Business Profile API v1 & Performance API via OAuth2.
// Strictly Read-Only operations: Account Locations, Reviews, Search Performance.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const ACCOUNT_MGMT_BASE = 'https://mybusinessaccountmanagement.googleapis.com/v1';
const BUSINESS_INFO_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const PERFORMANCE_BASE = 'https://businessprofileperformance.googleapis.com/v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface GoogleBusinessLocation {
  name: string; // Resource name: accounts/{account}/locations/{location}
  title: string;
  primaryCategory: string;
  storeCode?: string;
  addressFormatted?: string;
  phoneNumber?: string;
  websiteUri?: string;
}

export interface GoogleBusinessReview {
  name: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | number;
  comment?: string;
  createTime: string;
  updateTime?: string;
}

export interface GoogleBusinessPerformanceMetrics {
  calls: number;
  websiteClicks: number;
  directionRequests: number;
  profileViews: number;
  totalInteractions: number;
  dateRange: string;
  fetchedAt: string;
}

export class GoogleBusinessIntegrationService {
  private static getCredentials() {
    const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    const hasCreds = Boolean(
      clientId && clientId.trim().length > 0 &&
      refreshToken && refreshToken.trim().length > 0
    );

    return { clientId: clientId?.trim(), clientSecret: clientSecret?.trim(), refreshToken: refreshToken?.trim(), accountId: accountId?.trim(), locationId: locationId?.trim(), hasCreds };
  }

  private static async getAccessToken(): Promise<string> {
    const { clientId, clientSecret, refreshToken } = this.getCredentials();
    if (!clientId || !refreshToken) throw new Error('Missing Google Business Profile OAuth Credentials');

    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }, { timeout: 10000 });

    if (!res.data?.access_token) {
      throw new Error('Failed to retrieve OAuth access token from Google OAuth Server');
    }

    return res.data.access_token;
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { accountId, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'googlebusiness',
        name: 'Google Business Profile API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/my-business/content/basic-setup',
        message: 'Authentication Required. Configure GOOGLE_BUSINESS_CLIENT_ID & REFRESH_TOKEN in server/.env.',
        configured: false,
      };
    }

    let accessToken: string;
    try {
      accessToken = await this.getAccessToken();
    } catch (tokenErr: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'googlebusiness',
        name: 'Google Business Profile API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/my-business/content/basic-setup',
        message: `OAuth Token Refresh Notice: ${tokenErr.response?.data?.error_description || tokenErr.message}`,
        configured: true,
      };
    }

    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      await axios.get(`${ACCOUNT_MGMT_BASE}/accounts`, { headers, timeout: 10000 });
      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'googlebusiness',
        name: 'Google Business Profile API',
        category: 'SEO',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/my-business/content/basic-setup',
        message: `Google Business Profile API connected & active${accountId ? ` for Account ${accountId}` : ''}.`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      const apiMsg = err.response?.data?.error?.message || err.message;
      return {
        id: 'googlebusiness',
        name: 'Google Business Profile API',
        category: 'SEO',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/my-business/content/basic-setup',
        message: `OAuth Authorized — ${apiMsg}`,
        configured: true,
      };
    }
  }

  public static async getLocations(): Promise<{ configured: boolean; data?: GoogleBusinessLocation[]; message?: string }> {
    const { accountId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_BUSINESS credentials in server/.env' };

    const cacheKey = `locations_${accountId || 'default'}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };

      let targetAccount = accountId;
      if (!targetAccount) {
        const accRes = await axios.get(`${ACCOUNT_MGMT_BASE}/accounts`, { headers, timeout: 10000 });
        targetAccount = accRes.data?.accounts?.[0]?.name?.replace('accounts/', '');
      }

      if (!targetAccount) {
        return { configured: true, message: 'No Google Business Profile accounts found' };
      }

      const locRes = await axios.get(`${BUSINESS_INFO_BASE}/accounts/${targetAccount}/locations?readMask=name,title,primaryCategory,storeCode,storefrontAddress,phoneNumbers,websiteUri`, {
        headers,
        timeout: 10000,
      });

      const data: GoogleBusinessLocation[] = (locRes.data?.locations || []).map((l: any) => ({
        name: l.name,
        title: l.title || 'Local Business',
        primaryCategory: l.primaryCategory?.displayName || 'Business',
        storeCode: l.storeCode,
        addressFormatted: l.storefrontAddress?.addressLines?.join(', '),
        phoneNumber: l.phoneNumbers?.primaryPhone,
        websiteUri: l.websiteUri,
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getPerformance(days: number = 28): Promise<{ configured: boolean; data?: GoogleBusinessPerformanceMetrics; message?: string }> {
    const { locationId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_BUSINESS credentials in server/.env' };

    const cacheKey = `performance_${locationId || 'default'}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };

      const targetLocation = locationId || 'locations/default';
      const endpoint = `${PERFORMANCE_BASE}/${targetLocation}:fetchMultiDailyMetricsTimeSeries`;

      const res = await axios.get(endpoint, {
        headers,
        params: {
          dailyMetrics: ['CALL_CLICKS', 'WEBSITE_CLICKS', 'BUSINESS_DIRECTION_REQUESTS', 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH'],
        },
        timeout: 10000,
      });

      let calls = 0, websiteClicks = 0, directionRequests = 0, profileViews = 0;
      (res.data?.multiDailyMetricTimeSeries || []).forEach((series: any) => {
        const metric = series.dailyMetric;
        const total = (series.dailyMetricTimeSeries?.[0]?.timeSeries?.datedValues || []).reduce((acc: number, v: any) => acc + (parseInt(v.value || '0', 10)), 0);
        if (metric === 'CALL_CLICKS') calls += total;
        if (metric === 'WEBSITE_CLICKS') websiteClicks += total;
        if (metric === 'BUSINESS_DIRECTION_REQUESTS') directionRequests += total;
        if (metric === 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH') profileViews += total;
      });

      const data: GoogleBusinessPerformanceMetrics = {
        calls,
        websiteClicks,
        directionRequests,
        profileViews,
        totalInteractions: calls + websiteClicks + directionRequests,
        dateRange: `Last ${days} Days`,
        fetchedAt: new Date().toISOString(),
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }
}
