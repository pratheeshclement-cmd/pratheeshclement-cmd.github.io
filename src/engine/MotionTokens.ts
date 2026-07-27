// Motion design tokens — all animation constants in one place
// Inspired by HarmonyOS NEXT and Apple spring physics

// ── Easing curves ─────────────────────────────────────────────
export const EASE = {
  out:     'power3.out',
  inOut:   'power2.inOut',
  in:      'power2.in',
  elastic: 'elastic.out(1, 0.3)',
  back:    'back.out(1.7)',
  circ:    'circ.out',
} as const;

// ── Durations (seconds) ───────────────────────────────────────
export const DUR = {
  instant:  0.15,
  fast:     0.3,
  normal:   0.6,
  slow:     0.9,
  crawl:    1.2,
  epic:     1.8,
} as const;

// ── Stagger delays ────────────────────────────────────────────
export const STAGGER = {
  char:  0.025,   // per character in SplitText
  word:  0.06,    // per word
  card:  0.08,    // per card in a grid
  item:  0.05,    // per list item
  pill:  0.04,    // per skill pill
} as const;

// ── Card tilt limits ──────────────────────────────────────────
export const TILT = {
  maxDeg:      6,        // max degrees of 3D tilt
  perspective: 1000,     // CSS perspective px
  scale:       1.015,    // scale on hover
  resetEase:   'elastic.out(0.7, 0.3)',
} as const;

// ── Magnetic button pull ──────────────────────────────────────
export const MAGNETIC = {
  radius:    60,     // px — activation radius
  pull:      0.3,    // translation multiplier
  resetEase: 'elastic.out(1, 0.3)',
  resetDur:  0.6,
} as const;

// ── Parallax depth multipliers ────────────────────────────────
export const PARALLAX = {
  orbs:       0.02,
  grid:       0.08,
  decorative: 0.15,
  cards:      0.25,
  text:       1.0,
} as const;

// ── Scene entrance defaults ───────────────────────────────────
export const SCENE_ENTER = {
  from: { opacity: 0, y: 50 },
  to:   { opacity: 1, y: 0, duration: DUR.normal, ease: EASE.out },
  scrollTrigger: {
    start: 'top 80%',
    end:   'top 30%',
    toggleActions: 'play none none reverse',
  },
} as const;
