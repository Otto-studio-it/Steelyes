# Rinomina SVG — 24 settembre 2026

Cartella: `svg configuratore`

Nome definitivo: `GATE__{tipo}__{disegno}.svg`

- Disegno: `base`, `arched`, `dog_bars`, `arched_dog_bars`, `composite`.
- Se ci sono i circles: aggiungi `_circles`.
- Se ci sono i collars: aggiungi `_collar_1`.
- Automatico di double swing, single swing, bifold e single bifold: aggiungi `_motorised` in fondo.
- Cantilever, tracked, radius e telescopic: un solo file, senza `_motorised`. Vale per manuale e automatico.
- Single swing: il file che inizia con `manual` resta manuale. Tutti gli altri di quella cartella diventano `_motorised`.
- Bifold double: i file senza `manual` e senza `automatic` li tratto come automatici (`_motorised`).
- `ELIMINA` = copia identica, non serve rinominarla.
- `ALT` = stesso disegno nominale ma file diverso. Tienine uno solo e cancella l’altro, oppure dimmi quale dei due è quello giusto.

## biflodings double swing variatns

Tipo: `bifolding_double_swing`. Due set, manuale e `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `arched 2 + circles.svg` | `GATE__bifolding_double_swing__arched_circles_motorised.svg` |
| `arched 2 + collars + circles.svg` | `GATE__bifolding_double_swing__arched_circles_collar_1_motorised.svg` |
| `arched 2 + collars.svg` | `GATE__bifolding_double_swing__arched_collar_1_motorised.svg` |
| `arched 2.svg` | `GATE__bifolding_double_swing__arched_motorised.svg` |
| `arched_dog_bars 2 + collars+ circles-1.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles_collar_1_motorised.svg` |
| `arched_dog_bars 2 + collars+ circles-2.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles_collar_1_motorised__ALT1.svg` |
| `arched_dog_bars 2 + collars+ circles.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles_collar_1_motorised__ALT2.svg` |
| `arched_dog_bars 3.svg` | `GATE__bifolding_double_swing__arched_dog_bars_motorised.svg` |
| `automatic composite 2.svg` | `GATE__bifolding_double_swing__composite_motorised.svg` |
| `automatic composite 3.svg` | `GATE__bifolding_double_swing__composite_motorised__ALT1.svg` |
| `base 2 + circles.svg` | `GATE__bifolding_double_swing__base_circles_motorised.svg` |
| `base 2 + collars+ circles.svg` | `GATE__bifolding_double_swing__base_circles_collar_1_motorised.svg` |
| `base 2 + collars.svg` | `GATE__bifolding_double_swing__base_collar_1_motorised.svg` |
| `base 3.svg` | `GATE__bifolding_double_swing__base_motorised.svg` |
| `dog_bars 2  + collars.svg` | `GATE__bifolding_double_swing__dog_bars_collar_1_motorised.svg` |
| `dog_bars 2 + circles + collars.svg` | `GATE__bifolding_double_swing__dog_bars_circles_collar_1_motorised.svg` |
| `dog_bars 2 + circles +.svg` | `GATE__bifolding_double_swing__dog_bars_circles_motorised.svg` |
| `dog_bars 3.svg` | `GATE__bifolding_double_swing__dog_bars_motorised.svg` |
| `manual arched 1.svg` | `GATE__bifolding_double_swing__arched.svg` |
| `manual arched 2 + circles.svg` | `GATE__bifolding_double_swing__arched_circles.svg` |
| `manual arched 2 + collars + circles.svg` | `GATE__bifolding_double_swing__arched_circles_collar_1.svg` |
| `manual arched 2 + collars.svg` | `GATE__bifolding_double_swing__arched_collar_1.svg` |
| `manual arched_dog_bars 1.svg` | `GATE__bifolding_double_swing__arched_dog_bars.svg` |
| `manual arched_dog_bars 2  circles.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles.svg` |
| `manual arched_dog_bars 2 + collars+ circles-1.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles_collar_1.svg` |
| `manual arched_dog_bars 2 + collars+ circles.svg` | `GATE__bifolding_double_swing__arched_dog_bars_circles_collar_1__ALT1.svg` |
| `manual base 1.svg` | `GATE__bifolding_double_swing__base.svg` |
| `manual base 2 + circles.svg` | `GATE__bifolding_double_swing__base_circles.svg` |
| `manual base 2 + collars+ circles.svg` | `GATE__bifolding_double_swing__base_circles_collar_1.svg` |
| `manual base 2 + collars.svg` | `GATE__bifolding_double_swing__base_collar_1.svg` |
| `manual composite 1.svg` | `GATE__bifolding_double_swing__composite.svg` |
| `manual composite 2.svg` | `GATE__bifolding_double_swing__composite__ALT1.svg` |
| `manual dog_bars 1.svg` | `GATE__bifolding_double_swing__dog_bars.svg` |
| `manual dog_bars 2  + collars.svg` | `GATE__bifolding_double_swing__dog_bars_collar_1.svg` |
| `manual dog_bars 2 + circles + collars.svg` | `GATE__bifolding_double_swing__dog_bars_circles_collar_1.svg` |
| `manual dog_bars 2 + circles +.svg` | `GATE__bifolding_double_swing__dog_bars_circles.svg` |

## cantiliver sliding variants

Tipo: `cantilever_sliding`. Un solo set, senza `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `arched + cricles.svg` | `GATE__cantilever_sliding__arched_circles.svg` |
| `arched 1.svg` | `GATE__cantilever_sliding__arched.svg` |
| `arched 3 + collars+ circels.svg` | `GATE__cantilever_sliding__arched_circles_collar_1.svg` |
| `arched 3 collars.svg` | `GATE__cantilever_sliding__arched_collar_1.svg` |
| `arched_dog_bars 1.svg` | `GATE__cantilever_sliding__arched_dog_bars.svg` |
| `arched_dog_bars 2 + circles.svg` | `GATE__cantilever_sliding__arched_dog_bars_circles.svg` |
| `arched_dog_bars 3 + collars+ circels.svg` | `GATE__cantilever_sliding__arched_dog_bars_circles_collar_1.svg` |
| `arched_dog_bars 3 + collars.svg` | `GATE__cantilever_sliding__arched_dog_bars_collar_1.svg` |
| `base 2  + collars.svg` | `GATE__cantilever_sliding__base_collar_1.svg` |
| `base 2 + circles + collars.svg` | `GATE__cantilever_sliding__base_circles_collar_1.svg` |
| `base 2 + circles.svg` | `GATE__cantilever_sliding__base_circles.svg` |
| `base 3.svg` | `GATE__cantilever_sliding__base.svg` |
| `composite + circles.svg` | `GATE__cantilever_sliding__composite_circles.svg` |
| `composite 1.svg` | `GATE__cantilever_sliding__composite.svg` |
| `dog_bars 1.svg` | `GATE__cantilever_sliding__dog_bars.svg` |
| `dog_bars 2 + circles + collars.svg` | `GATE__cantilever_sliding__dog_bars_circles_collar_1.svg` |
| `dog_bars 2 + circles.svg` | `GATE__cantilever_sliding__dog_bars_circles.svg` |
| `dog_bars 2 + collars.svg` | `GATE__cantilever_sliding__dog_bars_collar_1.svg` |

