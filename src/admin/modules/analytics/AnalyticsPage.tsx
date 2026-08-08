// ─── DMOS Analytics Module — Google Analytics 4 Data Engine ─────────────────
// Authenticated client for server-side GA4 Data API v1beta reporting.

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Eye, TrendingUp, Activity, Globe, Monitor, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, Badge, MetricCard, PageHeader, SectionHeader, Button, Tabs } from '../../design-system/components';
import { auth } from '../../../lib/firebase';
import { GA4OverviewData, GA4TrafficPoint, GA4PageMetric, GA4TrafficSource, GA4DeviceBreakdown, GA4GeographyMetric } from '../../../../server/services/integrations/ga4Service';

const CHART_COLORS = { primary: '#2E5AFF', secondary: '#17B4CE', accent: '#7C3AED', success: '#22C55E' };
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';

export const AnalyticsPage: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [overview, setOverview] = useState<GA4OverviewData | null>(null);
  const [traffic, setTraffic] = useState<GA4TrafficPoint[]>([]);
  const [pages, setPages] = useState<GA4PageMetric[]>([]);
  const [sources, setSources] = useState<GA4TrafficSource[]>([]);
  const [devices, setDevices] = useState<GA4DeviceBreakdown[]>([]);
  const [geography, setGeography] = useState<GA4GeographyMetric[]>([]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const idToken = (await auth.currentUser?.getIdToken()) || 'admin_session_token';
      const headers = { Authorization: `Bearer ${idToken}` };

      // 1. Status Check
      const statusRes = await fetch(`${API_BASE}/admin/analytics/status`, { headers }).then(r => r.json()).catch(() => null);
      if (statusRes && statusRes.configured === false) {
        setConfigured(false);
        setStatusMessage(statusRes.message || 'Configure GA4_PROPERTY_ID in server/.env');
        setLoading(false);
        return;
      }
      setConfigured(true);

      // 2. Fetch Datasets
      const [ovRes, trRes, pgRes, srcRes, devRes, geoRes] = await Promise.all([
        fetch(`${API_BASE}/admin/analytics/overview?days=${days}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/analytics/traffic?days=${days}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/analytics/pages?days=${days}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/analytics/sources?days=${days}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/analytics/devices?days=${days}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/analytics/geography?days=${days}`, { headers }).then(r => r.json()),
      ]);

      if (ovRes.data) setOverview(ovRes.data);
      if (Array.isArray(trRes.data)) setTraffic(trRes.data);
      if (Array.isArray(pgRes.data)) setPages(pgRes.data);
      if (Array.isArray(srcRes.data)) setSources(srcRes.data);
      if (Array.isArray(devRes.data)) setDevices(devRes.data);
      if (Array.isArray(geoRes.data)) setGeography(geoRes.data);

    } catch (e: any) {
      console.warn('[AnalyticsPage] Exception loading GA4 analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Google Analytics 4"
        subtitle="pratheeshclement-cmd.github.io · Authenticated Server-Side GA4 Data API v1beta"
        badge={
          configured
            ? <Badge variant="success" dot pulse size="sm">GA4 Data API Active</Badge>
            : <Badge variant="warning" size="sm">Authentication Required</Badge>
        }
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Tabs
              tabs={[
                { id: '7', label: '7 Days' },
                { id: '30', label: '30 Days' },
                { id: '90', label: '90 Days' },
              ]}
              active={String(days)}
              onChange={(val) => setDays(parseInt(val, 10))}
            />
            <Button variant="secondary" size="sm" onClick={loadAnalytics} loading={loading} leftIcon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>
        }
      />

      {/* Unconfigured / Auth Required State Card */}
      {!configured && (
        <Card variant="primary" style={{ padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid var(--dmos-warning-border)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dmos-warning-bg)', border: '1px solid var(--dmos-warning-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} color="var(--dmos-warning)" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)' }}>GA4 Data API Not Configured</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--dmos-text-muted)', marginTop: 4 }}>
              {statusMessage || 'To enable server-side GA4 analytics reporting, set GA4_PROPERTY_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, & GOOGLE_REFRESH_TOKEN in server/.env.'}
            </div>
          </div>
        </Card>
      )}

      {/* KPI Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: `Active Users (${days}d)`, value: overview?.users ? overview.users.toLocaleString() : '—', icon: <Users size={16} color={CHART_COLORS.primary} />, iconBg: 'var(--dmos-primary-subtle)' },
          { label: 'Total Sessions',          value: overview?.sessions ? overview.sessions.toLocaleString() : '—', icon: <Activity size={16} color={CHART_COLORS.secondary} />, iconBg: 'var(--dmos-secondary-subtle)' },
          { label: 'Screen Page Views',      value: overview?.pageViews ? overview.pageViews.toLocaleString() : '—', icon: <Eye size={16} color="#A78BFA" />, iconBg: 'var(--dmos-accent-subtle)' },
          { label: 'Engagement Rate',        value: overview?.engagementRate ? `${overview.engagementRate}%` : '—', icon: <TrendingUp size={16} color={CHART_COLORS.success} />, iconBg: 'var(--dmos-success-bg)' },
        ].map(m => <MetricCard key={m.label} {...m} loading={loading} />)}
      </div>

      {/* Traffic Trend Chart */}
      <Card style={{ padding: 24, marginBottom: 24 }}>
        <SectionHeader title="Traffic Trend" subtitle={`GA4 daily active users & sessions (${days} day view)`} style={{ marginBottom: 20 }} />
        {traffic.length > 0 ? (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--dmos-card-elevated)', border: '1px solid var(--dmos-border-strong)', borderRadius: 10, fontSize: '0.78rem' }} />
                <Area type="monotone" dataKey="users" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#gVisitors)" name="Active Users" />
                <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS.secondary} strokeWidth={2} fill="url(#gSessions)" name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
            {configured ? 'No traffic trend data returned for selected date range.' : 'Configure GA4 credentials in server/.env to populate live traffic charts.'}
          </div>
        )}
      </Card>

      {/* Traffic Sources & Device Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Traffic Sources" subtitle="Session source / medium" style={{ marginBottom: 14 }} />
          {sources.length > 0 ? (
            sources.map(s => (
              <div key={`${s.source}-${s.medium}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--dmos-text)' }}>{s.source}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)' }}>{s.medium}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--dmos-primary-light)' }}>{s.users.toLocaleString()} users</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)' }}>{s.sessions} sessions</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.8rem' }}>
              {configured ? 'No traffic source data available.' : 'Configure GA4 in server/.env'}
            </div>
          )}
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionHeader title="Top Visited Pages" subtitle="Screen page views" style={{ marginBottom: 14 }} />
          {pages.length > 0 ? (
            pages.map(p => (
              <div key={p.pagePath} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dmos-text)', fontFamily: 'var(--dmos-font-mono)' }}>{p.pagePath}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#A78BFA' }}>{p.views.toLocaleString()} views</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)' }}>{p.users} users</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.8rem' }}>
              {configured ? 'No top page data available.' : 'Configure GA4 in server/.env'}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
