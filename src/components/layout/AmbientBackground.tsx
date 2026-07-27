import React from 'react';

/**
 * AmbientBackground
 * Fixed full-screen layer with soft gradient orbs that create the
 * "premium luminous atmosphere" described in the design spec.
 * aria-hidden so it is invisible to screen readers.
 */
export const AmbientBackground: React.FC = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed', inset: 0, zIndex: -1,
      pointerEvents: 'none', overflow: 'hidden',
    }}
  >
    {/* Top-left — soft sky blue */}
    <div style={{
      position: 'absolute', top: '-20%', left: '-10%',
      width: '60vw', height: '60vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
      filter: 'blur(80px)',
    }} />

    {/* Top-right — soft lavender */}
    <div style={{
      position: 'absolute', top: '-10%', right: '-10%',
      width: '50vw', height: '50vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
      filter: 'blur(80px)',
    }} />

    {/* Bottom-center — soft mint */}
    <div style={{
      position: 'absolute', bottom: '-10%', left: '30%',
      width: '40vw', height: '40vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
      filter: 'blur(100px)',
    }} />
  </div>
);
