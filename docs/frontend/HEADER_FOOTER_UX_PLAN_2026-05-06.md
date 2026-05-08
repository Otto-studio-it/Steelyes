---
title: Header and Footer UX Plan
description: Detailed implementation plan for marketing navigation, mobile menu, footer structure, accessibility, and verification
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
branch: feat/header-footer-navigation
---

# Steelyes - Header and Footer UX Plan

This plan defines how to redesign the marketing header and footer without changing the approved visual direction. The goal is to make navigation clearer on desktop, tablet, and mobile while avoiding broken links, fake claims, and unnecessary redesign.

The work should be treated as navigation architecture plus interaction polish, not as a new visual identity.

---

## Current State

Files in scope:

- `apps/web/src/components/marketing/SiteHeader.tsx`
- `apps/web/src/components/marketing/SiteFooter.tsx`
- `apps/web/src/components/marketing/MarketingShell.tsx` only if layout integration requires it

Routes currently safe to expose:

- `/`
- `/gates`
- `/gates/cantilever`
- `/gates/bifold`
- `/gates/pedestrian`
- `/gates/telescopic`
- `/gates/sliding`
- `/gates/architectural`
- `/services`
- `/services/railings`
- `/installation`
- `/gallery`
- `/about`
- `/configurator`
- `/contact`
- `/legal/privacy-policy`
- `/legal/cookie-policy`
- `/legal/terms`

Routes not safe to expose prominently yet:

- `/services/balconies`
- `/services/security`
- `/case-study` index route
- any direct quote success/share-link route

Reason:

Those routes are not confirmed as live pages in the current build. Navigation must not create customer-facing dead ends.

---

## UX Goals

### Primary goal

Make it easy for a visitor to understand what Steelyes does and reach a quote path from any viewport.

### Secondary goals

- Make gate categories easy to find.
- Make services visible without overpromising missing service pages.
- Keep the configurator discoverable as a secondary action.
- Keep mobile navigation fast, readable, and conversion-oriented.
- Keep footer useful as a sitemap and fallback navigation.
- Keep all claims conservative while client data remains incomplete.

---

## Design Principles

### 1. Product first

The first major navigation item should be `Gates`, because gates are the core product, the strongest SEO category, and the main reason most visitors arrive.

### 2. Quote first, configurator second

The main commercial CTA is `Request Quote`. The configurator is valuable, but it is still an exploration tool while pricing and share-link work are incomplete.

### 3. No dead links

Do not expose pages in header/footer unless they return `200` locally and are acceptable for staging review.

### 4. Mobile is not a compressed desktop

The mobile drawer should be intentionally structured, not just a vertical dump of desktop links. It should show the two most valuable actions first, then product navigation.

### 5. Claims must match confirmed data

Remove or avoid:

- fake address;
- fake phone number;
- final service-area claims;
- final warranty claims;
- exact installation coverage claims;
- unapproved proof or testimonial claims.

### 6. Visual style stays Steelyes

Keep:

- industrial uppercase headings;
- red accent;
- white/dark contrast;
- rectangular controls;
- technical labels;
- restrained layout.

Avoid:

- SaaS-style rounded cards;
- marketing fluff;
- decorative icons without purpose;
- overly soft mobile panels;
- large new visual effects in navigation.

---

## Proposed Header Architecture

### Desktop order

```txt
Logo
Gates
Services
Process
Gallery
About
Configure
Request Quote
```

### Desktop behavior

`Logo`

- Links to `/`.
- Text remains `Steelyes Ltd` unless final logo is supplied.
- Minimum touch target: 44px height.

`Gates`

- Should be a dropdown on desktop.
- Top-level click should also go to `/gates`.
- Dropdown should include:

```txt
All Gates
Sliding Gates
Cantilever Gates
Bifold Gates
Pedestrian Gates
Telescopic Gates
Architectural Gates
```

Reason:

