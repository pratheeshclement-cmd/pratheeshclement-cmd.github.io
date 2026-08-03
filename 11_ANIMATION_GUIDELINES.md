# 11 — Pratheesh OS Motion System & Animation Guidelines
**Design System Specification: PRATHEESH OS / Portfolio X**
**Role:** Lead Motion Engineer & GSAP Systems Architect

---

## 1. Motion Philosophy: Organic Fluidity & Purposeful Feedback

The **Pratheesh OS Motion System** enforces a fundamental rule: **No motion without purpose**. Animations exist to clarify spatial hierarchy, signal interactivity, guide user attention, and deliver Apple-caliber physical responsiveness.

### Core Motion Rules
1. **Never drop below 60 FPS**: All animations strictly utilize GPU-accelerated properties (`transform: translate3d / scale / rotate`, `opacity`). Zero layout thrashing via `top`, `left`, `width`, or `height` keyframes during scroll.
2. **Spring Physics for Physical Components**: Interactive elements (e.g., Lanyard Card, macOS Dock Icons) use Hooke's Law spring physics rather than artificial linear timers.
3. **Scroll-As-Timeline**: Page scroll acts as a continuous scrubbing input for GSAP ScrollTrigger timeline sequences.

---

## 2. Master Easing Functions & Duration Matrix

```css
:root {
  /* Apple Standard Motion Curve (Silky & Responsive) */
  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);

  /* Spring Bounce Curve (Tactile Micro-Interactions) */
  --ease-spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Gentle Fade & Exit Curve */
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Linear Scrub (Scroll Timeline Scrubbing) */
  --ease-linear: linear;
}
```

### Motion Timing Specification

| Motion Type | Target Component | Easing Function | Duration | Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Nav Spotlight Glide** | `.nav-spotlight-pill` | `var(--ease-apple)` | `350ms` | Hover / Scroll Spy |
| **Dock Icon Scale** | `.dock-item` | `var(--ease-spring-bounce)` | `220ms` | Mouse Over (`1.35x`, `-8px`) |
| **Card Elevate Lift** | `.glass-card` | `var(--ease-apple)` | `400ms` | Hover (`translateY(-6px)`) |
| **Image Mask Zoom** | `.project-img img` | `var(--ease-apple)` | `600ms` | Card Hover (`scale(1.04)`) |
| **Shimmer Conic Spin** | `.shimmer-btn::before` | `var(--ease-linear)` | `4000ms` | Continuous Infinite Spin |
| **Modal Spring Entrance**| `.modal-card` | `var(--ease-spring-bounce)` | `350ms` | Button Trigger Click |
| **Page Camera Scrub** | `GSAP ScrollTrigger` | Lerp scrub `0.85` | Scroll-driven | Viewport Scroll |

---

## 3. Transition System: Layered Transform & Particle Assembly

As specified in non-negotiable **Rule 3 (`GEMINI.md`)**, transitions between portfolio sections never use plain instant swaps or basic opacity fades. Elements assemble and disassemble along layered transform depth planes:

```
[ Layer 1: Ambient Floating Light Accent / Three.js Globe ]
                          │
                          ▼
[ Layer 2: Particle Mesh & Outline Wireframes ]
                          │
                          ▼
[ Layer 3: Frosted Crystal Glass Surface Assembly ]
                          │
                          ▼
[ Layer 4: Typography, Icons & Interactive Controls ]
```

### Transition Mechanics
- As the user scrolls into a new zone (e.g., Hero to About), background particles collapse into geometric wireframe outlines, which then fill with translucent frosted glass, triggering content typography to cascade upward with staggered `50ms` delays.

---

## 4. Micro-Interactions & Cursor Lighting Engine

### Dynamic Cursor Spotlight Integration
Cards feature a mouse-bound radial spotlight (`useCursorSpotlight` hook):

```js
// Calculates mouse coordinates relative to card bounds
const rect = card.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

card.style.setProperty('--mouse-x', `${mouseX}px`);
card.style.setProperty('--mouse-y', `${mouseY}px`);
```

### Visual Effect
- Moves a soft sky-blue / lavender radial gradient illumination inside card bounds:
  `background: radial-gradient(320px circle at var(--mouse-x) var(--mouse-y), rgba(2, 132, 199, 0.12), transparent 75%)`.

---

## 5. Mobile Motion Safeguards

1. **Disable High-Cost Cursor Mesh on Touch Devices**: Gated behind `@media (pointer: fine)`.
2. **Native Touch Scroll Enforcement**: Mobile viewports bypass Lenis RAF scroll listeners to ensure 60 FPS native touch scrolling without input lag.
3. **DPR Capping**: All canvas renderers cap device pixel ratio at `2.0` max.
