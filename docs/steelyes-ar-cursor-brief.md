# Steelyes AR — Brief SUPER dettagliato per Cursor (+ handoff post-deploy)

**Data:** 2026-09-21 (Europe/Rome)  
**Repo:** https://github.com/Otto-studio-it/Steelyes  
**Base branch (live oggi):** `main` — il branch `cursor/workshop-quote-pdf-attachment-ef1c` è **già mergiato**. Non branchare da quello.  
**Inventario:** `docs/steelyes-3d-phone-view-inventory.md` (leggi prima).  
**Regola:** questo documento è **specifica**. Implementazione UI P0 solo quando Ruben dice di partire. Ops (Grok Bot) interviene dopo merge/deploy.

---

## Decisioni prodotto LOCKED (non riaprire in P0)

| Decisione | Scelta | Perché |
|-----------|--------|--------|
| Testo bottone | **View in your space** (EN) | Allineato al resto del configurator (EN, heading uppercase). Copy in un solo file constants. |
| Railheads / cilindri | **Non disegnare finials in P0.** Non aggiungere cilindri placeholder. | `railheads.ts` è già no-op (catalogue-only). Cilindri fake ≠ fedeltà workshop. Foto SKU = Ticket B. |
| QR desktop | **No in P0** | Phase A / ADR: copy iPhone USDZ + Android GLB. QR = Ticket D. |
| Dove montare il CTA | **Solo in `PreviewCanvas`** | Share + mobile sheet già usano `PreviewCanvas`. Un secondo mount in `QuoteShareView` duplica il bottone. |
| Analytics | `captureConfiguratorEvent` esistente | PostHog produzione è uno stub no-op. Non aggiungere SDK. |
| TTL | Già **1h** (`AR_MODEL_TTL_SECONDS`) | Non “~15 min” (doc Phase A stantio). |
| Upload | **Due POST** raw + `x-ar-format` | Non multipart. Non un unico body inventato. |

---

## 0. Contesto (leggi prima di toccare codice)

### Cosa vuole il business

Il cliente configura un cancello reale (tipo, mm, stile, finish, pali, opzioni, railheads a catalogo). Oggi vede solo disegno 2D SVG. Deve poterlo aprire sul telefono in AR nativa (misure vere in millimetri), non un cancello generico.

### Cosa esiste GIÀ (NON reinventare)

Pipeline completa mesh/export/API — vedi inventory. `ViewInYourSpace.tsx` **non esiste**. `PHASE_A_AR_VIEW_IN_SPACE.md` elenca quel file come se fosse già scritto: è falso.

### Cosa MANCA (il lavoro)

UI cliente: componente bottone + wiring sotto la preview 2D. Nessun WebXR — Quick Look (iOS) e Scene Viewer (Android) via `ar-handoff.ts`.

### Cosa NON fare in v1

- Texture PBR powder-coat fotorealistiche
- Mattone/malta sui pali
- Motore/cerniere CAD dettagliate
- Sostituire Quick Look/Scene Viewer con WebXR
- Tipi “fiction” (telescopic/radius) come AR marketing
- Cambiare Coolify / env / DB
- Riscrivere `packages/gate-engine` mesh
- Toccare `next.config.mjs` externals `@resvg/resvg-js` / `sharp`
- Attivare PostHog vero / secondo analytics stack

### Constraint prodotti noti

- Next.js 14, monorepo pnpm/turbo, `@steelyes/gate-engine`
- Coolify: mai staging e production in parallelo (ops, non Cursor)
- Lingua UI: EN

---

## 1. Obiettivo P0 (Definition of Done)

Un utente su telefono o desktop:

1. Apre `/configurator` oppure `/quote/{token}`.
2. Vede **View in your space** sotto la preview 2D (non al posto del 2D).
3. Tap → loading → snapshot `GateConfig` al click → `exportGateArModel(snapshot)` → **due** `POST /api/ar/models` (glb, usdz).
4. Handoff:
   - **iOS Safari:** `<a rel="ar" href={buildQuickLookHref(usdzUrl)}>` (content scaling off).
   - **Android Chrome:** `buildSceneViewerIntentHref(glbUrl)` (`resizable=false`).
   - **Desktop:** Copy iPhone link (USDZ) / Copy Android link (GLB) / Download GLB / Download USDZ. Nessun QR.
5. Larghezza/altezza in AR = mm del config (metro a nastro su **double_swing Victorian**, es. 1800×1000).
6. Errori: rete, `phoneReachable === false`, 410 expired → messaggio + Retry.
7. Nessuna regressione: quote/email/PDF, 2D preview, build Coolify.

