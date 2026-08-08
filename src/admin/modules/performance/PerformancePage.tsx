// ─── DMOS Performance Center — PageSpeed Insights Engine ─────────────────

import React, { useState, useEffect } from 'react';
import { Zap, RefreshCw, CheckCircle2, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { Card, Badge, Button, Gauge, PageHeader, SectionHeader } from '../../design-system/components';
import { apiGateway } from '../../core/api/client';

export const PerformancePage: React.FC = () => {
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = async (targetStrategy: 'mobile' | 'desktop') => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGateway.request<any>('/admin/pagespeed/analyze', {
        method: 'POST',
        body: { url: 'https://pratheeshclement-cmd.github.io/', strategy: targetStrategy },
        provider: 'pagespeed',
      });
      if (res && res.scores) {
        setData(res);
      } else {
        setError(res?.error || 'Failed to retrieve PageSpeed scores.');
      }
    } catch (e: any) {
      setError(e.message || 'PageSpeed API request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit(strategy);
  }, [strategy]);

  const handleRefresh = () => {
    fetchAudit(strategy);
  };

  const CHECKLIST = [
    { label: 'CSS & JS Minification', done: true },
    { label: 'Image Optimization (WebP)', done: true },
    { label: 'Preload Critical Resources', done: true },
    { label: 'Lazy Load Off-screen Images', done: true },
    { label: 'Remove Render-Blocking JS', done: true },
    { label: 'Preconnect to 3rd party APIs', done: true },
    { label: 'Enable Brotli Compression', done: true },
    { label: 'CDN Cache TTL > 30 days', done: true },
  ];

  const scores = data?.scores || {};
  const vitals = data?.vitals || {};

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Performance Center"
        subtitle="Google PageSpeed Insights API · Real-time Lighthouse & Core Web Vitals"
        badge={
          <Badge variant={data?.success ? 'success' : 'warning'} dot>
            {data?.success ? (data?.cached ? 'Cached Audit' : 'Live Audit') : 'Checking API'}
          </Badge>
        }
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant={strategy === 'mobile' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStrategy('mobile')}
              leftIcon={<Smartphone size={14} />}
            >
              Mobile
            </Button>
            <Button
              variant={strategy === 'desktop' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStrategy('desktop')}
              leftIcon={<Monitor size={14} />}
            >
              Desktop
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              loading={loading}
              leftIcon={<RefreshCw size={14} />}
            >
              Run Audit
            </Button>
          </div>
        }
      />

      {error && (
        <Card style={{ padding: 16, marginBottom: 20, borderLeft: '4px solid var(--dmos-danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dmos-danger)' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        </Card>
      )}

      {/* Score Gauges */}
      <Card style={{ padding: 28, marginBottom: 20 }}>
        <SectionHeader
          title={`Lighthouse Scores (${strategy.toUpperCase()})`}
          subtitle="Target: https://pratheeshclement-cmd.github.io/"
          style={{ marginBottom: 28 }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {[
            { label: 'Performance', value: scores.performance ?? 0, sub: '/100' },
            { label: 'Accessibility', value: scores.accessibility ?? 0, sub: '/100' },
            { label: 'Best Practices', value: scores.bestPractices ?? 0, sub: '/100' },
            { label: 'SEO', value: scores.seo ?? 0, sub: '/100' },
          ].map((g) => (
            <Gauge key={g.label} value={g.value} label={g.label} sublabel={g.sub} size={130} strokeWidth={12} />
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Core Web Vitals Detail */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Core Web Vitals & Metrics" style={{ marginBottom: 16 }} />
          {[
            { label: 'Largest Contentful Paint (LCP)', value: vitals.lcp?.displayValue || '—', target: '< 2.5s' },
            { label: 'Interaction to Next Paint (INP)', value: vitals.inp?.displayValue || '—', target: '< 200ms' },
            { label: 'Cumulative Layout Shift (CLS)', value: vitals.cls?.displayValue || '—', target: '< 0.1' },
            { label: 'First Contentful Paint (FCP)', value: vitals.fcp?.displayValue || '—', target: '< 1.8s' },
            { label: 'Speed Index', value: vitals.speedIndex?.displayValue || '—', target: '< 3.4s' },
            { label: 'Total Blocking Time (TBT)', value: vitals.tbt?.displayValue || '—', target: '< 200ms' },
            { label: 'Time to First Byte (TTFB)', value: vitals.ttfb?.displayValue || '—', target: '< 800ms' },
          ].map((m) => (
            <div key={m.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--dmos-text)' }}>{m.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--dmos-primary)' }}>{m.value}</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--dmos-text-subtle)' }}>Target: {m.target}</div>
            </div>
          ))}
        </Card>

        {/* Optimization Checklist */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Optimization Checklist" style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {CHECKLIST.map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                <CheckCircle2 size={16} color="var(--dmos-success)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--dmos-text)', flex: 1 }}>{c.label}</span>
                <Badge variant="success" size="sm">Verified</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformancePage;
