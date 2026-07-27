import React, { useState, useEffect } from 'react';
import { WorkspaceConfig, WorkspaceId } from '../types';
import { sound } from '../utils/soundEffects';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Maximize2, 
  Minimize2, 
  Clock, 
  CheckCircle2,
  Briefcase,
  Search,
  Settings
} from 'lucide-react';

interface OSHeaderBarProps {
  activeWorkspace: WorkspaceConfig;
  onToggleRecruiterBar: () => void;
  recruiterBarOpen: boolean;
  onOpenSearch: () => void;
  onNavigate: (id: WorkspaceId) => void;
}

export const OSHeaderBar: React.FC<OSHeaderBarProps> = ({
  activeWorkspace,
  onToggleRecruiterBar,
  recruiterBarOpen,
  onOpenSearch,
  onNavigate
}) => {
  const [time, setTime] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header style={{
      height: '48px',
      backgroundColor: 'rgba(11, 14, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 9000,
      position: 'relative'
    }}>
      {/* Left OS Brand & Active Workspace */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => onNavigate('welcome')}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #7F00FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0, 242, 254, 0.4)'
          }}>
            <Sparkles size={14} color="#000" />
          </div>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            color: '#F8FAFC'
          }}>
            PORTFOLIO <span style={{ color: '#00F2FE' }}>OS X</span>
          </span>
        </div>

        <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

        {/* Current Workspace Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: activeWorkspace.accentColor }}>
            {activeWorkspace.title}
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: '#64748B',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '2px 8px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            {activeWorkspace.subtitle}
          </span>
        </div>
      </div>

      {/* Right Controls & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Global Search Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSearch();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#94A3B8',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Search size={13} color="#00F2FE" />
          <span>Search</span>
          <kbd style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '4px', color: '#FFF' }}>⌘K</kbd>
        </button>

        {/* Recruiter Mode Button */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleRecruiterBar();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            border: recruiterBarOpen ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.12)',
            backgroundColor: recruiterBarOpen ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: recruiterBarOpen ? '#00F2FE' : '#F8FAFC',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Briefcase size={14} />
          {recruiterBarOpen ? 'Close Summary' : '⚡ 60s Recruiter Mode'}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('settings');
          }}
          title="OS Settings"
          style={{
            background: 'none',
            border: 'none',
            color: activeWorkspace.id === 'settings' ? '#00F2FE' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Settings size={17} />
        </button>

        {/* Mute Button */}
        <button
          onClick={handleMuteToggle}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          style={{
            background: 'none',
            border: 'none',
            color: isMuted ? '#64748B' : '#00F2FE',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreenToggle}
          title="Toggle Fullscreen"
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          color: '#F8FAFC',
          fontWeight: 600,
          marginLeft: '4px'
        }}>
          <Clock size={14} color="#00F2FE" />
          {time}
        </div>
      </div>
    </header>
  );
};
