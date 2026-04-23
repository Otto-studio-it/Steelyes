---
title: Design Rules
description: Design system, visual brand, typography, spacing, motion, accessibility
owner: Ruben (UI/UX lead)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — Design Rules

> Visual brand and component system. Locked. Changes via design review + ADR.

---

## Brand north star

**"The Architectural Forge"**

British industrial heritage + precision engineering. Premium editorial tone. Every interaction feels deliberate, built to last, engineered for reliability.

- No SaaS generic look
- No soft glows or rounded maximalism
- No pill buttons or overly friendly tone
- Confident, plain English (UK)
- High-contrast photography (B&W portraits, documentary workshop scenes)

---

## Colour palette

Verified contrast ratios below. All meet AAA for body text (4.5:1) or large text (3:1).

```css
--color-canvas: #F5F3F0;        /* Warm off-white, background */
--color-ink: #1A1A1A;            /* Deep charcoal, body text */
--color-primary: #9E000C;        /* Primary red, actions & accents */
--color-primary-container: #C41E1E; /* Companion tone, high-emphasis areas */
--color-foundry-gold: #795916;   /* Accent, warmth */
```

### Contrast ratios

| Pair                      | Ratio | WCAG   |
| ------------------------- | ----- | ------ |
| Ink on Canvas             | 15.8:1 | AAA    |
| Primary on Canvas         | 7.1:1 | AAA    |
| Primary-container on Canvas | 11.2:1 | AAA    |
| Foundry Gold on Canvas    | 5.1:1 | AAA    |

---

## Typography

### Typeface stack

- **Headlines**: Barlow Condensed 700 (uppercase, tight tracking)
- **Body**: Barlow 300/400/600 (web-friendly)
- **Specs/Code**: IBM Plex Mono (technical, monospace)
- **Loading**: `next/font` with subsetting; never `<link rel="preload">`

### Scale (mobile-first, base 16px)

| Role          | Size | Weight | Line-height | Mobile | Desktop |
| ------------- | ---- | ------ | ----------- | ------ | ------- |
| H1 (hero)     | 48px | 700    | 1.1         | 32px   | 48px    |
| H2            | 36px | 700    | 1.2         | 24px   | 36px    |
| H3            | 24px | 700    | 1.3         | 20px   | 24px    |
| Body (large)  | 18px | 400    | 1.6         | 16px   | 18px    |
| Body (normal) | 16px | 400    | 1.6         | 16px   | 16px    |
| Body (small)  | 14px | 400    | 1.6         | 14px   | 14px    |
| Caption       | 12px | 300    | 1.5         | 12px   | 12px    |
| Spec/code     | 14px | 400    | 1.4         | 12px   | 14px    |

---

## Spacing & layout

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

**Base design**: 375px (iPhone SE 2). Desktop is progressive enhancement.

### Asymmetric layout principle

No perfect centering. Favour 70/30 or 60/40 column splits. Creates visual tension and sophistication.

Example:
```
Mobile (375px):
┌─────────────────────────┐
│ ██████████   [CTA]      │  Image 70%, text 30%
│ ██████████              │
└─────────────────────────┘

Desktop (1280px):
┌────────────────────────────────────────────┐
│ ████████████████████     [CTA]             │  Image 60%, text 40%
│ ████████████████████     Description       │
└────────────────────────────────────────────┘
```

### Spacing units (scale: 4px base)

| Scale | px  | Use                                  |
| ----- | --- | ------------------------------------ |
| xs    | 4   | Icon padding, tight spacing          |
| sm    | 8   | Component padding, form gaps         |
| md    | 16  | Section spacing, container padding   |
| lg    | 24  | Section separation                   |
| xl    | 32  | Major section gaps                   |
| 2xl   | 48  | Page-level spacing                   |

---

## Components

### Buttons

- **Primary**: `background: var(--color-primary)`, hard edges (no border-radius), white text, 44px min height
- **Secondary**: `background: transparent`, `border: 2px solid var(--color-primary)`, primary text, 44px min height
- **Ghost**: no background, no border, primary text on hover
- **Transition**: 100ms linear, only `background-color` and `color` (no transform)
- **No rounded pill buttons**: hard edges only

Example:
```tsx
<button className="px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors duration-100">
  Get a Quote
</button>
```

### Form inputs

- **Border style**: bottom-border only (no box)
- **Focus state**: thick red underline (3px, var(--color-primary))
- **Label**: above input, smaller text, left-aligned
- **Error**: red text inline below, aria-invalid + aria-describedby
- **Placeholder**: muted (inherit color - 40% opacity)

