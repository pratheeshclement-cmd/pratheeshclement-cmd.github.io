# 03 — Component Library Deep Reverse Engineering
**Reverse Engineering Report: `https://shadinkappzzz.vercel.app/`**
**Role:** Senior Product Designer & Frontend Architect

---

## 1. Top Floating Navigation Header (`header`)

### Structural Blueprint
- **Layout**: Fixed positioning (`top: 16px; left: 50%; transform: translateX(-50%); width: min(92%, 1080px);`).
- **Surface**: Dark translucent glass (`background: rgba(15, 6, 8, 0.78)`), hairline glass border (`border: 1px solid rgba(255, 255, 255, 0.12)`), pill border radius (`40px`), hardware backdrop blur (`backdrop-filter: blur(20px)`), and subtle top highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.15)`).
- **Sub-Components**:
  1. `nav-brand`: Text block featuring initials + category separator (`/` rendered in `--accent-red`). Hidden on mobile (`< 768px`).
  2. `nav-links`: Flex container holding anchor tags (`SERVICES`, `PROJECTS`, `AWARDS`, `SKILLS`, `EXPERIENCE`, `GALLERY`, `CONTACT`).
  3. `nav-spotlight-pill`: Dynamic background highlight pill (`position: absolute; border-radius: 20px; background: linear-gradient(...)`). Glides underneath hovered/active nav links by calculating bounding client rect offsets (`offsetLeft`, `offsetWidth`).

---

## 2. Interactive macOS Floating Dock (`.vengence-glass-dock`)

### Structural Blueprint
- **Layout**: Fixed bottom anchor (`bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999;`).
- **Surface**: Ultra-dark glass capsule (`rgba(15, 6, 8, 0.85)`), pill radius (`28px`), crimson ambient shadow (`0 0 20px rgba(232, 0, 26, 0.25)`).
- **Dock Icons (`.dock-item`)**:
  - `42px x 42px` rounded glass square (`border-radius: 14px; background: rgba(255, 255, 255, 0.06);`).
  - **Hover Micro-Interaction**: Scales up `1.35x` and shifts upward `-8px` using a snappy spring cubic-bezier (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Background swaps to red glass (`rgba(232, 0, 26, 0.25)`).
  - **Tooltip (`.dock-tooltip`)**: Pops up above dock item (`bottom: 54px; opacity: 1; transform: translateX(-50%) scale(1);`).

---

## 3. Shimmer Action Buttons (`.shimmer-btn`)

### Structural Blueprint
- **Technique**: Conic Gradient Rotation Mask.
- **Layers**:
  - `::before`: Absolute pseudo-element spanning `200%` container size, running a `4s` infinite spinning conic gradient (`conic-gradient(transparent, var(--accent-red), transparent 30%)`).
  - `::after`: Inner mask covering container with `1px` offset to expose rotating conic edge border, background dark `#0f0607`.
  - Content: Flex container holding uppercase title + vector arrow (`⟶`).
- **Hover Physics**: Translates `-3px` upwards, scales `1.02x`, and casts crimson drop shadow (`box-shadow: 0 10px 25px var(--accent-red-glow)`).

---

## 4. Cursor Spotlight Cards (`.project-card`, `.cert-card`, `.service-card`, `.pillar-card`, `.tool-card`)

### Structural Blueprint
- **Spotlight Lighting Effect**: Every card contains a pseudo-element (`::before`) bound to CSS variables `--mouse-x` and `--mouse-y`.
- **Event Handler**: On `mousemove`, JavaScript calculates mouse offset relative to card bounds (`e.clientX - rect.left`, `e.clientY - rect.top`) and updates CSS variables in real time.
- **Visual Output**: Smooth radial glow follows cursor inside card bounds (`background: radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(232, 0, 26, 0.22), transparent 70%)`).

---

## 5. Specialized Component Breakdown

### A. Featured Project Cards (`.project-card`)
- **Image Container (`.project-img-wrapper`)**: `250px` height container with `overflow: hidden`.
- **Hover Zoom**: Image scales `1.05x` over `0.5s ease`.
- **Project Meta Strip**: Flex container featuring bold red index number (`01`, `02`), uppercase title, domain link (`pibots.in ↗`), and arrow callout.

### B. Infinite Tech Stack Logo Marquee (`.vengence-marquee-container`)
- **Container Mask**: Uses CSS mask gradient to create seamless fade-out edges (`mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)`).
- **Track (`.vengence-marquee-track`)**: Flex track animating `translateX(0)` to `translateX(-50%)` over `28s linear infinite`. Pauses automatically on user hover.
- **Logo Chip (`.vengence-logo-chip`)**: Translucent pill (`padding: 8px 18px; border-radius: 30px`) with tech logo + label.

### C. Live Status Sonar Radar (`.nav-status`)
- **Structure**: Compact pill container holding a status label (`KERALA, INDIA` or `AVAILABLE FOR ROLES`).
- **Radar Dot (`.sonar-wrapper`)**: Central red dot with a surrounding ring (`.sonar-ring`) running infinite scaling keyframe (`@keyframes sonarPulse`: `scale(0.6)` at `opacity: 1` to `scale(2.4)` at `opacity: 0`).

### D. Animate UI Contact Modal (`.modal-backdrop` & `.modal-card`)
- **Backdrop**: Fixed dark screen overlay (`rgba(0, 0, 0, 0.85)`) with high-intensity backdrop blur (`blur(16px)`).
- **Modal Card**: Scaled entry transition (`transform: scale(0.92)` to `scale(1)` with elastic bezier `cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
- **Form Inputs**: Custom styled input/textarea fields with red highlight focus states (`border-color: var(--accent-red)`). Integration hooks into Firebase Firestore.
