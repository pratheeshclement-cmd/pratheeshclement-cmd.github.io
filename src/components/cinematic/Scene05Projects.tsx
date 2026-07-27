import React, { useState } from 'react';
import { PROJECTS } from '../../data/pratheeshData';
import { ProjectItem } from '../../types';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface Scene05ProjectsProps {
  progress: number;
}

export const Scene05Projects: React.FC<Scene05ProjectsProps> = ({ progress }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(PROJECTS[0]);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>SOFTWARE ENGINEERING</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          FEATURED PROJECT VAULT & CASE STUDIES
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', width: '100%' }}>
        {/* Project Selector List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PROJECTS.map(proj => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedProject(proj);
                }}
                className="glass-card"
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 0 30px rgba(0, 242, 254, 0.3)' : 'none',
                  backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(18, 26, 42, 0.6)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{proj.title}</h3>
                  <ChevronRight size={18} color={isSelected ? '#00F2FE' : '#94A3B8'} />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {proj.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', color: '#00F2FE', backgroundColor: 'rgba(0, 242, 254, 0.1)', padding: '2px 8px', borderRadius: '8px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Case Study Detail Window */}
        {selectedProject && (
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="badge badge-cyan">{selectedProject.category}</span>
              <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>{selectedProject.impact}</span>
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>
              {selectedProject.title}
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '24px' }}>
              {selectedProject.description}
            </p>

            {/* Case Study Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00F2FE', marginBottom: '4px' }}>PROBLEM STATEMENT</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{selectedProject.problem}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>ENGINEERING SOLUTION</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{selectedProject.solution}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedProject.demoUrl && (
                <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                  <ExternalLink size={16} /> View Live App
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
