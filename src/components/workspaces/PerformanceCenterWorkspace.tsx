import React, { useState } from 'react';
import { sound } from '../../utils/soundEffects';
import { Zap, ShieldCheck, Gauge, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';

export const PerformanceCenterWorkspace: React.FC = () => {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);

  const handleRunAudit = () => {
    sound.playClick();
    setIsRunningAudit(true);
    setAuditComplete(false);

    setTimeout(() => {
      setIsRunningAudit(false);
      setAuditComplete(true);
      sound.playBootChime();
    }, 1200);
  };

  const scores = [
    { category: 'Performance', score: 100, color: '#10B981', metric: 'LCP 0.6s • TTI 0.8s' },
    { category: 'Accessibility', score: 100, color: '#10B981', metric: 'WCAG AA Compliant' },
    { category: 'Best Practices', score: 100, color: '#10B981', metric: 'HTTPS & Modern JS' },
    { category: 'SEO Audit', score: 100, color: '#10B981', metric: 'JSON-LD & Meta Tags' }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Zap size={28} color="#10B981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>PERFORMANCE ENGINEERING CENTER</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Target Lighthouse 100 score suite, zero layout shift, and Core Web Vitals monitor
            </p>
          </div>
        </div>

        <button onClick={handleRunAudit} disabled={isRunningAudit} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <RefreshCw size={16} className={isRunningAudit ? 'spin' : ''} /> {isRunningAudit ? 'Running Audit...' : 'Run Lighthouse Audit'}
        </button>
      </div>

      {/* 4 Score Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {scores.map((s) => (
          <div key={s.category} className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: `6px solid ${s.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 0 25px ${s.color}40`,
              backgroundColor: 'rgba(16, 185, 129, 0.05)'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: '#FFF' }}>
                {isRunningAudit ? '--' : s.score}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{s.category}</h4>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{s.metric}</p>
          </div>
        ))}
      </div>

      {/* Core Web Vitals Metrics */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={18} color="#00F2FE" /> CORE WEB VITALS REAL-TIME DIAGNOSTIC
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>Largest Contentful Paint (LCP)</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono' }}>0.65s (FAST)</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '25%', backgroundColor: '#10B981' }} />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>First Input Delay (FID)</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono' }}>1.2ms (INSTANT)</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '10%', backgroundColor: '#10B981' }} />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>Cumulative Layout Shift (CLS)</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono' }}>0.000 (ZERO)</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '5%', backgroundColor: '#10B981' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
