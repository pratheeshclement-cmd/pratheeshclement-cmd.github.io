// ─── Integration Service: Google PageSpeed Insights API v5 ───────────────────
// Interfacing with official Google PageSpeed Insights API: https://www.googleapis.com/pagespeedonline/v5/runPagespeed
// Retrieves live Lighthouse performance, accessibility, best-practices, SEO scores & Core Web Vitals.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 Minutes Cache TTL
const memoryCache = new Map<string, { data: PageSpeedAnalysisResult; timestamp: number }>();

export interface PageSpeedScores {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}

export interface MetricItem {
  displayValue: string;
  numericValue: number;
  score: number | null;
}

export interface PageSpeedVitals {
  lcp: MetricItem | null;
  inp: MetricItem | null;
  cls: MetricItem | null;
  fcp: MetricItem | null;
  ttfb: MetricItem | null;
  speedIndex: MetricItem | null;
  tbt: MetricItem | null;
}

export interface PageSpeedAnalysisResult {
  success: boolean;
  url: string;
  strategy: 'mobile' | 'desktop';
  fetchTimestamp: string;
  scores: PageSpeedScores;
  vitals: PageSpeedVitals;
  cached: boolean;
  error?: string;
}

export class PageSpeedIntegrationService {
  private static getApiKey(): string | undefined {
    return (process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY)?.trim();
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const apiKey = this.getApiKey();
    const targetUrl = 'https://pratheeshclement-cmd.github.io/';
    const start = Date.now();

    try {
      let url = `${API_BASE}?url=${encodeURIComponent(targetUrl)}&category=PERFORMANCE&strategy=mobile`;
      if (apiKey) {
        url += `&key=${apiKey}`;
      }

      await axios.get(url, { timeout: 15000 });
      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'pagespeed',
        name: 'Google PageSpeed Insights',
        category: 'Performance',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v5',
        docsUrl: 'https://developers.google.com/speed/docs/insights/v5/get-started',
        message: 'Google PageSpeed Insights API active & operational.',
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'pagespeed',
        name: 'Google PageSpeed Insights',
        category: 'Performance',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v5',
        docsUrl: 'https://developers.google.com/speed/docs/insights/v5/get-started',
        message: `PageSpeed Verification Notice: ${err.response?.data?.error?.message || err.message}`,
        configured: true,
      };
    }
  }

  public static async analyzeUrl(targetUrl?: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<PageSpeedAnalysisResult> {
    const urlToTest = targetUrl || 'https://pratheeshclement-cmd.github.io/';
    const cacheKey = `${urlToTest.toLowerCase().trim()}_${strategy}`;

    const cachedEntry = memoryCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return { ...cachedEntry.data, cached: true };
    }

    const apiKey = this.getApiKey();
    try {
      let apiUrl = `${API_BASE}?url=${encodeURIComponent(urlToTest)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
      if (apiKey) {
        apiUrl += `&key=${apiKey}`;
      }

      const response = await axios.get(apiUrl, { timeout: 30000 });
      const lh = response.data?.lighthouseResult;
      const cats = lh?.categories;
      const audits = lh?.audits;

      const scores: PageSpeedScores = {
        performance: cats?.performance?.score !== undefined ? Math.round(cats.performance.score * 100) : null,
        accessibility: cats?.accessibility?.score !== undefined ? Math.round(cats.accessibility.score * 100) : null,
        bestPractices: cats?.['best-practices']?.score !== undefined ? Math.round(cats['best-practices'].score * 100) : null,
        seo: cats?.seo?.score !== undefined ? Math.round(cats.seo.score * 100) : null,
      };

      const parseMetric = (auditKey: string): MetricItem | null => {
        const item = audits?.[auditKey];
        if (!item) return null;
        return {
          displayValue: item.displayValue || (item.numericValue !== undefined ? `${Math.round(item.numericValue)}ms` : 'N/A'),
          numericValue: item.numericValue !== undefined ? item.numericValue : 0,
          score: item.score !== undefined ? item.score : null,
        };
      };

      const vitals: PageSpeedVitals = {
        lcp: parseMetric('largest-contentful-paint'),
        inp: parseMetric('interaction-to-next-paint') || parseMetric('experimental-interaction-to-next-paint'),
        cls: parseMetric('cumulative-layout-shift'),
        fcp: parseMetric('first-contentful-paint'),
        ttfb: parseMetric('server-response-time'),
        speedIndex: parseMetric('speed-index'),
        tbt: parseMetric('total-blocking-time'),
      };

      const result: PageSpeedAnalysisResult = {
        success: true,
        url: urlToTest,
        strategy,
        fetchTimestamp: new Date().toISOString(),
        scores,
        vitals,
        cached: false,
      };

      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err: any) {
      return {
        success: false,
        url: urlToTest,
        strategy,
        fetchTimestamp: new Date().toISOString(),
        scores: { performance: null, accessibility: null, bestPractices: null, seo: null },
        vitals: { lcp: null, inp: null, cls: null, fcp: null, ttfb: null, speedIndex: null, tbt: null },
        cached: false,
        error: err.response?.data?.error?.message || err.message || 'PageSpeed API Request Failed',
      };
    }
  }
}
