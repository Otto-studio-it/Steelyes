# Single Swing

## Identità

Il `Single Swing` è un cancello a battente singolo con un’unica anta incernierata su un lato.

È indicato nei documenti come:

- soluzione per accessi ridotti
- possibile uso pedonale o driveway compatto

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `SINGLE_SWING` |
| Famiglia meccanica | Battente singolo |
| Tipologia commerciale | Single-leaf gate, smaller access or driveway use |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline Traditional | `FROM GBP 850` manuale, `FROM GBP 2700` automatico |
| Prezzi baseline Composite | `FROM GBP 750` manuale, `FROM GBP 2700` automatico |
| Range iniziale altezza | `900/1000 mm` |
| Range iniziale larghezza | `800/900 mm` |

## Dimensioni

Come per gli altri gate, oggi è confermata solo la misura iniziale di riferimento.

Mancano ancora:

- range minimo effettivo
- range massimo effettivo
- step dimensionali
- eventuale differenza di baseline tra le due famiglie stilistiche oltre ai prezzi manuali

## Logica tecnica

### Movimento

Il cancello:

- ruota su un solo asse verticale
- deve supportare apertura sinistra o destra
- deve supportare apertura inward o outward
- deve mostrare correttamente il lato cerniera nella preview

### 2D

La vista 2D dovrebbe rendere evidenti:

- il lato cerniera
- il verso di apertura
- l'ingombro di rotazione
- il blocco di chiusura sul lato opposto alle cerniere

### 3D

Il 3D, quando verrà introdotto, dovrà usare:

- un pivot unico
- una rotazione parametricamente controllabile
- eventuali accessori meccanici opzionali, non presunti

## Opzioni decorative rilevanti

Per `Traditional Victorian Style`, il Single Swing può usare il set decorativo Victorian standard:

- `middle_bar`
- `top_railheads`
- `dog_bars`
- `dog_bar_railheads`
- `arched_top`
- `circles`
- `bushes`
- `spirals`

Per `Composite Boards`, il brief non definisce una decorazione equivalente.

## Prezzo

Il prezzo resta `FROM` e va letto come indicativo.

Punti importanti:

- il manuale `Traditional Victorian` ha un baseline diverso dal `Composite Boards`
- la versione automatica ha lo stesso valore base nel brief attuale per entrambe le famiglie
- eventuali extra dimensionali o decorativi vanno sommati al base

## Dati mancanti da chiarire col cliente

- limiti reali di larghezza e altezza
- eventuali vincoli di apertura in spazi ridotti
- regole di compatibilità per opzioni decorative
- struttura tecnica completa di `Composite Boards`
- formula di conteggio e costo delle decorazioni

## Sintesi operativa

È un gate semplice dal punto di vista cinematico, ma resta importante perché copre il segmento degli accessi più compatti.

