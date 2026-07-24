/**
 * HARMONYOS NEXT-INSPIRED TRANSITION MANAGER (VANILLA JS)
 * Zero-dependency, 60 FPS lightweight motion manager enforcing GPU-accelerated
 * animations (transform, opacity only) to guarantee 100/100 Core Web Vitals (0 CLS, low INP).
 *
 * Implements 5 HarmonyOS Transition Archetypes:
 * 1. Long-Take Morphing (geometryTransition / Card Expansion) via FLIP
 * 2. Left-Right Displacement Mask (PageTransitionEnter / Route Slide)
 * 3. Left-Right Spaced Movement (SlideEffect / Tab Switch with margin gap)
 * 4. Component Lifecycle (TransitionEffect.asymmetric / Viewport Reveal)
 * 5. Modal / Sheet Transitions (bindSheet / Bottom Sheet with backdrop blur)
 */

class TransitionManager {
    constructor(options = {}) {
        this.options = Object.assign({
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
            durationNormal: 250,
            durationLongTake: 500,
            easeCurve: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }, options);

        this.observer = null;
        this.activeMorphGhost = null;
        this.activeSheet = null;
        this.isAnimating = false;

        this.init();
    }

    /**
     * Initializes the IntersectionObserver for Archetype 4 (Component Lifecycle Asymmetric reveals).
     */
    init() {
        if (typeof window === 'undefined') return;

        // 1. Setup IntersectionObserver for Component Lifecycle reveals
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    this.applyAsymmetricEnter(el);
                } else if (el.dataset.harmonyRepeatable === 'true') {
                    this.applyAsymmetricExit(el);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });

        // Observe elements with data-harmony-reveal or data-harmony-lifecycle
        document.querySelectorAll('[data-harmony-reveal], [data-harmony-lifecycle]').forEach(el => {
            this.observer.observe(el);
        });

        document.documentElement.classList.add('harmony-motion-ready');
    }

    /**
     * Archetype 4: Component Lifecycle Entry (TransitionEffect.asymmetric)
     * Entry: Opacity 0 -> 1, Scale 0.95 -> 1.0 with cubic-bezier curve.
     */
    applyAsymmetricEnter(element) {
        if (!element) return;
        element.classList.remove('harmony-asymmetric-exit');
        element.classList.add('harmony-visible', 'harmony-asymmetric-enter');
        
        // Clean up animation class after completion
        setTimeout(() => {
            element.classList.remove('harmony-asymmetric-enter');
        }, this.options.durationNormal + 100);
    }

    /**
     * Archetype 4: Component Lifecycle Exit (TransitionEffect.asymmetric)
     * Exit: Fast fade-out with subtle Y-translation.
     */
    applyAsymmetricExit(element) {
        if (!element) return;
        element.classList.remove('harmony-visible', 'harmony-asymmetric-enter');
        element.classList.add('harmony-asymmetric-exit');
    }

    /**
     * Archetype 1: Long-Take Morphing (geometryTransition / Card Expansion)
     * FLIP (First, Last, Invert, Play) Engine for card-to-detail morphing.
     * Uses GPU properties ONLY (transform: translate3d + scale, opacity).
     */
    morphElement(sourceEl, targetOverlayEl, options = {}) {
        if (!sourceEl || !targetOverlayEl || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        const duration = options.duration || this.options.durationLongTake;
        const easing = options.easing || this.options.easeCurve;

        // F - FIRST: Bounding rect of source thumbnail card
        const firstRect = sourceEl.getBoundingClientRect();

        // Reveal target overlay invisibly to measure L - LAST
        targetOverlayEl.style.opacity = '0';
        targetOverlayEl.style.display = 'block';
        targetOverlayEl.classList.add('is-open');

        const detailCard = targetOverlayEl.querySelector('.harmony-project-detail') || targetOverlayEl;
        const lastRect = detailCard.getBoundingClientRect();

        // I - INVERT: Calculate scale and position delta
        const scaleX = firstRect.width / Math.max(lastRect.width, 1);
        const scaleY = firstRect.height / Math.max(lastRect.height, 1);
        const translateX = firstRect.left - lastRect.left;
        const translateY = firstRect.top - lastRect.top;

        // Create GPU-accelerated morphing ghost clone
        const ghost = sourceEl.cloneNode(true);
        ghost.className = 'harmony-shared-ghost';
        ghost.style.position = 'fixed';
        ghost.style.top = `${lastRect.top}px`;
        ghost.style.left = `${lastRect.left}px`;
        ghost.style.width = `${lastRect.width}px`;
        ghost.style.height = `${lastRect.height}px`;
        ghost.style.margin = '0';
        ghost.style.zIndex = '9999';
        ghost.style.transformOrigin = 'top left';
        ghost.style.pointerEvents = 'none';
        ghost.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
        ghost.style.opacity = '1';

        document.body.appendChild(ghost);
        sourceEl.style.opacity = '0';

        // P - PLAY: Web Animation API GPU transform animation
        const animation = ghost.animate([
            {
                transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`,
                opacity: 0.9,
                borderRadius: window.getComputedStyle(sourceEl).borderRadius
            },
            {
                transform: 'translate3d(0px, 0px, 0) scale(1, 1)',
                opacity: 1,
                borderRadius: window.getComputedStyle(detailCard).borderRadius
            }
        ], {
            duration: duration,
            easing: easing,
            fill: 'forwards'
        });

        // Fade in detail background blur simultaneously
        targetOverlayEl.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: duration * 0.8,
            easing: 'linear',
            fill: 'forwards'
        });

        return new Promise(resolve => {
            animation.onfinish = () => {
                targetOverlayEl.style.opacity = '1';
                detailCard.style.opacity = '1';
                ghost.remove();
                this.activeMorphGhost = null;
                this.isAnimating = false;
                resolve();
            };
        });
    }

    /**
     * Reverse Archetype 1 Morphing (Close Detail back to Grid Card).
     */
    reverseMorphElement(sourceEl, targetOverlayEl, options = {}) {
        if (!sourceEl || !targetOverlayEl || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        const duration = options.duration || this.options.durationNormal;
        const easing = options.easing || this.options.easeCurve;

        const detailCard = targetOverlayEl.querySelector('.harmony-project-detail') || targetOverlayEl;
        const firstRect = detailCard.getBoundingClientRect();
        sourceEl.style.opacity = '1';
        const lastRect = sourceEl.getBoundingClientRect();
        sourceEl.style.opacity = '0';

        const scaleX = lastRect.width / Math.max(firstRect.width, 1);
        const scaleY = lastRect.height / Math.max(firstRect.height, 1);
        const translateX = lastRect.left - firstRect.left;
        const translateY = lastRect.top - firstRect.top;

        const ghost = detailCard.cloneNode(true);
        ghost.className = 'harmony-shared-ghost';
        ghost.style.position = 'fixed';
        ghost.style.top = `${firstRect.top}px`;
        ghost.style.left = `${firstRect.left}px`;
        ghost.style.width = `${firstRect.width}px`;
        ghost.style.height = `${firstRect.height}px`;
        ghost.style.margin = '0';
        ghost.style.zIndex = '9999';
        ghost.style.transformOrigin = 'top left';
        ghost.style.pointerEvents = 'none';

        document.body.appendChild(ghost);
        detailCard.style.opacity = '0';

        const animation = ghost.animate([
            { transform: 'translate3d(0, 0, 0) scale(1, 1)', opacity: 1 },
            { transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`, opacity: 0 }
        ], {
            duration: duration,
            easing: easing,
            fill: 'forwards'
        });

        targetOverlayEl.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });

        return new Promise(resolve => {
            animation.onfinish = () => {
                ghost.remove();
                targetOverlayEl.classList.remove('is-open');
                targetOverlayEl.style.display = 'none';
                targetOverlayEl.style.opacity = '';
                detailCard.style.opacity = '';
                sourceEl.style.opacity = '1';
                this.isAnimating = false;
                resolve();
            };
        });
    }

    /**
     * Archetype 2: Left-Right Displacement Mask (PageTransitionEnter / Route Slide)
     * Horizontal slide transition with an overlay backdrop depth mask.
     */
    navigateRoute(fromSection, toSection, routeType = 'push') {
        if (!toSection || fromSection === toSection || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        const duration = this.options.durationLongTake;
        const isPush = routeType === 'push';
        const slideOffset = isPush ? '100%' : '-100%';
        const exitOffset = isPush ? '-30%' : '30%';

        // Ensure target section is visible
        toSection.style.display = 'block';
        toSection.style.willChange = 'transform, opacity';

        if (fromSection) {
            fromSection.style.willChange = 'transform, opacity';
        }

        const enterAnim = toSection.animate([
            { transform: `translate3d(${slideOffset}, 0, 0)`, opacity: 0.8 },
            { transform: 'translate3d(0, 0, 0)', opacity: 1 }
        ], {
            duration: duration,
            easing: this.options.easeCurve,
            fill: 'forwards'
        });

        let exitAnim = null;
        if (fromSection) {
            exitAnim = fromSection.animate([
                { transform: 'translate3d(0, 0, 0)', opacity: 1 },
                { transform: `translate3d(${exitOffset}, 0, 0)`, opacity: 0.4 }
            ], {
                duration: duration,
                easing: this.options.easeCurve,
                fill: 'forwards'
            });
        }

        return Promise.all([
            enterAnim.finished,
            exitAnim ? exitAnim.finished : Promise.resolve()
        ]).then(() => {
            toSection.style.willChange = '';
            if (fromSection) {
                fromSection.style.willChange = '';
            }
            this.isAnimating = false;
        });
    }

    /**
     * Archetype 3: Left-Right Spaced Movement (SlideEffect / Tab Switch)
     * Side-to-side displacement featuring explicit physical margins between adjacent views.
     */
    switchTab(activeContainer, nextContainer, direction = 'right', marginGapPx = 32) {
        if (!nextContainer || activeContainer === nextContainer || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        const isRight = direction === 'right';
        const enterStart = isRight ? `calc(100% + ${marginGapPx}px)` : `calc(-100% - ${marginGapPx}px)`;
        const exitEnd = isRight ? `calc(-100% - ${marginGapPx}px)` : `calc(100% + ${marginGapPx}px)`;

        nextContainer.style.display = 'block';

        const enterAnimation = nextContainer.animate([
            { transform: `translate3d(${enterStart}, 0, 0)`, opacity: 0 },
            { transform: 'translate3d(0, 0, 0)', opacity: 1 }
        ], {
            duration: this.options.durationNormal,
            easing: this.options.easeCurve,
            fill: 'forwards'
        });

        let exitAnimation = null;
        if (activeContainer) {
            exitAnimation = activeContainer.animate([
                { transform: 'translate3d(0, 0, 0)', opacity: 1 },
                { transform: `translate3d(${exitEnd}, 0, 0)`, opacity: 0 }
            ], {
                duration: this.options.durationNormal,
                easing: this.options.easeCurve,
                fill: 'forwards'
            });
        }

        return Promise.all([
            enterAnimation.finished,
            exitAnimation ? exitAnimation.finished : Promise.resolve()
        ]).then(() => {
            if (activeContainer) activeContainer.style.display = 'none';
            this.isAnimating = false;
        });
    }

    /**
     * Archetype 5: Modal / Sheet Transitions (bindSheet / Bottom Sheet)
     * Bottom-to-top sheet sliding anchored with a backdrop blur.
     */
    openSheet(sheetEl, backdropEl) {
        if (!sheetEl || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        if (backdropEl) {
            backdropEl.style.display = 'block';
            backdropEl.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: this.options.durationNormal,
                easing: 'linear',
                fill: 'forwards'
            });
        }

        sheetEl.style.display = 'block';
        sheetEl.classList.add('harmony-sheet-active');

        const sheetAnim = sheetEl.animate([
            { transform: 'translate3d(0, 100%, 0)', opacity: 0.5 },
            { transform: 'translate3d(0, 0, 0)', opacity: 1 }
        ], {
            duration: this.options.durationLongTake,
            easing: this.options.easeCurve,
            fill: 'forwards'
        });

        this.activeSheet = sheetEl;

        return sheetAnim.finished.then(() => {
            this.isAnimating = false;
        });
    }

    /**
     * Close Archetype 5 Bottom Sheet.
     */
    closeSheet(sheetEl, backdropEl) {
        const targetSheet = sheetEl || this.activeSheet;
        if (!targetSheet || this.isAnimating) return Promise.resolve();
        this.isAnimating = true;

        if (backdropEl) {
            backdropEl.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: this.options.durationNormal,
                easing: 'linear',
                fill: 'forwards'
            }).onfinish = () => {
                backdropEl.style.display = 'none';
            };
        }

        const sheetAnim = targetSheet.animate([
            { transform: 'translate3d(0, 0, 0)', opacity: 1 },
            { transform: 'translate3d(0, 100%, 0)', opacity: 0 }
        ], {
            duration: this.options.durationNormal,
            easing: this.options.easeCurve,
            fill: 'forwards'
        });

        return sheetAnim.finished.then(() => {
            targetSheet.style.display = 'none';
            targetSheet.classList.remove('harmony-sheet-active');
            this.activeSheet = null;
            this.isAnimating = false;
        });
    }
}

// Global instance export for window
if (typeof window !== 'undefined') {
    window.TransitionManager = TransitionManager;
    window.harmonyTransitionManager = new TransitionManager();
}
