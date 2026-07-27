import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import { WORKSPACES } from '../data/pratheeshData';
import { WorkspaceConfig, WorkspaceId } from '../types';
import { sound } from '../utils/soundEffects';
import * as Icons from 'lucide-react';

interface OSDockProps {
  activeWorkspaceId: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
}

export const OSDock: React.FC<OSDockProps> = ({
  activeWorkspaceId,
  onSelectWorkspace
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dock slide up animation on mount
    if (dockRef.current) {
      anime({
        targets: dockRef.current,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }
  }, []);

  const getIcon = (iconName: string, color: string, isActive: boolean) => {
    const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[iconName] || Icons.Sparkles;
    return <IconComponent size={20} color={isActive ? '#FFF' : color} />;
  };

  // Calculate HarmonyOS style proximity scale for dock items
  const getItemScale = (idx: number) => {
    if (hoveredIdx === null) return 1;
    const distance = Math.abs(hoveredIdx - idx);
    if (distance === 0) return 1.22; // Target icon
    if (distance === 1) return 1.10; // Neighbor icons
    if (distance === 2) return 1.04;
    return 1;
  };

  return (
    <div
      ref={dockRef}
      style={{
        position: 'fixed',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        maxWidth: '96vw',
        overflowX: 'auto'
      }}
    >
      {WORKSPACES.map((ws: WorkspaceConfig, idx: number) => {
        const isActive = ws.id === activeWorkspaceId;
        const isHovered = hoveredIdx === idx;
        const scale = getItemScale(idx);

        return (
          <div
            key={ws.id}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => {
              sound.playWindowSwitch();
              onSelectWorkspace(ws.id);
            }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Hover Tooltip */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: '-44px',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                {ws.title}
                {ws.badge && (
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '0.65rem',
                    color: ws.accentColor,
                    fontWeight: 700
                  }}>
                    • {ws.badge}
                  </span>
                )}
              </div>
            )}

            {/* Dock Item Button with Proximity Magnification */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isActive 
                ? ws.accentColor 
                : isHovered 
                  ? 'rgba(255, 255, 255, 0.14)' 
                  : 'rgba(255, 255, 255, 0.05)',
              border: isActive 
                ? `1px solid ${ws.accentColor}` 
                : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `scale(${scale}) translateY(${isHovered ? '-6px' : '0px'})`,
              boxShadow: isActive 
                ? `0 0 24px ${ws.accentColor}90` 
                : isHovered 
                  ? '0 6px 15px rgba(0, 0, 0, 0.4)' 
                  : 'none'
            }}>
              {getIcon(ws.icon, ws.accentColor, isActive)}
            </div>

            {/* Active Indicator Dot */}
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: isActive ? ws.accentColor : 'transparent',
              marginTop: '4px',
              boxShadow: isActive ? `0 0 8px ${ws.accentColor}` : 'none',
              transition: 'all 0.2s ease'
            }} />
          </div>
        );
      })}
    </div>
  );
};
