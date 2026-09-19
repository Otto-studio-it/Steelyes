# Railheads only — product photos

Dedicated set of **railhead product photos**. No gate shots. No configurator screenshots.

Website / chooser files live at:

`apps/web/public/2d-masters/railheads/photos/`

That folder is SKU-only (`RH32.webp`, …). A couple of leftover files from screenshot crops are **not** part of this set.

| Include | Exclude |
|---|---|
| One cropped product photo per catalog SKU | macOS/Windows `Screenshot *.png` |
| Catalog codes from `railheads-catalog.json` | Gate elevations, dciron full-screen captures |
| | Duplicate leftovers such as `RH15WO.webp` |

Index: [`manifest.json`](./manifest.json)

Policy (locked): screenshots are engineering-only and must never ship on the marketing site. See `docs/frontend/foto-intake/AGENT_CONTEXT.md`.
