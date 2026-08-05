# Phase — Manual vs motorised Design masters

**Status:** wired for double swing (2026-08-05).

## Product rule (locked)

| Drive | Design master | Overlay |
|-------|---------------|---------|
| **Manual** (`motorised: false`) | `base.svg` / variant | Leaf **handle** overlay (CA-01) |
| **Motorised** (`motorised: true`) | `*_motorised.svg` | **No handle. No motor kit drawn** — operator is not shown on the Design drawing |

Masters must **never bake** a handle into the SVG.

## File convention

```txt
{gateType}/silhouettes/
  base.svg                 ← manual
  base_motorised.svg       ← automatic (same CAD, no handle; no motor artwork)
  arched_motorised.svg
  …
```

## Manifest lookup (first match wins)

Put motorised rules **before** the generic fallback — see `double_swing/manifest.json`.

## After dropping SVGs

1. Add silhouette entries + lookup rules in `{gateType}/manifest.json`
2. Run `pnpm sync:2d-masters`
3. Verify: Manual → handle; Motorised → motorised master, no handle, no motor marker
