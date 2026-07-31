# Configurator — Design Studio (page override)

> Overrides [`MASTER.md`](../MASTER.md) for `/configurator` and `/embed/configurator`.
> Brand source: [`docs/DESIGN_RULES.md`](../../docs/DESIGN_RULES.md) — "The Architectural Forge".

## North star

**"Non compili un preventivo. Progetti un'apertura."**

Preview-first studio layout. Three narrative acts + summary. Primary path: double swing Victorian.

## Layout

| Viewport | Structure |
|----------|-----------|
| Desktop ≥1024px | 60/40 split: steel preview canvas left, spec panel right with `border-l-4 border-primary` |
| Tablet 768–1023px | Design Studio, single column: chip + `SpecPanel` + compact action bar |
| Phone <768px (default) | **Quick Path** — 3 linear screens, chip, `MobileQuickProgress`, quick action bar |
| Phone, studio mode | Design Studio single column (entered via "Customise everything"), with "Quick path" back link |

### Mobile chrome budget (Phase 1)

Goal: form area ≥ 55% of a 390×844 viewport (was ~40%).

- **No `ConfiguratorStudioHeader` on mobile** — price lives only in the action bar (de-dupe).
- **Preview = `MobilePreviewChip`**, fixed **96px** (8px pad + 80px thumb). Renders the lightweight installation SVG only; **3D/photo chunks load lazily inside the sheet**, never in the chip. Fixed height ⇒ CLS 0.
- **Expanded preview = `MobilePreviewSheet`** — Radix bottom sheet `h-[85dvh]`, drag-handle affordance, Esc + overlay-tap dismiss, `overscroll-behavior: contain`, slide-in via `.cfg-sheet-content` (respects `prefers-reduced-motion`).
- **Action bar `variant="compact"`** — single row: compact price left (`tabular-nums`), Back + Continue right. ~72px vs ~144px stacked.
- **Bottom inset is measured, not fixed.** `ConfiguratorActionBar` publishes `--cfg-actionbar-h` via `ResizeObserver`; scroll container reserves `calc(var(--cfg-actionbar-h, 5.5rem) + 1rem)`. No `9rem` magic number.

### Mobile Quick Path (Phase 2)

North star: **"Three screens. One gate. One quote."** Double swing Victorian preselected; reach the quote in ≤ 3 Continue taps.

- **Default surface on phones** (`viewport.isMobileQuickEligible` = portrait/landscape phone, excludes tablet). Store holds `flowMode: 'quick' | 'studio'` (default `quick`) + `quickStepIndex 0..2`. Desktop/tablet ignore `flowMode`.
- **Screen 1 `QuickGateScreen`** — gate-type hero with "Change" → bottom sheet `GateTypeCardGrid` (progressive disclosure; the 8-type horizontal scroll is hidden by default). Style (2-col), finish (2×2), motor switch. No reset.
- **Screen 2 `QuickOpeningScreen`** — 2 curated width chips (`MOBILE_QUICK_WIDTH_PRESETS`: 1800 / 2400, min-h 56px) + Custom (reveals full `DimensionControl`). Compact height row + "Change". Single "Include posts" switch (steel default). "Add fence panels" → studio Define.
- **Screen 3 `QuickQuoteScreen`** — compact checklist, site-survey checkbox, "Add decorative details" → studio Refine, `ConfiguratorSharePanel`. Primary CTA "Request quote" lives in the action bar (one primary per screen).
- **`MobileQuickActionBar`** — drives `nextQuickStep`/`prevQuickStep`; swaps Continue → `ConfiguratorQuoteHandoffButton` on the last step. Publishes the same `--cfg-actionbar-h`.
- **Quick ↔ Studio:** `CustomizeLink` (`setFlowMode('studio')` + maps step→act: 0→choose, 1→define, 2→refine). Studio on a phone shows a "Quick path" back link while the config stays in the primary slice.
- **Analytics:** `configurator flow mode`, `quick step completed`, `customize all tapped`, `quick path completed`.

