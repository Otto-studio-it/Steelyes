# Steelyes — Roadmap Pre-Launch
> Analisi: 2026-05-09 | Branch: feat/header-footer-navigation

---

## Stato del documento

Questa roadmap resta valida come riferimento operativo, ma va letta con quattro regole:

1. Non tutto quello che manca ha la stessa priorita'. I task vanno separati tra `launch blocker`, `foundation`, `improvement` e `client dependency`.
2. Alcuni fix mobile documentati altrove sono gia' stati implementati nel codice. Non vanno rimessi nella lista come se fossero ancora aperti.
3. Le sezioni che toccano dati aziendali, legali, foto di proprieta' private e consenso cookie non sono semplici contenuti: sono temi di compliance.
4. Dove esiste gia' documentazione piu' dettagliata in `docs/frontend/UI_UX_ROADMAP.md`, quel file resta il riferimento di dettaglio per la UI. Questo documento serve come roadmap di esecuzione pre-launch.

---

## PARTE A — SEO

### A1. Sitemap
**Perché:** Google non può crawlare le pagine sistematicamente. Senza sitemap, pagine come `/services/security` o `/gates/bifold` potrebbero non essere indicizzate.

**File da creare:** `apps/web/src/app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://steelyes.co.uk'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/gates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/gates/sliding`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gates/cantilever`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gates/bifold`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gates/pedestrian`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gates/telescopic`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gates/architectural`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services/railings`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/services/balconies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/services/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/installation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/case-study`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]
}
```

---

### A2. Robots.txt
**Perché:** Admin panel (`/admin/*`) non deve essere indicizzato. Attualmente Google può crawlarlo.

**File da creare:** `apps/web/src/app/robots.ts`

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: 'https://steelyes.co.uk/sitemap.xml',
  }
}
```

---

### A3. OpenGraph Image (default)
**Perché:** Ogni link condiviso su WhatsApp, LinkedIn, Facebook senza OG image appare senza preview — zero impatto visivo.

**File da creare:** `apps/web/src/app/opengraph-image.png`
- Dimensioni: 1200×630px
- Contenuto suggerito: foto cancello scura + logo "STEELYES LTD" + tagline
- Alternativa code-gen: creare `apps/web/src/app/opengraph-image.tsx` con `ImageResponse`

**File da aggiornare:** `apps/web/src/app/layout.tsx`
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://steelyes.co.uk'), // ← aggiungere
  openGraph: {
    siteName: 'Steelyes Ltd',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

---

### A4. Root Layout — Description migliorata
**File:** `apps/web/src/app/layout.tsx` (riga 23-26)

**Perché:** Description attuale `"Bespoke steel gates engineered for reliability."` è troppo corta (41 chars), senza keyword locali, senza call-to-action.

**Sostituire con:**
```ts
export const metadata: Metadata = {
  title: {
    default: 'Steelyes | Bespoke Steel Gates London & UK',
    template: '%s | Steelyes',
  },
  description:
    'Steelyes fabricates bespoke steel driveway gates, railings, balconies and security doors across London and the UK. Survey-led specification, supply and install.',
}
```

---

### A5. Metadata pagine mancanti

**Perché:** 7 pagine senza `metadata` export = titoli generici in Google, nessun controllo su snippet.

#### `/gates/page.tsx` — aggiungere in cima:
```ts
export const metadata: Metadata = {
  title: 'Bespoke Steel Gates | Driveway, Sliding & Automated | Steelyes',
  description:
    'Made-to-measure steel driveway, sliding, bifold, pedestrian and cantilever gates. Surveyed and installed across London and the UK.',
}
```

#### `/services/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'Steel Fabrication Services | Railings, Balconies & Security | Steelyes',
  description:
    'Bespoke steelwork beyond gates — railings, balustrades, structural balconies and security doors fabricated and installed to survey-led specification.',
}
```

#### `/gallery/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'Project Gallery | Installed Steel Gates & Steelwork | Steelyes',
  description:
    'A collection of completed Steelyes commissions — driveway gates, railings, balconies and security installations across the UK.',
}
```

#### `/about/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'About Steelyes | British Steel Fabrication & Engineering',
  description:
    'Steelyes is a British steel fabrication specialist. Bespoke gates, railings and structural steelwork designed and built around each site and brief.',
}
```

#### `/contact/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'Contact Steelyes | Request a Quote for Steel Gates & Fabrication',
  description:
    'Get in touch with the Steelyes workshop. Share measurements, photos or a rough brief to start your survey-led specification and quote.',
}
```

#### `/installation/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'Installation Process | Steel Gate Supply & Install | Steelyes',
  description:
    'Steelyes handles the full installation path — on-site survey, fabrication, delivery and fitting. Nationwide coverage across the UK.',
}
```

#### `/case-study/page.tsx`
```ts
export const metadata: Metadata = {
  title: 'Case Studies | Steel Gate & Fabrication Projects | Steelyes',
  description:
    'In-depth project case studies from the Steelyes workshop. Real installations with process notes, site challenges and finished results.',
}
```

---

### A6. JSON-LD LocalBusiness
**Perché:** Google usa structured data per local pack (Google Maps), rich results, knowledge panel. Pero' qui i dati aziendali devono essere veri e confermati: se address, email o telefono sono placeholder, il markup diventa un falso segnale di trust.

**File da creare:** `apps/web/src/components/marketing/LocalBusinessSchema.tsx`
```tsx
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Steelyes Ltd',
    description: 'Bespoke steel gate fabrication and installation across London and the UK.',
    url: 'https://steelyes.co.uk',
    telephone: '+44-114-234-5678', // ← VERIFICARE con Marius
    email: 'forge@steelyes.co.uk', // ← VERIFICARE con Marius
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 4, Vulcan Works', // ← VERIFICARE con Marius
      addressLocality: 'Sheffield',
      postalCode: 'S1 4ST',
      addressCountry: 'GB',
    },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    knowsAbout: ['Steel gates', 'Driveway gates', 'Steel railings', 'Steel balconies'],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

