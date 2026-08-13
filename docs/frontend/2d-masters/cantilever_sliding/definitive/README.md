# Cantilever Sliding — definitive prototypes

Fonte originale: cartella `cantiliver sliding` (typo cantiliver; export Figma).
Organizzati 2026-08-13 con slug canonici `GATE__cantilever_sliding__{slug}.svg`.

## Policy

- **Single flat set**: manual and motorised use the same images.
- Do **not** create or promote `*_motorised` silhouette variants for this gate type.

## Inventario

| Slug | Cosa è |
|---|---|
| `base` | Victorian flat, mid-rail |
| `base_circles` | base + cerchi |
| `base_collar_1` | base + collar ogni picket |
| `base_circles_collar_1` | base + cerchi + collar |
| `arched` | arched top |
| `arched_circles` | arched + cerchi |
| `arched_collar_1` | arched + collar |
| `arched_circles_collar_1` | arched + cerchi + collar |
| `dog_bars` | Victorian flat + dog bars |
| `dog_bars_circles` | dog bars + cerchi |
| `dog_bars_collar_1` | dog bars + collar |
| `dog_bars_circles_collar_1` | dog bars + cerchi + collar |
| `arched_dog_bars` | arched + dog bars |
| `arched_dog_bars_circles` | arched + dog bars + cerchi |
| `arched_dog_bars_collar_1` | arched + dog bars + collar |
| `arched_dog_bars_circles_collar_1` | arched + dog bars + cerchi + collar |
| `composite` | boards orizzontali |

## Mancanti (overlay OK)

- _(nessuno)_ — matrice 17/17 completa

## Runtime

File `promote_runtime=true` copiati in:

- `apps/web/public/2d-masters/cantilever_sliding/silhouettes/{slug}.svg`
- `docs/frontend/2d-masters/cantilever_sliding/silhouettes/{slug}.svg`

Resolver: tipology fallbacks without blocking missing deco combos; decorative-specific rules listed first.
