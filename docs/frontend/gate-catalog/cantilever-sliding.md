# Cantilever Sliding

## Identità

Il `Cantilever Sliding` è un cancello scorrevole autoportante che non usa una guida nel varco di passaggio.

La sua logica meccanica è basata su:

- una parte di controbilanciamento posteriore
- carrelli a rulli fissati esternamente al varco
- assenza di rail a terra nel passaggio

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `CANTILEVER_SLIDING` |
| Famiglia meccanica | Scorrevole autoportante |
| Tipologia commerciale | Cantilevered sliding gate |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline | `FROM GBP 2900` manuale, `FROM GBP 4200` automatico |
| Range iniziale altezza | `900/1000 mm` |
| Range iniziale larghezza | `2500/2600 mm` |
| Coda (controbilanciamento) | `luce / 3`, **minimo** — confermato 2026-07-28 |
| Larghezza nel configuratore | Solo **luce tra i pilastri**; la coda è in aggiunta |

## Geometria della coda — CONFERMATA

Regola del cliente ([CA-05](../../client-answers/2026-07-28-marius.md#ca-05--cantilever-tail--13-of-the-clear-opening-minimum)):

```txt
luce            = distanza tra i pilastri = quello che digita il cliente
coda            = luce / 3            (MINIMO, arrotondato per eccesso)
ingombro totale = luce + coda         (≈ 1,333 × luce)
```

Esempio dato dal cliente: `4000 mm di luce → coda 1333 mm → totale 5333 mm`.

Conseguenza operativa: chi digita 4000 mm ha bisogno di **5333 mm di corsa libera** sul lato di parcheggio del cancello, più lo spazio per pilastri e carrelli. È l'errore di posa più comune sui cantilever — va mostrato come nota viva nello step dimensioni, non nascosto nel PDF di sopralluogo.

Nota implementativa: `packages/gate-engine/src/rules/cantilever.ts` usa ancora un fallback `0.28` per tutte le larghezze diverse da 4000 mm. Quel numero era un segnaposto creato quando la regola era ignota ed è ora superato — vedi CL-705.

## Dimensioni

Mancano ancora:

- range minimo e massimo effettivo
- step dimensionali
- ingombro reale della struttura portante
- limiti tecnici legati alla posa

## Logica tecnica

### Movimento

Il cantilever:

- si sposta lateralmente come uno sliding
- non ha una guida che attraversa il varco
- deve mostrare in modo chiaro la coda di bilanciamento

### Componenti visibili

Nel disegno tecnico e nel 3D dovrebbero comparire:

- l’anta principale
- la sezione di controbilanciamento
- i carrelli di supporto
- il basamento o support frame

### 2D

La preview 2D deve rendere intuitivo che:

- il passaggio resta libero da guide a terra
- la coda posteriore esce dal lato di appoggio
- la struttura complessiva è più lunga dell’apertura utile

### 3D

In 3D è fondamentale separare:

- la parte visibile nel varco
- la parte di controbilanciamento
- la piattaforma/carriage base

## Opzioni decorative rilevanti

Le decorazioni Victorians restano applicabili sul frontale, ma la compatibilità finale va confermata per eventuali elementi che interferiscono con la struttura di scorrimento.

## Prezzo

Il baseline è già dichiarato come `FROM`.

Va preservata la logica:

- prezzo manuale distinto dall’automatico
- aggiustamenti dimensionali successivi
- opzioni decorative come extras
- nessuna promessa di prezzo finale senza survey

## Dati mancanti da chiarire col cliente

- lunghezza esatta della coda di bilanciamento
- vincoli di fondazione e posa
- limiti reali per larghezza/altezza
- compatibilità dettagliata con decorazioni e arch top
- specifiche costruttive della variante `Composite Boards`

## Sintesi operativa

È il gate più importante da rappresentare bene sul piano strutturale, perché la parte “nascosta” del meccanismo cambia completamente il layout.

