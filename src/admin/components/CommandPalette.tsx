import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Zap, Sparkles, FileText, LayoutDashboard, BarChart2, Shield, Settings, FolderOpen, Globe, MessageSquare } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (moduleId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Natural Language AI';
  icon: React.FC<{ size?: number; color?: string }>;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [nlResult, setNlResult] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          window.dispatchEvent(new CustomEvent('dmos-toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items: CommandItem[] = [
    { id: 'nav-dash', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => onNavigate('dashboard') },
    { id: 'nav-mkt', title: 'Go to Marketing Hub', category: 'Navigation', icon: BarChart2, action: () => onNavigate('marketing') },
    { id: 'nav-analytics', title: 'Go to Analytics', category: 'Navigation', icon: BarChart2, action: () => onNavigate('analytics') },
    { id: 'nav-content', title: 'Go to Content Studio', category: 'Navigation', icon: FileText, action: () => onNavigate('content-studio') },
    { id: 'nav-seo', title: 'Go to SEO Center', category: 'Navigation', icon: Search, action: () => onNavigate('seo') },
    { id: 'nav-crm', title: 'Go to CRM & Leads', category: 'Navigation', icon: MessageSquare, action: () => onNavigate('crm') },
    { id: 'nav-auto', title: 'Go to AI Automation Center', category: 'Navigation', icon: Zap, action: () => onNavigate('automation') },
    { id: 'nav-reports', title: 'Go to Report Center', category: 'Navigation', icon: FileText, action: () => onNavigate('reports') },
    { id: 'nav-mon', title: 'Go to Website Monitor', category: 'Navigation', icon: Globe, action: () => onNavigate('monitor') },
    { id: 'nav-settings', title: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => onNavigate('settings') },

    // Quick Actions
    { id: 'act-blog', title: 'Generate Blog Post with AI', category: 'Actions', icon: Sparkles, action: () => onNavigate('blog') },
    { id: 'act-audit', title: 'Run Immediate SEO Audit', category: 'Actions', icon: Search, action: () => onNavigate('seo') },
    { id: 'act-report', title: 'Export Monthly Traffic Report (PDF)', category: 'Actions', icon: FileText, action: () => onNavigate('reports') },
    { id: 'act-project', title: 'Add New Portfolio Project', category: 'Actions', icon: FolderOpen, action: () => onNavigate('projects') },
  ];

  // Natural Language Handler
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val) {
      setNlResult(null);
      return;
    }
    const lower = val.toLowerCase();
    if (lower.includes('traffic today') || lower.includes('show traffic')) {
      setNlResult('📊 Natural Language Result: Today traffic is 127 visitors (+12.4% vs yesterday). 9 users active right now.');
    } else if (lower.includes('compare june vs july')) {
      setNlResult('📈 Natural Language Result: July sessions grew +22.1% (3,214 vs 2,632 in June). Organic search led growth.');
    } else if (lower.includes('broken links') || lower.includes('find broken')) {
      setNlResult('⚠️ Natural Language Result: Scanner found 0 broken 404 links on portfolio domain. 2 images missing alt text.');
    } else if (lower.includes('lighthouse') || lower.includes('run lighthouse')) {
      setNlResult('⚡ Natural Language Result: Last Lighthouse score is 94/100 (Perf: 94, A11y: 100, Best: 100, SEO: 100).');
    } else if (lower.includes('generate seo report')) {
      setNlResult('📄 Natural Language Result: Generated SEO report draft ready in Report Center.');
    } else {
      setNlResult(null);
    }
  };

  const filteredItems = items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5, 10, 20, 0.75)', backdropFilter: 'blur(8px)' }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: 'relative',
            width: '90%',
            maxWidth: 640,
            background: 'var(--dmos-card-elevated)',
            border: '1px solid var(--dmos-border-strong)',
            borderRadius: 'var(--dmos-radius-xl)',
            boxShadow: 'var(--dmos-shadow-lg)',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {/* Search Bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--dmos-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={20} color="var(--dmos-primary-light)" />
            <input
              autoFocus
              placeholder="Search DMOS or type natural query (e.g. 'traffic today', 'compare June vs July')…"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              style={{
                width: '100%', background: 'none', border: 'none', outline: 'none',
                fontSize: '0.94rem', color: 'var(--dmos-text)', fontFamily: 'var(--dmos-font-sans)',
              }}
            />
            <kbd style={{ padding: '3px 7px', background: 'rgba(255,255,255,0.08)', borderRadius: 6, fontSize: '0.7rem', color: 'var(--dmos-text-subtle)', border: '1px solid var(--dmos-border)' }}>
              ESC
            </kbd>
          </div>

          {/* Natural Language Result Banner */}
          {nlResult && (
            <div style={{ padding: '12px 20px', background: 'rgba(46,90,255,0.1)', borderBottom: '1px solid rgba(46,90,255,0.2)', fontSize: '0.82rem', color: 'var(--dmos-text)', lineHeight: 1.5 }}>
              {nlResult}
            </div>
          )}

          {/* Item List */}
          <div style={{ maxHeight: 380, overflowY: 'auto', padding: '10px' }}>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  style={{
                    padding: '10px 14px', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--dmos-text-muted)' }}>
                      <item.icon size={16} />
                    </div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--dmos-text)' }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 4 }}>
                    {item.category}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>
                No commands found matching "{query}". Try a natural query!
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--dmos-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--dmos-text-subtle)' }}>
            <span>Navigation & Natural Language Parser</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Command size={12} /> + K to toggle
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