## double swing variants

Tipo: `double_swing`. Due set, manuale e `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `Manual dog_bars + collars + circles-1.svg` | `GATE__double_swing__dog_bars_circles_collar_1.svg` |
| `Manual dog_bars + collars + circles.svg` | ELIMINA (identico a `Manual dog_bars + collars + circles-1.svg`) |
| `Manual dog_bars + collars-1.svg` | `GATE__double_swing__dog_bars_collar_1.svg` |
| `Manual dog_bars + collars.svg` | `GATE__double_swing__dog_bars_collar_1__ALT1.svg` |
| `autoamtic arched +collars+ circles.svg` | `GATE__double_swing__arched_circles_collar_1_motorised.svg` |
| `autoamtic composite.svg` | `GATE__double_swing__composite_motorised.svg` |
| `automatic   arched_dog_bars.svg` | `GATE__double_swing__arched_dog_bars_motorised.svg` |
| `automatic  arched.svg` | `GATE__double_swing__arched_motorised.svg` |
| `automatic  arched_dog_bars  + circles.svg` | `GATE__double_swing__arched_dog_bars_circles_motorised.svg` |
| `automatic  arched_dog_bars + colars + circles.svg` | `GATE__double_swing__arched_dog_bars_circles_collar_1_motorised.svg` |
| `automatic  arched_dog_bars + colars.svg` | `GATE__double_swing__arched_dog_bars_collar_1_motorised.svg` |
| `automatic  base + circles.svg` | `GATE__double_swing__base_circles_motorised.svg` |
| `automatic  base.svg` | `GATE__double_swing__base_motorised.svg` |
| `automatic arched + circles.svg` | `GATE__double_swing__arched_circles_motorised.svg` |
| `automatic arched +collars.svg` | `GATE__double_swing__arched_collar_1_motorised.svg` |
| `automatic base + colars _ circles.svg` | `GATE__double_swing__base_circles_collar_1_motorised.svg` |
| `automatic base + collars.svg` | `GATE__double_swing__base_collar_1_motorised.svg` |
| `automatic composite + circles.svg` | `GATE__double_swing__composite_circles_motorised.svg` |
| `automatic dog_bars  + circles.svg` | `GATE__double_swing__dog_bars_circles_motorised.svg` |
| `automatic dog_bars + collars + circles.svg` | `GATE__double_swing__dog_bars_circles_collar_1_motorised.svg` |
| `automatic dog_bars + collars.svg` | `GATE__double_swing__dog_bars_collar_1_motorised.svg` |
| `automatic dog_bars.svg` | `GATE__double_swing__dog_bars_motorised.svg` |
| `manua  base + colars _ circles.svg` | `GATE__double_swing__base_circles_collar_1.svg` |
| `manual  arched.svg` | `GATE__double_swing__arched.svg` |
| `manual  arched_dog_bars  + circles.svg` | `GATE__double_swing__arched_dog_bars_circles.svg` |
| `manual  arched_dog_bars + colars + circles.svg` | `GATE__double_swing__arched_dog_bars_circles_collar_1.svg` |
| `manual  arched_dog_bars + colars.svg` | `GATE__double_swing__arched_dog_bars_collar_1.svg` |
| `manual  arched_dog_bars.svg` | `GATE__double_swing__arched_dog_bars.svg` |
| `manual  base + circles.svg` | `GATE__double_swing__base_circles.svg` |
| `manual  base.svg` | `GATE__double_swing__base.svg` |
| `manual arched + circles.svg` | `GATE__double_swing__arched_circles.svg` |
| `manual arched +collars+ circles.svg` | `GATE__double_swing__arched_circles_collar_1.svg` |
| `manual arched +collars.svg` | `GATE__double_swing__arched_collar_1.svg` |
| `manual base + collars.svg` | `GATE__double_swing__base_collar_1.svg` |
| `manual composite-1.svg` | `GATE__double_swing__composite.svg` |
| `manual composite.svg` | `GATE__double_swing__composite__ALT1.svg` |
| `manual dog_bars  + circles-1.svg` | `GATE__double_swing__dog_bars_circles.svg` |
| `manual dog_bars  + circles.svg` | ELIMINA (identico a `manual dog_bars  + circles-1.svg`) |
| `manual dog_bars-1.svg` | `GATE__double_swing__dog_bars.svg` |
| `manual dog_bars.svg` | ELIMINA (identico a `manual dog_bars-1.svg`) |

## radius sliding variants

Tipo: `radius_sliding`. Un solo set, senza `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `arched 1.svg` | `GATE__radius_sliding__arched.svg` |
| `arched 2 + circles.svg` | `GATE__radius_sliding__arched_circles.svg` |
| `arched 2 colars + circles-1.svg` | `GATE__radius_sliding__arched_circles_collar_1.svg` |
| `arched 2 colars + circles.svg` | `GATE__radius_sliding__arched_circles_collar_1__ALT1.svg` |
| `arched_dog_bars 2 + circles + collars.svg` | `GATE__radius_sliding__arched_dog_bars_circles_collar_1.svg` |
| `arched_dog_bars 2 + circles.svg` | `GATE__radius_sliding__arched_dog_bars_circles.svg` |
| `arched_dog_bars 3 + colalrs.svg` | `GATE__radius_sliding__arched_dog_bars_collar_1.svg` |
| `arched_dog_bars 4.svg` | `GATE__radius_sliding__arched_dog_bars.svg` |
| `base  + collars.svg` | `GATE__radius_sliding__base_collar_1.svg` |
| `base  2 + circles.svg` | `GATE__radius_sliding__base_circles.svg` |
| `base + circles + collars.svg` | `GATE__radius_sliding__base_circles_collar_1.svg` |
| `base 1.svg` | `GATE__radius_sliding__base.svg` |
| `dog_bars 1.svg` | `GATE__radius_sliding__dog_bars.svg` |
| `dog_bars 2 + circles + collars.svg` | `GATE__radius_sliding__dog_bars_circles_collar_1.svg` |
| `dog_bars 2 + circles.svg` | `GATE__radius_sliding__dog_bars_circles.svg` |
| `dog_bars 2 + collars.svg` | `GATE__radius_sliding__dog_bars_collar_1.svg` |

