import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Cpu, Sparkles } from 'lucide-react';

interface Scene01IntroProps {
  progress: number;
}

export const Scene01Intro: React.FC<Scene01IntroProps> = ({ progress }) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        scale: [0.85, 1.0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '40px 24px',
        textAlign: 'center'
      }}
    >
      <div ref={logoRef} style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 24px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #00F2FE 0%, #7F00FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 60px rgba(0, 242, 254, 0.5)',
          position: 'relative'
        }}>
          <Cpu size={52} color="#000" />
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 900,
          letterSpacing: '0.08em',
          fontFamily: 'Outfit, sans-serif',
          background: 'linear-gradient(135deg, #FFF 0%, #00F2FE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          PORTFOLIO OS X
        </h1>

        <p style={{
          color: '#94A3B8',
          fontSize: '1.1rem',
          letterSpacing: '0.15em',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          PRATHEESH CLEMENT • CINEMATIC EXPERIENCE
        </p>

        <div style={{
          marginTop: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          color: '#00F2FE',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <Sparkles size={16} /> SCROLL DOWN TO ENTER DIGITAL UNIVERSE
        </div>
      </div>
    </section>
  );
};