**File da aggiornare:** `apps/web/src/app/layout.tsx` — importare e aggiungere `<LocalBusinessSchema />` nel `<body>`.

**Ordine corretto:**
1. Confermare indirizzo, tel, email e area servita
2. Aggiungere il componente schema
3. Validare il markup nei rich results test prima del go-live

> ⚠️ BLOCCO: non pubblicare `LocalBusiness` finche' indirizzo, tel ed email non sono confermati da Marius.

---

### A7. Canonical URL
**Perché:** Evita contenuto duplicato se il sito è accessibile sia con `www` che senza.

**File:** `apps/web/src/app/layout.tsx`
```ts
alternates: {
  canonical: 'https://steelyes.co.uk',
},
```
Nelle pagine singole, Next.js inferisce il canonical automaticamente se `metadataBase` è impostato (step A4).

---

## PARTE B — UI / FOTO / CONTENUTO

### B1. /gates — Sostituire 6 MediaPlaceholder con foto reali
**File:** `apps/web/src/app/(marketing)/gates/page.tsx`

**Perché:** L'intera pagina prodotto principale ha zero foto reali. Su mobile è una colonna di grigi vuoti. Impatto conversioni altissimo.

**Mapping foto disponibili → card:**
| Card | Foto da usare |
|------|---------------|
| Sliding Gates | `/images/gates/sliding-gate-anthracite-residential.jpg` |
| Bifold Gates | `/images/gates/sliding-gate-classic-ornate-tudor.jpg` |
| Cantilever Gates | `/images/gates/sliding-gate-spear-finials.jpg` |
| Pedestrian Gates | `/images/gates/pedestrian-gate-ornate-brick.jpg` |
| Telescopic Gates | `/images/gates/sliding-gate-automated-open.jpg` |
| Architectural Gates | `/images/gates/classic-ornate-driveway-gate-arch.jpg` |

**Cosa fare:** Importare `Image` da `next/image`, rimuovere `MediaPlaceholder`, aggiungere un campo `image` e `imageAlt` in `GATE_DISPLAY`, sostituire il blocco `<MediaPlaceholder>` con `<Image fill ... />`.

---

### B2. /services — Sostituire hero e workshop placeholder
**File:** `apps/web/src/app/(marketing)/services/page.tsx`

