# Radius Sliding

## Identità

Il `Radius Sliding` è la tipologia meno definita nel materiale attuale.

Nel brief compare come `curved / radius sliding gate`, ma non è ancora chiaro se significhi:

- un cancello che scorre su percorso curvo
- un cancello con parte superiore curva
- entrambe le cose

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `RADIUS_SLIDING` |
| Famiglia meccanica | Sliding con definizione incompleta |
| Tipologia commerciale | Radius / curved sliding gate |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline | `FROM GBP 2500` manuale, `FROM GBP 4200` automatico |
| Range iniziale altezza | `900/1000 mm` |
| Range iniziale larghezza | `1600/1700 mm` |

## Dimensioni

Abbiamo solo la baseline iniziale.

Resta da confermare:

- range min/max effettivo
- step dimensionali
- regole geometriche del percorso
- eventuale top curve versus track curve

## Logica tecnica

### Ambiguità principale

Questo gate non deve essere trattato come specifica definitiva finché il cliente non chiarisce la cinematica.

Le due interpretazioni tecnicamente possibili sono:

1. scorrimento su traiettoria curva
2. profilo superiore arcuato con scorrimento lineare

### 2D

La preview 2D dovrà aspettare una conferma funzionale, perché la forma del motion path cambia completamente il disegno.

### 3D

Nel 3D il comportamento deve restare provvisorio finché la meccanica non è definita.

## Opzioni decorative rilevanti

In teoria può ereditare la famiglia Victorian, ma la compatibilità deve essere verificata una volta chiarita la meccanica.

## Prezzo

Il baseline `FROM` esiste già, ma non basta per chiudere il comportamento del prodotto.

## Dati mancanti da chiarire col cliente

- definizione esatta del termine `Radius Sliding`
- percorso di movimento
- trattamento della curva superiore
- limiti dimensionali reali
- compatibilità con decorazioni e struttura `Composite Boards`

## Sintesi operativa

È il gate più rischioso da modellare male. Prima va chiuso il significato tecnico, poi si può rifinire preview, pricing e 3D.

