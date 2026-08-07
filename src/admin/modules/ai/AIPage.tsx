// ─── DMOS AI Center: Gemini 1.5 Flash & Firestore History Engine ────────────

import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Search, Tag, MessageSquare, Check, Copy, Clock } from 'lucide-react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, SectionHeader, DataTable } from '../../design-system/components';
import { AIService } from '../../services/domainServices';

export interface AIHistoryItem {
  id: string;
  topic: string;
  model: string;
  createdAt: string;
}

export const AIPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [socialResult, setSocialResult] = useState<any>(null);
  const [history, setHistory] = useState<AIHistoryItem[]>([]);

  // Subscribe to Firestore ai_history
  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'ai_history'), (snapshot) => {
      const items: AIHistoryItem[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AIHistoryItem, 'id'>)
      }));
      setHistory(items);
    }, (err) => console.warn('[AIPage] Firestore warning:', err.message));

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please enter a topic or keyword.');
      return;
    }
    setLoading(true);
    try {
      const [aiBlog, aiSocial] = await Promise.all([
        AIService.generateBlog({ topic }),
        AIService.generateSocialCaptions(topic),
      ]);
      setResult(aiBlog);
      setSocialResult(aiSocial);

      if (db) {
        await addDoc(collection(db, 'ai_history'), {
          topic,
          model: 'Gemini 1.5 Flash',
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      }
    } catch (e: any) {
      alert(`AI error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const historyColumns = [
    { key: 'topic', label: 'Generated Topic', render: (r: AIHistoryItem) => <span style={{ fontWeight: 600, color: 'var(--dmos-text)' }}>{r.topic}</span> },
    { key: 'model', label: 'AI Model', render: (r: AIHistoryItem) => <Badge variant="accent">{r.model}</Badge> },
    { key: 'createdAt', label: 'Timestamp', align: 'right' as const, render: (r: AIHistoryItem) => <span style={{ fontSize: '0.76rem', color: 'var(--dmos-text-subtle)' }}>{new Date(r.createdAt).toLocaleString()}</span> },
  ];

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="AI Intelligence Center"
        subtitle="Google Gemini 1.5 Flash · Blog generation · Social captions · Firestore ai_history"
        badge={<Badge variant="accent">Gemini Active</Badge>}
      />

      {/* Generator Prompt Box */}
      <Card style={{ padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 12px 0' }}>Generate Blog & Social Captions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Enter blog topic or campaign idea..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)',
              fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <Button variant="primary" onClick={handleGenerate} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%' }}>
            <Sparkles size={16} />
            {loading ? 'Invoking Gemini AI…' : 'Generate with Gemini AI'}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card style={{ padding: 20, marginBottom: 24 }}>
          <SectionHeader title="Generated Article Draft" subtitle={`Topic: ${topic}`} />
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)', marginBottom: 8 }}>{result.title}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--dmos-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{result.content}</div>
        </Card>
      )}

      {/* Prompt History Table */}
      <Card style={{ padding: 20 }}>
        <SectionHeader title="AI Generation History" subtitle="Firestore collection: ai_history" />
        <DataTable columns={historyColumns} data={history} emptyMessage="No data available" />
      </Card>
    </div>
  );
};

export default AIPage;
