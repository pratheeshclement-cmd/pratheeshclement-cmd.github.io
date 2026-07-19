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

        // Desktop only interactive features
        if (!IS_TOUCH && !IS_REDUCED) {
            initCursorSpotlight();
            initServicesGridPerspective();
            initProjectCardTilt(true);
        }
        
        initLoaderDepthEffect();
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
        assignStaggerDelays('.service-card',     65,   0);
        assignStaggerDelays('.project-card',     100,  0);
        assignStaggerDelays('.skill-tag',        35,   0);
        assignStaggerDelays('.timeline-item',    90,   0);
        assignStaggerDelays('.testimonial-card', 75,   0);
        assignStaggerDelays('.metric-card',      60,   0);
        assignStaggerDelays('.contact-link-card',80,   0);
        assignStaggerDelays('.eco-features li',  50,   100);
        assignStaggerDelays('.audit-points li',  70,   300);
        assignStaggerDelays('.form-field',       55,   80);
        assignStaggerDelays('.hero-chip',        60,   600);
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
       10. CURSOR SPOTLIGHT (Desktop only)
       ══════════════════════════════════════════════════════════════════════ */
    function initCursorSpotlight() {
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
       11. SERVICES GRID PERSPECTIVE TILT (Desktop only)
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
                const rx   = ((e.clientY - cy) / (rect.height / 2)) * -1.5;
                const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  1.5;

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
       13. LOADER DEPTH EFFECT
       ══════════════════════════════════════════════════════════════════════ */
    function initLoaderDepthEffect() {
        const loader = document.getElementById('loader');
        if (!loader || IS_TOUCH) return;

        document.addEventListener('mousemove', (e) => {
            if (!document.getElementById('loader') ||
                document.getElementById('loader').style.display === 'none') return;

            const cx = window.innerWidth  / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
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
       15. PROJECT CARD 3D TILT
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
                    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -3.5;
                    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  3.5;

                    card.style.transform = `
                        translateY(-8px)
                        perspective(600px)
                        rotateX(${rx.toFixed(2)}deg)
                        rotateY(${ry.toFixed(2)}deg)
                        scale(1.015)
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

})();
