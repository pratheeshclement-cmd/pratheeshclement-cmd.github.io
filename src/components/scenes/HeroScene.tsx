import React, { useRef, useEffect, Suspense } from 'react';
import { ArrowDown, Sparkles, Cpu, Github, Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../ui/SplitText';
import { MagneticButton } from '../ui/MagneticButton';
import { GlassCard } from '../ui/GlassCard';
import { IDENTITY } from '../../data/identity';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const HeroGlobe = React.lazy(() => import('../three/HeroGlobe'));

const HeroScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef   = useRef<HTMLDivElement>(null);
  const badgesRef  = useRef<HTMLDivElement>(null);
  const mottoRef   = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // Hero entry — stagger all elements in
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(badgesRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(mottoRef.current,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(bodyRef.current,    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(ctaRef.current,     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    // Globe parallax on scroll
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: self => {
        if (globeRef.current) {
          gsap.set(globeRef.current, { y: self.progress * 80, opacity: 1 - self.progress * 0.5 });
        }
      },
    });

    return () => { tl.kill(); st.kill(); };
  }, [reduced]);

  const scrollToAbout = () => {
    document.getElementById('scene-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="scene"
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
      aria-label="Hero section"
    >
      {/* Three.js Globe — absolute positioned behind content */}
      <div
        ref={globeRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          pointerEvents: 'none', opacity: 0.7,
        }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <HeroGlobe />
        </Suspense>
      </div>

      {/* Content */}
      <div className="scene-inner" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Profile Avatar Badge with Glowing Pulse Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <GlassCard tilt style={{ padding: 6, borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 12, paddingRight: 18 }}>
            <div style={{
              position: 'relative',
              width: 52,
              height: 52,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
            }}>
              <img
                src="/assets/pratheesh4k1.jpeg"
                alt="Pratheesh Clement"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 10, height: 10, borderRadius: '50%',
                background: 'var(--accent-mint)',
                boxShadow: '0 0 8px var(--accent-mint)',
              }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{IDENTITY.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{IDENTITY.title}</div>
            </div>
          </GlassCard>
        </div>

        {/* Badges */}
        <div ref={badgesRef} style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28, opacity: 0 }}>
          <span className="pill">
            <Sparkles size={13} />
            Digital Marketing Specialist
          </span>
          <span className="pill" style={{ color: 'var(--accent-tertiary)', borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)' }}>
            <Cpu size={13} />
            AI Enthusiast
          </span>
        </div>

        {/* Headline — SplitText char reveal */}
        <SplitText
          text="PRATHEESH CLEMENT"
          tag="h1"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: 28,
            color: 'var(--text-primary)',
          }}
          start="top 90%"
          delay={0.6}
        />

        {/* Motto */}
        <div ref={mottoRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, opacity: 0 }}>
          <GlassCard style={{ padding: '12px 28px', display: 'inline-block' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-display)', margin: 0 }}>
              "{IDENTITY.tagline}"
            </p>
          </GlassCard>
        </div>

        {/* Body copy */}
        <p
          ref={bodyRef}
          style={{
            fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.75,
            maxWidth: 640, margin: '0 auto 40px', opacity: 0,
          }}
        >
          {IDENTITY.subtitle} — creating digital ecosystems that combine outstanding user experiences with measurable business growth.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
          <MagneticButton onClick={scrollToAbout}>
            Explore the Universe
            <ArrowDown size={18} />
          </MagneticButton>
          <MagneticButton
            variant="secondary"
            as="a"
            href={`mailto:${IDENTITY.contact.email}`}
          >
            <Mail size={16} />
            Let's Talk
          </MagneticButton>
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
          {[
            { href: IDENTITY.social.github, icon: Github, label: 'GitHub profile' },
            { href: IDENTITY.social.linkedin, icon: Linkedin, label: 'LinkedIn profile' },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', textDecoration: 'none',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          aria-hidden="true"
        >
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--accent-primary), transparent)' }} />
          Scroll
        </div>
      </div>
    </section>
  );
};

export default HeroScene;
