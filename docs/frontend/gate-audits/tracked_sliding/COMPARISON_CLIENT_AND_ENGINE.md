# Confronto — foto vs cliente vs gate-engine (tracked sliding)

## Fonti

| Fonte | Path |
|-------|------|
| Foto Victorian | 01, 02, 04, 06 |
| Foto composite | 03, 05 |
| Cliente | `CLIENT_GATE_REQUIREMENTS_REFERENCE.md` → Tracked Sliding Gate |
| Engine | preset, `buildSlidingFrame`, `buildSlidingMeshBoxes`, `geometry.ts` |

---

## A. Dati dimensionali — Victorian

### Cliente

| Campo | Valore |
|-------|--------|
| Type | Tracked Sliding Gate (client wrote "Trucked") |
| Style | Traditional Victorian |
| Height | **900 / 1000 mm** |
| Width | **2500 / 2600 mm** |
| Manual FROM | **£2200** |
| Automated FROM | **£3600** |

### Engine preset

| Campo | Valore |
|-------|--------|
| `gateType` | `tracked_sliding` |
| `widthMm` | **2500** |
| `heightMm` | **1000** |
| `motorised` | **true** |
| `style` | `traditional_victorian` |

**Preset vs catalogo:** MATCH (2500×1000 nel band; motorised coerente con auto FROM).

### Foto — stime visive

| Foto | Larghezza est. | Altezza est. | vs 2500×1000 |
|------|----------------|--------------|--------------|
| 01 | ~4 m | ~1,6–1,8 m | REVIEW |
| 02 | 3,5–4 m | 1,4–1,5 m | REVIEW |
| 03 | 4,5–5,5 m | 1,8–2 m | REVIEW |
| 04 | ~4 m | ~1,6 m | REVIEW |
| 06 | ~4 m | ~1,8 m arco | REVIEW |

Pattern confermato: foto installazioni **≥ banda catalogo** (come double/single swing).

---

## B. Geometry engine @ width 2500 mm

| Formula (sliding) | @ 2500 mm |
|-------------------|-----------|
| decorative capacity | round(2500/230)=**11** (clamp 6–14) |
| top_railheads max | round(2500/190)=**13** |
| dog_bars max | 2+round(2500/850)=**5** |
| panel width render | 92% FRAME_WIDTH (non cantilever) |
| mesh panel width | 88% config.widthMm |

---

## C. Renderer 2D vs foto Victorian

| Feature | Foto | `buildSlidingFrame` | Status |
|---------|------|---------------------|--------|
| Ground track line | ✅ | `track-line` | MATCH base |
| Sliding panel block | ✅ | `sliding-panel` rect | PARZIALE |
| Vertical pickets | ✅ | `sliding-bar-*` if Victorian | PARZIALE |
| Mid cross-rail | ✅ | optional middle_bar | REVIEW |
| Lower dense zone | ✅ | dog bars logic | PARZIALE |
| Ball vs spear finials | ✅ | generic railheads | GAP |
| Mid-rail finials | ✅ (02) | no | GAP |
| Arched top (06) | ✅ | sliding-arch path | REVIEW |
| Cantilever tail | ❌ | only if cantilever type | MATCH (correct off) |
| Motor/photocell | ✅ (04) | not drawn | GAP (ok v1) |

---

## D. Renderer 2D vs foto composite

| Feature | Foto 03 | Foto 05 | Engine | Status |
|---------|---------|---------|--------|--------|
| Horizontal slats | ✅ | planks vertical | vertical boards | **GAP** |
| Vision strip | ✅ | — | no | **GAP** |
| 3-tier layout | ✅ | ✅ different | single fill | **GAP** |
| Camelback | — | ✅ | no on sliding | **GAP** |
| Diamond lattice | — | ✅ | no | **GAP** |

---

## E. Mesh 3D vs foto

| Feature | Foto | `buildSlidingMeshBoxes` | Status |
|---------|------|-------------------------|--------|
| Track box | ground rail | `sliding-track` thin box | PARZIALE |
| Panel box | full leaf | one `sliding-panel` | PARZIALE |
| Rollers | hidden under rail | no | GAP |
| Counterweight | no (tracked) | only cantilever | MATCH |
| Infill geometry | bars/slats | solid box | GAP |

---

## F. Tracked vs cantilever (cliente)

| | Tracked sliding | Cantilever sliding |
|--|-----------------|---------------------|
| Client width | 2500–2600 mm | 2500–2600 mm |
| Manual FROM | £2200 | £2900 |
| Auto FROM | £3600 | £4200 |
| Track ground | **Sì** | No / partial guide |
| Tail counterweight | **No** | **Sì** |

Engine distingue già i tipi — UI e foto devono rafforzare la differenza.

---

## G. Tabella diff riassuntiva

| Area | Osservato | Cliente | Engine | Status |
|------|-----------|---------|--------|--------|
| Mechanism | ground track | tracked sliding | `tracked_sliding` | MATCH |
| Width band | ~3,5–5,5 m | 2500–2600 mm | 2500 default | REVIEW |
| Height band | ~1,4–2 m | 900–1000 mm | 1000 default | REVIEW |
| Motorised default | spesso sì | £3600 auto | motorised true | MATCH |
| Mid-rail + dense base | sì | middle_bar / dog_bars | options | PARZIALE |
| Composite 3-tier | sì (03) | composite cat. | flat panel | GAP |
| Automation hardware | rack, motor | implied auto | not rendered | GAP |

---

## H. Domande per Marius

1. Banda **2500–2600 mm** = standard driveway o minimum FROM?
2. Foto 02 altezza ~1,4 m: sotto catalogo o misura diversa (solo pannello)?
3. **Vision strip** (foto 03): opzione listino o design one-off?
4. Ball finials (01) vs spear (02): stessa famiglia railheads?
5. Cremagliera + brace (04): sempre su tracked motorizzati?
6. Camelback composite (05): conferma tracked sliding?

---

## I. Cross-reference altri audit

| Foto in tracked_sliding | Origine audit |
|-------------------------|---------------|
| 04 | `single_swing/03-victorian-sliding-automated` |
| 05 | `double_swing/01-composite-sliding-camelback` |
| 06 | `single_swing/01-victorian-arched-sliding-panel` |
