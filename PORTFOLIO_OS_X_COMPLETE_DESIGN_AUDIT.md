# PORTFOLIO OS X — COMPLETE TECHNICAL + VISUAL DESIGN AUDIT
**Master Implementation & Architectural Blueprint**
*Target Repository: Pratheesh OS / Portfolio OS X (`d:\Pratheesh os`)*
*Document Version: 1.0 (Comprehensive Forensics Report)*

---

## 1. FULL PROJECT ARCHITECTURE AUDIT

### 1.1 Directory Tree
```
d:\Pratheesh os\
├── .github/                       # GitHub Actions & workflow configuration
├── docs/                          # Source of truth biographical & narrative content
│   └── CONTENT.md                 # Complete verified profile, bios, roles, skills, & credentials
├── public/                        # Static assets served at root level
│   ├── asset/                     # Legacy asset compatibility folder
│   │   ├── pratheesh favicon.png
│   │   ├── pratheesh4k1.jpeg
│   │   └── pratheesh4k2.jpeg
│   ├── assets/                    # Production 4K images & media assets
│   │   ├── pratheesh4k1.jpeg      # Head-and-shoulders portrait (600x800)
│   │   └── pratheesh4k2.jpeg      # Full composition 4K portrait (1080x1920)
│   ├── certificates/              # Google & IAB Europe accreditation documents
│   ├── favicon.png                # 631KB crisp brand favicon mark
│   ├── resume/                    # CV documents (MariyaPratheesh.docx)
│   ├── robots.txt                 # Search engine crawler directives
│   ├── site.webmanifest           # Web app manifest for PWA installation
│   └── sitemap.xml                # XML Sitemap Graph
├── src/                           # React + TypeScript Source Code
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIConcierge.tsx    # Intelligent role-based assistant modal & trigger orb
│   │   ├── layout/
│   │   │   ├── AmbientBackground.tsx       # Fixed reactive mouse-parallax light orbs layer
│   │   │   ├── CinematicParticleCanvas.tsx # 60 FPS floating particle canvas with scroll velocity
│   │   │   ├── CursorLighting.tsx          # Custom inverse-blend cursor dot and hover states
│   │   │   └── Navbar.tsx                  # Floating glassmorphic header bar & mobile drawer
│   │   ├── scenes/
│   │   │   ├── AboutScene.tsx        # Story, vision, values & portrait showcase card
│   │   │   ├── BootScene.tsx         # 6.0s particle portrait materialization intro
│   │   │   ├── ContactScene.tsx      # Contact options, 3D tilt showcase & glass footer
│   │   │   ├── ExperienceScene.tsx   # Timeline career journey & verified credentials
│   │   │   ├── HeroScene.tsx         # Headline, Aurora glass background, portrait & CTAs
│   │   │   ├── ProjectsScene.tsx     # Case studies grid with in-place modal viewer
│   │   │   ├── ServicesScene.tsx     # Capability rows with magnetic hover & highlights
│   │   │   ├── SkillsScene.tsx       # 3D technical matrix card grid
│   │   │   └── TestimonialsScene.tsx # Principles, client feedback placeholder & FAQ
│   │   ├── three/
│   │   │   └── HeroGlobe.tsx         # Interactive Fibonacci sphere 3,000 Three.js particle system
│   │   └── ui/
│   │       ├── CinematicProfileShowcase.tsx # 3D tilt frame, clip-path reveal, spotlight & glow ring
│   │       ├── CommandPaletteModal.tsx      # ⌘K spotlight search & quick navigation
│   │       ├── FAQAccordion.tsx             # Animated collapsible FAQ accordion
│   │       ├── GlassCard.tsx                # Reusable glassmorphic tilt & float container
│   │       ├── HeroAuroraGlass.tsx          # Background morphing aurora blob canvas
│   │       ├── LegalModal.tsx               # Privacy, Terms, and Cookie policy viewer
│   │       ├── MagneticButton.tsx           # Physics-based magnetic hover button wrapper
│   │       ├── ProjectModal.tsx             # Case study deep-dive modal window
│   │       └── SplitText.tsx                # Character-by-character staggered entrance text
│   ├── data/
│   │   ├── aiKnowledgeBase.ts        # Local role-based AI knowledge graph & response matcher
│   │   ├── experience.ts             # Work history, roles, & Google Skillshop cert IDs
│   │   ├── faq.ts                    # Frequently asked questions & structured answers
│   │   ├── identity.ts               # Core biographical constants & social links
│   │   ├── projects.ts               # Detailed case studies, problems, solutions & results
│   │   ├── services.ts               # Core service offerings & highlight badges
│   │   └── skills.ts                 # 6 Technical categories, levels, and skill pills
│   ├── engine/
│   │   ├── AnimeMasterEngine.ts      # Anime.js section assembly & disassembly timeline manager
│   │   ├── CameraController.ts       # 3D perspective camera wrapper & velocity depth push
│   │   ├── CinematicCameraEngine.ts  # 9 Keyframe camera state interpolator across scroll 0.0-1.0
│   │   ├── MotionTokens.ts           # Unified physics constants (Easing, Durations, Tilts)
│   │   └── ParticleCanvasEngine.tsx  # Particle generation algorithms
│   ├── hooks/
│   │   ├── useMagneticHover.ts       # Elastic magnetic pull spring calculation hook
│   │   ├── useReducedMotion.ts       # OS accessibility preference listener (`prefers-reduced-motion`)
│   │   ├── useScrollLock.ts          # Page scroll locking hook for active modals/drawers
│   │   ├── useScrollTimeline.ts      # GSAP ScrollTrigger scene transition hook
│   │   └── useTheme.ts               # Light/Dark mode state management & localStorage persistence
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces (Project, Experience, AIMessage)
│   ├── utils/
│   │   ├── analytics.ts              # GA4 & Meta Pixel consent-gated loader
│   │   ├── ConsentBanner.tsx         # Granular cookie consent modal (Necessary/Analytics/Marketing)
│   │   ├── motionEffects.ts          # GSAP utility helpers
│   │   └── soundEffects.ts           # Web Audio API synthesizer for UI clicks & boot chimes
│   ├── App.tsx                       # Core root component, Lenis smooth scroll loop, & scene stack
│   ├── index.css                     # Design system CSS tokens, glass mixins, responsive rules
│   ├── main.tsx                      # DOM entry point mounting React root
│   └── vite-env.d.ts                 # Vite environment type definitions
├── index.html                        # HTML shell, JSON-LD Schema graph, preconnects, SEO metadata
├── package.json                      # NPM dependencies & script declarations
├── tsconfig.json                     # TypeScript compiler configuration
└── vite.config.ts                    # Vite bundler configuration & alias definitions
```

