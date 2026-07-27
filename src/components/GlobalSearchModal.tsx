import React, { useState, useEffect } from 'react';
import { WORKSPACES, PROJECTS, SKILL_GROUPS, CERTIFICATIONS, TECHNICAL_ARTICLES, WORK_EXPERIENCE } from '../data/pratheeshData';
import { WorkspaceId } from '../types';
import { sound } from '../utils/soundEffects';
import { Search, X, FolderKanban, Award, Code2, BookOpen, Milestone, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (workspaceId: WorkspaceId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingWorkspaces = WORKSPACES.filter(w => 
    !q || w.title.toLowerCase().includes(q) || w.subtitle.toLowerCase().includes(q)
  );

  const matchingProjects = PROJECTS.filter(p => 
    q && (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.technologies.some(t => t.toLowerCase().includes(q)))
  );

  const matchingCerts = CERTIFICATIONS.filter(c => 
    q && (c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) || c.topics.some(t => t.toLowerCase().includes(q)))
  );

  const matchingArticles = TECHNICAL_ARTICLES.filter(a => 
    q && (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)))
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(7, 9, 14, 0.8)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh',
      paddingLeft: '16px',
      paddingRight: '16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        borderRadius: '24px',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Search Input Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 22, 36, 0.9)'
        }}>
          <Search size={20} color="#00F2FE" />
          <input
            type="text"
            autoFocus
            placeholder="Search workspaces, projects, skills, certificates, articles (e.g. React, SEO, Expense App)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFF',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results List */}
        <div style={{
          maxHeight: '420px',
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Workspaces */}
          {matchingWorkspaces.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00F2FE', marginBottom: '8px', letterSpacing: '0.05em' }}>
                WORKSPACES ({matchingWorkspaces.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {matchingWorkspaces.map(ws => (
                  <div
                    key={ws.id}
                    onClick={() => {
                      sound.playWindowSwitch();
                      onNavigate(ws.id);
                      onClose();
                    }}
                    className="glass-card"
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>{ws.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{ws.subtitle}</div>
                    </div>
                    <ArrowRight size={14} color={ws.accentColor} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {matchingProjects.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A855F7', marginBottom: '8px', letterSpacing: '0.05em' }}>
                MATCHING PROJECTS ({matchingProjects.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      sound.playWindowSwitch();
                      onNavigate('project-vault');
                      onClose();
                    }}
                    className="glass-card"
                    style={{ padding: '12px 16px', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>{proj.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {matchingArticles.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06B6D4', marginBottom: '8px', letterSpacing: '0.05em' }}>
                KNOWLEDGE ARTICLES ({matchingArticles.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      sound.playWindowSwitch();
                      onNavigate('knowledge-hub');
                      onClose();
                    }}
                    className="glass-card"
                    style={{ padding: '12px 16px', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>{art.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{art.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div style={{
          padding: '10px 24px',
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748B'
        }}>
          <span>Tip: Press <strong>ESC</strong> or <strong>Cmd+K</strong> to exit</span>
          <span>Instant OS X Search</span>
        </div>
      </div>
    </div>
  );
};
