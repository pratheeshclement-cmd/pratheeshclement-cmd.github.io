// ─── DMOS Marketing Hub: Realtime Firestore & Campaign Engine ───────────────

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Target, MousePointer, Copy, Check, Plus, Award, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { MetricCard, Card, SectionHeader, Badge, Tabs, DataTable, Button, PageHeader, Input, EmptyState } from '../../design-system/components';

const MARKETING_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'utm_builder', label: 'UTM Builder' },
  { id: 'budget_roas', label: 'Budget & ROAS' },
];

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  spend: string | number;
  revenue: string | number;
  roas: string;
  cpa: string;
  ctr: string;
  status: 'active' | 'paused' | 'ended';
  createdAt?: string;
}

export const MarketingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Google Ads');
  const [spend, setSpend] = useState('10000');
  const [budget, setBudget] = useState('50000');

  // Realtime Firestore Listener for campaigns
  useEffect(() => {
    if (!db) {
      fetch('http://localhost:5000/api/marketing/campaigns')
        .then(r => r.json())
        .then(d => { if (d.campaigns) setCampaigns(d.campaigns); setLoading(false); })
        .catch(() => setLoading(false));
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      const items: Campaign[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Campaign, 'id'>)
      }));
      setCampaigns(items);
      setLoading(false);
    }, (err) => {
      console.warn('[MarketingHub] Firestore subscription:', err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateCampaign = async () => {
    if (!name) {
      alert('Campaign name is required');
      return;
    }

    const newCamp = {
      name,
      platform,
      spend: `₹${Number(spend).toLocaleString()}`,
      revenue: `₹${(Number(spend) * 3).toLocaleString()}`,
      roas: '3.0x',
      cpa: `₹${Math.round(Number(spend) / 10)}`,
      ctr: '4.2%',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      if (db) {
        await addDoc(collection(db, 'campaigns'), newCamp);
      }
      await fetch('http://localhost:5000/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCamp),
      }).catch(() => {});

      setShowModal(false);
      setName('');
      setSpend('10000');
    } catch (e: any) {
      alert(`Error creating campaign: ${e.message}`);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'campaigns', id));
      }
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  // UTM Builder State
  const [baseUrl, setBaseUrl] = useState('https://pratheeshclement-cmd.github.io/');
  const [utmSource, setUtmSource] = useState('linkedin');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('q3_seo_promo');
  const [copied, setCopied] = useState(false);

  const fullUtmUrl = `${baseUrl.replace(/\/$/, '')}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

  const campaignColumns = [
    { key: 'name', label: 'Campaign Name', render: (r: Campaign) => <span style={{ fontWeight: 700, color: 'var(--dmos-text)' }}>{r.name}</span> },
    { key: 'platform', label: 'Platform', render: (r: Campaign) => <Badge variant="primary">{r.platform}</Badge> },
    { key: 'spend', label: 'Spend', align: 'right' as const },
    { key: 'revenue', label: 'Revenue', align: 'right' as const, render: (r: Campaign) => <span style={{ fontWeight: 700, color: 'var(--dmos-success)' }}>{r.revenue || '—'}</span> },
    { key: 'roas', label: 'ROAS', align: 'right' as const },
    { key: 'status', label: 'Status', align: 'right' as const, render: (r: Campaign) => <Badge variant={r.status === 'active' ? 'success' : 'neutral'}>{r.status?.toUpperCase() || 'ACTIVE'}</Badge> },
    { key: 'actions', label: 'Action', align: 'right' as const, render: (r: Campaign) => (
      <Button variant="danger" size="xs" onClick={() => handleDeleteCampaign(r.id)}>Delete</Button>
    )},
  ];

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Marketing Hub"
        subtitle="Multi-channel campaigns · Google Ads · Meta Ads · UTM · Live Firestore Sync"
        badge={<Badge variant="success" dot>{campaigns.length} Campaigns</Badge>}
        actions={<Button variant="primary" onClick={() => setShowModal(true)} leftIcon={<Plus size={15} />}>New Campaign</Button>}
      />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={MARKETING_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            <MetricCard label="Active Campaigns" value={campaigns.length} change={campaigns.length > 0 ? 12.4 : undefined} icon={<Target size={16} color="var(--dmos-primary-light)" />} iconBg="var(--dmos-primary-subtle)" />
            <MetricCard label="Tracked Campaigns" value={campaigns.length} icon={<DollarSign size={16} color="var(--dmos-warning)" />} iconBg="var(--dmos-warning-bg)" />
          </div>

          <Card style={{ padding: 20 }}>
            <SectionHeader title="Live Campaigns Overview" subtitle="Firestore collection: campaigns" />
            <DataTable columns={campaignColumns} data={campaigns} loading={loading} emptyMessage="No data available" />
          </Card>
        </>
      )}

      {activeTab === 'campaigns' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Campaign Manager" subtitle="Create, track, and manage multi-channel marketing campaigns" />
          <DataTable columns={campaignColumns} data={campaigns} loading={loading} emptyMessage="No data available" />
        </Card>
      )}

      {activeTab === 'utm_builder' && (
        <Card style={{ padding: 24 }}>
          <SectionHeader title="UTM Campaign URL Builder" subtitle="Generate tracked URLs for LinkedIn, Meta, Google, and Email marketing" style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
            <Input label="Target Landing Page URL" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
            <Input label="Campaign Source (utm_source)" value={utmSource} onChange={e => setUtmSource(e.target.value)} />
            <Input label="Campaign Medium (utm_medium)" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} />
            <Input label="Campaign Name (utm_campaign)" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} />

            <div style={{ marginTop: 10, padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--dmos-border)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', marginBottom: 6 }}>Generated UTM URL</div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'var(--dmos-font-mono)', color: 'var(--dmos-primary-light)', wordBreak: 'break-all' }}>{fullUtmUrl}</div>
              <Button
                variant="secondary" size="xs" style={{ marginTop: 10 }}
                leftIcon={copied ? <Check size={13} color="var(--dmos-success)" /> : <Copy size={13} />}
                onClick={() => { navigator.clipboard.writeText(fullUtmUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              >
                {copied ? 'Copied to Clipboard!' : 'Copy URL'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'budget_roas' && (
        <Card style={{ padding: 24 }}>
          <SectionHeader title="Budget & ROAS Calculator" subtitle="Performance metrics" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--dmos-border)' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)' }}>Target ROAS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dmos-success)', marginTop: 4 }}>3.50x</div>
            </div>
          </div>
        </Card>
      )}

      {/* New Campaign Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Card style={{ width: 440, maxWidth: '100%', padding: 24 }}>
            <SectionHeader title="Create New Campaign" subtitle="Save directly to Firestore collection: campaigns" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 20px' }}>
              <Input label="Campaign Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q3 B2B Tech SEO Promotion" />
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 6 }}>Platform</label>
                <select className="dmos-input" value={platform} onChange={e => setPlatform(e.target.value)}>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="LinkedIn Ads">LinkedIn Ads</option>
                  <option value="Email Newsletter">Email Newsletter</option>
                </select>
              </div>
              <Input label="Initial Spend (₹)" type="number" value={spend} onChange={e => setSpend(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateCampaign}>Create Campaign</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarketingHubPage;
