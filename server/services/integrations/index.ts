// ─── Master Connections Integration Gateway Orchestrator ─────────────────────

import { ProviderHealthResult } from './integrationTypes';
import { GA4IntegrationService } from './ga4Service';
import { GSCIntegrationService } from './gscService';
import { FirebaseIntegrationService } from './firebaseService';
import { MetaIntegrationService } from './metaService';
import { ClarityService } from '../clarityService';
import { GitHubIntegrationService } from './githubService';
import { CloudflareIntegrationService } from './cloudflareService';
import { GeminiIntegrationService } from './geminiService';
import { SMTPIntegrationService } from './smtpService';
import { MapsIntegrationService } from './mapsService';
import { VercelIntegrationService } from './vercelService';
import { PageSpeedIntegrationService } from './pagespeedService';
import { GoogleAdsIntegrationService } from './googleAdsService';
import { GoogleBusinessIntegrationService } from './googleBusinessService';

export * from './integrationTypes';

export async function verifySingleProvider(providerId: string): Promise<ProviderHealthResult> {
  const start = Date.now();
  switch (providerId) {
    case 'ga4':
      return GA4IntegrationService.verify();
    case 'gsc':
      return GSCIntegrationService.verify();
    case 'firebase':
      return FirebaseIntegrationService.verify();
    case 'meta':
      return MetaIntegrationService.verify();
    case 'clarity': {
      const v = await ClarityService.verifyConnection();
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'clarity',
        name: 'Microsoft Clarity API',
        category: 'Analytics',
        status: v.success ? 'connected' : v.status === 'not_configured' ? 'auth_required' : 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://clarity.microsoft.com/projects/view/xz1njtkayn/dashboard',
        message: v.message,
        configured: v.status !== 'not_configured',
      };
    }
    case 'github':
      return GitHubIntegrationService.verify();
    case 'cloudflare':
      return CloudflareIntegrationService.verify();
    case 'gemini':
      return GeminiIntegrationService.verify();
    case 'smtp':
      return SMTPIntegrationService.verify();
    case 'gmaps':
      return MapsIntegrationService.verify();
    case 'vercel':
      return VercelIntegrationService.verify();
    case 'pagespeed':
      return PageSpeedIntegrationService.verify();
    case 'googleads':
      return GoogleAdsIntegrationService.verify();
    case 'googlebusiness':
      return GoogleBusinessIntegrationService.verify();
    default:
      throw new Error(`Unknown provider ID: ${providerId}`);
  }
}

export async function verifyAllConnections(): Promise<ProviderHealthResult[]> {
  const providerIds = [
    'ga4', 'gsc', 'firebase', 'meta', 'clarity',
    'github', 'cloudflare', 'gemini', 'smtp', 'gmaps',
    'vercel', 'pagespeed', 'googleads', 'googlebusiness',
  ];

  // Parallel verification across all 12 providers
  const results = await Promise.allSettled(
    providerIds.map(id => verifySingleProvider(id))
  );

  return results.map((res, idx) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return {
      id: providerIds[idx],
      name: providerIds[idx].toUpperCase(),
      category: 'System',
      status: 'error',
      latencyMs: 0,
      lastCheckedAt: new Date().toISOString(),
      apiVersion: 'v1',
      docsUrl: '#',
      message: res.reason?.message || 'Verification exception',
      configured: false,
    };
  });
}
