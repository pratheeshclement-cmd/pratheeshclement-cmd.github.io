/* ===========================================================================
   PRATHEESH AI — HARMONYOS NEXT–INSPIRED WEB MOTION CONTROLLER

   Native web equivalents of HarmonyOS transition concepts. This is a
   purpose-driven single-page controller: it uses IntersectionObserver for
   lifecycle reveals, a shared-element geometry hand-off for Home → About,
   route-aware navigation, and transform/opacity-only sheets and covers.
   =========================================================================== */

(function () {
    'use strict';

    const RouteType = Object.freeze({
        Push: 'push',
        Pop: 'pop',
        None: 'none',
    });

    const TransitionType = Object.freeze({
        All: 'all',
        Insert: 'insert',
        Delete: 'delete',
    });

    const SlideEffect = Object.freeze({
        TOP: 'top',
        BOTTOM: 'bottom',
        START: 'start',
        LEFT: 'left',
        END: 'end',
        RIGHT: 'right',
    });

    const TransitionEffect = Object.freeze({
        IDENTITY: 'identity',
        OPACITY: 'opacity',
        SCALE: 'scale',
        TRANSLATE: 'translate',
        ROTATE: 'rotate',
        move: (edge) => ({ type: 'move', edge }),
        asymmetric: (enter, exit) => ({ type: 'asymmetric', enter, exit }),
        combine: (...effects) => ({ type: 'combine', effects: effects.flat().filter(Boolean) }),
    });

    const TIMING = Object.freeze({
        fast: 150,
        normal: 250,
        premium: 350,
        longTake: 500,
        spatial: 700,
        maximum: 900,
    });

    const SCENE_ORDER = [
        'home', 'about', 'services', 'projects', 'ecosystem',
        'skills', 'experience', 'testimonials', 'audit', 'contact',
    ];

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = {
        activeId: 'home',
        activated: false,
        initialized: false,
        navIndicator: null,
        navLinks: null,
        resizeQueued: false,
        projectPreview: null,
        projectCover: null,
        lastFocusedElement: null,
    };

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

    function isReducedMotion() {
        return reducedMotionQuery.matches || document.body.classList.contains('low-motion');
    }

    function duration(value) {
        return isReducedMotion() ? 1 : Math.min(value, TIMING.maximum);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function navOffset() {
        return ($('#nav')?.getBoundingClientRect().height || 72) + 12;
    }

    function getTargetScrollY(element) {
        return Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY - navOffset()));
    }

    function routeFor(targetId, requested) {
        if (requested && requested !== RouteType.None) return requested;
        const currentIndex = SCENE_ORDER.indexOf(state.activeId);
        const targetIndex = SCENE_ORDER.indexOf(targetId);
        if (targetIndex === -1 || currentIndex === -1 || targetIndex === currentIndex) return RouteType.None;
        return targetIndex < currentIndex ? RouteType.Pop : RouteType.Push;
    }

    function wait(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function animate(element, frames, options) {
        if (!element?.animate || isReducedMotion()) return null;
        return element.animate(frames, {
            duration: duration(options.duration || TIMING.premium),
            easing: options.easing || 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: options.fill || 'both',
        });
    }

    /* -----------------------------------------------------------------------
       Harmony-style transition vocabulary exposed for integrations.
       ----------------------------------------------------------------------- */
    function Navigation(config = {}) {
        return {
            routeType: config.routeType || RouteType.Push,
            navigate: (destination, options = {}) => navigate(destination, config.routeType, options),
        };
    }

    function NavDestination(element, id) {
        if (!element) return null;
        element.dataset.harmonyDestination = id || element.id || '';
        return element;
    }

    function PageTransitionEnter(element, transitionType = TransitionType.All) {
        if (!element) return;
        element.dataset.harmonyPageTransition = `enter:${transitionType}`;
        element.classList.add('harmony-page-enter');
        window.setTimeout(() => element.classList.remove('harmony-page-enter'), duration(TIMING.premium));
    }

    function PageTransitionExit(element, transitionType = TransitionType.All) {
        if (!element) return;
        element.dataset.harmonyPageTransition = `exit:${transitionType}`;
        element.classList.add('harmony-page-exit');
        window.setTimeout(() => element.classList.remove('harmony-page-exit'), duration(TIMING.fast));
    }

    function customNavContentTransition(from, to, routeType) {
        const root = document.documentElement;
        root.dataset.harmonyRoute = routeType;
        if (from) PageTransitionExit(from, TransitionType.All);
        if (to) PageTransitionEnter(to, TransitionType.Insert);
        window.setTimeout(() => {
            if (root.dataset.harmonyRoute === routeType) root.dataset.harmonyRoute = RouteType.None;
        }, duration(TIMING.premium));
    }

    function pageTransition(targetId, routeType = RouteType.Push, options = {}) {
        return navigate(targetId, routeType, options);
    }

    function scrollToY(y, motionDuration = TIMING.spatial) {
        const targetY = Math.max(0, Math.round(y));
        if (isReducedMotion()) {
            window.scrollTo({ top: targetY, behavior: 'auto' });
            return;
        }

        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(targetY, {
                duration: clamp(motionDuration / 1000, 0.15, 0.9),
                lock: false,
                immediate: false,
            });
            return;
        }

        window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    /* -----------------------------------------------------------------------
       Geometry / shared element transition.
       The final target rectangle is calculated at the destination scroll
       position, so the profile can remain spatially continuous while scroll
       motion happens below it.
       ----------------------------------------------------------------------- */
    function geometryTransition(id, source, target, options = {}) {
        if (!source || !target || isReducedMotion()) {
            if (typeof options.onComplete === 'function') options.onComplete();
            return Promise.resolve(false);
        }

        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        if (!sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height) {
            if (typeof options.onComplete === 'function') options.onComplete();
            return Promise.resolve(false);
        }

        const destinationY = Number.isFinite(options.destinationY) ? options.destinationY : window.scrollY;
        const targetFinalTop = targetRect.top + window.scrollY - destinationY;
        const ghost = source.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.removeAttribute('data-harmony-reveal');
        ghost.classList.remove('harmony-visible');
        ghost.classList.add('harmony-shared-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.dataset.harmonySharedGhost = id;
        ghost.style.left = `${sourceRect.left}px`;
        ghost.style.top = `${sourceRect.top}px`;
        ghost.style.width = `${sourceRect.width}px`;
        ghost.style.height = `${sourceRect.height}px`;

        document.body.appendChild(ghost);
        source.classList.add('harmony-shared-source-hidden');
        target.classList.add('harmony-shared-target-hidden');

        const deltaX = targetRect.left - sourceRect.left;
        const deltaY = targetFinalTop - sourceRect.top;
        const scaleX = targetRect.width / sourceRect.width;
        const scaleY = targetRect.height / sourceRect.height;
        const motionDuration = duration(options.duration || TIMING.spatial);
        const travel = animate(ghost, [
            { transform: 'translate3d(0, 0, 0) scale(1, 1)', opacity: 1 },
            { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`, opacity: 1 },
        ], { duration: motionDuration });

        if (Number.isFinite(options.destinationY)) scrollToY(options.destinationY, motionDuration);

        return new Promise((resolve) => {
            const complete = () => {
                target.classList.remove('harmony-shared-target-hidden');
                source.classList.remove('harmony-shared-source-hidden');
                const dissolve = animate(ghost, [
                    { opacity: 1 },
                    { opacity: 0 },
                ], { duration: TIMING.fast });
                const remove = () => {
                    ghost.remove();
                    if (typeof options.onComplete === 'function') options.onComplete();
                    resolve(true);
                };
                if (dissolve) dissolve.finished.then(remove).catch(remove);
                else remove();
            };

            if (travel) travel.finished.then(complete).catch(complete);
            else complete();
        });
    }

    function sharedTransition(id, source, target, options = {}) {
        if (options.geometry) return geometryTransition(id, source, target, options);
        if (!target) return Promise.resolve(false);

        target.dataset.harmonySharedArrival = id;
        const arrival = animate(target, [
            { opacity: 0.72, transform: 'translate3d(0, 10px, 0) scale(0.985)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
        ], { duration: options.duration || TIMING.premium });

        return new Promise((resolve) => {
            const finish = () => {
                delete target.dataset.harmonySharedArrival;
                resolve(true);
            };
            if (arrival) arrival.finished.then(finish).catch(finish);
            else finish();
        });
    }

    /* -----------------------------------------------------------------------
       Sheets and covers. These functions are intentionally generic so cards,
       guided-tour stages, contact, and AI surfaces use the same contract.
       ----------------------------------------------------------------------- */
    function bindSheet(element, options = {}) {
        if (!element) return null;
        element.dataset.harmonySheet = options.name || element.id || 'sheet';
        bindOpenState(element, options.openClass || 'open');
        return element;
    }

    function bindContentCover(element, options = {}) {
        if (!element) return null;
        element.dataset.harmonyContentCover = options.name || element.id || 'cover';
        bindOpenState(element, options.openClass || 'visible');
        return element;
    }

    function bindMenu(element, options = {}) {
        if (!element) return null;
        element.dataset.harmonyMenu = options.name || element.id || 'menu';
        bindOpenState(element, options.openClass || 'open');
        return element;
    }

    function bindContextMenu(element, options = {}) {
        if (!element) return null;
        element.dataset.harmonyContextMenu = options.name || element.id || 'context-menu';
        element.addEventListener('contextmenu', () => {
            element.dataset.harmonyContextActive = 'true';
            window.setTimeout(() => delete element.dataset.harmonyContextActive, duration(TIMING.fast));
        });
        return element;
    }

    function bindOpenState(element, openClass) {
        const update = () => {
            element.dataset.harmonyState = element.classList.contains(openClass) ? 'open' : 'closed';
        };
        new MutationObserver(update).observe(element, { attributes: true, attributeFilter: ['class'] });
        update();
    }

    /* -----------------------------------------------------------------------
       Purpose map: one reveal identity per section, and no global animation.
       ----------------------------------------------------------------------- */
    function annotate(elements, reveal, options = {}) {
        const list = typeof elements === 'string' ? $$(elements) : Array.from(elements || []);
        const step = options.step ?? 0;
        const start = options.start ?? 0;

        list.forEach((element, index) => {
            if (!element) return;
            element.dataset.harmonyReveal = reveal;
            element.style.setProperty('--harmony-delay', `${Math.min(start + index * step, TIMING.spatial)}ms`);
            if (options.duration) element.style.setProperty('--harmony-duration', `${Math.min(options.duration, TIMING.maximum)}ms`);
        });
    }

    function setupSceneBlueprint() {
        $$('section[id]').forEach((section) => NavDestination(section, section.id));

        annotate([
            $('.hero-tag'), $('.hero-eyebrow'), $('.hero-title'), $('.hero-rotating-container'),
            $('.hero-desc'), $('#home .btn-group'), $('.hero-stack'), $('.hero-scroll-cue'),
        ].filter(Boolean), 'home', { step: 65, start: 0, duration: TIMING.longTake });
        annotate([$('.hero-visual')].filter(Boolean), 'home-visual', { start: 320, duration: TIMING.longTake });

        annotate($('#about .section-header') ? [$('#about .section-header'), $('.about-visual')] : [], 'about', { step: 100 });
        annotate([$('.about-body')].filter(Boolean), 'about-copy', { start: 120 });
        annotate($$('.about-meta-item'), 'about', { step: 70, start: 150 });

        annotate($('#services .section-header') ? [$('#services .section-header')] : [], 'home', { duration: TIMING.normal });
        annotate($$('.service-card'), 'service', { step: 70, duration: TIMING.premium });

        annotate($('#projects .section-header') ? [$('#projects .section-header')] : [], 'home', { duration: TIMING.normal });
        annotate($$('.project-card'), 'project', { step: 95, duration: TIMING.premium });

        annotate($('#ecosystem .section-header') ? [$('#ecosystem .section-header'), $('.eco-card')] : [], 'ecosystem', { step: 110, duration: TIMING.spatial });
        annotate($$('.eco-visual'), 'ecosystem-depth', { start: 150, duration: TIMING.spatial });

        annotate($('#skills .section-header') ? [$('#skills .section-header'), $('.skills-cloud-container')] : [], 'home', { step: 80, duration: TIMING.normal });
        annotate([...$$('.skill-tag'), ...$$('.skill-showcase-card')], 'skill', { step: 45, duration: TIMING.premium });

        annotate($('#experience .section-header') ? [$('#experience .section-header')] : [], 'home', { duration: TIMING.normal });
        annotate($$('.timeline-item'), 'timeline', { step: 110, duration: TIMING.longTake });

        annotate([...$$('#testimonials .section-header'), ...$$('.testimonial-card')], 'project', { step: 80, duration: TIMING.premium });
        annotate([...$$('.audit-intro'), ...$$('.audit-form-card')], 'contact', { step: 90, duration: TIMING.premium });
        annotate([...$$('#contact .section-header'), ...$$('.contact-info'), ...$$('.form-card'), ...$$('.contact-link-card')], 'contact', { step: 70, duration: TIMING.premium });

        const heroProfile = $('.hero-profile-card');
        const aboutProfile = $('.avatar-box');
        if (heroProfile) heroProfile.dataset.harmonyShared = 'profile';
        if (aboutProfile) aboutProfile.dataset.harmonyShared = 'profile';

        const contactForm = $('.form-card');
        if (contactForm) bindSheet(contactForm, { name: 'contact' });
    }

    function installRevealObserver() {
        const nodes = $$('[data-harmony-reveal]');
        if (!nodes.length) return;

        if (isReducedMotion()) {
            nodes.forEach((node) => node.classList.add('harmony-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('harmony-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

        nodes.forEach((node) => observer.observe(node));
    }

    function installSectionObserver() {
        const sections = $$('section[id]');
        if (!sections.length) return;

        const ratios = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
            const winner = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
            if (winner?.[1] > 0) setActiveScene(winner[0]);
        }, { threshold: [0.2, 0.38, 0.58], rootMargin: '-10% 0px -35% 0px' });

        sections.forEach((section) => observer.observe(section));
    }

    /* -----------------------------------------------------------------------
       Navigation framework: route direction, section synchronization, and a
       single shared underline. Native browser scrolling remains accessible.
       ----------------------------------------------------------------------- */
    function installNavigation() {
        document.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = event.target.closest?.('a[href^="#"]');
            if (!anchor) return;

            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#' || hash === '#main-content') return;
            const targetId = decodeURIComponent(hash.slice(1));
            if (!document.getElementById(targetId)) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            navigate(targetId, undefined, { updateHistory: true, source: 'anchor' });
        }, true);

        window.addEventListener('popstate', () => {
            const targetId = decodeURIComponent(window.location.hash.replace(/^#/, '')) || 'home';
            navigate(targetId, RouteType.Pop, { updateHistory: false, source: 'browser-history' });
        });
    }

    function installNavIndicator() {
        const navLinks = $('#navLinks');
        if (!navLinks) return;

        let indicator = $('.harmony-nav-indicator', navLinks);
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'harmony-nav-indicator';
            indicator.setAttribute('aria-hidden', 'true');
            navLinks.appendChild(indicator);
        }

        state.navLinks = navLinks;
        state.navIndicator = indicator;
        updateNavIndicator(state.activeId);

        const schedule = () => {
            if (state.resizeQueued) return;
            state.resizeQueued = true;
            requestAnimationFrame(() => {
                state.resizeQueued = false;
                updateNavIndicator(state.activeId);
            });
        };

        window.addEventListener('resize', schedule, { passive: true });
        if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(navLinks);
    }

    function initLenisSmoothScroll() {
        if (typeof window.Lenis === 'undefined' || isReducedMotion()) return;
        try {
            if (!window.lenis) {
                const lenis = new window.Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    smoothTouch: false,
                    touchMultiplier: 1.8,
                });

                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);

                lenis.on('scroll', ({ scroll, limit, velocity }) => {
                    const scrollVelocity = Math.abs(velocity || 0);
                    document.documentElement.style.setProperty('--scroll-velocity', Math.min(1, scrollVelocity * 0.1).toFixed(3));
                });

                window.lenis = lenis;
            }
        } catch (e) {
            console.warn('[HarmonyMotion] Lenis smooth scroll init:', e);
        }
    }

    function updateNavIndicator(id) {
        const indicator = state.navIndicator;
        const navLinks = state.navLinks;
        if (!indicator || !navLinks || !id) return;

        const link = $(`.nav-link[href="#${id}"]`, navLinks);
        $$('.nav-link', navLinks).forEach((item) => {
            const isCurrent = item === link;
            item.classList.toggle('active', isCurrent);
            if (isCurrent) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        });

        if (!link || window.matchMedia('(max-width: 1024px)').matches) {
            indicator.classList.remove('is-visible');
            return;
        }

        const parentRect = navLinks.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        if (!linkRect.width || !parentRect.width) {
            indicator.classList.remove('is-visible');
            return;
        }

        const x = Math.round(linkRect.left - parentRect.left);
        const width = Math.round(linkRect.width);
        indicator.style.width = `${width}px`;
        indicator.style.transform = `translate3d(${x}px, 0, 0)`;
        indicator.classList.add('is-visible');
    }

    function installScrollChrome() {
        const nav = $('#nav');
        const progress = $('#scrollProgress');
        let backToTop = $('#bttBtn');
        let queued = false;
        let maxScroll = 1;

        if (progress) {
            progress.style.width = '100%';
            progress.style.transformOrigin = 'left center';
        }

        if (!backToTop) {
            backToTop = document.createElement('button');
            backToTop.id = 'bttBtn';
            backToTop.type = 'button';
            backToTop.setAttribute('aria-label', 'Back to top');
            backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(backToTop);
        }
        backToTop.addEventListener('click', () => navigate('home', RouteType.Pop, { updateHistory: true, source: 'back-to-top' }));

        const measure = () => {
            maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        };
        const update = () => {
            const scrollY = window.scrollY;
            if (nav) nav.classList.toggle('scrolled', scrollY > 60);
            if (progress) progress.style.transform = `scaleX(${clamp(scrollY / maxScroll, 0, 1).toFixed(4)})`;
            backToTop.classList.toggle('show', scrollY > 400);
            queued = false;
        };
        const schedule = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        };

        measure();
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', () => { measure(); schedule(); }, { passive: true });
        window.addEventListener('load', () => { measure(); schedule(); }, { once: true });
    }
    function setActiveScene(id) {
        if (!id) return;
        const next = document.getElementById(id);
        if (!next) return;

        const previous = document.getElementById(state.activeId);
        if (previous && previous !== next) delete previous.dataset.harmonyActive;
        next.dataset.harmonyActive = 'true';
        state.activeId = id;
        document.documentElement.dataset.harmonyActiveScene = id;
        updateNavIndicator(id);
        window.dispatchEvent(new CustomEvent('harmony:sectionchange', { detail: { id } }));
    }

    function navigate(targetId, requestedRoute, options = {}) {
        const target = document.getElementById(targetId);
        if (!target) return Promise.resolve(false);

        const from = document.getElementById(state.activeId);
        const route = routeFor(targetId, requestedRoute);
        const destinationY = getTargetScrollY(target);
        customNavContentTransition(from, target, route);

        if (options.updateHistory !== false) {
            const hash = `#${targetId}`;
            if (window.location.hash !== hash) window.history.pushState({ harmonyDestination: targetId }, '', hash);
        }

        const heroProfile = $('.hero-profile-card[data-harmony-shared="profile"]');
        const aboutProfile = $('.avatar-box[data-harmony-shared="profile"]');
        const shouldMorphProfile = state.activeId === 'home' && targetId === 'about' && heroProfile && aboutProfile;

        if (shouldMorphProfile) {
            return geometryTransition('profile', heroProfile, aboutProfile, {
                destinationY,
                duration: TIMING.spatial,
                onComplete: () => setActiveScene(targetId),
            });
        }

        scrollToY(destinationY, route === RouteType.None ? TIMING.normal : TIMING.spatial);
        setActiveScene(targetId);
        return Promise.resolve(true);
    }

    /* -----------------------------------------------------------------------
       Project cards: explicit preview control opens a content cover and FLIP
       morphs its card into the presentation surface.
       ----------------------------------------------------------------------- */
    function ensureProjectCover() {
        if (state.projectCover) return state.projectCover;

        const cover = document.createElement('div');
        cover.id = 'harmony-project-cover';
        cover.setAttribute('role', 'dialog');
        cover.setAttribute('aria-modal', 'true');
        cover.setAttribute('aria-label', 'Project showcase preview');
        document.body.appendChild(cover);

        cover.addEventListener('click', (event) => {
            if (event.target === cover) closeProjectPreview();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.projectPreview) closeProjectPreview();
        });

        state.projectCover = cover;
        bindContentCover(cover, { name: 'project-preview', openClass: 'is-open' });
        return cover;
    }

    function installProjectPreviews() {
        $$('.project-card').forEach((card, index) => {
            card.dataset.harmonyShared = `project-${index + 1}`;
            const actions = $('.proj-actions', card) || $('.proj-body', card);
            if (!actions || $('.harmony-project-open', card)) return;

            const title = $('h3', card)?.textContent?.trim() || `Project ${index + 1}`;
            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'harmony-project-open';
            trigger.innerHTML = '<i class="fas fa-expand"></i><span>Open project story</span>';
            trigger.setAttribute('aria-label', `Open ${title} project story`);
            trigger.addEventListener('click', () => openProjectPreview(card));
            actions.appendChild(trigger);
            bindContextMenu(card, { name: `project-${index + 1}` });
        });
    }

    function openProjectPreview(card) {
        const cover = ensureProjectCover();
        if (state.projectPreview) closeProjectPreview(true);

        state.lastFocusedElement = document.activeElement;
        const sourceRect = card.getBoundingClientRect();
        const detail = card.cloneNode(true);
        detail.removeAttribute('data-harmony-reveal');
        detail.classList.remove('harmony-visible');
        detail.classList.add('harmony-project-detail');

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'harmony-project-close';
        close.innerHTML = '<i class="fas fa-xmark"></i><span>Close preview</span>';
        close.addEventListener('click', () => closeProjectPreview());
        detail.prepend(close);

        cover.replaceChildren(detail);
        cover.classList.add('is-open');
        document.body.classList.add('harmony-cover-open');
        state.projectPreview = { card, detail };

        requestAnimationFrame(() => {
            const detailRect = detail.getBoundingClientRect();
            const translateX = sourceRect.left - detailRect.left;
            const translateY = sourceRect.top - detailRect.top;
            const scaleX = sourceRect.width / detailRect.width;
            const scaleY = sourceRect.height / detailRect.height;
            animate(detail, [
                { opacity: 0.9, transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})` },
                { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1, 1)' },
            ], { duration: TIMING.premium });
            close.focus({ preventScroll: true });
        });
    }

    function closeProjectPreview(immediate = false) {
        const preview = state.projectPreview;
        const cover = state.projectCover;
        if (!preview || !cover) return;

        const complete = () => {
            cover.classList.remove('is-open');
            document.body.classList.remove('harmony-cover-open');
            state.projectPreview = null;
            window.setTimeout(() => {
                if (!state.projectPreview) cover.replaceChildren();
            }, duration(TIMING.normal));
            state.lastFocusedElement?.focus?.({ preventScroll: true });
        };

        if (immediate || isReducedMotion()) {
            complete();
            return;
        }

        const cardRect = preview.card.getBoundingClientRect();
        const detailRect = preview.detail.getBoundingClientRect();
        const animation = animate(preview.detail, [
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1, 1)' },
            {
                opacity: 0,
                transform: `translate3d(${cardRect.left - detailRect.left}px, ${cardRect.top - detailRect.top}px, 0) scale(${cardRect.width / detailRect.width}, ${cardRect.height / detailRect.height})`,
            },
        ], { duration: TIMING.normal });

        if (animation) animation.finished.then(complete).catch(complete);
        else complete();
    }

    function setupSurfaceBindings() {
        bindMenu($('#navLinks'), { name: 'navigation', openClass: 'open' });
        bindSheet($('#settingsDrawer'), { name: 'settings', openClass: 'open' });
        bindContentCover($('#ai-welcome-overlay'), { name: 'welcome', openClass: 'visible' });
        bindContentCover($('#ai-tour-modal'), { name: 'guided-tour', openClass: 'visible' });
        bindContentCover($('#ai-exit-intent'), { name: 'exit-intent', openClass: 'visible' });
        bindContentCover($('#ai-chat-panel'), { name: 'ai-concierge', openClass: 'open' });
    }

    function activateWhenLoaderCompletes() {
        const activate = () => {
            if (state.activated) return;
            state.activated = true;
            $$('[data-harmony-reveal="home"], [data-harmony-reveal="home-visual"]').forEach((element) => {
                element.classList.add('harmony-visible');
            });
            document.documentElement.classList.add('harmony-motion-ready');
            document.body.classList.add('harmony-ready');
            setActiveScene(decodeURIComponent(window.location.hash.replace(/^#/, '')) || 'home');
        };

        if (document.body.classList.contains('cinematic-ready')) {
            activate();
            return;
        }

        const observer = new MutationObserver(() => {
            if (!document.body.classList.contains('cinematic-ready')) return;
            observer.disconnect();
            activate();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Failsafe for a missing loader: never leave content in a pending state.
        window.setTimeout(activate, TIMING.maximum);
    }

    function bootstrap() {
        if (state.initialized) return;
        state.initialized = true;

        initLenisSmoothScroll();
        setupSceneBlueprint();
        installRevealObserver();
        installSectionObserver();
        installNavigation();
        installNavIndicator();
        installScrollChrome();
        installProjectPreviews();
        setupSurfaceBindings();
        activateWhenLoaderCompletes();

        reducedMotionQuery.addEventListener?.('change', () => {
            if (reducedMotionQuery.matches) $$('[data-harmony-reveal]').forEach((element) => element.classList.add('harmony-visible'));
        });
    }

    window.HarmonyMotion = Object.freeze({
        RouteType,
        TransitionType,
        SlideEffect,
        TransitionEffect,
        Navigation,
        NavDestination,
        pageTransition,
        PageTransitionEnter,
        PageTransitionExit,
        customNavContentTransition,
        geometryTransition,
        sharedTransition,
        bindSheet,
        bindContentCover,
        bindMenu,
        bindContextMenu,
        navigate,
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    else bootstrap();
})();
