import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginPage } from './auth/LoginPage';
import { AdminLayout } from './layout/AdminLayout';
import './design-system/tokens.css';

const AdminAppInner: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="dmos-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--dmos-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'dmos-spin 0.8s linear infinite' }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--dmos-text-muted)' }}>Loading Admin…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminLayout />;
};

export const AdminApp: React.FC = () => (
  <AuthProvider>
    <AdminAppInner />
  </AuthProvider>
);
