# Telescopic Sliding

## Identità

Il `Telescopic Sliding` è un sistema scorrevole multi-panel in cui due o più ante scorrono in sequenza e si sovrappongono.

L’obiettivo tecnico è ridurre lo spazio laterale necessario rispetto a uno scorrevole monoblocco.

## Dati confermati

| Campo | Valore |
|---|---|
| Gate type | `TELESCOPIC_SLIDING` |
| Famiglia meccanica | Scorrevole multi-panel |
| Tipologia commerciale | Telescopic sliding gate |
| Stile confermato | `Traditional Victorian Style`, `Composite Boards` |
| Modalità | Manuale, automatizzato |
| Prezzi baseline | `FROM GBP 3100` manuale, `FROM GBP 4200` automatico |
| Range iniziale altezza | `900/1000 mm start` |
| Range iniziale larghezza | `2000/2100 mm` |

## Dimensioni

Quello che manca oggi è particolarmente importante qui:

- numero esatto di pannelli
- rapporto di trascinamento tra i pannelli
- corsa e sovrapposizione effettiva
- limiti di larghezza e altezza
- step dimensionali

## Logica tecnica

### Movimento

Il telescopic sliding:

- non si muove come un singolo blocco
- usa pannelli multipli
- richiede una logica di movimento sincronizzata

### Componenti visibili

Da evidenziare in modo leggibile:

- pannello principale
- pannelli secondari
- zone di sovrapposizione
- direzione di scorrimento

### 2D

La preview 2D deve mostrare bene:

- la sequenza di scorrimento
- l’ordine di sovrapposizione
- la differenza rispetto al tracked sliding

### 3D

Il 3D dovrà gestire:

- più transform indipendenti
- sincronizzazione di traslazione
- collision bounds coerenti fra pannelli

## Opzioni decorative rilevanti

Le decorazioni Victorian possono essere applicabili sul fronte, ma la compatibilità finale va verificata rispetto alle sovrapposizioni mobili.

## Prezzo

Il baseline `FROM` è già presente.

Va mantenuta una distinzione chiara tra:

- base meccanica
- complessità del multi-panel
- eventuali extras decorativi

## Dati mancanti da chiarire col cliente

- numero dei pannelli
- ordine di scorrimento
- estensione massima in apertura
- regole di sovrapposizione
- compatibilità dettagliata con decorazioni e arch top

## Sintesi operativa

È il sistema più complesso tra gli sliding confermati, quindi va documentato come multi-mesh e multi-motion fin dall’inizio.