Gate detail pages now exist and are key SEO pages. They should be reachable without forcing the user through the catalogue grid.

`Services`

- Should be a dropdown only if it has more than one safe child.
- Current safe children:

```txt
Services Overview
Railings
```

Do not include `Balconies` or `Security` until those pages are created.

`Process`

- Links to `/installation`.
- Label should be `Process`, not `The Process`, to keep desktop nav compact.

`Gallery`

- Links to `/gallery`.
- Use `Gallery`, not `Case Studies`, until real case study content exists.

`About`

- Links to `/about`.
- Keep as a simple link.

`Configure`

- Links to `/configurator`.
- Secondary CTA styling: outlined or quieter than quote.
- Should be visible desktop only if space allows.

`Request Quote`

- Links to `/contact`.
- Primary red CTA.
- Always visible on desktop.

---

## Desktop Layout Rules

Header height:

- Keep around `64px`.
- Do not let dropdown content increase header height.

Breakpoint:

- Use full desktop nav from `lg` upward.
- Do not use full nav at `md`; tablet widths are too tight once dropdowns and CTAs are added.

Spacing:

- Use smaller horizontal gaps than current if needed.
- Prevent wrapping.
- Keep CTA at far right.

Active state:

- Active top-level item should highlight when any child route is active.
- Example: `/gates/cantilever` highlights `Gates`.

Dropdown behavior:

- Open on hover and keyboard focus for desktop.
- Dropdown should not disappear when moving from trigger to panel.
- Use visible focus states.
- Include `aria-haspopup`, `aria-expanded`, and readable labels where practical.

Dropdown visual style:

- White panel.
- Thin zinc border.
- Slight shadow.
- Square or small-radius corners only if already used.
- Red active state.

---

## Proposed Tablet Behavior

Tablet should use the mobile drawer pattern.

Breakpoint:

```txt
< lg = drawer navigation
>= lg = desktop navigation
```

Tablet header should show:

```txt
Logo
Request Quote
Menu icon
```

If horizontal space is tight, hide `Request Quote` and keep it as the first item inside the drawer.

Reason:

Tablet users often interact by touch. Hover dropdowns are unreliable. A drawer is more predictable and prevents cramped nav.

---

## Proposed Mobile Header

Mobile closed state:

```txt
Logo                      Menu
```

Optional if space allows:

```txt
Logo              Quote   Menu
```

Recommended:

- Keep only `Logo` and `Menu` in the top bar for very small screens.
- Put primary action at the top of the opened drawer.

Reason:

On 375px screens, squeezing both quote and menu into the top bar can make the header noisy. The drawer can give the CTA more room.

---

## Proposed Mobile Drawer Order

The mobile drawer should open into a clear action-first structure:

```txt
Request a Quote
Configure Your Gate

Gates
  All Gates
  Sliding Gates
  Cantilever Gates
  Bifold Gates
  Pedestrian Gates
  Telescopic Gates
  Architectural Gates

Services
  Services Overview
  Railings

Process
Gallery
About
Contact
```

### Why this order

`Request a Quote` first:

This is the primary conversion path.

`Configure Your Gate` second:

It supports exploration without replacing quote flow.

`Gates` next:

Most users are product-led. If they are not ready to quote, they need to browse gate types.

`Services` after gates:

Useful but secondary to the main product.

`Process`, `Gallery`, `About`:

These answer trust and education questions after product intent is established.

`Contact` last:

Still available, but not competing with the stronger quote CTA.

---

## Mobile Interaction Rules

Drawer behavior:

- Opens below sticky header.
- Uses full viewport width.
- Should not be visually cramped.
- Must close when a link is clicked.
- Escape key should close if reasonably simple to implement.
- Body scroll lock is optional, but recommended if drawer height fills the viewport.

Submenus:

- Use accordion sections for `Gates` and `Services`.
- Default `Gates` open on mobile.
- Default `Services` closed unless current route is inside `/services`.
- Use chevron rotation for state.
- Do not nest more than one level.

