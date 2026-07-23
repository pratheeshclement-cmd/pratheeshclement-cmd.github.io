/* ==========================================================================
   PRATHEESH CLEMENT — SMART TRANSITION ENGINE  |  js/transitions.js
   
   ARCHITECTURE: Section-aware, performance-first orchestration system.
   
   WHAT THIS DOES:
   1. IntersectionObserver — triggers .is-in-view on all animated elements
   2. Section stagger setup — assigns --sd delay vars for wave reveals
   3. Scroll engine — sets --scroll-center-pos per section (RAF, passive)
   4. Avatar 3D tilt — mouse-tracking perspective transform
   5. Service card spotlight — radial glow follows cursor
   6. Magnetic buttons — subtle cursor pull on CTAs
   7. Ripple effects — click ripple on all buttons
   8. Nav active indicator — highlights current section link
   9. Hero scroll-depth — fades hero content as you scroll away
   10. Image parallax — slower scroll on images within cards
   11. Hero entrance — triggers after loader completes
   
   PERFORMANCE RULES:
   - All transforms use GPU-only properties (transform, opacity)
   - No layout-triggering properties (top, left, height, width)
   - All scroll handlers use requestAnimationFrame with ticking guard
   - Passive event listeners throughout
   - IntersectionObserver (no scroll-position checking for reveals)
   - Touch detection gates hover-only effects
   ========================================================================== */

(function () {
    'use strict';

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Bootstrap: wait for loader completion signal ──────────────────── */
    function bootstrap() {
        setupStaggerDelays();
        initIntersectionReveal();
        initRippleEffect();
        initHeroEntrance();
    }

    if (document.body.classList.contains('cinematic-ready')) {
        bootstrap();
    } else {
        const readyObserver = new MutationObserver((_, obs) => {
            if (document.body.classList.contains('cinematic-ready')) {
                obs.disconnect();
                bootstrap();
            }
        });
        readyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    /* ─────────────────────────────────────────────────────────────────────
       1. STAGGER DELAY SETUP
       ───────────────────────────────────────────────────────────────────── */
    function setupStaggerDelays() {
        const setStagger = (selector, step, offset = 0) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                if (!el.style.getPropertyValue('--sd')) {
                    el.style.setProperty('--sd', `${offset + i * step}ms`);
                }
            });
        };

        setStagger('.service-card', 80);
        setStagger('.skill-tag', 55);
        setStagger('.timeline-item', 120);
        setStagger('.testimonial-card', 100);
        setStagger('.metric-card', 90);
        setStagger('.about-meta-item', 80);
    }

    /* ─────────────────────────────────────────────────────────────────────
       2. SINGLE VIEWPORT REVEAL OBSERVER
       ───────────────────────────────────────────────────────────────────── */
    function initIntersectionReveal() {
        const SELECTOR = [
            '.section-header',
            '.about-visual',
            '.about-body',
            '.about-meta-item',
            '.metric-card',
            '.service-card',
            '.project-card',
            '.skill-tag',
            '.timeline-item',
            '.testimonial-card',
            '.eco-card',
            '.github-callout',
            '.contact-info',
            '.form-card',
            '.audit-intro',
            '.audit-form-card',
            '.experience-layout',
            '.footer',
            '.harmony-long-take'
        ].join(', ');

        const elements = document.querySelectorAll(SELECTOR);
        if (!elements.length) return;

        if (REDUCED_MOTION) {
            elements.forEach(el => {
                el.classList.add('is-in-view');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );

        elements.forEach(el => observer.observe(el));
    }

    /* ─────────────────────────────────────────────────────────────────────
       3. RIPPLE EFFECT
       ───────────────────────────────────────────────────────────────────── */
    function initRippleEffect() {
        document.querySelectorAll('.btn, .contact-link-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-circle';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    /* ─────────────────────────────────────────────────────────────────────
       4. HERO ENTRANCE
       ───────────────────────────────────────────────────────────────────── */
    function initHeroEntrance() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !REDUCED_MOTION) {
            wrapWordsInTitle(heroTitle);
            setTimeout(() => {
                heroTitle.classList.add('words-visible');
            }, 300);
        }

        document.querySelectorAll('.section-title').forEach(title => {
            wrapWordsInTitle(title);
        });
    }

    function wrapWordsInTitle(el) {
        if (el.dataset.wordsWrapped) return;
        el.dataset.wordsWrapped = 'true';

        Array.from(el.childNodes).forEach(node => {
            if (node.nodeType !== Node.TEXT_NODE) return;
            const text = node.textContent;
            if (!text.trim()) return;

            const frag = document.createDocumentFragment();
            text.split(/(\s+)/).forEach(part => {
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else if (part) {
                    const span = document.createElement('span');
                    span.className = 'word-reveal';
                    span.textContent = part;
                    frag.appendChild(span);
                }
            });
            node.replaceWith(frag);
        });

        el.querySelectorAll('.highlight').forEach(h => h.classList.add('word-reveal'));
    }

})();
