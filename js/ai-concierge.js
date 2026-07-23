/* ==========================================================================
   PRATHEESH CLEMENT — DIGITAL ECOSYSTEM 6.0
   js/ai-concierge.js — ChatGPT-Like AI Portfolio Concierge & Memory Engine

   MODULES:
   01. Configuration & Global State
   02. Real-Time Memory Architecture & Rule-Based Memory Engine
   03. Dual Persistence & Session Recovery System
   04. Lenis Smooth Scroll Engine (Apple / Tesla / Vercel Momentum Scrolling)
   05. Custom Cursor & Interactive Micro-Interactions Engine
   06. Context & Section Awareness System
   07. Guided Tour Engine (Recruiter Mode, Client Mode, Role Profiling)
   08. AI Chat Engine & Gemini Serverless API Connector
   09. Smart Recommendation Engine
   10. Exit Intent & Inactivity Detection Systems
   11. Navigation & Toast Notification Systems
   ========================================================================== */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════
       01. CONFIGURATION
    ═══════════════════════════════════════════════════ */
    const CONFIG = {
        AI_ENDPOINT: '/api/chat',
        STORAGE_KEY: 'pratheesh_ai_memory_v6',
        WELCOME_DELAY_MS: 5000,          // 5 seconds after load
        INACTIVITY_TIMEOUT_MS: 30000,    // 30 seconds idle
        SECTION_TIP_DURATION_MS: 7000,   // Tip display duration
        TOUR_STEP_DELAY_MS: 1500,        // Step pause in tours

        ENABLE_LENIS: true,
        ENABLE_CURSOR: false,
        ENABLE_EXIT_INTENT: true,
        ENABLE_INACTIVITY: true,
        ENABLE_SECTION_AWARENESS: true,
    };

    /* ═══════════════════════════════════════════════════
       02. REAL-TIME MEMORY ARCHITECTURE (ChatGPT-Style State)
    ═══════════════════════════════════════════════════ */
    const memory = {
        visitorType: '',               // recruiter, client, founder, developer, startup, freelancer, student, exploring
        visitorName: '',
        intent: '',                    // hiring, client-project, general
        currentSection: 'home',
        currentPage: window.location.pathname || '/',
        scrollDepth: 0,
        timeOnPage: 0,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        portfolioInterests: [],        // e.g. ['SEO', 'Meta Ads', 'Web Development']
        servicesViewed: [],
        projectsViewed: [],
        skillsViewed: [],
        questionsAsked: [],
        conversationHistory: [],       // Full turn-by-turn memory
        aiRecommendations: [],
        lastVisitedSection: '',
        sessionStartTime: new Date().toISOString(),
        visitorJourney: [],            // Timeline of actions
        memoryContext: [],             // Derived facts from rule engine
        preferredCategory: '',
        resumeViewed: false,
        contactViewed: false,
        hireIntent: false,
        tourProgress: { role: null, step: 0, completed: [] },
    };

    // Global operational state
    const state = {
        kb: {},
        chatOpen: false,
        welcomeShown: false,
        exitIntentShown: false,
        inactivityShown: false,
        tourActive: false,
        lastActivity: Date.now(),
        sectionStartTime: Date.now(),
        sectionTipShown: {},
        inactivityTimer: null,
        lenis: null,
        isSessionRecovered: false,
    };

    /* ─────────────────── Sections Definition ─────────────────── */
    const SECTIONS = [
        { id: 'home',         label: 'Home' },
        { id: 'about',        label: 'About' },
        { id: 'services',     label: 'Services' },
        { id: 'projects',     label: 'Projects' },
        { id: 'ecosystem',    label: 'Ecosystem' },
        { id: 'skills',       label: 'Skills' },
        { id: 'experience',   label: 'Experience' },
        { id: 'contact',      label: 'Contact' },
    ];

    /* ─────────────────── Role Profiles ─────────────────── */
    const ROLE_PROFILES = {
        recruiter:   { label: 'Recruiter',      icon: 'fas fa-user-tie',       time: '2 Minutes', tour: ['about','projects','skills','experience','contact'] },
        hiring:      { label: 'Hiring Manager', icon: 'fas fa-briefcase',      time: '2 Minutes', tour: ['about','projects','skills','experience','contact'] },
        founder:     { label: 'Founder',        icon: 'fas fa-rocket',         time: '3 Minutes', tour: ['services','projects','about','contact'] },
        client:      { label: 'Client',         icon: 'fas fa-handshake',      time: '2 Minutes', tour: ['services','projects','contact'] },
        startup:     { label: 'Startup',        icon: 'fas fa-building',       time: '3 Minutes', tour: ['services','projects','skills','contact'] },
        developer:   { label: 'Developer',      icon: 'fas fa-code',           time: '3 Minutes', tour: ['projects','skills','ecosystem','contact'] },
        freelancer:  { label: 'Freelancer',     icon: 'fas fa-laptop-code',    time: '2 Minutes', tour: ['services','projects','contact'] },
        student:     { label: 'Student',        icon: 'fas fa-graduation-cap', time: '2 Minutes', tour: ['about','skills','experience','projects'] },
        exploring:   { label: 'Just Exploring', icon: 'fas fa-compass',        time: '3 Minutes', tour: ['home','about','projects','services','skills'] },
    };

    /* ─────────────────── Section Awareness Tips ─────────────────── */
    const SECTION_TIPS = {
        projects: {
            text: "Looks like you're interested in my projects! Would you like me to explain:",
            actions: ['Technologies Used', 'Challenges Solved', 'Results Achieved'],
            prompts: ['What technologies did you use in your projects?', 'What challenges did you solve in your projects?', 'What results did your projects achieve?'],
        },
        skills: {
            text: "Would you like me to explain my technical skill stack in detail?",
            actions: ['Technical Stack', 'AI & Automation', 'Marketing Tools'],
            prompts: ['Explain your technical skill stack', 'Tell me about your AI & automation tools', 'What marketing tools do you use?'],
        },
        services: {
            text: "Need help choosing the right service for your requirements?",
            actions: ['Find My Solution', 'Pricing & Rates', 'Free Audit'],
            prompts: ['What service is right for my project?', 'What are your rates and pricing?', 'Tell me about the free website audit'],
        },
        experience: {
            text: "I can summarize my professional experience in under 30 seconds. Want to hear it?",
            actions: ['30-Sec Summary', 'Google Certifications', 'Download Resume'],
            prompts: ['Summarize your professional experience in 30 seconds', 'Tell me about your Google certification', 'How do I download your resume?'],
        },
        ecosystem: {
            text: "Welcome to the Digital Ecosystem hub — connecting SEO, ads, AI, and analytics. Want to learn more?",
            actions: ['Explain Ecosystem', 'AI Integrations', 'Automation Flow'],
            prompts: ['Explain the Digital Ecosystem concept', 'What AI integrations do you use?', 'How do your automation workflows work?'],
        },
        contact: {
            text: "Ready to connect? Pratheesh is available for freelance projects and typically responds within 24 hours.",
            actions: ['Best Way to Reach', 'Book a Call', 'Request Audit'],
            prompts: ['What is the best way to contact you?', 'How can I book a call with you?', 'I want to request a free website audit'],
        },
    };

    /* ═══════════════════════════════════════════════════
       03. RULE-BASED MEMORY ENGINE
    ═══════════════════════════════════════════════════ */
    function evaluateRuleEngine(actionType, data) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        switch (actionType) {
            case 'SET_ROLE':
                memory.visitorType = data;
                logJourneyStep(timestamp, `Selected role: ${ROLE_PROFILES[data]?.label || data}`);
                addMemoryFact(`Visitor identified as ${ROLE_PROFILES[data]?.label || data}`);
                if (['recruiter', 'hiring'].includes(data)) memory.intent = 'hiring';
                if (['client', 'founder', 'startup'].includes(data)) memory.intent = 'client-project';
                break;

            case 'USER_QUERY':
                const text = String(data).toLowerCase();
                memory.questionsAsked.push(data);
                logJourneyStep(timestamp, `Asked: "${data.slice(0, 45)}${data.length > 45 ? '...' : ''}"`);

                // Rule: Role detection in query
                if (/recruiter|hiring manager|talent|hr /.test(text) && !memory.visitorType) {
                    memory.visitorType = 'recruiter';
                    addMemoryFact('Visitor mentioned recruiter background');
                } else if (/client|hire you|freelance|project for me|build my/.test(text) && !memory.visitorType) {
                    memory.visitorType = 'client';
                    addMemoryFact('Visitor mentioned client project interest');
                }

                // Rule: Domain Interest detection
                const interestRules = [
                    { keywords: ['seo', 'search engine', 'ranking', 'lighthouse', 'schema'], domain: 'SEO & Growth' },
                    { keywords: ['web', 'website', 'design', 'frontend', 'html', 'css', 'javascript', 'ui', 'ux'], domain: 'Web Development' },
                    { keywords: ['meta ads', 'facebook ads', 'instagram ads', 'cpl', 'ad funnel'], domain: 'Meta Ads' },
                    { keywords: ['google ads', 'pmax', 'ppc', 'search ads'], domain: 'Google Ads' },
                    { keywords: ['ai', 'automation', 'zapier', 'concierge', 'bot'], domain: 'AI & Automation' },
                    { keywords: ['brand', 'identity', 'logo', 'positioning'], domain: 'Branding' },
                ];

                interestRules.forEach(rule => {
                    if (rule.keywords.some(k => text.includes(k))) {
                        if (!memory.portfolioInterests.includes(rule.domain)) {
                            memory.portfolioInterests.push(rule.domain);
                        }
                        memory.preferredCategory = rule.domain;
                        addMemoryFact(`Interested in ${rule.domain}`);
                    }
                });

                // Rule: Hiring Intent detection
                if (/hire|available|work together|cost|rate|pricing|quote|meeting|book|contact|email|phone/.test(text)) {
                    memory.hireIntent = true;
                    memory.intent = 'hiring';
                    addMemoryFact('High hiring intent detected');
                }
                break;

            case 'SECTION_VISIT':
                memory.lastVisitedSection = memory.currentSection;
                memory.currentSection = data;
                logJourneyStep(timestamp, `Navigated to ${data.toUpperCase()} section`);

                if (data === 'projects' && !memory.projectsViewed.includes('Projects Overview')) {
                    memory.projectsViewed.push('Projects Overview');
                } else if (data === 'services' && !memory.servicesViewed.includes('Services Overview')) {
                    memory.servicesViewed.push('Services Overview');
                } else if (data === 'skills' && !memory.skillsViewed.includes('Skills Overview')) {
                    memory.skillsViewed.push('Skills Overview');
                } else if (data === 'contact') {
                    memory.contactViewed = true;
                    addMemoryFact('Visited Contact section');
                }
                break;

            case 'PROJECT_CLICK':
                if (!memory.projectsViewed.includes(data)) {
                    memory.projectsViewed.push(data);
                    logJourneyStep(timestamp, `Explored project: ${data}`);
                    addMemoryFact(`Explored project "${data}"`);
                }
                break;

            case 'SERVICE_CLICK':
                if (!memory.servicesViewed.includes(data)) {
                    memory.servicesViewed.push(data);
                    logJourneyStep(timestamp, `Explored service: ${data}`);
                    addMemoryFact(`Interested in service "${data}"`);
                }
                break;

            case 'RESUME_DOWNLOAD':
                memory.resumeViewed = true;
                memory.hireIntent = true;
                logJourneyStep(timestamp, 'Downloaded / Viewed Resume');
                addMemoryFact('Viewed/Downloaded Resume');
                break;

            case 'HIGH_INTEREST':
                addMemoryFact(`Spent extended time (>30s) on ${data.toUpperCase()} section`);
                break;
        }

        // Persist updated memory state
        saveMemoryState();
    }

    function addMemoryFact(fact) {
        if (!memory.memoryContext.includes(fact)) {
            memory.memoryContext.push(fact);
        }
    }

    function logJourneyStep(time, action) {
        memory.visitorJourney.push({ time, action });
        if (memory.visitorJourney.length > 20) memory.visitorJourney.shift();
    }

    /* ═══════════════════════════════════════════════════
       04. DUAL PERSISTENCE & SESSION RECOVERY
    ═══════════════════════════════════════════════════ */
    function saveMemoryState() {
        try {
            const serialized = JSON.stringify(memory);
            sessionStorage.setItem(CONFIG.STORAGE_KEY, serialized);
            localStorage.setItem(CONFIG.STORAGE_KEY, serialized);
        } catch (e) {
            console.warn('[Pratheesh AI Memory] Storage quota or disabled:', e);
        }
    }

    function loadMemoryState() {
        try {
            const sessionData = sessionStorage.getItem(CONFIG.STORAGE_KEY);
            const localData = localStorage.getItem(CONFIG.STORAGE_KEY);
            const raw = sessionData || localData;

            if (raw) {
                const restored = JSON.parse(raw);
                Object.assign(memory, restored);
                state.isSessionRecovered = true;
                console.log('[Pratheesh AI Memory] Restored session memory:', memory);
            }
        } catch (e) {
            console.warn('[Pratheesh AI Memory] Session restoration failed:', e);
        }
    }

    function getSessionRecoveryMessage() {
        const items = [];
        if (memory.visitorType) items.push(ROLE_PROFILES[memory.visitorType]?.label || memory.visitorType);
        if (memory.projectsViewed.length) items.push(`Projects (${memory.projectsViewed.length})`);
        if (memory.servicesViewed.length) items.push(`Services (${memory.servicesViewed.length})`);
        if (memory.portfolioInterests.length) items.push(`Topics: ${memory.portfolioInterests.join(', ')}`);
        if (memory.resumeViewed) items.push('Resume');

        const itemsStr = items.length ? items.join(' · ') : 'your previous exploration';
        return `Welcome back! 👋\n\nLast time you were exploring **${itemsStr}**.\n\nWould you like to continue from where you left off, or explore something new?`;
    }

    /* ═══════════════════════════════════════════════════
       05. LENIS SMOOTH SCROLL ENGINE
    ═══════════════════════════════════════════════════ */
    function initSmoothScroll() {
        if (!CONFIG.ENABLE_LENIS) return;

        if (window.lenis) {
            state.lenis = window.lenis;
            state.lenis.on('scroll', ({ scroll, limit, velocity }) => {
                const scrollDepth = Math.round((scroll / (limit || 1)) * 100);
                memory.scrollDepth = scrollDepth;
            });
            return;
        }

        if (typeof window.Lenis !== 'undefined') {
            try {
                state.lenis = new window.Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    smoothTouch: false,
                    touchMultiplier: 1.8,
                });

                function raf(time) {
                    state.lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);

                state.lenis.on('scroll', ({ scroll, limit, velocity }) => {
                    const scrollDepth = Math.round((scroll / (limit || 1)) * 100);
                    memory.scrollDepth = scrollDepth;
                    document.documentElement.style.setProperty('--scroll-velocity', velocity);
                });

                window.lenis = state.lenis;
            } catch (e) {
                console.warn('[Pratheesh AI] Lenis initialization fallback:', e);
            }
        }
    }

    /* ═══════════════════════════════════════════════════
       06. MICRO-INTERACTIONS & SPATIAL PULSE SYSTEM (GPU Accelerated)
    ═══════════════════════════════════════════════════ */
    function initCursorSystem() {
        const outer = document.getElementById('ai-cursor-outer');
        const dot = document.getElementById('ai-cursor-dot');

        // AI processing pulse triggers
        window.addEventListener('ai-thinking-start', () => {
            if (outer) outer.classList.add('cursor-ai');
            if (dot) dot.classList.add('cursor-ai');
        });
        window.addEventListener('ai-thinking-end', () => {
            if (outer) outer.classList.remove('cursor-ai');
            if (dot) dot.classList.remove('cursor-ai');
        });
    }

    /* ═══════════════════════════════════════════════════
       07. CONTEXT & SECTION AWARENESS SYSTEM
    ═══════════════════════════════════════════════════ */
    function initContextEngine() {
        const syncSectionMemory = (id) => {
            if (!id || memory.currentSection === id) return;
            evaluateRuleEngine('SECTION_VISIT', id);
            onSectionChange(id);
        };

        // HarmonyMotion owns viewport observation; memory receives its section
        // changes instead of creating a second competing observer.
        if (window.HarmonyMotion) {
            window.addEventListener('harmony:sectionchange', (event) => {
                syncSectionMemory(event.detail?.id);
            });
            syncSectionMemory(document.documentElement.dataset.harmonyActiveScene || 'home');
        } else {
            const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.35) syncSectionMemory(entry.target.id);
                });
            }, { threshold: 0.35 });
            sections.forEach((section) => observer.observe(section));
        }

        // High interest timer (30 seconds per section)
        setInterval(() => {
            memory.timeOnPage += 5;
            if (memory.currentSection && memory.currentSection !== 'home') {
                const timeSpent = (Date.now() - state.sectionStartTime) / 1000;
                if (timeSpent >= 30) {
                    evaluateRuleEngine('HIGH_INTEREST', memory.currentSection);
                }
            }
        }, 5000);

        // Track clicks on project links, services, resume
        document.addEventListener('click', (e) => {
            updateActivity();

            const projectCard = e.target.closest('.project-card, [data-project]');
            if (projectCard) {
                const title = projectCard.querySelector('h3, h4')?.textContent.trim() || projectCard.dataset.project || 'Featured Project';
                evaluateRuleEngine('PROJECT_CLICK', title);
            }

            const serviceCard = e.target.closest('.service-card, [data-service]');
            if (serviceCard) {
                const title = serviceCard.querySelector('h3, h4')?.textContent.trim() || serviceCard.dataset.service || 'Specialized Service';
                evaluateRuleEngine('SERVICE_CLICK', title);
            }

            const resumeBtn = e.target.closest('[href*="linkedin"], [href*="resume"], .btn-resume');
            if (resumeBtn) {
                evaluateRuleEngine('RESUME_DOWNLOAD', true);
            }
        });

        // User activity updates
        ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, updateActivity, { passive: true });
        });
    }

    function updateActivity() {
        state.lastActivity = Date.now();
        if (state.inactivityShown) hideInactivityNudge();
        resetInactivityTimer();
    }

    function onSectionChange(id) {
        state.sectionStartTime = Date.now();

        // Section tip trigger
        if (CONFIG.ENABLE_SECTION_AWARENESS && SECTION_TIPS[id] && !state.sectionTipShown[id] && state.welcomeShown) {
            setTimeout(() => showSectionTip(id), 1200);
        }
    }

    /* ═══════════════════════════════════════════════════
       08. GUIDED TOUR ENGINE (Role & Persona Based)
    ═══════════════════════════════════════════════════ */
    function showTourModal() {
        const modal = document.getElementById('ai-tour-modal');
        if (!modal) return;
        modal.classList.add('visible');

        modal.querySelectorAll('.ai-role-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                modal.querySelectorAll('.ai-role-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                const role = chip.dataset.role;

                evaluateRuleEngine('SET_ROLE', role);

                setTimeout(() => {
                    modal.classList.remove('visible');
                    if (role === 'client') {
                        setTimeout(startClientFlow, 400);
                    } else {
                        setTimeout(() => startGuidedTour(role), 400);
                    }
                }, 400);
            });
        });

        modal.querySelector('.ai-tour-skip')?.addEventListener('click', () => {
            modal.classList.remove('visible');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('visible');
        });
    }

    function startGuidedTour(role) {
        const profile = ROLE_PROFILES[role] || ROLE_PROFILES.exploring;
        state.tourActive = true;

        memory.tourProgress = { role, step: 0, completed: [] };
        saveMemoryState();

        showTourProgress(profile.tour);
        openChat(false);

        const roleMsg = getRoleTourMessage(role, profile.time);
        addAIMessage(roleMsg);

        runTourStep(profile.tour, 0);
    }

    function runTourStep(sections, index) {
        if (!state.tourActive || index >= sections.length) {
            if (state.tourActive) {
                state.tourActive = false;
                hideTourProgress();
                addAIMessage("That completes your guided tour! 🎯\n\nFeel free to ask me anything or click any section to dive deeper.");
            }
            return;
        }

        const sectionId = sections[index];
        memory.tourProgress.step = index;
        memory.tourProgress.completed.push(sectionId);
        saveMemoryState();

        // Highlight step dots
        document.querySelectorAll('.tour-step-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.classList.toggle('completed', i < index);
        });

        navigateToSection(sectionId);
        addAIMessage(getSectionTourMessage(sectionId));

        const delay = index === 0 ? 1000 : CONFIG.TOUR_STEP_DELAY_MS * 3;
        setTimeout(() => runTourStep(sections, index + 1), delay);
    }

    function getRoleTourMessage(role, time) {
        const msgs = {
            recruiter: `Welcome, Recruiter! 👋 Recommended for Recruiters:\n• Featured Projects\n• Technical Skills\n• Experience & Journey\n• Google Certifications\n• Resume\n\n⏱️ Estimated Viewing Time: ${time}. Let's begin!`,
            hiring: `Welcome! 👋 Recommended for Hiring Managers:\n• Featured Projects & Lighthouse Scores\n• Core Skill Stack\n• Professional Timeline\n\n⏱️ Estimated Viewing Time: ${time}. Let's explore!`,
            founder: `Welcome, Founder! 👋 Recommended for Founders & Scaling Businesses:\n• Specialized Services & AI Automation\n• Case Study Results\n• Growth Strategies\n\n⏱️ Estimated Viewing Time: ${time}. Let me show you!`,
            client: `Welcome! 👋 Recommended for Clients:\n• Web Development & SEO Services\n• Client Case Studies\n• Contact & Booking Options\n\n⏱️ Estimated Viewing Time: ${time}. Let's find your solution!`,
            startup: `Welcome! 👋 Recommended for Startups:\n• Web App Architecture & SEO\n• Lead Funnels & Meta Ads\n• Custom Growth Package\n\n⏱️ Estimated Viewing Time: ${time}. Let's explore!`,
            developer: `Hey fellow dev! 👋 Recommended for Tech Enthusiasts:\n• Technical SEO & Vanilla JS Architecture\n• Code Performance (100/100 Lighthouse)\n• GitHub Repositories & Tools\n\n⏱️ Estimated Viewing Time: ${time}. Let's dive in!`,
        };
        return msgs[role] || `Welcome to Pratheesh's Digital Ecosystem! 👋\n\nI'll walk you through the key highlights. Estimated Viewing Time: ${time}. Sit back and enjoy!`;
    }

    function getSectionTourMessage(sectionId) {
        const msgs = {
            home: "You're at the Home section — Pratheesh's Digital Ecosystem HQ, built with clean HTML5, Vanilla JS, and GPU-accelerated motion.",
            about: "📋 About section — Pratheesh Clement is a Freelance Digital Marketer, Web Developer, and SEO Specialist based in Chennai, India.",
            services: "⚡ Services section — 9 core services including Web Development, Technical SEO, Google/Meta Ads, AI Automation, and Personal Branding.",
            projects: "🏆 Projects section — 4 case studies: Portfolio Redesign (Lighthouse 100/100), SEO Growth Campaign, Restaurant Branding, and B2B Meta Ads Funnel.",
            ecosystem: "🌐 Digital Ecosystem — Centralized portal integrating web apps, conversion ad funnels, AI automations, and live analytics.",
            skills: "💡 Skills section — Technical SEO, Web Development, Google/Meta Ads, AI Automation, and UI/UX Design.",
            experience: "📅 Experience & Timeline — Google Fundamentals of Digital Marketing (IAB accredited), Nexteer Automotive Associate, and self-taught web dev.",
            contact: "📬 Contact section — Available for freelance projects! Reach out at pratheesh.clement@gmail.com or +91 8667876102. Response within 24 hours.",
        };
        return msgs[sectionId] || `Now viewing the ${sectionId.toUpperCase()} section.`;
    }

    function startClientFlow() {
        openChat(false);
        addAIMessage("What are you looking for today?");
        const options = [
            'Website Design', 'UI UX Design', 'SEO', 'Digital Marketing',
            'Meta Ads', 'Branding', 'AI Solutions', 'Consultation'
        ];
        addQuickOptions(options, (selected) => {
            addUserMessage(selected);
            evaluateRuleEngine('USER_QUERY', `I am looking for ${selected}`);
            const response = getClientServiceResponse(selected);
            setTimeout(() => addAIMessage(response), 600);
        });
    }

    function getClientServiceResponse(service) {
        const responses = {
            'Website Design': "Pratheesh builds high-performance, mobile-first websites using clean HTML5, CSS3, and JavaScript — optimized for speed, Core Web Vitals, and conversions. Would you like to view his Projects or schedule a quick call?",
            'UI UX Design': "Pratheesh specializes in glassmorphism, dark mode interfaces, micro-interactions, and responsive layouts. You are experiencing his design work right now! Want to discuss your design project?",
            'SEO': "Technical SEO is one of Pratheesh's core specialties — from schema markup to page speed, GA4 tracking, and organic visibility. He also offers a FREE Website Health Audit!",
            'Digital Marketing': "End-to-end digital growth linking organic SEO, Google Ads, Meta Ads, and AI automation to generate leads and scale your business.",
            'Meta Ads': "Custom audience targeting, retargeting funnels, and ad creative optimization that significantly reduces Cost Per Lead (CPL).",
            'Branding': "Building cohesive digital identities, logo layouts, visual design systems, and brand positioning that builds immediate trust.",
            'AI Solutions': "Workflow automation with Zapier, custom AI agents, and intelligent lead processing to save hours every week.",
            'Consultation': "A 1-on-1 strategic consultation to audit your current digital presence, identify bottlenecks, and build a growth roadmap.",
        };
        return responses[service] || `Pratheesh offers specialized ${service} services. Contact him directly at pratheesh.clement@gmail.com or +91 8667876102.`;
    }

    /* ═══════════════════════════════════════════════════
       09. AI CHAT ENGINE & GEMINI SERVERLESS CONNECTOR
    ═══════════════════════════════════════════════════ */
    function initChatPanel() {
        const fab = document.getElementById('ai-fab');
        const panel = document.getElementById('ai-chat-panel');
        const closeBtn = document.getElementById('ai-panel-close');
        const sendBtn = document.getElementById('ai-send-btn');
        const input = document.getElementById('ai-input');

        if (!fab || !panel) return;

        fab.addEventListener('click', () => state.chatOpen ? closeChat() : openChat(true));
        closeBtn?.addEventListener('click', closeChat);
        sendBtn?.addEventListener('click', sendMessage);

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        document.querySelectorAll('.ai-quick-q').forEach(q => {
            q.addEventListener('click', () => {
                const text = q.textContent.trim();
                if (input) input.value = text;
                sendMessage();
            });
        });

        document.getElementById('ai-nav-btn')?.addEventListener('click', () => openChat(true));
    }

    function openChat(showGreeting = true) {
        const panel = document.getElementById('ai-chat-panel');
        const fab = document.getElementById('ai-fab');
        if (!panel) return;

        panel.classList.add('open');
        fab?.querySelector('.ai-fab-icon')?.classList.replace('fa-chevron-up', 'fa-chevron-down');
        state.chatOpen = true;

        const container = document.getElementById('ai-messages');
        if (showGreeting && container?.children.length === 0) {
            if (state.isSessionRecovered && (memory.projectsViewed.length || memory.servicesViewed.length || memory.visitorType)) {
                addAIMessage(getSessionRecoveryMessage());
            } else {
                addInitialGreeting();
            }
        }

        setTimeout(() => document.getElementById('ai-input')?.focus(), 200);
    }

    function closeChat() {
        const panel = document.getElementById('ai-chat-panel');
        const fab = document.getElementById('ai-fab');
        if (!panel) return;
        panel.classList.remove('open');
        fab?.querySelector('.ai-fab-icon')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
        state.chatOpen = false;
    }

    function addInitialGreeting() {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        addAIMessage(`${greeting}! 👋 I'm Pratheesh AI — your personal guide through this Digital Ecosystem.\n\nI can help you explore projects, review technical skills, evaluate services, or navigate to any section.\n\nWhat would you like to explore today?`);
    }

    async function sendMessage() {
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send-btn');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        input.style.height = '40px';
        addUserMessage(text);

        // Execute Rule Engine on user query
        evaluateRuleEngine('USER_QUERY', text);

        // Push turn to conversation history
        memory.conversationHistory.push({ role: 'user', parts: [{ text }] });
        saveMemoryState();

        const typingId = showTypingIndicator();
        if (sendBtn) sendBtn.disabled = true;
        window.dispatchEvent(new Event('ai-thinking-start'));

        try {
            const response = await callGeminiAPI(text);

            hideTypingIndicator(typingId);
            addAIMessage(response);
            memory.conversationHistory.push({ role: 'model', parts: [{ text: response }] });
            saveMemoryState();

            processNavigationCommands(response);
        } catch (err) {
            hideTypingIndicator(typingId);
            try {
                const localResponse = await localKBResponse(text);
                addAIMessage(localResponse);
                memory.conversationHistory.push({ role: 'model', parts: [{ text: localResponse }] });
                saveMemoryState();
            } catch {
                addAIMessage("I'm having a moment — let me try that again.\n\nFor immediate assistance, reach Pratheesh directly at pratheesh.clement@gmail.com or +91 8667876102.");
            }
        } finally {
            if (sendBtn) sendBtn.disabled = false;
            window.dispatchEvent(new Event('ai-thinking-end'));
        }
    }

    async function callGeminiAPI(userMessage) {
        const context = {
            currentSection: memory.currentSection,
            scrollDepth: memory.scrollDepth,
            visitorRole: memory.visitorType,
            sectionsViewed: [
                ...(memory.projectsViewed.length ? ['projects'] : []),
                ...(memory.servicesViewed.length ? ['services'] : []),
                ...(memory.skillsViewed.length ? ['skills'] : []),
            ],
            deviceType: memory.deviceType,
        };

        const res = await fetch(CONFIG.AI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                context,
                memory,  // Complete Real-Time Memory Object 6.0
                history: memory.conversationHistory.slice(-10),
            }),
        });

        const data = await res.json();

        if (data.fallback) {
            return await localKBResponse(userMessage);
        }

        if (!res.ok || data.error) {
            throw new Error(data.error || `Server error: ${res.status}`);
        }

        return data.reply;
    }

    async function localKBResponse(question) {
        const q = question.toLowerCase();
        const kb = state.kb;
        const faq = kb['faq']?.faqs || [];

        const faqMatch = faq.find(f =>
            q.includes(f.question.toLowerCase().slice(0, 10)) ||
            f.question.toLowerCase().split(' ').some(w => w.length > 4 && q.includes(w))
        );
        if (faqMatch) return faqMatch.answer;

        if (/about|who are you|pratheesh|yourself|bio/.test(q)) {
            return (kb['about']?.bio || '') + '\n\n' + (kb['about']?.mission || '');
        }
        if (/project|work|case|portfolio|built/.test(q)) {
            const proj = kb['projects']?.projects;
            if (proj?.length) {
                return `Pratheesh has ${proj.length} featured case studies:\n\n${proj.map((p, i) => `${i+1}. ${p.title} — ${p.overview}`).join('\n\n')}\n\nWould you like me to scroll you to the Projects section?`;
            }
        }
        if (/skill|expertise|tech|stack|tool/.test(q)) {
            const cats = kb['skills']?.skillCategories;
            if (cats?.length) {
                return `Pratheesh's core technical stack:\n\n${cats.map(c => `• ${c.category} (${c.level}): ${c.skills.slice(0,3).join(', ')}`).join('\n')}`;
            }
        }
        if (/service|offer|provide|help/.test(q)) {
            const svcs = kb['services']?.services;
            if (svcs?.length) {
                return `Pratheesh offers 9 specialized services:\n\n${svcs.slice(0,5).map(s => `• ${s.title}`).join('\n')}\n...and more! Which service interests you most?`;
            }
        }
        if (/cert|google|qualification|credential/.test(q)) {
            const certs = kb['certifications']?.certifications;
            if (certs?.length) {
                const c = certs[0];
                return `${c.title} — issued by ${c.issuer} on ${c.issuedDate}.\n\nCompletion ID: ${c.completionId} (Verified). Accredited by ${c.accreditedBy?.join(' and ')}.`;
            }
        }
        if (/contact|email|phone|reach|message|hire/.test(q)) {
            return `Reach Pratheesh directly:\n\n📧 Email: pratheesh.clement@gmail.com\n📱 Phone/WhatsApp: +91 8667876102\n💼 LinkedIn: linkedin.com/in/mariya-pratheesh-5b8a9b316/\n\nResponse time: within 24 hours.`;
        }
        if (/resume|cv|download/.test(q)) {
            return `Pratheesh's resume is available on his LinkedIn profile or can be requested directly via email at pratheesh.clement@gmail.com.`;
        }

        return `Pratheesh is a Freelance Digital Marketer, Website Developer, and SEO Specialist available for projects.\n\nReach him directly at pratheesh.clement@gmail.com or +91 8667876102!`;
    }

    function processNavigationCommands(response) {
        const scrollMatch = response.match(/\[SCROLL:(\w+)\]/);
        if (scrollMatch) navigateToSection(scrollMatch[1]);
        if (response.includes('[OPEN_CONTACT]')) navigateToSection('contact');
        if (response.includes('[OPEN_GITHUB]')) window.open('https://github.com/pratheeshclement-cmd', '_blank', 'noopener');
    }

    /* ─────────────────── Message Rendering ─────────────────── */
    function addAIMessage(text) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'ai-message ai';
        const cleanText = text.replace(/\[SCROLL:\w+\]|\[OPEN_CONTACT\]|\[OPEN_GITHUB\]/g, '').trim();
        msg.innerHTML = `
            <div class="ai-msg-avatar">
                <img src="./asset/logo-profile.png" alt="Pratheesh AI" loading="lazy">
            </div>
            <div>
                <div class="ai-msg-bubble">${cleanText.replace(/\n/g, '<br>')}</div>
                <span class="ai-msg-time">${getTimeStr()}</span>
            </div>`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function addUserMessage(text) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'ai-message user';
        msg.innerHTML = `
            <div class="ai-msg-avatar user-avatar">You</div>
            <div>
                <div class="ai-msg-bubble">${escapeHtml(text)}</div>
                <span class="ai-msg-time">${getTimeStr()}</span>
            </div>`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function addQuickOptions(options, callback) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'ai-message ai';
        optionsDiv.innerHTML = `<div class="ai-msg-avatar"><img src="./asset/logo-profile.png" alt="Pratheesh AI" loading="lazy"></div>
            <div style="max-width: 100%;">
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.2rem 0;">
                    ${options.map(o => `<button class="ai-quick-option" data-option="${escapeHtml(o)}" style="background: rgba(0,240,255,0.07); border: 1px solid rgba(0,240,255,0.2); border-radius: 20px; padding: 0.35rem 0.75rem; font-size: 0.72rem; color: rgba(226,232,240,0.8); cursor: pointer; font-family: inherit; font-weight: 600; transition: all 0.2s ease;">${escapeHtml(o)}</button>`).join('')}
                </div>
            </div>`;

        container.appendChild(optionsDiv);
        container.scrollTop = container.scrollHeight;

        optionsDiv.querySelectorAll('.ai-quick-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.dataset.option;
                optionsDiv.remove();
                callback(selected);
            });
        });
    }

    function showTypingIndicator() {
        const container = document.getElementById('ai-messages');
        if (!container) return null;

        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.className = 'ai-typing-indicator';
        indicator.id = id;
        indicator.innerHTML = `
            <div class="ai-msg-avatar" style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(0,240,255,0.25);overflow:hidden;">
                <img src="./asset/logo-profile.png" alt="" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div class="ai-typing-dots">
                <span></span><span></span><span></span>
            </div>`;
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
        return id;
    }

    function hideTypingIndicator(id) {
        if (id) document.getElementById(id)?.remove();
    }

    /* ═══════════════════════════════════════════════════
       10. EXIT INTENT & INACTIVITY DETECTION
    ═══════════════════════════════════════════════════ */
    function initExitIntent() {
        if (!CONFIG.ENABLE_EXIT_INTENT || memory.deviceType === 'mobile') return;

        let triggered = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !triggered && state.welcomeShown && !state.exitIntentShown) {
                triggered = true;
                state.exitIntentShown = true;
                showExitIntent();
                setTimeout(() => { triggered = false; }, 30000);
            }
        });
    }

    function showExitIntent() {
        const el = document.getElementById('ai-exit-intent');
        if (!el) return;
        el.classList.add('visible');

        el.querySelectorAll('.ai-exit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                el.classList.remove('visible');
                const action = btn.dataset.action;
                if (action === 'resume') {
                    evaluateRuleEngine('RESUME_DOWNLOAD', true);
                    window.open('https://www.linkedin.com/in/mariya-pratheesh-5b8a9b316/', '_blank', 'noopener');
                } else if (action === 'projects') {
                    navigateToSection('projects');
                } else if (action === 'connect') {
                    navigateToSection('contact');
                } else if (action === 'message') {
                    openChat(true);
                }
            }, { once: true });
        });

        document.getElementById('ai-exit-dismiss')?.addEventListener('click', () => {
            el.classList.remove('visible');
        }, { once: true });

        el.addEventListener('click', (e) => {
            if (e.target === el) el.classList.remove('visible');
        });
    }

    function resetInactivityTimer() {
        clearTimeout(state.inactivityTimer);
        if (!CONFIG.ENABLE_INACTIVITY) return;
        state.inactivityTimer = setTimeout(() => {
            if (!state.inactivityShown && !state.chatOpen && state.welcomeShown) {
                showInactivityNudge();
            }
        }, CONFIG.INACTIVITY_TIMEOUT_MS);
    }

    function showInactivityNudge() {
        const el = document.getElementById('ai-inactivity-nudge');
        if (!el) return;
        state.inactivityShown = true;
        el.classList.add('visible');

        el.querySelector('.ai-nudge-cta')?.addEventListener('click', () => {
            hideInactivityNudge();
            openChat(true);
        }, { once: true });

        el.querySelector('.ai-nudge-dismiss')?.addEventListener('click', hideInactivityNudge, { once: true });
        setTimeout(hideInactivityNudge, 10000);
    }

    function hideInactivityNudge() {
        const el = document.getElementById('ai-inactivity-nudge');
        if (el) el.classList.remove('visible');
        state.inactivityShown = false;
    }

    /* ═══════════════════════════════════════════════════
       11. NAVIGATION & TOAST SYSTEM
    ═══════════════════════════════════════════════════ */
    function navigateToSection(sectionId) {
        const el = document.getElementById(sectionId);
        if (!el) return;

        evaluateRuleEngine('SECTION_VISIT', sectionId);

        if (window.HarmonyMotion?.navigate) {
            window.HarmonyMotion.navigate(sectionId, window.HarmonyMotion.RouteType.Push, {
                source: 'ai-concierge',
                updateHistory: true,
            });
        } else if (state.lenis) {
            state.lenis.scrollTo(el, { offset: -70 });
        } else {
            const navHeight = document.getElementById('nav')?.offsetHeight || 70;
            const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        showToast(`✦ Navigating to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`, 2000);
    }

    function showSectionTip(sectionId) {
        const tip = SECTION_TIPS[sectionId];
        if (!tip) return;

        const tipEl = document.getElementById('ai-section-tip');
        const textEl = document.getElementById('ai-tip-text');
        const actionsEl = document.getElementById('ai-tip-actions');

        if (!tipEl || !textEl || !actionsEl) return;

        state.sectionTipShown[sectionId] = true;
        textEl.textContent = tip.text;
        actionsEl.innerHTML = tip.actions.map((a, i) =>
            `<button class="ai-tip-action" data-prompt="${escapeHtml(tip.prompts[i])}">${escapeHtml(a)}</button>`
        ).join('');

        actionsEl.querySelectorAll('.ai-tip-action').forEach(btn => {
            btn.addEventListener('click', () => {
                tipEl.classList.remove('visible');
                openChat(false);
                const input = document.getElementById('ai-input');
                if (input) { input.value = btn.dataset.prompt; sendMessage(); }
            });
        });

        tipEl.classList.add('visible');
        setTimeout(() => tipEl.classList.remove('visible'), CONFIG.SECTION_TIP_DURATION_MS);
    }

    function showTourProgress(sections) {
        const container = document.getElementById('ai-tour-progress');
        if (!container) return;

        container.innerHTML = sections.map((s, i) =>
            `<div class="tour-step-dot ${i === 0 ? 'active' : ''}" data-label="${s}" title="${s}"></div>`
        ).join('');
        container.classList.add('visible');
    }

    function hideTourProgress() {
        document.getElementById('ai-tour-progress')?.classList.remove('visible');
    }

    let toastTimer;
    function showToast(message, duration = 2500) {
        const toast = document.getElementById('ai-toast');
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.innerHTML = `<i class="fas fa-sparkles"></i> ${message}`;
        toast.classList.add('show');
        toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function getTimeStr() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function initWelcome() {
        const overlay = document.getElementById('ai-welcome-overlay');
        if (!overlay) return;

        setTimeout(() => {
            overlay.classList.add('visible');
            state.welcomeShown = true;
        }, CONFIG.WELCOME_DELAY_MS);

        document.getElementById('ai-welcome-close')?.addEventListener('click', () => overlay.classList.remove('visible'));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('visible'); });

        document.getElementById('ai-welcome-tour')?.addEventListener('click', () => {
            overlay.classList.remove('visible');
            setTimeout(showTourModal, 300);
        });

        document.getElementById('ai-welcome-explore')?.addEventListener('click', () => {
            overlay.classList.remove('visible');
            navigateToSection('projects');
        });

        document.getElementById('ai-welcome-ask')?.addEventListener('click', () => {
            overlay.classList.remove('visible');
            setTimeout(() => openChat(true), 300);
        });

        document.getElementById('ai-welcome-hire')?.addEventListener('click', () => {
            overlay.classList.remove('visible');
            evaluateRuleEngine('SET_ROLE', 'client');
            navigateToSection('contact');
        });
    }

    async function loadKnowledgeBase() {
        const files = ['about', 'projects', 'skills', 'services', 'certifications',
                       'career-timeline', 'faq', 'social-links', 'technologies',
                       'testimonials', 'resume'];
        const results = await Promise.allSettled(
            files.map(f => fetch(`./data/${f}.json`).then(r => r.ok ? r.json() : null).catch(() => null))
        );
        files.forEach((f, i) => {
            if (results[i].status === 'fulfilled' && results[i].value) {
                state.kb[f] = results[i].value;
            }
        });
    }

    /* ═══════════════════════════════════════════════════
       INITIALIZATION
    ═══════════════════════════════════════════════════ */
    async function init() {
        loadMemoryState();
        await loadKnowledgeBase();

        initSmoothScroll();
        if (CONFIG.ENABLE_CURSOR) initCursorSystem();
        initContextEngine();
        initChatPanel();
        initExitIntent();
        resetInactivityTimer();
        initWelcome();

        document.getElementById('ai-tip-dismiss')?.addEventListener('click', () => {
            document.getElementById('ai-section-tip')?.classList.remove('visible');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
