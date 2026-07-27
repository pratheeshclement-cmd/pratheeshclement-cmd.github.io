import React from 'react';
import { SceneProps } from '../../types';

// Full implementation in Phase 6-8
const TestimonialsScene: React.FC<Partial<SceneProps>> = ({ id }) => (
  <section id={id} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
    <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Testimonials</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>Coming soon — Phase implementation pending.</p>
    </div>
  </section>
);

export default TestimonialsScene;
