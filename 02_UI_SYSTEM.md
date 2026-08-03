# 02 — UI System, Layout Architecture & Design Tokens
**Reverse Engineering Report: `https://shadinkappzzz.vercel.app/`**
**Role:** Senior Product Designer & UI/UX Architect

---

## 1. Layout System & Grid Matrix

### Container Boundaries & Global Alignment
- **Global Max Container Width**: `1400px` centered with `margin: 0 auto;`.
- **Global Section Padding**: `padding: 100px 5vw 60px 5vw;` on desktop, scaling down to `padding: 40px 16px;` on mobile screens (`< 768px`).
- **Canvas Viewport Anchor**: Hardware-accelerated fixed canvas overlay (`width: 100vw; height: 100vh; position: fixed; z-index: 1; pointer-events: none;`).
- **Virtual Page Depth**: `min-height: 900vh;` on `.scroll-container` to map scroll progress to canvas frame sequence Scrubbing (0 to 1 fraction).

### Responsive CSS Grid Specifications

| Section Component | Desktop Structure (`> 1024px`) | Tablet Structure (`768px - 1024px`) | Mobile Structure (`< 768px`) | Column Gap | Row Gap |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Grid** | `grid-template-columns: 1.2fr 0.8fr;` | `grid-template-columns: 1fr;` | `grid-template-columns: 1fr;` | `40px` | `30px` |
| **Services Grid** | `grid-template-columns: repeat(5, 1fr);` | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: 1fr;` | `16px` | `16px` |
| **Core Pillars Grid** | `grid-template-columns: repeat(4, 1fr);` | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: 1fr;` | `20px` | `20px` |
| **Featured Projects Grid** | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: 1fr;` | `grid-template-columns: 1fr;` | `24px` | `24px` |
| **Certifications Grid** | `grid-template-columns: repeat(3, 1fr);` | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: 1fr;` | `20px` | `16px` |
| **Tools Stack Icon Grid** | `grid-template-columns: repeat(6, 1fr);` | `grid-template-columns: repeat(4, 1fr);` | `grid-template-columns: repeat(3, 1fr);` | `12px` | `12px` |
| **Experience/Leadership Grid** | `grid-template-columns: 1fr 1fr;` | `grid-template-columns: 1fr;` | `grid-template-columns: 1fr;` | `32px` | `32px` |
| **QR Code Connect Grid** | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: repeat(2, 1fr);` | `grid-template-columns: 1fr;` | `20px` | `20px` |
| **Contact Section Grid** | `grid-template-columns: 1.2fr 1fr 0.8fr;` | `grid-template-columns: 1fr;` | `grid-template-columns: 1fr;` | `40px` | `32px` |

---

## 2. Spacing Architecture & Rhythm

### Vertical Rhythm Tokens
- **Section Distance**: `100px` top padding + `60px` bottom padding creates an asymmetrical `160px` visual breather between major narrative zones.
- **Section Header Bottom Separation**: `margin-bottom: 36px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);`.
- **Card Inner Padding**:
  - Compact Cards (Service/Cert/Tool): `20px` to `28px`.
  - Large Container Cards (Tools Box / Experience Box): `32px`.
  - Focal Contact Card: `48px 40px` desktop, `32px 18px` mobile.

### Negative Space & Visual Balance Strategy
- The design maintains a **60-30-10 Spatial Balance**:
  - **60% Dark Void**: Deep obsidian dark background (`#0a0404`) allowing floating cards to breathe.
  - **30% Glass Surface**: Translucent glass panels (`rgba(18, 10, 10, 0.78)`) defining active content boundaries.
  - **10% Tactical Accent**: Vivid crimson glow (`#e6192e`), active indicator dots, hover borders, and numeric callouts (`01`, `02`).

---

## 3. Typography Architecture

### Font Stack & Family Pairing
1. **Primary Display Font**: `'Bebas Neue', sans-serif` (Google Font)
   - Used for main hero titles, section headings, numeric tags (`01`, `02`, `2nd Yr`), and lanyard card text.
2. **Body & UI Font**: `'Outfit', sans-serif` (Google Font - Weights: 300, 400, 500, 600, 700, 800)
   - Used for body bios, nav items, buttons, metadata tags, and service details.