---

### 1.2 Architectural Systems & Interconnections

- **Framework**: React 19.0.0 (`react`, `react-dom`).
- **Language**: TypeScript 5.7.2 with strict type safety across data schemas, components, and hooks.
- **Bundler**: Vite 6.1.0 configured with `@vitejs/plugin-react` for Fast Refresh and code splitting.
- **Application Entry Point**: `index.html` loads `/src/main.tsx`, which mounts `<App />` inside `#root`.
- **Component Architecture**: Modular React functional components organized cleanly into `layout/`, `scenes/`, `three/`, `ui/`, and `ai/`. All 9 major content scenes are lazy-loaded via `React.lazy()` and wrapped in `<Suspense fallback={null}>` for optimal initial load metrics.
- **Scene Architecture**: Single continuous scroll-driven timeline space (`#main-world`) enclosed inside a 3D perspective container (`#camera-perspective`). 9 scenes render in canonical order: Boot → Hero → About → Skills → Projects → Experience → Services → Testimonials/FAQ → Contact/Footer.
- **State Architecture**: Local component state (`useState`, `useRef`) combined with custom hooks (`useTheme`, `useScrollLock`, `useReducedMotion`). Custom DOM events (`open-legal-modal`, `open-command-palette`, `open-ai-concierge`, `open-cookie-preferences`) manage global overlay interactions seamlessly without heavy state libraries.
- **Routing Architecture**: Zero traditional page routes. Routing is entirely scroll-anchored via native section IDs (`#scene-hero`, `#scene-about`, etc.) smoothed by Lenis.
- **Animation Architecture**: Dual-engine animation system:
  1. **GSAP 3.15.0 + ScrollTrigger**: Controls smooth scroll timeline scrubbing, scene entrance triggers, virtual camera perspective transforms, and profile showcase tilt/clip-path animations.
  2. **Anime.js 3.2.2**: Manages character-by-character typography reveals (`SplitText`), element assembly/disassembly sequences (`AnimeMasterEngine`), card tilt/elastic returns (`GlassCard`), and modal entrance physics.
- **Styling Architecture**: Vanilla CSS Custom Properties (`src/index.css`) establishing a design-token system (`--bg-primary`, `--accent-primary`, `--glass-bg`, `--radius-lg`) paired with inline CSS objects for dynamic positioning. Supports seamless instant toggling between `light` and `dark` themes via data attributes (`html[data-theme="dark"]`).
- **Asset Architecture**: High-resolution 4K profile assets (`/assets/pratheesh4k1.jpeg`, `/assets/pratheesh4k2.jpeg`) stored in `/public/assets/`, preloaded with `loading="eager"` and `decoding="async"`.
- **Responsive Architecture**: Fluid layout clamp functions (`clamp(...)`), CSS Grid/Flexbox, and media queries (`@media (max-width: 768px)`). Mouse parallax and custom cursor dots automatically disable on mobile/touch devices.
- **WebGL/Three.js Architecture**: Three.js 0.185.1 standalone canvas renderer (`HeroGlobe.tsx`) rendering a 3,000-particle Fibonacci sphere with mouse interaction tracking and zero canvas resize jank.
- **AI Architecture**: `AIConcierge.tsx` connected to `aiKnowledgeBase.ts`, featuring role selection (Recruiter, Founder, Client, Developer, Browsing), quick prompt chips, session persistence (`sessionStorage`), and smart fuzzy text pattern matching against verified portfolio facts.

---

## 2. DEPENDENCY / LIBRARY AUDIT

| Library | Version | Used In Files | Purpose | Feature Created | Essential? | Performance Cost | Mobile Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **React** | `^19.0.0` | `App.tsx`, all components | UI framework | Component hierarchy & state rendering | Yes | Medium | Low |
| **React DOM** | `^19.0.0` | `main.tsx` | DOM rendering | Mounts React virtual DOM to document | Yes | Low | Low |
| **TypeScript** | `~5.7.2` | Entire codebase | Static typing | Complete type safety & intellisense | Dev | Zero (Build-time) | Zero |
| **Vite** | `^6.1.0` | Build system | Bundler & dev server | Fast HMR & production chunking | Dev | Zero (Runtime) | Zero |
| **GSAP** | `^3.15.0` | `App.tsx`, `CameraController.ts`, `CinematicCameraEngine.ts`, `HeroScene.tsx`, `SkillsScene.tsx`, `CinematicProfileShowcase.tsx` | Timeline & scroll engine | Virtual camera Z-depth push, ScrollTrigger scene sync | Yes | Low | Low |
| **Anime.js** | `^3.2.2` | `AnimeMasterEngine.ts`, `SplitText.tsx`, `GlassCard.tsx`, `Navbar.tsx`, `BootScene.tsx`, `ConsentBanner.tsx` | Physics motion engine | Character text splitting, card tilt/elastic return, intro particle assembly | Yes | Low | Low |
| **Lenis** | `^1.3.25` | `App.tsx` | Smooth scroll engine | Inertial momentum scroll smoothing across viewports | Yes | Low | Low (Optimized raf) |
| **Three.js** | `^0.185.1` | `HeroGlobe.tsx` | WebGL 3D rendering | 3,000-particle interactive Fibonacci hero globe sphere | Selective | Medium (GPU) | Auto-scaled pixel ratio |
| **Lucide React**| `^0.475.0` | All UI & scene components | Icon system | Crisp modern interface icons | Yes | Low (Tree-shaken) | Low |
| **Canvas Confetti**| `^1.9.4` | Package target | Celebration effects | Optional visual particle bursts | No | Negligible | Negligible |
| **HTML Canvas** | Native | `BootScene.tsx`, `CinematicParticleCanvas.tsx` | 2D Canvas rendering | 60 FPS particle portrait materialization & ambient particle float | Yes | Low | Low (60 particles) |
| **Web Audio API**| Native | `soundEffects.ts` | Sound synthesis | Real-time synthetic UI clicks, window switches & C-major boot chimes | No | Negligible | Negligible |

