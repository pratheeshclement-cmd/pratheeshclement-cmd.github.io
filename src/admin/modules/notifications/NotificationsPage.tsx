// ─── DMOS Notifications: Firestore Realtime ───────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, ShieldAlert, Sparkles, FileText, Users, HardDrive } from 'lucide-react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, EmptyState, LoadingSkeleton } from '../../design-system/components';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  type: 'lead' | 'seo' | 'perf' | 'alert' | 'blog' | 'traffic';
  read: boolean;
  priority: 'critical' | 'warning' | 'info' | 'success';
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore notifications collection
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: NotificationItem[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<NotificationItem, 'id'>)
        }));
        setNotifications(items);
        setLoading(false);
      }, () => {
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      if (db) {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      if (db) {
        await deleteDoc(doc(db, 'notifications', id));
      }
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Notification Center"
        subtitle="Firestore realtime events, pipeline triggers, and system alerts"
        badge={unread > 0 ? <Badge variant="danger" dot>{unread} Unread</Badge> : <Badge variant="success">All Read</Badge>}
      />
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
          Loading Firestore notification items…
        </div>
      ) : notifications.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)' }}>
          <Bell size={32} color="var(--dmos-text-subtle)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)' }}>No Notifications</div>
          <div style={{ fontSize: '0.78rem', marginTop: 4 }}>System events and pipeline triggers will appear here in real time.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(item => (
            <Card
              key={item.id}
              style={{
                padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: item.read ? 'rgba(16,24,39,0.4)' : 'rgba(46,90,255,0.06)',
                borderLeft: `3px solid ${
                  item.priority === 'critical' ? 'var(--dmos-danger)'
                  : item.priority === 'warning' ? 'var(--dmos-warning)'
                  : 'var(--dmos-primary)'
                }`,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{item.title}</span>
                  {!item.read && <Badge variant="primary">NEW</Badge>}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)' }}>{item.desc}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!item.read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-text-muted)' }}
                    title="Mark as Read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)' }}
                  title="Delete Notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