## single bifolding variants

Tipo: `single_bifolding`. Due set, manuale e `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `automatic arched 2+ circles.svg` | `GATE__single_bifolding__arched_circles_motorised.svg` |
| `automatic arched 2+ collars.svg` | `GATE__single_bifolding__arched_collar_1_motorised.svg` |
| `automatic arched 3 + circles _ collars.svg` | `GATE__single_bifolding__arched_circles_collar_1_motorised.svg` |
| `automatic arched 4.svg` | `GATE__single_bifolding__arched_motorised.svg` |
| `automatic arched_dog_bars 2 + circles-1.svg` | `GATE__single_bifolding__arched_dog_bars_circles_motorised.svg` |
| `automatic arched_dog_bars 2 + circles.svg` | `GATE__single_bifolding__arched_dog_bars_circles_motorised__ALT1.svg` |
| `automatic arched_dog_bars 4.svg` | `GATE__single_bifolding__arched_dog_bars_motorised.svg` |
| `automatic base  + circles + collars-1.svg` | `GATE__single_bifolding__base_circles_collar_1_motorised.svg` |
| `automatic base  + circles + collars.svg` | `GATE__single_bifolding__base_circles_collar_1_motorised__ALT1.svg` |
| `automatic base 2.svg` | `GATE__single_bifolding__base_motorised.svg` |
| `automatic base2 + circles.svg` | `GATE__single_bifolding__base_circles_motorised.svg` |
| `automatic composite +circles.svg` | `GATE__single_bifolding__composite_circles_motorised.svg` |
| `automatic composite.svg` | `GATE__single_bifolding__composite_motorised.svg` |
| `automatic dog_bars 2 + collars.svg` | `GATE__single_bifolding__dog_bars_collar_1_motorised.svg` |
| `automatic dog_bars 2 +circles + collars.svg` | `GATE__single_bifolding__dog_bars_circles_collar_1_motorised.svg` |
| `automatic dog_bars 2 +circles.svg` | `GATE__single_bifolding__dog_bars_circles_motorised.svg` |
| `automatic dog_bars 3.svg` | `GATE__single_bifolding__dog_bars_motorised.svg` |
| `manaul base  + circles + collars.svg` | `GATE__single_bifolding__base_circles_collar_1.svg` |
| `manual arched 1.svg` | `GATE__single_bifolding__arched.svg` |
| `manual arched 2+ circles.svg` | `GATE__single_bifolding__arched_circles.svg` |
| `manual arched 2+ collars.svg` | `GATE__single_bifolding__arched_collar_1.svg` |
| `manual arched 3 + circles _ collars.svg` | `GATE__single_bifolding__arched_circles_collar_1.svg` |
| `manual arched_dog_bars 1.svg` | `GATE__single_bifolding__arched_dog_bars.svg` |
| `manual arched_dog_bars 2 + circles-1.svg` | `GATE__single_bifolding__arched_dog_bars_circles.svg` |
| `manual arched_dog_bars 2 + circles.svg` | `GATE__single_bifolding__arched_dog_bars_circles__ALT1.svg` |
| `manual arched_dog_bars 3  + collars-1.svg` | `GATE__single_bifolding__arched_dog_bars_collar_1.svg` |
| `manual arched_dog_bars 3  + collars.svg` | `GATE__single_bifolding__arched_dog_bars_collar_1__ALT1.svg` |
| `manual base + circles.svg` | `GATE__single_bifolding__base_circles.svg` |
| `manual base + collars.svg` | `GATE__single_bifolding__base_collar_1.svg` |
| `manual base.svg` | `GATE__single_bifolding__base.svg` |
| `manual composite + circcles.svg` | `GATE__single_bifolding__composite_circles.svg` |
| `manual composite.svg` | `GATE__single_bifolding__composite.svg` |
| `manual dog_bars 1.svg` | `GATE__single_bifolding__dog_bars.svg` |
| `manual dog_bars 2 + collars.svg` | `GATE__single_bifolding__dog_bars_collar_1.svg` |
| `manual dog_bars 2 +circles + collars.svg` | `GATE__single_bifolding__dog_bars_circles_collar_1.svg` |
| `manual dog_bars 2 +circles.svg` | `GATE__single_bifolding__dog_bars_circles.svg` |

## single swing variants

Tipo: `single_swing`. Due set, manuale e `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `arched collar  + circles.svg` | `GATE__single_swing__arched_circles_collar_1_motorised.svg` |
| `arched collars.svg` | `GATE__single_swing__arched_collar_1_motorised.svg` |
| `arched.svg` | `GATE__single_swing__arched_motorised.svg` |
| `arched_dog_bars-1.svg` | `GATE__single_swing__arched_dog_bars_motorised.svg` |
| `arched_dog_bars-2.svg` | `GATE__single_swing__arched_dog_bars_motorised__ALT1.svg` |
| `arched_dog_bars-3.svg` | `GATE__single_swing__arched_dog_bars_motorised__ALT2.svg` |
| `arched_dog_bars.svg` | `GATE__single_swing__arched_dog_bars_motorised__ALT3.svg` |
| `autoamtic  base + collar+ circels.svg` | `GATE__single_swing__base_circles_collar_1_motorised.svg` |
| `automatic base + circles.svg` | `GATE__single_swing__base_circles_motorised.svg` |
| `automatic base + collar.svg` | `GATE__single_swing__base_collar_1_motorised.svg` |
| `automatic base.svg` | `GATE__single_swing__base_motorised.svg` |
| `automatic composite + circles.svg` | `GATE__single_swing__composite_circles_motorised.svg` |
| `composite.svg` | `GATE__single_swing__composite_motorised.svg` |
| `dog_bars + circles.svg` | `GATE__single_swing__dog_bars_circles_motorised.svg` |
| `dog_bars + collar+ circles.svg` | `GATE__single_swing__dog_bars_circles_collar_1_motorised.svg` |
| `dog_bars + collar.svg` | `GATE__single_swing__dog_bars_collar_1_motorised.svg` |
| `dog_bars.svg` | `GATE__single_swing__dog_bars_motorised.svg` |
| `manual  arched collar  + circles.svg` | `GATE__single_swing__arched_circles_collar_1.svg` |
| `manual  arched collars.svg` | `GATE__single_swing__arched_collar_1.svg` |
| `manual  dog_bars + circles.svg` | `GATE__single_swing__dog_bars_circles.svg` |
| `manual  dog_bars + collar.svg` | `GATE__single_swing__dog_bars_collar_1.svg` |
| `manual  dog_bars.svg` | `GATE__single_swing__dog_bars.svg` |
| `manual arched.svg` | `GATE__single_swing__arched.svg` |
| `manual arched_dog_bars-1.svg` | `GATE__single_swing__arched_dog_bars.svg` |
| `manual arched_dog_bars-2.svg` | `GATE__single_swing__arched_dog_bars__ALT1.svg` |
| `manual arched_dog_bars-3.svg` | `GATE__single_swing__arched_dog_bars__ALT2.svg` |
| `manual arched_dog_bars.svg` | `GATE__single_swing__arched_dog_bars__ALT3.svg` |
| `manual base + circles-1.svg` | `GATE__single_swing__base_circles.svg` |
| `manual base + circles.svg` | `GATE__single_swing__base_circles__ALT1.svg` |
| `manual base + collar+ circels-1.svg` | `GATE__single_swing__base_circles_collar_1.svg` |
| `manual base + collar+ circels.svg` | `GATE__single_swing__base_circles_collar_1__ALT1.svg` |
| `manual base + collar-1.svg` | `GATE__single_swing__base_collar_1.svg` |
| `manual base + collar.svg` | `GATE__single_swing__base_collar_1__ALT1.svg` |
| `manual base-1.svg` | `GATE__single_swing__base.svg` |
| `manual base.svg` | `GATE__single_swing__base__ALT1.svg` |
| `manual composite + circles.svg` | `GATE__single_swing__composite_circles.svg` |
| `manual composite.svg` | `GATE__single_swing__composite.svg` |
| `manual dog_bars + collar+ circles.svg` | `GATE__single_swing__dog_bars_circles_collar_1.svg` |