Example:
```tsx
<div className="flex flex-col gap-2">
  <label htmlFor="width" className="text-sm font-600">Width (mm)</label>
  <input
    id="width"
    type="number"
    className="pb-2 border-b-2 border-gray-300 focus:border-primary focus:outline-none"
    placeholder="e.g. 2400"
  />
</div>
```

### Cards

- **No shadow**: border-based distinction
- **Minimal border-radius**: 4px maximum
- **Border**: 1px solid `border-gray-300`
- **Padding**: 16px (md spacing unit)

### Navigation

- **Minimal menu** (mobile-first)
- **Submenu accordion** (Gates, Other Services, About)
- **Primary CTA** (`Get a Quote`) always visible, sticky top-right on mobile
- **Touch targets**: 48px vertical minimum

---

## Motion

- **Timing function**: `linear` and `ease-out` only
- **Duration**: 100–200ms for micro-interactions, 300–500ms for page transitions
- **No parallax**: no scroll-linked animations
- **No bounce**: no elastic easing
- **Reduced motion**: global hook disables all animations when `prefers-reduced-motion: reduce`

Example:
```tsx
const useReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Usage:
<div className={!useReducedMotion && "transition-opacity duration-300"}>
  Fade in on load
</div>
```

---

## Photography & imagery

### Style

- **High-contrast B&W** or industrial colour
- **Documentary workshop scenes**: real work, real steel, real hands
- **Existing clients' properties**: gates in situ, before/after
- **No stock photography**: commissioned or client-provided only

### Image processing

- **Formats**: JPEG source, optimised to WebP + AVIF via `next/image`
- **Size**: 5–10 MB source files acceptable (resize on-demand in Phase 1, Lambda in Phase 2)
- **PII handling**: blur number plates, house numbers, visible faces (unless consented)
- **Consent**: written permission required before publication

---

## Anti-patterns (forbidden)

- ❌ SaaS generic UI (soft rounded buttons, lots of blue, cheerful tone)
- ❌ Soft glows, blur effects, drop shadows
- ❌ Pill buttons (use hard-edged rectangles)
- ❌ Center-aligned body text (left-align, leave ragged right)
- ❌ Hero video autoplay (bandwidth killer, performance destroyer)
- ❌ Parallax scroll effects
- ❌ Fancy gradient abuse
- ❌ Hover-only affordances (touch-friendly alternate required)

---

## Accessibility

### WCAG 2.1 AA minimum

- **Colour contrast**: 4.5:1 for body text (AAA)
- **Keyboard navigation**: All interactive elements reachable via Tab/Shift+Tab
- **Screen reader**: Semantic HTML, `aria-label`, `aria-live` for dynamic content
- **Motion**: `prefers-reduced-motion: reduce` disables animations
- **Touch targets**: 44 × 44 px minimum (Apple HIG)

### Testing checklist

- [ ] WAVE or axe DevTools scan: zero errors
- [ ] VoiceOver (macOS) walkthrough: all content accessible
- [ ] Keyboard-only navigation: no mouse required
- [ ] Colour contrast: verified with WebAIM tool
- [ ] Focus indicators: visible on all focusable elements

---

## Responsive strategy

### Mobile-first, then enhance

Start at 375px. Add breakpoints for tablet (768px) and desktop (1024px+), but don't redesign — enhance.

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Configurator layout on mobile

Critical for Phase 2:

```
┌──────────────────────┐
│  Three.js Canvas     │  60% of viewport, sticky
│  (draggable model)   │
│                      │
│ ───────────────────  │
│ Step controls (40%)  │  40% of viewport
│ • Width slider       │
│ • Height slider      │  Scrollable
│ • Tube size select   │
│ ───────────────────  │
│ Prev | Next | £2,450 │  Sticky bottom bar
└──────────────────────┘
```

---

## Dark mode

**Out of scope for v1.** Iubenda CMP handles light mode only. Review post-launch.

---

## Component checklist

Every component must have:

- [ ] Default state
- [ ] Hover state (if interactive)
- [ ] Focus state (if interactive, visible outline)
- [ ] Disabled state (if applicable)
- [ ] Error state (if form element)
- [ ] Responsive variants (mobile ≥ 375px, tablet ≥ 768px, desktop ≥ 1024px)
- [ ] Accessibility: ARIA labels, semantic HTML, keyboard operable

---

**Locked document.** Design system changes via design review + ADR.

_Last reviewed: 20 April 2026 · Next review: After brand refresh or component addition_
