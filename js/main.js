(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initAuditForm();
        initContactForm();
        initEcosystemHighlights();
        initSkillsFilter();
        initSettingsDrawer();
        initCookieConsent();
    }, { once: true });

    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navLinks');
        if (!toggle || !menu) return;

        const closeMenu = () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-menu-open');
        };

        const toggleMenu = () => {
            const isOpen = menu.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-menu-open', isOpen);
        };

        toggle.addEventListener('click', toggleMenu);
        menu.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));
        document.addEventListener('click', (event) => {
            if (menu.classList.contains('open') && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
        });
    }

    function initAuditForm() {
        const form = document.getElementById('auditForm');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const url = form.querySelector('#auditUrl');
            const name = form.querySelector('#auditName');
            const email = form.querySelector('#auditEmail');
            const phone = form.querySelector('#auditPhone');
            const message = document.getElementById('auditSuccess');
            const fields = [url, name, email, phone].filter(Boolean);

            fields.forEach((field) => { field.style.borderColor = ''; });
            if (fields.length !== 4 || fields.some((field) => !field.value.trim())) {
                shakeElement(form);
                return;
            }
            if (!validateEmail(email.value.trim())) {
                email.style.borderColor = '#ef4444';
                shakeElement(email);
                return;
            }

            showSuccess(message, 'Audit query validated. Opening your email client…');
            const subject = encodeURIComponent(`Website Audit Request - ${name.value.trim()}`);
            const body = encodeURIComponent([
                'Hello Pratheesh,', '',
                'I would like to request a FREE Website Health Audit for my digital page.', '',
                'Contact Details:',
                `- Client Name: ${name.value.trim()}`,
                `- Website URL: ${url.value.trim()}`,
                `- Email Address: ${email.value.trim()}`,
                `- Phone Number: ${phone.value.trim()}`, '',
                'Please let me know once you have analyzed the core metrics.',
            ].join('\n'));
            openMailClient(`mailto:pratheesh.clement@gmail.com?subject=${subject}&body=${body}`, form, message);
        });
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = form.querySelector('#fname');
            const email = form.querySelector('#femail');
            const phone = form.querySelector('#fphone');
            const business = form.querySelector('#fbusiness');
            const website = form.querySelector('#fweburl');
            const detail = form.querySelector('#fmessage');
            const message = document.getElementById('formSuccess');
            const fields = [name, email, phone, business, detail].filter(Boolean);

            fields.forEach((field) => { field.style.borderColor = ''; });
            if (fields.length !== 5 || fields.some((field) => !field.value.trim())) {
                shakeElement(form);
                return;
            }
            if (!validateEmail(email.value.trim())) {
                email.style.borderColor = '#ef4444';
                shakeElement(email);
                return;
            }

            const services = Array.from(form.querySelectorAll('input[name="services"]:checked'))
                .map((input) => input.value)
                .join(', ') || 'Not specified';
            showSuccess(message, 'Message validated. Opening your email client…');
            const subject = encodeURIComponent(`Project Inquiry from ${name.value.trim()} (${business.value.trim()})`);
            const body = encodeURIComponent([
                'Hello Pratheesh,', '',
                'I would like to discuss a potential project or consultation.', '',
                'Project Brief & Details:',
                `- Client Name: ${name.value.trim()}`,
                `- Business Name: ${business.value.trim()}`,
                `- Email Address: ${email.value.trim()}`,
                `- Phone Number: ${phone.value.trim()}`,
                `- Website URL: ${website?.value.trim() || 'N/A'}`,
                `- Services Required: ${services}`, '',
                'Message / Scope of Work:',
                detail.value.trim(), '',
                'Looking forward to scheduling an alignment call.',
            ].join('\n'));
            openMailClient(`mailto:pratheesh.clement@gmail.com?subject=${subject}&body=${body}`, form, message);
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showSuccess(element, text) {
        if (!element) return;
        element.className = 'form-message-box success show';
        element.innerHTML = `<i class="fas fa-check-circle"></i><span>${text}</span>`;
    }

    function openMailClient(url, form, message) {
        window.setTimeout(() => {
            window.location.href = url;
            form.reset();
            message?.classList.remove('show');
        }, 450);
    }

    function shakeElement(element) {
        element.classList.remove('shake');
        requestAnimationFrame(() => element.classList.add('shake'));
        window.setTimeout(() => element.classList.remove('shake'), 350);
    }

    function initEcosystemHighlights() {
        const nodes = Array.from(document.querySelectorAll('.eco-node'));
        const items = Array.from(document.querySelectorAll('.eco-features li'));
        if (!nodes.length || !items.length) return;

        const setActive = (key) => {
            nodes.forEach((node) => node.classList.toggle('active', node.dataset.eco === key));
            items.forEach((item) => item.classList.toggle('active', item.dataset.eco === key));
        };
        const clearActive = () => setActive('');

        [...nodes, ...items].forEach((element) => {
            element.addEventListener('mouseenter', () => setActive(element.dataset.eco));
            element.addEventListener('mouseleave', clearActive);
            element.addEventListener('focus', () => setActive(element.dataset.eco));
            element.addEventListener('blur', clearActive);
        });
    }

    function initSkillsFilter() {
        const tags = Array.from(document.querySelectorAll('.skills-cloud-container .skill-tag'));
        const cards = Array.from(document.querySelectorAll('.skill-showcase-card'));
        if (!tags.length || !cards.length) return;

        tags.forEach((tag) => {
            tag.setAttribute('role', 'button');
            tag.tabIndex = 0;
            const applyFilter = () => {
                const filter = tag.textContent.trim().toLowerCase();
                tags.forEach((item) => item.classList.toggle('active', item === tag));
                cards.forEach((card) => {
                    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const show = filter.includes('all') || filter.includes(title) || title.includes(filter);
                    card.hidden = !show;
                });
            };
            tag.addEventListener('click', applyFilter);
            tag.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    applyFilter();
                }
            });
        });
    }

    function initSettingsDrawer() {
        const fab = document.getElementById('settingsFab');
        const drawer = document.getElementById('settingsDrawer');
        const closeButton = document.getElementById('settingsCloseBtn');
        const backdrop = document.getElementById('settingsDrawerBackdrop');
        if (!fab || !drawer) return;

        const close = () => {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
        };

        const toggle = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const open = drawer.classList.toggle('open');
            drawer.setAttribute('aria-hidden', String(!open));
            if (open) closeButton?.focus({ preventScroll: true });
        };

        let lastTriggerTime = 0;
        const handleFabTrigger = (e) => {
            const now = Date.now();
            if (now - lastTriggerTime < 250) return;
            lastTriggerTime = now;
            toggle(e);
        };

        fab.addEventListener('pointerdown', handleFabTrigger);
        fab.addEventListener('click', handleFabTrigger);

        closeButton?.addEventListener('click', close);
        backdrop?.addEventListener('click', close);

        document.addEventListener('pointerdown', (event) => {
            if (drawer.classList.contains('open') && !drawer.contains(event.target) && !fab.contains(event.target)) {
                close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && drawer.classList.contains('open')) close();
        });

        const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
        const applyTheme = (button, persist) => {
            const primary = button.dataset.primary;
            const secondary = button.dataset.secondary;
            const hue = Number.parseInt(button.dataset.hue, 10);
            if (!primary || !secondary || Number.isNaN(hue)) return;

            themeButtons.forEach((item) => item.classList.toggle('active', item === button));
            const root = document.documentElement;
            window.currentThemeHue = hue;
            root.style.setProperty('--primary', primary);
            root.style.setProperty('--secondary', secondary);
            root.style.setProperty('--primary-glow', `${primary}66`);
            root.style.setProperty('--secondary-glow', `${secondary}66`);
            if (persist) {
                localStorage.setItem('selected-theme-hue', String(hue));
                localStorage.setItem('selected-theme-primary', primary);
                localStorage.setItem('selected-theme-secondary', secondary);
            }
        };

        themeButtons.forEach((button) => button.addEventListener('click', () => applyTheme(button, true)));
        const savedHue = localStorage.getItem('selected-theme-hue');
        const savedButton = themeButtons.find((button) => button.dataset.hue === savedHue);
        if (savedButton) applyTheme(savedButton, false);

        const highMotion = document.getElementById('motionHigh');
        const lowMotion = document.getElementById('motionLow');
        const setMotionMode = (low) => {
            document.body.classList.toggle('low-motion', low);
            highMotion?.classList.toggle('active', !low);
            lowMotion?.classList.toggle('active', low);
            localStorage.setItem('settings-low-motion', String(low));
        };
        highMotion?.addEventListener('click', () => setMotionMode(false));
        lowMotion?.addEventListener('click', () => setMotionMode(true));
        if (localStorage.getItem('settings-low-motion') === 'true') setMotionMode(true);
    }

    function initCookieConsent() {
        const STORAGE_KEY = 'pratheesh_cookie_consent';
        const banner = document.getElementById('cookie-consent-banner');
        const modal = document.getElementById('cookie-consent-modal');
        if (!banner || !modal) return;

        const btnAcceptAll = document.getElementById('cookie-accept-all');
        const btnRejectAll = document.getElementById('cookie-reject-all');
        const btnCustomize = document.getElementById('cookie-customize');
        const modalClose = document.getElementById('cookie-modal-close');
        const modalSave = document.getElementById('cookie-save-preferences');
        const modalAcceptAll = document.getElementById('cookie-modal-accept-all');

        const toggleAnalytics = document.getElementById('cookie-toggle-analytics');
        const toggleMarketing = document.getElementById('cookie-toggle-marketing');
        const togglePreferences = document.getElementById('cookie-toggle-preferences');
        const toggleFunctional = document.getElementById('cookie-toggle-functional');

        const savedConsent = localStorage.getItem(STORAGE_KEY);
        let consentState = savedConsent ? JSON.parse(savedConsent) : null;

        function updateBannerOffset() {
            if (banner && !banner.hidden) {
                const bannerHeight = Math.max(140, Math.round(banner.getBoundingClientRect().height));
                document.documentElement.style.setProperty('--cookie-banner-height', `${bannerHeight}px`);
                document.body.classList.add('cookie-banner-active');
            } else {
                document.body.classList.remove('cookie-banner-active');
            }
        }

        function applyScripts(consent) {
            if (!consent) return;

            // 1. Analytics Consent -> Google Analytics GA4
            if (consent.analytics && !window.gaLoaded) {
                window.gaLoaded = true;
                const gaScript = document.createElement('script');
                gaScript.async = true;
                gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID';
                document.head.appendChild(gaScript);

                window.dataLayer = window.dataLayer || [];
                function gtag() { window.dataLayer.push(arguments); }
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'G-MEASUREMENT_ID', { anonymize_ip: true });
            }

            // 2. Marketing Consent -> Meta Pixel
            if (consent.marketing && typeof window.fbq === 'function') {
                try {
                    window.fbq('init', '983425767341384');
                    window.fbq('track', 'PageView');
                } catch (e) {
                    console.warn('Meta Pixel Consent Init Error:', e);
                }
            }
        }

        function saveConsent(state) {
            consentState = Object.assign({ necessary: true, analytics: false, marketing: false, preferences: false, functional: false }, state);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consentState));
            applyScripts(consentState);

            banner.classList.remove('show');
            window.setTimeout(() => {
                banner.hidden = true;
                document.body.classList.remove('cookie-banner-active');
            }, 400);
            closeModal();
        }

        function openModal() {
            if (consentState) {
                if (toggleAnalytics) toggleAnalytics.checked = !!consentState.analytics;
                if (toggleMarketing) toggleMarketing.checked = !!consentState.marketing;
                if (togglePreferences) togglePreferences.checked = !!consentState.preferences;
                if (toggleFunctional) toggleFunctional.checked = !!consentState.functional;
            }
            modal.hidden = false;
            requestAnimationFrame(() => modal.classList.add('open'));
            modalClose?.focus();
            trapFocus(modal);
        }

        function closeModal() {
            modal.classList.remove('open');
            window.setTimeout(() => { modal.hidden = true; }, 400);
            removeFocusTrap();
        }

        let focusTrapHandler = null;

        function trapFocus(element) {
            const focusables = Array.from(element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            focusTrapHandler = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            };
            element.addEventListener('keydown', focusTrapHandler);
        }

        function removeFocusTrap() {
            if (focusTrapHandler && modal) {
                modal.removeEventListener('keydown', focusTrapHandler);
            }
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        if (!consentState) {
            banner.hidden = false;
            window.setTimeout(() => {
                banner.classList.add('show');
                updateBannerOffset();
            }, 600);
        } else {
            applyScripts(consentState);
        }

        btnAcceptAll?.addEventListener('click', () => saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true, functional: true }));
        btnRejectAll?.addEventListener('click', () => saveConsent({ necessary: true, analytics: false, marketing: false, preferences: false, functional: false }));
        btnCustomize?.addEventListener('click', openModal);

        modalClose?.addEventListener('click', closeModal);
        modalAcceptAll?.addEventListener('click', () => saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true, functional: true }));
        modalSave?.addEventListener('click', () => {
            saveConsent({
                necessary: true,
                analytics: toggleAnalytics ? toggleAnalytics.checked : false,
                marketing: toggleMarketing ? toggleMarketing.checked : false,
                preferences: togglePreferences ? togglePreferences.checked : false,
                functional: toggleFunctional ? toggleFunctional.checked : false,
            });
        });

        window.addEventListener('resize', updateBannerOffset, { passive: true });
    }
})();