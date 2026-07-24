# Varianti sliding nel set single swing

Foto **01** e **03** non appartengono al tipo `single_swing`. Documentate qui per non perderle; spostare in `gate-audits/tracked_sliding/` quando creato.

---

## Foto 01 — Arched sliding panel

**File:** `photos/01-victorian-arched-sliding-panel.png`

| Campo | Valore |
|-------|--------|
| Pannelli | 1 |
| Meccanismo | **Sliding** — track a terra, bottom rail pesante |
| Top | Arco + finials su ogni picket |
| Decor | 2 bande anelli circolari |
| Pillars | Pietra chiara |
| Engine | `tracked_sliding` + `traditional_victorian` + `arched_top` |

**Perché non single swing:** nessuna cerniera swing; gate parallelo al muro; rail inferiore da scorrimento.

---

## Foto 03 — Automated sliding

**File:** `photos/03-victorian-sliding-automated.png`

| Campo | Valore |
|-------|--------|
| Pannelli | 1 leaf sliding |
| Automazione | Motore + cremagliera lungo bottom rail |
| Brace | Diagonale su tail sinistro |
| Infill | Spear finials, dual density sotto mid-rail |
| Engine | `tracked_sliding`, `motorised: true` |

**Perché non single swing:** motore sliding, cremagliera, assenza cerniere swing.

---

## Implicazione per il configuratore

Il cliente usa “single panel” visivamente per **swing** e **sliding**. Nel configurator:

- `single_swing` = 1 foglio + cerniera
- `tracked_sliding` = 1 (o più) pannello + binario

UI/copy deve chiarire **meccanismo**, non solo “numero pannelli”.
