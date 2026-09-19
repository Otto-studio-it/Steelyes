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

To rebuild the tiles from intake screenshots (phone chrome, prices, gallery thumbs → white):

```bash
python3 scripts/clean-railhead-photos.py --source "foto /railhead"
# or, without the client dump: references + existing public tiles
python3 scripts/clean-railhead-photos.py
```

The script keeps the largest metal body and paints everything else opaque white, then writes 512×512 WebP. Needs Python 3 + Pillow + NumPy.

If a public tile is itself a cropped shop screenshot (finial cut off at the top, title/price still visible), the script prefers the small complete gallery thumb over the sliver and the text. Re-run against `foto /railhead/*.JPG` when that dump is mounted for full-resolution metal.

Screenshots of the OS or configurator stay out of this set. See `docs/frontend/foto-intake/AGENT_CONTEXT.md`.
