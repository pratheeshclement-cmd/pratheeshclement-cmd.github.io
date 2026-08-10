// ─── DMOS SEO Center v6 — Search Console & PageSpeed Command Center ───────────
// Authenticated Google Search Console API v3 & URL Inspection Engine.

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, TrendingUp, RefreshCw, ExternalLink, Globe, Monitor, Smartphone, AlertTriangle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, Badge, Button, Gauge, PageHeader, SectionHeader, Tabs, DataTable, Column, MetricCard } from '../../design-system/components';
import { auth } from '../../../lib/firebase';
import { GSCOverviewData, GSCPerformancePoint, GSCRowMetric, GSCSitemapInfo, GSCInspectionResult } from '../../../../server/services/integrations/gscService';

const CHART_COLORS = { primary: '#2E5AFF', secondary: '#17B4CE', accent: '#7C3AED', success: '#22C55E' };
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';

export const SEOPage: React.FC = () => {
  const [days, setDays] = useState<number>(28);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [configured, setConfigured] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [overview, setOverview] = useState<GSCOverviewData | null>(null);
  const [performance, setPerformance] = useState<GSCPerformancePoint[]>([]);
  const [queries, setQueries] = useState<GSCRowMetric[]>([]);
  const [pages, setPages] = useState<GSCRowMetric[]>([]);
  const [countries, setCountries] = useState<GSCRowMetric[]>([]);
  const [devices, setDevices] = useState<GSCRowMetric[]>([]);
  const [sitemaps, setSitemaps] = useState<GSCSitemapInfo[]>([]);

  // URL Inspection State
  const [inspectInputUrl, setInspectInputUrl] = useState<string>('https://pratheeshclement-cmd.github.io/');
  const [inspectLoading, setInspectLoading] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<GSCInspectionResult | null>(null);

  const [sites, setSites] = useState<any[]>([]);
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string>('https://pratheeshclement-cmd.github.io/');

  const loadGSCData = async () => {
    setLoading(true);
    try {
      const idToken = (await auth.currentUser?.getIdToken()) || 'admin_session_token';
      const headers = { Authorization: `Bearer ${idToken}` };

      // 1. Status Check
      const statusRes = await fetch(`${API_BASE}/admin/search-console/status`, { headers }).then(r => r.json()).catch(() => null);
      if (statusRes && statusRes.configured === false) {
        setConfigured(false);
        setStatusMessage(statusRes.message || 'Configure GSC_SITE_URL & OAuth credentials in server/.env');
        setLoading(false);
        return;
      }
      setConfigured(true);

      // Fetch accessible sites
      fetch(`${API_BASE}/admin/search-console/sites`, { headers })
        .then(r => r.json())
        .then(res => {
          if (Array.isArray(res.sites) && res.sites.length > 0) {
            setSites(res.sites);
          }
        })
        .catch(() => {});

      const siteParam = encodeURIComponent(selectedSiteUrl);

      // 2. Fetch Datasets
      const [ovRes, perfRes, qRes, pgRes, cRes, devRes, smRes] = await Promise.all([
        fetch(`${API_BASE}/admin/search-console/overview?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/performance?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/queries?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/pages?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/countries?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/devices?days=${days}&siteUrl=${siteParam}`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/admin/search-console/sitemaps?siteUrl=${siteParam}`, { headers }).then(r => r.json()),
      ]);

      if (ovRes.data) setOverview(ovRes.data);
      if (Array.isArray(perfRes.data)) setPerformance(perfRes.data);
      if (Array.isArray(qRes.data)) setQueries(qRes.data);
      if (Array.isArray(pgRes.data)) setPages(pgRes.data);
      if (Array.isArray(cRes.data)) setCountries(cRes.data);
      if (Array.isArray(devRes.data)) setDevices(devRes.data);
      if (Array.isArray(smRes.data)) setSitemaps(smRes.data);

    } catch (e: any) {
      console.warn('[SEOPage] Exception loading Search Console analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectUrl = async () => {
    if (!inspectInputUrl || !inspectInputUrl.startsWith('http')) return;
    setInspectLoading(true);
    setInspectionResult(null);

    try {
      const idToken = (await auth.currentUser?.getIdToken()) || 'admin_session_token';
      const res = await fetch(`${API_BASE}/admin/search-console/inspect-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ url: inspectInputUrl }),
      });
      const json = await res.json();
      if (json.data) {
        setInspectionResult(json.data);
      } else {
        alert(`URL Inspection Notice: ${json.message || json.error || 'Failed to inspect URL'}`);
      }
    } catch (e: any) {
      alert(`URL Inspection Exception: ${e.message}`);
    } finally {
      setInspectLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'gsc_connected') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    loadGSCData();
  }, [days, selectedSiteUrl]);

  const queryColumns: Column<GSCRowMetric>[] = [
    { key: 'key', label: 'Search Keyword', render: r => <span style={{ fontWeight: 600, color: 'var(--dmos-text)' }}>{r.key}</span> },
    { key: 'clicks', label: 'Clicks', align: 'right', render: r => <span style={{ fontWeight: 700, color: 'var(--dmos-primary-light)' }}>{r.clicks.toLocaleString()}</span> },
    { key: 'impressions', label: 'Impressions', align: 'right', render: r => <span style={{ color: 'var(--dmos-text-muted)' }}>{r.impressions.toLocaleString()}</span> },
    { key: 'ctr', label: 'CTR', align: 'right', render: r => <span style={{ color: 'var(--dmos-text-muted)' }}>{r.ctr}%</span> },
    { key: 'position', label: 'Avg. Position', align: 'right', render: r => {
      const color = r.position <= 3 ? 'var(--dmos-success)' : r.position <= 10 ? 'var(--dmos-warning)' : 'var(--dmos-danger)';
      return <span style={{ fontWeight: 700, color }}>{r.position}</span>;
    }},
  ];

  const pageColumns: Column<GSCRowMetric>[] = [
    { key: 'key', label: 'Landing Page', render: r => <span style={{ fontWeight: 600, fontFamily: 'var(--dmos-font-mono)', color: 'var(--dmos-text)', fontSize: '0.82rem' }}>{r.key}</span> },
    { key: 'clicks', label: 'Clicks', align: 'right', render: r => <span style={{ fontWeight: 700, color: 'var(--dmos-primary-light)' }}>{r.clicks.toLocaleString()}</span> },
    { key: 'impressions', label: 'Impressions', align: 'right', render: r => <span style={{ color: 'var(--dmos-text-muted)' }}>{r.impressions.toLocaleString()}</span> },
    { key: 'ctr', label: 'CTR', align: 'right', render: r => <span style={{ color: 'var(--dmos-text-muted)' }}>{r.ctr}%</span> },
    { key: 'position', label: 'Avg. Position', align: 'right', render: r => <span style={{ fontWeight: 700, color: 'var(--dmos-secondary)' }}>{r.position}</span> },
  ];

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="SEO & Search Console Center"
        subtitle="Google Search Console API v3 · Search Analytics · URL Inspection"
        badge={
          configured
            ? <Badge variant="success" dot pulse size="sm">Search Console API Active</Badge>
            : <Badge variant="warning" size="sm">Authentication Required</Badge>
        }
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Tabs
              tabs={[
                { id: '7', label: '7 Days' },
                { id: '28', label: '28 Days' },
                { id: '90', label: '90 Days' },
              ]}
              active={String(days)}
              onChange={(val) => setDays(parseInt(val, 10))}
            />
            <Button variant="secondary" size="sm" onClick={loadGSCData} loading={loading} leftIcon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>
        }
      />

      {/* Property Selector Toolbar */}
      {configured && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12, background: 'var(--dmos-surface-subtle)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--dmos-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dmos-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={16} color="var(--dmos-primary)" /> Search Console Property:
            </span>
            <select
              value={selectedSiteUrl}
              onChange={(e) => setSelectedSiteUrl(e.target.value)}
              style={{
                background: 'var(--dmos-bg)',
                color: 'var(--dmos-text)',
                border: '1px solid var(--dmos-border)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {sites.length > 0 ? (
                sites.map(s => (
                  <option key={s.siteUrl} value={s.siteUrl}>
                    {s.siteUrl} ({s.permissionLevel || 'Property'})
                  </option>
                ))
              ) : (
                <option value={selectedSiteUrl}>{selectedSiteUrl} (Target Property)</option>
              )}
            </select>
          </div>
          {overview?.fetchedAt && (
            <div style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)' }}>
              Last synced: {new Date(overview.fetchedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Unconfigured / Auth Required State Card */}
      {!configured && (
        <Card variant="primary" style={{ padding: 24, marginBottom: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, border: '1px solid var(--dmos-warning-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dmos-warning-bg)', border: '1px solid var(--dmos-warning-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={22} color="var(--dmos-warning)" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)' }}>Search Console API Authentication Required</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--dmos-text-muted)', marginTop: 4 }}>
                {statusMessage || 'Connect your Google account to authorize Search Console API access for live analytics.'}
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              try {
                const idToken = (await auth.currentUser?.getIdToken()) || 'admin_session_token';
                const res = await fetch(`${API_BASE}/admin/search-console/oauth/start`, {
                  headers: { Authorization: `Bearer ${idToken}` },
                }).then(r => r.json());
                if (res.success && res.authUrl) {
                  window.location.href = res.authUrl;
                } else {
                  alert(`OAuth Notice: ${res.error || 'Failed to start OAuth'}`);
                }
              } catch (e: any) {
                alert(`OAuth Error: ${e.message}`);
              }
            }}
          >
            Connect Google Search Console
          </Button>
        </Card>
      )}

      {/* Configured but 0 Sites Card */}
      {configured && sites.length === 0 && !loading && (
        <Card variant="primary" style={{ padding: 20, marginBottom: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, border: '1px solid var(--dmos-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} color="var(--dmos-warning)" />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)' }}>No verified properties returned for authenticated Google account</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--dmos-text-muted)', marginTop: 2 }}>
                Ensure your domain or URL-prefix property is added and verified in Search Console for mariyapratheesh007@gmail.com.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={loadGSCData}>Refresh Properties</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                const idToken = (await auth.currentUser?.getIdToken()) || 'admin_session_token';
                const res = await fetch(`${API_BASE}/admin/search-console/oauth/start`, { headers: { Authorization: `Bearer ${idToken}` } }).then(r => r.json());
                if (res.authUrl) window.location.href = res.authUrl;
              }}
            >
              Connect Different Account
            </Button>
          </div>
        </Card>
      )}

      {/* Primary Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'performance', label: 'Performance' },
          { id: 'queries', label: `Queries (${queries.length})` },
          { id: 'pages', label: `Pages (${pages.length})` },
          { id: 'sitemaps', label: `Sitemaps (${sitemaps.length})` },
          { id: 'inspection', label: 'URL Inspection' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      />

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: `Total Clicks (${days}d)`,     value: overview?.clicks ? overview.clicks.toLocaleString() : '—', icon: <Search size={16} color={CHART_COLORS.primary} />, iconBg: 'var(--dmos-primary-subtle)' },
              { label: 'Total Impressions',           value: overview?.impressions ? overview.impressions.toLocaleString() : '—', icon: <TrendingUp size={16} color={CHART_COLORS.secondary} />, iconBg: 'var(--dmos-secondary-subtle)' },
              { label: 'Average CTR',                 value: overview?.ctr ? `${overview.ctr}%` : '—', icon: <Globe size={16} color="#A78BFA" />, iconBg: 'var(--dmos-accent-subtle)' },
              { label: 'Average Position',            value: overview?.position ? overview.position : '—', icon: <ShieldCheck size={16} color={CHART_COLORS.success} />, iconBg: 'var(--dmos-success-bg)' },
            ].map(m => <MetricCard key={m.label} {...m} loading={loading} />)}
          </div>

          <Card style={{ padding: 24, marginBottom: 24 }}>
            <SectionHeader title="Search Analytics Performance Trend" subtitle={`Daily clicks & impressions timeline (${days} day view)`} style={{ marginBottom: 20 }} />
            {performance.length > 0 ? (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performance} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--dmos-card-elevated)', border: '1px solid var(--dmos-border-strong)', borderRadius: 10, fontSize: '0.78rem' }} />
                    <Area type="monotone" dataKey="clicks" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#gClicks)" name="Clicks" />
                    <Area type="monotone" dataKey="impressions" stroke={CHART_COLORS.secondary} strokeWidth={2} fill="url(#gImpressions)" name="Impressions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
                {configured ? 'No Search Console performance trend returned for this date range.' : 'Configure Search Console credentials in server/.env to populate live search analytics.'}
              </div>
            )}
          </Card>
        </>
      )}

      {/* PERFORMANCE TAB */}
      {activeTab === 'performance' && (
        <Card style={{ padding: 24 }}>
          <SectionHeader title="Detailed Search Performance Timeline" style={{ marginBottom: 20 }} />
          {performance.length > 0 ? (
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--dmos-text-subtle)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--dmos-card-elevated)', border: '1px solid var(--dmos-border-strong)', borderRadius: 10, fontSize: '0.78rem' }} />
                  <Area type="monotone" dataKey="clicks" stroke={CHART_COLORS.primary} strokeWidth={2} name="Clicks" />
                  <Area type="monotone" dataKey="impressions" stroke={CHART_COLORS.secondary} strokeWidth={2} name="Impressions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
              No performance data returned.
            </div>
          )}
        </Card>
      )}

      {/* QUERIES TAB */}
      {activeTab === 'queries' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Top Search Queries" subtitle="Organic search keywords driving impressions & clicks" style={{ marginBottom: 16 }} />
          <DataTable data={queries} columns={queryColumns} loading={loading} emptyMessage="No Search Console queries recorded for this property." />
        </Card>
      )}

      {/* PAGES TAB */}
      {activeTab === 'pages' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Top Performing Landing Pages" subtitle="Pages indexed & receiving Google Search traffic" style={{ marginBottom: 16 }} />
          <DataTable data={pages} columns={pageColumns} loading={loading} emptyMessage="No Search Console page metrics recorded." />
        </Card>
      )}

      {/* SITEMAPS TAB */}
      {activeTab === 'sitemaps' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Submitted XML Sitemaps" subtitle="Search Console index submission status" style={{ marginBottom: 16 }} />
          {sitemaps.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {sitemaps.map(s => (
                <div key={s.path} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dmos-border)', borderRadius: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--dmos-text)', fontFamily: 'var(--dmos-font-mono)' }}>{s.path}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--dmos-text-muted)', marginTop: 3 }}>
                      Last Submitted: {s.lastSubmitted} · Last Downloaded: {s.lastDownloaded}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {s.errors > 0 ? (
                      <Badge variant="danger">{s.errors} Errors</Badge>
                    ) : (
                      <Badge variant="success" dot>Success</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
              {configured ? 'No submitted sitemaps returned for this property.' : 'Configure Search Console in server/.env'}
            </div>
          )}
        </Card>
      )}

      {/* URL INSPECTION TAB */}
      {activeTab === 'inspection' && (
        <Card style={{ padding: 24 }}>
          <SectionHeader title="Official Google URL Inspection Tool" subtitle="Inspect index status, canonical URLs, and crawl state" style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input
              type="url"
              value={inspectInputUrl}
              onChange={(e) => setInspectInputUrl(e.target.value)}
              placeholder="https://pratheeshclement-cmd.github.io/about/"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--dmos-border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--dmos-text)',
                fontFamily: 'var(--dmos-font-mono)',
                fontSize: '0.84rem',
              }}
            />
            <Button variant="primary" size="sm" onClick={handleInspectUrl} loading={inspectLoading} leftIcon={<Search size={14} />}>
              Inspect URL
            </Button>
          </div>

          {inspectionResult && (
            <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dmos-border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <CheckCircle2 size={20} color="var(--dmos-success)" />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)' }}>Inspection Verdict: {inspectionResult.verdict}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)', textTransform: 'uppercase' }}>Coverage State</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)', marginTop: 3 }}>{inspectionResult.coverageState}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)', textTransform: 'uppercase' }}>Indexing State</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)', marginTop: 3 }}>{inspectionResult.indexingState}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)', textTransform: 'uppercase' }}>Robots.txt State</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-success)', marginTop: 3 }}>{inspectionResult.robotsTxtState}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)', textTransform: 'uppercase' }}>Crawled As</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-primary-light)', marginTop: 3 }}>{inspectionResult.crawledAs}</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SEOPage;