---

## 3. COMPLETE DESIGN SYSTEM

### 3.1 Color System

#### Light Mode (Default)
- **Page Background Primary (`--bg-primary`)**: `#F8FAFC` (Slate 50 — soft, pearl ice white)
- **Page Background Secondary (`--bg-secondary`)**: `#F1F5F9` (Slate 100 — light silver)
- **Page Background Tertiary (`--bg-tertiary`)**: `#E2E8F0` (Slate 200 — subtle border slate)
- **Primary Accent (`--accent-primary`)**: `#3B82F6` (Electric Sky Blue)
- **Secondary Accent (`--accent-secondary`)**: `#0EA5E9` (Cyan Ice Blue)
- **Tertiary Accent (`--accent-tertiary`)**: `#8B5CF6` (Soft Lavender Violet)
- **Mint Accent (`--accent-mint`)**: `#10B981` (Emerald Mint — Verified/Available status)
- **Warm Accent (`--accent-warm`)**: `#F59E0B` (Amber Gold)
- **Text Primary (`--text-primary`)**: `#0F172A` (Deep Slate Navy)
- **Text Secondary (`--text-secondary`)**: `#475569` (Muted Slate)
- **Text Tertiary (`--text-tertiary`)**: `#94A3B8` (Light Slate Gray)
- **Glass Background (`--glass-bg`)**: `rgba(255, 255, 255, 0.45)`
- **Glass Border (`--glass-border`)**: `rgba(255, 255, 255, 0.7)`
- **Glass Highlight (`--glass-highlight`)**: `rgba(255, 255, 255, 0.9)`
- **Glass Shadow (`--glass-shadow`)**: `0 8px 32px rgba(59, 130, 246, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)`
- **Hover Shadow (`--hover-shadow`)**: `0 20px 60px rgba(59, 130, 246, 0.16), 0 8px 24px rgba(0, 0, 0, 0.08)`

#### Dark Mode (`html[data-theme="dark"]`)
- **Page Background Primary**: `#090D16` (Deep Space Midnight)
- **Page Background Secondary**: `#111827` (Dark Slate 900)
- **Page Background Tertiary**: `#1F2937` (Dark Slate 800)
- **Text Primary**: `#F8FAFC` (Pure Pearl White)
- **Text Secondary**: `#CBD5E1` (Light Slate Gray)
- **Text Tertiary**: `#64748B` (Medium Slate Gray)
- **Glass Background**: `rgba(17, 24, 39, 0.65)`
- **Glass Border**: `rgba(255, 255, 255, 0.15)`
- **Glass Highlight**: `rgba(255, 255, 255, 0.2)`
- **Glass Shadow**: `0 12px 40px rgba(0, 0, 0, 0.6)`
- **Hover Shadow**: `0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.3)`

#### Text Gradients
- **Blue-Cyan Gradient (`.text-gradient-blue`)**: `linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)`
- **Purple-Blue Gradient (`.text-gradient-purple`)**: `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)`

---

### 3.2 Typography

- **Display Font (`--font-display`)**: `'Space Grotesk', -apple-system, sans-serif`
  - Usage: `h1`, `h2`, `h3`, `h4`, section titles, statistics numbers, status labels.
  - Weights: `500` (Medium), `600` (SemiBold), `700` (Bold).
- **Body Font (`--font-body`)**: `'Inter', -apple-system, sans-serif`
  - Usage: Paragraphs, descriptions, buttons, navigation links, body copy.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold).
- **Monospace Font (`--font-mono`)**: `'JetBrains Mono', monospace`
  - Usage: Code snippets, credential IDs, system status tags (`⌘K`, `ID: 453421024`).
  - Weights: `400` (Regular), `600` (SemiBold).
- **Responsive Font Sizing**:
  - `Hero H1`: `clamp(2.6rem, 6vw, 4.8rem)`
  - `Section H2`: `clamp(2rem, 5vw, 3.4rem)`
  - `Subtitles`: `clamp(1rem, 2.2vw, 1.3rem)`
  - `Body Copy`: `1.05rem` (16.8px) with `line-height: 1.75`.

---

### 3.3 Spacing & Layout Architecture

- **Maximum Content Width**: `1200px` (`.scene-inner`).
- **Section Padding Desktop**: `120px 32px`.
- **Section Padding Mobile**: `80px 16px`.
- **Grid Gaps**:
  - 2-Column Grid (`.grid-2`): `gap: 48px` (desktop), `gap: 24px` (mobile stack).
  - 3-Column Grid (`.grid-3`): `gap: 24px` (desktop), `gap: 24px` (mobile stack).
- **Navbar Dimensions**: Width `min(1200px, calc(100vw - 32px))`, Top `16px`, Inner Padding `10px 20px`.
- **Card Padding**: Primary cards `28px` - `32px`, Compact pills `6px 16px`.

---

### 3.4 Shapes, Radii & Glass Effects

- **Border Radii**:
  - Small (`--radius-sm`): `12px` (icons, tag boxes)
  - Medium (`--radius-md`): `20px` (inner image frames, cards)
  - Large (`--radius-lg`): `28px` (glassmorphic cards, showcase containers, modals)
  - Full (`--radius-full`): `9999px` (buttons, skill pills, navbar)
- **Glassmorphic Surface (`.glass`)**:
  - `background: var(--glass-bg)`
  - `backdrop-filter: blur(24px) saturate(180%)`
  - `-webkit-backdrop-filter: blur(24px) saturate(180%)`
  - `border: 1px solid var(--glass-border)`
  - `box-shadow: inset 0 1px 1px var(--glass-highlight), var(--glass-shadow)`

---

## 4. HOMEPAGE DESIGN BREAKDOWN

