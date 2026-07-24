# Steelyes - Configurator Field Map, Mobile-First

Goal: keep only the fields that change price, validation, or preview in the first rebuild of the configurator. Everything else stays provisional or moves to engine/admin.

## Rule of thumb

- Keep in the UI if the field changes a quote, a 2D preview, or a hard validation.
- Keep in the engine if the field is derived from geometry or fabrication logic.
- Keep in admin if the field is a catalog value, variant list, or pricing constant.
- Hide from the first mobile flow if it does not change the user decision.

## Core fields to keep now

These are the fields the mobile-first configurator should expose directly.

| Field | Keep now | Why |
|---|---|---|
| `gateType` | Yes | Primary product choice. |
| `style` | Yes | Changes the visible family and pricing branch. |
| `operationMode` | Yes | Manual vs automated changes the price. |
| `widthMm` | Yes | Core pricing and validation input. |
| `heightMm` | Yes | Core pricing and validation input. |
| `decorativeOptions[]` | Yes | Needed for price, preview, and quote summary. |
| `railingPanels[]` | Yes, if panels are sold now | Explicitly requested by the client. |
| `siteSurveyRequested` | Yes | Needed for quote handoff and pricing disclaimer. |

## Keep, but not as first-screen inputs

These fields are useful, but they should not clutter the first mobile flow.

| Field | Status | Notes |
|---|---|---|
| `finish` | Secondary | Keep only if the preview needs colour/material variation. Not part of the client brief. |
| `posts` | Secondary / engine-owned | Keep for fabrication and installation logic, but do not surface as a core product choice unless sales needs it. |
| `openingDirection` | Conditional | Only show for swing and bifolding families. |
| `hingeSide` | Conditional | Only show for swing and bifolding families. |
| `slideDirection` | Conditional | Only show for sliding families. |
| `variantKey` on decorative options | Conditional | Only when the option has a confirmed catalog. |

## Provisional fields

These are allowed in the model, but they must stay marked provisional until the client confirms them.

- railhead variant list and unit prices;
- railhead quantity formulas;
- dog bars quantity formulas;
- circles quantity formulas;
- bushes quantity formulas and size catalog;
- spirals quantity formulas and size catalog;
- `radius_sliding` motion definition;
- composite boards internal build-up;
- exact width and height step increments;
- exact opening limits per gate family;
- automation hardware model and mount geometry;
- 3D mesh details beyond the minimum preview requirement.

## Fields to keep out of the first UI pass

These are real engineering values, but they should stay in the engine or in admin until the product rules are stable.

- `leftLeafWidthMm`
- `rightLeafWidthMm`
- `meetingGapMm`
- `sideClearanceMm`
- `hingeOffsetMm`
- `trackLengthMm`
- `runbackLengthMm`
- `guidePostOffsetMm`
- `closingPostPosition`
- `counterbalanceLengthMm`
- `carriageBaseLengthMm`
- `foldAxisOffsets[]`
- `panelOverlapDepthMm`
- `leadPanelId`
- `followerPanelIds[]`
- `radiusValueMm`
- any mesh-only pivot, collision, or animation fields

## Recommended target model

Use this as the product-facing configuration shape for the rebuild.

```ts
export type GateConfiguration = {
  gateType: GateType
  style: GateStyle
  operationMode: OperationMode
  widthMm: number
  heightMm: number
  openingDirection?: OpeningDirection
  hingeSide?: 'LEFT' | 'RIGHT'
  decorativeOptions: DecorativeOptionSelection[]
  railingPanels: RailingPanel[]
  siteSurveyRequested: boolean
  finish?: FinishCode
}
```

## Mobile-first screen order

1. Gate type and style
2. Operation mode and dimensions
3. Direction / hinge side only when relevant
4. Decorative options
5. Railing panels
6. Site survey and quote summary

## What this removes from the first pass

- any field that exists only to make 3D prettier;
- any count formula that still needs client sign-off;
- any hardcoded radius or telescopic rule;
- any decorative catalog that is not confirmed.

## Use in the repo

- `packages/gate-engine` should own validation, derived geometry, and pricing rules.
- `apps/web` should only collect the minimal product fields and show the preview.
- admin should own catalog values and provisional pricing data.
