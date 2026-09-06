import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AINetworkCanvasProps {
  isOpen: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'core' | 'service' | 'analytics';
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const AINetworkCanvas: React.FC<AINetworkCanvasProps> = ({ isOpen }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isMobile = false;

    // Palette: subtle, technical, high-contrast background
    const COLORS = {
      core: 'rgba(59, 130, 246, 0.4)',      // Primary Blue
      service: 'rgba(139, 92, 246, 0.35)',   // Violet / Digital Architecture
      analytics: 'rgba(16, 185, 129, 0.35)', // Mint / SEO Signals
      pulse: 'rgba(14, 165, 233, 0.7)',     // Active data packet
    };

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const setupCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      isMobile = width <= 640;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Node budget: 26-32 on desktop, 12-14 on mobile
      const nodeCount = isMobile ? 14 : 28;
      nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const type: 'core' | 'service' | 'analytics' =
          i % 5 === 0 ? 'core' : i % 2 === 0 ? 'service' : 'analytics';
        const radius = type === 'core' ? 2.4 : type === 'service' ? 1.9 : 1.5;
        const speed = isMobile ? 0.15 : 0.22;

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius,
          color: COLORS[type],
          type,
        });
      }

      pulses = [];
    };

    setupCanvas();

    const maxDist = isMobile ? 65 : 95;
    const maxDistSq = maxDist * maxDist;

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // If reduced motion is preferred, render once and stop
    if (reducedMotion) {
      renderStatic();
      return;
    }

    let lastPulseTime = performance.now();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Move nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 4) {
          node.x = 4;
          node.vx *= -1;
        } else if (node.x > width - 4) {
          node.x = width - 4;
          node.vx *= -1;
        }

        if (node.y < 4) {
          node.y = 4;
          node.vy *= -1;
        } else if (node.y > height - 4) {
          node.y = height - 4;
          node.vy *= -1;
        }
      }

      // 2. Connect nearby nodes
      const activePairs: [number, number][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            activePairs.push([i, j]);
          }
        }
      }

      // 3. Occasionally generate a subtle data pulse along an edge (every ~1.2s, max 3 pulses)
      if (time - lastPulseTime > 1200 && pulses.length < (isMobile ? 2 : 4) && activePairs.length > 0) {
        const randomPair = activePairs[Math.floor(Math.random() * activePairs.length)];
        pulses.push({
          fromIndex: randomPair[0],
          toIndex: randomPair[1],
          progress: 0,
          speed: isMobile ? 0.015 : 0.02,
          color: COLORS.pulse,
        });
        lastPulseTime = time;
      }

      // 4. Update & render data pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const n1 = nodes[pulse.fromIndex];
        const n2 = nodes[pulse.toIndex];
        if (!n1 || !n2) {
          pulses.splice(p, 1);
          continue;
        }

        const px = n1.x + (n2.x - n1.x) * pulse.progress;
        const py = n1.y + (n2.y - n1.y) * pulse.progress;

        ctx.fillStyle = pulse.color;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = null;
        }
      } else if (!animFrameIdRef.current && !reducedMotion) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize handling
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvas();
        if (reducedMotion) renderStatic();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isOpen, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
