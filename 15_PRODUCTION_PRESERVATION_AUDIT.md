# 15 — Production Preservation Audit & Verification Matrix
**Project:** Portfolio X (Pratheesh Clement Portfolio)
**Role:** Lead Systems Auditor, Technical SEO Lead & Privacy/Analytics Architect

---

## Executive Audit Summary

Per the mandatory **Production Preservation Directives**, this document serves as the formal audit, canonical inventory, and architectural lock for all live tracking, monetization, indexing, search verification, privacy consent, and SEO schemas present in the codebase.

**GUARANTEE**: During the visual redesign of Portfolio X (PRATHEESH OS), **zero tracking scripts, zero schema graphs, zero indexable URLs, zero search verification tags, and zero legal policy pages will be deleted, broken, or modified**. Only layout, UI, UX, styling, animations, and responsive components will be visually redesigned.

---

## 1. Canonical Production Inventory Matrix

### A. Monetization & Analytics Architecture

| Component | Target Identifier / Code Location | Gating Engine / Load Rule | Preservation Action |
| :--- | :--- | :--- | :--- |
| **Google AdSense** | Script: `pagead2.googlesyndication.com`<br>Pub ID: `ca-pub-XXXXXXXXXXXXXXXX` in `index.html#L50` | Auto-Ads script in `<head>`, non-intrusive container slots | **LOCK IN HEAD & FOOTER** — Refactor container styles around it. |
| **Google Analytics 4** | Measurement ID: `G-XXXXXXXXXX` in `src/utils/analytics.ts` | Gated by `consent-granted` event (`analytics: true`) | **PRESERVE GATING LOGIC** — Loads `gtag.js` dynamically post-consent. |
| **Meta Pixel** | Pixel ID: `983425767341384` in `src/utils/analytics.ts` | Gated by `consent-granted` event (`marketing: true`) | **PRESERVE GATING LOGIC** — Executes `fbq('init')` & `fbq('track', 'PageView')`. |
| **Search Console** | File: `public/ynx34vwp8njfafoqlmi3kfr667mvh7.html`<br>Meta tag: `index.html` | Root file verification & HTML head verification | **LOCK FILE & HEAD TAG** — Never rename or delete verification file. |

---

### B. Indexing & SEO Structure

| Asset / Component | Location | Details | Preservation Action |
| :--- | :--- | :--- | :--- |
| **Robots File** | `public/robots.txt` | Allows `/`, `/assets/`, `/resume/`; points to `sitemap.xml` | **LOCK FILE** — Keep exact rules intact. |
| **Sitemap XML** | `public/sitemap.xml` | 185 lines indexing all 20+ pillar guides, case studies, & legal routes | **LOCK FILE** — Maintain all `<loc>` entries & image metadata. |
| **Canonical URL** | `index.html#L14` | `<link rel="canonical" href="https://pratheeshclement-cmd.github.io/" />` | **PRESERVE EXACT CANONICAL** across all scene headers. |
| **Web Manifest** | `public/site.webmanifest` | Icon & application metadata | **PRESERVE FILE & METADATA**. |
| **Schema JSON-LD** | `index.html#L54-L168` | Multi-graph: `Person` (Credential ID 453421024), `WebSite`, `BreadcrumbList`, `FAQPage` | **LOCK SCHEMA GRAPH** — Refactor UI around JSON-LD script block. |

---

### C. Legal Pages & Cookie Consent Engine

| Component | Route / Location | Function | Preservation Action |
| :--- | :--- | :--- | :--- |
| **Cookie Banner** | `src/utils/ConsentBanner.tsx` | Categorized gating (Necessary, Analytics, Marketing, Functional) | **RE-STYLE VISUALLY ONLY** — Preserve state & dispatch events. |
| **Privacy Policy** | `AppRouter.tsx` route: `/privacy/` | GDPR / CCPA legal compliance | **MAINTAIN ROUTE & CONTENT**. |
| **Terms of Service** | `AppRouter.tsx` route: `/terms/` | Legal terms of use | **MAINTAIN ROUTE & CONTENT**. |
| **Cookie Policy** | `AppRouter.tsx` route: `/cookie-policy/` | Granular cookie definitions | **MAINTAIN ROUTE & CONTENT**. |
| **Disclaimer** | `AppRouter.tsx` route: `/disclaimer/` | General legal disclaimer | **MAINTAIN ROUTE & CONTENT**. |

---

### D. Media Assets, Downloads & Form Connections

| Asset Type | Location | Target Items | Preservation Action |
| :--- | :--- | :--- | :--- |
| **Favicons** | `public/favicon.png`, `index.html` | `/favicon.png`, Apple Touch Icons | **LOCK FILE PATHS**. |
| **Resume PDF** | `public/resume/` | `Pratheesh_Clement_CV.pdf` | **MAINTAIN DOWNLOAD URLS**. |
| **Portraits & Assets** | `public/assets/` | `pratheesh4k2.jpeg`, project mockups | **PRESERVE ALL ORIGINAL ASSETS**. |
| **Contact Form** | `src/components/scenes/ContactScene.tsx` | Inputs, submit buttons, mailto fallbacks | **PRESERVE SUBMIT HOOKS & ACTIONS**. |

---

## 2. Refactoring & Code Modification Protocol

Before modifying ANY code file during the visual redesign phase:

1. **Pre-Edit Verification Check**: Audit the target file for AdSense, GA4, Meta Pixel, Search Console, Sitemap, or Consent handlers.
2. **Component Isolation**: If a file contains critical tracking tags (e.g. `index.html` or `analytics.ts`), perform a visual wrapper refactor. **Never replace the entire file with blank drafts**.
3. **Build & Indexing Sanity Check**: After visual edits, run build verification commands to confirm that structured JSON-LD graphs, sitemaps, and analytics initialization events execute without errors.