**Fuori DoD P0:** railheads fotorealistici, badge “approximate” (Ticket C), QR/email/PDF/analytics dashboard (Ticket D).

---

## 2. Ticket A — Implementazione UI (PASSO-PASSO)

### A.1 Nuovo componente

**Crea:** `apps/web/src/components/configurator/ViewInYourSpace.tsx`  
**Crea:** `apps/web/src/lib/configurator/ar/ar-ui-copy.ts` (unico file copy)

```ts
export const AR_UI_COPY = {
  button: 'View in your space',
  preparing: 'Preparing your gate in 3D…',
  uploading: 'Uploading 3D model…',
  openIos: 'Open in AR (iPhone)',
  openAndroid: 'Open in AR (Android)',
  downloadGlb: 'Download GLB',
  downloadUsdz: 'Download USDZ',
  copyIphone: 'Copy iPhone link',
  copyAndroid: 'Copy Android link',
  copied: 'Copied',
  errorGeneric: 'We couldn’t prepare the 3D view. Please try again.',
  unsupported: 'AR works best in Safari on iPhone or Chrome on Android.',
  expired: 'This 3D link expired. Generate a new one.',
  retry: 'Try again',
  privateOrigin:
    'This link is on a private address. Open the public site on your phone, then tap again.',
} as const
```

**Props:**

```ts
type ViewInYourSpaceProps = {
  config: GateConfig
  disabled?: boolean
  className?: string
}
```

Non serve `placement` se il mount è uno solo. Se vuoi analytics surface:

```ts
placement?: 'preview' | 'share' // default 'preview'; passalo solo se un parent lo sa
```

`QuoteShareView` può passare `placement="share"` **senza** montare un secondo bottone — meglio: `PreviewCanvas` accetta `arPlacement?: 'preview' | 'share'` e lo inoltra. Share page setta `arPlacement="share"`.

**Stati interni:**

| State | UI |
|-------|-----|
| `idle` | Bottone secondario (bordo steel, come Download PDF / action bar outline) |
| `exporting` | Spinner + `preparing`, `aria-busy`, bottone disabled |
| `uploading` | Spinner + `uploading` (stesso panel, non full-page modal) |
| `ready` | Azioni iOS / Android / desktop + `formatArExpiryLabel(expiresAt)` (tick 1s) |
| `error` | Messaggio + Retry |

**Flusso click (obbligatorio):**

1. `const snapshot = structuredClone(config)` — non rileggere lo store durante export.
2. `const { exportGateArModel } = await import('@/lib/configurator/ar/export-gate-ar-model')` — lazy, così Three.js non entra nel bundle 2D iniziale (ADR 002).
3. `const exported = await exportGateArModel(snapshot)`.
4. Upload **due** volte (parallel ok):

```ts
async function uploadArModel(blob: Blob, format: 'glb' | 'usdz') {
  const res = await fetch('/api/ar/models', {
    method: 'POST',
    headers: { 'x-ar-format': format },
    body: blob,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Upload failed (${res.status})`)
  }
  return res.json() as Promise<{
    id: string
    format: string
    url: string
    expiresAt: number
    expiresInSeconds: number
    phoneReachable: boolean
  }>
}
```

5. `exported.revoke()` in `finally` dopo upload (object URL locali non servono al telefono).
6. Costruisci href con `buildQuickLookHref`, `buildSceneViewerIntentHref`, `buildSceneViewerHttpsHref`.
7. UA detection **semplice e onesta** (non over-engineer):
   - iOS: `/iPad|iPhone|iPod/` o iPadOS (`Macintosh` + `maxTouchPoints > 1`)
   - Android: `/Android/`
   - else desktop panel
8. Se `phoneReachable === false`, mostra `privateOrigin` (dev/localhost). Non fingere che Quick Look funzioni.

**iOS markup (Quick Look richiede `<a rel="ar">`):**

```tsx
<a
  rel="ar"
  href={quickLookHref}
  className="…stessi token bottone primario…"
>
  {/* optional: <img> first child is Apple-recommended; not required if it fights design system */}
  {AR_UI_COPY.openIos}
