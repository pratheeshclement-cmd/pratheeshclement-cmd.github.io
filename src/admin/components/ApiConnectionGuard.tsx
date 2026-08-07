import React, { useState } from 'react';
import { Lock, AlertTriangle, ExternalLink, ShieldCheck, Key, RefreshCw, CheckCircle } from 'lucide-react';
import { API_PROVIDERS, getStoredApiState, saveApiProviderCredentials, ApiProviderConfig } from '../services/apiClients';
import { Button, Card } from '../design-system/components';

interface ApiConnectionGuardProps {
  providerId: string;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const ApiConnectionGuard: React.FC<ApiConnectionGuardProps> = ({
  providerId,
  children,
  fallbackTitle,
  fallbackDescription,
}) => {
  const [providers, setProviders] = useState(() => getStoredApiState());
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const config = providers[providerId] || API_PROVIDERS[providerId];

  // If connected, render the real dashboard content!
  if (config && config.status === 'connected') {
    return <>{children}</>;
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const updated = saveApiProviderCredentials(providerId, formData);
      setProviders(getStoredApiState());
      setLoading(false);
      setIsWizardOpen(false);
    }, 1000);
  };

  return (
    <Card style={{ padding: '36px 28px', textAlign: 'center', background: 'var(--dmos-surface)', border: '1px solid var(--dmos-border)' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: config?.status === 'auth_required' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
        border: `1px solid ${config?.status === 'auth_required' ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 18px',
      }}>
        {config?.status === 'auth_required' ? (
          <Lock size={24} color="var(--dmos-warning)" />
        ) : (
          <AlertTriangle size={24} color="var(--dmos-danger)" />
        )}
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dmos-text-subtle)', marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: config?.status === 'auth_required' ? 'var(--dmos-warning)' : 'var(--dmos-danger)' }} />
        {config?.status === 'auth_required' ? 'Authentication Required' : 'Not Connected'}
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 8px' }}>
        {fallbackTitle || `${config?.name || providerId} Data Unavailable`}
      </h3>

      <p style={{ fontSize: '0.84rem', color: 'var(--dmos-text-muted)', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
        {fallbackDescription || `No live data available. Authenticate with the official ${config?.name || 'provider'} to sync live metrics, reporting, and automated updates.`}
      </p>

      {!isWizardOpen ? (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" leftIcon={<Key size={15} />} onClick={() => setIsWizardOpen(true)}>
            Connect API Credentials
          </Button>
          {config?.docsUrl && (
            <a href={config.docsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<ExternalLink size={14} />}>
                View API Docs
              </Button>
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleConnect} style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12, border: '1px solid var(--dmos-border-strong)' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--dmos-text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} color="var(--dmos-primary-light)" />
            {config?.name} Onboarding Wizard
          </div>

          {config?.authFields.map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 500, color: 'var(--dmos-text-muted)', marginBottom: 6 }}>
                {field.label} {field.required && <span style={{ color: 'var(--dmos-danger)' }}>*</span>}
              </label>
              <input
                type={field.key.toLowerCase().includes('token') || field.key.toLowerCase().includes('key') ? 'password' : 'text'}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.key] || ''}
                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--dmos-border)',
                  borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.82rem',
                  fontFamily: 'var(--dmos-font-mono)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Button variant="primary" type="submit" loading={loading} style={{ flex: 1, justifyContent: 'center' }}>
              Save & Test Connection
            </Button>
            <Button variant="ghost" type="button" onClick={() => setIsWizardOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};
