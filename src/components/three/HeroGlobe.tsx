import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * HeroGlobe — interactive Three.js particle sphere.
 * Lazy loaded, mouse-reactive, no canvas resize jank.
 */
const HeroGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth  || 600;
    const H = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Sphere particle system
    const COUNT = 3000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const palette   = [
      new THREE.Color(0x3B82F6),
      new THREE.Color(0x0EA5E9),
      new THREE.Color(0x8B5CF6),
      new THREE.Color(0xC7D7FD),
      new THREE.Color(0xFFFFFF),
    ];

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere distribution
      const phi   = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1 + (Math.random() - 0.5) * 0.15;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const globe = new THREE.Points(geo, mat);
    scene.add(globe);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      globe.rotation.x += 0.0005;
      globe.rotation.y += (mouseX * 0.3 - globe.rotation.y) * 0.02;
      globe.rotation.x += (-mouseY * 0.2 - globe.rotation.x) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ width: 'min(600px, 90vw)', height: 'min(600px, 90vw)', flexShrink: 0 }}
    />
  );
};

export default HeroGlobe;
