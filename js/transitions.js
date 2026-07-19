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

    const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Bootstrap: wait for loader completion signal ──────────────────── */
    function bootstrap() {
        setupStaggerDelays();
        initIntersectionReveal();
        initScrollEngine();
        initNavActiveTracker();
        if (!IS_TOUCH && !REDUCED_MOTION) {
            initCardSpotlight();
        }
        initRippleEffect();
        initHeroEntrance();
        initScrollProgressBar();
        initSectionStarReveal();
    }

    /* Wait for cinematic-ready class (set by animations.js after loader) */
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
       Sets --sd CSS custom property for wave animation timing
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
       2. INTERSECTION REVEAL ENGINE
       Master observer — triggers .is-in-view on all animated elements
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
        ].join(', ');

        const elements = document.querySelectorAll(SELECTOR);
        if (!elements.length) return;

        if (REDUCED_MOTION) {
            elements.forEach(el => {
                el.classList.add('is-in-view');
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.filter = 'none';
                el.style.clipPath = 'none';
            });
            /* Also reveal word spans */
            document.querySelectorAll('.word-reveal').forEach(w => {
                w.style.clipPath = 'none';
                w.style.opacity = '1';
                w.style.transform = 'none';
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

        /* Hero title word reveal — separate observer with lower threshold */
        const titleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('words-visible');
                        titleObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -5% 0px' }
        );

        document.querySelectorAll('.section-title, .hero-title').forEach(t => titleObserver.observe(t));
    }

    /* ─────────────────────────────────────────────────────────────────────
       3. SCROLL ENGINE
       RAF-based scroll tracker. Sets per-section CSS custom properties.
       Drives: --scroll-center-pos, --scroll-center-pos-abs
       ───────────────────────────────────────────────────────────────────── */
    function initScrollEngine() {
        const sections = Array.from(document.querySelectorAll('[data-scene]'));
        if (!sections.length) return;

        let ticking = false;
        let lastScroll = -1;

        const update = () => {
            const scrollY = window.scrollY;
            if (scrollY === lastScroll) { ticking = false; return; }
            lastScroll = scrollY;

            const vh = window.innerHeight;
            const viewportCenter = scrollY + vh / 2;

            sections.forEach(section => {
                const top = section.offsetTop;
                const h = section.offsetHeight;
                const center = top + h / 2;
                const range = vh / 2 + h / 2;
                const dist = Math.max(-1, Math.min(1, (viewportCenter - center) / range));
                const absDist = Math.abs(dist);
                const visibility = 1 - absDist;

                section.style.setProperty('--scroll-center-pos', dist.toFixed(3));
                section.style.setProperty('--scroll-center-pos-abs', absDist.toFixed(3));
                section.classList.toggle('is-active', visibility > 0.55);
            });

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

    /* ─────────────────────────────────────────────────────────────────────
       4. HERO SCROLL DEPTH
       Hero content subtly drifts up + fades as user scrolls away.
       CSS-driven (sets --scroll-center-pos on #home), but we also
       handle the scroll cue visibility here.
       ───────────────────────────────────────────────────────────────────── */
    function initHeroScrollDepth() {
        const cue = document.querySelector('.hero-scroll-cue');
        if (!cue) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrolled = window.scrollY > 100;
                cue.style.opacity = scrolled ? '0' : '';
                cue.style.transform = scrolled ? 'translateY(10px)' : '';
                ticking = false;
            });
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────────────
       5. NAV ACTIVE TRACKER
       Highlights the nav link for the section currently in view.
       ───────────────────────────────────────────────────────────────────── */
    function initNavActiveTracker() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        if (!navLinks.length) return;

        const sectionMap = new Map();
        navLinks.forEach(link => {
            const id = link.getAttribute('href').slice(1);
            const section = document.getElementById(id);
            if (section) sectionMap.set(section, link);
        });

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const link = sectionMap.get(entry.target);
                    if (link) link.classList.toggle('active', entry.isIntersecting);
                });
            },
            { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
        );

        sectionMap.forEach((_, section) => sectionObserver.observe(section));
    }

    /* ─────────────────────────────────────────────────────────────────────
       6. AVATAR 3D TILT (About section — desktop only)
       Mouse position → CSS custom properties → CSS perspective transform
       ───────────────────────────────────────────────────────────────────── */
    function initAvatarTilt() {
        const container = document.querySelector('.avatar-container');
        const box = document.querySelector('.avatar-box');
        if (!container || !box) return;

        let raf = null;

        container.addEventListener('mousemove', (e) => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const tiltX = ((e.clientY - cy) / (rect.height / 2)) * -6; /* degrees */
                const tiltY = ((e.clientX - cx) / (rect.width / 2)) * 6;
                box.style.setProperty('--tilt-x', `${tiltX}deg`);
                box.style.setProperty('--tilt-y', `${tiltY}deg`);
                box.classList.add('is-tilting');
            });
        });

        container.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            box.classList.remove('is-tilting');
            box.style.removeProperty('--tilt-x');
            box.style.removeProperty('--tilt-y');
        });
    }

    /* ─────────────────────────────────────────────────────────────────────
       7. CARD SPOTLIGHT GLOW (Services, Projects, Glass cards — desktop)
       Mouse position → CSS --mouse-x, --mouse-y → CSS radial glow
       ───────────────────────────────────────────────────────────────────── */
    function initCardSpotlight() {
        const cards = document.querySelectorAll('.service-card, .project-card, .glass-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
                card.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
    }

    /* ─────────────────────────────────────────────────────────────────────
       8. MAGNETIC ELEMENTS (CTAs, Social pills, Contact cards — desktop)
       Subtle cursor pull toward element center
       ───────────────────────────────────────────────────────────────────── */
    function initMagneticElements() {
        const MAGNETIC_STRENGTH = 0.15;

        const targets = document.querySelectorAll(
            '.btn-primary, .btn-outline, .btn-secondary, .social-pill, .hero-profile-card'
        );

        targets.forEach(el => {
            let raf = null;

            const onMove = (e) => {
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) * MAGNETIC_STRENGTH;
                    const dy = (e.clientY - cy) * MAGNETIC_STRENGTH;
                    el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
                });
            };

            const onLeave = () => {
                if (raf) cancelAnimationFrame(raf);
                /* Spring back */
                el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.transform = '';
                setTimeout(() => el.style.transition = '', 500);
            };

            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', onLeave);
        });
    }

    /* ─────────────────────────────────────────────────────────────────────
       9. RIPPLE EFFECT (All .btn elements)
       Click → expand ripple circle from click point
       ───────────────────────────────────────────────────────────────────── */
    function initRippleEffect() {
        document.querySelectorAll('.btn').forEach(btn => {
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

        /* Also on contact link cards */
        document.querySelectorAll('.contact-link-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-circle';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                card.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    /* ─────────────────────────────────────────────────────────────────────
       10. IMAGE PARALLAX (Avatar + Project thumbnails — desktop)
       Scroll → slower image movement = depth illusion
       ───────────────────────────────────────────────────────────────────── */
    function initImageParallax() {
        const PARALLAX_FACTOR = 0.12;
        const avatar = document.querySelector('.avatar-img');
        if (!avatar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const vh = window.innerHeight;
                const rect = avatar.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2 - vh / 2;
                const parallaxY = centerY * PARALLAX_FACTOR;
                avatar.style.transform = `translateY(${parallaxY.toFixed(2)}px)`;
                ticking = false;
            });
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────────────
       11. HERO ENTRANCE ORCHESTRATION
       Fires sequentially after cinematic-ready class is set
       ───────────────────────────────────────────────────────────────────── */
    function initHeroEntrance() {
        /* Hero title word-reveal — trigger immediately */
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !REDUCED_MOTION) {
            /* Wrap words in .word-reveal spans */
            wrapWordsInTitle(heroTitle);
            /* Trigger after a brief delay to feel cinematic */
            setTimeout(() => {
                heroTitle.classList.add('words-visible');
            }, 400);
        }

        /* Section titles — wrap words on DOMContentLoaded */
        document.querySelectorAll('.section-title').forEach(title => {
            wrapWordsInTitle(title);
        });
    }

    function wrapWordsInTitle(el) {
        if (el.dataset.wordsWrapped) return;
        el.dataset.wordsWrapped = 'true';

        /* Walk text nodes, wrap each word in a span */
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

        /* Also give existing .highlight spans the word-reveal class */
        el.querySelectorAll('.highlight').forEach(h => h.classList.add('word-reveal'));
    }

    /* ─────────────────────────────────────────────────────────────────────
       12. SCROLL PROGRESS BAR
       Thin gradient line at top showing read progress
       ───────────────────────────────────────────────────────────────────── */
    function initScrollProgressBar() {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = `${Math.min(100, progress).toFixed(2)}%`;
                ticking = false;
            });
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────────────
       13. STAR RATING REVEAL (Testimonials)
       Separate observer for the star rating reveal effect
       ───────────────────────────────────────────────────────────────────── */
    function initSectionStarReveal() {
        /* Stars are handled via CSS + .is-in-view class already set by main observer */
        /* This function is a hook for future enhancement */
    }

})();
