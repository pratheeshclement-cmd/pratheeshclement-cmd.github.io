// ─── DMOS User Management: Realtime Firestore Sync & Protected Backend ───────
// Real Firebase Auth identities, server-side RBAC authorization, and zero artificial UIDs.

import React, { useState, useEffect } from 'react';
import { Users, Shield, Plus, Edit2, Trash2, UserX, UserCheck, Key, Loader2, AlertCircle } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, Input } from '../../design-system/components';
import { UserRole } from '../../auth/AuthProvider';
import { apiClient } from '../../../services/api/core/apiClient';

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
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Editor');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // Subscribe to Firestore 'users' collection changes for real-time synchronization
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const docs: AdminUser[] = snapshot.docs.map((d) => {
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
      },
      (err) => {
        console.warn('[UsersPage] Firestore sync warning:', err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearAlerts = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleInviteUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearAlerts();

    if (!newEmail || !newEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setProcessing(true);
    try {
      const response = await apiClient<{ success: boolean; message: string; inviteLink?: string }>('/users/invite', {
        method: 'POST',
        body: JSON.stringify({
          email: newEmail,
          displayName: newName,
          role: newRole,
        }),
      });

      if (response.success) {
        setSuccessMessage(response.message || `Invitation created cleanly for ${newEmail}.`);
        setShowInviteModal(false);
        setNewEmail('');
        setNewName('');
      } else {
        setErrorMessage('Failed to process user invitation.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing invitation request.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleUserStatus = async (user: AdminUser) => {
    clearAlerts();
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    setProcessing(true);
    try {
      const response = await apiClient<{ success: boolean; message: string }>('/users/suspend', {
        method: 'POST',
        body: JSON.stringify({ uid: user.id, status: nextStatus }),
      });

      if (response.success) {
        setSuccessMessage(response.message || `User status updated to ${nextStatus}.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating user status.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRoleChange = async (user: AdminUser, role: UserRole) => {
    clearAlerts();
    setProcessing(true);
    try {
      const response = await apiClient<{ success: boolean; message: string }>('/users/update-role', {
        method: 'POST',
        body: JSON.stringify({ uid: user.id, role }),
      });

      if (response.success) {
        setSuccessMessage(response.message || `Role updated to ${role}.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating user role.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    clearAlerts();
    if (!confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) return;

    setProcessing(true);
    try {
      const response = await apiClient<{ success: boolean; message: string }>(`/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setSuccessMessage(response.message || `User deleted successfully.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error deleting user.');
    } finally {
      setProcessing(false);
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    clearAlerts();
    setProcessing(true);
    try {
      const response = await apiClient<{ success: boolean; message: string; resetLink?: string }>('/users/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: user.email }),
      });

      if (response.success) {
        setSuccessMessage(response.message || `Password reset instructions initiated for ${user.email}.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error initiating password reset.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="User & Access Management"
        subtitle="Real-time Team Management, RBAC & Firebase Auth Synchronization"
        badge={<Badge variant="primary">{users.length} Users</Badge>}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              clearAlerts();
              setShowInviteModal(true);
            }}
            disabled={processing}
            leftIcon={<Plus size={14} />}
          >
            Invite Admin
          </Button>
        }
      />

      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: 20,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 10,
            fontSize: '0.84rem',
            color: '#F87171',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: 20,
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 10,
            fontSize: '0.84rem',
            color: '#4ADE80',
          }}
        >
          {successMessage}
        </div>
      )}

      <div className="admin-responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* Roles Permission Matrix */}
        <div>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--dmos-text-subtle)', marginBottom: 14 }}>Role Permission Matrix</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ROLES.map((role) => (
              <div key={role.id} style={{ padding: '14px', borderRadius: 10, background: 'var(--dmos-card)', border: '1px solid var(--dmos-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.color }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{role.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {role.perms.map((p) => (
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
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-subtle)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Loader2 size={18} className="animate-spin" />
                <span>Loading team profiles...</span>
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>
                No registered team members found.
              </div>
            ) : (
              users.map((u) => (
                <div key={u.id} style={{ padding: '16px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--dmos-border)' }}>
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
                    disabled={processing}
                    onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                    style={{
                      padding: '4px 8px', background: 'var(--dmos-surface)', border: '1px solid var(--dmos-border)',
                      borderRadius: 6, color: 'var(--dmos-text)', fontSize: '0.74rem', outline: 'none',
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>

                  <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                    {u.status?.toUpperCase() || 'ACTIVE'}
                  </Badge>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      onClick={() => handleResetPassword(u)}
                      disabled={processing}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-text-subtle)', padding: 4 }}
                      title="Reset Password"
                    >
                      <Key size={14} />
                    </button>

                    <button
                      onClick={() => toggleUserStatus(u)}
                      disabled={processing}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.status === 'active' ? 'var(--dmos-warning)' : 'var(--dmos-success)', padding: 4 }}
                      title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                    >
                      {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u)}
                      disabled={processing}
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
            <form onSubmit={handleInviteUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mariya Pratheesh" />
              <Input label="Email Address" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required placeholder="e.g. mariya@dmos.app" />
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 6 }}>Assign Role</label>
                <select className="dmos-input" value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)}>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <Button type="button" variant="ghost" onClick={() => setShowInviteModal(false)} disabled={processing}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={processing} leftIcon={processing ? <Loader2 size={14} className="animate-spin" /> : undefined}>
                  {processing ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
