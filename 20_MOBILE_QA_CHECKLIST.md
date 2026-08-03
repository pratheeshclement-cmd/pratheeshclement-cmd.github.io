# 20 — Mobile QA & Performance Regression Checklist
**Project:** PRATHEESH OS V2 (Portfolio X)
**Role:** Lead Mobile QA Engineer & Performance Specialist

---

## Executive Mobile QA Strategy

The **Mobile QA Checklist** guarantees flawless responsive presentation, zero horizontal scrolling bugs, high touch target accessibility, and buttery 60 FPS performance across all major mobile viewport sizes.

---

## Viewport Target Matrix

- [ ] **320px**: Ultra-compact mobile (iPhone SE / Older devices)
- [ ] **360px**: Small Android devices (Samsung Galaxy S series)
- [ ] **375px**: Standard iPhone width (iPhone X / 11 / 12 mini)
- [ ] **390px**: Modern iPhone standard (iPhone 13 / 14 / 15)
- [ ] **412px**: Modern Android large (Google Pixel / Samsung Plus)
- [ ] **430px**: Large Pro Max iPhone (iPhone 14 / 15 Pro Max)
- [ ] **768px**: iPad / Tablet vertical viewport

---

## Responsive & Performance Audit Matrix

| Category | QA Verification Requirement | Status |
| :--- | :--- | :--- |
| **Navigation** | Top header collapses into horizontal scrollable pill track; smooth touch scrolling | [ ] PENDING |
| **Buttons** | Action buttons (`shimmer-btn`) span full width with minimum `48px` touch height | [ ] PENDING |
| **Images** | All images scale fluidly with aspect ratio locks; no layout shift (CLS) | [ ] PENDING |
| **Typography** | Headlines scale smoothly using fluid `clamp()` values without word truncation | [ ] PENDING |
| **Projects** | Project cards stack vertically in single column; numerical tags legible | [ ] PENDING |
| **Footer** | Footer copyright & AdSense containers fit within viewport bounds | [ ] PENDING |
| **Scrolling** | Enforces native touch scrolling; zero scroll lagging or touch event conflicts | [ ] PENDING |
| **Cookie Banner** | Floats cleanly above bottom nav dock without blocking content | [ ] PENDING |
| **Theme Toggle** | Switcher reachable by primary thumb arc without overlapping fixed nav | [ ] PENDING |
| **Touch Targets** | All clickable elements maintain minimum `44px x 44px` hit area | [ ] PENDING |
| **No Horizontal Overflow**| `document.body.clientWidth === window.innerWidth`; zero horizontal scrollbar | [ ] PENDING |
| **No Console Errors** | Zero uncaught JS errors, zero unhandled promise rejections | [ ] PENDING |
| **No Broken Assets** | Zero 404 image load failures or missing font files | [ ] PENDING |
| **Animation Loop Safety**| Canvas render loop capped at `2.0x` DPR max; zero duplicate RAF loops | [ ] PENDING |
