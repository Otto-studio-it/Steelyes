# 🗺️ Road Map: Chiusura Phase 0

> **Obiettivo Finale:** Superare il Gate della Phase 0 ("Preview URL shows styled 'Hello Steelyes'") e avere un ambiente di sviluppo 100% operativo con Supabase.

Questa è la nostra checklist. Spunteremo ogni voce man mano che la completiamo per avere la situazione sempre sotto controllo.

---

## 🗄️ Parte 1: Struttura Database (Supabase)
*L'obiettivo qui è dare una forma solida al database e bloccarlo lato sicurezza.*

- [ ] **1.1 Scaffold Cartelle:** Creare l'alberatura `supabase/migrations/` nel monorepo.
- [ ] **1.2 Migration Init (`001_init.sql`):** Scrivere il codice SQL per creare le 5 tabelle core dell'architettura:
  - `gates` (catalogo)
  - `configurations` (salvataggi)
  - `quote_requests` (lead funnel)
  - `service_zones` (zone d'installazione)
  - `admin_audit` (log)
- [ ] **1.3 RLS (Row Level Security):** Abilitare RLS su tutte le 5 tabelle nel file SQL (policy vuote).
- [ ] **1.4 Seed Minimo (`seed.sql`):** Inserire uno script con 1 record "cancello finto" per fare i test.
- [ ] **1.5 Push su Supabase:** Eseguire (da parte tua) il comando CLI per lanciare la migrazione sul progetto di Staging.

---

## 💻 Parte 2: Infrastruttura Frontend (Next.js)
*L'obiettivo qui è collegare il sito al database in modo sicuro e strongly-typed.*

- [ ] **2.1 Validazione Variabili (`lib/env.ts`):** Scrivere lo schema Zod. Se l'app non trova le chiavi nel file `.env.local` che hai creato, si blocca e ti avvisa. Niente sorprese.
- [ ] **2.2 Installazione Pacchetti:** Aggiungere `@supabase/ssr` e `@supabase/supabase-js` al `package.json` di `web` (se non ci sono già).
- [ ] **2.3 Creazione Client (`lib/supabase/client.ts` e `server.ts`):** Scrivere l'inizializzazione ufficiale di Supabase per il browser (Anon) e per le Server Actions (Service Role).

---

## 🏁 Parte 3: Il Gate (Il traguardo visivo)
*La prova del nove: tutto deve funzionare insieme.*

- [ ] **3.1 Pulizia Homepage:** Svuotare `apps/web/src/app/page.tsx` dal codice template di Next.js.
- [ ] **3.2 UI "Hello Steelyes":** Creare un layout moderno e scuro con Tailwind CSS, mostrando la scritta come richiesto dal documento di fase.
- [ ] **3.3 Test di Connessione DB:** Nel componente server della homepage, fare una query velocissima usando il nuovo client per leggere e stampare a schermo il "cancello finto" creato allo Step 1.4.
- [ ] **3.4 Push & Deploy:** Tu fai il commit e il push. Guardiamo Vercel compilare la PR e verifichiamo che l'URL mostri la pagina funzionante e che Playwright non dia errori.

---

*Per spuntare le voci, cambia `[ ]` in `[x]`.*
