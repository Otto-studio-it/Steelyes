# Steelyes — UI/UX Roadmap Completo
**Analisi:** ui-ux-pro-max + code review manuale + revisione esterna
**Branch base:** `feat/header-footer-navigation`
**Data:** 2026-05-08
**Stack:** Next.js 14 · Tailwind CSS · Barlow Condensed / Barlow / IBM Plex Mono

---

## Design System — Validato e Bloccato

Questi valori sono stati confermati corretti dall'analisi. Non vanno modificati.

| Token | Valore | Perché è giusto |
|---|---|---|
| Dark primary | `#1B1C1A` | Industrial, neutro caldo, non freddo-tech |
| Red accent/CTA | `#9E000C` | Più scuro del DC2626 standard = più premium |
| Red sezione CTA | `#C41E1E` | Versione leggermente più brillante per sezioni piene |
| Warm background | `#F5F3F0` | Non bianco puro = meno sterile, più materiale |
| Gold label | `#795916` | Segnale premium su overline — unico nel palette |
| Warm brown text | `#5C403D` | Tono caldo su sfondi chiari = coerenza materica |
| Font heading | Barlow Condensed 700 | Compresso, industriale, forte |
| Font body | Barlow 300/400/600 | Leggibile, stesso sistema del heading |
| Font mono | IBM Plex Mono 400 | Credibilità tecnica, specifiche, label |

**Pattern struttura pagina (validato dallo skill Trust & Authority):**
```
Hero → Proof → Product → Process → CTA Configurator → Gallery → CTA Finale
```

---

## File in Scope

```
apps/web/src/app/(marketing)/page.tsx            — homepage
apps/web/src/components/marketing/HomeWeldingHero.tsx  — hero section
apps/web/src/components/marketing/SiteHeader.tsx       — navigazione
apps/web/src/components/marketing/SiteFooter.tsx       — footer
apps/web/src/app/layout.tsx                       — root layout
apps/web/src/app/globals.css                      — stili globali
apps/web/public/images/                           — asset immagini
```

---

## Breakpoint Reference

| Nome | Valore | Device target |
|---|---|---|
| mobile | default (0px+) | iPhone SE 375px |
| `sm:` | 640px | iPhone Pro Max landscape |
| `md:` | 768px | iPad portrait |
| `lg:` | 1024px | iPad landscape / desktop small |
| `xl:` | 1280px | desktop |
| `2xl:` | 1440px | desktop wide |

---
---

# FASE 1 — Accessibility + Touch Base

**File:** `SiteHeader.tsx`, `globals.css`
**Stima:** 1–2 ore
**Dipendenze:** nessuna — va fatta per prima

### Perché questa fase viene prima di tutto

L'accessibilità non è un nice-to-have opzionale. Un sito che sembra funzionare visivamente ma è rotto semanticamente causa tre problemi concreti:

1. **Screen reader** (NVDA, VoiceOver iOS) non annunciano lo stato del menu — utente con disabilità visiva non sa se il menu è aperto o chiuso.
2. **SEO** — i crawler di Google leggono gli attributi ARIA per capire la struttura del sito. Un `aria-expanded` sempre falso segnala un componente non funzionante.
3. **WCAG compliance** — se Steelyes vuole lavorare con enti pubblici o B2B enterprise UK, la compliance WCAG 2.1 AA è spesso richiesta contrattualmente.

Il 300ms tap delay (touch-action) non è accessibilità pura ma è critico per la percezione di qualità su Android — ogni tap sembra lento.

---

### 1.1 — `aria-haspopup` sbagliato

**File:** `SiteHeader.tsx` riga 109
**Problema:** Il valore `"true"` è tecnicamente valido ma ambiguo. Lo standard ARIA dice che `"true"` equivale a `"menu"` ma alcuni screen reader lo interpretano diversamente. Il valore corretto esplicito per un dropdown di link è `"menu"`.

```tsx
// PRIMA
aria-haspopup="true"

// DOPO
aria-haspopup="menu"
```

---

### 1.2 — `aria-expanded` sempre false

**File:** `SiteHeader.tsx` riga 109–119
**Problema:** Il dropdown desktop apre tramite CSS puro (`group-hover` / `group-focus-within`). L'attributo `aria-expanded` rimane hardcoded a `"false"` in ogni stato. Uno screen reader annuncia sempre "chiuso" anche quando il menu è visibilmente aperto.

La soluzione richiede di portare lo stato apertura nel JavaScript React invece di affidarsi solo a Tailwind:

