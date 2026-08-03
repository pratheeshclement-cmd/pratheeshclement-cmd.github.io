# 19 — Analytics & Monetization Regression Checklist
**Project:** PRATHEESH OS V2 (Portfolio X)
**Role:** Web Analytics Specialist & Privacy Compliance Lead

---

## Executive Analytics Strategy

The **Analytics & Monetization Regression Checklist** mandates complete end-to-end verification of tracking tag behavior, privacy consent gating, and AdSense placement containers after every visual redesign phase.

---

## Analytics Verification Matrix

| Analytics & Ad Component | Verification Metric | Code Anchor | Status |
| :--- | :--- | :--- | :--- |
| **GA4 Script Load** | `gtag.js` script injects ONLY post-consent (`analytics: true`) | `src/utils/analytics.ts` | [ ] PENDING |
| **GA4 Pageview Event** | `gtag('config', ID)` fires once on page load without duplication | `src/utils/analytics.ts` | [ ] PENDING |
| **Meta Pixel Script Load**| `fbevents.js` script injects ONLY post-consent (`marketing: true`) | `src/utils/analytics.ts` | [ ] PENDING |
| **Meta Pixel PageView** | `fbq('track', 'PageView')` fires once without duplicate triggers | `src/utils/analytics.ts` | [ ] PENDING |
| **Google AdSense Script** | `adsbygoogle.js` script tag in `<head>` intact with Publisher ID | `index.html#L50` | [ ] PENDING |
| **Ad Placement Slots** | Frosted glass AdSense container slots formatted in footer/pages | `index.html` & Layout | [ ] PENDING |
| **Consent Banner Engine** | Cookie Banner pops up on first visit; choices persist in localStorage | `src/utils/ConsentBanner.tsx`| [ ] PENDING |
| **Consent Custom Event** | `window.dispatchEvent(new CustomEvent('consent-granted', ...))` fires | `src/utils/ConsentBanner.tsx`| [ ] PENDING |
| **Zero Pre-Consent Firing**| GA4 and Meta Pixel MUST NOT load prior to user consent | Network Inspector Audit | [ ] PENDING |
| **Zero Duplication** | No duplicate script tags injected into DOM on route re-renders | Network Inspector Audit | [ ] PENDING |
