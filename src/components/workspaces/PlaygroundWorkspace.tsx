import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { Gamepad2, Sparkles, Volume2, Move, RefreshCw } from 'lucide-react';

export const PlaygroundWorkspace: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleConfetti = () => {
    sound.playBootChime();
    setClickCount(prev => prev + 1);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F2FE', '#7F00FF', '#FF007F', '#10B981']
    });
  };

  const handleFrequencyTone = (freq: number) => {
    sound.playClick();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <Gamepad2 size={28} color="#F43F5E" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>INNOVATION PLAYGROUND</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Interactive particle physics, synthesized Web Audio frequencies, and micro-app experiments
            </p>
          </div>
        </div>

        <button onClick={handleConfetti} className="btn-primary">
          <Sparkles size={16} /> Celebrate Innovation! 🎉
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Interactive Sound Matrix */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={18} color="#00F2FE" /> SYNTHESIZER FREQUENCY MATRIX
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[261.63, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99, 880.00].map((freq, idx) => (
              <button
                key={idx}
                onClick={() => handleFrequencyTone(freq)}
                className="glass-card"
                style={{
                  height: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'JetBrains Mono',
                  color: '#00F2FE'
                }}
              >
                <span>{freq} Hz</span>
                <span style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '2px' }}>Tone {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Physics Trigger Box */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 900,
            fontFamily: 'Outfit',
            color: '#F43F5E',
            marginBottom: '10px'
          }}>
            {clickCount}
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>Confetti Triggers Fired</h4>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px', marginBottom: '20px' }}>
            Hardware-accelerated canvas particle physics engine.
          </p>
          <button onClick={handleConfetti} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            Fire Canvas Particles
          </button>
        </div>
      </div>
    </div>
  );
};
