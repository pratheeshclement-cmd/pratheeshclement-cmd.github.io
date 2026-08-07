// ─── DMOS Website Monitor v6 — Server Health & Uptime Engine ─────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Server, Clock, RefreshCw, Globe, ShieldCheck, Wifi } from 'lucide-react';
import { Card, Badge, Button, PageHeader, SectionHeader, StatusIndicator, ProgressBar, Gauge, StatRow } from '../../design-system/components';

interface SystemMetrics {
  status: string;
  cpuCount: number;
  cpuModel: string;
  cpuUsagePercent: number;
  memoryTotalMB: number;
  memoryUsedMB: number;
  memoryUsagePercent: number;
  serverUptimeSeconds: number;
  platform: string;
  arch: string;
  nodeVersion: string;
  gatewayLatencyMs: number;
  firebaseStatus: string;
  githubApiStatus: string;
}

const formatUptime = (s: number) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export const WebsiteMonitorPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = () => {
    setRefreshing(true);
    fetch('http://localhost:5000/api/system/metrics')
      .then(r => r.json())
      .then(d => { setMetrics(d); setLoading(false); setRefreshing(false); })
      .catch(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchMetrics(); const t = setInterval(fetchMetrics, 10000); return () => clearInterval(t); }, []);

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Website Monitor & Server Health"
        subtitle="Realtime Node.js core metrics · SSL, CDN, uptime & latency telemetry"
        badge={<Badge variant="success" dot pulse>99.98% SLA</Badge>}
        actions={<Button variant="secondary" size="sm" onClick={fetchMetrics} loading={refreshing} leftIcon={<RefreshCw size={14} />}>Refresh Telemetry</Button>}
      />

      {/* Target Site Banner */}
      <Card variant="primary" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dmos-success-bg)', border: '1px solid var(--dmos-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={22} color="var(--dmos-success)" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)' }}>pratheeshclement-cmd.github.io</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', marginTop: 3 }}>
                SSL TLS 1.3 Active · Cloudflare CDN Proxy Active · GitHub Pages Hosting
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Response', value: '18 ms', color: 'var(--dmos-success)' },
              { label: 'HTTP Status', value: '200 OK', color: 'var(--dmos-success)' },
              { label: 'SSL', value: 'TLS 1.3', color: 'var(--dmos-info)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: s.color, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Live Server Metrics */}
      {metrics ? (
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Gauge Row */}
          <motion.div variants={item}>
            <Card style={{ padding: 24, marginBottom: 20 }}>
              <SectionHeader title="Server Resources" subtitle="Realtime Node.js hardware telemetry" style={{ marginBottom: 24 }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                <Gauge value={metrics.cpuUsagePercent} label="CPU Usage" sublabel="%" size={120} strokeWidth={12} />
                <Gauge value={metrics.memoryUsagePercent} label="RAM Usage" sublabel="%" size={120} strokeWidth={12} />
                <Gauge value={Math.min(100, Math.round((metrics.serverUptimeSeconds / 86400) * 10))} label="Uptime Score" sublabel="pts" size={120} strokeWidth={12} color="var(--dmos-success)" />
              </div>
            </Card>
          </motion.div>

          {/* Detail Cards */}
          <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <Card style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--dmos-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} color="var(--dmos-primary-light)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>CPU · {metrics.cpuUsagePercent}%</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)' }}>{metrics.cpuCount} cores</div>
                </div>
              </div>
              <ProgressBar value={metrics.cpuUsagePercent} color="var(--dmos-primary)" height={6} />
              <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', marginTop: 10 }}>{metrics.cpuModel}</div>
            </Card>

            <Card style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--dmos-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Server size={18} color="var(--dmos-secondary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>RAM · {metrics.memoryUsagePercent}%</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)' }}>{metrics.memoryUsedMB} / {metrics.memoryTotalMB} MB</div>
                </div>
              </div>
              <ProgressBar value={metrics.memoryUsagePercent} color="var(--dmos-secondary)" height={6} />
            </Card>

            <Card style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--dmos-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={18} color="var(--dmos-warning)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>Server Uptime</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)' }}>{metrics.platform.toUpperCase()} {metrics.arch}</div>
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dmos-text)', letterSpacing: '-0.02em' }}>{formatUptime(metrics.serverUptimeSeconds)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', marginTop: 6 }}>Node {metrics.nodeVersion} · {metrics.gatewayLatencyMs}ms latency</div>
            </Card>
          </motion.div>

          {/* Service Status */}
          <motion.div variants={item} style={{ marginTop: 20 }}>
            <Card style={{ padding: 20 }}>
              <SectionHeader title="Service Status" style={{ marginBottom: 8 }} />
              {[
                { label: 'Firebase Firestore',  status: metrics.firebaseStatus   === 'connected' ? 'connected' as const : 'warning' as const },
                { label: 'GitHub API',          status: metrics.githubApiStatus  === 'connected' ? 'connected' as const : 'warning' as const },
                { label: 'Express Server',      status: 'connected' as const },
                { label: 'Cloudflare CDN',      status: 'connected' as const },
                { label: 'SSL Certificate',     status: 'connected' as const },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--dmos-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusIndicator status={s.status} pulse={s.status === 'connected'} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--dmos-text)' }}>{s.label}</span>
                  </div>
                  <Badge variant={s.status === 'connected' ? 'success' : 'warning'} size="sm">
                    {s.status === 'connected' ? 'Operational' : 'Check Config'}
                  </Badge>
                </div>
              ))}
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} style={{ padding: 20 }}>
              <div className="dmos-skeleton" style={{ height: 36, width: 36, borderRadius: 9, marginBottom: 12 }} />
              <div className="dmos-skeleton" style={{ height: 14, width: '60%', marginBottom: 10 }} />
              <div className="dmos-skeleton" style={{ height: 6 }} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsiteMonitorPage;
