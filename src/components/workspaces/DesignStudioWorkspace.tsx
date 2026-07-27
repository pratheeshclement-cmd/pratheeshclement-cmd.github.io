import React, { useState } from 'react';
import { sound } from '../../utils/soundEffects';
import { Palette, Sliders, Type, Layers, Eye, Copy, Check } from 'lucide-react';

export const DesignStudioWorkspace: React.FC = () => {
  const [blurVal, setBlurVal] = useState(24);
  const [opacityVal, setOpacityVal] = useState(75);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const colors = [
    { name: 'Cyber Cyan', hex: '#00F2FE', usage: 'Primary Glow & Links' },
    { name: 'Neon Violet', hex: '#7F00FF', usage: 'Secondary Accent & Badges' },
    { name: 'Luxury Pink', hex: '#FF007F', usage: 'Creative Highlights' },
    { name: 'Emerald Clean', hex: '#10B981', usage: 'Status & 100 Audit Scores' },
    { name: 'Obsidian Primary', hex: '#07090E', usage: 'OS Background Canvas' },
    { name: 'Glass Surface', hex: 'rgba(15,22,36,0.75)', usage: 'Spatial Panels' }
  ];

  const handleCopy = (text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Workspace Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
            <Palette size={28} color="#00E5FF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>DESIGN STUDIO & TOKENS</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Inspect design variables, luxury color palette, glassmorphism physics, and typography scale
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Glassmorphism Laboratory */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#00F2FE" /> GLASSMORPHISM BACKDROP FILTER ENGINE
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', alignItems: 'center' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Backdrop Blur Radius:</span>
                <span style={{ color: '#00F2FE', fontFamily: 'JetBrains Mono' }}>{blurVal}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={blurVal}
                onChange={(e) => setBlurVal(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00F2FE' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Surface Opacity:</span>
                <span style={{ color: '#7F00FF', fontFamily: 'JetBrains Mono' }}>{opacityVal}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={opacityVal}
                onChange={(e) => setOpacityVal(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#7F00FF' }}
              />
            </div>

            <div style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: '14px',
              borderRadius: '12px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.78rem',
              color: '#10B981',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              background: rgba(15, 22, 36, {opacityVal / 100});<br />
              backdrop-filter: blur({blurVal}px);<br />
              border: 1px solid rgba(255, 255, 255, 0.08);
            </div>
          </div>

          {/* Live Preview Box */}
          <div style={{
            height: '200px',
            borderRadius: '20px',
            background: `rgba(15, 22, 36, ${opacityVal / 100})`,
            backdropFilter: `blur(${blurVal}px)`,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#00F2FE',
              filter: 'blur(30px)',
              opacity: 0.5,
              top: '-20px',
              left: '-20px'
            }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', position: 'relative', zIndex: 2 }}>
              Dynamic Spatial Glass
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px', position: 'relative', zIndex: 2 }}>
              Real-time rendering of hardware-accelerated backdrop blur.
            </p>
          </div>
        </div>
      </div>

      {/* Color Palette Tokens */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
          CURATED LUXURY PALETTE & TOKENS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {colors.map((c) => (
            <div
              key={c.name}
              onClick={() => handleCopy(c.hex)}
              className="glass-card"
              style={{ padding: '16px', cursor: 'pointer', textAlign: 'center' }}
            >
              <div style={{
                height: '60px',
                borderRadius: '12px',
                backgroundColor: c.hex.includes('rgba') ? '#0D111A' : c.hex,
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '10px',
                boxShadow: `0 4px 15px ${c.hex}30`
              }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{c.name}</div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: '#00F2FE', marginTop: '2px' }}>
                {copiedToken === c.hex ? <Check size={12} /> : c.hex}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px' }}>{c.usage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
