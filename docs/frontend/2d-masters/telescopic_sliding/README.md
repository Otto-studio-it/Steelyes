# Telescopic sliding — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Photo source:** `foto /telescopic slidings gates`  
**Export:** `packages/gate-engine/tests/export-figma-telescopic-sliding-variants.test.ts`

## Photo locks

| Item | Lock |
|------|------|
| Panel count | **3 overlapping** (CA-11 + linea guida) |
| 2-leaf Combiarialdo / L=C/2+300 | **VARIANT** — not these masters |
| Closed span | Leaves longer than opening/n → clear overlaps |
| Tracks | **3** parallel ground tracks |
| Depth / plan | Stagger ghosts + plan strip (stacked planes) |
| Front face | Motor-side leaf |
| Stack | Outside parking post (~1/3 opening schematic) |

## Silhouettes

| Slug | File | Notes |
|------|------|-------|
| `base` | `silhouettes/base.svg` | Victorian 3-panel overlap |
| `arched` | `silhouettes/arched.svg` | Arch on lead panel |
| `dog_bars` | `silhouettes/dog_bars.svg` | Dog rail + bars |
| `arched_dog_bars` | `silhouettes/arched_dog_bars.svg` | Combined |
| `composite` | `silhouettes/composite.svg` | Composite per segment |

## Figma

Starter plan page limit — import `silhouettes/*.svg` when a page slot is free. Local pack is the source of truth.

## Folders

| Path | Content |
|------|---------|
| `silhouettes/` | CAD SVGs |
| `references/` | Linea guida + Combiarialdo + screenshots + tech diagrams |
| `notes/` | Type decisions |