Touch targets:

- Minimum height: 44px.
- Prefer 48-56px rows for primary items.

Text:

- Uppercase heading style is acceptable.
- Subitems can be normal case or smaller uppercase, but must remain readable.
- Avoid text that wraps awkwardly inside buttons.

Focus:

- Menu button must have `aria-expanded`.
- Accordion buttons must have `aria-expanded`.
- Focus ring must be visible.

---

## Footer Architecture

The footer should behave like a robust sitemap and second chance conversion area.

### Proposed columns

Column 1: Brand

```txt
Steelyes Ltd
Bespoke steel gates and fabrication, specified around each entrance and site survey.
```

Do not include fake address or fake phone number.

Column 2: Gates

```txt
All Gates
Sliding Gates
Cantilever Gates
Bifold Gates
Pedestrian Gates
Telescopic Gates
Architectural Gates
```

Column 3: Services

```txt
Services Overview
Railings
Installation Process
Gallery
```

Do not include `Balconies` or `Security` until pages exist.

Column 4: Start

```txt
Request a Quote
Configure Your Gate
Contact
```

Optional small note:

```txt
Share photos, measurements, or a rough brief to start a survey-led quote path.
```

Bottom bar:

```txt
(c) 2026 Steelyes Ltd
Privacy Policy
Cookie Policy
Terms
```

---

## Footer UX Rules

Mobile footer:

- Use stacked columns.
- Put `Start` column before legal links if it improves conversion.
- Keep link rows at least 44px high.
- Avoid tiny legal links on mobile.

Desktop footer:

- Four-column layout is fine.
- Brand column can be wider if needed.
- CTA links should be visually stronger than legal links.

Content safety:

- Do not publish placeholder address.
- Do not publish placeholder phone.
- Do not say `UK-wide` unless confirmed.
- Do not say `British Engineering Excellence` as a core proof claim unless client approves that phrase.

---

## Components and Data Structure

Recommended implementation:

- Keep `SiteHeader.tsx` and `SiteFooter.tsx`.
- Define shared navigation arrays inside `SiteHeader.tsx` unless reuse becomes meaningful.
- Do not create a global navigation abstraction unless both header and footer benefit from the same data shape.

Suggested data groups:

```ts
const GATE_LINKS = [
  { label: 'All Gates', href: '/gates' },
  { label: 'Sliding Gates', href: '/gates/sliding' },
  { label: 'Cantilever Gates', href: '/gates/cantilever' },
  { label: 'Bifold Gates', href: '/gates/bifold' },
  { label: 'Pedestrian Gates', href: '/gates/pedestrian' },
  { label: 'Telescopic Gates', href: '/gates/telescopic' },
  { label: 'Architectural Gates', href: '/gates/architectural' },
]
```

```ts
const SERVICE_LINKS = [
  { label: 'Services Overview', href: '/services' },
  { label: 'Railings', href: '/services/railings' },
]
```

```ts
const PRIMARY_LINKS = [
  { label: 'Process', href: '/installation' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
]
```

Reason:

This keeps the content easy to adjust after more routes are completed.

---

## Accessibility Checklist

Header:

- `header` landmark exists.
- `nav aria-label="Primary navigation"` exists.
- Mobile drawer has `nav aria-label="Mobile primary navigation"`.
- Menu button has clear `aria-label`.
- Menu button has `aria-expanded`.
- Accordion buttons have `aria-expanded`.
- Dropdown buttons should expose state where practical.
- Links are keyboard reachable.
- Focus styles are visible.
- Skip link remains intact.

Footer:

- Footer remains a `footer` landmark.
- Link text is descriptive.
- Legal links are not hidden behind tiny tap targets.

Contrast:

- Red CTA text on white/dark should meet contrast.
- Zinc text on dark footer should not be too faint.
- Avoid `text-zinc-600` on `#1B1C1A` if readability suffers.

