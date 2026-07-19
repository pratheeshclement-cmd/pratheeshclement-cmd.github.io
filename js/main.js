/* ==========================================================================
   PRATHEESH CLEMENT — PORTFOLIO  |  js/main.js
   Desc: Core interaction scripting covering navigation states, mobile
         toggle, offsets scroll, scroll-progress, back-to-top, and mailto forms.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initStickyNav();
        initMobileMenu();
        initActiveLinks();
        initSmoothScroll();
        initScrollProgress();
        initBackToTop();
        initAuditForm();
        initContactForm();
        initScrollTransitions();
        initEcosystemHighlights();
        initSettingsDrawer();
    });

    /* ─────────────────────────────────────────────
       1. STICKY NAV HEADER
       ───────────────────────────────────────────── */
    function initStickyNav() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        const handleScroll = () => {
            if (window.scrollY > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Run once in case page loads scrolled down
    }

    /* ─────────────────────────────────────────────
       2. MOBILE MENU TOGGLE
       ───────────────────────────────────────────── */
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navLinks');
        if (!toggle || !menu) return;

        const openMenu = () => {
            const open = menu.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        };

        toggle.addEventListener('click', openMenu);

        // Close when clicking nav links
        menu.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside of menu
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('open') &&
                !menu.contains(e.target) &&
                !toggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    /* ─────────────────────────────────────────────
       3. ACTIVE NAVIGATION LINK ON SCROLL
       ───────────────────────────────────────────── */
    function initActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        const nav = document.getElementById('nav');

        const updateActive = () => {
            const scrollY = window.scrollY;
            const navHeight = nav ? nav.offsetHeight : 80;
            const buffer = 40;

            sections.forEach((sec) => {
                const top = sec.offsetTop - navHeight - buffer;
                const bottom = top + sec.offsetHeight;
                const id = sec.getAttribute('id');

                if (scrollY >= top && scrollY < bottom) {
                    navLinks.forEach((link) => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* ─────────────────────────────────────────────
       4. SMOOTH SCROLL ROUTING WITH NAVBAR OFFSET
       ───────────────────────────────────────────── */
    function initSmoothScroll() {
        const nav = document.getElementById('nav');

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#main-content') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 80;
                const buffer = 20;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - buffer;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ─────────────────────────────────────────────
       5. SCROLL PROGRESS INDICATOR
       ───────────────────────────────────────────── */
    function initScrollProgress() {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
            bar.style.width = `${progress}%`;
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────
       6. BACK TO TOP BUTTON
       ───────────────────────────────────────────── */
    function initBackToTop() {
        const btt = document.getElementById('bttBtn');
        if (btt) return; // Prevent duplicate if it exists in markup

        const btn = document.createElement('button');
        btn.id = 'bttBtn';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─────────────────────────────────────────────
       7. AUDIT REQUEST FORM HANDLER (mailto redirection)
       ───────────────────────────────────────────── */
    function initAuditForm() {
        const form = document.getElementById('auditForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const urlInput = form.querySelector('#auditUrl');
            const nameInput = form.querySelector('#auditName');
            const emailInput = form.querySelector('#auditEmail');
            const phoneInput = form.querySelector('#auditPhone');
            const msgBox = document.getElementById('auditSuccess');

            // Reset field borders
            [urlInput, nameInput, emailInput, phoneInput].forEach(inp => inp.style.borderColor = '');

            // Simple validation
            if (!urlInput.value.trim() || !nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
                shakeElement(form);
                return;
            }

            if (!validateEmail(emailInput.value.trim())) {
                emailInput.style.borderColor = '#ef4444';
                shakeElement(emailInput);
                return;
            }

            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            // Success feedback
            msgBox.className = 'form-message-box success show';
            msgBox.innerHTML = '<i class="fas fa-check-circle"></i><span>Audit query validated! Redirecting to email...</span>';

            // Build mailto link
            const subject = encodeURIComponent(`Website Audit Request - ${name}`);
            const body = encodeURIComponent(
                `Hello Pratheesh,\n\n` +
                `I would like to request a FREE Website Health Audit for my digital page.\n\n` +
                `Contact Details:\n` +
                `- Client Name: ${name}\n` +
                `- Website URL: ${url}\n` +
                `- Email Address: ${email}\n` +
                `- Phone Number: ${phone}\n\n` +
                `Please let me know once you have analyzed the core metrics.`
            );

            const mailtoUrl = `mailto:pratheesh.clement@gmail.com?subject=${subject}&body=${body}`;

            setTimeout(() => {
                window.location.href = mailtoUrl;
                form.reset();
                msgBox.classList.remove('show');
            }, 1200);
        });
    }

    /* ─────────────────────────────────────────────
       8. CONTACT FORM HANDLER (mailto redirection)
       ───────────────────────────────────────────── */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('#fname');
            const emailInput = form.querySelector('#femail');
            const phoneInput = form.querySelector('#fphone');
            const bizInput = form.querySelector('#fbusiness');
            const weburlInput = form.querySelector('#fweburl');
            const msgInput = form.querySelector('#fmessage');
            const msgBox = document.getElementById('formSuccess');

            // Reset field borders
            [nameInput, emailInput, phoneInput, bizInput, msgInput].forEach(inp => inp.style.borderColor = '');

            // Validate mandatory fields
            if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !bizInput.value.trim() || !msgInput.value.trim()) {
                shakeElement(form);
                return;
            }

            if (!validateEmail(emailInput.value.trim())) {
                emailInput.style.borderColor = '#ef4444';
                shakeElement(emailInput);
                return;
            }

            // Get checked services
            const checkedServices = [];
            form.querySelectorAll('input[name="services"]:checked').forEach((cb) => {
                checkedServices.push(cb.value);
            });

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const business = bizInput.value.trim();
            const website = weburlInput.value.trim() || 'N/A';
            const message = msgInput.value.trim();
            const services = checkedServices.length > 0 ? checkedServices.join(', ') : 'Not Specified';

            // Success feedback
            msgBox.className = 'form-message-box success show';
            msgBox.innerHTML = '<i class="fas fa-check-circle"></i><span>Message validated! Opening your email client...</span>';

            // Build mailto link
            const subject = encodeURIComponent(`Project Inquiry from ${name} (${business})`);
            const body = encodeURIComponent(
                `Hello Pratheesh,\n\n` +
                `I would like to discuss a potential project/consultation collaboration.\n\n` +
                `Project Brief & Details:\n` +
                `- Client Name: ${name}\n` +
                `- Business Name: ${business}\n` +
                `- Email Address: ${email}\n` +
                `- Phone Number: ${phone}\n` +
                `- Website URL: ${website}\n` +
                `- Services Required: ${services}\n\n` +
                `Message / Scope of Work:\n` +
                `${message}\n\n` +
                `Looking forward to scheduling an alignment call.`
            );

            const mailtoUrl = `mailto:pratheesh.clement@gmail.com?subject=${subject}&body=${body}`;

            setTimeout(() => {
                window.location.href = mailtoUrl;
                form.reset();
                msgBox.classList.remove('show');
            }, 1200);
        });
    }

    /* ─────────────────────────────────────────────
       HELPER UTILITIES
       ───────────────────────────────────────────── */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function shakeElement(el) {
        el.classList.add('shake');
        setTimeout(() => {
            el.classList.remove('shake');
        }, 500);
    }

    /* ─────────────────────────────────────────────
       9. SCROLL-DRIVEN TRANSITIONS ENGINE (Bazil/Apple Style)
       ───────────────────────────────────────────── */
    function initScrollTransitions() {
        const sectionIds = [
            'home', 'about', 'services', 'projects', 
            'ecosystem', 'skills', 'experience', 'testimonials', 
            'audit', 'contact'
        ];
        const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);
        const root = document.documentElement;

        // Space themes mapping (HSL Colors)
        const themes = {
            home: { h: 250, s: 20, l: 4 },
            about: { h: 260, s: 25, l: 5 },
            services: { h: 280, s: 30, l: 4 },
            projects: { h: 290, s: 20, l: 3 },
            ecosystem: { h: 220, s: 25, l: 5 },
            skills: { h: 250, s: 20, l: 4 },
            experience: { h: 270, s: 25, l: 4 },
            testimonials: { h: 280, s: 20, l: 4 },
            audit: { h: 250, s: 20, l: 4 },
            contact: { h: 250, s: 20, l: 4 }
        };

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            const viewportCenter = scrollTop + viewportHeight / 2;

            let activeSectionId = 'home';

            sections.forEach((sec) => {
                const secTop = sec.offsetTop;
                const secHeight = sec.offsetHeight;
                const secBottom = secTop + secHeight;

                // Center position calculations based on physical offsets
                const distanceFromCenter = (viewportCenter - (secTop + secHeight / 2)) / (viewportHeight / 2 + secHeight / 2);
                const clampedDist = Math.max(-1, Math.min(1, distanceFromCenter));
                const absDist = Math.abs(clampedDist);

                sec.style.setProperty('--scroll-center-pos', clampedDist.toFixed(3));
                sec.style.setProperty('--scroll-center-pos-abs', absDist.toFixed(3));

                // Identify active background section based on physical scroll centers
                if (viewportCenter >= secTop && viewportCenter < secBottom) {
                    activeSectionId = sec.getAttribute('id');
                }
            });

            // Set root HSL theme custom properties
            const activeTheme = themes[activeSectionId];
            if (activeTheme) {
                const themeHue = typeof window.currentThemeHue !== 'undefined' ? window.currentThemeHue : activeTheme.h;
                root.style.setProperty('--theme-h', themeHue);
                root.style.setProperty('--theme-s', `${activeTheme.s}%`);
                root.style.setProperty('--theme-l', `${activeTheme.l}%`);
            }

            // Update diagnostic telemetry readout
            const activeSectionReadout = document.getElementById('telActiveSection');
            const scrollVectorReadout = document.getElementById('telScrollVector');
            if (activeSectionReadout) activeSectionReadout.textContent = `// ${activeSectionId.toUpperCase()}`;
            if (scrollVectorReadout) scrollVectorReadout.textContent = scrollTop.toFixed(0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ─────────────────────────────────────────────
       10. ECOSYSTEM GRAPH LINKED HIGHLIGHTS
       ───────────────────────────────────────────── */
    function initEcosystemHighlights() {
        const nodes = document.querySelectorAll('.eco-node');
        const items = document.querySelectorAll('.eco-features li');
        if (nodes.length === 0 || items.length === 0) return;

        nodes.forEach((node) => {
            node.addEventListener('mouseenter', () => {
                const targetKey = node.getAttribute('data-eco');
                node.classList.add('active');
                items.forEach((item) => {
                    if (item.getAttribute('data-eco') === targetKey) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            });

            node.addEventListener('mouseleave', () => {
                node.classList.remove('active');
                items.forEach((item) => item.classList.remove('active'));
            });
        });

        items.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                const targetKey = item.getAttribute('data-eco');
                item.classList.add('active');
                nodes.forEach((node) => {
                    if (node.getAttribute('data-eco') === targetKey) {
                        node.classList.add('active');
                    } else {
                        node.classList.remove('active');
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('active');
                nodes.forEach((node) => node.classList.remove('active'));
            });
        });
    }

    /* ─────────────────────────────────────────────
       11. SYSTEM CONFIGURATION & ACCESSIBILITY PARAMETERS
       ───────────────────────────────────────────── */
    function initSettingsDrawer() {
        const fab = document.getElementById('settingsFab');
        const drawer = document.getElementById('settingsDrawer');
        const closeBtn = document.getElementById('settingsCloseBtn');
        const backdrop = document.getElementById('settingsDrawerBackdrop');

        if (!fab || !drawer) return;

        // Toggle drawer
        const toggleDrawer = () => {
            const isOpen = drawer.classList.toggle('open');
            drawer.setAttribute('aria-hidden', !isOpen);
        };

        const closeDrawer = () => {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
        };

        fab.addEventListener('click', toggleDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (backdrop) backdrop.addEventListener('click', closeDrawer);

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('open')) {
                closeDrawer();
            }
        });

        // Theme switching logic
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const hue = parseInt(btn.getAttribute('data-hue'), 10);
                const sat = btn.getAttribute('data-sat');
                const light = btn.getAttribute('data-light');
                const primary = btn.getAttribute('data-primary');
                const secondary = btn.getAttribute('data-secondary');

                // Set global hue override
                window.currentThemeHue = hue;

                // Update root styles
                const root = document.documentElement;
                root.style.setProperty('--primary', primary);
                root.style.setProperty('--secondary', secondary);
                root.style.setProperty('--primary-glow', primary + '66'); // hex 40% alpha
                root.style.setProperty('--secondary-glow', secondary + '66');

                // Store in localStorage
                localStorage.setItem('selected-theme-hue', hue);
                localStorage.setItem('selected-theme-primary', primary);
                localStorage.setItem('selected-theme-secondary', secondary);

                // Dispatch a scroll event to trigger background update
                window.dispatchEvent(new Event('scroll'));
            });
        });

        // Load saved theme if exists
        const savedHue = localStorage.getItem('selected-theme-hue');
        if (savedHue) {
            const savedPrimary = localStorage.getItem('selected-theme-primary');
            const savedSecondary = localStorage.getItem('selected-theme-secondary');

            const matchBtn = Array.from(themeButtons).find(b => b.getAttribute('data-hue') === savedHue);
            if (matchBtn) {
                themeButtons.forEach(b => b.classList.remove('active'));
                matchBtn.classList.add('active');
            }

            window.currentThemeHue = parseInt(savedHue, 10);
            const root = document.documentElement;
            root.style.setProperty('--primary', savedPrimary);
            root.style.setProperty('--secondary', savedSecondary);
            root.style.setProperty('--primary-glow', savedPrimary + '66');
            root.style.setProperty('--secondary-glow', savedSecondary + '66');
        }

        // Motion control modes
        const motionHigh = document.getElementById('motionHigh');
        const motionLow = document.getElementById('motionLow');

        if (motionHigh && motionLow) {
            const setMotionMode = (isLow) => {
                if (isLow) {
                    motionLow.classList.add('active');
                    motionHigh.classList.remove('active');
                    document.body.classList.add('low-motion');
                    localStorage.setItem('settings-low-motion', 'true');
                } else {
                    motionHigh.classList.add('active');
                    motionLow.classList.remove('active');
                    document.body.classList.remove('low-motion');
                    localStorage.setItem('settings-low-motion', 'false');
                }
            };

            motionHigh.addEventListener('click', () => setMotionMode(false));
            motionLow.addEventListener('click', () => setMotionMode(true));

            // Load saved motion state
            const savedLowMotion = localStorage.getItem('settings-low-motion');
            if (savedLowMotion === 'true') {
                setMotionMode(true);
            }
        }
    }

})();