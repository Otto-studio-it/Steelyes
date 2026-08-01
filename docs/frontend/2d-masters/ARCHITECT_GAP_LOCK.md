# Architect gap lock — photo-confirmed ship hypotheses

Method: treat missing data like an architect would — hypothesize from craft standards + UK driveway practice, then **accept only if folder photos (or product sheets in-folder) agree**. Rejected or still open if photos conflict.

Date: 2026-07-31 · Owner: Ruben / agent

---

## Legend

| Status | Meaning |
|--------|---------|
| **LOCKED** | Hypothesis matches photos → use in 2D CAD base |
| **VARIANT** | Photos show more than one product language; base uses the Steelyes FROM path |
| **OPEN** | Photos insufficient / conflict — still needs Marius or a better linea guida |

---

## 1. Single swing — what is the leaf?

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Mechanism | **One hinged leaf**, hinge stile + latch stile | `support-install.jpg`, `photo-A.jpg`: clear single leaf between brick pillars, hinges left, latch right | **LOCKED** |
| Linea guida in folder | Wide picket between two posts | Looks like **tracked/sliding**, not single swing | **REJECT for topology** (keep file as mis-tag; do not drive geometry) |
| Typical clear width | Pedestrian ~900–1200 mm; driveway single up to ~1500–2000 | Photos are pedestrian-scale arched ornamental | **LOCKED** for base: use engine preset **900×1000** (CA/preset); ornamental arch is style option |
| Rails / pickets | Outer frame + mid rail + vertical pickets ~100 mm centres | Victorian driveway language in Steelyes catalog; ornamental circle/scrolls = **upgrade decor**, not base | **LOCKED** base = CAD rectangular Victorian leaf; arched + scroll = options later |
| Handle | Manual only | Photos show latch box; CA-01 | **LOCKED** |

**2D base decision:** single rectangular leaf, left hinges, right latch/handle if manual, mid rail + pickets, brick posts. Ignore linea guida wide panel.

---

## 2. Telescopic — overlapping multi-panel (corrected 2026-07-31)

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Panel count | **3 overlapping panels** on parallel planes | CA-11 “di solito 3”; linea guida; industrial 3-leaf shots; tech diagrams | **LOCKED = 3** |
| 2-leaf Combiarialdo / L=C/2+300 | Double-leaf product sheet + formula drawing | Present in folder | **VARIANT** — not FROM default |
| Visual language | Stacked/overlapping leaves readable from angle + plan | User correction + folder photos | **LOCKED** — depth stagger + plan cue |
| Overlap | 80–120 mm mid ~100 | CA-11 band | **LOCKED** |
| Leaf tail cue | ~300 mm beyond C/n | 2-leaf tech sheet (applied as schematic readability) | **LOCKED** (schematic) |
| Closed stack | ~160 mm (intake) | Plausible for multi frames + guides | **LOCKED** (ship) |
| Motor side leads | Front face = motor-side leaf | CA-11 | **LOCKED** |

**2D base decision:** engine **3 panels**; elevation shows clear overlap + depth ghosts; plan strip shows parallel stacked leaves.

---

## 3. Double swing — CAD vs ornamental photo

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Two leaves + meeting stile | Yes | CAD screenshot + most driveway installs | **LOCKED** |
| Mid rail + vertical pickets | Yes (Victorian) | CAD reference + many Steelyes-style installs | **LOCKED** for Technical base |
| Swan-neck / scroll / composite arched | Popular variant | Linea guida + decorative photos | **VARIANT** — `arched_top` + composite style, not forced on every config |
| Ground clearance ~30–50 mm | CAD 30; intake 50 | Accept **50 mm** intake as ship rule; CAD sample 30 was drawing style | **LOCKED = 50** |
| Meeting gap ~10 mm | CAD | Standard craft | **LOCKED** schematic |

---

## 4. Tracked sliding

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Single leaf on ground track | Yes | Linea guida + folder | **LOCKED** |
| Composite often 3 vertical bays | Yes | Linea guida red mullions | **LOCKED** for composite CAD base |
| Runback ≈ opening + 350 mm | Intake | Consistent with rack/motor parking | **LOCKED** |
| Guide / anti-lift mid post | Yes | Common on installs | **LOCKED** schematic |

---

## 5. Cantilever

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Counterbalance tail ~1/3 | CA-05 | Linea guida **triangular** brace matches craft cantilever | **LOCKED** (ratio + triangle in CAD) |
| Bottom box / guide | Intake 100×50 / 60×70 | Photo bottom rail + ground gear | **LOCKED** schematic |
| 3-bay composite leaf | Common | Linea guida | **LOCKED** for composite |

---

## 6. Bifold double / single bifold

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| 2 panels/leaf 50/50 | CA-09/10 | Linea guida fold lines | **LOCKED** |
| Stack ~100 mm on hinge side | Intake | Plausible; schematic cues | **LOCKED** ship |
| Actuators on pillars | Seen on bifold photo | Motorised hardware — omit decorative actuators in base CAD unless motorised detail pass | **VARIANT** later |

---

## 7. Radius

| Item | Hypothesis | Photo check | Status |
|------|------------|-------------|--------|
| Curved travel path always | CA-12 | Linea guida cyan curve | **LOCKED** |
| Articulated train (not telescopic) | Hinged panels end-to-end | Linea guida + product renders | **LOCKED** |
| Panel count | 4 / 5 (≥2200) / 6 (≥3000) | Linea guida ~6; intake 2/3 too coarse | **LOCKED** schematic |
| Arched top | Every panel crest | User correction + CA-12 optional top | **LOCKED** |
| Elevation ≠ plan | Elevation = closed train; plan cue = 90° park | — | **LOCKED** |
| Screenshot 20.13.46 | Telescopic misfile | Ignore for radius topology | **REJECTED** |

---

## Cross-check with UK craft (external)

- Clear opening measured between posts; swing gaps ~10–20 mm per side — **aligns** with CAD sample language.
- Pedestrian single ~1 m width / ~1.8 m high ornamental — **aligns** with single-swing photos; Steelyes driveway preset 900×1000 remains the **indicative** configurator start (survey locks final).
- Picket centres ~100 mm Steelyes intake — **tighter than timber pale 125 mm**; keep **100 mm** (steel gate language).

---

## Actions taken

1. Document this lock file.  
2. Export `figma-base.svg` per type under `docs/frontend/2d-masters/{type}/` (Technical CAD, **dimension layer stripped**) for Figma **Import → SVG**.  
3. Engine Technical view already uses `cad-base-elevation.ts` with these locks.  
4. **Figma MCP** still needs Cursor **Connect** auth — cannot draw native Figma nodes until you authenticate; SVGs are the bridge.

## Still OPEN (do not invent as law)

- Full ornamental scroll recipe as SKU (circle crest, diamond lattice) — photos prove demand, not a priced option matrix yet.  
- Telescopic 3-leaf industrial SKU — VARIANT only.  
- Replace mis-tagged single-swing linea guida with a true hinged single front elevation when you have one.
