// ─── Integration Service: Google Ads REST API v17 ─────────────────────────────
// Interfacing with official Google Ads API v17 via server-side OAuth2 & GAQL.
// Strictly Read-Only operations: Campaigns, Ad Groups, Keywords, Insights.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const GOOGLE_ADS_API_VERSION = process.env.GOOGLE_ADS_API_VERSION || 'v17';
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface GoogleAdsAccountInfo {
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  testAccount: boolean;
}

export interface GoogleAdsCampaignItem {
  id: string;
  name: string;
  status: string;
  advertisingChannelType: string;
  amountMicros?: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  ctr: number;
  averageCpcMicros: number;
  conversions: number;
}

export interface GoogleAdsAdGroupItem {
  id: string;
  name: string;
  campaignId: string;
  status: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
}

export interface GoogleAdsKeywordItem {
  id: string;
  text: string;
  matchType: string;
  adGroupId: string;
  impressions: number;
  clicks: number;
  costMicros: number;
}

export interface GoogleAdsInsightsMetric {
  impressions: number;
  clicks: number;
  costMicros: number;
  costFormatted: string;
  ctr: number;
  averageCpcMicros: number;
  conversions: number;
  conversionValue: number;
  costPerConversionMicros: number;
  dateRange: string;
  fetchedAt: string;
}

