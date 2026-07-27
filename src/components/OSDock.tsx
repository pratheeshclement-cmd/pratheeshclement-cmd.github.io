import React, { useState } from 'react';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getIcon = (iconName: string, color: string, isActive: boolean) => {
    const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[iconName] || Icons.Sparkles;
    return <IconComponent size={20} color={isActive ? '#FFF' : color} />;
  };

  return (
    <div style={{
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
    }}>
      {WORKSPACES.map((ws: WorkspaceConfig) => {
        const isActive = ws.id === activeWorkspaceId;
        const isHovered = ws.id === hoveredId;

        return (
          <div
            key={ws.id}
            onMouseEnter={() => setHoveredId(ws.id)}
            onMouseLeave={() => setHoveredId(null)}
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
              transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Hover Tooltip */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: '-42px',
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

            {/* Dock Item Button */}
            <div style={{
              width: isHovered ? '46px' : '40px',
              height: isHovered ? '46px' : '40px',
              borderRadius: '12px',
              backgroundColor: isActive 
                ? ws.accentColor 
                : isHovered 
                  ? 'rgba(255, 255, 255, 0.12)' 
                  : 'rgba(255, 255, 255, 0.05)',
              border: isActive 
                ? `1px solid ${ws.accentColor}` 
                : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
              boxShadow: isActive 
                ? `0 0 20px ${ws.accentColor}80` 
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
              boxShadow: isActive ? `0 0 8px ${ws.accentColor}` : 'none'
            }} />
          </div>
        );
      })}
    </div>
  );
};
