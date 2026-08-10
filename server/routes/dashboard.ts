// ─── DMOS Dashboard Express Router ──────────────────────────────────────────
// Production-grade real-time operational dashboard API router.
// Zero fake data: all metrics originate from real backend integrations, Firestore, GA4, GSC, and health checks.

import { Router, Request, Response } from 'express';
import axios from 'axios';
import { db } from '../config/firebaseAdmin';
import { FIRESTORE_COLLECTIONS } from '../db/schema';
import { GA4IntegrationService } from '../services/integrations/ga4Service';
import { GSCIntegrationService } from '../services/integrations/gscService';
import { FirebaseIntegrationService } from '../services/integrations/firebaseService';
import { GitHubIntegrationService } from '../services/integrations/githubService';
import { GeminiIntegrationService } from '../services/integrations/geminiService';
import { evaluateOpportunities, ActionCenterSummary } from '../services/opportunityEngine';
import { verifyAllConnections } from '../services/integrations';
import { requireAdminAuth } from '../middleware/auth';

export const dashboardRouter = Router();
dashboardRouter.use(requireAdminAuth);


export interface DashboardMetric {
  value: number | string | null;
  previousValue?: number | string | null;
  change?: number | null;
  changePercent?: number | null;
  source: string;
  fetchedAt: string | null;
  status: 'live' | 'stale' | 'unavailable' | 'error' | 'not_configured' | 'auth_required';
  error?: string;
}

export interface DashboardHealthItem {
  id: string;
  label: string;
  status: 'healthy' | 'warning' | 'error' | 'auth_required' | 'not_configured';
  latencyMs: number;
  message: string;
  lastCheckedAt: string;
}

export interface DashboardResponse {
  fetchedAt: string;
  overview: {
    blogPosts: DashboardMetric;
    projects: DashboardMetric;
    crmLeads: DashboardMetric;
    pipelineValue: DashboardMetric;
  };
  analytics: {
    visitorsToday: DashboardMetric;
    activeUsers: DashboardMetric;
    pageViews: DashboardMetric;
    avgDuration: DashboardMetric;
    gscClicks?: DashboardMetric;
    gscImpressions?: DashboardMetric;
  };
  health: {
    services: DashboardHealthItem[];
    overallStatus: 'healthy' | 'degraded' | 'error';
  };
  connections: Array<{
    id: string;
    name: string;
    status: string;
    latencyMs: number;
    lastCheckedAt: string;
    message?: string;
  }>;
  activity: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>;
  actionCenter?: ActionCenterSummary;
  errors: string[];
}


