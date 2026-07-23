/* ==========================================================================
   PRATHEESH CLEMENT — MASTER MOTION ORCHESTRATOR  |  js/motion.js

   Orchestrates viewport-triggered entries, spotlight effects, 3D tilts,
   magnetic springs, and the premium pinned horizontal scroll for projects.
   Highly optimized, RAF-bound, 60 FPS transition engine.
   ========================================================================== */

(function () {
    'use strict';

    /* ── Config & Device Detection ──────────────────────────────────────── */
    const IS_TOUCH   = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_MOBILE  = window.matchMedia('(max-width: 1024px)').matches;

    /* ── Bootstrap: wait for cinematic-ready loader signal ──────────────── */
    const init = () => {
        assignServiceNumbers();
        injectSectionParticles();
        initNavScrolled();
        initScrollVelocityEngine();
        initBackgroundMorph();
        initSectionCinematicEntry();
        initGPUClassAssignment();
    };

    if (document.body.classList.contains('cinematic-ready')) {
        init();
    } else {
        const obs = new MutationObserver((_, o) => {
            if (document.body.classList.contains('cinematic-ready')) {
                o.disconnect(); 
                init();
            }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    /* ══════════════════════════════════════════════════════════════════════
       1. STAGGER DELAY ASSIGNER
       Calculates and sets staggered animation delay variables
       ══════════════════════════════════════════════════════════════════════ */
    function assignStaggerDelays(selector, step, start = 0) {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.style.getPropertyValue('--sd')) {
                el.style.setProperty('--sd', `${start + i * step}ms`);
            }
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       2. ASSIGN SERVICE CARD NUMBERS
       Injects index digits for pseudo-element badges
       ══════════════════════════════════════════════════════════════════════ */
    function assignServiceNumbers() {
        document.querySelectorAll('.service-card').forEach((card, i) => {
            card.setAttribute('data-num', String(i + 1).padStart(2, '0'));
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       3. SUBDUED SECTION PARTICLE INJECTION
       Injects a minimal number (3) of slow-drifting background dots
       ══════════════════════════════════════════════════════════════════════ */
    function injectSectionParticles() {
        if (IS_REDUCED) return;

        const particleColors = [
            'rgba(0, 240, 255, 0.25)',
            'rgba(112, 0, 255, 0.2)',
            'rgba(255, 0, 127, 0.15)',
        ];

        const sections = document.querySelectorAll('[data-scene]');
        const particlesPerSection = 3; // Reduced to minimize distraction

        sections.forEach(section => {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < particlesPerSection; i++) {
                const p = document.createElement('span');
                p.className = 'm-particle' + (Math.random() > 0.6 ? ' blink' : '');
                const size = 1.2 + Math.random() * 2;
                p.style.setProperty('--ps', `${size.toFixed(1)}px`);
                p.style.setProperty('--py', `${15 + Math.random() * 70}%`);
                p.style.setProperty('--px', `${10 + Math.random() * 80}%`);
                p.style.setProperty('--pd', `${12 + Math.random() * 8}s`);
                p.style.setProperty('--pdelay', `${-(Math.random() * 10).toFixed(1)}s`);
                p.style.setProperty('--po', `${(0.15 + Math.random() * 0.2).toFixed(2)}`);
                p.style.setProperty('--pb', `${3 + Math.random() * 3}s`);
                p.style.setProperty('--pc', particleColors[i % particleColors.length]);
                frag.appendChild(p);
            }
            section.appendChild(frag);
        });
    }

    /* ══════════════════════════════════════════════════════════════════════
       4. NAV SCROLLED CLASS
       Adds scrolled style indicator on nav header on slide
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
            if (!ticking) { 
                ticking = true; 
                requestAnimationFrame(update); 
            }
        }, { passive: true });
        update();
    }

    /* ══════════════════════════════════════════════════════════════════════
       5. SCROLL VELOCITY ENGINE
       Derives real-time scroll velocity for blur / rotation skews
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

            velocity = velocity * 0.82 + rawVel * 0.18;
            const clamped = Math.min(1, velocity * 6);

            document.documentElement.style.setProperty('--scroll-velocity', clamped.toFixed(3));

            lastScrollY = scrollY;
            lastTime    = now;
            ticking     = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) { 
                ticking = true; 
                requestAnimationFrame(update); 
            }
        }, { passive: true });
    }

    /* ══════════════════════════════════════════════════════════════════════
       6. BACKGROUND MORPH SYSTEM
       Crossfades active background gradient on section change
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
                        document.body.style.backgroundColor = morphMap[scene];
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach(s => observer.observe(s));
    }

    /* ══════════════════════════════════════════════════════════════════════
       7. SECTION CINEMATIC ENTRY
       Stagger timings for viewport entrance
       ══════════════════════════════════════════════════════════════════════ */
    function initSectionCinematicEntry() {
        assignStaggerDelays('.service-card',        65,   0);
        assignStaggerDelays('.project-card',        100,  0);
        assignStaggerDelays('.skill-showcase-card', 75,   0);
        assignStaggerDelays('.skill-tag',           35,   0);
        assignStaggerDelays('.timeline-item',       90,   0);
        assignStaggerDelays('.testimonial-card',    75,   0);
        assignStaggerDelays('.metric-card',         60,   0);
        assignStaggerDelays('.contact-link-card',   80,   0);
        assignStaggerDelays('.eco-features li',     50,   100);
        assignStaggerDelays('.audit-points li',     70,   300);
        assignStaggerDelays('.form-field',          55,   80);
        assignStaggerDelays('.hero-chip',           60,   600);
    }

    /* ══════════════════════════════════════════════════════════════════════
       8. GPU COMPOSITING CLASS ASSIGNMENT
       ══════════════════════════════════════════════════════════════════════ */
    function initGPUClassAssignment() {
        const GPU_SELECTOR = [
            '.glass-card',
            '.h-float-card',
            '.hero-profile-card',
            '.skill-tag',
            '.skill-showcase-card',
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



})();

