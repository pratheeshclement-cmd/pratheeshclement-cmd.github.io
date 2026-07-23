/* ===========================================================================
   PRATHEESH AI — LOADING HAND-OFF

   One short, deterministic initialization sequence. Section lifecycle motion
   belongs to harmony-motion.js, preventing duplicate observers and transforms.
   =========================================================================== */

(function () {
    'use strict';

    const READY_CLASS = 'cinematic-ready';
    const LOADER_DURATION = 520;
    const FADE_DURATION = 350;

    function setReady() {
        if (document.body.classList.contains(READY_CLASS)) return;
        document.body.classList.add(READY_CLASS);
        document.querySelectorAll('.stat-num[data-count]').forEach((metric) => {
            metric.textContent = metric.getAttribute('data-count') || '0';
        });
        window.dispatchEvent(new Event('harmony:ready'));
    }

    function setProgress(bar, value) {
        if (!bar) return;
        bar.style.setProperty('--harmony-loader-progress', String(Math.max(0, Math.min(1, value))));
    }

    function reveal(loader, selector) {
        loader.querySelector(selector)?.classList.add('reveal');
    }

    function initLoader() {
        const loader = document.getElementById('loader');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!loader) {
            setReady();
            return;
        }

        const name = document.getElementById('loaderName');
        const role = document.getElementById('loaderRole');
        const progress = document.getElementById('loaderProgressBar');
        const status = document.getElementById('loaderStatus');
        const avatar = loader.querySelector('.loader-avatar-wrap');
        const logo = loader.querySelector('.loader-logo-wrap');
        const barContainer = loader.querySelector('.loader-bar-container');

        if (name && !name.dataset.harmonyLetters) {
            name.dataset.harmonyLetters = 'true';
            name.innerHTML = 'PRATHEESH CLEMENT'.split('').map((character) => (
                character === ' ' ? '<span>&nbsp;</span>' : `<span>${character}</span>`
            )).join('');
        }

        if (role) role.textContent = 'DIGITAL ECOSYSTEM';
        if (status) status.textContent = 'Preparing experience';
        document.body.style.overflow = 'hidden';
        setProgress(progress, 0);

        const complete = () => {
            setProgress(progress, 1);
            if (status) status.textContent = 'Experience ready';
            loader.classList.add('fade-out');
            window.setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
                setReady();
            }, reducedMotion ? 1 : FADE_DURATION);
        };

        if (reducedMotion) {
            [avatar, logo, barContainer, role, status].filter(Boolean).forEach((node) => node.classList.add('reveal'));
            name?.querySelectorAll('span').forEach((letter) => letter.classList.add('reveal'));
            complete();
            return;
        }

        window.setTimeout(() => avatar?.classList.add('reveal'), 40);
        window.setTimeout(() => logo?.classList.add('reveal'), 105);
        window.setTimeout(() => {
            name?.querySelectorAll('span').forEach((letter, index) => {
                window.setTimeout(() => letter.classList.add('reveal'), Math.min(index * 14, 210));
            });
        }, 150);
        window.setTimeout(() => role?.classList.add('reveal'), 220);
        window.setTimeout(() => {
            barContainer?.classList.add('reveal');
            status?.classList.add('reveal');
            setProgress(progress, 0.42);
        }, 270);
        window.setTimeout(() => setProgress(progress, 0.78), 390);
        window.setTimeout(complete, LOADER_DURATION);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader, { once: true });
    } else {
        initLoader();
    }
})();