| Element | Component | Source File | Styling / CSS | Animation | Asset | Responsive Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Progress Bar** | `Navbar` | `Navbar.tsx` | `height: 2px`, Gradient background | Real-time width update (`0%` to `100%`) | None | Fixed top across all viewports |
| **Floating Navbar** | `Navbar` | `Navbar.tsx` | `.glass`, `border-radius: 9999px` | Anime.js stagger entrance | `/assets/pratheesh4k1.jpeg` | Desktop inline links → Mobile gear menu drawer |
| **Theme Toggle** | `Navbar` | `Navbar.tsx` | Circular icon button | Anime.js 360° elastic spin | Lucide `Sun` / `Moon` | Present on all screens |
| **Command Trigger**| `Navbar` | `Navbar.tsx` | Monospace pill (`⌘K`) | Hover background glow | Lucide `Search` | Desktop only |
| **Hero Aurora** | `HeroAuroraGlass` | `HeroAuroraGlass.tsx` | Blur 60px gradient blobs | GSAP continuous morphing float | None | Scales dynamically to viewport |
| **Hero Title** | `SplitText` | `SplitText.tsx` | `clamp(2.6rem, 6vw, 4.8rem)` | Anime.js 3D character stagger reveal | None | Text wraps cleanly without breaking |
| **Hero Portrait** | `GlassCard` | `HeroScene.tsx` | `height: clamp(380px, 50vh, 540px)` | Anime.js blur-to-clear & 3D tilt | `/assets/pratheesh4k2.jpeg` | Stacks below text on mobile (`<768px`) |
| **Magnetic CTAs** | `MagneticButton` | `MagneticButton.tsx` | `btn-primary`, `btn-secondary` | Mouse proximity elastic magnetic pull | Lucide `ArrowDown`, `Mail`, `Download` | Full width on small screens |
| **Background Orbs**| `AmbientBackground` | `AmbientBackground.tsx` | Radial gradient blurs (`80px`) | Mouse coordinate parallax translation | None | Low opacity background layer |
| **Floating Particles**| `CinematicParticleCanvas` | `CinematicParticleCanvas.tsx` | HTML Canvas 2D glow points | 60 FPS animation loop with scroll velocity | None | Disabled on reduced motion |
| **Profile Showcase**| `CinematicProfileShowcase`| `CinematicProfileShowcase.tsx` | Glass frame with 3D tilt & corner tags | Clip-path reveal + breathing float loop | `/assets/pratheesh4k2.jpeg` | Scaled aspect ratio 4:4.8 |
| **Glass Footer** | `ContactScene` | `ContactScene.tsx` | `.glass`, 4-column layout | Scroll entrance reveal | `/assets/pratheesh4k1.jpeg` | 4 columns → 1 column on mobile |

---

## 5. HERO DESIGN FORENSICS

### 5.1 Layout & Grid Architecture
- **Structure**: 2-Column CSS Grid (`.grid-2`) aligned vertically center with `gap: 48px`.
- **Left Column**: Contains skill badges, `SplitText` name titles ("PRATHEESH CLEMENT"), motto glass card, bio subtitle, primary/secondary magnetic CTA buttons, and social icon buttons.
- **Right Column**: Contains the prominent 4K profile showcase card (`HeroScene.tsx` L229-L301).

### 5.2 Portrait Card Treatment
- **Container**: `GlassCard` wrapper with `tilt={true}`, `padding: 16px`, and `border-radius: 28px`.
- **Inner Frame**: `height: clamp(380px, 50vh, 540px)`, `border-radius: 20px`, `border: 1.5px solid rgba(255, 255, 255, 0.4)`, `box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2)`.
- **Image Source**: `/assets/pratheesh4k2.jpeg` (Fallback: `/assets/pratheesh4k1.jpeg`).
- **Object Positioning**: `object-fit: cover`, `object-position: center 10%`.
- **Overlays**: Linear gradient vignette (`linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)`).
- **Floating Badge**: Glassmorphic status bar (`background: rgba(255, 255, 255, 0.25)`, `backdrop-filter: blur(16px)`) displaying "Pratheesh Clement — Digital Marketing Specialist & AI Enthusiast" alongside an emerald "Available" status pill.

---

## 6. MOTION SYSTEM AUDIT

| Animation Name | Visual Result | Trigger | Technology | Source File | Duration | Delay | Easing | Transform / Opacity Values |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Boot Materialization** | Particle face assembly | Page load | HTML Canvas + GSAP | `BootScene.tsx` | `6.0s` | `0s` | `power3.out` | Particles converge to targets, `opacity: 0 → 1` |
| **SplitText Reveal** | 3D character flip in | Scroll enter | Anime.js + ScrollTrigger | `SplitText.tsx` | `800ms` | `30ms` stagger | `easeOutBack` | `translateY: [50, 0]`, `rotateX: [-90, 0]`, `opacity: [0, 1]` |
| **Hero Image Assembly**| Blur-to-clear reveal | Mount | Anime.js | `HeroScene.tsx` | `1200ms` | `300ms` | `easeOutQuart` | `scale: [0.85, 1]`, `filter: blur(15px) → blur(0)` |
| **Hero Image Float** | Idle breathing float | Continuous | Anime.js | `HeroScene.tsx` | `4500ms` | `0s` | `easeInOutSine` | `translateY: [-8px, 8px]` alternate loop |
| **Camera Depth Push**| 3D Z-translation | Scroll velocity | GSAP + Lenis | `CameraController.ts`| `0.6s` | `0s` | `power2.out` | `translateZ: velocity * 0.2` (max ±12px) |
| **Magnetic Pull** | Elastic button track | Mouse move | Custom hook | `useMagneticHover.ts`| Dynamic | `0s` | Physics spring | `translateX/Y: offset * 0.3` |
| **Glass Card Tilt** | 3D card tilt | Mouse move | Anime.js | `GlassCard.tsx` | `400ms` | `0s` | `easeOutQuad` | `rotateY: dx * 6deg`, `rotateX: -dy * 6deg`, `scale: 1.02` |
| **Card Elastic Reset**| Spring back to origin | Mouse leave | Anime.js | `GlassCard.tsx` | `600ms` | `0s` | `easeOutElastic(1,0.4)`| `rotateY: 0`, `rotateX: 0`, `scale: 1.0` |
| **Aurora Blob Float** | Background light morph | Continuous | GSAP | `HeroAuroraGlass.tsx`| `6.0s` | Staggered | `sine.easeInOut` | `x: ±45px`, `y: ±40px`, `scale: 0.9 → 1.2` |
| **Particle Deflection**| Canvas particle shift | Mouse move | HTML Canvas 2D | `CinematicParticleCanvas.tsx`| 60 FPS | `0s` | Linear lerp | `drawX = x + normMouseX * (size / 3)` |
| **Showcase Clip Reveal**| Frame unclip reveal | Scroll enter | GSAP ScrollTrigger | `CinematicProfileShowcase.tsx`| `1.1s` | `0.15s` | `power4.out` | `clipPath: polygon(0 100%...) → polygon(0 0...)` |
| **Accordion Toggle** | Collapsible height | Click | GSAP | `FAQAccordion.tsx` | `350ms` | `0s` | `power2.out` | `height: 0 → auto` |
| **Modal Zoom Entrance**| Backdrop blur & scale | Trigger event | Anime.js / GSAP | `LegalModal.tsx`, `ProjectModal.tsx` | `450ms` | `0s` | `easeOutQuart` | `scale: [0.94, 1]`, `translateY: [25, 0]`, `opacity: [0, 1]` |

