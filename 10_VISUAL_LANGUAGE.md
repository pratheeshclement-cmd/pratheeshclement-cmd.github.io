# 10 — Pratheesh OS Visual Language & Materiality
**Design System Specification: PRATHEESH OS / Portfolio X**
**Role:** Creative Director & Visual Identity Lead

---

## 1. Core Visual Identity: "Pristine Spatial Glass"

The **Pratheesh OS Visual Language** establishes an original, ultra-luxurious visual identity called **Pristine Spatial Glass**. It combines the clarity of modern iOS/macOS VisionOS glassmorphism with high-end editorial graphic design.

```
       ┌────────────────────────────────────────────────────────┐
       │               PRISTINE SPATIAL GLASS                   │
       ├──────────────────────────┬─────────────────────────────┤
       │   frosted crystal glass  │  specular edge highlights   │
       │   soft sky/lavender glow │  curved apple squircles     │
       │   pristine slate text    │  asymmetric editorial grids │
       └──────────────────────────┴─────────────────────────────┘
```

---

## 2. Materiality & Surface System

### Surface Layer 1: Pearl Canvas (`--color-canvas-bg`)
- Ultra-clean, non-glare off-white background (`#F8FAFC`) with subtle noise grain overlay (`opacity: 0.025`) to eliminate digital flat colors.

### Surface Layer 2: Frosted Crystal Glass (`.glass-card-primary`)
- **Background**: Translucent pure white (`rgba(255, 255, 255, 0.65)`).
- **Backdrop Blur**: Hardware-accelerated `blur(20px) saturate(180%)`.
- **Specular Highlight Border**: Multi-layered stroke (`border: 1px solid rgba(255, 255, 255, 0.9); box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.06), inset 0 1.5px 0 0 rgba(255, 255, 255, 0.95)`).

### Surface Layer 3: Elevated Interactive Glass (`.glass-card-elevated`)
- **Background**: `rgba(255, 255, 255, 0.88)` on hover.
- **Ambient Lighting**: Soft sky-blue glow (`box-shadow: 0 20px 40px -10px rgba(2, 132, 199, 0.18)`).

---

## 3. Specialized Material Anchors: The Light Frosted Lanyard Card

To adapt the tactile delight of the reference site's lanyard card into Pratheesh Clement's bright brand identity:

1. **Card Frame**: Machined silver chrome edge (`linear-gradient(145deg, #FFFFFF 0%, #E2E8F0 40%, #CBD5E1 100%)`) with real CSS rivet screws in four corners.
2. **Inner Card**: Frosted ice-blue crystal surface (`rgba(224, 242, 254, 0.85)` with watermark text `"PRATHEESH CLEMENT"` rendered in outline-only stroke).
3. **Strap Texture**: Woven silver-slate fabric strap with subtle ribbed thread pattern (`repeating-linear-gradient(...)`).
4. **Carabiner Clip**: Polished metallic silver D-ring connecting strap to card frame.

---

## 4. Image System, Masking & Lighting

### Image Styling Rules
- **Radius**: All image containers strictly use Apple squircle radii (`var(--radius-lg)` or `var(--radius-md)`).
- **Outer Frame**: Enclosed in a 1px frosted glass border (`border: 1px solid rgba(255, 255, 255, 0.8)`).
- **Hover Micro-Zoom**: On card hover, images smoothly scale `1.04x` over `0.6s cubic-bezier(0.16, 1, 0.3, 1)` within their masked container (`overflow: hidden`).
- **Lighting Overlay**: Subtle inner top gradient (`linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%)`) providing realistic glass glare.

---

## 5. Iconography & Graphical System

- **Line Weight**: Uniform `1.75px` stroke weight across all UI icons (Lucide React / custom SVG icons).
- **Icon Sizing**:
  - Small UI Badges: `16px x 16px`
  - Nav & Button Icons: `20px x 20px`
  - Feature Service Icons: `28px x 28px`
- **Icon Colors**: Primary Slate (`--primitive-slate-900`) swapping to Accent Sky Blue (`--primitive-sky-500`) on active/hover states.
