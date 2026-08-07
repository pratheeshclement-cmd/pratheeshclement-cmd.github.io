// ─── DMOS Integrations: Real Provider Connection Center ────────────────────

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Link2, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, Badge, Button, PageHeader } from '../../design-system/components';
import { connectionsApi, HealthProvider } from '../../../services/api/connections/api';

export const IntegrationsPage: React.FC = () => {
  const [connections, setConnections] = useState<HealthProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const res = await connectionsApi.getHealth();
      if (res.providers) setConnections(res.providers);
    } catch (e) {
      console.warn('[IntegrationsPage] API error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Integrations & API Gateways"
        subtitle="Live Provider API Connectors · Server-Side OAuth & Token Verification"
        badge={<Badge variant="success" dot>{connections.length} Connectors</Badge>}
        actions={<Button variant="secondary" size="sm" onClick={loadHealth} loading={loading} leftIcon={<RefreshCw size={14} />}>Test Connections</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {connections.length === 0 ? (
          <div style={{ padding: 40, color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>No data available</div>
        ) : (
          connections.map(conn => (
            <Card key={conn.id} style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{conn.name}</span>
                  <Badge variant={conn.status === 'connected' ? 'success' : 'warning'}>
                    {conn.status.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--dmos-text-subtle)' }}>
                  Latency: <span style={{ color: 'var(--dmos-success)', fontWeight: 600 }}>{conn.latencyMs}ms</span>
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--dmos-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={loadHealth} style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                  Verify Status
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IntegrationsPage;
