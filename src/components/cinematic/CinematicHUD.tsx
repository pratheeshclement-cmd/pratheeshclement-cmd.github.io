import React, { useState, useEffect } from 'react';
import { Cpu, Search, Bot, Zap, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface CinematicHUDProps {
  scrollProgress: number; // 0.0 to 1.0
  onJumpToScene: (progress: number) => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
}

export const CinematicHUD: React.FC<CinematicHUDProps> = ({
  scrollProgress,
  onJumpToScene,
  onOpenAI,
  onOpenSearch
}) => {
  const [time, setTime] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scenes = [
    { title: 'Intro', prg: 0.05 },
    { title: 'Hero', prg: 0.15 },
    { title: 'About', prg: 0.28 },
    { title: 'Skills', prg: 0.42 },
    { title: 'Projects', prg: 0.55 },
    { title: 'Timeline', prg: 0.68 },
    { title: 'Services', prg: 0.80 },
    { title: 'Certs', prg: 0.90 },
    { title: 'Contact', prg: 0.97 }
  ];

  return (
    <>
      {/* Top OS Floating HUD Header Bar */}
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1240px',
          height: '50px',
          zIndex: 9900,
          backgroundColor: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '18px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px'
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #7F00FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={16} color="#000" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#FFF' }}>
            PORTFOLIO <span style={{ color: '#00F2FE' }}>OS X</span>
          </span>
        </div>

        {/* Scene Progress Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {scenes.map((s, idx) => {
            const isActive = Math.abs(scrollProgress - s.prg) < 0.07;
            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  onJumpToScene(s.prg);
                }}
                style={{
                  backgroundColor: isActive ? '#00F2FE' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#000' : '#94A3B8',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 12px #00F2FE' : 'none'
                }}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              sound.playClick();
              onOpenAI();
            }}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '10px' }}
          >
            <Bot size={14} /> AI Concierge
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSearch();
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFF',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={14} color="#00F2FE" /> Search (Cmd+K)
          </button>

          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#94A3B8' }}>{time}</span>
        </div>
      </header>

      {/* Floating Scroll Progress Bar at Bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '4px',
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          height: '100%',
          width: `${(scrollProgress * 100).toFixed(1)}%`,
          background: 'linear-gradient(90deg, #00F2FE 0%, #7F00FF 50%, #FF007F 100%)',
          boxShadow: '0 0 12px #00F2FE'
        }} />
      </div>
    </>
  );
};
