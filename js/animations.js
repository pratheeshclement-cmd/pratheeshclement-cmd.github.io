/* ==========================================================================
   PRATHEESH CLEMENT — PORTFOLIO  |  js/animations.js
   Desc: Implements premium, high-performance cinematic animations.
         Includes loader timeline, scroll reveals, typewriter role rotation,
         and a responsive floating particle system.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
    });

    /* ─────────────────────────────────────────────
       1. PREMIUM LOADING SYSTEM
       ───────────────────────────────────────────── */
    function initLoader() {
        const loader = document.getElementById('loader');
        const avatarWrap = loader?.querySelector('.loader-avatar-wrap');
        const logoWrap = loader?.querySelector('.loader-logo-wrap');
        const nameEl = document.getElementById('loaderName');
        const roleEl = document.getElementById('loaderRole');
        const barContainer = loader?.querySelector('.loader-bar-container');
        const progressBar = document.getElementById('loaderProgressBar');
        const statusEl = document.getElementById('loaderStatus');
        let started = false;

        const startOnce = () => {
            if (started) return;
            started = true;
            document.body.classList.add('cinematic-ready');
            initScrollReveal();
            initStatsCounters();
            initHeroSequence();
            initWordReveals();
            initAmbientParticles();
        };

        if (!loader || !avatarWrap || !logoWrap || !nameEl || !roleEl || !barContainer || !progressBar || !statusEl) {
            startOnce();
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.body.style.overflow = 'hidden';
        roleEl.textContent = 'DIGITAL ECOSYSTEM EXPERIENCE';

        const name = 'PRATHEESH CLEMENT';
        nameEl.innerHTML = name.split('').map(char =>
            char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`
        ).join('');
        const letters = nameEl.querySelectorAll('span');

        const complete = () => {
            statusEl.textContent = 'Experience ready.';
            progressBar.style.width = '100%';
            window.setTimeout(() => {
                loader.classList.add('fade-out');
                window.setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = '';
                    startOnce();
                }, reducedMotion ? 60 : 560);
            }, reducedMotion ? 30 : 120);
        };

        if (reducedMotion) {
            avatarWrap.classList.add('reveal');
            logoWrap.classList.add('reveal');
            letters.forEach(letter => letter.classList.add('reveal'));
            roleEl.classList.add('reveal');
            barContainer.classList.add('reveal');
            statusEl.classList.add('reveal');
            complete();
            return;
        }

        window.setTimeout(() => avatarWrap.classList.add('reveal'), 80);
        window.setTimeout(() => logoWrap.classList.add('reveal'), 240);
        window.setTimeout(() => letters.forEach((letter, index) => {
            window.setTimeout(() => letter.classList.add('reveal'), index * 24);
        }), 420);
        window.setTimeout(() => roleEl.classList.add('reveal'), 800);
        window.setTimeout(() => {
            barContainer.classList.add('reveal');
            statusEl.classList.add('reveal');
            let progress = 0;
            const statuses = ['Calibrating depth layers…', 'Assembling the ecosystem…', 'Launching the experience…'];
            const timer = window.setInterval(() => {
                progress = Math.min(progress + 5, 100);
                progressBar.style.width = `${progress}%`;
                statusEl.textContent = statuses[Math.min(Math.floor(progress / 34), statuses.length - 1)];
                if (progress === 100) {
                    window.clearInterval(timer);
                    complete();
                }
            }, 42);
        }, 960);
    }

    /* ─────────────────────────────────────────────
       2. TYPEWRITER / ROLE-CYCLING SEQUENCE
       ───────────────────────────────────────────── */
    function initWordReveals() {
        const targets = document.querySelectorAll('.hero-title, .section-title');
        if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        targets.forEach((target) => {
            if (target.dataset.wordsReady) return;
            target.dataset.wordsReady = 'true';
            target.classList.add('cinematic-words');
            Array.from(target.childNodes).forEach((node) => {
                if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
                const fragment = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach((part) => {
                    if (/^\s+$/.test(part)) fragment.appendChild(document.createTextNode(part));
                    else if (part) {
                        const word = document.createElement('span');
                        word.className = 'word-reveal';
                        word.textContent = part;
                        fragment.appendChild(word);
                    }
                });
                node.replaceWith(fragment);
            });
            target.querySelectorAll('.highlight').forEach((highlight) => highlight.classList.add('word-reveal'));
        });

        const observer = new IntersectionObserver((entries, watch) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('words-visible');
                watch.unobserve(entry.target);
            });
        }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
        targets.forEach((target) => observer.observe(target));
    }



    function initAmbientParticles() {
        const canvas = document.getElementById('airParticles');
        if (!canvas || canvas.dataset.initialized || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        canvas.dataset.initialized = 'true';
        const context = canvas.getContext('2d', { alpha: true });
        if (!context) return;

        let width = 0;
        let height = 0;
        let particles = [];
        let rafId = 0;
        let lastTime = 0;
        const particleCount = () => window.innerWidth < 600 ? 16 : window.innerWidth < 1025 ? 26 : 42;
        const makeParticle = () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.65 + Math.random() * 1.45,
            alpha: 0.14 + Math.random() * 0.4,
            vx: (Math.random() - 0.5) * 0.12,
            vy: -0.05 - Math.random() * 0.14
        });
        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            particles = Array.from({ length: particleCount() }, makeParticle);
        };
        const draw = (time) => {
            const delta = Math.min((time - lastTime) / 16.67 || 1, 2);
            lastTime = time;
            context.clearRect(0, 0, width, height);
            particles.forEach((particle) => {
                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;
                if (particle.y < -12) { particle.y = height + 12; particle.x = Math.random() * width; }
                if (particle.x < -12) particle.x = width + 12;
                if (particle.x > width + 12) particle.x = -12;
                context.beginPath();
                context.fillStyle = `rgba(120, 225, 255, ${particle.alpha})`;
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });
            if (!document.hidden) rafId = window.requestAnimationFrame(draw);
        };
        const pause = () => {
            if (document.hidden) window.cancelAnimationFrame(rafId);
            else { lastTime = performance.now(); rafId = window.requestAnimationFrame(draw); }
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });
        document.addEventListener('visibilitychange', pause);
        rafId = window.requestAnimationFrame(draw);
    }

    function initHeroSequence() {
        const roles = [
            "Digital Ecosystem Builder",
            "SEO & Technical Optimization Expert",
            "AI & Workflow Automation Architect",
            "High-Performance Web Developer",
            "Data-Driven Digital Marketer",
            "Personal Branding Consultant",
            "Conversion Funnel Optimizer",
            "Building the Future of Digital Authority"
        ];

        const target = document.getElementById('heroRoleCycle');
        if (!target) return;

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 60;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                target.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 20;
            } else {
                target.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 60;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400;
            }

            setTimeout(type, typingSpeed);
        }

        // Start cycling
        setTimeout(type, 800);
    }

    /* ─────────────────────────────────────────────
       3. FLUID SCROLL REVEALS (Explicit reveal classes only)
       ───────────────────────────────────────────── */
    function initScrollReveal() {
        // Fix: only target explicit reveal classes, NOT [class*="layer-"] which
        // incorrectly targets background/layout elements causing them to disappear
        const revealElements = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale'
        );
        if (revealElements.length === 0) return;

        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.style.getPropertyValue('--sd') || '0ms';
                    el.style.transitionDelay = delay;
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ─────────────────────────────────────────────
       4. STATS METRICS COUNTERS
       ───────────────────────────────────────────── */
    function initStatsCounters() {
        const counters = document.querySelectorAll('.stat-num');
        if (counters.length === 0) return;

        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => countObserver.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 2000;
        const startTime = performance.now();
        const easeOutQuad = (t) => t * (2 - t);

        function updateCount(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentVal = Math.round(easeOutQuad(progress) * target);
            el.textContent = currentVal;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(updateCount);
    }

})();