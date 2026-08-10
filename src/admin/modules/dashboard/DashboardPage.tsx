// ─── DMOS Dashboard v6 — Enterprise Operating Dashboard ──────────────────────
// Production-grade operational dashboard powered entirely by real data.
// Zero fake data: all metrics originate from real Firestore, GA4, GSC, Gemini, and backend health checks.

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Users, FileText, Folder, MessageSquare, Activity,
  RefreshCw, Globe, Zap, ArrowUpRight, ShieldCheck, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, MetricCard, PageHeader, SectionHeader, StatusIndicator } from '../../design-system/components';
import { dashboardApi, DashboardResponse } from '../../../services/api/dashboard/api';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };

export const DashboardPage: React.FC = () => {
  const [blogCount, setBlogCount]           = useState<number | null>(null);
  const [projectCount, setProjectCount]     = useState<number | null>(null);
  const [leadCount, setLeadCount]           = useState<number | null>(null);
  const [totalLeadValue, setTotalLeadValue] = useState<number | null>(null);

  const [dashboardData, setDashboardData]   = useState<DashboardResponse | null>(null);
  const [loading, setLoading]               = useState(true);
  const [syncing, setSyncing]               = useState(false);
  const [lastSyncedAt, setLastSyncedAt]     = useState<string | null>(null);
  const [syncError, setSyncError]           = useState<string | null>(null);

  const fetchBackendDashboard = useCallback(async () => {
    try {
      const res = await dashboardApi.getDashboardData();
      if (res && res.data) {
        setDashboardData(prev => res.data || prev);
        setLastSyncedAt(res.data.fetchedAt || new Date().toISOString());
        setSyncError(null);
      }
    } catch (err: any) {
      console.warn('[DashboardPage] Backend fetch error:', err.message);
      setSyncError('Unable to sync latest backend metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const subs: (() => void)[] = [];

    if (db) {
      subs.push(onSnapshot(collection(db, 'blogs'), snap => setBlogCount(snap.size), () => {}));
      subs.push(onSnapshot(collection(db, 'projects'), snap => setProjectCount(snap.size), () => {}));
      subs.push(onSnapshot(collection(db, 'crm'), snap => {
        setLeadCount(snap.size);
        setTotalLeadValue(snap.docs.reduce((s, d) => s + (Number(d.data().value) || 0), 0));
      }, () => {}));
    }

    let interval: number | null = null;
    const scheduleRefresh = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchBackendDashboard();
      }
    };

    fetchBackendDashboard();

    if (typeof window !== 'undefined') {
      interval = window.setInterval(scheduleRefresh, 30000);
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          scheduleRefresh();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        subs.forEach(u => u());
        if (interval !== null) window.clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      subs.forEach(u => u());
      if (interval !== null) window.clearInterval(interval);
    };
  }, [fetchBackendDashboard]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncError(null);
    try {
      await fetchBackendDashboard();
    } finally {
      setTimeout(() => setSyncing(false), 600);
    }
  };

  const handleNavigateModule = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // Derive top metrics cleanly from Firestore or Backend
  const displayBlogCount = blogCount !== null ? blogCount : (dashboardData?.overview?.blogPosts?.value ?? 'No Data');
  const displayProjectCount = projectCount !== null ? projectCount : (dashboardData?.overview?.projects?.value ?? 'No Data');
  const displayLeadCount = leadCount !== null ? leadCount : (dashboardData?.overview?.crmLeads?.value ?? 'No Data');

  const displayPipelineValue = (() => {
    if (totalLeadValue !== null && totalLeadValue > 0) {
      return `₹${(totalLeadValue / 1000).toFixed(1)}k`;
    }
    const bVal = dashboardData?.overview?.pipelineValue?.value;
    if (typeof bVal === 'number' && bVal > 0) {
      return `₹${(bVal / 1000).toFixed(1)}k`;
    }
    return 'No Data';
  })();

  // GA4 Analytics values
  const ga4Analytics = dashboardData?.analytics;
  const ga4Status = ga4Analytics?.visitorsToday?.status;
  const isGA4Live = ga4Status === 'live';

  const visitors = ga4Analytics?.visitorsToday?.value !== null ? ga4Analytics?.visitorsToday?.value : '—';
  const active28d = ga4Analytics?.activeUsers?.value !== null ? ga4Analytics?.activeUsers?.value : '—';
  const pageViews = ga4Analytics?.pageViews?.value !== null ? ga4Analytics?.pageViews?.value : '—';
  const avgDur = ga4Analytics?.avgDuration?.value !== null ? ga4Analytics?.avgDuration?.value : '—';

  // System Health list from backend checks.
  const healthServices = dashboardData?.health?.services ?? [];

  const formattedSyncTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Operating Dashboard"
        subtitle={`pratheeshclement-cmd.github.io · Real Data Connections ${formattedSyncTime ? `(Last synced ${formattedSyncTime})` : ''}`}
        badge={
          isGA4Live ? (
            <Badge variant="success" dot pulse>Live Telemetry</Badge>
          ) : dashboardData?.health?.overallStatus === 'healthy' ? (
            <Badge variant="success" dot>Operational</Badge>
          ) : (
            <Badge variant="warning" dot>Partial Telemetry</Badge>
          )
        }

        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSync}
            loading={syncing}
            leftIcon={<RefreshCw size={14} />}
          >
            {syncing ? 'Syncing...' : 'Sync Metrics'}
          </Button>
        }
      />

      {syncError && (
        <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, color: '#f87171', fontSize: '0.8rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={15} />
          {syncError}
        </div>
      )}

      {/* ── KPI Row ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        {[
          { label: 'Blog Posts',     value: displayBlogCount,     icon: <FileText size={16} color="var(--dmos-primary-light)" />, iconBg: 'var(--dmos-primary-subtle)', changeLabel: 'published posts' },
          { label: 'Active Projects',value: displayProjectCount,  icon: <Folder size={16} color="var(--dmos-secondary)" />, iconBg: 'var(--dmos-secondary-subtle)', changeLabel: 'portfolio projects' },
          { label: 'CRM Leads',      value: displayLeadCount,     icon: <MessageSquare size={16} color="#A78BFA" />, iconBg: 'var(--dmos-accent-subtle)', changeLabel: 'active pipeline' },
          { label: 'Pipeline Value', value: displayPipelineValue, icon: <BarChart2 size={16} color="var(--dmos-success)" />, iconBg: 'var(--dmos-success-bg)', changeLabel: 'est. revenue' },
        ].map(m => (
          <motion.div key={m.label} variants={fadeUp}>
            <MetricCard {...m} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── GA4 Live Traffic Card ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <Card style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
            <SectionHeader
              title="GA4 Realtime Traffic"
              subtitle="Connected via Google Analytics Data API v1beta"
              badge={
                isGA4Live ? (
                  <Badge variant="success" dot pulse size="sm">Live</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Auth Required</Badge>
                )
              }
              style={{ margin: 0 }}
            />
          </div>

          {!loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
              {[
                { label: 'Visitors Today',    value: visitors,  color: 'var(--dmos-primary-light)' },
                { label: 'Active Users (30d)',value: active28d, color: 'var(--dmos-secondary)' },
                { label: 'Total Page Views',  value: pageViews, color: '#A78BFA' },
                { label: 'Avg Duration',      value: avgDur,    color: 'var(--dmos-success)' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {stat.value ?? '—'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)', marginTop: 5 }}>
                    {isGA4Live ? 'Verified GA4 metric' : 'Configure GA4_PROPERTY_ID'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="dmos-skeleton" style={{ height: 10, width: 80, marginBottom: 10 }} />
                  <div className="dmos-skeleton" style={{ height: 28, width: 60, marginBottom: 6 }} />
                  <div className="dmos-skeleton" style={{ height: 8, width: 50 }} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── System Status + Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}
      >
        {/* System Health */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="System Health" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {healthServices.length > 0 ? healthServices.map(s => {
              const mappedStatus = s.status === 'healthy' ? ('healthy' as const) : s.status === 'warning' ? ('warning' as const) : ('error' as const);
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusIndicator status={mappedStatus} pulse={mappedStatus === 'healthy'} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--dmos-text)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dmos-text-subtle)' }}>
                    {s.latencyMs > 0 ? `${s.latencyMs}ms` : s.status === 'not_configured' || s.status === 'auth_required' ? 'Auth Req' : 'Active'}
                  </span>
                </div>
              );
            }) : (
              <div style={{ padding: '18px 0', color: 'var(--dmos-text-subtle)', fontSize: '0.85rem' }}>
                {loading ? 'Loading system health...' : 'Health status unavailable. Please sync metrics.'}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Quick Actions" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Write New Blog Post',    icon: FileText,   color: 'var(--dmos-primary-light)',  bg: 'var(--dmos-primary-subtle)', target: '/admin/blog/' },
              { label: 'Add Portfolio Project',  icon: Folder,     color: 'var(--dmos-secondary)',      bg: 'var(--dmos-secondary-subtle)', target: '/admin/projects/' },
              { label: 'Run SEO Audit',          icon: Zap,        color: 'var(--dmos-warning)',        bg: 'var(--dmos-warning-bg)',       target: '/admin/seo/' },
              { label: 'Generate AI Content',    icon: Activity,   color: '#A78BFA',                   bg: 'var(--dmos-accent-subtle)',    target: '/admin/ai/' },
              { label: 'View Analytics Report',  icon: BarChart2,  color: 'var(--dmos-success)',        bg: 'var(--dmos-success-bg)',       target: '/admin/analytics/' },
            ].map(a => (
              <div
                key={a.label}
                onClick={() => handleNavigateModule(a.target)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)', borderRadius: 9,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon size={14} color={a.color} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--dmos-text)', flex: 1 }}>{a.label}</span>
                <ArrowUpRight size={13} color="var(--dmos-text-subtle)" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

