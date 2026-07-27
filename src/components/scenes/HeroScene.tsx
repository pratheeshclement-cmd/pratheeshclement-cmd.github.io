import React from 'react';
import { SceneProps } from '../../types';

// Full implementation in Phase 5
const HeroScene: React.FC<Partial<SceneProps>> = ({ id }) => (
  <section id={id} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--text-primary)' }}>
      PRATHEESH CLEMENT
    </h1>
  </section>
);

export default HeroScene;
