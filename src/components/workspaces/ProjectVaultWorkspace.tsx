import React, { useState } from 'react';
import { PROJECTS } from '../../data/pratheeshData';
import { ProjectItem } from '../../types';
import { sound } from '../../utils/soundEffects';
import { FolderKanban, Code2, Sparkles, CheckCircle2, Layers, ExternalLink, Github, Cpu, AlertTriangle, Lightbulb, Rocket } from 'lucide-react';

export const ProjectVaultWorkspace: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(PROJECTS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'case-study' | 'architecture'>('overview');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <FolderKanban size={28} color="#8B5CF6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>PROJECT VAULT & CASE STUDIES</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Comprehensive engineering case studies: Problem, Solution, Architecture, Responsibilities, & Lessons
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Project Selector List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedProject(proj);
                }}
                className="glass-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(18, 26, 42, 0.6)',
                  boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-cyan">{proj.type}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{proj.category}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {proj.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Case Study View */}
        <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px' }}>
          {/* Header & External Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-violet" style={{ marginBottom: '8px' }}>{selectedProject.category}</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit' }}>
                {selectedProject.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedProject.demoUrl && (
                <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {selectedProject.githubUrl && (
                <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  <Github size={14} /> Source Code
                </a>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            {(['overview', 'case-study', 'architecture'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { sound.playClick(); setActiveTab(tab); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: activeTab === tab ? '1px solid #00F2FE' : '1px solid transparent',
                  backgroundColor: activeTab === tab ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === tab ? '#00F2FE' : '#94A3B8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.7', marginBottom: '24px' }}>
                {selectedProject.description}
              </p>

              {/* Metrics */}
              {selectedProject.metrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                  {selectedProject.metrics.map((m, idx) => (
                    <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{m.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00F2FE', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Features */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" /> KEY IMPLEMENTATION FEATURES
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.features.map((feat, idx) => (
                    <div key={idx} style={{ fontSize: '0.88rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00F2FE' }} />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>TECHNOLOGIES USED:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedProject.technologies.map((tech, idx) => (
                    <span key={idx} style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(127, 0, 255, 0.15)',
                      border: '1px solid rgba(127, 0, 255, 0.3)',
                      color: '#A855F7',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Full Case Study Breakdown (Problem, Solution, Responsibilities, Challenges) */}
          {activeTab === 'case-study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Problem */}
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F43F5E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> THE PROBLEM STATEMENT
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: '1.6' }}>{selectedProject.problem}</p>
              </div>

              {/* Solution */}
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10B981', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={16} /> THE ARCHITECTURAL SOLUTION
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: '1.6' }}>{selectedProject.solution}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>ENGINEERING RESPONSIBILITIES:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.responsibilities.map((r, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="#00F2FE" /> {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Challenges */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>TECHNICAL CHALLENGES OVERCOME:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.challenges.map((c, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A855F7' }} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Architecture & Lessons Learned */}
          {activeTab === 'architecture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00F2FE', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={16} /> SYSTEM ARCHITECTURE & DESIGN PATTERNS
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.7' }}>
                  {selectedProject.architectureDetails}
                </p>
              </div>

              <div style={{ backgroundColor: 'rgba(127, 0, 255, 0.08)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(127, 0, 255, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A855F7', marginBottom: '8px' }}>
                  LESSONS LEARNED:
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: '1.6' }}>
                  {selectedProject.lessonsLearned}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Rocket size={16} color="#10B981" /> FUTURE PLANNED IMPROVEMENTS:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.futureImprovements.map((imp, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
