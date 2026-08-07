import React from 'react';
import { ShieldCheck, Activity, Globe, Terminal, HardDrive } from 'lucide-react';

interface StatusBarProps {
  sidebarWidth: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ sidebarWidth }) => {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: sidebarWidth,
      right: 0,
      height: 28,
      background: 'rgba(11, 18, 32, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--dmos-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '0.68rem',
      color: 'var(--dmos-text-subtle)',
      zIndex: 89,
      transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Left: System Health & Gateway */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dmos-success)', boxShadow: '0 0 6px var(--dmos-success)' }} />
          <span style={{ color: 'var(--dmos-text-muted)', fontWeight: 600 }}>API Gateway:</span>
          <span style={{ color: 'var(--dmos-success)' }}>Operational (38ms)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <HardDrive size={12} color="var(--dmos-text-subtle)" />
          <span>Storage: 42.8 MB / 5 GB</span>
        </div>
      </div>

      {/* Right: Site & Build Version */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Globe size={12} color="var(--dmos-text-subtle)" />
          <span style={{ color: 'var(--dmos-text-subtle)' }}>Site:</span>
          <span style={{ color: 'var(--dmos-text)', fontWeight: 600 }}>pratheeshclement-cmd.github.io</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Terminal size={12} color="var(--dmos-text-subtle)" />
          <span style={{ color: 'var(--dmos-primary-light)', fontWeight: 600 }}>v2.4.0-Admin</span>
        </div>
      </div>
    </footer>
  );
};
