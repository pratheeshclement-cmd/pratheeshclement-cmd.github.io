# Portfolio X — Project Brief (source of truth, read every session)

## Who this is for
Owner: Pratheesh Clement (legal name Mariya Pratheesh), Vadalur, Tamil Nadu, India.
Currently Digital Marketer at JBHL Pvt Ltd. Background: store/production department at
Nexteer Automotive India before moving into digital marketing. BCA degree. Google Skillshop
certified — Fundamentals of Digital Marketing.
Multidisciplinary: digital marketing, SEO, frontend dev (React/JS/TS), UI/UX, Google & Meta
Ads, AI-assisted workflows. Positioning: "Architect of Digital Ecosystems" /
"Digital Marketing Specialist • AI Enthusiast — AI + Marketing + Development."
Full content (bios, skills, case studies, links) lives in @docs/CONTENT.md — pull from there,
never invent biographical claims, metrics, client names, or dates that aren't in it.

## What we're building
One continuous, scroll-driven cinematic portfolio — not separate pages, not a dashboard,
not an OS you click between panels of. Scrolling drives a single timeline; a virtual camera
(built from layered parallax, not literal 3D navigation) moves through one world. Each
section is a themed zone the camera passes through — About feels like a design studio,
Projects like an engineering lab — but the THEME is visual language only. The interaction
model is always continuous scroll.

## Non-negotiables
1. Interaction: scroll = timeline. No nav menu that jumps between disconnected views.
2. Palette: bright and premium — soft white, pearl, ice, light silver, soft sky blue, soft
   lavender, soft mint, light gradients, frosted glass. Never a dark/black default, never
   neon-cyberpunk. (The current live site is dark — this is a deliberate departure from it,
   not an oversight.) An optional light/dark toggle is fine; light is always the default.
3. Transitions: never a plain fade/slide/instant swap. Elements assemble and disassemble
   (particles → outline → glass → surface → text/icon → interactive) — implement this with
   layered CSS/GSAP transforms, not literal particle physics.
4. Preserve exactly: the existing Google AdSense script, the existing tracking pixel(s), and
   any existing API key integrations from the current live site must keep working. Locate
   the actual tags in the current repo before removing anything — don't guess at IDs.
   The current site also has a granular cookie-consent system (Necessary / Analytics /
   Marketing / Preferences / Functional categories) gating Analytics and Marketing
   cookies — rebuild this gating exactly; don't let GA or the Meta pixel fire before consent.
5. Repo/domain: pratheeshclement-cmd.github.io on GitHub Pages. Keep as the production URL.
6. Performance is a feature: target 90+ Lighthouse across Performance/Accessibility/Best
   Practices/SEO on every scene (95+ is the real goal, 100 is the stretch) — never trade a
   broken Core Web Vital or a keyboard trap for a visual flourish.
7. Mobile gets the same feature set as desktop, adapted for performance and input — never
   just strip the cinematic elements on small screens; reduce particle count and parallax
   layers instead.
8. Don't fabricate: no invented testimonials, awards, metrics, or project details beyond
   what's in @docs/CONTENT.md. If a section has no real content yet, ship it visually
   complete but empty/marked "coming soon" rather than filling it with placeholder-quality
   fake content.

## Tech stack
- React + TypeScript + Vite
- GSAP + ScrollTrigger as the scroll-timeline/"camera" engine — layered parallax and
  transform-based depth, not real 3D geometry for the whole site
- Three.js used selectively only: a hero background accent (soft floating light / an
  interactive globe) and at most one or two other signature moments — never site-wide
- CSS custom properties as the design-token system
- Node.js serverless function (Vercel) + Gemini API for the AI Concierge — local JSON
  knowledge base, no external database needed at this scale
- Deploy: static site → GitHub Pages (existing repo), AI function → Vercel, Cloudflare in
  front if/when a custom domain is added

## Design inspiration (mood only — never copy layouts or assets)
Apple, Apple Vision Pro, Linear, Framer, Stripe, Arc Browser, Tesla, Google Material 3,
Huawei HarmonyOS NEXT, Nothing, Notion, Awwwards-caliber sites.

## Canonical scene order
Boot → Hero → About → Skills → Experience/Certifications → Projects (case studies) →
Services/Pricing → Testimonials/FAQ → Contact/Footer, with the AI Concierge persistent
throughout (not its own scene).
