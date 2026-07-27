import React from 'react';
import { SystemSettings } from '../../types';
import { sound } from '../../utils/soundEffects';
import { Settings, Volume2, VolumeX, Eye, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

interface SettingsWorkspaceProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  settings,
  onUpdateSettings
}) => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(148, 163, 184, 0.15)', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
            <Settings size={28} color="#94A3B8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>PORTFOLIO OS X SYSTEM SETTINGS</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Control audio haptics, motion preferences, contrast modes, and visual glow density
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Audio Haptics Settings */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {settings.soundMuted ? <VolumeX size={24} color="#64748B" /> : <Volume2 size={24} color="#00F2FE" />}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>Web Audio Synthesizer</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Native UI click & transition frequencies</p>
            </div>
          </div>

          <button
            onClick={() => {
              const newMuted = sound.toggleMute();
              onUpdateSettings({ soundMuted: newMuted });
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {settings.soundMuted ? 'Unmute Audio Haptics' : 'Mute Audio Haptics'}
          </button>
        </div>

        {/* Motion & Reduced Motion Settings */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Sparkles size={24} color="#A855F7" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>Motion & Accessibility</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Respect user motion preferences</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ reducedMotion: !settings.reducedMotion });
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', borderColor: settings.reducedMotion ? '#A855F7' : 'rgba(255,255,255,0.1)' }}
          >
            {settings.reducedMotion ? 'Enable Spatial Motion' : 'Enable Reduced Motion Mode'}
          </button>
        </div>

        {/* Contrast & High Contrast Settings */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Eye size={24} color="#10B981" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>High Contrast Mode</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>WCAG AAA readability support</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ highContrast: !settings.highContrast });
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', borderColor: settings.highContrast ? '#10B981' : 'rgba(255,255,255,0.1)' }}
          >
            {settings.highContrast ? 'Standard Spatial Contrast' : 'Enable High Contrast Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
