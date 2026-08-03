# 2D pack structure (per gate type)

Every gate type lives in one pack folder. Implementation code should read **`manifest.json`** first.

```txt
docs/frontend/2d-masters/
├── CATALOG.md                 ← human index
├── catalog.json               ← machine index (all packs)
├── PACK_STRUCTURE.md          ← this file
├── ARCHITECT_GAP_LOCK.md
├── TOPOLOGY.md
├── _style/                    ← CAD visual target
└── {gateType}/
    ├── README.md              ← status, Figma links, lookup rules
    ├── manifest.json          ← silhouettes + lookup + figma node hints
    ├── figma-base.svg         ← legacy alias of silhouettes/base.svg
    ├── silhouettes/           ← preloaded CAD SVGs (no client mm)
    │   ├── base.svg
    │   ├── {variant}.svg
    │   └── …
    ├── references/            ← linea guida + support photos
    └── notes/                 ← type-specific decisions
```

## Rules

1. **One pack per `GateType`** — never mix types in one silhouette folder.
2. **Silhouettes are fixed drawings** — width/height/finish go in the UI strip, not in the SVG.
3. **Lookup is in `manifest.json`** — the configurator maps options → `slug`.
4. **Status values:** `ready` | `base_only` | `pending`.
5. Regenerate SVGs from `packages/gate-engine` export tests; then re-upload to Figma if needed.