---

## 7. ASSEMBLY / DE-ASSEMBLY SYSTEM

### 7.1 Particle Portrait Materialization (`BootScene.tsx`)
- **Source File**: `src/components/scenes/BootScene.tsx`.
- **Mechanism**: Reads `/assets/pratheesh4k2.jpeg` onto an offscreen canvas (`110x140` resolution sample), extracts pixel RGB and alpha channels, and maps valid face/hair/clothes pixel targets to 2D screen coordinates.
- **Particle Count**: ~3,000 active particles.
- **Progressive Feature Stages**:
  1. `face` (Stage delay `0.0s`) — Facial features materialize first.
  2. `hair` (Stage delay `0.2s`) — Hairline particles converge.
  3. `eyes` (Stage delay `0.35s`) — Eye area sharpens.
  4. `clothes` (Stage delay `0.5s`) — Suit and shoulders assemble.
  5. `lighting` — Volumetric backdrop lighting resolves.
- **Easing & Timelines**: GSAP master timeline (`0` to `1` over `5.6s`) with `power3.out` particle interpolation.
- **Transition Out**: Seamless `opacity: 0`, `scale: 1.04` morph directly revealing the active Hero scene.

### 7.2 Staggered Section Assembly & Disassembly (`AnimeMasterEngine.ts`)
- **Assembly Sequence**: Background (`0ms`) → Profile Image (`100ms`) → Headings (`200ms`) → Subheadings (`280ms`) → Glass Cards (`350ms`) → Buttons (`450ms`) → Icons (`500ms`) → Ambient Particles (`550ms`).
- **Disassembly Exit**: Triggered when scrolling out of scene view. Typography slides away (`translateY: -35px`, `opacity: 0`), cards blur out (`filter: blur(8px)`, `scale: 0.95`), and images zoom slightly (`scale: 1.05`, `opacity: 0`).

---

## 8. THREE.JS / WEBGL / 3D AUDIT

- **Source File**: `src/components/three/HeroGlobe.tsx`.
- **Libraries Used**: `three` (`^0.185.1`).
- **Geometry**: `THREE.BufferGeometry` configured with `3,000` vertices distributed via Fibonacci sphere mathematical algorithm:
  ```typescript
  const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  ```
- **Palette & Material**: `THREE.PointsMaterial` (`size: 0.022`, `vertexColors: true`, `transparent: true`, `opacity: 0.75`). Color palette consists of Sky Blue (`#3B82F6`), Cyan (`#0EA5E9`), Lavender (`#8B5CF6`), Soft Ice (`#C7D7FD`), and White (`#FFFFFF`).
- **Render Loop**: `requestAnimationFrame` continuous rotation loop (`globe.rotation.y += 0.0015`).
- **Mouse Interaction**: Smooth rotational tilt tracking based on normalized mouse coordinates (`globe.rotation.y += (mouseX * 0.3 - globe.rotation.y) * 0.02`).
- **Visual Impact**: Floating, interactive 3D particle globe background accent positioned behind Hero elements.
- **Performance Cost**: Low-to-medium GPU overhead (~1-2ms per frame). Clean memory disposal (`geo.dispose()`, `mat.dispose()`, `renderer.dispose()`) on component unmount.

---

## 9. BACKGROUND VISUAL SYSTEM

### Layer Stack Architecture (Back to Front)
1. **Layer 1 — Base Background**: `#F8FAFC` (Light Mode) / `#090D16` (Dark Mode) set on `html, body`.
2. **Layer 2 — Fixed Ambient Orbs (`AmbientBackground.tsx`)**: 3 blur-softened (`80px-100px`) radial gradient light orbs reacting to mouse parallax.
3. **Layer 3 — Floating Particle Canvas (`CinematicParticleCanvas.tsx`)**: 60 ambient luminous particles drifting with mouse deflection and scroll velocity dynamics.
4. **Layer 4 — Aurora Glass Shimmer (`HeroAuroraGlass.tsx`)**: Morphing blue/lavender/mint aurora blobs positioned inside section backgrounds.
5. **Layer 5 — 3D Perspective World Space (`#camera-perspective` / `#main-world`)**: Interactive glassmorphic cards, text, portraits, and UI components.
6. **Layer 6 — Custom Cursor (`CursorLighting.tsx`)**: Inverted blend dot tracking mouse movement.
7. **Layer 7 — Fixed Navigation & Overlays**: Floating navbar (`z-index: 8000`), AI Concierge (`z-index: 9000`), Modals & Drawers (`z-index: 99999`).

---

## 10. SCROLL SYSTEM

