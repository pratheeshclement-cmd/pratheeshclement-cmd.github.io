// ─── DMOS Content Studio: Firestore Realtime Engine ──────────────────────────

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles, FileText, Send, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, SectionHeader, Badge, Button, Tabs, DataTable, PageHeader, Input, EmptyState } from '../../design-system/components';

const STUDIO_TABS = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'queue', label: 'Publishing Queue' },
  { id: 'ai_ideas', label: 'AI Content Suggestions' },
];

export interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  scheduledAt: string;
  status: 'scheduled' | 'draft' | 'published';
  seoScore?: number;
  createdAt?: string;
}

export const ContentStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [scheduledAt, setScheduledAt] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 16));

  // Subscribe to Firestore content_queue collection
  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';
    if (!db) {
      fetch(`${API_BASE}/content-studio/queue`)
        .then(r => r.json())
        .then(d => { if (d.items) setPosts(d.items); setLoading(false); })
        .catch(() => setLoading(false));
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'content_queue'), (snapshot) => {
      const items: ScheduledPost[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<ScheduledPost, 'id'>)
      }));
      setPosts(items);
      setLoading(false);
    }, (err) => {
      console.warn('[ContentStudio] Firestore subscription error:', err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSchedulePost = async () => {
    if (!title) {
      alert('Post title is required');
      return;
    }

    const newPost = {
      title,
      platform,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: 'scheduled' as const,
      seoScore: 92,
      createdAt: new Date().toISOString(),
    };

    try {
      if (db) {
        await addDoc(collection(db, 'content_queue'), newPost);
      }
      const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';
      await fetch(`${API_BASE}/content-studio/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).catch(() => {});

      setShowModal(false);
      setTitle('');
    } catch (e: any) {
      alert(`Error scheduling post: ${e.message}`);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to remove this post from the queue?')) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'content_queue', id));
      }
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  const queueColumns = [
    { key: 'title', label: 'Post Title', render: (r: ScheduledPost) => <span style={{ fontWeight: 600, color: 'var(--dmos-text)' }}>{r.title}</span> },
    { key: 'platform', label: 'Platform', render: (r: ScheduledPost) => <Badge variant="primary">{r.platform}</Badge> },
    { key: 'scheduledAt', label: 'Scheduled Time', render: (r: ScheduledPost) => <span style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)' }}>{new Date(r.scheduledAt).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (r: ScheduledPost) => <Badge variant={r.status === 'published' ? 'success' : 'warning'}>{r.status?.toUpperCase() || 'SCHEDULED'}</Badge> },
    { key: 'actions', label: 'Action', align: 'right' as const, render: (r: ScheduledPost) => (
      <Button variant="danger" size="xs" onClick={() => handleDeletePost(r.id)}>Delete</Button>
    )},
  ];

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Content Studio"
        subtitle="Content calendar, automated publishing queue, and AI generation · Firestore content_queue"
        badge={<Badge variant="success" dot>{posts.length} Queue Items</Badge>}
        actions={<Button variant="primary" onClick={() => setShowModal(true)} leftIcon={<Plus size={15} />}>Schedule Post</Button>}
      />

      <div style={{ marginBottom: 24 }}>
        <Tabs tabs={STUDIO_TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'queue' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Publishing Queue" subtitle="Firestore collection: content_queue" />
          <DataTable columns={queueColumns} data={posts} loading={loading} emptyMessage="No data available" />
        </Card>
      )}

      {activeTab === 'calendar' && (
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Content Calendar" subtitle="Scheduled publishing dates" />
          <DataTable columns={queueColumns} data={posts} loading={loading} emptyMessage="No data available" />
        </Card>
      )}

      {activeTab === 'ai_ideas' && (
        <Card style={{ padding: 24 }}>
          <SectionHeader title="AI Content Ideas" subtitle="Generated from Gemini AI Engine" />
          <div style={{ color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>
            No data available. Use AI Center to generate new topic ideas.
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Card style={{ width: 440, maxWidth: '100%', padding: 24 }}>
            <SectionHeader title="Schedule New Post" subtitle="Save directly to Firestore collection: content_queue" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 20px' }}>
              <Input label="Post Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. How I Built DMOS with React & TypeScript" />
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 6 }}>Target Platform</label>
                <select className="dmos-input" value={platform} onChange={e => setPlatform(e.target.value)}>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Blog">Blog CMS</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>
              <Input label="Scheduled Date & Time" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSchedulePost}>Schedule Post</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentStudioPage;
