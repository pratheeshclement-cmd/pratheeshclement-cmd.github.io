import React from 'react';
import { SKILL_GROUPS } from '../../data/pratheeshData';

interface Scene04SkillsProps {
  progress: number;
}

export const Scene04Skills: React.FC<Scene04SkillsProps> = ({ progress }) => {
  const categoryColors = ['#00F2FE', '#A855F7', '#EC4899', '#10B981'];

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
        <span className="badge badge-violet" style={{ marginBottom: '12px' }}>CAPABILITIES ORBIT</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          TECHNICAL & DIGITAL MARKETING STACK
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {SKILL_GROUPS.map((group, idx) => {
          const color = categoryColors[idx % categoryColors.length];
          return (
            <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: color, marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                {group.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {group.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="glass-card"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#FFF',
                      border: `1px solid ${color}40`,
                      backgroundColor: `${color}10`
                    }}
                  >
                    {skill.name} • <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
