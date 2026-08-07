// ─── DMOS CRM & Lead Pipeline: Firestore Realtime ────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Building, MessageSquare, Plus, Search, ChevronRight, CheckCircle, Trash2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { CRMService } from '../../services/domainServices';
import { Card, Button, Badge, PageHeader, SectionHeader, Input, Tabs } from '../../design-system/components';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  service: string;
  message: string;
  value: number;
  stage: 'new' | 'contacted' | 'proposal' | 'won' | 'lost';
  priority?: 'High' | 'Medium' | 'Low';
  aiSummary?: string;
  createdAt: string;
}

const STAGES: { id: Lead['stage']; label: string; color: string }[] = [
  { id: 'new',       label: 'New Lead',   color: 'var(--dmos-primary-light)' },
  { id: 'contacted', label: 'Contacted',  color: 'var(--dmos-warning)' },
  { id: 'proposal',  label: 'Proposal',   color: '#c084fc' },
  { id: 'won',       label: 'Won',        color: 'var(--dmos-success)' },
  { id: 'lost',      label: 'Lost',       color: 'var(--dmos-danger)' },
];

export const CRMPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('Technical SEO Audit');
  const [message, setMessage] = useState('');
  const [value, setValue] = useState(25000);

  // 1. Subscribe to Firestore crm collection
  useEffect(() => {
    if (!db) {
      CRMService.listLeads().then(res => {
        if (Array.isArray(res)) setLeads(res);
        setLoading(false);
      }).catch(() => setLoading(false));
      return;
    }

    try {
      const q = query(collection(db, 'crm'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Lead[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Lead, 'id'>)
        }));
        setLeads(items);
        setLoading(false);
      }, (err) => {
        console.warn('[CRMPage] Firestore subscription fallback:', err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e: any) {
      setLoading(false);
    }
  }, []);

  // 2. Advance Lead Stage
  const handleMoveStage = async (id: string, currentStage: Lead['stage']) => {
    const stageOrder: Lead['stage'][] = ['new', 'contacted', 'proposal', 'won', 'lost'];
    const currentIdx = stageOrder.indexOf(currentStage);
    const nextStage = stageOrder[(currentIdx + 1) % stageOrder.length];

    try {
      if (db) {
        await updateDoc(doc(db, 'crm', id), { stage: nextStage, updatedAt: new Date().toISOString() });
      }
      setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: nextStage } : l));
    } catch (e: any) {
      alert(`Move error: ${e.message}`);
    }
  };

  // 3. Create Lead
  const handleAddLead = async () => {
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }

    try {
      await CRMService.submitContactForm({
        name,
        email,
        company,
        service,
        message,
        estimatedValue: value,
      });

      setShowAddModal(false);
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (e: any) {
      alert(`Submit error: ${e.message}`);
    }
  };

  // 4. Delete Lead
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'crm', id));
      }
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                          l.company.toLowerCase().includes(search.toLowerCase()) ||
                          l.email.toLowerCase().includes(search.toLowerCase());
    if (activeStageFilter === 'all') return matchesSearch;
    return matchesSearch && l.stage === activeStageFilter;
  });

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="CRM & Lead Pipeline"
        subtitle={<>Firestore: <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.76rem' }}>crm</code> · Live Kanban &amp; Lead Qualifying Engine</>}
        badge={<Badge variant="success" dot pulse>{leads.length} Leads</Badge>}
        actions={<Button variant="primary" onClick={() => setShowAddModal(true)} leftIcon={<Plus size={15} />}>Add Lead</Button>}
      />

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveStageFilter('all')}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
              border: activeStageFilter === 'all' ? '1px solid var(--dmos-primary)' : '1px solid var(--dmos-border)',
              background: activeStageFilter === 'all' ? 'rgba(46,90,255,0.15)' : 'rgba(255,255,255,0.03)',
              color: activeStageFilter === 'all' ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)',
              cursor: 'pointer',
            }}
          >
            All Leads ({leads.length})
          </button>
          {STAGES.map(stg => (
            <button
              key={stg.id}
              onClick={() => setActiveStageFilter(stg.id)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                border: activeStageFilter === stg.id ? `1px solid ${stg.color}` : '1px solid var(--dmos-border)',
                background: activeStageFilter === stg.id ? `${stg.color}15` : 'rgba(255,255,255,0.03)',
                color: activeStageFilter === stg.id ? stg.color : 'var(--dmos-text-muted)',
                cursor: 'pointer',
              }}
            >
              {stg.label} ({leads.filter(l => l.stage === stg.id).length})
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <Search size={14} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '7px 12px 7px 32px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)',
              fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Responsive Kanban Columns / Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {STAGES.map(stg => {
          const stageLeads = filteredLeads.filter(l => l.stage === stg.id);
          return (
            <div key={stg.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--dmos-border)', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${stg.color}` }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{stg.label}</span>
                <Badge style={{ background: `${stg.color}20`, color: stg.color }}>{stageLeads.length}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stageLeads.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--dmos-text-subtle)', fontSize: '0.76rem' }}>
                    No leads in stage
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <Card key={lead.id} style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--dmos-text-muted)' }}>{lead.company || lead.email}</div>
                        </div>
                        <Badge variant="primary">₹{(lead.value / 1000).toFixed(0)}k</Badge>
                      </div>

                      {lead.aiSummary && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 6, lineHeight: 1.4 }}>
                          💡 {lead.aiSummary}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--dmos-border)' }}>
                        <button
                          onClick={() => handleMoveStage(lead.id, lead.stage)}
                          style={{
                            background: 'rgba(46,90,255,0.12)', border: '1px solid rgba(46,90,255,0.3)',
                            borderRadius: 6, padding: '4px 8px', color: 'var(--dmos-primary-light)',
                            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          }}
                        >
                          Advance <ChevronRight size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)', padding: 4 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--dmos-card-elevated)', padding: 24, borderRadius: 14, width: '100%', maxWidth: 500, border: '1px solid var(--dmos-border-strong)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--dmos-text)' }}>Add New CRM Lead</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text" placeholder="Contact Name" value={name} onChange={e => setName(e.target.value)}
                style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem' }}
              />
              <input
                type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem' }}
              />
              <input
                type="text" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)}
                style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem' }}
              />
              <textarea
                rows={3} placeholder="Requirements / Inquiry Message..." value={message} onChange={e => setMessage(e.target.value)}
                style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddLead}>Save Lead</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;
