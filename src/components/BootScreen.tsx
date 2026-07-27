import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import { sound } from '../utils/soundEffects';
import { Cpu, ShieldCheck, Zap, Activity } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing PORTFOLIO OS X Kernel...');
  const [logs, setLogs] = useState<string[]>([]);
  
  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sound.playBootChime();

    // Anime.js cinematic camera zoom from 0.9 -> 1.0 and logo scale
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        scale: [0.9, 1.0],
        opacity: [0, 1],
        duration: 800,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }

    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        scale: [0.8, 1.0],
        opacity: [0, 1],
        duration: 600,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }

    // Rapid cinematic boot sequence (< 1.2s total duration)
    const bootSteps = [
      { prg: 25, msg: 'Loading Core System Architecture...', log: 'SYS_INIT: Memory check 64GB OK' },
      { prg: 50, msg: 'Verifying Pratheesh Clement Profile Data...', log: 'IDENTITY: BCA Degree (2024) Verified' },
      { prg: 75, msg: 'Mounting Google Skillshop & AI Modules...', log: 'CERT_AUTH: Google Digital Garage ID #453421024' },
      { prg: 100, msg: 'PORTFOLIO OS X Ready.', log: 'BOOT_SUCCESS: Launching Desktop Environment' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < bootSteps.length) {
        const step = bootSteps[stepIdx];
        setProgress(step.prg);
        setStatusMessage(step.msg);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.log}`]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onBootComplete();
        }, 150);
      }
    }, 220); // 220ms * 4 steps = 880ms total boot time

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#07090E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#F8FAFC'
      }}
    >
      {/* Background Matrix Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.15,
        backgroundImage: 'radial-gradient(#00F2FE 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none'
      }} />

      {/* Main Logo & Title */}
      <div ref={logoRef} style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <div style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 20px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #00F2FE 0%, #7F00FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 50px rgba(0, 242, 254, 0.4)',
          position: 'relative'
        }}>
          <Cpu size={48} color="#000" />
        </div>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #FFF 0%, #00F2FE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          PORTFOLIO OS X
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '6px', letterSpacing: '0.1em' }}>
          PRATHEESH CLEMENT • MASTER EDITION 1.0
        </p>
      </div>

      {/* Progress Container */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
          <span style={{ color: '#00F2FE', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} /> {statusMessage}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#94A3B8' }}>{progress}%</span>
        </div>

        {/* Progress Bar Track */}
        <div style={{
          height: '8px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00F2FE 0%, #7F00FF 100%)',
            transition: 'width 0.2s ease',
            boxShadow: '0 0 15px #00F2FE'
          }} />
        </div>

        {/* Diagnostic Logs */}
        <div style={{
          height: '70px',
          overflowY: 'auto',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: '#64748B',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: idx === logs.length - 1 ? '#10B981' : '#64748B' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Specs */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '20px',
        fontSize: '0.8rem',
        color: '#64748B',
        position: 'relative',
        zIndex: 2
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#10B981" /> HarmonyOS Spatial Motion Engine
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={14} color="#00F2FE" /> Target Lighthouse 100
        </span>
      </div>
    </div>
  );
};
