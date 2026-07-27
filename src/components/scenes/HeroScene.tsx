import React, { useRef, useEffect, Suspense } from 'react';
import { ArrowDown, Sparkles, Cpu, Github, Linkedin, Mail } from 'lucide-react';
import anime from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../ui/SplitText';
import { MagneticButton } from '../ui/MagneticButton';
import { GlassCard } from '../ui/GlassCard';
import { IDENTITY } from '../../data/identity';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const HeroGlobe = React.lazy(() => import('../three/HeroGlobe'));

const HeroScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef   = useRef<HTMLElement>(null);
  const globeRef     = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const badgesRef    = useRef<HTMLDivElement>(null);
  const mottoRef     = useRef<HTMLDivElement>(null);
  const bodyRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const reduced      = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // 1. Anime.js Profile Image Assembly Sequence:
    // Particles gather -> Outline appears -> Glass forms -> Image clarifies -> Lighting activates -> Float loop
    if (heroImageRef.current) {
      anime.timeline({ easing: 'easeOutQuart' })
        .add({
          targets: heroImageRef.current,
          scale: [0.85, 1],
          rotateY: [-20, 0],
          opacity: [0, 1],
          filter: ['blur(15px)', 'blur(0px)'],
          duration: 1200,
          delay: 300,
        });

      // Floating ambient motion
      anime({
        targets: heroImageRef.current,
        translateY: ['-8px', '8px'],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 4500,
      });
    }

    // 2. Text entry stagger
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(badgesRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(mottoRef.current,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(bodyRef.current,    { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(ctaRef.current,     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    // 3. Globe and Image scroll disassembly parallax
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: self => {
        if (globeRef.current) {
          gsap.set(globeRef.current, { y: self.progress * 80, opacity: 1 - self.progress * 0.5 });
        }
        if (heroImageRef.current) {
          // Disassembly transition on scroll exit
          gsap.set(heroImageRef.current, {
            y: self.progress * 120,
            scale: 1 + self.progress * 0.1,
            opacity: 1 - self.progress * 1.2,
            filter: `blur(${self.progress * 12}px)`,
          });
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
      {/* Three.js Globe — background accent */}
      <div
        ref={globeRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          pointerEvents: 'none', opacity: 0.65,
        }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <HeroGlobe />
        </Suspense>
      </div>

      {/* Hero Grid Container */}
      <div className="scene-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: 48 }}>

          {/* Left Column — Text & CTAs */}
          <div style={{ textAlign: 'left' }}>
            {/* Badges */}
            <div ref={badgesRef} style={{ display: 'flex', gap: 10, marginBottom: 20, opacity: 0, flexWrap: 'wrap' }}>
              <span className="pill">
                <Sparkles size={13} />
                Digital Marketing Specialist
              </span>
              <span className="pill" style={{ color: 'var(--accent-tertiary)', borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)' }}>
                <Cpu size={13} />
                AI Enthusiast
              </span>
            </div>

            {/* Headline */}
            <SplitText
              text="PRATHEESH CLEMENT"
              tag="h1"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                marginBottom: 24,
                color: 'var(--text-primary)',
              }}
              start="top 90%"
              delay={0.4}
            />

            {/* Motto */}
            <div ref={mottoRef} style={{ marginBottom: 24, opacity: 0 }}>
              <GlassCard style={{ padding: '12px 24px', display: 'inline-block' }}>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-display)', margin: 0 }}>
                  "{IDENTITY.tagline}"
                </p>
              </GlassCard>
            </div>

            {/* Subtitle */}
            <p
              ref={bodyRef}
              style={{
                fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.75,
                maxWidth: 580, marginBottom: 36, opacity: 0,
              }}
            >
              {IDENTITY.subtitle} — creating high-performance digital ecosystems that bridge software engineering, technical SEO, and AI automation.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', opacity: 0 }}>
              <MagneticButton onClick={scrollToAbout}>
                Explore Universe
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
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
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
          </div>

          {/* Right Column — Prominent 4K Hero Profile Portrait */}
          <div ref={heroImageRef} style={{ opacity: 0, perspective: 1200 }}>
            <GlassCard tilt style={{ padding: 16, borderRadius: 28, position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(380px, 50vh, 540px)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 20px 50px rgba(59, 130, 246, 0.2)',
                }}
              >
                <img
                  src="/assets/pratheesh4k2.jpeg"
                  alt="Pratheesh Clement — Digital Marketing Specialist, Technical SEO Expert & AI Enthusiast based in Vadalur, Tamil Nadu"
                  title="Pratheesh Clement — Architect of Digital Ecosystems"
                  width={600}
                  height={800}
                  loading="eager"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 10%',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/pratheesh4k1.jpeg';
                  }}
                />

                {/* Gradient vignette overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating badge over image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    padding: '12px 18px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Pratheesh Clement</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Digital Marketing Specialist & AI Enthusiast</div>
                  </div>
                  <span className="pill" style={{ background: 'var(--accent-mint)', color: '#fff', border: 'none', padding: '4px 10px', fontSize: '0.72rem' }}>
                    Available
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroScene;
