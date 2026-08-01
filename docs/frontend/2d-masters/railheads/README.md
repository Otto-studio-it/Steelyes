# Railhead overlays — 2D pack

**Status:** ready for Figma import  
**Source:** `foto /railhead` + client Numbers/CSV price book  
**Manifest:** [`manifest.json`](./manifest.json)

These are **overlay components**, not full gate masters. Place on picket tops of the existing 8 gate silhouette packs.

## Selected SKUs (6)

| Code | Shape | Size (H×W×D mm) | £ ex VAT | File |
|------|-------|-----------------|----------|------|
| **RH32** | Classic spear | 136×60×14 | 0.55 | `silhouettes/RH32.svg` |
| **RH7** | Fleur + peg | 125×60×12 | 0.35 | `silhouettes/RH7.svg` |
| **RH7NP** | Fleur no peg | 110×60×20 | 0.29 | `silhouettes/RH7NP.svg` |
| **RH6W/B** | Ball on taper | 100×20×20 | 0.40 | `silhouettes/RH6WB.svg` |
| **RH14** | Ball + collar | 95×25×12 | 0.50 | `silhouettes/RH14.svg` |
| **RH100** | Ornate fleur | 160×70×28 | 0.60 | `silhouettes/RH100.svg` |

Why these: cover spear / fleur / ball (the three languages most gates need), include no-peg mount, keep Figma Starter light. Full 61-SKU list remains in `docs/frontend/foto-intake/railheads-catalog.json`.

## Import into Figma now

1. Open [Steelyes 2D Gate Masters](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)
2. Create page **Railhead overlays** (or a Components page)
3. **Import → SVG** each file from `silhouettes/`
4. Turn each into a **Component** named by code (`RH32`, …)
5. Instance along gate top rails (scale: 1 SVG unit = 1 mm)

## Notes

- Prices are client EX VAT from the Numbers export — still provisional for quote totals until count rule (`open.railhead_count_rule`) is signed.
- Geometry is CAD outline (not photo trace) matched to photo proportions + confirmed mm.
