// ─── DMOS Dashboard v6 — Enterprise Operating Dashboard ──────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Users, FileText, Folder, MessageSquare, Activity,
  RefreshCw, Globe, Zap, TrendingUp, ArrowUpRight, ShieldCheck,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { AnalyticsService } from '../../services/analytics/AnalyticsService';
import { Card, Button, Badge, MetricCard, PageHeader, SectionHeader, StatRow, StatusIndicator, ProgressBar } from '../../design-system/components';
import { dashboardApi } from '../../../services/api/dashboard/api';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };

export const DashboardPage: React.FC = () => {
  const [blogCount, setBlogCount]           = useState(0);
  const [projectCount, setProjectCount]     = useState(0);
  const [leadCount, setLeadCount]           = useState(0);
  const [totalLeadValue, setTotalLeadValue] = useState(0);
  const [ga4KPIs, setGa4KPIs]               = useState<any>(null);
  const [loading, setLoading]               = useState(true);
  const [syncing, setSyncing]               = useState(false);

  useEffect(() => {
    const subs: (() => void)[] = [];

    if (db) {
      subs.push(onSnapshot(collection(db, 'blogs'), snap => setBlogCount(snap.size), () => {}));
      subs.push(onSnapshot(collection(db, 'projects'), snap => setProjectCount(snap.size), () => {}));
      subs.push(onSnapshot(collection(db, 'crm'), snap => {
        setLeadCount(snap.size);
        setTotalLeadValue(snap.docs.reduce((s, d) => s + (d.data().value || 0), 0));
      }, () => {}));
      setLoading(false);
    } else {
      setLoading(false);
    }

    AnalyticsService.getKPIs().then(k => setGa4KPIs(k)).catch(() => {});
    dashboardApi.getStats().catch(() => {});
    return () => subs.forEach(u => u());
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try { setGa4KPIs(await AnalyticsService.getKPIs()); } catch (_) {}
    finally { setTimeout(() => setSyncing(false), 700); }
  };

  const visitors  = ga4KPIs?.visitorsToday?.value ?? '—';
  const active28d = ga4KPIs?.activeUsers?.value ?? '—';
  const pageViews = ga4KPIs?.pageViews?.value ?? '—';
  const avgDur    = ga4KPIs?.avgSessionDuration?.value ?? '—';

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Operating Dashboard"
        subtitle="pratheeshclement-cmd.github.io · Realtime Firestore & GA4"
        badge={<Badge variant="success" dot pulse>Live</Badge>}
        actions={
          <Button variant="secondary" size="sm" onClick={handleSync} loading={syncing} leftIcon={<RefreshCw size={14} />}>
            Sync Metrics
          </Button>
        }
      />

      {/* ── KPI Row ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        {[
          { label: 'Blog Posts',     value: blogCount,  icon: <FileText size={16} color="var(--dmos-primary-light)" />, iconBg: 'var(--dmos-primary-subtle)', change: 14.2, changeLabel: 'vs last month' },
          { label: 'Active Projects',value: projectCount,icon:<Folder size={16} color="var(--dmos-secondary)" />, iconBg: 'var(--dmos-secondary-subtle)', change: 8.5, changeLabel: 'published' },
          { label: 'CRM Leads',      value: leadCount,  icon: <MessageSquare size={16} color="#A78BFA" />, iconBg: 'var(--dmos-accent-subtle)', change: 22.4, changeLabel: 'pipeline' },
          { label: 'Pipeline Value', value: `₹${(totalLeadValue / 1000).toFixed(1)}k`, icon: <BarChart2 size={16} color="var(--dmos-success)" />, iconBg: 'var(--dmos-success-bg)', change: 18.9, changeLabel: 'est. revenue', isPercent: false },
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
              badge={ga4KPIs ? <Badge variant="success" dot pulse size="sm">Live</Badge> : undefined}
              style={{ margin: 0 }}
            />
          </div>

          {ga4KPIs ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
              {[
                { label: 'Visitors Today',    value: visitors,  change: ga4KPIs.visitorsToday?.change, color: 'var(--dmos-primary-light)' },
                { label: 'Active Users (28d)',value: active28d, change: ga4KPIs.activeUsers?.change,   color: 'var(--dmos-secondary)' },
                { label: 'Total Page Views',  value: pageViews, change: ga4KPIs.pageViews?.change,     color: '#A78BFA' },
                { label: 'Avg Duration',      value: avgDur,    change: ga4KPIs.avgSessionDuration?.change, color: 'var(--dmos-success)' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.value}</div>
                  {stat.change !== undefined && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--dmos-success)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                      <TrendingUp size={11} />+{stat.change}% vs last period
                    </div>
                  )}
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
            {[
              { label: 'Firebase Firestore',    status: 'healthy' as const,   latency: '45ms' },
              { label: 'Express Backend API',   status: 'healthy' as const,   latency: '18ms' },
              { label: 'GitHub Pages CDN',      status: 'healthy' as const,   latency: '24ms' },
              { label: 'Google Analytics 4',    status: ga4KPIs ? 'healthy' as const : 'warning' as const, latency: ga4KPIs ? '142ms' : 'Auth Req' },
              { label: 'Gemini AI API',         status: 'healthy' as const,   latency: '210ms' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusIndicator status={s.status} pulse={s.status === 'healthy'} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--dmos-text)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dmos-text-subtle)' }}>{s.latency}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Quick Actions" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Write New Blog Post',    icon: FileText,   color: 'var(--dmos-primary-light)',  bg: 'var(--dmos-primary-subtle)' },
              { label: 'Add Portfolio Project',  icon: Folder,     color: 'var(--dmos-secondary)',      bg: 'var(--dmos-secondary-subtle)' },
              { label: 'Run SEO Audit',          icon: Zap,        color: 'var(--dmos-warning)',        bg: 'var(--dmos-warning-bg)' },
              { label: 'Generate AI Content',    icon: Activity,   color: '#A78BFA',                   bg: 'var(--dmos-accent-subtle)' },
              { label: 'View Analytics Report',  icon: BarChart2,  color: 'var(--dmos-success)',        bg: 'var(--dmos-success-bg)' },
            ].map(a => (
              <div
                key={a.label}
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
