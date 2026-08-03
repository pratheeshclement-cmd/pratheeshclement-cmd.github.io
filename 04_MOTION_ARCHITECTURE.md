# 04 — Motion Architecture & Physics Engine
**Reverse Engineering Report: `https://shadinkappzzz.vercel.app/`**
**Role:** Motion Designer & Creative Director

---

## 1. Motion Philosophy: Kinetic Realism & Tactile Feedback

The reference website's motion strategy is built around **tactile responsiveness**. Rather than decorative, static CSS entry fades, every motion element is linked directly to user input: scroll position, cursor distance, drag displacement, or hover target.

### Motion Hierarchy & Layers
1. **Background Layer**: Scroll-scrubbed canvas image sequence (3D frame rendering).
2. **Interactive Physics Layer**: Drag-and-release Hooke's Law pendulum (Lanyard ID card).
3. **Cursor Overlay Layer**: Lerped magnetic ring cursor + interactive spider web mesh node particles.
4. **Surface Component Layer**: Card spotlights, shimmer border rotations, logo marquee loops, sonar radar pulses.

---

## 2. Deep Dive: Core Motion Systems

### A. Scroll-Scrubbed Canvas Frame Sequence Engine (`#hero-canvas`)

#### Mechanics & Scrubbing Mathematics
- **Canvas Element**: Fullscreen hardware-accelerated canvas (`width: 100vw; height: 100vh; position: fixed; z-index: 1`).
- **Frame Sequence**: Batch preloaded WebP images (`assets/frame_001.webp` through `frame_N.webp`).
- **Scroll Mapping**:
  $$\text{Fraction} = \frac{\text{scrollTop}}{\text{scrollHeight} - \text{innerHeight}}$$
  $$\text{targetFrame} = \text{Fraction} \times (\text{FRAME\_COUNT} - 1)$$
- **Smooth Scrub Interpolation (Lerp)**:
  $$\text{currentFrame} += (\text{targetFrame} - \text{currentFrame}) \times \text{lerpSpeed} \quad (\text{lerpSpeed} = 0.28)$$
- **Why It Exists**: Creates an immersive visual depth camera movement as the user scrolls, locking the background timeline seamlessly to page scroll without heavy 3D WebGL render overhead.

---

### B. Hooke's Law Spring-Damped Lanyard ID Card (`#id-card-lanyard-wrapper`)

#### Physics Formulation & Code Breakdown
The hanging ID card uses real-time Newtonian spring physics:

```js
// Physics Constants
const STIFFNESS = 0.048; // Elastic spring restoration strength
const DAMPING = 0.915;   // Oscillation decay factor
const SWAY_SPEED = 0.0016; // Idle sway speed

// Hooke's Law Force Calculation
const forceX = -STIFFNESS * posX;
const forceY = -STIFFNESS * posY;

// Velocity & Position Update
velX = (velX + forceX) * DAMPING;
velY = (velY + forceY) * DAMPING;
posX += velX;
posY += velY;
```

#### Visual Physics Response
- **Rubber Stretch**: Strap scales vertically based on downward displacement: `lanyardStrap.style.transform = scaleY(1 + stretch)`.
- **3D Perspective Tilt**: Card tilts along X and Y axes depending on drag displacement velocity: `perspective(800px) rotateX(tiltX) rotateY(tiltY)`.
- **Idle Sway**: When stationary, runs a subtle sine-wave sway (`Math.sin(time * 0.0016) * 4.5deg`).
- **Why It Exists**: Transforms a standard profile photo into a memorable, tactile toy that users physically drag and throw, driving up dwell time and engagement.

---

### C. Pure Canvas Spider Web Trailing Cursor System (`#spider-web-cursor-canvas`)

#### Mechanics & Particle Lifecycle
- **Node Emission**: Moving mouse emits particle nodes with random velocity vectors (`vx`, `vy`), life span (`1.0`), and decay rate (`0.018` to `0.038`).
- **Click Burst (Thwip!)**: Clicking (`mousedown`) explodes 12 directional web nodes radiating outwards in 360 degrees.
- **Mesh Connectivity**:
  - Connects web strands from node to active mouse position if distance `< 190px`.
  - Connects adjacent nodes together if distance `< 140px` to draw dynamic spider-web polygons.
- **Why It Exists**: Connects directly to the site's brand theme (Spider-Man iconography), giving mouse movement a unique visual signature.

---

### D. Conic Border Shimmer Button (`.shimmer-btn`)

#### CSS Keyframe Mechanics
```css
@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
- **Conic Gradient**: `conic-gradient(transparent, #e6192e, transparent 30%)`.
- **Speed & Timing**: `4s linear infinite`.
- **Why It Exists**: Draws user eyes immediately to main Call-To-Action buttons (`GET IN TOUCH`, `DOWNLOAD CV`).

---

## 3. Micro-Interaction & Easing Matrix

| Micro-Interaction | Target Component | Easing Function | Duration | Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **Nav Spotlight Glide** | `.nav-spotlight-pill` | `cubic-bezier(0.25, 1, 0.5, 1)` | `0.3s` | Mouse Enter / Scroll Spy |
| **Cursor Ring Lerp** | `.cursor-ring` | Linear Lerp (`0.18` factor) | Continuous RAF | Mouse Move |
| **Dock Item Magnification**| `.dock-item` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `0.2s` | Hover |
| **Card Hover Lift** | `.project-card`, `.service-card` | `ease` | `0.3s` | Hover (`translateY(-5px)`) |
| **Project Image Scale** | `.project-img-wrapper img` | `ease` | `0.5s` | Card Hover (`scale(1.05)`) |
| **Modal Scale Entrance** | `.modal-card` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)`| `0.3s` | Button Click |
| **Infinite Marquee Track** | `.vengence-marquee-track` | `linear` | `28s` | Automatic / Pauses on Hover |
| **Rotating Text Badge** | `.rotating-svg` | `linear` | `14s` | Automatic continuous spin |
