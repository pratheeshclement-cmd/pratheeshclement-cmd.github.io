// ─── DMOS Connections Page v6 — Enterprise API Gateway Center ────────────────

import React, { useState, useEffect } from 'react';
import {
  Code2, GitBranch, Star, GitFork, ExternalLink,
  RefreshCw, BarChart2, Shield, Zap, Database,
  Globe, Cpu, Mail, Map, Cloud, Activity,
} from 'lucide-react';
import {
  Card, Badge, Button, Tabs, PageHeader, SectionHeader,
  ConnectionCard, StatusIndicator, ProgressBar, StatRow,
} from '../../design-system/components';
import { ConnectionService } from '../../services/ConnectionService';
import { ProviderHealth } from '../../core/api/health';
import { connectionsApi } from '../../../services/api/connections/api';

const PROVIDER_ICONS: Record<string, React.FC<any>> = {
  ga4: BarChart2, gsc: Zap, firebase: Database, meta: Globe,
  clarity: Activity, github: Code2, cloudflare: Shield,
  gemini: Cpu, smtp: Mail, gmaps: Map, vercel: Cloud, pagespeed: Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  Analytics:   'var(--dmos-primary-light)',
  SEO:         'var(--dmos-warning)',
  Database:    'var(--dmos-secondary)',
  Marketing:   '#A78BFA',
  Hosting:     'var(--dmos-info)',
  AI:          'var(--dmos-accent-light)',
  Email:       'var(--dmos-success)',
  Performance: 'var(--dmos-danger)',
};

export const ConnectionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [providers, setProviders] = useState<ProviderHealth[]>(() => ConnectionService.getProviders());
  const [githubData, setGithubData] = useState<any>(null);
  const [loadingGitHub, setLoadingGitHub] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const overview = ConnectionService.getHealthOverview();

  const fetchGitHub = () => {
    setLoadingGitHub(true);
    fetch('http://localhost:5000/api/github/repo-stats')
      .then(r => r.json())
      .then(d => { setGithubData(d); setLoadingGitHub(false); })
      .catch(() => setLoadingGitHub(false));
  };

  useEffect(() => {
    fetchGitHub();
    connectionsApi.getHealth().catch(() => {});
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGitHub();
    setTimeout(() => setRefreshing(false), 800);
  };

  // Category tabs
  const categories = ['all', ...Array.from(new Set(providers.map(p => p.category)))];
  const filtered = activeTab === 'all' ? providers : providers.filter(p => p.category === activeTab);

  const connectedCount  = providers.filter(p => p.status === 'connected').length;
  const authReqCount    = providers.filter(p => p.status === 'auth_required').length;
  const disconnectedCount = providers.filter(p => p.status === 'not_connected' || p.status === 'error').length;

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Connections & Integrations"
        subtitle="API Gateway Health · Live Monitoring · OAuth Status · Quota Tracking"
        badge={
          connectedCount === providers.length
            ? <Badge variant="success" dot pulse>All Connected</Badge>
            : authReqCount > 0
              ? <Badge variant="warning" dot>Auth Required</Badge>
              : <Badge variant="neutral">{connectedCount}/{providers.length} Active</Badge>
        }
        actions={
          <Button variant="secondary" size="sm" onClick={handleRefresh} loading={refreshing} leftIcon={<RefreshCw size={14} />}>
            Refresh All
          </Button>
        }
      />

      {/* ── Health Summary Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Connected', value: connectedCount, color: 'var(--dmos-success)', bg: 'var(--dmos-success-bg)', border: 'var(--dmos-success-border)' },
          { label: 'Auth Required', value: authReqCount, color: 'var(--dmos-warning)', bg: 'var(--dmos-warning-bg)', border: 'var(--dmos-warning-border)' },
          { label: 'Disconnected', value: disconnectedCount, color: 'var(--dmos-danger)', bg: 'var(--dmos-danger-bg)', border: 'var(--dmos-danger-border)' },
          { label: 'Total APIs', value: providers.length, color: 'var(--dmos-text)', bg: 'rgba(255,255,255,0.04)', border: 'var(--dmos-border)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '14px 16px', background: s.bg,
            border: `1px solid ${s.border}`, borderRadius: 'var(--dmos-radius)',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--dmos-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── GitHub Featured Card ── */}
      <Card variant="primary" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #24292e, #3d4451)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <Code2 size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)' }}>GitHub Enterprise API</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', marginTop: 2 }}>
                <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.72rem' }}>
                  pratheeshclement-cmd/pratheeshclement-cmd.github.io
                </code>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge variant="success" dot pulse>Connected via GITHUB_TOKEN</Badge>
            <a href="https://github.com/pratheeshclement-cmd/pratheeshclement-cmd.github.io" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="xs" rightIcon={<ExternalLink size={11} />}>View Repo</Button>
            </a>
          </div>
        </div>

        {loadingGitHub ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="dmos-skeleton" style={{ height: 10, width: 60, marginBottom: 8 }} />
                <div className="dmos-skeleton" style={{ height: 22, width: 80 }} />
              </div>
            ))}
          </div>
        ) : githubData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--dmos-border)' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Branch</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <GitBranch size={14} color="var(--dmos-primary-light)" /> {githubData.defaultBranch || 'main'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Stars</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star size={14} color="var(--dmos-warning)" /> {githubData.stars || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Forks</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <GitFork size={14} color="var(--dmos-text-muted)" /> {githubData.forks || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Open Issues</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-success)' }}>{githubData.openIssues ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Pages</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-success)' }}>{githubData.pagesStatus?.toUpperCase() || 'BUILT'}</div>
            </div>
            {githubData.latestCommit && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Latest Commit</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)', fontFamily: 'var(--dmos-font-mono)' }}>
                  <span style={{ color: 'var(--dmos-primary-light)' }}>{githubData.latestCommit.sha?.substring(0, 7)}</span>
                  {' '}{githubData.latestCommit.message}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.82rem', color: 'var(--dmos-text-muted)', paddingTop: 12 }}>
            Could not reach GitHub API. Check GITHUB_TOKEN environment variable.
          </div>
        )}
      </Card>

      {/* ── Category Filter Tabs ── */}
      <div style={{ marginBottom: 20 }}>
        <Tabs
          tabs={categories.map(c => ({ id: c, label: c === 'all' ? `All (${providers.length})` : c }))}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ── Provider Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(p => {
          const IconComp = PROVIDER_ICONS[p.id] || Activity;
          return (
            <ConnectionCard
              key={p.id}
              id={p.id}
              name={p.name}
              category={p.category}
              status={p.status}
              latencyMs={p.latencyMs}
              lastSync={p.lastSync}
              quotaUsedPercent={p.quotaUsedPercent}
              apiVersion={p.apiVersion}
              docsUrl={p.docsUrl}
              icon={<IconComp size={18} color={CATEGORY_COLORS[p.category] || 'var(--dmos-text-muted)'} />}
              onReconnect={p.status !== 'connected' ? () => {} : undefined}
              onConfigure={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionsPage;