Touch:

- Minimum target height 44px.
- Mobile CTA full-width in drawer.

---

## SEO and Information Architecture Rules

Header links should support important search routes:

- `/gates`
- `/gates/sliding`
- `/gates/cantilever`
- `/gates/bifold`
- `/gates/pedestrian`
- `/gates/telescopic`
- `/gates/architectural`
- `/services`
- `/services/railings`

Do not overlink every route from the header if it makes the interface heavy. Footer can carry deeper navigation.

Recommended:

- Header exposes top categories and primary detail pages in dropdowns.
- Footer exposes the full safe sitemap.

---

## Implementation Phases

### Phase 1 - Navigation Data

Actions:

- Define safe link groups.
- Remove unsafe route links.
- Rename `Case Studies` to `Gallery`.
- Rename `The Process` to `Process`.
- Keep `Request Quote` linked to `/contact`.
- Keep `Configure` linked to `/configurator`.

Acceptance criteria:

- No header/footer link points to a 404.
- Active states still work for nested gate routes.

### Phase 2 - Desktop Header

Actions:

- Move full desktop nav breakpoint from `md` to `lg`.
- Add `Gates` dropdown.
- Add `Services` dropdown.
- Keep `Process`, `Gallery`, `About` as simple links.
- Add `Configure` as a secondary nav action.
- Keep `Request Quote` as the primary red CTA.

Acceptance criteria:

- Header does not wrap at common desktop widths.
- `/gates/cantilever` highlights `Gates`.
- `/services/railings` highlights `Services`.
- Keyboard users can tab through links.

### Phase 3 - Mobile and Tablet Drawer

Actions:

- Use drawer for all widths below `lg`.
- Put `Request a Quote` and `Configure Your Gate` at top.
- Add accordion sections for `Gates` and `Services`.
- Default open state should reflect current route.
- Close drawer after link click.
- Keep touch targets large.

Acceptance criteria:

- Works at 375px, 390px, 768px, and 1024px widths.
- Text does not overflow buttons.
- Drawer is easy to scan.

### Phase 4 - Footer

Actions:

- Replace current footer columns with Brand, Gates, Services, Start.
- Remove placeholder address and phone.
- Move legal links to bottom bar.
- Add quote/configurator links.
- Keep copy conservative.

Acceptance criteria:

- No fake business details.
- Footer acts as a useful sitemap.
- Mobile footer is readable and tappable.

### Phase 5 - Verification

Commands:

```bash
cd apps/web && pnpm typecheck
cd apps/web && pnpm lint
cd apps/web && pnpm build
```

Route smoke:

```txt
/
/gates
/gates/cantilever
/services
/services/railings
/installation
/gallery
/about
/configurator
/contact
```

Visual screenshots:

- desktop: 1440px
- tablet: 768px
- mobile: 390px

Review points:

- header visible and stable;
- menu opens and closes correctly;
- no overlap;
- no clipped text;
- dropdowns align;
- active state is correct;
- footer readable;
- CTAs obvious but not noisy.

---

## Risks

### Risk 1 - Exposing incomplete pages

Mitigation:

Only include safe routes. Add `Balconies` and `Security` after those pages exist.

### Risk 2 - Mobile drawer becoming too long

Mitigation:

Use accordions. Keep only one level of nesting.

### Risk 3 - Header crowding on tablet

Mitigation:

Use drawer below `lg`.

### Risk 4 - Unconfirmed business claims

Mitigation:

Remove fake address, fake phone, fake coverage claims, fake warranty claims.

### Risk 5 - Overengineering

Mitigation:

Keep work inside `SiteHeader.tsx` and `SiteFooter.tsx` unless repeated data becomes painful.

---

## Final Recommendation

Implement header and footer before image placement.

Reason:

The client can then review the site as a coherent navigable product, even with placeholders. Once the navigation is stable, the image pass becomes easier because each page has a clear role and a clear path through the site.
