# Railheads only — product photos + client descriptions

This is the dedicated railhead pack you asked for:

- **Photo:** one cropped product shot of the railhead itself (not a gate screenshot).
- **Description:** title, size, and flags from the client Numbers/CSV catalogue.

| What | Where |
|---|---|
| Descriptions, sizes, prices | `docs/frontend/foto-intake/railheads-catalog.json` (+ `.csv`) |
| This index | `docs/frontend/foto-intake/railheads-only/manifest.json` |
| Files the website serves | `apps/web/public/2d-masters/railheads/photos/{SKU}.webp` |
| Chooser / Design chip | uses those webp files + the catalogue sizes |

`RH15W/O` in the client sheet is SKU `RH15WO` in the configurator. The product photo file is `RH15W.webp`.

Screenshots of the OS or configurator stay out of this set. See `docs/frontend/foto-intake/AGENT_CONTEXT.md`.