```tsx
// Aggiungere al componente SiteHeader
const [openGroup, setOpenGroup] = useState<string | null>(null)

// Sul Link trigger di ogni gruppo
<Link
  href={group.href}
  aria-haspopup="menu"
  aria-expanded={openGroup === group.label}
  onMouseEnter={() => setOpenGroup(group.label)}
  onFocus={() => setOpenGroup(group.label)}
  onMouseLeave={() => setOpenGroup(null)}
  onBlur={() => setOpenGroup(null)}
>

// Il dropdown div va reso visibile via state, non solo CSS
<div
  className={cn(
    'absolute left-0 top-full min-w-[260px] pt-3 transition-all',
    openGroup === group.label
      ? 'visible opacity-100'
      : 'invisible opacity-0'
  )}
>
```

**Nota:** il comportamento visivo rimane identico — solo il segnale semantico cambia.

---

### 1.3 — Drawer mobile: `100vh` → `100dvh`

**File:** `SiteHeader.tsx` riga 185
**Problema:** Su iOS Safari, `100vh` include lo spazio occupato dalla barra indirizzi del browser. Quando la barra è visibile (pagina scorsa all'inizio), il drawer può essere più alto del viewport visibile e il suo contenuto viene tagliato sotto la barra degli URL. `100dvh` (dynamic viewport height) si aggiusta in tempo reale alla barra browser.

```tsx
// PRIMA
className="max-h-[calc(100vh-4rem)] overflow-y-auto ..."

// DOPO
className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain ..."
```

`overscroll-contain` aggiunge protezione contro il bounce iOS: quando l'utente scrolla fino in fondo al drawer, il body sotto non scorre.

---

### 1.4 — `touch-action: manipulation` globale

**File:** `globals.css`
**Problema:** I browser mobile hanno un ritardo di 300ms su ogni tap per distinguere un singolo tap da un doppio tap (per lo zoom). Questo rende ogni click su link e button leggermente lento. `touch-action: manipulation` disabilita il doppio-tap-zoom su quegli elementi mantenendo tutti gli altri gesti.

```css
/* globals.css */
a,
button,
[role="button"] {
  touch-action: manipulation;
}
```

---
---

# FASE 2 — Hero Mobile Fix

**File:** `HomeWeldingHero.tsx`
**Stima:** 1.5–2 ore
**Dipendenze:** nessuna — indipendente dalla Fase 1

### Perché questa fase è alta priorità

Il hero è la prima cosa che ogni visitatore vede. Su mobile (che è la maggioranza del traffico) ci sono tre problemi combinati che degradano l'esperienza:

1. **Altezza fissa** — 640px fissi non comunicano con il browser iOS. Con la barra degli indirizzi aperta, il contenuto sotto la fold è visibile prima del previsto, rompendo l'effetto "full screen".
2. **Scala tipografica brutale** — il testo salta da 36px a 96px senza step intermedi. Su tablet il testo è o troppo piccolo o enorme a seconda del breakpoint.
3. **Overlay troppo scuro** — il prodotto reale (cancello in acciaio, scintille di saldatura) è nascosto sotto quasi il 75% di nero combinato. Se il cliente ha pagato per un'immagine forte, deve potersi vedere.
4. **Overline duplica H1** — dice "Bespoke steel gates" nell'overline e poi la H1 inizia con "Bespoke steel gates". L'overline dovrebbe aggiungere informazione, non ripetere il titolo.

---

### 2.1 — Hero height: `min-h-[100svh]`

**Riga:** 7 (nella section principale)
**Perché `svh` e non `dvh`:** `svh` (small viewport height) è il viewport minimo — quello con la barra browser aperta. Garantisce che il hero riempia sempre lo schermo anche nel caso peggiore. `dvh` cambierebbe dimensione mentre l'utente scrolla, causando un layout shift visibile.

```tsx
// PRIMA
<section className="relative min-h-[640px] overflow-hidden bg-[#1B1C1A] md:min-h-[870px]">

// DOPO
<section className="relative min-h-[100svh] overflow-hidden bg-[#1B1C1A] md:min-h-[870px]">
```

---

### 2.2 — H1 scala progressiva

**Riga:** 228
**Perché:** Il salto da `text-4xl` (36px) a `md:text-8xl` (96px) non ha step intermedi. Su un iPad a 768px il testo è già a 96px — enorme. La scala deve essere graduale per funzionare su ogni schermo.

```tsx
// PRIMA
<h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-5xl md:text-8xl">

// DOPO
<h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-8xl">
```

Scala risultante: 36px → 48px → 60px → 96px

---

### 2.3 — Overlay meno scuro

**Righe:** 222–223
**Perché:** Due overlay sovrapposti sommano ~75% di opacità nera. Il prodotto (immagine cancello + scintille) è quasi invisibile. Il cliente ha fornito immagini reali — devono potersi vedere. Il testo rimane leggibile anche con overlay alleggerito perché il gradiente orizzontale protegge il lato sinistro dove sta il testo.

```tsx
// PRIMA — somma ~75% nero
<div className="absolute inset-0 bg-black/55 md:bg-black/48" />
<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/10" />

// DOPO — somma ~45% nero, prodotto visibile
<div className="absolute inset-0 bg-black/38 md:bg-black/32" />
<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/12 to-transparent" />
```

---

### 2.4 — Overline non duplica H1

**Riga:** 227
**Perché:** L'overline è uno spazio prezioso — comunica il posizionamento o la differenza. Se dice le stesse parole dell'H1, spreca quello spazio e crea ridondanza per chi legge con screen reader (che legge entrambi).

```tsx
// PRIMA
<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/75">
  Bespoke steel gates
</p>

// DOPO
<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/75">
  Steel fabrication · Made to measure
</p>
```

---

### 2.5 — Safe area landscape iPhone

**Riga:** 226 (div contenuto)
**Perché:** In modalità landscape su iPhone con notch o Dynamic Island, le safe area laterali (`env(safe-area-inset-left/right)`) proteggono il contenuto dall'essere nascosto sotto le aree sistema. Il padding `px-4` standard non conta queste aree.

```tsx
// PRIMA
<div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-28">

// DOPO
<div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-28
                supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))]
                supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]">
```

---
---

# FASE 3 — Homepage Sections Fix

**File:** `page.tsx`
**Stima:** 3–4 ore
**Dipendenze:** nessuna — può andare in parallelo con Fase 2

### Perché questa fase è critica per conversione

Una homepage ben costruita deve guidare il visitatore verso un'azione. Ogni sezione deve avere uno scopo chiaro e portare avanti il journey. Attualmente:

- Le card prodotto non portano da nessuna parte (nessun link)
- Su mobile le sezioni sono così alte che l'utente abbandona prima di arrivare alla CTA
- I label tecnici sono così piccoli da essere illeggibili su mobile
- Il configurator non spiega che non dà un prezzo definitivo — rischio di aspettativa errata

---

### 3.1 — Capability strip: font coerente

**Righe:** 80–81
**Perché:** Valore in `font-mono` + label in `font-heading` = due sistemi tipografici mischiati nello stesso componente senza logica. Il contesto è industriale/tecnico — il mono è il font giusto per entrambi. La gerarchia va gestita tramite dimensione e peso, non cambiando font.

```tsx
// PRIMA — mix incoerente
<p className="font-mono text-lg font-bold text-[#9E000C]">{value}</p>
<p className="font-heading text-sm font-bold uppercase text-[#5C403D]">{label}</p>

// DOPO — heading forte + mono descrizione
<p className="font-heading text-xl font-black uppercase text-[#9E000C]">{value}</p>
<p className="font-mono text-xs uppercase tracking-widest text-[#5C403D]">{label}</p>
```

**Nota sul wrapping mobile:** "Manual or automated" e "Supply & install" sono stringhe lunghe. Su 375px con `grid-cols-2` ogni cella è ~170px. Con `text-xl` il valore andrà a capo su 2 righe. Soluzione: `text-lg` su mobile, `text-xl` da sm in su:

```tsx
<p className="font-heading text-lg sm:text-xl font-black uppercase text-[#9E000C]">{value}</p>
```

---

### 3.2 — Gate cards: link + CTA

**Righe:** 97–116
**Perché:** Tre card senza link sono contenuto decorativo, non navigation. L'utente che vuole esplorare i tipi di cancello non ha modo di procedere da questa sezione. Il tasso di conversione di una sezione prodotto dipende dalla facilità con cui l'utente può approfondire.

```tsx
// DOPO — immagine cliccabile + CTA testuale
<article key={title} className="overflow-hidden rounded border border-zinc-200 bg-[#F5F3F0]">
  <Link href="/gates" className="group block">
    <div className="relative aspect-[3/2] sm:aspect-[4/5] w-full overflow-hidden bg-[#E4E2DF]">
      <MediaPlaceholder label={`${title} gate image`} aspectClassName="absolute inset-0 h-full w-full" />
    </div>
  </Link>
  <div className="p-6">
    <h3 className="font-heading text-3xl font-bold uppercase">{title}</h3>
    <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
    <div className="mt-5 flex items-center gap-4">
      <div>
        <p className="font-mono text-xs uppercase text-zinc-400">{detailA[0]}</p>
        <p className="font-mono text-sm font-bold">{detailA[1]}</p>
      </div>
      <div className="h-8 w-px bg-zinc-200" aria-hidden />
      <div>
        <p className="font-mono text-xs uppercase text-zinc-400">{detailB[0]}</p>
        <p className="font-mono text-sm font-bold">{detailB[1]}</p>
      </div>
    </div>
    <Link
      href="/gates"
      className="mt-5 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-[#9E000C] transition-colors hover:text-[#9B1515]"
    >
      Browse {title.toLowerCase()} gates <ArrowRight className="h-3 w-3" />
    </Link>
  </div>
</article>
```

**Nota:** i `detailA[0]` e `detailB[0]` erano `text-[10px]` — portati a `text-xs` (12px) nel codice sopra.

---

### 3.3 — Gate cards: aspect ratio su mobile

**Riga:** 104
**Perché:** `aspect-[4/5]` su 375px genera un'immagine alta 429px. Con 3 card in colonna singola = ~1740px solo per le immagini. L'utente mobile deve scrollare quasi 3 schermi interi per vedere l'intera sezione prodotto. `aspect-[3/2]` su mobile riduce a ~229px per immagine = ~1140px totali, più accettabile.

```tsx
// PRIMA
<div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E4E2DF]">

// DOPO — già integrato nel fix 3.2 sopra
<div className="relative aspect-[3/2] sm:aspect-[4/5] w-full overflow-hidden bg-[#E4E2DF]">
```

---

### 3.4 — Process section: numeri più piccoli su mobile

**Riga:** 144
**Perché:** `text-7xl` (72px) su mobile single-column significa 72px di elemento decorativo prima di ogni titolo. Con 4 step in colonna la sezione diventa altissima. Il numero grande è un effetto estetico valido su desktop (4 colonne orizzontali) — su mobile single-column è solo altezza sprecata.

```tsx
// PRIMA
<p className="mb-3 font-heading text-7xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>

// DOPO
<p className="mb-3 font-heading text-5xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>
```

**Aggiungere connettore visivo desktop:**

```tsx
<div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
  <div
    className="absolute top-[2.5rem] left-0 right-0 hidden h-px bg-zinc-200 md:block"
    aria-hidden
  />
  {processItems.map(([n, label, body]) => (
    <article key={label} className="relative">
      ...
```

La linea orizzontale connette visivamente i 4 step su desktop, comunicando la sequenza senza aggiungere testo.

---

### 3.5 — Configurator CTA: full-width mobile + disclaimer

**Righe:** 150–155, 166
**Perché due fix separati:**

- **Full-width mobile:** su 375px un `inline-flex` con `px-9` è largo ~180px — occupa meno della metà dello schermo. Un CTA primario su mobile deve essere full-width (o quasi) per essere tappabile facilmente e per comunicare importanza.
- **Disclaimer:** il configurator mostra un "pannello" con Gate_type, Material, Finish, Automation e poi dice "Survey-led quote". Un utente potrebbe aspettarsi un prezzo reale. Il microcopy chiarisce che il configurator è esplorativo, non un checkout.

```tsx
// CTA full-width mobile
<Link
  href="/configurator"
  className="mt-8 inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center bg-white px-9 py-4 font-heading text-lg font-bold uppercase tracking-tight text-[#9E000C]"
>
  Start configuring
</Link>
// Dopo il Link:
<p className="mt-3 font-mono text-xs uppercase opacity-60">
  Specification confirmed after survey
</p>
```

**"Survey-led quote" contrasto:**

```tsx
// PRIMA — text-3xl su #C41E1E = ~3.2:1 sotto AA
<p className="font-mono text-3xl font-bold uppercase sm:text-4xl">Survey-led quote</p>

// DOPO — large text (≥18px bold) soglia WCAG = 3:1 — size up risolve
<p className="font-mono text-4xl font-bold uppercase sm:text-5xl">Survey-led quote</p>
```

---

### 3.6 — Gallery: colonna singola su mobile + overlay

**Righe:** 216–239
**Perché layout:**
Il grid interno `grid-cols-2` su mobile divide 343px in due metà da ~170px ciascuna. In 170px un article con H3 `text-2xl` (24px), padding `p-6` (24px × 2 = 48px) lascia ~122px per il testo. Il titolo "Fabrication details" va a capo e il risultato è cramped e difficile da leggere.

**Perché overlay:**
Il testo centrato con `font-heading text-4xl` sopra la foto principale funziona su placeholder (sfondo grigio), ma quando arriverà una foto reale il testo centrato enorme compete con il soggetto. Bottom-left è il pattern standard per caption su immagini — meno invasivo, più leggibile.

```tsx
// PRIMA
<div className="grid flex-1 grid-cols-2 gap-4">
  <div className="relative col-span-2 h-72 overflow-hidden">
    ...
    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
      <div>
        <p className="font-heading text-4xl font-bold uppercase">Installed gates</p>
        <p className="font-mono text-sm uppercase text-white/80">Real entrances, real specifications</p>
      </div>
    </div>
  </div>
  <article className="bg-[#E4E2DF] p-6">
    ...
  </article>
  <div className="relative aspect-square w-full overflow-hidden bg-[#E4E2DF]" />
</div>

// DOPO
<div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
  <div className="relative col-span-1 h-64 overflow-hidden md:col-span-2 md:h-72">
    <MediaPlaceholder label="Installed steel gate project image" aspectClassName="absolute inset-0 h-full w-full" />
    <div className="absolute inset-0 bg-black/40" />
    {/* overlay bottom-left invece che centrato */}
    <div className="absolute bottom-4 left-4 text-white">
      <p className="font-heading text-2xl font-bold uppercase">Installed gates</p>
      <p className="font-mono text-xs uppercase text-white/70">Real entrances</p>
    </div>
  </div>
  <article className="bg-[#E4E2DF] p-6">
    <h3 className="font-heading text-2xl font-bold uppercase">Fabrication details</h3>
    <p className="mt-3 text-sm font-light leading-relaxed text-[#5C403D]">
      Close-up steelwork, joints, hinges, finishes and hardware prepared around the agreed specification.
    </p>
  </article>
  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E4E2DF] md:aspect-square">
    <MediaPlaceholder label="Technical detail image" aspectClassName="absolute inset-0 h-full w-full" />
  </div>
</div>
```

---

### 3.7 — Footer: link duplicato + contrasto

**File:** `SiteFooter.tsx` righe 20–23
**Perché:** "Request a Quote" e "Contact" puntano entrambi a `/contact`. Un footer è l'ultima zona di orientamento e conversione — non deve avere ripetizioni. Sostituire "Contact" con "About" dà un link utile senza duplicare.

```ts
// PRIMA
const START_LINKS = [
  { label: 'Request a Quote', href: '/contact', primary: true },
  { label: 'Configure Your Gate', href: '/configurator', primary: false },
  { label: 'Contact', href: '/contact', primary: false },  // ← duplicato
] as const

// DOPO
const START_LINKS = [
  { label: 'Request a Quote', href: '/contact', primary: true },
  { label: 'Configure Your Gate', href: '/configurator', primary: false },
  { label: 'About', href: '/about', primary: false },
] as const
```

**Contrasto testi footer:**
`text-zinc-500` (`#71717A`) su `#1B1C1A` = ~4.1:1 — borderline WCAG AA. Su monitor non calibrati può fallire.

```tsx
// In tutti i punti del footer dove appare text-zinc-500
// PRIMA
className="... text-zinc-500"
// DOPO
className="... text-zinc-400"
// #A1A1AA su #1B1C1A = ~6.2:1 ✅ ampio margine
```

---
---

# FASE 4 — Trust / Proof Section

**File:** `page.tsx`
**Stima:** 1 ora
**Dove va:** dopo la capability strip (dopo riga 79), prima delle gate cards

### Perché questa sezione è obbligatoria

Il pattern "Trust & Authority + Conversion" (confermato dallo skill ui-ux-pro-max) richiede che la seconda sezione della homepage mostri segnali di fiducia concreti. Steelyes vende cancelli in acciaio su misura — prodotti high-ticket che richiedono fiducia prima dell'acquisto. Un visitatore che non trova elementi di credibilità abbandona prima di esplorare il prodotto.

**Vincolo importante:** nessun dato falso. Non numero di progetti inventato, non anni di esperienza inventati. Solo affermazioni di processo già presenti altrove nel sito, riformattate come proof signal.

```tsx
// Inserire in page.tsx dopo </section> della capability strip

<section className="border-b border-zinc-200 bg-white py-10 md:py-12">
  <div className="mx-auto max-w-7xl px-4 md:px-8">
    <div className="grid grid-cols-1 divide-y divide-zinc-200 md:grid-cols-3 md:divide-x md:divide-y-0">
      {[
        ['Survey-led', 'Every gate specified before fabrication'],
        ['Made to order', 'No stock — built around your entrance'],
        ['Supply & install', 'One route from brief to handover'],
      ].map(([stat, desc]) => (
        <div
          key={stat}
          className="py-6 text-center first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
        >
          <p className="font-heading text-2xl font-black uppercase text-[#9E000C] md:text-3xl">{stat}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#5C403D]">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Comportamento:**
- Mobile: 3 item in colonna con separatore orizzontale tra ciascuno
- Desktop: 3 item in riga con separatore verticale
- Nessun colore di sfondo — bianco puro per staccarsi dalla capability strip `#F5F3F0`

---
---

# FASE 5 — Process Connector + Gallery Polish

**File:** `page.tsx`
**Stima:** 45 minuti
**Dipendenze:** Fase 3 completata (numeri ridotti)

### Perché questa fase

Piccoli fix di polish che completano l'esperienza senza modificare struttura o logica. La linea connettore della process section è un dettaglio che fa percepire la sezione come "design system" e non come quattro elementi casuali. Il fix gallery overlay è necessario ora che ci sono foto reali — il testo centrato enorme sopra una foto reale è visivamente invasivo.

---

### 5.1 — Connettore orizzontale process section

**Riga:** 127 (grid container)

```tsx
<div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
  {/* linea connettore — visibile solo desktop */}
  <div
    className="absolute top-[2.5rem] left-0 right-0 hidden h-px bg-zinc-200 md:block"
    aria-hidden
  />
  {processItems.map(([n, label, body]) => (
    <article key={label} className="relative">
      <p className="mb-3 font-heading text-5xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>
      ...
```

`top-[2.5rem]` posiziona la linea al centro verticale dei numeri decorativi `text-8xl`.

---
---

# FASE 6 — Sticky Mobile CTA Bar

**File:** nuovo `MobileQuoteCTA.tsx`, `MarketingShell.tsx`
**Stima:** 1.5–2 ore
**Quando farla:** dopo che Fasi 1–5 sono complete e testate

### Perché questa fase va fatta per ultima tra le priorità alte

Il consiglio esterno è corretto: la sticky CTA su mobile aumenta la conversione ma se inserita troppo presto nella road map rischia di mascherare problemi di layout (sezioni troppo alte, cards non linkate) invece di risolverli. Prima si sistemano le sezioni, poi si aggiunge il booster di conversione.

**Regola nascondimento vicino al footer:** la CTA deve scomparire quando l'utente raggiunge il footer — altrimenti duplica le CTA già presenti nel final CTA dark section e nel footer stesso.

```tsx
// apps/web/src/components/marketing/MobileQuoteCTA.tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function MobileQuoteCTA() {
  const [visible, setVisible] = useState(false)
  const footerRef = useRef<Element | null>(null)

  useEffect(() => {
    footerRef.current = document.querySelector('footer')

    const handler = () => {
      const scrolled = window.scrollY > 500
      const nearFooter = footerRef.current
        ? footerRef.current.getBoundingClientRect().top < window.innerHeight + 100
        : false
      setVisible(scrolled && !nearFooter)
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="px-4 pt-3">
        <Link
          href="/contact"
          className="inline-flex w-full min-h-[52px] items-center justify-center bg-[#9E000C] font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515]"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  )
}
```

```tsx
// In MarketingShell.tsx o nel layout marketing:
import { MobileQuoteCTA } from './MobileQuoteCTA'

// Nel JSX aggiungere il componente e padding bottom per il contenuto:
export function MarketingShell({ children, pathname }: MarketingShellProps) {
  return (
    <>
      <SiteHeader pathname={pathname} />
      <main id="main-content" className="pb-20 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MobileQuoteCTA />
    </>
  )
}
```

`pb-20 lg:pb-0` aggiunge padding bottom al main su mobile per compensare lo spazio occupato dalla sticky bar, così l'ultimo contenuto non viene nascosto sotto di essa. Su desktop `pb-0` annulla il padding (la CTA non esiste a `lg`).

---
---

# FASE 7 — Image Management

**File:** `public/images/`, `page.tsx`, `HomeWeldingHero.tsx`
**Stima:** 30–60 min per immagine
**Dipendenze:** asset disponibili dal cliente

### Perché questa fase richiede attenzione

Le immagini reali rendono la homepage credibile — è uno dei cambiamenti più impattanti che si possa fare. Ma vanno gestite correttamente su 4 dimensioni:

1. **Performance:** immagini non ottimizzate rallentano il LCP (Largest Contentful Paint) su mobile — il fattore di ranking SEO più importante per velocità.
2. **Privacy e permessi:** foto di cantieri, abitazioni private o persone richiedono esplicita autorizzazione prima di essere pubblicate. Questo non è discrezionale.
3. **`unoptimized` flag:** alcune immagini potrebbero avere `unoptimized={true}` che disabilita l'ottimizzazione automatica Next.js. Va rimosso dopo aver verificato la compatibilità formato.
4. **Nomi semantici:** `DSC_00123.jpg` non comunica nulla. `modern-gate-residential-surrey.jpg` aiuta SEO e manutenzione.

---

### 7.1 — Conversione WebP/AVIF

**Opzione A (manuale):** usare Squoosh (squoosh.app) o ImageMagick localmente:
```bash
# Convertire tutte le JPG in WebP mantenendo gli originali
for f in apps/web/public/images/*.jpg; do
  cwebp -q 82 "$f" -o "${f%.jpg}.webp"
done
```

**Opzione B (automatica):** Next.js con `next/image` converte automaticamente in WebP/AVIF se non si usa `unoptimized`. Basta rimuovere il flag e usare il componente correttamente.

---

### 7.2 — Rimuovere `unoptimized` dopo test

```tsx
// Se presente in qualche immagine:
// PRIMA
<Image src="..." alt="..." fill unoptimized />

// DOPO — rimuovere il flag, lasciare che Next.js ottimizzi
<Image src="..." alt="..." fill />
```

Testare che l'immagine venga servita correttamente prima di rimuovere il flag su tutte.

---

### 7.3 — Template `sizes` corretto per ogni immagine

Il `sizes` attribute dice al browser quale dimensione scaricare prima ancora di calcolare il layout. Se sbagliato, mobile scarica immagini da desktop.

```tsx
// Hero — full viewport sempre
<Image
  src="/images/home-welding.jpg"
  alt="Welding sparks during steel gate fabrication at Steelyes workshop"
  fill
  priority
  sizes="100vw"
  className="object-cover"
/>

// Gate card (3 colonne desktop, 1 colonna mobile)
<Image
  src="/images/gates/[nome].jpg"
  alt="[tipo gate] steel gate — [stile/contesto]"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>

// Gallery main image (2/3 larghezza desktop, full mobile)
<Image
  src="/images/gallery/[nome].jpg"
  alt="[descrizione installazione reale]"
  fill
  sizes="(max-width: 768px) 100vw, 66vw"
  className="object-cover"
/>

// Gallery panel square (1/3 larghezza desktop, full mobile)
<Image
  src="/images/gallery/[nome]-detail.jpg"
  alt="[dettaglio tecnico: tipo lavorazione, componente]"
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
```

---

### 7.4 — Checklist privacy per ogni immagine

Prima di pubblicare qualsiasi foto:

- [ ] La foto ritrae proprietà privata? → serve consenso scritto del proprietario
- [ ] La foto ritrae persone riconoscibili? → serve release fotografica firmata
- [ ] La foto è stata scattata da Steelyes direttamente? → ok
- [ ] La foto viene da fonte esterna (cliente, cantiere terzo)? → verificare diritti
- [ ] Il nome file contiene dati personali (indirizzi, nomi)? → rinominare

---

### 7.5 — Nomi file semantici

```
// DA
DSC_00123.jpg
IMG_4567_edit.png
WhatsApp_Image_2026.jpg

// A
modern-gate-residential-entrance.jpg
cantilever-gate-fabrication-detail.jpg
bifold-gate-powder-coated-anthracite.jpg
steelyes-workshop-welding-process.jpg
```

Formato consigliato: `[tipo]-[soggetto]-[contesto].webp`

---
---

# Summary Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1 — Accessibility + Touch Base            ~1–2h           │
│                                                                 │
│  • SiteHeader.tsx: aria-haspopup="menu"                        │
│  • SiteHeader.tsx: aria-expanded dinamico JS                   │
│  • SiteHeader.tsx: drawer 100dvh + overscroll-contain          │
│  • globals.css: touch-action: manipulation                     │
│                                                                 │
│  Blocca: SEO semantico, screen reader, Android tap latency     │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2 — Hero Mobile Fix                       ~1.5–2h         │
│                                                                 │
│  • HomeWeldingHero.tsx: min-h-[100svh]                         │
│  • HomeWeldingHero.tsx: H1 scala sm/md/lg                      │
│  • HomeWeldingHero.tsx: overlay alleggerito                     │
│  • HomeWeldingHero.tsx: overline ≠ H1                          │
│  • HomeWeldingHero.tsx: safe area landscape                    │
│                                                                 │
│  Blocca: prima impressione mobile, prodotto visibile           │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3 — Homepage Sections Fix                 ~3–4h           │
│                                                                 │
│  • page.tsx: capability strip font coerente                    │
│  • page.tsx: gate cards link + CTA + aspect-[3/2] mobile      │
│  • page.tsx: gate cards label text-xs                          │
│  • page.tsx: process numbers text-5xl mobile                   │
│  • page.tsx: configurator CTA full-width + disclaimer          │
│  • page.tsx: configurator survey-led text-4xl contrasto        │
│  • page.tsx: gallery grid cols-1 mobile + overlay bottom-left  │
│  • SiteFooter.tsx: rimuovere Contact duplicato                 │
│  • SiteFooter.tsx: text-zinc-400 contrasto                     │
│                                                                 │
│  Blocca: conversion path, leggibilità mobile, footer pulito    │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4 — Trust / Proof Section                 ~1h             │
│                                                                 │
│  • page.tsx: nuova section dopo capability strip               │
│    Survey-led / Made to order / Supply & install               │
│    divide-y mobile, divide-x desktop                           │
│                                                                 │
│  Blocca: credibilità prodotto high-ticket                      │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 5 — Process + Gallery Polish              ~45 min         │
│                                                                 │
│  • page.tsx: connettore orizzontale tra i 4 step desktop       │
│  • Già coperto da Fase 3: gallery overlay bottom-left          │
│                                                                 │
│  Blocca: polish visivo, coerenza design system                 │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 6 — Sticky Mobile CTA Bar                 ~1.5–2h         │
│                                                                 │
│  • nuovo MobileQuoteCTA.tsx                                    │
│  • Appare dopo 500px scroll, scompare vicino footer            │
│  • safe-area-inset-bottom per iPhone notch                     │
│  • MarketingShell.tsx: pb-20 mobile + import componente        │
│                                                                 │
│  Blocca: conversion booster mobile — va dopo layout fix        │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 7 — Image Management          ~30–60 min/img + verifica   │
│                                                                 │
│  • Verifica privacy e permessi PRIMA di pubblicare             │
│  • Conversione WebP o rimozione flag unoptimized               │
│  • sizes attribute corretto per ogni immagine                  │
│  • Nomi file semantici                                         │
│  • Alt text descrittivi e specifici                            │
│                                                                 │
│  Dipende: asset disponibili dal cliente                        │
└─────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTALE STIMATO: 10–13 ore di lavoro effettivo (esclusa Fase 7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Checklist Pre-Launch Completa

### Accessibility (WCAG 2.1 AA)
- [ ] `aria-haspopup="menu"` su tutti i dropdown header
- [ ] `aria-expanded` dinamico — non hardcoded
- [ ] Contrasto testo normale ≥4.5:1 ovunque
- [ ] Contrasto large text (≥18px bold) ≥3:1
- [ ] Skip link visibile su focus keyboard
- [ ] Touch targets ≥44px su tutti gli elementi interattivi
- [ ] `focus-visible` ring visibile su tutti i link/button
- [ ] Screen reader: alt text su tutte le immagini significative

### Mobile (test su 375px, 390px, 428px, 768px — portrait + landscape)
- [ ] Hero riempie schermo senza overflow (svh)
- [ ] Nessuno scroll orizzontale a nessun viewport
- [ ] Gate cards leggibili in single column con aspect-[3/2]
- [ ] Gallery non crasha a 375px (cols-1)
- [ ] Drawer usa dvh + overscroll-contain
- [ ] Safe area iOS rispettata (top + bottom + landscape laterale)
- [ ] Sticky CTA visibile dopo scroll, scompare prima del footer
- [ ] `touch-action: manipulation` attivo su link e button
- [ ] Process section non è eccessivamente alta su mobile
- [ ] Configurator CTA è full-width su mobile

### Conversion
- [ ] Gate cards cliccabili con CTA "Browse X gates"
- [ ] Proof section presente dopo capability strip
- [ ] Disclaimer configurator "Specification confirmed after survey"
- [ ] Nessun link duplicato nel footer
- [ ] Ogni sezione ha path verso azione successiva

### Content
- [ ] Overline hero ≠ prime parole H1
- [ ] Nessuna affermazione non verificata (no dati falsi)
- [ ] Nessun link a pagine inesistenti
- [ ] Overlay gallery in basso a sinistra (non centrato)

### Immagini
- [ ] Privacy verificata per ogni foto pubblicata
- [ ] Nessun `unoptimized` non necessario
- [ ] `sizes` attribute corretto per ogni `<Image>`
- [ ] Alt text descrittivi (non "gate image")
- [ ] Nomi file semantici

### Performance (Lighthouse mobile)
- [ ] LCP < 2.5s su mobile (3G simulato)
- [ ] CLS < 0.1 (no layout shift)
- [ ] INP < 200ms
- [ ] Font display swap attivo (gestito da Next.js fonts automaticamente)

---

## Viewport Test Matrix

| Viewport | Device | Sezioni da verificare |
|---|---|---|
| 375×667 | iPhone SE | hero height, card aspect ratio, gallery cols-1, sticky CTA |
| 390×844 | iPhone 14 | hero svh, drawer dvh, safe area bottom |
| 428×926 | iPhone 14 Plus | scala tipografica, process numbers |
| 390×844 landscape | iPhone 14 landscape | safe area laterale hero, header |
| 768×1024 | iPad portrait | drawer vs desktop nav breakpoint lg |
| 1024×768 | iPad landscape | desktop nav attivo, process connettore |
| 1280×800 | Desktop | layout completo, dropdown hover |
| 1440×900 | Desktop wide | max-w-7xl centrato |

---

*Generato da analisi ui-ux-pro-max + code review + revisione esterna — 2026-05-08*
*Aggiornare questo file marcando ogni fase completata.*
