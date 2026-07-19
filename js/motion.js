/* ==========================================================================
   PRATHEESH CLEMENT — MASTER MOTION ORCHESTRATOR  |  js/motion.js

   This script controls the dynamic, JS-driven layer of the motion system.
   CSS handles idle/repeating animations (GPU, no JS overhead).
   This file handles everything that REACTS to scroll, mouse, and viewport.

   SYSTEMS:
   1.  Float Oscillator         — CSS-class based harmonic float assignment
   2.  Scroll Velocity Engine   — detects speed + drives intensity
   3.  Background Morph         — per-section color temperature shift
   4.  3D Perspective Scroll    — depth shift as sections enter/exit
   5.  Section Cinematic Entry  — scale + blur entrance for each section
   6.  Service Card Numbers     — injects data-num attributes
   7.  Particle Injection       — injects CSS particles per section
   8.  Nav Scrolled Class       — glass morph when scrolled
   9.  Cursor Spotlight         — global radial cursor glow
   10. GPU Class Assignment     — will-change management
   11. Horizontal Scroll Hint   — keyboard/swipe for projects (optional)
   12. Loader Depth Effect      — parallax depth on loader elements
   ========================================================================== */

(function () {
    'use strict';

    /* ── Config ─────────────────────────────────────────────────────────── */
    const IS_TOUCH   = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_MOBILE  = window.matchMedia('(max-width: 1024px)').matches;

    /* ── Bootstrap: wait for cinematic-ready ────────────────────────────── */
    const init = () => {
        assignServiceNumbers();
        injectSectionParticles();
        initNavScrolled();
        initScrollVelocityEngine();
        initBackgroundMorph();
        initSectionCinematicEntry();
        initGPUClassAssignment();
        if (!IS_TOUCH && !IS_REDUCED) {
            initCursorSpotlight();
            initServicesGridPerspective();
            init3DScrollDepth();
        }
        initLoaderDepthEffect();
        initMobileFloatMagnitudes();
        initEcoOrbitalSpeed();
        initProjectCardTilt(!IS_TOUCH && !IS_REDUCED);
    };

    if (document.body.classList.contains('cinematic-ready')) {
        init();
    } else {
        const obs = new MutationObserver((_, o) => {
            if (document.body.classList.contains('cinematic-ready')) {
                o.disconnect(); init();
            }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    /* ══════════════════════════════════════════════════════════════════════
       1. FLOAT OSCILLATOR — Assigns harmonic float variants to elements
       Uses CSS classes .float-a through .float-e — no JS animation needed
       ══════════════════════════════════════════════════════════════════════ */

    // Float classes are defined in motion.css (.cardFloat1, etc.)
    // This function assigns CSS custom property --sd (stagger delay)
    // to any element that doesn't already have one
    function assignStaggerDelays(selector, step, start = 0) {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.style.getPropertyValue('--sd')) {
                el.style.setProperty('--sd', `${start + i * step}ms`);
            }
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       2. ASSIGN SERVICE CARD NUMBERS
       Injects data-num="01" etc. which CSS uses for ::before badges
       ══════════════════════════════════════════════════════════════════════ */
    function assignServiceNumbers() {
        document.querySelectorAll('.service-card').forEach((card, i) => {
            card.setAttribute('data-num', String(i + 1).padStart(2, '0'));
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       3. SECTION PARTICLE INJECTION
       Injects lightweight CSS particle dots into each section
       ══════════════════════════════════════════════════════════════════════ */
    function injectSectionParticles() {
        if (IS_REDUCED) return;

        const particleColors = [
            'rgba(0, 240, 255, 0.35)',
            'rgba(112, 0, 255, 0.3)',
            'rgba(255, 0, 127, 0.25)',
            'rgba(0, 240, 255, 0.2)',
        ];

        const sections = document.querySelectorAll('[data-scene]');
        const particlesPerSection = IS_MOBILE ? 5 : 10;

        sections.forEach(section => {
            const sectionRect = section; // relative positioning
            const frag = document.createDocumentFragment();

            for (let i = 0; i < particlesPerSection; i++) {
                const p = document.createElement('span');
                p.className = 'm-particle' + (Math.random() > 0.5 ? ' blink' : '');
                const size = 1 + Math.random() * 3;
                p.style.setProperty('--ps', `${size.toFixed(1)}px`);
                p.style.setProperty('--py', `${10 + Math.random() * 80}%`);
                p.style.setProperty('--px', `${5 + Math.random() * 90}%`);
                p.style.setProperty('--pd', `${7 + Math.random() * 8}s`);
                p.style.setProperty('--pdelay', `${-(Math.random() * 8).toFixed(1)}s`);
                p.style.setProperty('--po', `${(0.1 + Math.random() * 0.3).toFixed(2)}`);
                p.style.setProperty('--pb', `${2 + Math.random() * 3}s`);
                p.style.setProperty('--pc', particleColors[i % particleColors.length]);
                frag.appendChild(p);
            }
            section.appendChild(frag);
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       4. NAV SCROLLED CLASS
       Adds .scrolled class to trigger glass morph CSS animation
       ══════════════════════════════════════════════════════════════════════ */
    function initNavScrolled() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let ticking = false;
        const update = () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ══════════════════════════════════════════════════════════════════════
       5. SCROLL VELOCITY ENGINE
       Measures scroll speed — drives intensity of scroll-reactive effects
       Sets --scroll-velocity on :root for CSS to use
       ══════════════════════════════════════════════════════════════════════ */
    function initScrollVelocityEngine() {
        let lastScrollY = window.scrollY;
        let lastTime    = performance.now();
        let velocity    = 0;
        let ticking     = false;

        const update = () => {
            const now       = performance.now();
            const scrollY   = window.scrollY;
            const dt        = Math.max(now - lastTime, 1);
            const rawVel    = Math.abs(scrollY - lastScrollY) / dt;

            // Smooth the velocity
            velocity = velocity * 0.85 + rawVel * 0.15;
            const clamped = Math.min(1, velocity * 8); // normalize to 0-1

            document.documentElement.style.setProperty('--scroll-velocity', clamped.toFixed(3));

            lastScrollY = scrollY;
            lastTime    = now;
            ticking     = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
    }

    /* ══════════════════════════════════════════════════════════════════════
       6. BACKGROUND MORPH SYSTEM
       Changes the body background temperature based on the active section
       Smooth color crossfade via CSS transition on body
       ══════════════════════════════════════════════════════════════════════ */
    function initBackgroundMorph() {
        const morphMap = {
            home:         'rgba(5,  8,  22, 1)',
            about:        'rgba(6,  8,  24, 1)',
            services:     'rgba(5,  9,  22, 1)',
            projects:     'rgba(6,  7,  22, 1)',
            ecosystem:    'rgba(4,  8,  24, 1)',
            skills:       'rgba(5,  8,  23, 1)',
            experience:   'rgba(6,  8,  22, 1)',
            testimonials: 'rgba(5,  7,  22, 1)',
            audit:        'rgba(5,  9,  23, 1)',
            contact:      'rgba(4,  8,  24, 1)',
        };

        const sections = document.querySelectorAll('[data-scene]');
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const scene = entry.target.dataset.scene;
                    if (morphMap[scene]) {
                        document.documentElement.style.setProperty('--bg-morph', morphMap[scene]);
                        // Very subtle, non-jarring background shift
                        document.body.style.backgroundColor = morphMap[scene];
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(s => observer.observe(s));
    }

    /* ══════════════════════════════════════════════════════════════════════
       7. SECTION CINEMATIC ENTRY
       Each section "assembles" when it enters the viewport —
       children get staggered entrance based on their type
       ══════════════════════════════════════════════════════════════════════ */
    function initSectionCinematicEntry() {
        // Assign stagger delays to common child elements
        assignStaggerDelays('.service-card',     80,   0);
        assignStaggerDelays('.project-card',     120,  0);
        assignStaggerDelays('.skill-tag',        40,   0);
        assignStaggerDelays('.timeline-item',    100,  0);
        assignStaggerDelays('.testimonial-card', 80,   0);
        assignStaggerDelays('.metric-card',      70,   0);
        assignStaggerDelays('.contact-link-card',90,   0);
        assignStaggerDelays('.eco-features li',  60,   100);
        assignStaggerDelays('.audit-points li',  80,   500);
        assignStaggerDelays('.form-field',       60,   100);
        assignStaggerDelays('.hero-chip',        80,   800);
    }

    /* ══════════════════════════════════════════════════════════════════════
       8. GPU CLASS ASSIGNMENT
       Adds will-change and gpu-anim class to animated elements
       so browser can promote them to their own compositor layer
       ══════════════════════════════════════════════════════════════════════ */
    function initGPUClassAssignment() {
        const GPU_SELECTOR = [
            '.glass-card',
            '.h-float-card',
            '.hero-profile-card',
            '.skill-tag',
            '.eco-node',
            '.aurora-orb',
            '.m-particle',
            '.service-card',
            '.project-card',
            '.timeline-card',
            '.testimonial-card',
        ].join(', ');

        document.querySelectorAll(GPU_SELECTOR).forEach(el => {
            el.classList.add('gpu-anim');
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       9. CURSOR SPOTLIGHT (Desktop only)
       A radial glow that follows the cursor globally
       ══════════════════════════════════════════════════════════════════════ */
    function initCursorSpotlight() {
        // Create spotlight element
        const spotlight = document.createElement('div');
        spotlight.id = 'cursorSpotlight';
        spotlight.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle,
                rgba(0, 240, 255, 0.04) 0%,
                rgba(0, 240, 255, 0.02) 30%,
                transparent 70%
            );
            transition: opacity 0.5s ease;
            opacity: 0;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(spotlight);

        let raf = null;
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!raf) {
                raf = requestAnimationFrame(() => {
                    spotlight.style.left = `${mouseX}px`;
                    spotlight.style.top  = `${mouseY}px`;
                    spotlight.style.opacity = '1';
                    raf = null;
                });
            }
        });

        document.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       10. SERVICES GRID PERSPECTIVE TILT (Desktop only)
       Mouse position over the grid → subtle 3D tilt on the container
       ══════════════════════════════════════════════════════════════════════ */
    function initServicesGridPerspective() {
        const grid = document.querySelector('.services-grid');
        if (!grid) return;

        let raf = null;

        grid.addEventListener('mousemove', (e) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const rect = grid.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const rx   = ((e.clientY - cy) / (rect.height / 2)) * -2; // degrees
                const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  2;

                grid.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
                raf = null;
            });
        });

        grid.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            grid.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            grid.style.transform  = 'perspective(1200px) rotateX(0) rotateY(0)';
            setTimeout(() => grid.style.transition = '', 600);
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       11. 3D SCROLL DEPTH (Desktop only)
       As sections scroll, they get subtle Z-axis depth scale changes
       ══════════════════════════════════════════════════════════════════════ */
    function init3DScrollDepth() {
        const sections = document.querySelectorAll('[data-scene]');
        if (!sections.length) return;

        let ticking = false;
        const update = () => {
            const vh = window.innerHeight;
            const sy = window.scrollY;

            sections.forEach(section => {
                const top    = section.offsetTop;
                const h      = section.offsetHeight;
                const center = top + h / 2;
                const dist   = (sy + vh / 2) - center;
                const norm   = dist / (vh + h);
                const clamped = Math.max(-0.5, Math.min(0.5, norm));

                // Very subtle scale — only 0.97 to 1.00
                const scale = 1 - Math.abs(clamped) * 0.03;
                section.style.setProperty('--depth-scale', scale.toFixed(4));
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ══════════════════════════════════════════════════════════════════════
       12. LOADER DEPTH EFFECT
       Parallax on loader elements during loading screen
       ══════════════════════════════════════════════════════════════════════ */
    function initLoaderDepthEffect() {
        const loader = document.getElementById('loader');
        if (!loader || IS_TOUCH) return;

        document.addEventListener('mousemove', (e) => {
            if (!document.getElementById('loader') ||
                document.getElementById('loader').style.display === 'none') return;

            const cx = window.innerWidth  / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx; // -1 to 1
            const dy = (e.clientY - cy) / cy;

            const avatar  = loader.querySelector('.loader-avatar-wrap');
            const nameEl  = loader.querySelector('#loaderName');
            const roleEl  = loader.querySelector('#loaderRole');

            if (avatar) avatar.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`;
            if (nameEl) nameEl.style.transform  = `translate(${dx * -4}px, ${dy * -4}px)`;
            if (roleEl) roleEl.style.transform  = `translate(${dx * -2}px, ${dy * -2}px)`;
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       13. MOBILE FLOAT MAGNITUDES
       Adjusts CSS custom properties for mobile-appropriate motion
       ══════════════════════════════════════════════════════════════════════ */
    function initMobileFloatMagnitudes() {
        if (!IS_MOBILE) return;
        // Mobile still gets ALL animations — just slightly smaller magnitudes
        // Done via CSS media queries in motion.css — no JS needed here
        // This function is a hook for future config
    }

    /* ══════════════════════════════════════════════════════════════════════
       14. ECO ORBITAL SPEED VARIATION
       Dynamically updates orbital ring speeds based on section activity
       ══════════════════════════════════════════════════════════════════════ */
    function initEcoOrbitalSpeed() {
        const ecosystem = document.getElementById('ecosystem');
        if (!ecosystem) return;

        const o1 = ecosystem.querySelector('.eco-orbit.o1');
        const o2 = ecosystem.querySelector('.eco-orbit.o2');
        if (!o1 || !o2) return;

        const speedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    o1.style.animationDuration = '25s'; // faster when active
                    o2.style.animationDuration = '40s';
                } else {
                    o1.style.animationDuration = '50s'; // slow when offscreen
                    o2.style.animationDuration = '80s';
                }
            });
        }, { threshold: 0.3 });

        speedObserver.observe(ecosystem);
    }

    /* ══════════════════════════════════════════════════════════════════════
       15. PROJECT CARD 3D TILT
       Per-card mouse tracking → 3D tilt transform
       ══════════════════════════════════════════════════════════════════════ */
    function initProjectCardTilt(enabled) {
        if (!enabled) return;

        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            let raf = null;

            card.addEventListener('mousemove', (e) => {
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const cx   = rect.left + rect.width  / 2;
                    const cy   = rect.top  + rect.height / 2;
                    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -4;
                    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  4;

                    card.style.transform = `
                        translateY(-10px)
                        perspective(600px)
                        rotateX(${rx.toFixed(2)}deg)
                        rotateY(${ry.toFixed(2)}deg)
                        scale(1.02)
                    `;
                    raf = null;
                });
            });

            card.addEventListener('mouseleave', () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform  = '';
                setTimeout(() => {
                    card.style.transition = '';
                }, 600);
            });
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       UTILITY: Visible Rect Check
       ══════════════════════════════════════════════════════════════════════ */
    function isVisible(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }

})();