- **Scroll Engine**: Lenis (`lenis^1.3.25`).
- **Configuration**:
  - `duration: 1.2`
  - `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
  - `smoothWheel: true`
- **GSAP Ticker Integration**:
  ```typescript
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0, 0);
  ```
- **Virtual Camera Synchronization**: `onScroll` listener passes normalized scroll progress (`0.0` to `1.0`) and velocity directly to `camera.updateCamera(progress, velocity)` and `animeEngine.scrubScroll(progress)`.
- **Modal Locking**: `useScrollLock.ts` hooks into modal open states (`isOpen`), disabling Lenis smooth scroll and locking `document.body.style.overflow = 'hidden'`.

---

## 11. INTRO / BOOT SCREEN TIMELINE

| Time Marker | Visual / System Event | File Source |
| :--- | :--- | :--- |
| **`0ms`** | Black space (`#090D16`) overlay locks scroll; offscreen image sampling begins. | `BootScene.tsx` |
| **`150ms`** | 3,000 particles spawn at random radial distances and begin converging toward portrait targets. | `BootScene.tsx` |
| **`800ms`** | `face` feature particles assemble (eyes, nose, mouth contours appear). | `BootScene.tsx` |
| **`1500ms`**| `hair` & `eyes` feature particles sharpen into focus. | `BootScene.tsx` |
| **`2400ms`**| `clothes` suit particles align into crisp shoulder and collar boundaries. | `BootScene.tsx` |
| **`3400ms`**| Volumetric portrait background image (`/assets/pratheesh4k2.jpeg`) fades in (`opacity: 0.95`, `blur: 0`). | `BootScene.tsx` |
| **`4000ms`**| Central typography ("PRATHEESH CLEMENT", tagline, status pill) stagger animates into view. | `BootScene.tsx` |
| **`5600ms`**| Assembly timeline completes; `Esc` skip button active. | `BootScene.tsx` |
| **`6000ms`**| Boot overlay morphs out (`scale: 1.04`, `opacity: 0`), releasing page scroll lock into live Hero scene. | `BootScene.tsx` |

---

## 12. COMPONENT INVENTORY

| Component | Purpose | File Path | Used By | Visual Role | Animation | Reusable? | Cost |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **App** | Root layout & engine manager | `src/App.tsx` | `main.tsx` | Mounts perspective & Lenis loop | RAF ticker loop | No | Low |
| **Navbar** | Header bar & navigation drawer | `src/components/layout/Navbar.tsx` | `App.tsx` | Floating glass capsule bar | Anime.js stagger & gear spin | Yes | Low |
| **AmbientBackground** | Reactive background atmosphere | `src/components/layout/AmbientBackground.tsx` | `App.tsx` | Soft light orb layers | Mouse parallax GSAP | Yes | Low |
| **CinematicParticleCanvas**| 2D ambient floating particles | `src/components/layout/CinematicParticleCanvas.tsx` | `App.tsx` | Canvas particle background | 60 FPS Canvas RAF | Yes | Low |
| **CursorLighting** | Inverted mouse cursor dot | `src/components/layout/CursorLighting.tsx` | `App.tsx` | Pointer tracking dot | GSAP position lerp | Yes | Low |
| **BootScene** | Opening particle materialization | `src/components/scenes/BootScene.tsx` | `App.tsx` | Full-screen intro sequence | Canvas particle sampling | No | Medium |
| **HeroScene** | Primary hero landing showcase | `src/components/scenes/HeroScene.tsx` | `App.tsx` | Title, portrait & CTAs | Anime.js + GSAP ScrollTrigger | No | Medium |
| **AboutScene** | Story, vision & metrics showcase| `src/components/scenes/AboutScene.tsx` | `App.tsx` | Story columns & portrait card | Mouse parallax orbs | No | Low |
| **SkillsScene** | Technical capabilities grid | `src/components/scenes/SkillsScene.tsx` | `App.tsx` | 3D capability cards grid | Scroll entry stagger | No | Low |
| **ProjectsScene** | Work showcase & case studies | `src/components/scenes/ProjectsScene.tsx` | `App.tsx` | Case study card grid | Hover glow & modal pop | No | Low |
| **ExperienceScene** | Timeline career & credentials | `src/components/scenes/ExperienceScene.tsx` | `App.tsx` | Vertical timeline list | Horizontal slide entry | No | Low |
| **ServicesScene** | Offerings & capability rows | `src/components/scenes/ServicesScene.tsx` | `App.tsx` | Horizontal service rows | Magnetic row hover | No | Low |
| **TestimonialsScene** | Core principles & FAQ | `src/components/scenes/TestimonialsScene.tsx` | `App.tsx` | Principles cards & FAQ list | Split reveal entrance | No | Low |
| **ContactScene** | Direct contact & glass footer | `src/components/scenes/ContactScene.tsx` | `App.tsx` | Contact info, 3D tilt & footer | Blur-clear entrance | No | Low |
| **HeroGlobe** | Interactive 3D particle sphere | `src/components/three/HeroGlobe.tsx` | `HeroScene.tsx` | Background 3D globe accent | Three.js RAF render loop | Yes | Medium |
| **AIConcierge** | Role-based AI assistant modal | `src/components/ai/AIConcierge.tsx` | `App.tsx` | Chat window & trigger orb | GSAP scale in/out | Yes | Low |
| **GlassCard** | Reusable glass surface card | `src/components/ui/GlassCard.tsx` | Multiple | Glassmorphic container | 3D mouse tilt & elastic reset | Yes | Low |
| **MagneticButton** | Physics magnetic hover button | `src/components/ui/MagneticButton.tsx` | Multiple | Pill button wrapper | Proximity magnetic pull | Yes | Low |
| **SplitText** | Staggered 3D text reveal | `src/components/ui/SplitText.tsx` | Multiple | Character heading reveal | Anime.js char flip | Yes | Low |
| **HeroAuroraGlass** | Morphing aurora light blobs | `src/components/ui/HeroAuroraGlass.tsx` | `HeroScene.tsx` | Background color mesh | GSAP sine float | Yes | Low |
| **CinematicProfileShowcase**| 3D tilt profile card showcase | `src/components/ui/CinematicProfileShowcase.tsx` | `ContactScene.tsx` | Frame, spotlight & glow ring | Clip-path & 3D tilt | Yes | Medium |
| **CommandPaletteModal**| Spotlight search modal (`⌘K`) | `src/components/ui/CommandPaletteModal.tsx` | `App.tsx` | Command search window | Anime.js scale entrance | Yes | Low |
| **LegalModal** | SEO legal documents viewer | `src/components/ui/LegalModal.tsx` | `App.tsx` | Privacy/Terms modal window | Anime.js scale entrance | Yes | Low |
| **ProjectModal** | Case study modal detail viewer | `src/components/ui/ProjectModal.tsx` | `ProjectsScene.tsx` | In-place case study window | GSAP scale & focus trap | Yes | Low |
| **FAQAccordion** | Collapsible FAQ items | `src/components/ui/FAQAccordion.tsx` | `TestimonialsScene.tsx`| Accordion list | GSAP height expansion | Yes | Low |
| **ConsentBanner** | Cookie consent manager | `src/utils/ConsentBanner.tsx` | `App.tsx` | Consent dialog popup | Anime.js entrance & exit | Yes | Low |

