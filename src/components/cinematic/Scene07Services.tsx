import React from 'react';
import { Code2, Search, BarChart3, Cpu, Sparkles } from 'lucide-react';

interface Scene07ServicesProps {
  progress: number;
}

export const Scene07Services: React.FC<Scene07ServicesProps> = ({ progress }) => {
  const services = [
    {
      title: 'Full-Stack Web Engineering',
      desc: 'Building high-performance React 19, TypeScript, and HTML5/CSS3 web applications with smooth motion physics and 100/100 Core Web Vitals.',
      icon: Code2,
      color: '#00F2FE'
    },
    {
      title: 'Technical SEO & Audit',
      desc: 'Google Search Console optimization, structured schema microdata, page speed acceleration, and keyword search intent ranking.',
      icon: Search,
      color: '#F59E0B'
    },
    {
      title: 'Digital Marketing & Analytics',
      desc: 'Google Certified (ID: 453421024) marketing campaigns, Google Analytics tracking, SEM/SMM funnel strategy, and content marketing.',
      icon: BarChart3,
      color: '#EC4899'
    },
    {
      title: 'Enterprise QAD ERP Operations',
      desc: 'Industrial supply chain stock tracking, ERP material requests, inventory audits, and high-pressure manufacturing process discipline.',
      icon: Cpu,
      color: '#10B981'
    }
  ];

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
        <span className="badge badge-pink" style={{ marginBottom: '12px' }}>PROFESSIONAL SERVICES</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          ENGINEERING & DIGITAL GROWTH SERVICES
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%' }}>
        {services.map((srv, idx) => {
          const IconComp = srv.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
              <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: `${srv.color}15`, width: 'fit-content', marginBottom: '20px' }}>
                <IconComp size={28} color={srv.color} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>{srv.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.6' }}>{srv.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
