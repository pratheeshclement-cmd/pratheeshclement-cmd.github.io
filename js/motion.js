/* ==========================================================================
   PRATHEESH CLEMENT — MASTER MOTION ORCHESTRATOR  |  js/motion.js
   ========================================================================== */

(function () {
    'use strict';

    const IS_TOUCH   = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const IS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const init = () => {
        initDeviceCapabilityCheck();
        assignServiceNumbers();
        injectSectionParticles();
        initNavScrolled();
        initScrollVelocityEngine();
        initBackgroundMorph();
        initGPUClassAssignment();
        if (!IS_REDUCED) {
            initMagneticButtons();
            initSpotlightTracking();
            initAvatarTilt();
        }
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

    /* ── 0. LOW-END DEVICE HARDWARE ADAPTATION ──────────────────────────── */
    function initDeviceCapabilityCheck() {
        const concurrency = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        if (concurrency <= 2 || memory <= 2) {
            document.body.classList.add('low-motion');
        }
    }

    /* ── 1. SERVICE CARD INDEX NUMBERS ─────────────────────────────────── */
    function assignServiceNumbers() {
        document.querySelectorAll('.service-card').forEach((card, i) => {
            card.setAttribute('data-num', String(i + 1).padStart(2, '0'));
        });
    }

    /* ── 2. SUBDUED SECTION PARTICLES ──────────────────────────────────── */
    function injectSectionParticles() {
        if (IS_REDUCED) return;

        const particleColors = [
            'rgba(0, 240, 255, 0.25)',
            'rgba(112, 0, 255, 0.2)',
            'rgba(255, 0, 127, 0.15)',
        ];

        const sections = document.querySelectorAll('[data-scene]');
        sections.forEach(section => {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < 3; i++) {
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

    /* ── 3. NAV SCROLLED CLASS ─────────────────────────────────────────── */
    function initNavScrolled() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        let ticking = false;
        const update = () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
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

    /* ── 4. SCROLL VELOCITY ENGINE ─────────────────────────────────────── */
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

    /* ── 5. BACKGROUND MORPH SYSTEM ────────────────────────────────────── */
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

    /* ── 6. GPU COMPOSITING PROMOTION ──────────────────────────────────── */
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
            '.btn'
        ].join(', ');

        document.querySelectorAll(GPU_SELECTOR).forEach(el => {
            el.classList.add('gpu-anim');
        });
    }

    /* ── 7. MAGNETIC BUTTON HOVER PHYSICS ─────────────────────────────── */
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-link-card');
        buttons.forEach(btn => {
            const handleMove = (e) => {
                if (e.pointerType === 'touch') return;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0) scale(1.02)`;
            };

            const handleReset = () => {
                btn.style.transform = '';
            };

            btn.addEventListener('pointermove', handleMove, { passive: true });
            btn.addEventListener('pointerleave', handleReset, { passive: true });
            btn.addEventListener('pointercancel', handleReset, { passive: true });
        });
    }

    /* ── 8. CARD SPOTLIGHT CURSOR/POINTER TRACKING ───────────────────── */
    function initSpotlightTracking() {
        const cards = document.querySelectorAll('.glass-card, .project-card, .service-card, .testimonial-card');
        cards.forEach(card => {
            const updateCoords = (clientX, clientY) => {
                const rect = card.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            };

            card.addEventListener('pointermove', (e) => {
                updateCoords(e.clientX, e.clientY);
            }, { passive: true });

            card.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) {
                    updateCoords(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
        });
    }

    /* ── 9. AVATAR 3D PERSPECTIVE TILT ───────────────────────────────── */
    function initAvatarTilt() {
        const avatarBox = document.querySelector('.avatar-box, .hero-profile-wrapper');
        if (!avatarBox) return;

        const handleTilt = (clientX, clientY) => {
            const rect = avatarBox.getBoundingClientRect();
            const x = (clientX - rect.left) / rect.width - 0.5;
            const y = (clientY - rect.top) / rect.height - 0.5;
            avatarBox.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleReset = () => {
            avatarBox.style.transform = '';
        };

        avatarBox.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            handleTilt(e.clientX, e.clientY);
        }, { passive: true });

        avatarBox.addEventListener('pointerleave', handleReset, { passive: true });
        avatarBox.addEventListener('pointercancel', handleReset, { passive: true });
    }

})();