3. **Accent Script Font**: `'Caveat', cursive` (Google Font - Weight: 600)
   - Used for warm, informal introductory greetings (`Hello, I'm`).
4. **Editorial Serif Italic Accent**: `Georgia, 'Times New Roman', serif`
   - Used for specialized lanyard card role subtitles (`Developer`).

### Detailed Hierarchy Specification

| Hierarchy Level | Font Family | Size | Weight | Line Height | Letter Spacing | Text Transform | Color Token |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Main Name** | `Bebas Neue` | `clamp(60px, 7.5vw, 115px)` | `400` | `0.9` | `2px` | UPPERCASE | `#ffffff` |
| **Watermark Outline** | `Bebas Neue` | `clamp(100px, 18vw, 300px)` | `400` | `0.85` | `0.02em` | UPPERCASE | `-webkit-text-stroke: 2px #e6192e` |
| **Section Title** | `Outfit` | `13px` / `18px` | `700` | `1.2` | `0.2em` | UPPERCASE | `#ffffff` + Red Dot |
| **Hero Subtitle** | `Outfit` | `13px` | `700` | `1.5` | `0.15em` | UPPERCASE | `var(--accent-red)` |
| **Hero Bio Body** | `Outfit` | `15px` | `400` | `1.6` | `Normal` | None | `var(--text-muted)` |
| **Handwritten Accent**| `Caveat` | `38px` | `600` | `1.0` | `Normal` | None | `var(--text-main)` |
| **Nav Links** | `Outfit` | `10px` | `700` | `1.0` | `0.12em` | UPPERCASE | `rgba(255, 255, 255, 0.7)` |
| **Card Title** | `Outfit` | `12px` - `15px` | `700` | `1.3` | `0.08em - 0.12em`| UPPERCASE | `#ffffff` |
| **Card Body Copy** | `Outfit` | `11px` - `12px` | `400` | `1.4 - 1.5`| Normal | None | `var(--text-muted)` |
| **Large Numbers** | `Bebas Neue` | `28px` - `48px` | `400` | `1.0` | `Normal` | None | `var(--accent-red)` |

---

## 4. Color System & Design Tokens

### Primitive & Semantic Token Definitions

```css
:root {
  /* Tactical Red Accents */
  --accent-red: #e6192e;
  --accent-red-glow: rgba(230, 25, 46, 0.4);
  --accent-red-dark: rgba(230, 25, 46, 0.15);
  --accent-red-solid-card: #d40016;

  /* Obsidian Backgrounds */
  --bg-dark: #0a0404;
  --bg-dark-alt: #0d0506;
  --bg-dark-card-inner: #0f0607;

  /* Glass Surface Tokens */
  --card-bg: rgba(18, 10, 10, 0.78);
  --card-bg-hover: rgba(28, 14, 15, 0.88);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(230, 25, 46, 0.8);

  /* Nav & Glass Floating Header Tokens */
  --nav-bg: rgba(15, 6, 8, 0.78);
  --nav-border: rgba(255, 255, 255, 0.12);
  --dock-bg: rgba(15, 6, 8, 0.85);

  /* Typography & Foreground Tokens */
  --text-main: #ffffff;
  --text-muted: rgba(255, 255, 255, 0.65);
  --text-dim: rgba(255, 255, 255, 0.4);
}
```

### Gradients, Shadow & Highlight System
1. **Card Spotlight Gradient**: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(232, 0, 26, 0.22), transparent 70%)`
2. **Nav Spotlight Pill**: `linear-gradient(135deg, rgba(232,0,26,0.85) 0%, rgba(180,0,15,0.9) 100%)`
3. **Chrome ID Frame Gradient**: `linear-gradient(145deg, #f5f5f5 0%, #c8c8c8 20%, #e8e8e8 35%, #b0b0b0 50%, #d8d8d8 65%, #a0a0a0 80%, #cecece 100%)`
4. **Shimmer Button Glow Rotation**: `conic-gradient(transparent, var(--accent-red), transparent 30%)` spinning continuously via CSS keyframes.
5. **Glass Edge Inset Highlights**: `inset 0 1px 0 rgba(255, 255, 255, 0.15)` creates a realistic 3D polished glass edge reflectiveness.
