# Gate Catalog

Questa cartella raccoglie un documento tecnico per ciascuna tipologia di cancello oggi presente nel configuratore Steelyes.

Scopo:

- avere una scheda unica e leggibile per ogni gate type
- distinguere chiaramente i dati confermati da quelli ancora provvisori
- dare un riferimento pratico per pricing, preview 2D, futuro 3D e admin catalog

Per la ripartenza operativa usa anche:

- [`docs/frontend/CONFIGURATOR_GATE_RESTART_MAP.md`](../CONFIGURATOR_GATE_RESTART_MAP.md)
- [`docs/frontend/CONFIGURATOR_REBUILD_PLAYBOOK.md`](../CONFIGURATOR_REBUILD_PLAYBOOK.md)
- [`docs/frontend/CONFIGURATOR_GATE_EXECUTION_CHECKLIST.md`](../CONFIGURATOR_GATE_EXECUTION_CHECKLIST.md)
- [`docs/frontend/gate-missing-data/README.md`](../gate-missing-data/README.md)

Fonti usate per la ricostruzione:

- [`docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](../CLIENT_GATE_REQUIREMENTS_REFERENCE.md)
- [`docs/steelyes-gate-configurator-technical-spec.md`](../../steelyes-gate-configurator-technical-spec.md)
- [`docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`](../CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md)
- [`docs/CONFIGURATOR_EXECUTION_CHECKLIST.md`](../CONFIGURATOR_EXECUTION_CHECKLIST.md)

## Elenco

| Gate type | File | Note sintetica |
|---|---|---|
| Double Swing | [`double-swing.md`](./double-swing.md) | Battente doppio, baseline più chiara e più stabile |
| Single Swing | [`single-swing.md`](./single-swing.md) | Battente singolo, utile per accessi ridotti |
| Tracked Sliding | [`tracked-sliding.md`](./tracked-sliding.md) | Scorrevole su guida a terra |
| Cantilever Sliding | [`cantilever-sliding.md`](./cantilever-sliding.md) | Scorrevole autoportante senza guida nel varco |
| Bifolding Double Swing | [`bifolding-double-swing.md`](./bifolding-double-swing.md) | Due ante principali divise in pannelli pieghevoli |
| Single Bifolding | [`single-bifolding.md`](./single-bifolding.md) | Una sola anta pieghevole su un lato |
| Telescopic Sliding | [`telescopic-sliding.md`](./telescopic-sliding.md) | Scorrevole multi-panel con sovrapposizione |
| Radius Sliding | [`radius-sliding.md`](./radius-sliding.md) | Tipologia ancora ambigua e da confermare |

## Lettura rapida

- Le misure iniziali sono già presenti nei documenti cliente, ma i range min/max e gli step definitivi non sono chiusi.
- I prezzi `FROM` esistono già come baseline provvisoria.
- Le decorazioni appartengono soprattutto allo stile `Traditional Victorian Style`.
- `Composite Boards` è confermato come stile, ma la sua costruzione tecnica è ancora incompleta.
- `Radius Sliding` è la tipologia con maggiore ambiguità funzionale.

## Regola di uso

Se devi usare questi file per un riassunto o per il cliente:

- tratta come confermato solo ciò che è scritto nei documenti sorgente
- tratta come provvisorio tutto ciò che il brief non chiude in modo esplicito
- non trasformare ipotesi tecniche in specifiche definitive
