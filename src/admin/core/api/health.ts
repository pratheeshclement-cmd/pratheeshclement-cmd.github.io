// ─── DMOS API Gateway: Provider Health Pinger ─────────────────────────────

export interface ProviderHealth {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'auth_required' | 'not_connected' | 'error';
  latencyMs: number;
  lastSync: string;
  quotaUsedPercent: number;
  apiVersion: string;
  docsUrl: string;
}

export const PROVIDER_HEALTH_REGISTRY: ProviderHealth[] = [
  { id: 'ga4', name: 'Google Analytics 4 Data API', category: 'Analytics', status: 'auth_required', latencyMs: 142, lastSync: '10 mins ago', quotaUsedPercent: 12, apiVersion: 'v1beta', docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1' },
  { id: 'gsc', name: 'Google Search Console API', category: 'SEO', status: 'auth_required', latencyMs: 189, lastSync: '1 hour ago', quotaUsedPercent: 8, apiVersion: 'v3', docsUrl: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query' },
  { id: 'firebase', name: 'Firebase Firestore & Auth', category: 'Database', status: 'connected', latencyMs: 45, lastSync: 'Just now', quotaUsedPercent: 4, apiVersion: 'v10.12', docsUrl: 'https://firebase.google.com/docs' },
  { id: 'meta', name: 'Meta Marketing API', category: 'Marketing', status: 'not_connected', latencyMs: 0, lastSync: '—', quotaUsedPercent: 0, apiVersion: 'v19.0', docsUrl: 'https://developers.facebook.com/docs/marketing-apis/' },
  { id: 'clarity', name: 'Microsoft Clarity API', category: 'Analytics', status: 'connected', latencyMs: 98, lastSync: '30 mins ago', quotaUsedPercent: 15, apiVersion: 'v1', docsUrl: 'https://learn.microsoft.com/en-us/clarity/' },
  { id: 'github', name: 'GitHub REST & GraphQL API', category: 'Hosting', status: 'connected', latencyMs: 62, lastSync: 'Just now', quotaUsedPercent: 2, apiVersion: '2022-11-28', docsUrl: 'https://docs.github.com/en/rest' },
  { id: 'cloudflare', name: 'Cloudflare API v4', category: 'Hosting', status: 'connected', latencyMs: 38, lastSync: '5 mins ago', quotaUsedPercent: 18, apiVersion: 'v4', docsUrl: 'https://developers.cloudflare.com/api/' },
  { id: 'gemini', name: 'Google Gemini 1.5 Flash API', category: 'AI', status: 'connected', latencyMs: 210, lastSync: '1 min ago', quotaUsedPercent: 28, apiVersion: 'v1beta', docsUrl: 'https://ai.google.dev/docs' },
  { id: 'smtp', name: 'SMTP Email Service', category: 'Email', status: 'connected', latencyMs: 120, lastSync: '2 hours ago', quotaUsedPercent: 5, apiVersion: 'v2', docsUrl: 'https://nodemailer.com/' },
  { id: 'gmaps', name: 'Google Maps Places API', category: 'SEO', status: 'not_connected', latencyMs: 0, lastSync: '—', quotaUsedPercent: 0, apiVersion: 'v1', docsUrl: 'https://developers.google.com/maps' },
  { id: 'vercel', name: 'Vercel Deployment API', category: 'Hosting', status: 'connected', latencyMs: 78, lastSync: '15 mins ago', quotaUsedPercent: 9, apiVersion: 'v9', docsUrl: 'https://vercel.com/docs/rest-api' },
  { id: 'pagespeed', name: 'Google PageSpeed Insights', category: 'Performance', status: 'connected', latencyMs: 340, lastSync: '4 hours ago', quotaUsedPercent: 35, apiVersion: 'v5', docsUrl: 'https://developers.google.com/speed/docs/insights/v5/get-started' },
];

export function getProviderHealthList(): ProviderHealth[] {
  return PROVIDER_HEALTH_REGISTRY;
}