**Perché:** Hero completamente buio su mobile (sfondo `#111111` + `MediaPlaceholder`). Prima impressione della pagina servizi è un rettangolo nero vuoto.

**Cosa fare:**
- Hero: usare `/images/home/home-welding.jpg` (foto welding workshop) — aggiungere `<Image fill priority />` come nella pagina installation
- Bottom workshop placeholder (riga ~117): usare `/images/home/steelwork-finial-detail.jpg` o `/images/home/modern-perforated-gate-detail.jpg`

---

### B3. /about — Sostituire 3 MediaPlaceholder + scrivere copy reale
**File:** `apps/web/src/app/(marketing)/about/page.tsx`

**Perché:** La pagina about ha testo letteralmente `"Placeholder copy..."` visibile e tre blocchi grigi dove dovrebbero esserci foto del workshop.

**Foto:**
- Workshop image 1: `/images/home/home-welding.jpg`
- Workshop image 2: `/images/home/steelwork-finial-detail.jpg`
- Fabrication close-up: `/images/home/modern-perforated-gate-detail.jpg`

**Copy da scrivere (in attesa da Marius):**
- Sezione "The workshop ethos" — paragrafo descrittivo reale
- 3 card "What defines our craft" (No catalogue compromises / Engineering-first / Clean geometric language) — testo 2-3 righe ciascuna
- Sezione split-layout "Built for London, designed to endure" — paragrafo reale

> ⚠️ BLOCCO: copy da approvare con cliente prima di pubblicare.

---

### B4. /installation — Scrivere copy reale per le 3 card
**File:** `apps/web/src/app/(marketing)/installation/page.tsx`

**Perché:** "On-site measurement", "Structural alignment", "Full handover" hanno tutte `"Approved section structure with placeholder copy."`.

**Cosa scrivere:**
- On-site measurement: processo survey, laser measure, verifica substrate
- Structural alignment: set-out, fixing points, tolleranze
- Full handover: commissioning, test automation, documentazione consegnata

---

### B5. /contact — Dati reali + Google Maps embed
**File:** `apps/web/src/app/(marketing)/contact/page.tsx`

**Perché:** Map placeholder = rettangolo grigio. Indirizzo/tel/email sono probabilmente placeholder.

**Da fare:**
1. Verificare con Marius: indirizzo, tel, email
2. Sostituire `MediaPlaceholder` con Google Maps embed (iframe) o immagine statica del luogo
3. Wiring del form → vedere B8

---

### B6. Foto inutilizzate — integrare in pagine
**Perché:** Foto professionali in archivio ma non mostrate all'utente.

| Foto | Dove usarla |
|------|-------------|
| `/images/balconies/balcony-steel-structure.jpg` | `/services/balconies` — seconda immagine nella sezione capabilities |
| `/images/components/component-finial-acorn.jpg` + altri 4 | `/gates/[style]` — sezione dettagli componenti, o pagina `/gates` index come dettaglio decorativo |
| `/images/home/hero-modern-driveway-gate.jpg` | Verificare se usata in HomeWeldingHero o disponibile |
| `/images/railings/railings-ornate-bronze-driveway.jpg` | `/services/railings` — usarla anche qui |

---

### B7. Navigation — Aggiungere Balconies e Security al menu Services
**File:** `apps/web/src/components/marketing/SiteHeader.tsx` (riga 34-38)

**Perché:** Le pagine `/services/balconies` e `/services/security` esistono ma non sono raggiungibili dal menu principale. Utente su mobile non le trova.

**Aggiungere a `SERVICE_LINKS`:**
```ts
const SERVICE_LINKS: NavLink[] = [
  { label: 'Services Overview', href: '/services' },
  { label: 'Railings', href: '/services/railings' },
  { label: 'Balconies', href: '/services/balconies' },   // ← mancante
  { label: 'Security', href: '/services/security' },      // ← mancante
]
```

**Stessa modifica** in `apps/web/src/components/marketing/SiteFooter.tsx` (riga 13-18).

---

### B8. /contact — Wiring form server action
**File:** `apps/web/src/app/(marketing)/contact/page.tsx`

