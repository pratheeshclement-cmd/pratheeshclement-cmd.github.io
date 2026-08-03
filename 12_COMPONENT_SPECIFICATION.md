# 12 — Pratheesh OS Component Library Specifications
**Design System Specification: PRATHEESH OS / Portfolio X**
**Role:** Senior Component Architect & Frontend Systems Lead

---

## 1. Master Component Catalog

This document specifies the exact component architecture for the **Pratheesh OS Design System**, incorporating real verified data from `CONTENT.md`.

---

## 2. Component Blueprint Specifications

### Component 01: Top Floating Glass Navbar (`<Navbar />`)
- **Visual Spec**: Floating translucent glass capsule (`background: rgba(255, 255, 255, 0.65)`, `backdrop-filter: blur(24px) saturate(180%)`, `border: 1px solid rgba(255, 255, 255, 0.9)`, `border-radius: 9999px`).
- **Dimensions**: `height: 56px; width: min(90%, 1080px); top: 20px;`.
- **Key Features**:
  1. `NavBrand`: `"PRATHEESH CLEMENT"` + separator `"/"` + `"DIGITAL ECOSYSTEMS"`.
  2. `NavSpotlightPill`: Glides underneath active/hovered section links (`ABOUT`, `SKILLS`, `PROJECTS`, `SERVICES`, `CONTACT`) using smooth cubic-bezier transitions.
  3. `CommandPaletteTrigger`: Keyboard shortcut badge (`⌘K` / `Ctrl+K`) opening instantaneous command palette modal.

---

### Component 02: Hero Scene Architecture (`<HeroScene />`)
- **Layout**: 7 Columns (Left Editorial Text Stack) / 5 Columns (Right Interactive Frosted Lanyard Card).
- **Left Text Stack**:
  - Greeting: `"Architect of Digital Ecosystems"` (Subtitle in Sky Blue).
  - Main Headline: `"PRATHEESH CLEMENT"` in display typography (`Plus Jakarta Sans`, font-weight 800, size `clamp(3.5rem, 7vw, 6.5rem)`).
  - Short Bio Accent: `"Sacrifice is the brilliant move"` (Rendered in serif italic `Instrument Serif`).
  - Action Row: Primary Shimmer CTA Button (`"EXPLORE CASE STUDIES"`), Secondary Download CV Button, and Live Location Badge (`"📍 VADALUR, TAMIL NADU, INDIA"`).
- **Right Interactive Anchor**:
  - **Light Frosted Lanyard Card**: Interactive Hooke's Law pendulum ID card featuring bright frosted crystal surface, silver metal corner rivets, woven fabric lanyard strap, carabiner clip, and Pratheesh Clement's profile image.
  - **Rotating SVG Badge**: Orbital SVG spinning text (`"DIGITAL MARKETING • SEO • WEB DEV • AI AGENTS •"`).

---

### Component 03: About & Philosophy Telemetry (`<AboutScene />`)
- **Layout**: 7 Columns (Editorial Philosophy Copy) / 5 Columns (Telemetry Metric Cards).
- **Editorial Copy**:
  - Full authentic bio from `CONTENT.md` detailing multidisciplinary expertise spanning website design, search engine optimization, Meta advertising, conversion optimization, and AI-powered workflows.
- **Telemetry Cards**:
  1. **Current Role Card**: Digital Marketer at JBHL Pvt Ltd.
  2. **Automotive Systems Background Card**: Store/Production Associate at Nexteer Automotive India (warehouse layouts, inventory tracking).
  3. **Education Card**: Bachelor of Computer Applications (BCA) & Google Skillshop Certified (Fundamentals of Digital Marketing, Completion ID: 453421024).

---

### Component 04: Featured Projects Presentation (`<ProjectsScene />`)
- **Layout**: Alternating Asymmetrical Cards.
- **Cards Breakdown (Strict Data from `CONTENT.md`)**:
  1. **01 — SEO Growth Campaign**:
     - *Problem*: Low organic indexation, duplicate titles, no schema markup.
     - *Solution*: Rebuilt robots.txt, sitemaps, JSON-LD graphs, fixed keyword gaps.
     - *Result*: Significant organic visibility gain, rich snippets in SERP within 60 days.
  2. **02 — Restaurant Branding Web Layout**:
     - *Problem*: Hard-coded layouts, no touch-friendly mobile buttons.
     - *Solution*: Fluid CSS Grid, optimized image rendering, clean CTAs.
     - *Result*: Smooth multi-viewport display, clean performant codebase.
  3. **03 — Social Media B2B Funnel**:
     - *Problem*: Poor audience profiling, spam submissions, high CPL.
     - *Solution*: Lookalike audiences, custom pixel events, high-impact copy testing.
     - *Result*: Reduced CPL, higher volume of pre-qualified leads.

---

### Component 05: Tech Stack & Infinite Marquee (`<SkillsScene />`)
- **Infinite Logo Marquee**: Dual-row horizontal ticker looping skill logos (React, TypeScript, SEO, GA4, Google Ads, Meta Ads, Figma, AI Workflows, Docker, Node.js) with soft gradient edge masks.
- **Skill Proficiency Groups**:
  - **Technical SEO (Expert)**: Schema Markup, SEO Audits, Keyword Research, Core Web Vitals, GA4.
  - **Paid Advertising (Expert)**: Google Search Ads, Meta Ads Funnels, CPL Reduction, Pixel Setup.
  - **Web Development (Proficient)**: Semantic HTML5, CSS Custom Properties, React, Next.js, Vite.
  - **AI & Automation (Proficient)**: AI Workflow Design, Zapier, Webhooks, AI Agents, OpenAI, Gemini.

---

### Component 06: Persistent AI Concierge & Contact Form (`<AIConcierge />` & `<ContactScene />`)
- **AI Concierge**: Persistent floating glass assistant powered by Vercel Serverless Function + Gemini API, providing instantaneous natural-language answers grounded in Pratheesh Clement's profile.
- **Animate UI Contact Form**: Frosted glass modal card with smooth backdrop blur, custom input fields, and integration hooks.
- **Bottom macOS Glass Dock**: Floating dock capsule providing 1-click access to Email (`pratheesh.clement@gmail.com`), LinkedIn, GitHub, Instagram, and CV Download.
