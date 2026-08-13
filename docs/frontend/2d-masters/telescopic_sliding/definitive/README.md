# Telescopic Sliding — definitive prototypes

Fonte originale: cartella `telescopic sliding variants` (export Figma manuale).
Rinominati 2026-08-12 con slug canonici `GATE__telescopic_sliding__{slug}.svg`.

## Inventario (chiaro)

| Slug | Cosa è |
|---|---|
| `base` | Victorian flat, mid-rail |
| `base_collar_1` | base + collar ogni picket |
| `arched` | arched top |
| `arched_collar_1` | arched + collar |
| `arched_circles` | arched + cerchi upper+lower (Q1) — **definitivo telescopic** |
| `arched_dog_bars` | arched + dog bars |
| `arched_dog_bars_collar_1` | arched + dog bars + collar |
| `arched_dog_bars_circles_collar_1` | arched + dog bars + cerchi + collar |
| `dog_bars` | Victorian flat + dog bars (**ex** file mal-nominato `composite_dog_bars`) |
| `composite` | boards orizzontali |

## Correzioni nomi

1. `composite_dog_bars 1.svg` → **`dog_bars`** (è Victorian a barre, non composite)
2. `GATE__…dog_bars_circles_collar_1 1.svg` → quarantena: **non** ha cerchi/collar; near-dup di `dog_bars`

## Ancora mancanti (se li vuoi nella stessa famiglia)

- `base_circles`, `base_circles_collar_1`
- `dog_bars_circles`, `dog_bars_collar_1`
- `arched_circles_collar_1`
- varianti `*_collar_2` (ogni 2°)
- eventuale vero `composite_dog_bars` (boards + dog bars) se Marius lo vuole

## Runtime

I file `promote_runtime=true` sono copiati in:
- `apps/web/public/2d-masters/telescopic_sliding/silhouettes/{slug}.svg`
- `docs/frontend/2d-masters/telescopic_sliding/silhouettes/{slug}.svg`
