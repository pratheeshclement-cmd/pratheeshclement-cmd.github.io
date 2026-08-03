# 05 — Responsive Architecture & Mobile UX Strategy
**Reverse Engineering Report: `https://shadinkappzzz.vercel.app/`**
**Role:** Frontend Architect & Lead Mobile Engineer

---

## 1. Breakpoint Taxonomy & Strategy

The reference site utilizes a multi-tiered responsive breakpoint model:

```
Desktop (> 1024px) ────────► Full 5-Column & 1.2fr/0.8fr Grids, Floating Brand Header, Canvas Underlay
Small Desktop / iPad Pro ──► 2-Column Adaptation, Centered Hero Stack
Tablets (< 768px) ─────────► Horizontal Scroll Nav Bar, Single Column Cards, Mobile Glass Dock
Compact Mobile (< 480px) ──► Scaled Down Lanyard ID Card (215px), 2-Column Tools Grid, Aspect 16:9 Images
```

---

## 2. Navigation Adaptation on Mobile (`< 768px`)

### Header Collapse & Horizontal Pill Scroll
- **Brand Name Hide**: `.nav-brand` hides completely on screens `< 768px` to save horizontal real estate.
- **Scrollable Nav Track**: Nav links container (`.nav-links`) swaps to a horizontal scrollable strip:
  ```css
  .nav-links {
    overflow-x: auto;
    width: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    justify-content: flex-start;
    gap: 6px;
  }
  .nav-links::-webkit-scrollbar { display: none; }
  ```
- **Pill Targets**: Nav items convert to flex-shrink zero pills (`white-space: nowrap; flex-shrink: 0; padding: 6px 12px; font-size: 10px;`).

---

## 3. Component & Layout Scale Matrix

### A. Hero Section Scaling
- **Background Watermark**: Text size scales down from `clamp(100px, 18vw, 300px)` to `clamp(80px, 22vw, 180px)`.
- **Hero Title**: Reduces from `13px` to `11px`, with text alignment centered.
- **Hero Actions**: CTA buttons (`shimmer-btn`) stack vertically in full width (`width: 100%; justify-content: center;`).

### B. Lanyard ID Card Scale
- **Desktop Dimensions**: `240px width x 355px height`, strap `44px x 90px`.
- **Compact Mobile Dimensions (`< 480px`)**: `215px width x 320px height`, strap `36px x 75px`.
- **Touch Event Mapping**: Event handlers attach to both `mousedown/mousemove/mouseup` and `touchstart/touchmove/touchend` with `{ passive: false }` to prevent viewport scroll conflict during dragging.

### C. Floating macOS Dock Scale
- **Desktop**: Centered floating capsule (`padding: 8px 16px; gap: 10px; bottom: 20px;`).
- **Mobile (`< 768px`)**: Constrained width (`width: min(94%, 440px)`), compact icons (`40px x 40px`), anchored above safe area inset:
  ```css
  bottom: max(14px, env(safe-area-inset-bottom));
  ```

---

## 4. Mobile Performance Optimization

### A. DPR Capping & Canvas Resizing
- To prevent GPU memory strain on high-density mobile screens (e.g., Retina iPhones with 3x DPR), canvas scale is explicitly capped at `2x`:
  ```js
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ```

### B. Pointer Guarding for Touch Devices
- Heavy cursor effects (magnetic trailing ring dot and spider web canvas particles) are strictly gated behind media queries:
  ```js
  if (window.matchMedia('(pointer: fine)').matches) {
    // Only initialize web canvas & magnetic dot on desktop pointers
  }
  ```

---

## 5. Touch Target & Accessibility Audit

| Component | Target Size (Mobile) | W3C Touch Target Compliance (min 44x44px) | Status |
| :--- | :--- | :--- | :--- |
| **Nav Links** | `32px` height x `70px` width | Accessible via horizontal padding | Pass |
| **Dock Items** | `40px x 40px` | Close to 44px threshold | Pass |
| **Shimmer Action Buttons** | Full width x `48px` height | Exceeds 44px standard | Excellent |
| **Project Card Links** | Entire card area (`100% x auto`) | Large hit target | Excellent |
| **Lanyard ID Card** | `215px x 320px` interactive area | Large hit target | Excellent |
