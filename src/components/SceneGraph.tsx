import React, { useEffect, useRef } from 'react';
import { director } from '../services/TransitionDirector';

interface SceneGraphProps {
  children: React.ReactNode;
  reducedMotion?: boolean;
}

export const SceneGraph: React.FC<SceneGraphProps> = ({ children, reducedMotion = false }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (sceneRef.current) {
        director.updateSceneParallax(sceneRef.current, e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        backgroundColor: '#07090E'
      }}
    >
      {/* 3D Camera Scene Container */}
      <div
        ref={sceneRef}
        id="os-scene-container"
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform, opacity, filter'
        }}
      >
        {children}
      </div>
    </div>
  );
};
