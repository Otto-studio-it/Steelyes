---
title: Setup risposta automatica email info@
description: Guida passo-passo per attivare l'auto-risposta + etichette sulla casella info@steelyes.co.uk
owner: Ruben
status: ACTIVE
last_updated: 2026-08-03
---

# Attivare la risposta automatica su info@steelyes.co.uk

Questa guida attiva uno script che, quando arriva una email nuova su
**info@steelyes.co.uk**, risponde da sola dicendo "l'abbiamo ricevuta, un
operatore la sta esaminando" e mette un'etichetta colorata per capire di
cosa parla senza doverla aprire. Nessuna modifica al dominio o alla posta:
si può disattivare in qualsiasi momento senza conseguenze (vedi fondo pagina).

Serve farlo **una sola volta**, da fatto in poi funziona da solo.

## Cosa serve prima di iniziare

- Essere loggati nel browser con l'account **info@steelyes.co.uk** (non un
  account Gmail personale — deve essere proprio quello).
- Il contenuto del file `scripts/gmail-inbox-autoack.gs` (nel repository del
  sito). Se non sai aprire il repository, chiedi a Ruben di incollartelo.

## Passi

1. Vai su **script.google.com**, verifica in alto a destra che l'account
   attivo sia info@steelyes.co.uk (se non lo è, cambia account prima di
   continuare).
2. Clicca **Nuovo progetto** (pulsante in alto a sinistra).
3. Si apre un editor con scritto `function myFunction() {}`. Seleziona
   tutto quel testo e cancellalo.
4. Incolla al suo posto tutto il contenuto del file
   `scripts/gmail-inbox-autoack.gs`.
5. Salva (icona a forma di dischetto, o Ctrl+S / Cmd+S).
6. Poco sopra l'editor c'è un menu a tendina con scritto il nome di una
   funzione (probabilmente `autoAckInbox`). Aprilo e scegli
   **installTrigger** invece.
7. Clicca il pulsante **Esegui** (▶, in alto).
8. Google chiederà un'autorizzazione ("Autorizzazione richiesta"):
   - Clicca **Continua**.
   - Scegli l'account info@steelyes.co.uk.
   - Se compare un avviso tipo "Google non ha verificato questa app", è
     normale (lo script è nostro, non pubblico) → clicca **Avanzate** →
     **Vai al progetto (non sicuro)** → **Consenti**.
9. In basso deve comparire **Esecuzione completata**. Fatto: da ora lo
   script gira da solo ogni 10 minuti, non serve toccare più nulla.

## Come verificare che funzioni

1. Manda una email di prova a info@steelyes.co.uk da un altro indirizzo
   (es. Gmail personale), oggetto tipo "Vorrei un preventivo per un
   cancello".
2. Aspetta fino a 10 minuti.
3. Apri la casella info@ su Gmail normale (mail.google.com): dovresti
   vedere una risposta automatica già inviata al mittente, e la email
   marcata con due etichette: **Steelyes/Acked** e **Steelyes/Preventivo**.

## Colorare le etichette (consigliato, 1 minuto)

Su Gmail (mail.google.com, stesso account) → icona ingranaggio in alto →
**Vedi tutte le impostazioni** → tab **Etichette**. Cerca le etichette che
iniziano con "Steelyes/" e assegna un colore diverso a ciascuna, così in
inbox si riconoscono a colpo d'occhio.

## Cosa NON fa (importante)

- Non risponde alle email che il sito manda già in automatico verso
  info@ (quelle con oggetto `[LEAD]`, `[PREVENTIVO]`, `[INTAKE]`) — quelle
  restano come sono oggi, lo script le ignora apposta.
- Non risponde due volte alla stessa persona sullo stesso argomento
  (segna ogni email come "già risposta" e non la ritocca più).

## Come disattivarlo

Se in futuro si vuole fermare: script.google.com → apri il progetto →
icona a forma di orologio (**Trigger**) nel menu a sinistra → clicca i tre
puntini sulla riga `autoAckInbox` → **Elimina trigger**. La posta torna a
comportarsi esattamente come prima, senza altre modifiche da fare.
