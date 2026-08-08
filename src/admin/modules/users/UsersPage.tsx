// ─── DMOS User Management: Firestore Realtime Sync ──────────────────────────

import React, { useState, useEffect } from 'react';
import { Users, Shield, Plus, Edit2, Trash2, UserX, UserCheck, Key } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, Input } from '../../design-system/components';
import { UserRole } from '../../auth/AuthProvider';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';

interface AdminUser {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  lastSeen?: string;
  createdAt?: string;
  photoURL?: string;
}

const ROLES: { id: UserRole; name: string; perms: string[]; color: string }[] = [
  { id: 'Owner',           name: 'Owner',           perms: ['Full Root Access', 'Billing', 'Role Delegation'], color: '#EF4444' },
  { id: 'Administrator',   name: 'Administrator',   perms: ['Dashboard', 'Analytics', 'SEO', 'CMS', 'Blog', 'CRM', 'Settings'], color: '#F59E0B' },
  { id: 'Editor',          name: 'Editor',          perms: ['Blog CMS', 'Media Library', 'Portfolio CMS'], color: '#22C55E' },
  { id: 'SEO Manager',     name: 'SEO Manager',     perms: ['Analytics', 'SEO Center', 'PageSpeed', 'GSC'], color: '#17B4CE' },
  { id: 'Marketing',       name: 'Marketing',       perms: ['CRM', 'Campaigns', 'Social Captions'], color: '#EC4899' },
  { id: 'CRM Executive',   name: 'CRM Executive',   perms: ['Leads', 'Pipeline', 'Contact Forms'], color: '#3B82F6' },
  { id: 'Content Writer',  name: 'Content Writer',  perms: ['Blog CMS Drafts', 'AI Writing'], color: '#8B5CF6' },
  { id: 'Viewer',          name: 'Viewer',          perms: ['Dashboard read-only', 'Analytics read-only'], color: '#64748B' },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Editor');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const docs: AdminUser[] = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          uid: d.id,
          name: data.displayName || data.email?.split('@')[0] || 'User',
          email: data.email || '',
          role: (data.role as UserRole) || 'Editor',
          status: data.status || 'active',
          lastSeen: data.lastLogin ? new Date(data.lastLogin).toLocaleDateString() : 'Never',
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
          photoURL: data.photoURL || undefined,
        };
      });
      setUsers(docs);
      setLoading(false);
    }, (err) => {
      console.warn('[UsersPage] Firestore sync warning:', err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInviteUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEmail) return;

    try {
      const uid = `invited_${Date.now()}`;
      const newUserDoc = {
        uid,
        email: newEmail,
        displayName: newName || newEmail.split('@')[0],
        role: newRole,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastSeen: 'Invited',
      };

      if (db) {
        await setDoc(doc(db, 'users', uid), newUserDoc);
      }

      await fetch(`${API_BASE}/users/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      }).catch(() => {});

      setShowInviteModal(false);
      setNewEmail('');
      setNewName('');
    } catch (e: any) {
      alert(`Invite error: ${e.message}`);
    }
  };

  const toggleUserStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      if (db && user.id) {
        await updateDoc(doc(db, 'users', user.id), { status: nextStatus, updatedAt: new Date().toISOString() });
      }

      await fetch(`${API_BASE}/users/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, status: nextStatus }),
      }).catch(() => {});

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    } catch (e: any) {
      alert(`Update error: ${e.message}`);
    }
  };

  const handleRoleChange = async (user: AdminUser, role: UserRole) => {
    try {
      if (db && user.id) {
        await updateDoc(doc(db, 'users', user.id), { role, updatedAt: new Date().toISOString() });
      }

      await fetch(`${API_BASE}/users/update-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, role }),
      }).catch(() => {});

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u));
    } catch (e: any) {
      alert(`Role error: ${e.message}`);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      if (db && user.id) {
        await deleteDoc(doc(db, 'users', user.id));
      }
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    try {
      await fetch(`${API_BASE}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      alert(`Password reset instructions sent to ${user.email}`);
    } catch (e: any) {
      alert(`Reset password error: ${e.message}`);
    }
  };

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="User & Access Management"
        subtitle="Firestore: users · Realtime updates · Express Admin API endpoints"
        badge={<Badge variant="primary">{users.length} Users</Badge>}
        actions={<Button variant="primary" onClick={() => setShowInviteModal(true)} leftIcon={<Plus size={14} />}>Invite Admin</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>
        {/* Roles */}
        <div>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--dmos-text-subtle)', marginBottom: 14 }}>Role Permission Matrix</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ROLES.map(role => (
              <div key={role.id} style={{ padding: '14px', borderRadius: 10, background: 'var(--dmos-card)', border: '1px solid var(--dmos-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.color }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{role.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {role.perms.map(p => (
                    <span key={p} style={{ fontSize: '0.66rem', padding: '2px 8px', borderRadius: 4, background: `${role.color}15`, color: role.color, border: `1px solid ${role.color}30` }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--dmos-text-subtle)', marginBottom: 14 }}>Active Team Members</h2>
          <Card style={{ padding: 0 }}>
            {users.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>
                No data available
              </div>
            ) : (
              users.map(u => (
                <div key={u.id} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--dmos-border)' }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--dmos-primary), var(--dmos-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden',
                  }}>
                    {u.photoURL ? <img src={u.photoURL} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--dmos-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                  </div>

                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u, e.target.value as UserRole)}
                    style={{
                      padding: '4px 8px', background: 'var(--dmos-surface)', border: '1px solid var(--dmos-border)',
                      borderRadius: 6, color: 'var(--dmos-text)', fontSize: '0.74rem', outline: 'none',
                    }}
                  >
                    {ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>

                  <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                    {u.status?.toUpperCase() || 'ACTIVE'}
                  </Badge>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      onClick={() => handleResetPassword(u)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-text-subtle)', padding: 4 }}
                      title="Reset Password"
                    >
                      <Key size={14} />
                    </button>

                    <button
                      onClick={() => toggleUserStatus(u)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.status === 'active' ? 'var(--dmos-warning)' : 'var(--dmos-success)', padding: 4 }}
                      title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                    >
                      {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)', padding: 4 }}
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Card style={{ width: 420, maxWidth: '100%', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: 'var(--dmos-text)', fontWeight: 700 }}>Invite Admin Team Member</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label="Full Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Mariya Pratheesh" />
              <Input label="Email Address" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="e.g. mariya@dmos.app" />
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 6 }}>Assign Role</label>
                <select className="dmos-input" value={newRole} onChange={e => setNewRole(e.target.value as UserRole)}>
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleInviteUser}>Send Invitation</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