export class GoogleAdsIntegrationService {
  private static getCredentials() {
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || process.env.GOOGLE_DEVELOPER_TOKEN;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
    const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || process.env.GOOGLE_CUSTOMER_ID)?.replace(/-/g, '').trim();
    const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_LOGIN_CUSTOMER_ID)?.replace(/-/g, '').trim();

    const hasCreds = Boolean(
      developerToken && developerToken.trim().length > 0 &&
      clientId && clientId.trim().length > 0 &&
      refreshToken && refreshToken.trim().length > 0 &&
      customerId && customerId.trim().length > 0
    );

    return { developerToken: developerToken?.trim(), clientId: clientId?.trim(), clientSecret: clientSecret?.trim(), refreshToken: refreshToken?.trim(), customerId, loginCustomerId, hasCreds };
  }

  public static async getAccessToken(): Promise<string> {
    const { clientId, clientSecret, refreshToken } = this.getCredentials();
    if (!clientId || !refreshToken) throw new Error('Missing Google Ads OAuth Credentials');

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
    const { developerToken, customerId, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'googleads',
        name: 'Google Ads API',
        category: 'Marketing',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GOOGLE_ADS_API_VERSION,
        docsUrl: 'https://developers.google.com/google-ads/api/docs/first-call/overview',
        message: 'Authentication Required. Configure GOOGLE_ADS_DEVELOPER_TOKEN & GOOGLE_ADS_CUSTOMER_ID in server/.env.',
        configured: false,
      };
    }

    let accessToken: string;
    try {
      accessToken = await this.getAccessToken();
    } catch (tokenErr: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'googleads',
        name: 'Google Ads API',
        category: 'Marketing',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GOOGLE_ADS_API_VERSION,
        docsUrl: 'https://developers.google.com/google-ads/api/docs/first-call/overview',
        message: `OAuth Token Refresh Notice: ${tokenErr.response?.data?.error_description || tokenErr.message}`,
        configured: true,
      };
    }

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken!,
        'Content-Type': 'application/json',
      };
      if (this.getCredentials().loginCustomerId) {
        headers['login-customer-id'] = this.getCredentials().loginCustomerId!;
      }

      const gaqlQuery = 'SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1';
      await axios.post(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, {
        query: gaqlQuery,
      }, { headers, timeout: 10000 });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'googleads',
        name: 'Google Ads API',
        category: 'Marketing',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GOOGLE_ADS_API_VERSION,
        docsUrl: 'https://developers.google.com/google-ads/api/docs/first-call/overview',
        message: `Google Ads API (${GOOGLE_ADS_API_VERSION}) connected & active for Customer ID ${customerId}.`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      const apiMsg = err.response?.data?.error?.message || err.message;
      return {
        id: 'googleads',
        name: 'Google Ads API',
        category: 'Marketing',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GOOGLE_ADS_API_VERSION,
        docsUrl: 'https://developers.google.com/google-ads/api/docs/first-call/overview',
        message: `OAuth Authorized — ${apiMsg}`,
        configured: true,
      };
    }
  }

  public static async getAccountDetails(): Promise<{ configured: boolean; data?: GoogleAdsAccountInfo; message?: string }> {
    const { developerToken, customerId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_ADS credentials in server/.env' };

    try {
      const accessToken = await this.getAccessToken();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken!,
        'Content-Type': 'application/json',
      };
      if (this.getCredentials().loginCustomerId) {
        headers['login-customer-id'] = this.getCredentials().loginCustomerId!;
      }

      const query = 'SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone, customer.test_account FROM customer LIMIT 1';
      const res = await axios.post(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, { query }, { headers, timeout: 10000 });

      const row = res.data?.results?.[0]?.customer || {};
      const data: GoogleAdsAccountInfo = {
        customerId: row.id || customerId!,
        descriptiveName: row.descriptiveName || 'Google Ads Account',
        currencyCode: row.currencyCode || 'INR',
        timeZone: row.timeZone || 'Asia/Kolkata',
        testAccount: Boolean(row.testAccount),
      };

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getCampaigns(): Promise<{ configured: boolean; data?: GoogleAdsCampaignItem[]; message?: string }> {
    const { developerToken, customerId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_ADS credentials in server/.env' };

    const cacheKey = `campaigns_${customerId}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken!,
        'Content-Type': 'application/json',
      };
      if (this.getCredentials().loginCustomerId) {
        headers['login-customer-id'] = this.getCredentials().loginCustomerId!;
      }

      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY metrics.impressions DESC
        LIMIT 50
      `;

      const res = await axios.post(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, { query }, { headers, timeout: 12000 });

      const data: GoogleAdsCampaignItem[] = (res.data?.results || []).map((r: any) => {
        const c = r.campaign || {};
        const m = r.metrics || {};
        return {
          id: c.id,
          name: c.name,
          status: c.status,
          advertisingChannelType: c.advertisingChannelType || 'SEARCH',
          impressions: parseInt(m.impressions || '0', 10),
          clicks: parseInt(m.clicks || '0', 10),
          costMicros: parseInt(m.costMicros || '0', 10),
          ctr: parseFloat(parseFloat(m.ctr || '0').toFixed(4)),
          averageCpcMicros: parseInt(m.averageCpc || '0', 10),
          conversions: parseInt(m.conversions || '0', 10),
        };
      });

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getInsights(days: number = 28): Promise<{ configured: boolean; data?: GoogleAdsInsightsMetric; message?: string }> {
    const { developerToken, customerId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_ADS credentials in server/.env' };

    const cacheKey = `insights_${customerId}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const accessToken = await this.getAccessToken();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken!,
        'Content-Type': 'application/json',
      };
      if (this.getCredentials().loginCustomerId) {
        headers['login-customer-id'] = this.getCredentials().loginCustomerId!;
      }

      const query = `
        SELECT
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.ctr,
          metrics.average_cpc,
          metrics.conversions,
          metrics.conversions_value,
          metrics.cost_per_conversion
        FROM customer
        WHERE segments.date LAST_${days}_DAYS
      `;

      const res = await axios.post(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, { query }, { headers, timeout: 12000 });

      let impressions = 0, clicks = 0, costMicros = 0, conversions = 0, conversionValue = 0;
      (res.data?.results || []).forEach((r: any) => {
        const m = r.metrics || {};
        impressions += parseInt(m.impressions || '0', 10);
        clicks += parseInt(m.clicks || '0', 10);
        costMicros += parseInt(m.costMicros || '0', 10);
        conversions += parseInt(m.conversions || '0', 10);
        conversionValue += parseFloat(m.conversionsValue || '0');
      });

      const costInUnits = costMicros / 1000000;
      const ctr = impressions > 0 ? clicks / impressions : 0;
      const averageCpcMicros = clicks > 0 ? Math.round(costMicros / clicks) : 0;
      const costPerConversionMicros = conversions > 0 ? Math.round(costMicros / conversions) : 0;

      const data: GoogleAdsInsightsMetric = {
        impressions,
        clicks,
        costMicros,
        costFormatted: `₹${costInUnits.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ctr: parseFloat(ctr.toFixed(4)),
        averageCpcMicros,
        conversions,
        conversionValue: parseFloat(conversionValue.toFixed(2)),
        costPerConversionMicros,
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
