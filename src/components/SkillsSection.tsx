import React from 'react';
import { Cpu, Code, Layout, TrendingUp, Bot, Database } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const skillGroups = [
    {
      title: 'Technical SEO',
      level: 'Expert',
      icon: TrendingUp,
      color: 'var(--accent-primary)',
      skills: ['Schema Markup', 'SEO Audits', 'Keyword Research', 'Core Web Vitals', 'XML Sitemaps', 'GA4 Analytics']
    },
    {
      title: 'Web Development',
      level: 'Proficient',
      icon: Code,
      color: 'var(--accent-secondary)',
      skills: ['Semantic HTML5', 'CSS Custom Properties', 'Vanilla JS', 'React', 'Next.js', 'Node.js', 'Express', 'Vite', 'CSS Grid/Flexbox', 'Responsive Design']
    },
    {
      title: 'Paid Advertising',
      level: 'Expert',
      icon: TargetIcon,
      color: 'var(--accent-mint)',
      skills: ['Google Search Ads', 'Meta Ads Funnels', 'Conversion Tracking', 'Custom Audiences', 'CPL Reduction', 'Pixel Setup']
    },
    {
      title: 'Digital Marketing',
      level: 'Expert',
      icon: TrendingUp,
      color: 'var(--accent-warm)',
      skills: ['Digital Strategy', 'Lead Generation', 'CRO', 'Content Funnels', 'Growth Roadmaps', 'Channel Analytics']
    },
    {
      title: 'AI & Automation',
      level: 'Proficient',
      icon: Bot,
      color: 'var(--accent-tertiary)',
      skills: ['AI Workflow Design', 'Zapier Triggers', 'API Webhooks', 'AI Chat Agents', 'Auto Reporting', 'Doc Generation', 'OpenAI', 'Gemini', 'Claude']
    },
    {
      title: 'UI/UX & Database',
      level: 'Proficient',
      icon: Layout,
      color: 'var(--accent-primary)',
      skills: ['Figma', 'Photoshop', 'Illustrator', 'Glassmorphism', 'Typography Systems', 'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Supabase', 'Docker']
    }
  ];

  return (
    <section id="skills">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="pill" style={{ marginBottom: '16px' }}><Cpu size={14} /> Technical Arsenal</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          Skills & Specializations Matrix
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {skillGroups.map((group, idx) => {
          const IconComp = group.icon;
          return (
            <div key={idx} className="glass" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <IconComp size={22} color={group.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{group.title}</h3>
                </div>
                <span className="pill" style={{ fontSize: '0.75rem', padding: '4px 10px', color: group.color, borderColor: group.color }}>
                  {group.level}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="pill" style={{ fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TargetIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
