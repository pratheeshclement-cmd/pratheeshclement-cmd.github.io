# 08 — Pratheesh OS Design Tokens Architecture
**Design System Specification: PRATHEESH OS / Portfolio X**
**Role:** Chief Design Officer & UI/UX Systems Architect

---

## 1. Design Token Philosophy & Token Architecture

The **Pratheesh OS Design System** is an original, Apple-caliber bright glassmorphic design system tailored specifically for Pratheesh Clement ("Architect of Digital Ecosystems"). It rejects generic dark-mode templates in favor of a radiant, high-luminance palette of **Pearl White, Ice Silver, Frosted Crystal Glass, Soft Sky Blue, Soft Lavender, and Soft Mint**.

### Token Hierarchy
Tokens are organized into a strict three-tier architecture:
1. **Primitive Tokens**: Pure color values, base font families, absolute pixel/rem sizes.
2. **Semantic Tokens**: Functional roles (e.g., `--color-surface-glass-primary`, `--color-text-body`).
3. **Component Tokens**: Specific component bindings (e.g., `--card-spotlight-color`, `--navbar-glass-blur`).

---

## 2. Color System Tokens (Bright Premium Palette)

### Primitive Color Palette

```css
:root {
  /* Base Background Primitives */
  --primitive-pearl-50:  #FFFFFF;
  --primitive-pearl-100: #F8FAFC;
  --primitive-pearl-200: #F1F5F9;
  --primitive-ice-100:   #E2E8F0;
  --primitive-ice-200:   #CBD5E1;

  /* Accent Primitives: Sky Blue, Lavender & Mint */
  --primitive-sky-50:    #F0F9FF;
  --primitive-sky-100:   #E0F2FE;
  --primitive-sky-500:   #0284C7;
  --primitive-sky-600:   #026597;

  --primitive-lavender-50:  #FFAF5;
  --primitive-lavender-100: #F3E8FF;
  --primitive-lavender-500: #8B5CF6;
  --primitive-lavender-600: #7C3AED;

  --primitive-mint-50:   #F0FDF4;
  --primitive-mint-100:  #DCFCE7;
  --primitive-mint-500:  #10B981;

  /* Typography Primitives (Slate/Obsidian Contrast) */
  --primitive-slate-950: #020617;
  --primitive-slate-900: #0F172A;
  --primitive-slate-700: #334155;
  --primitive-slate-500: #64748B;
  --primitive-slate-400: #94A3B8;
}
```

### Semantic Surface & Glass Tokens

```css
:root {
  /* Canvas & Background Foundations */
  --color-canvas-bg: var(--primitive-pearl-100);
  --color-canvas-bg-secondary: var(--primitive-pearl-200);

  /* Apple-Level Frosted Glass Surfaces */
  --color-glass-surface-base: rgba(255, 255, 255, 0.65);
  --color-glass-surface-hover: rgba(255, 255, 255, 0.85);
  --color-glass-surface-elevated: rgba(255, 255, 255, 0.92);

  /* Glass Edge Specular Highlights */
  --color-glass-border-subtle: rgba(255, 255, 255, 0.9);
  --color-glass-border-outer: rgba(148, 163, 184, 0.18);
  --color-glass-border-focus: var(--primitive-sky-500);

  /* Functional Brand Accents */
  --color-accent-sky: var(--primitive-sky-500);
  --color-accent-sky-glow: rgba(2, 132, 199, 0.18);
  --color-accent-lavender: var(--primitive-lavender-500);
  --color-accent-lavender-glow: rgba(139, 92, 246, 0.18);
  --color-accent-mint: var(--primitive-mint-500);

  /* Contrast Text Tokens */
  --color-text-display: var(--primitive-slate-950);
  --color-text-heading: var(--primitive-slate-900);
  --color-text-body: var(--primitive-slate-700);
  --color-text-muted: var(--primitive-slate-500);
  --color-text-dim: var(--primitive-slate-400);
}
```

---

## 3. Elevation, Shadow & Glassmorphism Blur Tokens

```css
:root {
  /* Hardware Backdrop Blur Levels */
  --blur-glass-nav: blur(24px) saturate(180%);
  --blur-glass-card: blur(20px) saturate(160%);
  --blur-glass-modal: blur(32px) saturate(200%);
  --blur-glass-dock: blur(28px) saturate(190%);

  /* Multi-Layered Soft Ambient Shadows */
  --shadow-sm: 0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02);
  --shadow-md: 0 12px 24px -6px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03);
  --shadow-lg: 0 24px 48px -12px rgba(15, 23, 42, 0.08), 0 8px 24px -4px rgba(15, 23, 42, 0.04);
  --shadow-glass-glow-sky: 0 20px 40px -10px rgba(2, 132, 199, 0.22);
  --shadow-glass-glow-lavender: 0 20px 40px -10px rgba(139, 92, 246, 0.22);

  /* Inset Edge Highlights (Apple Crystal Specular Edge) */
  --highlight-glass-edge: inset 0 1.5px 0 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 0 rgba(15, 23, 42, 0.05);
}
```

---

## 4. Typography System Tokens

### Font Families
- **Primary Display Font**: `'Plus Jakarta Sans'`, sans-serif (Modern, high-geometric readability).
- **Body & Technical Font**: `'Inter'`, sans-serif (Precision UI rendering).
- **Editorial Accent Font**: `'Instrument Serif'`, serif (Applies editorial elegance to quotes and sub-roles).
- **Code / Mono Font**: `'JetBrains Mono'`, monospace (Technical schema, SEO graphs, AI prompts).

### Fluid Typography Scale Matrix

```css
:root {
  --font-size-display-xl: clamp(3.5rem, 7vw, 6.5rem);  /* 56px to 104px */
  --font-size-display-lg: clamp(2.5rem, 5vw, 4.5rem);  /* 40px to 72px */
  --font-size-heading-1:  clamp(2rem, 3.5vw, 3rem);     /* 32px to 48px */
  --font-size-heading-2:  clamp(1.5rem, 2.5vw, 2.25rem); /* 24px to 36px */
  --font-size-heading-3:  1.25rem;                      /* 20px */
  --font-size-body-lg:   1.125rem;                      /* 18px */
  --font-size-body-md:   1rem;                          /* 16px */
  --font-size-body-sm:   0.875rem;                      /* 14px */
  --font-size-caption:   0.75rem;                       /* 12px */

  /* Line Heights */
  --line-height-tight:  1.05;
  --line-height-snug:   1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.7;

  /* Letter Spacings */
  --letter-spacing-tight: -0.03em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide:  0.08em;
  --letter-spacing-caps:  0.15em;
}
```

---

## 5. Border Radius & Spacing Tokens

### Apple-Style Continuous Radii (Squircular Curves)
```css
:root {
  --radius-xs:   6px;
  --radius-sm:   12px;
  --radius-md:   18px;
  --radius-lg:   24px;
  --radius-xl:   32px;
  --radius-pill: 9999px;
}
```

### Spacing Scale Matrix
```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
}
```

---

## 6. Z-Index Layer Matrix

```css
:root {
  --z-background-canvas: 1;
  --z-ambient-glows:      5;
  --z-scene-content:     10;
  --z-floating-cards:    20;
  --z-sticky-header:    100;
  --z-floating-dock:    200;
  --z-modal-backdrop:   500;
  --z-cursor-overlay:   1000;
}
```