---

## 13. SCENE SYSTEM BREAKDOWN

1. **BootScene (`#scene-boot`)**: 6.0s materialization intro using offscreen canvas pixel sampling to assemble ~3,000 particles into Pratheesh Clement's 4K portrait.
2. **HeroScene (`#scene-hero`)**: Main landing space featuring aurora glass background, `SplitText` title headings, motto glass card, magnetic buttons, and 4K profile card.
3. **AboutScene (`#scene-about`)**: Story and strategic vision split layout featuring core values pills, head-and-shoulders portrait card, career origin narrative, and strategic positioning.
4. **SkillsScene (`#scene-skills`)**: 6-domain technical matrix (Technical SEO, Web Development, Paid Advertising, Digital Marketing, AI & Automation, UI/UX Design) with category badges and skill pills.
5. **ProjectsScene (`#scene-projects`)**: 4 featured case studies with hover glow effects, metrics, tech stack tags, and modal triggers.
6. **ExperienceScene (`#scene-experience`)**: Vertical timeline showcasing Google Skillshop certification (`ID: 453421024`), Nexteer Automotive production role, and self-taught web developer journey.
7. **ServicesScene (`#scene-services`)**: 5 horizontal service capability rows with magnetic hover tilt and highlight tags.
8. **TestimonialsScene (`#scene-testimonials`)**: 7 core principles pills, verified client feedback coming soon notice, and collapsible FAQ accordion.
9. **ContactScene (`#scene-contact`)**: Direct inquiry options (Email, Phone/WhatsApp, Location), `CinematicProfileShowcase` 3D tilt frame, and high-end 4-column glass footer.

---

## 14. UI COMPONENT SYSTEM

- **Buttons**: `<MagneticButton>` wraps primary (`btn-primary` with gradient shadow) and secondary (`btn-secondary` with frosted glass) buttons with magnetic hover physics.
- **Cards**: `<GlassCard>` provides frosted glass surface styling (`backdrop-filter: blur(24px)`), inset highlights, 3D mouse tilt tracking, and elastic return.
- **Pills / Chips**: `.pill` utility class providing subtle sky blue/lavender/mint background tint, rounded pill borders (`border-radius: 9999px`), and scaling hover animations.
- **Modals**: Fixed overlay windows (`.modal-overlay`) with backdrop blur (`12px-36px`), focus traps, escape key listeners, and body scroll locking.

---

## 15. NAVBAR FORENSICS

- **Desktop Navbar**: Floating glass capsule bar centered at `top: 16px`. Features profile photo brand mark (`32x32`), active link highlight pill (`rgba(59, 130, 246, 0.1)`), theme toggle, AI Assistant launcher, and `⌘K` command search launcher.
- **Mobile Navbar**: Converts desktop links into an animated gear button (`.mobile-only-gear`). Clicking gear rotates icon 180° and opens full-screen glass drawer with animated navigation items and resume download CTA.

---

## 16. RESPONSIVE DESIGN MATRIX

| Breakpoint (px) | Layout Transformation | Navigation Behavior | 3D / Motion Behavior | Typography Adjustments |
| :--- | :--- | :--- | :--- | :--- |
| **`< 768px`** | Grids stack to 1-column (`.grid-2`, `.grid-3`) | Links hide; gear icon drawer activates | Mouse tilt & cursor dot disabled | Hero H1 scales to `2.6rem` |
| **`768px - 1024px`**| 2-column flex layouts with reduced padding (`80px 20px`)| Desktop inline navbar visible | Standard 3D tilt & magnetic pull active | H1 scales to `3.6rem` |
| **`> 1024px`** | Full 1200px container width (`1200px`) | Full inline links + `⌘K` command pill | Maximum 3D depth, globe & particles active | H1 scales to `4.8rem` |

---

## 17. PERFORMANCE ARCHITECTURE

- **Low Cost**: CSS custom properties, static GlassCard surfaces, Lucide icons, Google Fonts text rendering.
- **Medium Cost**: Lenis smooth scroll inertia, GSAP ScrollTrigger timeline calculations, Three.js 3,000-particle globe points.
- **High Cost**: `BootScene.tsx` initial pixel canvas sampling (executes once during boot then cleanly unmounts).
- **Optimization Strategy**:
  - `will-change: transform` declared strictly on moving layers.
  - Image assets loaded with `loading="eager"` / `loading="lazy"` and `decoding="async"`.
  - All 9 scene components lazy-loaded via `React.lazy()`.
  - `prefers-reduced-motion` listener disables heavy canvas loops and tilts automatically.

---

## 18. IMAGE / ASSET SYSTEM

- **File**: `/assets/pratheesh4k1.jpeg`
  - Path: `public/assets/pratheesh4k1.jpeg`
  - Dimensions: `600 x 800 px`
  - Used In: `Navbar.tsx` (brand icon), `AboutScene.tsx` (portrait card), `ContactScene.tsx` (footer mark).
  - Display: `object-fit: cover`, `object-position: center 10%`.
- **File**: `/assets/pratheesh4k2.jpeg`
  - Path: `public/assets/pratheesh4k2.jpeg`
  - Dimensions: `1080 x 1920 px` (4K Full Composition)
  - Used In: `BootScene.tsx` (intro materialization), `HeroScene.tsx` (hero profile card), `CinematicProfileShowcase.tsx` (contact showcase).
  - Display: `object-fit: cover`, `object-position: center 10%-20%`.
- **File**: `/favicon.png`
  - Path: `public/favicon.png`
  - Size: `631 KB`
  - Used In: HTML favicon link tags.

---

## 19. AI INTERFACE

- **Components**: `src/components/ai/AIConcierge.tsx` & `src/data/aiKnowledgeBase.ts`.
- **Trigger**: Fixed floating gradient orb (`56x56px`) at `bottom: 28px`, `right: 28px` (`z-index: 9000`).
- **Role Selection**: 5 initial personas (Recruiter, Founder, Client, Developer, Browsing).
- **Knowledge Engine**: Local client-side intelligence query engine (`queryAIConcierge`). Uses string similarity matching across `IDENTITY`, `EXPERIENCE`, `SKILLS`, `PROJECTS`, and `SERVICES` datasets.
- **Session State**: Saves last 40 message items to `sessionStorage` (`px-ai-session`).

---