const getDashboardDataInternal = async (): Promise<DashboardResponse> => {
  const serverStart = performance.now();
  const fetchedAt = new Date().toISOString();
  const errors: string[] = [];

  // 1. Overview metrics from Firestore
  let blogCount: number | null = null;
  let blogStatus: DashboardMetric['status'] = 'not_configured';

  let projectCount: number | null = null;
  let projectStatus: DashboardMetric['status'] = 'not_configured';

  let leadCount: number | null = null;
  let pipelineVal: number | null = null;
  let crmStatus: DashboardMetric['status'] = 'not_configured';

  if (db) {
    try {
      const blogSnap = await db.collection(FIRESTORE_COLLECTIONS.BLOGS).get();
      blogCount = blogSnap.size;
      blogStatus = 'live';
    } catch (e: any) {
      blogStatus = 'error';
      errors.push(`Firestore Blogs Read Error: ${e.message}`);
    }

    try {
      const projSnap = await db.collection(FIRESTORE_COLLECTIONS.PROJECTS).get();
      projectCount = projSnap.size;
      projectStatus = 'live';
    } catch (e: any) {
      projectStatus = 'error';
      errors.push(`Firestore Projects Read Error: ${e.message}`);
    }

    try {
      const crmSnap = await db.collection(FIRESTORE_COLLECTIONS.CRM).get();
      leadCount = crmSnap.size;
      let totalVal = 0;
      crmSnap.docs.forEach(doc => {
        const data = doc.data();
        // Strict lead value parsing: only count numeric or parseable values
        if (typeof data.value === 'number' && !isNaN(data.value)) {
          totalVal += data.value;
        } else if (typeof data.value === 'string') {
          const parsed = parseFloat(data.value);
          if (!isNaN(parsed)) {
            totalVal += parsed;
          }
        }
      });
      pipelineVal = totalVal;
      crmStatus = 'live';
    } catch (e: any) {
      crmStatus = 'error';
      errors.push(`Firestore CRM Read Error: ${e.message}`);
    }
  } else {
    blogStatus = 'not_configured';
    projectStatus = 'not_configured';
    crmStatus = 'not_configured';
  }

  // 2. Real GA4 Analytics metrics
  let visitorsTodayMetric: DashboardMetric = {
    value: null,
    source: 'Google Analytics 4',
    fetchedAt: null,
    status: 'auth_required',
    error: 'GA4 OAuth credentials not configured',
  };
  let activeUsersMetric: DashboardMetric = {
    value: null,
    source: 'Google Analytics 4',
    fetchedAt: null,
    status: 'auth_required',
    error: 'GA4 OAuth credentials not configured',
  };
  let pageViewsMetric: DashboardMetric = {
    value: null,
    source: 'Google Analytics 4',
    fetchedAt: null,
    status: 'auth_required',
    error: 'GA4 OAuth credentials not configured',
  };
  let avgDurationMetric: DashboardMetric = {
    value: null,
    source: 'Google Analytics 4',
    fetchedAt: null,
    status: 'auth_required',
    error: 'GA4 OAuth credentials not configured',
  };

  try {
    const ga4Res = await GA4IntegrationService.getOverview(30);
    if (ga4Res.configured && ga4Res.data) {
      const d = ga4Res.data;
      const ga4FetchedAt = d.fetchedAt || fetchedAt;

      visitorsTodayMetric = {
        value: d.users,
        source: 'Google Analytics 4 (Data API v1beta)',
        fetchedAt: ga4FetchedAt,
        status: 'live',
      };
      activeUsersMetric = {
        value: d.sessions,
        source: 'Google Analytics 4 (Data API v1beta)',
        fetchedAt: ga4FetchedAt,
        status: 'live',
      };
      pageViewsMetric = {
        value: d.pageViews,
        source: 'Google Analytics 4 (Data API v1beta)',
        fetchedAt: ga4FetchedAt,
        status: 'live',
      };
      const mins = Math.floor(d.averageEngagementTime / 60);
      const secs = d.averageEngagementTime % 60;
      avgDurationMetric = {
        value: `${mins}m ${secs}s`,
        source: 'Google Analytics 4 (Data API v1beta)',
        fetchedAt: ga4FetchedAt,
        status: 'live',
      };
    } else if (ga4Res.message) {
      visitorsTodayMetric.error = ga4Res.message;
      activeUsersMetric.error = ga4Res.message;
      pageViewsMetric.error = ga4Res.message;
      avgDurationMetric.error = ga4Res.message;
    }
  } catch (e: any) {
    errors.push(`GA4 Data Fetch Error: ${e.message}`);
  }

  // 3. GSC Analytics metrics
  let gscClicksMetric: DashboardMetric = {
    value: null,
    source: 'Google Search Console',
    fetchedAt: null,
    status: 'auth_required',
    error: 'Search Console property or credentials not configured',
  };
  let gscImpressionsMetric: DashboardMetric = {
    value: null,
    source: 'Google Search Console',
    fetchedAt: null,
    status: 'auth_required',
    error: 'Search Console property or credentials not configured',
  };

  let actionCenter: ActionCenterSummary = {
    totalOpportunities: 0,
    highPriorityCount: 0,
    mediumPriorityCount: 0,
    lowPriorityCount: 0,
    actions: [],
  };

  try {
    const gscRes = await GSCIntegrationService.getOverview(28);
    if (gscRes.configured && gscRes.data) {
      gscClicksMetric = {
        value: gscRes.data.clicks,
        source: 'Google Search Console API',
        fetchedAt: gscRes.data.fetchedAt,
        status: 'live',
      };
      gscImpressionsMetric = {
        value: gscRes.data.impressions,
        source: 'Google Search Console API',
        fetchedAt: gscRes.data.fetchedAt,
        status: 'live',
      };

      const [queriesRes, pagesRes] = await Promise.all([
        GSCIntegrationService.getQueries(28, 20),
        GSCIntegrationService.getPages(28, 20),
      ]);
      actionCenter = evaluateOpportunities(queriesRes.data || [], pagesRes.data || [], '28d');
    } else if (gscRes.message) {
      gscClicksMetric.error = gscRes.message;
      gscImpressionsMetric.error = gscRes.message;
    }
  } catch (e: any) {
    errors.push(`GSC Data Fetch Notice: ${e.message}`);
  }


  // 4. Service Health Verifications with Measured Latency
  const healthServices: DashboardHealthItem[] = [];

  // A. Firebase Firestore
  const fbResult = await FirebaseIntegrationService.verify();
  healthServices.push({
    id: 'firebase',
    label: 'Firebase Firestore',
    status: fbResult.status === 'connected' ? 'healthy' : fbResult.status === 'auth_required' ? 'not_configured' : 'error',
    latencyMs: fbResult.latencyMs,
    message: fbResult.message,
    lastCheckedAt: fbResult.lastCheckedAt,
  });

  // B. Express Backend API (Self Health — Measured Latency)
  const selfLatencyMs = Math.max(1, Math.round(performance.now() - serverStart));
  healthServices.push({
    id: 'express',
    label: 'Express Backend API',
    status: 'healthy',
    latencyMs: selfLatencyMs,
    message: 'Backend server active & operational',
    lastCheckedAt: fetchedAt,
  });

  // C. GitHub Pages / CDN — Live HTTP Request to Production Portfolio URL
  let ghStatus: DashboardHealthItem['status'] = 'warning';
  let ghLatencyMs = 0;
  let ghMessage = 'GitHub Pages CDN check pending';
  const ghCheckStart = performance.now();

  try {
    const ghRes = await axios.get('https://pratheeshclement-cmd.github.io/', { timeout: 3500 });

    ghLatencyMs = Math.max(1, Math.round(performance.now() - ghCheckStart));
    if (ghRes.status === 200) {
      ghStatus = 'healthy';
      ghMessage = `Production URL accessible (HTTP 200 OK, ${ghLatencyMs}ms)`;
    } else {
      ghStatus = 'warning';
      ghMessage = `Production URL returned HTTP ${ghRes.status}`;
    }
  } catch (ghErr: any) {
    ghLatencyMs = Math.max(1, Math.round(performance.now() - ghCheckStart));
    if (ghErr.response) {
      ghStatus = ghErr.response.status >= 500 ? 'error' : 'warning';
      ghMessage = `Production URL returned HTTP ${ghErr.response.status}`;
    } else if (ghErr.code === 'ECONNABORTED' || ghErr.message?.includes('timeout')) {
      ghStatus = 'error';
      ghMessage = `Production URL health check timed out (${ghLatencyMs}ms)`;
    } else if (ghErr.code === 'ENOTFOUND' || ghErr.message?.includes('getaddrinfo')) {
      ghStatus = 'error';
      ghMessage = 'Production URL DNS lookup failed';
    } else {
      const ghResult = await GitHubIntegrationService.verify();
      ghStatus = ghResult.status === 'connected' ? 'healthy' : 'warning';
      ghLatencyMs = ghResult.latencyMs;
      ghMessage = ghResult.message;
    }
  }


  healthServices.push({
    id: 'github',
    label: 'GitHub Pages CDN',
    status: ghStatus,
    latencyMs: ghLatencyMs,
    message: ghMessage,
    lastCheckedAt: fetchedAt,
  });

  // D. Google Analytics 4
  const ga4Result = await GA4IntegrationService.verify();
  healthServices.push({
    id: 'ga4',
    label: 'Google Analytics 4',
    status: ga4Result.status === 'connected' ? 'healthy' : ga4Result.status === 'auth_required' ? 'auth_required' : 'warning',
    latencyMs: ga4Result.latencyMs,
    message: ga4Result.message,
    lastCheckedAt: ga4Result.lastCheckedAt,
  });

  // E. Gemini AI API
  const geminiResult = await GeminiIntegrationService.verify();
  healthServices.push({
    id: 'gemini',
    label: 'Gemini AI API',
    status: geminiResult.status === 'connected' ? 'healthy' : geminiResult.status === 'auth_required' ? 'not_configured' : 'warning',
    latencyMs: geminiResult.latencyMs,
    message: geminiResult.message,
    lastCheckedAt: geminiResult.lastCheckedAt,
  });

  // 5. Overall Health Determination
  const hasError = healthServices.some(s => s.status === 'error');
  const hasWarning = healthServices.some(s => s.status === 'warning' || s.status === 'auth_required');
  const overallStatus: 'healthy' | 'degraded' | 'error' = hasError ? 'error' : hasWarning ? 'degraded' : 'healthy';

  // 6. Connections Summary
  const allConnections = await verifyAllConnections();

  // 7. Recent System Activity from Firestore / CRM if available
  const activityList: DashboardResponse['activity'] = [];
  if (db) {
    try {
      const recentLeads = await db.collection(FIRESTORE_COLLECTIONS.CRM).orderBy('createdAt', 'desc').limit(5).get();
      recentLeads.docs.forEach(doc => {
        const d = doc.data();
        activityList.push({
          id: doc.id,
          title: `New Lead: ${d.name || 'Anonymous'}`,
          description: `Inquiry for ${d.service || 'General Service'} (${d.company || 'Direct'})`,
          timestamp: d.createdAt || fetchedAt,
          type: 'info',
        });
      });
    } catch (_) {}
  }

  return {
    fetchedAt,
    overview: {
      blogPosts: {
        value: blogCount,
        source: 'Firestore (blogs collection)',
        fetchedAt,
        status: blogStatus,
      },
      projects: {
        value: projectCount,
        source: 'Firestore (projects collection)',
        fetchedAt,
        status: projectStatus,
      },
      crmLeads: {
        value: leadCount,
        source: 'Firestore (crm collection)',
        fetchedAt,
        status: crmStatus,
      },
      pipelineValue: {
        value: pipelineVal,
        source: 'Firestore (crm lead values sum)',
        fetchedAt,
        status: crmStatus,
      },
    },
    analytics: {
      visitorsToday: visitorsTodayMetric,
      activeUsers: activeUsersMetric,
      pageViews: pageViewsMetric,
      avgDuration: avgDurationMetric,
      gscClicks: gscClicksMetric,
      gscImpressions: gscImpressionsMetric,
    },
    health: {
      services: healthServices,
      overallStatus,
    },
    connections: allConnections.map(c => ({
      id: c.id,
      name: c.name,
      status: c.status,
      latencyMs: c.latencyMs,
      lastCheckedAt: c.lastCheckedAt,
      message: c.message,
    })),
    activity: activityList,
    actionCenter,
    errors,
  };
};


// GET /api/admin/dashboard & GET /api/dashboard/stats
const handleGetDashboard = async (req: Request, res: Response) => {
  try {
    const data = await getDashboardDataInternal();
    res.json({
      success: true,
      data,
      stats: {
        totalVisitors: data.analytics.visitorsToday.value,
        activeLeads: data.overview.crmLeads.value,
        publishedBlogs: data.overview.blogPosts.value,
        featuredProjects: data.overview.projects.value,
        serverHealth: data.health.overallStatus === 'healthy' ? '100%' : 'Degraded',
      },
      timestamp: data.fetchedAt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

dashboardRouter.get('/', handleGetDashboard);
dashboardRouter.get('/stats', handleGetDashboard);
dashboardRouter.get('/overview', handleGetDashboard);