</a>
```

**Android:**

```tsx
<a href={sceneViewerIntentHref}>{AR_UI_COPY.openAndroid}</a>
```

**Desktop ready panel:** Copy iPhone / Copy Android / Download GLB / Download USDZ. Download può usare gli URL HTTPS pubblici (stesso `url` API), non i blob locali dopo revoke.

**Accessibilità:**

- `type="button"` sul CTA (non submit).
- `disabled` + `aria-busy` durante export/upload.
- `role="status"` per preparing.
- `role="alert"` per error.
- Hit target ≥ 44px. Non bloccare la pagina con modal full-screen obbligatorio.
- Stile: riusa classi esistenti (`font-heading text-sm font-bold uppercase tracking-tight`, `min-h-[44px]` / `48px`, `border-steel/12`, `bg-primary` solo sull’azione AR nativa ready).

**Analytics (stub):**

```ts
captureConfiguratorEvent('ar_button_tapped', { placement })
captureConfiguratorEvent('ar_export_succeeded', { fidelity, gateType: snapshot.gateType })
captureConfiguratorEvent('ar_export_failed', { reason })
captureConfiguratorEvent('ar_handoff_shown', { platform: 'ios' | 'android' | 'desktop' })
```

Import: `@/lib/analytics/posthog`.

**Unit test (nuovo, piccolo):**  
`apps/web/src/lib/configurator/ar/upload-ar-models.ts` — estrai upload + pairing expiresAt (`Math.min(glb.expiresAt, usdz.expiresAt)`) se aiuta i test. Non obbligatorio se il fetch resta nel componente e i test handoff già coprono gli URL.

### A.2 Wiring `PreviewCanvas`

**Modifica:** `apps/web/src/components/configurator/PreviewCanvas.tsx`

Sotto il blocco `canvas` (2D), **dentro** il wrapper `return`, **fuori** dal dialog fullscreen:

```tsx
<ViewInYourSpace config={config} placement={arPlacement} disabled={arDisabled} />
```

- Nuova prop opzionale `arPlacement?: 'preview' | 'share'` default `'preview'`.
- Nuova prop opzionale `arDisabled?: boolean` (default false). Non disabilitare solo perché lo store ha warning di validazione — un config shareable è già valido. Disabilita solo se manca un config usable (non dovrebbe accadere).
- Non nascondere il 2D.
- Non mettere il CTA dentro il dialog fullscreen 2D.

### A.3 Wiring quote share — **non duplicare**

**Modifica:** `apps/web/src/components/configurator/QuoteShareView.tsx`

Solo:

```tsx
<PreviewCanvas config={config} arPlacement="share" />
```

**Non** aggiungere un secondo `<ViewInYourSpace>` vicino a Request quote / PDF. Il visitatore readonly ha già il config da token; lo stesso snapshot va all’export.

`MobilePreviewSheet` non va toccato se monta già `PreviewCanvas`.

### A.4 API / store — solo se bug

Non riscrivere lo store. Verifica (read-only in PR notes):

- GET ha CORS `*`
- 410 su expiry
- `Cache-Control: private, max-age=60` — se Safari cache-a un 410, aggiungi **solo allora** `?t={expiresAt}` o `cache-bust` sulla URL handoff. Non cambiare cache header “per sicurezza” senza evidenza.

Se Quick Look fallisce su MIME, non cambiare Content-Type: è già `model/vnd.usdz+zip` / `model/gltf-binary`.

### A.5 Copy

Vedi `AR_UI_COPY`. Se in futuro IT: solo quel file.

### A.6 Test da documentare in PR

**Manuale (obbligatorio nel body PR):**

| # | Caso | Atteso |
|---|------|--------|
| 1 | Configurator: `double_swing` Victorian 1800×1000 Black satin → AR | Larghezza ~1800 mm (metro). Non pinch-resize (scale lock). |
| 2 | Cambia finish → nuovo tap | Colore base aggiornato (non texture). |
| 3 | `/quote/{token}` senza login | Stesso CTA, export funziona. |
| 4 | Desktop | Download GLB apre (viewer o file valido). Copy link. |
| 5 | Expiry | 410 / countdown 0 → messaggio + retry genera nuovi id. |
| 6 | Mobile Safari / Chrome | Quick Look / Scene Viewer; se solo desktop in CI, dillo. |

**Automatizzati:**

- Esistenti: `ar-handoff.test.ts` — devono restare verdi.
- Non obbligare E2E AR device in CI.

**Comandi (da root, dopo `pnpm` se serve):**

```bash
pnpm exec vitest run apps/web/src/lib/configurator/ar/ar-handoff.test.ts
# o lo script test del package web, se presente
```

Non lanciare una rewrite della CI.

### A.7 PR / branch

- Branch: `cursor/ar-view-in-your-space-ui-5b83` (o il template agent `cursor/ar-view-in-your-space-ui` se non in cloud).
- Base: **`main`**
- Title: `feat(configurator): View in your space AR handoff UI`
- Body: cita questo brief + inventory + matrice manuale.
- **Non mergeare da soli** se serve review umana.

---

## 3. Ticket B — P1 Fedeltà Victorian (dopo P0 live)

Solo dopo P0 deployato e validato sul telefono.

- Mappa SKU railhead → geometria in `railheads.ts` (oggi no-op, non “cilindri”).
- Input workshop: foto/SKU (RH…).
- Collars / dog bars come cue se options on.
- Post caps: pyramid / ball / flat se non già nel mesh plan.
- DoD: Victorian swing riconoscibile vs schematic; foto vs AR side-by-side.

## 4. Ticket C — P2 Schematic honesty

- Badge UI “Approximate 3D preview” quando `exported.fidelity === 'schematic'` (o `plan.fidelity`). Può usare `exported.notes`.
- Boards / track cue — polish mesh, non UI-only se serve geometria.

## 5. Ticket D — P3 Discoverability + analytics

- PDF / email: riga “Open on your phone to view in AR” + link `/quote/{token}`.
- PostHog vero + dashboard (oggi stub).
- QR desktop opzionale nel panel `ready`.

---

## 6. Cancello del cliente vs generico (acceptance)

| Aspetto | Deve essere vero in P0 | Migliorabile dopo |
|---------|------------------------|-------------------|
| widthMm / heightMm | Sì, scala bloccata | — |
| gateType layout (1/2 ante, sliding) | Sì | — |
| style Victorian tube count | Sì se `workshop` | — |
| finish color | Sì (hex base) | Texture powder coat |
| options arched/collars/dog_bars | Posizione se già nel mesh | Geometria fine |
| railheads | **Assenti in 3D** (onesti) | Ticket B foto |
| posts presence | Sì | Mattone |
| motorised handle | Se già nel mesh plan | Housing motore |

---

## 7. Handoff ops — DOPO PR pronta

Ruben a Grok Bot: **«AR UI pronto, deploya»**.

1. Confermare commit; diff non tocca resvg/PDF.
2. Coolify: staging only → healthy → smoke `/healthz`, `/configurator`, Network `POST /api/ar/models` ×2 → poi prod **stesso commit**. Mai parallelo.
3. Retest iPhone Quick Look, Android Scene Viewer, quote/email.
4. Report PASS/FAIL + gap vs prodotto vero (B/C/D).

---

## 8. Checklist Ruben

**Prima del via Cursor (P0):**

- [x] Label EN: View in your space
- [x] P0 senza cilindri railhead (catalogue resta in quote)
- [x] QR no
- [x] Base = `main`

**Dopo PR:**

- [ ] Review UI staging
- [ ] «AR UI pronto, deploya»
- [ ] Quote / info@ non rotti

---

## 9. Prompt copia-incolla per Cursor Agent (quando Ruben dice PARTI)

```
Implement Steelyes P0 AR UI only, per docs/steelyes-ar-cursor-brief.md
and docs/steelyes-3d-phone-view-inventory.md.