## 20. SOUND SYSTEM

- **Source File**: `src/utils/soundEffects.ts`.
- **Technology**: Native Web Audio API Synthesizer (`AudioContext`). Zero external audio sample files loaded over network.
- **Audio Syntheses**:
  - `playClick()`: Sine wave frequency ramp (`800Hz → 400Hz` over `40ms`).
  - `playWindowSwitch()`: Triangle wave frequency ramp (`440Hz → 880Hz` over `80ms`).
  - `playBootChime()`: C-major chord shimmer (`[261.63, 329.63, 392.00, 523.25, 659.25] Hz`).
  - `playTypingSound()`: Random sine pulse (`600Hz - 800Hz` over `20ms`).

---

## 21. SEO ARCHITECTURE

- **Primary Title**: `Pratheesh Clement | Digital Marketing Specialist & AI Enthusiast | SEO Expert Vadalur`
- **Canonical URL**: `https://pratheeshclement-cmd.github.io/`
- **Meta Directives**: `robots: index, follow, max-image-preview:large`.
- **JSON-LD Structured Data**: Full Schema Graph in `index.html` containing:
  - `@type: Person` (`Pratheesh Clement`, `Mariya Pratheesh`, BCA degree, Google Digital Marketing credential).
  - `@type: WebSite` (`Portfolio X — Pratheesh Clement`).
  - `@type: ProfessionalService` (`Pratheesh Clement Digital Consultancy`, Vadalur TN coordinates `11.5532, 79.5516`).
  - `@type: BreadcrumbList` (7-step hierarchy).
  - `@type: FAQPage` (3 core questions & answers).

---

## 22. PORTFOLIO OS X — EXACT VISUAL RECIPE

To replicate this exact visual design language in any target codebase:

1. **Color Tokens**:
   - Establish CSS variables for Slate Light `#F8FAFC` and Midnight Dark `#090D16`.
   - Use sky blue `#3B82F6` and cyan `#0EA5E9` for primary accents, lavender `#8B5CF6` for secondary accents, and emerald mint `#10B981` for status indicators.
2. **Typography Setup**:
   - Load Google Fonts: `Space Grotesk` (Headings), `Inter` (Body), `JetBrains Mono` (Code/IDs).
   - Set heading line heights to `1.0 - 1.1` with `letter-spacing: -0.02em`.
3. **Glassmorphic Surface Recipe**:
   - Background: `rgba(255, 255, 255, 0.45)` (Light) / `rgba(17, 24, 39, 0.65)` (Dark).
   - Backdrop Filter: `blur(24px) saturate(180%)`.
   - Border: `1px solid rgba(255, 255, 255, 0.7)` (Light) / `rgba(255, 255, 255, 0.15)` (Dark).
   - Inset Highlight: `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9)`.
4. **Hero Profile Card Recipe**:
   - Outer GlassCard container with 3D tilt tracking (`rotateY`, `rotateX` max ±6deg).
   - Inner image box with `aspect-ratio: 4 / 4.8`, `border-radius: 20px`, and top-positioned object fit (`object-position: center 10%`).
   - Floating glass status badge at bottom left with pulsing green dot (`#10B981`).
5. **Continuous Camera Motion**:
   - Wrap main world container in a perspective element (`perspective: 1200px`).
   - Bind Lenis scroll progress to GSAP Z-translation push (`translateZ: velocity * 0.2`).

---

## 23. PORTFOLIO OS X — DESIGN DNA

### MUST PRESERVE
- **Light Theme Default**: Soft pearl white/slate background (`#F8FAFC`). Dark mode optional toggle.
- **Typography Pairing**: `Space Grotesk` headers + `Inter` body + `JetBrains Mono` status tags.
- **Glassmorphic Cards**: `backdrop-filter: blur(24px)` with inset top highlights.
- **Magnetic Buttons**: Physics-based elastic hover attraction on primary CTAs.
- **Verified Fact Integrity**: Zero invented metrics, testimonials, or fake client claims.
- **Consent-Gated Analytics**: GA4 and Meta Pixel execution gated strictly behind cookie consent.

### OPTIONAL
- Sound synthesizer chimes (`soundEffects.ts`).
- 3,000-particle 3D Three.js Fibonacci globe.
- Full 6.0s particle portrait materialization intro.

### DO NOT TRANSFER
- Dark/black background default.
- Disconnected multi-page routes.
- Generic rectangular unstyled button elements.

---

## 24. DESIGN TRANSFER MAP

| Visual Feature | Source File(s) | Dependencies | CSS / Styles | Assets | Direct Reuse / Rebuild Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Glass Card System** | `GlassCard.tsx` | Anime.js | `.glass` in `index.css` | None | **Direct Reuse**: Copy `GlassCard.tsx` & `.glass` styles |
| **Magnetic Buttons** | `MagneticButton.tsx`, `useMagneticHover.ts` | None | `.btn-primary`, `.btn-secondary` | None | **Direct Reuse**: Copy hook & component |
| **Character Text Reveal**| `SplitText.tsx` | Anime.js, ScrollTrigger | `.char` in `index.css` | None | **Direct Reuse**: Drop into any React project |
| **Hero Aurora Glass** | `HeroAuroraGlass.tsx` | GSAP | Radial gradient div styles | None | **Direct Reuse**: Background component |
| **3D Profile Showcase** | `CinematicProfileShowcase.tsx` | GSAP, ScrollTrigger | Showcase CSS classes | `/assets/pratheesh4k2.jpeg` | **Adapt**: Update image asset path |
| **Three.js Particle Globe**| `HeroGlobe.tsx` | Three.js | Container width/height | None | **Direct Reuse**: Pure Three.js component |
| **AI Concierge Assistant**| `AIConcierge.tsx`, `aiKnowledgeBase.ts` | GSAP, Lucide | Chat CSS styles | None | **Direct Reuse**: Update knowledge graph data |
| **Cookie Consent System**| `ConsentBanner.tsx`, `analytics.ts` | Anime.js | Modal overlay styles | None | **Direct Reuse**: Copy banner & analytics scripts |

---

## 25. AUDIT SUMMARY & VERIFICATION

This technical and visual design audit documents every architectural layer, design token, animation parameter, component structure, asset path, and SEO configuration of the Portfolio OS X codebase. The design specification is fully preserved and ready for migration into production environments.
