/* ==========================================================================
   PRATHEESH CLEMENT — PORTFOLIO  |  js/animations.js
   Desc: Lightweight scroll reveal animations using Intersection Observer
         and statistics metrics number count-up logic.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
        initStatsCounters();
        initHeroStaggerEntrance();
    });

    /* ─────────────────────────────────────────────
       1. LIGHTWEIGHT SCROLL REVEAL TRIGGERS
       ───────────────────────────────────────────── */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
        if (revealElements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Stagger delay from inline custom property (e.g. style="--sd: 150ms;")
                    const delay = el.style.getPropertyValue('--sd') || '0ms';
                    el.style.transitionDelay = delay;
                    
                    el.classList.add('revealed');
                    
                    // Unobserve after showing
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ─────────────────────────────────────────────
       2. STATISTICS METRIC COUNT-UP ANIMATION
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
        const duration = 1500; // 1.5 seconds count duration
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

    /* ─────────────────────────────────────────────
       3. HERO ENTRANCE (Above-the-fold immediate trigger)
       ───────────────────────────────────────────── */
    function initHeroStaggerEntrance() {
        const heroReveals = document.querySelectorAll('#home .reveal-up, #home .reveal-fade');
        
        // Short timeout to ensure page rendering has completed and transitions trigger properly
        setTimeout(() => {
            heroReveals.forEach(el => {
                const delay = el.style.getPropertyValue('--sd') || '0ms';
                el.style.transitionDelay = delay;
                el.classList.add('revealed');
            });
        }, 100);
    }

})();