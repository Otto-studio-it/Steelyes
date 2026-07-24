# Double Swing

## Identità

Il `Double Swing` è un cancello a battente doppio composto da due ante incernierate sui lati del varco.

Dal punto di vista funzionale:

- le due ante ruotano attorno a due assi verticali separati
- il movimento può essere verso interno o verso esterno
- la preview 2D deve mostrare chiaramente la linea di incontro centrale
- il 3D, quando verrà usato, dovrà avere due pivot indipendenti

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `DOUBLE_SWING` |
| Famiglia meccanica | Battente doppio |
| Tipologia commerciale | Vehicle gate con due swing leaves |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline | `FROM GBP 1800` manuale, `FROM GBP 3800` automatico per Traditional Victorian |
| Prezzi baseline Composite | stesso baseline manuale/automatico del modello Traditional nel brief attuale |
| Range iniziale altezza | `900/1000 mm` |
| Range iniziale larghezza | `1800/1900 mm` |

## Dimensioni

Le informazioni attuali non definiscono ancora:

- larghezza minima effettiva
- larghezza massima effettiva
- altezza minima effettiva
- altezza massima effettiva
- step dimensionali

Quello che abbiamo oggi è solo la misura iniziale di riferimento.

## Logica tecnica

### Movimento

Il sistema è un doppio swing classico:

- ciascuna anta ruota sul proprio lato cerniera
- il sistema deve supportare `openingDirection = inward | outward`
- il lato cerniera deve poter essere sinistro o destro
- eventuali asimmetrie future vanno trattate come estensione, non come default

### Rappresentazione 2D

La vista 2D dovrebbe includere:

- due ante specchiate
- linea di chiusura centrale
- eventuali decorazioni ripetute su entrambe le ante
- eventuale arco superiore se lo stile o la variante lo richiede

### Rappresentazione 3D

Se e quando il 3D sarà attivato:

- ogni anta dovrà avere un pivot indipendente
- il movimento di apertura dovrà essere parametrico
- eventuali motori o pistoni dovranno essere opzionali e non hardcoded

## Opzioni decorative rilevanti

Per `Traditional Victorian Style`, questo gate può esporre:

- `middle_bar`
- `top_railheads`
- `dog_bars`
- `dog_bar_railheads`
- `arched_top`
- `circles`
- `bushes`
- `spirals`

Per `Composite Boards`, il brief non fornisce ancora un catalogo decorativo specifico né una costruzione definitiva.

## Prezzo

Il prezzo è da leggere sempre come `FROM`.

Per il Double Swing:

- il prezzo base è già presente nel brief cliente
- l'aumento di altezza deve alzare il prezzo
- l'aumento di larghezza deve alzare il prezzo
- le opzioni decorative aggiungono costo
- il prezzo non va presentato come totale finale garantito

## Dati mancanti da chiarire col cliente

- range dimensionali definitivi
- step standard, se esistono
- eventuali limiti tecnici per aperture inward/outward
- eventuali limiti di compatibilità con arched top o altre opzioni
- struttura tecnica precisa della variante `Composite Boards`
- eventuale formula di conteggio per le decorazioni

## Sintesi operativa

Questo è il gate più maturo dal punto di vista documentale e il candidato migliore per la prima scheda di riferimento nel configuratore.