### Quick Path polish (Phase 3)

- **System back = step back.** Each forward move pushes a history entry; `popstate` (Android predictive back, iOS swipe-back, browser back) and the in-app Back button both run `prevQuickStep` — the page is never left mid-flow until step 1 (`back-behavior`, `gesture-nav-support`).
- **Swipe-down dismiss** on bottom sheets via `useSheetSwipeDismiss` — handlers attach to the **header/grabber only** (scroll body keeps native scroll, no gesture conflict); spring-back uses `.cfg-sheet-draggable`, suppressed under `prefers-reduced-motion`. Close button + Esc + overlay-tap remain.
- **Numeric keyboards:** `inputMode="numeric"` on the exact-value dimension inputs (`DimensionControl`).
- **QA matrix:** verified at 375 (iPhone SE, no horizontal overflow), 390 (iPhone 14), and landscape phone (740×360 still routes to Quick Path). Covered by E2E.

## Acts (navigation)

1. **Choose** — gate type cards, style comparison, finish, motorised
2. **Define** — dimensions, posts, fence panels (section headings)
3. **Refine** — options accordion (structure / decoration / site)
4. **Summary** — share + quote handoff

## Tokens (configurator-specific)

| Token | Value | Usage |
|-------|-------|-------|
| Preview background | `#F3F2EF` (neutral paper) | Full-bleed canvas — gate finishes read first |
| Spec panel | `bg-white border border-steel/10` | No box shadow; thin steel left rule (not primary red) |
| Corner radius | `rounded-sm` max (2px) | Cards, inputs — no pills |
| CTA primary | `bg-primary min-h-[48px] font-heading uppercase` | Continue, quote only |
| CTA secondary | `border border-steel/12 bg-white` | Back |
| Selection chrome | `border-steel` / `ring-steel/25` | Finish & type selection — keep red for primary actions |
| Label min size | `text-xs` (12px) | Mono uppercase labels |
| Act heading | `font-heading text-xl font-black uppercase` | Panel titles |

## Anti-patterns (do not use)

- `rounded-[24px]`, `rounded-full` on CTAs and cards
- Soft drop shadows on panels
- `<select>` for gate type or style
- Dual Continue controls (desktop vs mobile)
- Orientation hint ("rotate device")
- 5 preview tabs always visible — use 2 primary + overflow menu
- Emoji as icons

## Components

| Component | Role |
|-----------|------|
| `ConfiguratorStudioShell` | Root layout |
| `ActProgressRail` | 3-act + summary progress |
| `ConfiguratorActionBar` | Unified price + Back/Continue (`fixed` / `inline` / `compact`) |
| `MobilePreviewChip` | 96px sticky live-preview chip (mobile) → opens sheet |
| `MobilePreviewSheet` | 85dvh bottom sheet, full `PreviewCanvas` (mobile) |
| `PreviewCanvas` | Steel preview, 2 modes + overflow |
| `GateTypeCardGrid` | Visual gate type selection |
| `StyleComparisonPicker` | Side-by-side style cards |
| `OptionsAccordion` | Grouped options with single switch each |
| `DimensionControl` | Human preset labels + slider |
| `ConfiguratorMobileShell` | Quick Path layout (phones): chip + progress + screen + quick bar |
| `MobileQuickProgress` | Linear "Step X of 3" indicator |
| `QuickGateScreen` / `QuickOpeningScreen` / `QuickQuoteScreen` | The 3 Quick Path screens |
| `MobileQuickActionBar` | Quick Path price + Back/Continue, quote on last step |
| `CustomizeLink` | Escape from Quick Path into the Design Studio |

## Accessibility

- Touch targets ≥ 44×44px
- `role="switch"` / `aria-pressed` for toggles
- `aria-current="step"` on act rail
- Focus ring: `ring-2 ring-primary ring-offset-2`
- `prefers-reduced-motion`: disable 3D auto-rotate
- Preview fullscreen: focus trap, Esc to close
