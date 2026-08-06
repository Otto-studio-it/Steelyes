# Phase — Manual vs motorised Design masters

**Status:** official intake lock (2026-08-05).

## Product rule (locked)

| Drive | Design master | Handle |
|-------|---------------|--------|
| **Manual** (`motorised: false`) | `base.svg` / variant from `*manual*` / `*manuale*` export | **Baked into SVG** when the client named the file that way |
| **Motorised** (`motorised: true`) | `*_motorised.svg` from `*automatic*` export | **No handle** in the SVG |
| Shared packs (tracked, cantilever, telescopic, radius, single bifold) | One CAD for both drives | Design **does not place** a handle — no UI overlay |

**Never** composite a UI handle (or motor kit) on Design masters.

## File convention

```txt
{gateType}/silhouettes/
  base.svg                 ← manual (handle baked when source was *manual*)
  base_motorised.svg       ← automatic (no handle; no motor artwork)
  arched_motorised.svg
  …
```

Shared packs only ship the five family SVGs (no `*_motorised` split).

## Manifest lookup (first match wins)

Put motorised rules **before** the generic fallback — see `double_swing/manifest.json`.

## After dropping SVGs

1. Run `python3 scripts/install-intake-2d-masters.py` (verbatim copy — no strip)
2. Run `pnpm sync:2d-masters`
3. Verify: Manual → official manual master (handle if baked); Motorised → motorised master; shared packs → same CAD, no overlay
