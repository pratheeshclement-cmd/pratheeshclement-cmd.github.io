import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import { sound } from '../utils/soundEffects';
import { Minus, Square, X, Sparkles } from 'lucide-react';

interface OSWindowFrameProps {
  title: string;
  badge?: string;
  accentColor?: string;
  isActive: boolean;
  onFocus: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  children: React.ReactNode;
}

export const OSWindowFrame: React.FC<OSWindowFrameProps> = ({
  title,
  badge,
  accentColor = '#00F2FE',
  isActive,
  onFocus,
  onClose,
  onMinimize,
  children
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Window spring open animation
    if (windowRef.current) {
      anime({
        targets: windowRef.current,
        scale: [0.95, 1.0],
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }
  }, []);

  const handleToggleMaximize = () => {
    sound.playClick();
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={windowRef}
      onClick={onFocus}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxWidth: isMaximized ? '100%' : '1240px',
        margin: '0 auto',
        borderRadius: isMaximized ? '0px' : '24px',
        backgroundColor: isActive ? 'rgba(11, 16, 26, 0.88)' : 'rgba(9, 13, 21, 0.75)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: isActive
          ? `1px solid ${accentColor}50`
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isActive
          ? `0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px ${accentColor}20, inset 0 1px 0 rgba(255, 255, 255, 0.15)`
          : '0 15px 40px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Desktop OS Window Header Bar */}
      <div style={{
        height: '42px',
        padding: '0 16px',
        backgroundColor: isActive ? 'rgba(18, 26, 42, 0.9)' : 'rgba(13, 18, 28, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none'
      }}>
        {/* macOS / HarmonyOS Control Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              if (onClose) onClose();
            }}
            title="Close Window"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#FF5F56',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(255, 95, 86, 0.5)'
            }}
          >
            <X size={8} color="#000" style={{ opacity: 0.7 }} />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              if (onMinimize) onMinimize();
            }}
            title="Minimize Window"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#FFBD2E',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(255, 189, 46, 0.5)'
            }}
          >
            <Minus size={8} color="#000" style={{ opacity: 0.7 }} />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMaximize();
            }}
            title="Maximize Window"
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#27C93F',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(39, 201, 63, 0.5)'
            }}
          >
            <Square size={6} color="#000" style={{ opacity: 0.7 }} />
          </div>
        </div>

        {/* Window Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: isActive ? '#FFF' : '#94A3B8' }}>
          <Sparkles size={14} color={accentColor} />
          <span>{title}</span>
          {badge && (
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}40`,
              fontWeight: 700
            }}>
              {badge}
            </span>
          )}
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: isActive ? accentColor : '#64748B' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isActive ? accentColor : '#64748B',
            boxShadow: isActive ? `0 0 8px ${accentColor}` : 'none'
          }} />
          <span>{isActive ? 'Active Window' : 'Background'}</span>
        </div>
      </div>

      {/* Window Viewport Content Area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};
