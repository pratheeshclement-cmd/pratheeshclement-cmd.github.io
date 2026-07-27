import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { sound } from '../../utils/soundEffects';
import { Wand2, Play, Pause, RefreshCw, Layers, Sparkles } from 'lucide-react';

export const CreativeTechWorkspace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particleCount, setParticleCount] = useState(60);
  const [activePreset, setActivePreset] = useState<'cyber' | 'galaxy' | 'matrix'>('cyber');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 360);

    const particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = [];

    const colors = activePreset === 'cyber' 
      ? ['#00F2FE', '#7F00FF', '#38BDF8'] 
      : activePreset === 'galaxy'
        ? ['#EC4899', '#8B5CF6', '#F43F5E']
        : ['#10B981', '#00F2FE', '#34D399'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 1 - dist / 90;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, particleCount, activePreset]);

  const triggerPulseEffect = () => {
    sound.playClick();
    anime({
      targets: '.spatial-card-anim',
      scale: [1, 1.04, 1],
      rotate: () => anime.random(-3, 3),
      duration: 600,
      easing: 'easeInOutQuad'
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255, 0, 127, 0.15)', border: '1px solid rgba(255, 0, 127, 0.3)' }}>
            <Wand2 size={28} color="#FF007F" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>CREATIVE TECHNOLOGY STUDIO</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              HarmonyOS spatial navigation philosophy & physics-driven Anime.js animations
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsPlaying(!isPlaying)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause Motion' : 'Play Motion'}
          </button>
          <button onClick={triggerPulseEffect} className="btn-primary" style={{ fontSize: '0.8rem' }}>
            <Sparkles size={14} /> Pulse Spatial Cards
          </button>
        </div>
      </div>

      {/* Particle Canvas Display */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>GENERATIVE PARTICLE ENGINE</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['cyber', 'galaxy', 'matrix'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => { sound.playClick(); setActivePreset(preset); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: activePreset === preset ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: activePreset === preset ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.04)',
                  color: activePreset === preset ? '#00F2FE' : '#94A3B8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: '360px', borderRadius: '14px', overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Spatial 3D Interactive Cards */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
          CONNECTED MOTION & CONTINUITY CARDS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="glass-card spatial-card-anim" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Layers size={20} color="#00F2FE" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Shared Element Motion</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Every window transition preserves element spatial continuity without layout jumps or page unmount flickering.
            </p>
          </div>

          <div className="glass-card spatial-card-anim" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sparkles size={20} color="#7F00FF" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Anime.js Timeline Physics</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Physics-inspired motion curves (`cubic-bezier(0.25, 1, 0.5, 1)`) deliver fluid response for every touch or mouse drag.
            </p>
          </div>

          <div className="glass-card spatial-card-anim" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Wand2 size={20} color="#FF007F" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>Audio-Visual Haptics</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Web Audio API synthesized sound frequencies react dynamically to user actions, providing native application feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