Repo: Otto-studio-it/Steelyes
Base branch: main

DO:
- Add ViewInYourSpace.tsx + ar-ui-copy.ts
- Wire ONLY into PreviewCanvas (pass arPlacement="share" from QuoteShareView)
- Reuse exportGateArModel, ar-handoff, POST /api/ar/models (raw body + x-ar-format, TWO uploads)
- Snapshot GateConfig on click; lazy-import export; iOS Quick Look + Android Scene Viewer + desktop copy/download
- captureConfiguratorEvent only (do not add PostHog SDK)
- PR with manual test matrix; keep ar-handoff tests green
- Do not merge without human review

DO NOT:
- Rewrite mesh engine or railheads.ts
- Add placeholder railhead cylinders
- Add WebXR or desktop QR
- Change Coolify/env/next.config externals
- Photoreal textures
- Duplicate the CTA in QuoteShareView action column
```

---

## 10. Rischi noti

| Rischio | Mitigazione |
|---------|-------------|
| Export lento su mobile | Progress UI; lazy-load Three solo al tap |
| Safari cache modello | Cache-bust solo se riprodotto |
| CORS Quick Look | Già su GET; non riscrivere |
| Config cambia durante export | `structuredClone` al click |
| Build Coolify | Non toccare externals resvg |
| Scene Viewer HTTPS only | Origin pubblico da `resolvePublicOrigin` |
| Store single-instance | Ops: un replica Coolify; multi-node = S3 dopo |
| Due POST, un fail | Se uno fallisce: error + retry entrambi; non handoff parziale iOS-senza-USDZ |
| Bundle Three nel 2D | Dynamic `import()` |

---

## Fine

Cursor = UI P0 come sopra.  
Ops = deploy sequenziale + verifica live + roadmap B/C/D dopo dati reali.
