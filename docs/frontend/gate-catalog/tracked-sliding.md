# Tracked Sliding

## Identità

Il `Tracked Sliding` è un cancello scorrevole monoblocco che si muove lateralmente su una guida a terra.

Dal punto di vista tecnico:

- l’anta trasla lungo un asse orizzontale
- il movimento è lineare
- il sistema può prevedere ruote, rulli e guida superiore anti-ribaltamento

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `TRACKED_SLIDING` |
| Famiglia meccanica | Scorrevole su guida |
| Tipologia commerciale | Tracked sliding gate |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline | `FROM GBP 2200` manuale, `FROM GBP 3600` automatico |
| Range iniziale altezza | `900/1000 mm` |
| Range iniziale larghezza | `2500/2600 mm` |

## Dimensioni

I dati attuali non definiscono ancora:

- larghezza minima effettiva
- larghezza massima effettiva
- altezza minima e massima effettiva
- step dimensionali

## Logica tecnica

### Movimento

Il tracked sliding si comporta così:

- l’anta si sposta di lato per liberare il varco
- non esiste rotazione principale dell’anta nel modello standard
- il sistema deve poter rappresentare la corsa completa

### Componenti visibili

In preview e futuro 3D è utile evidenziare:

- la guida a terra
- eventuale guida superiore
- l’anta completa
- eventuale cremagliera o gruppo motore per la versione automatizzata

### 2D

La preview tecnica dovrebbe mostrare:

- posizione chiusa
- posizione aperta
- scorrimento laterale
- track visibile quando necessario

### 3D

In 3D, il modello dovrà distinguere:

- mesh dell’anta
- mesh del track
- eventuali sottocomponenti di guida
- motion controller di traslazione

## Opzioni decorative rilevanti

Per la famiglia `Traditional Victorian Style`, valgono le decorazioni classiche.

Per `Composite Boards`, il brief conferma lo stile ma non definisce ancora il layout costruttivo completo.

## Prezzo

Il pricing è già presente come baseline `FROM`.

La logica commerciale da preservare è:

- manuale e automatico con base distinta
- aumenti dimensionali da applicare sopra il base
- opzioni decorative da sommare separatamente
- prezzo sempre indicativo

## Dati mancanti da chiarire col cliente

- corsa effettiva e lunghezza di ritorno
- requisiti della guida superiore
- limiti tecnici della meccanica automatizzata
- costruzione definitiva di `Composite Boards`
- eventuale compatibilità di alcune decorazioni con il movimento scorrevole

## Sintesi operativa

È il primo cancello veramente scorrevole del set e va modellato con attenzione al track, perché è l’elemento più importante da comunicare visivamente.

