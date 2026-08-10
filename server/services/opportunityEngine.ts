// ─── DMOS Deterministic Opportunity & Priority Engine ──────────────────────────
// Evaluates real telemetry to calculate deterministic SEO & Traffic opportunities.
// Gemini AI explains and recommends actions; Gemini does NOT set priorities or invent data.

export interface ActionItem {
  id: string;
  title: string;
  category: 'SEO' | 'TRAFFIC' | 'CONTENT' | 'CONVERSION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  recommendedAction: string;
  source: string;
  timestamp: string;
  provenance: {
    sourceMetrics: string[];
    generatedAt: string;
    analysisVersion: string;
    dateRange: string;
  };
}

export interface ActionCenterSummary {
  totalOpportunities: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  actions: ActionItem[];
}

export function evaluateOpportunities(
  gscQueries: Array<{ key: string; clicks: number; impressions: number; ctr: number; position: number }> = [],
  gscPages: Array<{ key: string; clicks: number; impressions: number; ctr: number; position: number }> = [],
  dateRange: string = '28d'
): ActionCenterSummary {
  const actions: ActionItem[] = [];
  const generatedAt = new Date().toISOString();

  // 1. Evaluate GSC Top Queries
  gscQueries.forEach((q, idx) => {
    if (!q.key || q.key === '(not set)') return;

    // Rule A: Striking Distance (Rank 4 - 10) with solid impressions
    if (q.position >= 4.0 && q.position <= 10.0 && q.impressions >= 10) {
      const priority: 'HIGH' | 'MEDIUM' = q.impressions >= 30 ? 'HIGH' : 'MEDIUM';
      actions.push({
        id: `query_striking_${idx}`,
        title: `Page 1 Ranking Opportunity: "${q.key}"`,
        category: 'SEO',
        priority,
        evidence: `${q.impressions} impressions, ${q.clicks} clicks (${q.ctr}% CTR), Position ${q.position}`,
        recommendedAction: `Review title tags and content structure for query "${q.key}". Potential improvement by optimizing user intent alignment.`,
        source: 'Google Search Console Search Analytics API',
        timestamp: generatedAt,
        provenance: {
          sourceMetrics: ['gsc.query.impressions', 'gsc.query.position', 'gsc.query.ctr'],
          generatedAt,
          analysisVersion: '1.0',
          dateRange,
        },
      });
    }
    // Rule B: High Impressions with Weak CTR (< 15%)
    else if (q.impressions >= 25 && q.ctr < 15.0) {
      const priority: 'HIGH' | 'MEDIUM' = q.impressions >= 50 ? 'HIGH' : 'MEDIUM';
      actions.push({
        id: `query_ctr_${idx}`,
        title: `CTR Optimization Needed: "${q.key}"`,
        category: 'SEO',
        priority,
        evidence: `${q.impressions} impressions with low CTR (${q.ctr}%), Position ${q.position}`,
        recommendedAction: `High SERP visibility with lower snippet click-through. Requires review of meta descriptions and rich snippets.`,
        source: 'Google Search Console Search Analytics API',
        timestamp: generatedAt,
        provenance: {
          sourceMetrics: ['gsc.query.impressions', 'gsc.query.ctr'],
          generatedAt,
          analysisVersion: '1.0',
          dateRange,
        },
      });
    }
    // Rule C: Low Rank / High Potential
    else if (q.position > 10.0 && q.impressions >= 15) {
      actions.push({
        id: `query_lowrank_${idx}`,
        title: `Keywords Outside Page 1: "${q.key}"`,
        category: 'SEO',
        priority: 'LOW',
        evidence: `${q.impressions} impressions at Position ${q.position}`,
        recommendedAction: `Build internal links and expand topic coverage for keyword "${q.key}".`,
        source: 'Google Search Console Search Analytics API',
        timestamp: generatedAt,
        provenance: {
          sourceMetrics: ['gsc.query.position', 'gsc.query.impressions'],
          generatedAt,
          analysisVersion: '1.0',
          dateRange,
        },
      });
    }
  });

  // 2. Evaluate GSC Top Pages
  gscPages.forEach((p, idx) => {
    if (!p.key || p.key === '/') return;

    if (p.impressions >= 30 && p.ctr < 10.0) {
      actions.push({
        id: `page_ctr_${idx}`,
        title: `Low Landing Page CTR: ${p.key}`,
        category: 'CONTENT',
        priority: p.impressions >= 100 ? 'HIGH' : 'MEDIUM',
        evidence: `${p.impressions} impressions, ${p.clicks} clicks (${p.ctr}% CTR) on page ${p.key}`,
        recommendedAction: `Evaluate search snippet presentation for URL ${p.key}. Ensure page title directly addresses search queries.`,
        source: 'Google Search Console Search Analytics API',
        timestamp: generatedAt,
        provenance: {
          sourceMetrics: ['gsc.page.impressions', 'gsc.page.ctr'],
          generatedAt,
          analysisVersion: '1.0',
          dateRange,
        },
      });
    }
  });

  const highPriorityCount = actions.filter(a => a.priority === 'HIGH').length;
  const mediumPriorityCount = actions.filter(a => a.priority === 'MEDIUM').length;
  const lowPriorityCount = actions.filter(a => a.priority === 'LOW').length;

  return {
    totalOpportunities: actions.length,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    actions,
  };
}
