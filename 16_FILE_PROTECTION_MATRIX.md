# 16 — File Protection Matrix & Modification Controls
**Project:** PRATHEESH OS V2 (Portfolio X)
**Role:** Chief Production Security Officer & Systems Auditor

---

## Executive Summary

The **File Protection Matrix** establishes strict access controls for every file in the codebase. Files are classified into 4 Protection Levels:
- **CRITICAL (READ ONLY)**: Core tracking, analytics, indexing, sitemap, robots, or legal verification files. Absolute zero code changes allowed.
- **HIGH (MODIFY AROUND SEO)**: HTML shell, route configuration, and consent engines. Modifications strictly permitted ONLY around pre-existing meta/script tags.
- **MEDIUM (REFACTOR SPATIAL LAYOUT)**: Page containers and section wrappers. Visual layout and component arrangement refactoring allowed.
- **LOW (REBUILD VISUAL UI)**: Presentational React components, styling tokens, animations, and visual assets. Full UI/UX rebuild allowed.

---

## Comprehensive File Audit & Protection Matrix

| File Path | Primary Purpose | Category | Protection Level | Allowed Action |
| :--- | :--- | :--- | :--- | :--- |
| `public/robots.txt` | Crawler Directives & Sitemap Pointer | Indexing | **CRITICAL** | **READ ONLY** — No modifications allowed. |
| `public/sitemap.xml` | Search Engine Indexing (185 lines) | Indexing | **CRITICAL** | **READ ONLY** — Maintain all URL & image entries. |
| `public/ynx34vwp8njfafoqlmi3kfr667mvh7.html` | Google Search Console Ownership | Verification | **CRITICAL** | **READ ONLY** — Do not rename, edit, or delete. |
| `public/site.webmanifest` | Web Application Manifest & Icons | SEO / PWA | **CRITICAL** | **READ ONLY** — Keep app manifest metadata intact. |
| `src/utils/analytics.ts` | GA4 & Meta Pixel Initialization Gating | Analytics | **CRITICAL** | **READ ONLY** — Preserve consent listener & load functions. |
| `docs/CONTENT.md` | Single Source of Truth for Bio/Metrics | Content | **CRITICAL** | **READ ONLY** — Pull data as-is; zero fabricated claims. |
| `index.html` | HTML Shell, AdSense, Meta Tags & JSON-LD | Shell / SEO | **HIGH** | **MODIFY ONLY AROUND EXISTING SEO/ADSENSE** |
| `src/utils/ConsentBanner.tsx` | Cookie Consent Banner & State Engine | Privacy | **HIGH** | **MODIFY VISUAL STYLING ONLY** — Keep event logic. |
| `src/router/AppRouter.tsx` | Core Route Configuration & Legal Pages | Navigation | **HIGH** | **MODIFY AROUND EXISTING ROUTES** — No deleted URLs. |
| `src/pages/PrivacyPolicyPage.tsx` | GDPR / Privacy Policy Legal Text | Legal | **HIGH** | **READ ONLY / WRAPPER STYLING ONLY** |
| `src/pages/TermsPage.tsx` | Terms of Service Legal Text | Legal | **HIGH** | **READ ONLY / WRAPPER STYLING ONLY** |
| `src/pages/CookiePolicyPage.tsx` | Cookie Policy Legal Text | Legal | **HIGH** | **READ ONLY / WRAPPER STYLING ONLY** |
| `src/pages/DisclaimerPage.tsx` | Legal Disclaimer Text | Legal | **HIGH** | **READ ONLY / WRAPPER STYLING ONLY** |
| `src/App.tsx` | Main Application Shell & Scroll Camera | Application | **MEDIUM** | **REFACTOR SPATIAL LAYOUT** |
| `src/components/layout/Navbar.tsx` | Top Navigation Header Component | Layout | **MEDIUM** | **REBUILD VISUAL UI** — Keep anchor target IDs. |
| `src/components/scenes/HeroScene.tsx` | Hero Section Component | Scene UI | **LOW** | **REBUILD VISUAL UI** — Incorporate Light Lanyard Card. |
| `src/components/scenes/AboutScene.tsx` | About & Telemetry Section | Scene UI | **LOW** | **REBUILD VISUAL UI** — Keep real content from CONTENT.md. |
| `src/components/scenes/ProjectsScene.tsx` | Featured Projects Section | Scene UI | **LOW** | **REBUILD VISUAL UI** — Keep real metrics & numbers. |
| `src/components/scenes/SkillsScene.tsx` | Skills & Tech Stack Section | Scene UI | **LOW** | **REBUILD VISUAL UI** — Add infinite marquee. |
| `src/components/scenes/ServicesScene.tsx` | Capabilities & Services Grid | Scene UI | **LOW** | **REBUILD VISUAL UI** — Apply radial spotlights. |
| `src/components/scenes/ContactScene.tsx` | Contact & Form Component | Scene UI | **LOW** | **REBUILD VISUAL UI** — Keep form submit handlers. |
| `src/components/ai/AIConcierge.tsx` | Floating AI Assistant Component | AI / UX | **MEDIUM** | **REFACTOR GLASS STYLING** — Keep Vercel/Gemini API hooks. |
| `src/index.css` | Global CSS Custom Properties & Tokens | Styling | **LOW** | **REBUILD DESIGN TOKENS** — Apply Bright Theme. |
