import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { PERSONAL_INFO } from '../../data/pratheeshData';
import { Bot, Code2, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface Scene02HeroProps {
  progress: number;
  onNavigateAI?: () => void;
}

export const Scene02Hero: React.FC<Scene02HeroProps> = ({ onNavigateAI }) => {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (portraitRef.current) {
      anime({
        targets: portraitRef.current,
        translateY: [-10, 10],
        duration: 3500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div className="glass-panel" style={{
        borderRadius: '32px',
        padding: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        width: '100%',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 30px 70px rgba(0,0,0,0.8)'
      }}>
        {/* Left Text Column */}
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <span className="badge badge-cyan">PORTFOLIO OS X</span>
            <span className="badge badge-violet">MASTER EDITION</span>
          </div>

          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 900,
            lineHeight: 1.1,
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '16px'
          }}>
            PRATHEESH <span className="text-gradient">CLEMENT</span>
          </h1>

          <h3 style={{
            fontSize: '1.3rem',
            color: '#00F2FE',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            {PERSONAL_INFO.title}
          </h3>

          <p style={{
            fontSize: '1.05rem',
            color: '#94A3B8',
            lineHeight: '1.7',
            marginBottom: '32px'
          }}>
            {PERSONAL_INFO.summary}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateAI) onNavigateAI();
              }}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Bot size={20} /> Launch Holographic AI Concierge
            </button>
          </div>
        </div>

        {/* Right Portrait Floating Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            ref={portraitRef}
            className="glass-card"
            style={{
              padding: '18px',
              borderRadius: '28px',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 242, 254, 0.25)'
            }}
          >
            <div style={{
              width: '100%',
              height: '340px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '16px'
            }}>
              <img
                src="/asset/pratheesh4k1.jpeg"
                alt="Pratheesh Clement"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 14, 20, 0.95) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span className="badge badge-emerald">Open for Roles</span>
                <span style={{ fontSize: '0.8rem', color: '#FFF', fontFamily: 'JetBrains Mono' }}>Vadalur, TN</span>
              </div>
            </div>

            <div style={{ padding: '0 8px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#FFF' }}>MARIYA PRATHEESH C</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                BCA (2024) • Google Digital Marketing Cert (ID: 453421024)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
