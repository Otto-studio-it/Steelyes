# Telescopic sliding — photo lock (corrected 2026-07-31)

Source folder: `foto /telescopic slidings gates`  
User correction: panels are **overlapping / stacked** — must read as multiple leaves, including from the other view (plan).

## Assets reviewed

| File | Role |
|------|------|
| `line guida telescopic sliding gates.png` | **3** perforated panels overlapping; cyan guide bridge + motor |
| `Screenshot … 20.07.03.png` | **3** victorian panels staggered in depth |
| `Screenshot … 20.06.56.png` | Diagram: 3-leaf + Opening + Space to Open |
| `Screenshot … 20.05.54.png` | Industrial multi-panel stack aesthetic |
| `Screenshot … 20.05.58.png` | Silver **2**-panel install (variant language) |
| `telescopic slidings gates.jpeg` | Combiarialdo **Double Leaf** sheet (VARIANT) |
| Tech formula (user) | 2-leaf: `LA = LB = C/2 + 300`; dual tracks 130/160 |
| Tech 3-panel (user) | Clear stacked overlap + guide portal |

## Decisions (corrected)

1. **LOCKED panel count = 3** (CA-11 + linea guida + industrial photos). Engine `TELESCOPIC_DEFAULT_PANEL_COUNT = 3`.
2. **2-leaf** Combiarialdo / formula sheet = **VARIANT** (`plannedVariants.panels_2`), not FROM masters.
3. Closed elevation: each leaf longer than `opening/n` (tail cue ~300 mm) so **overlaps are obvious**.
4. Depth ghosts + **plan strip** of parallel leaves = “come si vedono dall’altro”.
5. **N parallel tracks**; stack / space-to-open **outside** parking post (~1/n).
6. Style silhouettes: same 5 families (`base` … `composite`).

## Do not

- Draw a single flat leaf that reads as tracked sliding.
- Hide overlap with tiny seams.
- Treat Combiarialdo 2-leaf as Steelyes FROM default.