**Perché:** Il form non invia nulla. `<button type="button">` — non e' nemmeno `type="submit"`. Ogni lead viene perso. Inoltre il requisito reale non e' "far partire una mail": il `Definition of Done` richiede un flusso completo, protetto e verificabile.

**Cosa fare:**
1. Definire il flusso target: submit -> validazione server -> salvataggio -> notifica admin -> conferma utente
2. Aggiungere protezione anti-spam: Turnstile invisible, honeypot, rate limit
3. Creare una server action o route handler con validazione server-side
4. Salvare il lead in DB, non solo inviare email
5. Inviare email a admin e, se confermato, email di ricevuta all'utente
6. Collegare il `<form action={...}>`, cambiare il bottone in `type="submit"` e mostrare loading/success/error
7. Testare il flusso su staging con casi validi e invalidi

**Decisioni da prendere prima di implementare:**
- Resend come provider email
- tabella DB di destinazione e shape minima del lead
- testo email admin e utente

> ⚠️ Questo task e' un `launch blocker` reale. Non va trattato come semplice polish.

---

### B9. Mobile — min-h-dvh
**File:** `apps/web/src/components/marketing/MarketingShell.tsx` (riga 14)

**Perché:** `min-h-screen` = `100vh`. Su iOS Safari con address bar visibile, `100vh` puo' risultare piu' grande della viewport visibile. Questo fix ha senso nel shell globale, ma va distinto dai fix mobile gia' chiusi altrove.

```tsx
// prima
<div className="min-h-screen bg-[#FBF9F6] text-[#1B1C1A]">

// dopo
<div className="min-h-dvh bg-[#FBF9F6] text-[#1B1C1A]">
```

**Nota di stato:**
- Hero homepage: gia' corretto con `100svh`
- Drawer mobile header: gia' corretto con `100dvh`
- Shell marketing: ancora da correggere

---

### B10. Home — Mostrare foto nel process section su mobile
**File:** `apps/web/src/app/(marketing)/page.tsx` (riga 282)

**Perché:** Il blocco destro del process (foto + stat box) è `hidden lg:flex`. Su mobile l'intera sezione "The Process" è solo testo + lista — zero visual break. La sezione appare lunga e monotona.

**Cosa fare:** Aggiungere una singola immagine visibile solo su mobile (tra il processo e il CTA link), es:
```tsx
<div className="relative aspect-[4/3] overflow-hidden lg:hidden">
  <Image src="/images/home/modern-perforated-gate-detail.jpg" alt="..." fill className="object-cover" />
</div>
```

---

### B11. Performance — Rimuovere `unoptimized` da tutti gli Image
**Perché:** `unoptimized` bypassa completamente Next.js image optimization. Niente WebP, niente srcset, niente quality compression. Le immagini JPEG originali vengono servite raw → pagine più lente, bandwidth sprecata, Core Web Vitals peggiori.

**Prima di toccare qualsiasi file, verificare la lista completa:**
```bash
grep -r "unoptimized" apps/web/src/app --include="*.tsx" -l
```

**File noti con `unoptimized`** (lista potrebbe essere incompleta — usare grep sopra):
- `apps/web/src/app/(marketing)/page.tsx` (7 immagini)
- `apps/web/src/app/(marketing)/gallery/page.tsx` (10 immagini)
- `apps/web/src/app/(marketing)/installation/page.tsx`
- `apps/web/src/app/(marketing)/services/page.tsx`
- `apps/web/src/app/(marketing)/services/balconies/page.tsx`
- `apps/web/src/app/(marketing)/services/railings/page.tsx`
- `apps/web/src/app/(marketing)/services/security/page.tsx`
- `apps/web/src/app/(marketing)/gates/[style]/page.tsx`

**Rimuovere** `unoptimized` da tutti i componenti `<Image>`.

**Aggiungere** in `apps/web/next.config.ts`:
```ts
images: {
  formats: ['image/avif', 'image/webp'],
}
```

---

### B12. Gallery filters — implementare logica o rimuovere
**File:** `apps/web/src/app/(marketing)/gallery/page.tsx` (riga 36-44)