## telescopic sliding variants

Tipo: `telescopic_sliding`. Un solo set, senza `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `GATE__telescopic_sliding__dog_bars_circles_collar_1 1.svg` | `GATE__telescopic_sliding__REVIEW_old_export.svg` |
| `arched + circles.svg` | `GATE__telescopic_sliding__arched_circles.svg` |
| `arched +collar.svg` | `GATE__telescopic_sliding__arched_collar_1.svg` |
| `arched 1.svg` | `GATE__telescopic_sliding__arched.svg` |
| `arched_dog_bars + collar + circles.svg` | `GATE__telescopic_sliding__arched_dog_bars_circles_collar_1.svg` |
| `arched_dog_bars + collar.svg` | `GATE__telescopic_sliding__arched_dog_bars_collar_1.svg` |
| `arched_dog_bars 1.svg` | `GATE__telescopic_sliding__arched_dog_bars.svg` |
| `base 1.svg` | `GATE__telescopic_sliding__base.svg` |
| `base 2 + collar.svg` | `GATE__telescopic_sliding__base_collar_1.svg` |
| `composite 1.svg` | `GATE__telescopic_sliding__composite.svg` |
| `dog_bars 1.svg` | `GATE__telescopic_sliding__dog_bars.svg` |

## tracked sliding variants

Tipo: `tracked_sliding`. Un solo set, senza `_motorised`.

| File attuale | Rinomina in |
|---|---|
| `arched + circles-1.svg` | `GATE__tracked_sliding__arched_circles.svg` |
| `arched + circles.svg` | `GATE__tracked_sliding__arched_circles__ALT1.svg` |
| `arched +collar.svg` | `GATE__tracked_sliding__arched_collar_1.svg` |
| `arched 1.svg` | `GATE__tracked_sliding__arched.svg` |
| `arched collars + circles-1.svg` | `GATE__tracked_sliding__arched_circles_collar_1.svg` |
| `arched collars + circles.svg` | `GATE__tracked_sliding__arched_circles_collar_1__ALT1.svg` |
| `arched collars.svg` | `GATE__tracked_sliding__arched_collar_1__ALT1.svg` |
| `arched.svg` | `GATE__tracked_sliding__arched__ALT1.svg` |
| `arched_dog_bars + circles.svg` | `GATE__tracked_sliding__arched_dog_bars_circles.svg` |
| `arched_dog_bars + collar + circles.svg` | `GATE__tracked_sliding__arched_dog_bars_circles_collar_1.svg` |
| `arched_dog_bars + collar.svg` | `GATE__tracked_sliding__arched_dog_bars_collar_1.svg` |
| `arched_dog_bars 1.svg` | `GATE__tracked_sliding__arched_dog_bars.svg` |
| `arched_dog_bars collars + circles.svg` | `GATE__tracked_sliding__arched_dog_bars_circles_collar_1__ALT1.svg` |
| `arched_dog_bars collars.svg` | `GATE__tracked_sliding__arched_dog_bars_collar_1__ALT1.svg` |
| `arched_dog_bars.svg` | `GATE__tracked_sliding__arched_dog_bars__ALT1.svg` |
| `base 1.svg` | `GATE__tracked_sliding__base.svg` |
| `base 2  + circles.svg` | `GATE__tracked_sliding__base_circles.svg` |
| `base 2 + collar + circles.svg` | `GATE__tracked_sliding__base_circles_collar_1.svg` |
| `base 2 + collar.svg` | `GATE__tracked_sliding__base_collar_1.svg` |
| `base collar + circles-1.svg` | `GATE__tracked_sliding__base_circles_collar_1__ALT1.svg` |
| `base collar + circles.svg` | `GATE__tracked_sliding__base_circles_collar_1__ALT2.svg` |
| `base collar.svg` | `GATE__tracked_sliding__base_collar_1__ALT1.svg` |
| `composite 1.svg` | `GATE__tracked_sliding__composite.svg` |
| `composite 2 + circles.svg` | `GATE__tracked_sliding__composite_circles.svg` |
| `composite circles.svg` | `GATE__tracked_sliding__composite_circles__ALT1.svg` |
| `dog_bars 1.svg` | `GATE__tracked_sliding__dog_bars.svg` |
| `dog_bars 2  + collars.svg` | `GATE__tracked_sliding__dog_bars_collar_1.svg` |
| `dog_bars 2 + circles + collars-1.svg` | `GATE__tracked_sliding__dog_bars_circles_collar_1.svg` |
| `dog_bars 2 + circles + collars.svg` | `GATE__tracked_sliding__dog_bars_circles_collar_1__ALT1.svg` |
| `dog_bars circles.svg` | `GATE__tracked_sliding__dog_bars_circles.svg` |
| `dog_bars collars + circles.svg` | `GATE__tracked_sliding__dog_bars_circles_collar_1__ALT2.svg` |
| `dog_bars collars.svg` | `GATE__tracked_sliding__dog_bars_collar_1__ALT1.svg` |
