import React, { useState } from 'react';
import { sound } from '../../utils/soundEffects';
import { Code2, Play, Cpu, Layers, GitBranch, Terminal } from 'lucide-react';

export const FrontendLabWorkspace: React.FC = () => {
  const [renderCount, setRenderCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'expense-code' | 'os-architecture'>('expense-code');

  const handleTriggerRender = () => {
    sound.playClick();
    setRenderCount(prev => prev + 1);
  };

  const expenseAppCodeSnippet = `// Expense Management Web Application - Modular Architecture
// Author: Pratheesh Clement & Team

export interface ExpenseRecord {
  id: string;
  category: 'Food' | 'Transport' | 'Housing' | 'Utilities' | 'Entertainment';
  amount: number;
  date: string;
  note: string;
}

export class BudgetEngine {
  private thresholdLimits: Record<string, number>;

  constructor(limits: Record<string, number>) {
    this.thresholdLimits = limits;
  }

  public checkBudgetAlert(category: string, totalSpent: number): boolean {
    const limit = this.thresholdLimits[category] || Infinity;
    return totalSpent > limit;
  }

  public calculateCategoryBreakdown(records: ExpenseRecord[]) {
    return records.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}`;

  const osArchitectureSnippet = `// PORTFOLIO OS X - Continuous Spatial Workspace Router
// React 19 + TypeScript + Anime.js Motion Engine

export const OSSpatialRouter: React.FC<{ activeWorkspace: WorkspaceId }> = ({ activeWorkspace }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hardware-accelerated continuous transition
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 350,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)'
    });
  }, [activeWorkspace]);

  return (
    <main ref={containerRef} className="os-viewport">
      {renderActiveWorkspace(activeWorkspace)}
    </main>
  );
};`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Workspace Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <Code2 size={28} color="#3B82F6" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>FRONTEND ENGINEERING LAB</h2>
              <span className="badge badge-violet">React 19 + TS</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Inspect component architectures, state flow cycles, and clean code principles
            </p>
          </div>
        </div>
      </div>

      {/* Virtual DOM Render Visualizer */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#00F2FE" /> VIRTUAL DOM RE-RENDER CYCLE MONITOR
          </h3>
          <button onClick={handleTriggerRender} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            <Play size={14} /> Dispatch State Action
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>TOTAL STATE DISPATCHES</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00F2FE', fontFamily: 'JetBrains Mono' }}>{renderCount}</div>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>RE-RENDER TIME</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', fontFamily: 'JetBrains Mono' }}>0.4ms</div>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>MEMORY ALLOCATION</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A855F7', fontFamily: 'JetBrains Mono' }}>Clean (0 leaks)</div>
          </div>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { sound.playClick(); setActiveTab('expense-code'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'expense-code' ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: activeTab === 'expense-code' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                color: activeTab === 'expense-code' ? '#00F2FE' : '#94A3B8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Expense App Logic (TypeScript)
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('os-architecture'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'os-architecture' ? '1px solid #7F00FF' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: activeTab === 'os-architecture' ? 'rgba(127, 0, 255, 0.15)' : 'transparent',
                color: activeTab === 'os-architecture' ? '#A855F7' : '#94A3B8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Portfolio OS X Architecture
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} /> Strict Type Safety Enabled
          </div>
        </div>

        <pre style={{
          backgroundColor: '#07090E',
          padding: '20px',
          borderRadius: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
          color: '#E2E8F0',
          lineHeight: '1.6',
          overflowX: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <code>{activeTab === 'expense-code' ? expenseAppCodeSnippet : osArchitectureSnippet}</code>
        </pre>
      </div>
    </div>
  );
};
