/* ==========================================================================
   PRATHEESH CLEMENT — UNIFIED SECTION REVEAL & TRANSITION ENGINE
   ========================================================================== */

(function () {
    'use strict';

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function bootstrap() {
        setupStaggerDelays();
        initTitleWordStagger();
        initIntersectionReveal();
        initRippleEffect();
        initImageGPUObserver();
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

    /* ── 1. STAGGER DELAY CALCULATOR ───────────────────────────────────── */
    function setupStaggerDelays() {
        const setStagger = (selector, step, offset = 0) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                if (!el.style.getPropertyValue('--sd')) {
                    el.style.setProperty('--sd', `${offset + i * step}ms`);
                }
            });
        };

        setStagger('.service-card', 75);
        setStagger('.project-card', 90);
        setStagger('.skill-tag', 40);
        setStagger('.timeline-item', 100);
        setStagger('.testimonial-card', 85);
        setStagger('.metric-card', 70);
        setStagger('.about-meta-item', 70);
        setStagger('.eco-card', 80);
    }

    /* ── 2. SINGLE-PASS VIEWPORT REVEAL OBSERVER ───────────────────────── */
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
            '.harmony-reveal',
            'p',
            '.btn'
        ].join(', ');

        const elements = document.querySelectorAll(SELECTOR);
        if (!elements.length) return;

        if (REDUCED_MOTION || document.body.classList.contains('low-motion')) {
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
                        // Animate ONLY ONCE as required
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(el => observer.observe(el));
    }

    /* ── 3. HEADING & CHARACTER/WORD STAGGER REVEAL ────────────────────── */
    function initTitleWordStagger() {
        const titles = document.querySelectorAll('.section-title, .hero-title');
        titles.forEach(title => {
            if (title.dataset.staggerWrapped) return;
            title.dataset.staggerWrapped = 'true';

            let wordIndex = 0;
            Array.from(title.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (!text.trim()) return;

                    const frag = document.createDocumentFragment();
                    text.split(/(\s+)/).forEach(part => {
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else if (part) {
                            const span = document.createElement('span');
                            span.className = 'word-reveal';
                            span.style.setProperty('--w-idx', String(wordIndex++));
                            span.textContent = part;
                            frag.appendChild(span);
                        }
                    });
                    node.replaceWith(frag);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.classList.add('word-reveal');
                    node.style.setProperty('--w-idx', String(wordIndex++));
                }
            });
        });
    }

    /* ── 4. IMAGE GPU LAZY-LOAD REVEAL OBSERVER ───────────────────────── */
    function initImageGPUObserver() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.classList.contains('gpu-image-reveal')) {
                img.classList.add('gpu-image-reveal');
            }

            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            }
        });
    }

    /* ── 5. BUTTON CLICK RIPPLE EFFECT ────────────────────────────────── */
    function initRippleEffect() {
        document.querySelectorAll('.btn, .contact-link-card, .cookie-btn').forEach(btn => {
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
                window.setTimeout(() => ripple.remove(), 700);
            });
        });
    }

})();