**Perché:** I bottoni "Cantilever", "Bifold", ecc. sono visivi ma non funzionano. Utente che clicca e non vede nulla = frustrazione.

**Opzioni:**
- Implementare filtro JS: aggiungere `useState(activeFilter)`, filtrare `GALLERY_ITEMS` per categoria, aggiungere campo `category` ai dati
- Oppure rimuovere i filtri e lasciare solo la griglia pulita finché non ci sono abbastanza foto per categoria

---

### B13. Compliance — pagine legali + CMP
**File:** 
- `apps/web/src/app/(marketing)/legal/privacy-policy/page.tsx`
- `apps/web/src/app/(marketing)/legal/cookie-policy/page.tsx`
- `apps/web/src/app/(marketing)/legal/terms/page.tsx`
- integrazione CMP da definire

**Perché:** Le pagine legali oggi espongono testo placeholder. In piu' il `Definition of Done` richiede un consent manager attivo. Questo non e' SEO cosmetico: e' un requisito di trust, compliance e go-live.

**Cosa fare:**
1. Sostituire il testo placeholder con contenuti legali reali approvati
2. Definire e integrare la CMP prevista per il progetto
3. Verificare che la cookie policy rifletta gli script realmente caricati
4. Collegare la CMP al caricamento dei cookie non essenziali

> ⚠️ Se il sito va live senza questi elementi, non e' un problema di "pagina incompleta": e' un problema di conformita'.

---

## RIEPILOGO — Ordine corretto di esecuzione

### P0 — Launch blockers
1. [ ] Contact form end-to-end vero, con protezioni e persistenza (B8)
2. [ ] Pagine legali reali: privacy, cookie, terms (B13)
3. [ ] CMP / cookie consent manager attivo (B13)
4. [ ] Dati contatto reali verificati prima di pubblicare contact page e schema (B5, A6)
5. [ ] Verifica uso foto private e consenso, oppure sostituzione con immagini workshop dove necessario

### P1 — SEO foundation
6. [ ] `sitemap.ts` (A1)
7. [ ] `robots.ts` (A2)
8. [ ] `layout.tsx` — `metadataBase`, title template, description, canonical base, OG/Twitter base (A3, A4, A7)
9. [ ] Metadata per le pagine marketing mancanti (A5)
10. [ ] `opengraph-image` default (A3)
11. [ ] `LocalBusiness` schema solo dopo conferma dati reali (A6)

### P2 — Trust visivo e contenuto
12. [ ] `/gates` index — 6 card con foto reali (B1)
13. [ ] `/services` hero + workshop image (B2)
14. [ ] `/about` — sostituire i 3 placeholder visuali (B3)
15. [ ] `/contact` — rimuovere map placeholder e usare mappa reale o immagine reale (B5)
16. [ ] Nav: aggiungere Balconies + Security nel menu Services (B7)
17. [ ] Copy reale per `/about` e `/installation` dopo approvazione cliente (B3, B4)

### P3 — Mobile e performance polish
18. [ ] `MarketingShell` — `min-h-dvh` (B9)
19. [ ] Home process section — una foto visibile anche su mobile (B10)
20. [ ] Rimuovere `unoptimized` e riallineare `next/image` (B11)
21. [ ] Gallery filters: implementare davvero o rimuovere (B12)

---

## File che NON vanno toccati
- `SiteHeader.tsx` — la base accessibilita'/drawer e' gia' migliorata; qui toccare solo i link servizi se serve (B7)
- `SiteFooter.tsx` — solo aggiungere links (B7)
- `MobileQuoteCTA.tsx` — funziona correttamente, non toccare
- Design system (colori, font, spacing) — approvato e locked
- Admin pages — fuori scope

---

## Dipendenze bloccanti (cliente / compliance)
- Logo SVG vettoriale (fallback attuale: wordmark text — non finale)
- Indirizzo fisico reale
- Numero telefono reale
- Email contatto reale
- Company number / VAT se previsti nel footer legale
- Copy approvato per `/about` e `/installation`
- Testi legali reali: privacy, cookie, terms
- Decisione form stack: provider email, DB, copy notifiche
- Verifica consenso foto per proprieta' private gia' visibili
- OG image finale: asset/design da approvare
