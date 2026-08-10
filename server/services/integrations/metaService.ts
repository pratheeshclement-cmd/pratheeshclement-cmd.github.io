// ─── Integration Service: Meta Marketing Graph API v19.0 ──────────────────────
// Interfacing with official Meta Graph API: https://graph.facebook.com/v19.0
// Server-side Meta Access Token authentication & 15-minute memory caching.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v20.0';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface MetaAccountDetails {
  id: string;
  name: string;
  accountStatus: number;
  currency: string;
  timezoneName: string;
}

export interface MetaCampaignItem {
  id: string;
  name: string;
  status: string;
  objective: string;
  dailyBudget?: string;
}

export interface MetaInsightMetric {
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  leads: number;
  dateRange: string;
  fetchedAt: string;
}

export interface MetaLeadItem {
  id: string;
  createdTime: string;
  formId: string;
}

export class MetaIntegrationService {
  private static getCredentials() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const hasCreds = Boolean(accessToken && accessToken.trim().length > 0);
    return { accessToken: accessToken?.trim(), adAccountId: adAccountId?.trim(), hasCreds };
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { accessToken, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'meta',
        name: 'Meta Marketing API',
        category: 'Marketing',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GRAPH_API_VERSION,
        docsUrl: 'https://developers.facebook.com/docs/marketing-apis/',
        message: 'Authentication Required. Configure META_ACCESS_TOKEN in server/.env.',
        configured: false,
      };
    }

    try {
      await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'meta',
        name: 'Meta Marketing API',
        category: 'Marketing',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GRAPH_API_VERSION,
        docsUrl: 'https://developers.facebook.com/docs/marketing-apis/',
        message: `Meta Marketing Graph API (${GRAPH_API_VERSION}) connected & active.`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'meta',
        name: 'Meta Marketing API',
        category: 'Marketing',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: GRAPH_API_VERSION,
        docsUrl: 'https://developers.facebook.com/docs/marketing-apis/',
        message: `Meta API Verification Notice: ${err.response?.data?.error?.message || err.message}`,
        configured: true,
      };
    }
  }

  public static async getAccountDetails(): Promise<{ configured: boolean; data?: MetaAccountDetails; message?: string }> {
    const { accessToken, adAccountId, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure META_ACCESS_TOKEN in server/.env' };

    try {
      const endpoint = adAccountId
        ? `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}?fields=name,account_status,currency,timezone_name`
        : `https://graph.facebook.com/${GRAPH_API_VERSION}/me/adaccounts?fields=name,account_status,currency,timezone_name`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });

      const raw = adAccountId ? res.data : (res.data.data?.[0] || {});
      const data: MetaAccountDetails = {
        id: raw.id || adAccountId || 'act_default',
        name: raw.name || 'Meta Ad Account',
        accountStatus: raw.account_status || 1,
        currency: raw.currency || 'INR',
        timezoneName: raw.timezone_name || 'Asia/Kolkata',
      };

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getCampaigns(): Promise<{ configured: boolean; data?: MetaCampaignItem[]; message?: string }> {
    const { accessToken, adAccountId, hasCreds } = this.getCredentials();
    if (!hasCreds || !adAccountId) return { configured: false, message: 'Configure META_ACCESS_TOKEN & META_AD_ACCOUNT_ID in server/.env' };

    const cacheKey = `campaigns_${adAccountId}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const res = await axios.get(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/campaigns?fields=name,status,objective,daily_budget`,
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const data: MetaCampaignItem[] = (res.data.data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        objective: c.objective,
        dailyBudget: c.daily_budget ? `₹${(parseInt(c.daily_budget, 10) / 100).toFixed(2)}` : undefined,
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getInsights(days: number = 28): Promise<{ configured: boolean; data?: MetaInsightMetric; message?: string }> {
    const { accessToken, adAccountId, hasCreds } = this.getCredentials();
    if (!hasCreds || !adAccountId) return { configured: false, message: 'Configure META_ACCESS_TOKEN & META_AD_ACCOUNT_ID in server/.env' };

    const cacheKey = `insights_${adAccountId}_${days}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const datePreset = days <= 7 ? 'last_7d' : days <= 30 ? 'last_30d' : 'last_90d';
      const res = await axios.get(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/insights?fields=impressions,reach,clicks,spend,ctr,cpc,cpm,conversions,actions&date_preset=${datePreset}`,
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10000 }
      );

      const raw = res.data.data?.[0] || {};
      const leadsAction = (raw.actions || []).find((a: any) => a.action_type === 'lead');

      const data: MetaInsightMetric = {
        impressions: parseInt(raw.impressions || '0', 10),
        reach: parseInt(raw.reach || '0', 10),
        clicks: parseInt(raw.clicks || '0', 10),
        spend: parseFloat(parseFloat(raw.spend || '0').toFixed(2)),
        ctr: parseFloat(parseFloat(raw.ctr || '0').toFixed(2)),
        cpc: parseFloat(parseFloat(raw.cpc || '0').toFixed(2)),
        cpm: parseFloat(parseFloat(raw.cpm || '0').toFixed(2)),
        conversions: parseInt(raw.conversions || '0', 10),
        leads: parseInt(leadsAction?.value || '0', 10),
        dateRange: `Last ${days} Days`,
        fetchedAt: new Date().toISOString(),
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }

  public static async getLeads(): Promise<{ configured: boolean; data?: MetaLeadItem[]; message?: string }> {
    const { accessToken, adAccountId, hasCreds } = this.getCredentials();
    if (!hasCreds || !adAccountId) return { configured: false, message: 'Configure META_ACCESS_TOKEN in server/.env' };

    try {
      const res = await axios.get(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/leads?fields=id,created_time,form_id`,
        { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 8000 }
      );

      const data: MetaLeadItem[] = (res.data.data || []).map((l: any) => ({
        id: l.id,
        createdTime: l.created_time || '—',
        formId: l.form_id || '—',
      }));

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error?.message || err.message };
    }
  }
}
