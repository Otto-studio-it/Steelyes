/**
 * Provenance of client-supplied product data (Marius / Steelyes).
 * Italian plain-language notes for admin + intake “Spiega meglio”.
 */

export type ProvenanceDoc = {
  id: string
  title: string
  /** Short label shown as chip */
  origin: string
  /** When / how we received it */
  receivedAs: string
  /** Plain Italian summary */
  summary: string
  /** Structured facts for display */
  facts: { label: string; value: string }[]
  /** Original / near-original wording (RO/EN as received) */
  originalExcerpt?: string
  /** Related intake question ids */
  questionIds: string[]
  relatedDocs?: string[]
}

export const PROVENANCE_META = {
  clientName: 'Marius (Steelyes)',
  primaryChannel: 'Messaggio WhatsApp / chat a Ruben',
  note: 'I prezzi sono FROM e Marius ha scritto che potrebbero ancora cambiare (“poate mai schimb ceva la preturi”).',
  companionFiles: [
    'docs/CLIENT_GATE_DATA_BRIEF.md',
    'docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md',
    'docs/frontend/gate-missing-data/*.pdf',
    'steelyes-listino-2026.pdf (generato / listino di lavoro)',
  ],
} as const

export const PROVENANCE_DOCS: ProvenanceDoc[] = [
  {
    id: 'rules.from_and_uplift',
    title: 'Regole commerciali comuni',
    origin: 'Messaggio Marius',
    receivedAs: 'Testo chat: “Astea sunt preturi FROM £…” + crescita con misure e opzioni',
    summary:
      'Tutti i listini base sono prezzi “FROM” (a partire da), non un totale finale garantito. Se aumentano altezza o larghezza il prezzo sale; salgono anche le opzioni decorative aggiunte dal cliente. Marius ha avvertito che qualche prezzo potrebbe ancora cambiare.',
    facts: [
      { label: 'Tipo prezzi', value: 'FROM GBP (indicativi)' },
      { label: 'Dimensioni', value: '↑ altezza / larghezza → ↑ prezzo' },
      { label: 'Opzioni', value: 'Ogni extra decorative aumenta il totale' },
      { label: 'Stabilità listino', value: 'Provvisorio — possibili revisioni' },
    ],
    originalExcerpt:
      'Astea sunt preturi FROM £…… Marind inaltimea si lungimea pretul creste….dar pretul mai cresce si pentru optiunile care clientul le adauga… Ruben…poate mai schimb ceva la preturi dar despre cam asa ceva este vorba cu portile…',
    questionIds: [
      'shared.prices_are_from',
      'shared.price_grows_with_size',
      'shared.price_grows_with_options',
      'open.prices_still_valid',
      'open.size_uplift_formula',
      'open.show_from_on_public',
    ],
  },
  {
    id: 'rules.commercial_gaps',
    title: 'Regole commerciali mai fornite',
    origin: 'Nessun messaggio — lacuna individuata da noi',
    receivedAs:
      'Non ricevuto: nei messaggi WhatsApp e nel listino non compaiono mai IVA, installazione, consegna, tempi, acconti o contenuto dell’automazione.',
    summary:
      'Queste domande non vengono da un messaggio di Marius: le facciamo noi perché senza risposta non possiamo scrivere preventivi corretti né promesse sul sito. Esempio: se i FROM fossero IVA esclusa, ogni prezzo mostrato oggi sarebbe sbagliato del 20%. La homepage in bozza promette “free survey”: va confermato o rimosso.',
    facts: [
      { label: 'IVA', value: 'Mai specificata nei listini ricevuti' },
      { label: 'Installazione', value: 'Non chiarito se il FROM è fornitura o fornitura+posa' },
      { label: 'Automazione', value: 'Solo prezzo Auto, mai il contenuto (motore, telecomandi…)' },
      { label: 'Consegna / tempi / acconto', value: 'Nessun dato ricevuto' },
    ],
    questionIds: [
      'open.vat_included',
      'open.from_includes_install',
      'open.survey_cost',
      'open.delivery_terms',
      'open.lead_time',
      'open.deposit_terms',
      'open.auto_includes',
      'open.finish_included',
      'open.fencing_panel_specs',
    ],
  },
  {
    id: 'catalog.gate_pdfs',
    title: 'PDF catalogo cancelli mandati a Marius (luglio 2026)',
    origin: 'Nostri PDF catalogo + Master Report',
    receivedAs:
      'Schede tecniche per le 8 tipologie generate da noi (docs/frontend/gate-missing-data) e inviate a Marius. Ogni scheda chiude con “Dati mancanti da chiarire col cliente”.',
    summary:
      'Ogni PDF conferma prezzi FROM e misura iniziale, ma segnala gli stessi buchi per tutte le famiglie: min/max e step reali delle dimensioni (oggi il configuratore accetta 600–6000 mm inventati), verso di apertura inward/outward per gli swing, guida superiore del tracked, fondazioni del cantilever, limiti dell’automazione. Le domande di questa fonte trasformano quelle liste in risposte.',
    facts: [
      { label: 'Min/max dimensioni', value: 'Mai definiti — solo misura iniziale per famiglia' },
      { label: 'Apertura inward/outward', value: 'Richiesta dai PDF swing, mai risposta' },
      { label: 'Guida superiore tracked', value: 'Citata come possibile, mai confermata' },
      { label: 'Fondazioni cantilever', value: 'Vincoli di posa mai definiti' },
      { label: 'Limiti automazione', value: 'Mai definiti' },
    ],
    questionIds: [
      'gate.double_swing.size_limits',
      'gate.double_swing.opening_direction',
      'gate.single_swing.size_limits',
      'gate.single_swing.opening_direction',
      'gate.tracked.size_limits',
      'gate.tracked.upper_guide',
      'gate.cantilever.size_limits',
      'gate.cantilever.foundation',
      'gate.bifold.size_limits',
      'gate.single_bifold.size_limits',
      'gate.telescopic.size_limits',
      'gate.radius.size_limits',
      'open.automation_limits',
    ],
  },
  {
    id: 'rules.engine_defaults',
    title: 'Valori inventati dal motore 3D — da confermare',
    origin: 'PDF audit interno + codice motore',
    receivedAs:
      'Non ricevuto da Marius: sono default scritti nel codice del configuratore analizzando le foto, in attesa dei dati veri di officina.',
    summary:
      'Il disegno 2D/3D oggi funziona con valori provvisori: 4 rail orizzontali, tubo 40×2,5 mm, barre verticali ogni 110 mm, proporzioni prese dalle foto. Le domande su struttura, luce da terra, binari, code e pieghe servono a sostituire questi numeri inventati con quelli reali — senza, la preview resta una stima e la cut list non è affidabile.',
    facts: [
      { label: 'Rail orizzontali', value: '4 (default codice, non confermato)' },
      { label: 'Tubo telaio', value: '40×2,5 mm (default codice)' },
      { label: 'Interasse picket', value: '110 mm (default codice)' },
      { label: 'Fonte completa', value: 'docs/frontend/gate-missing-data/*.pdf (audit per tipologia)' },
    ],
    questionIds: [
      'gate.double_swing.rail_structure',
      'gate.double_swing.picket_spacing',
      'gate.double_swing.ground_clearance',
      'gate.double_swing.center_detail',
      'gate.double_swing.deco_photo_mapping',
      'gate.double_swing.dog_bars_real',
      'gate.single_swing.reuse_double',
      'gate.tracked.track_run',
      'gate.tracked.deco_reuse',
      'gate.cantilever.carriage_guide',
      'gate.cantilever.support_visibility',
      'gate.bifold.fold_footprint',
      'gate.single_bifold.reuse_footprint',
      'gate.telescopic.width_rule',
      'gate.radius.preview_views',
      'open.posts_in_preview',
      'open.motor_in_preview',
    ],
  },
  {
    id: 'fencing.panels',
    title: 'Pannelli recinzione (railings)',
    origin: 'Messaggio Marius',
    receivedAs: 'Requisito configuratore, non listino numerico',
    summary:
      'Il cliente finale deve poter scegliere un numero totale di pannelli recinzione (es. 2). Ogni pannello ha altezza e lunghezza proprie. Idealmente in preview si vede almeno un pannello accanto al cancello, nello stesso stile.',
    facts: [
      { label: 'Quantità', value: 'Numero totale pannelli (es. 2)' },
      { label: 'Per pannello', value: 'height + length' },
      { label: 'Preview', value: 'Almeno 1 pannello visibile, match stile cancello' },
      { label: 'Prezzo pannelli', value: 'Non fornito nel messaggio — ancora da chiudere' },
    ],
    originalExcerpt:
      'clientul sa aiba o optiune sa adauge un numar total de panouri pentru garduri. Railings panels X NR….deci sa aleaga de exemplu 2 panouri si fiecare panou sa aiba height si length….daca se poate si vedea pe langa poarta macar 1 panou ar fi super sa match the gate!',
    questionIds: [
      'open.fencing_pricing',
      'open.fencing_pricing_detail',
      'open.fencing_match_gate',
    ],
  },
  {
    id: 'gate.double_swing',
    title: 'Double Swing — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Listino tipizzato Victorian + Composite',
    summary:
      'Battente a due ante. Misure tipiche Victorian H 900/1000, W 1800/1900. Auto e Manual uguali tra Victorian e Composite in questo messaggio.',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '1800/1900 mm' },
      { label: 'Victorian Auto / Manual', value: '£3800 / £1800' },
      { label: 'Composite Auto / Manual', value: '£3800 / £1800' },
    ],
    originalExcerpt:
      'Double swing gates from high 900/1000 and width 1800/1900 traditional Victorian style Price from: Automated £3800 Manual £1800. Same with composite boards…',
    questionIds: ['gate.double_swing.prices', 'gate.double_swing.width_includes_posts', 'gate.double_swing.arched_limits'],
  },
  {
    id: 'gate.single_swing',
    title: 'Single Swing — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Listino tipizzato; Manual Composite diverso da Victorian',
    summary:
      'Battente singolo, aperture più strette / pedonali. Unico caso nel messaggio in cui Composite Manual (£750) differisce da Victorian Manual (£850).',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '800/900 mm' },
      { label: 'Victorian Auto / Manual', value: '£2700 / £850' },
      { label: 'Composite Auto / Manual', value: '£2700 / £750' },
    ],
    originalExcerpt:
      'Single swing gate traditional Victorian style from height 900/1000mm and width 800/900mm Automatic £2700 Manual £850. Same with composite… Manual £750',
    questionIds: ['gate.single_swing.prices', 'gate.single_swing.default_handing', 'open.composite_same_price'],
  },
  {
    id: 'gate.tracked_sliding',
    title: 'Tracked Sliding — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Scritto “Trucked sliding” → interpretato Tracked Sliding',
    summary:
      'Scorrevole su binario. Victorian e Composite con gli stessi FROM nel messaggio.',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '2500/2600 mm' },
      { label: 'Auto / Manual', value: '£3600 / £2200 (Victorian e Composite)' },
      { label: 'Nota naming', value: '“Trucked” = Tracked' },
    ],
    originalExcerpt:
      'Trucked sliding gate from height 900/1000mm and width 2500/2600mm Victorian traditional style Automatic £3600 Manual £2200',
    questionIds: ['gate.tracked_sliding.prices', 'gate.tracked.track_details'],
  },
  {
    id: 'gate.cantilever',
    title: 'Cantilever Sliding — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Scritto “Cantilivered”',
    summary:
      'Scorrevole a sbalzo (senza binario in luce). Stessi FROM Victorian/Composite. La geometria della coda (tail) non è nel messaggio — resta domanda bloccante.',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '2500/2600 mm' },
      { label: 'Auto / Manual', value: '£4200 / £2900' },
    ],
    originalExcerpt:
      'Cantilivered sliding gates from height of 900/1000mm and width 2500/2600mm automated tradition Victorian style £4200 Manual £2900…',
    questionIds: [
      'gate.cantilever_sliding.prices',
      'gate.cantilever.tail_ratio',
      'gate.cantilever.width_meaning',
    ],
  },
  {
    id: 'gate.bifold_double',
    title: 'Bifolding Double Swing — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Minimum height + width band',
    summary: 'Battente a libro doppio. Stessi FROM Victorian/Composite.',
    facts: [
      { label: 'Altezza min', value: '900/1000 mm' },
      { label: 'Larghezza', value: '2900/3000 mm' },
      { label: 'Auto / Manual', value: '£4200 / £2500' },
    ],
    questionIds: ['gate.bifolding_double.prices', 'gate.bifold.panels_per_leaf'],
  },
  {
    id: 'gate.single_bifold',
    title: 'Single Bifolding — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Minimum height + width band',
    summary: 'A libro singolo. Stessi FROM Victorian/Composite.',
    facts: [
      { label: 'Altezza min', value: '900/1000 mm' },
      { label: 'Larghezza', value: '1500/1600 mm' },
      { label: 'Auto / Manual', value: '£3000 / £1900' },
    ],
    questionIds: ['gate.single_bifolding.prices', 'gate.single_bifold.collection_side'],
  },
  {
    id: 'gate.telescopic',
    title: 'Telescopic Sliding — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Starting height + width',
    summary:
      'Scorrevole telescopico multi-pannello. Prezzi dati; numero pannelli e ordine di sovrapposizione non descritti — cinematica ancora aperta.',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '2000/2100 mm' },
      { label: 'Auto / Manual', value: '£4200 / £3100' },
    ],
    questionIds: ['gate.telescopic.prices', 'gate.telescopic.panel_count'],
  },
  {
    id: 'gate.radius',
    title: 'Radius Sliding — prezzi FROM',
    origin: 'Messaggio Marius',
    receivedAs: 'Width + height Victorian / Composite',
    summary:
      'Prezzi presenti, ma la definizione del prodotto (percorso curvo vs solo cima arcuata) non è nel messaggio — resta bloccante.',
    facts: [
      { label: 'Altezza', value: '900/1000 mm' },
      { label: 'Larghezza', value: '1600/1700 mm' },
      { label: 'Auto / Manual', value: '£4200 / £2500' },
    ],
    questionIds: ['gate.radius.prices', 'gate.radius.definition', 'gate.radius.definition_note'],
  },
  {
    id: 'deco.middle_bar',
    title: 'Opzione: Middle bar (bara mijlocie)',
    origin: 'Messaggio Marius — Victorian Metal',
    receivedAs: 'Extra fisso',
    summary:
      'Barra orizzontale che divide il cancello in due parti in altezza. Extra fisso £275.',
    facts: [{ label: 'Prezzo', value: '£275' }],
    originalExcerpt: 'Bara mijlocie care separa poarta pe lungime in 2 parti £275',
    questionIds: ['deco.middle_bar'],
  },
  {
    id: 'deco.railheads',
    title: 'Opzione: Railheads (capuri) in cima',
    origin: 'Messaggio Marius — Victorian Metal',
    receivedAs: 'Range esempio, catalogo non chiuso',
    summary:
      'Punte / finials solo in cima. Il prezzo dipende dalla variante: esempio da £1.25 a £25 pezzo. Marius vuole somiglianza ~70/80% rispetto alle foto. Catalogo ufficiale ancora da chiudere.',
    facts: [
      { label: 'Range esempio', value: '£1.25 – £25 / pezzo' },
      { label: 'Target visuale', value: '~70/80% come in foto' },
      { label: 'Catalogo', value: 'Non elencato nel messaggio' },
    ],
    originalExcerpt:
      'Capuri (railheads) pe poarta doar sus £….gen one railhead poate sa coste £25 si altul £1.25….si daca fiecare cap poate sa apara pe poarta sa zicem chiar si 70/80% de cum este in poza…',
    questionIds: [
      'deco.top_railheads_range',
      'open.railhead_variants',
      'open.railhead_count_rule',
      'open.preview_fidelity',
      'open.reference_photos',
    ],
  },
  {
    id: 'deco.dog_bars',
    title: 'Opzione: Dog bars (bari duble jos)',
    origin: 'Messaggio Marius — Victorian Metal',
    receivedAs: 'Base + extra per larghezza',
    summary:
      'Doppie barre in basso. Extra standard FROM £75; poi ogni barra in più allargando costa £4.50. La regola esatta di conteggio va ancora confermata.',
    facts: [
      { label: 'Base', value: 'FROM £75' },
      { label: 'Extra', value: '£4.50 per barra aumentando la larghezza' },
    ],
    originalExcerpt:
      'bari duble in partea de jos al porti care se numesc “DOG BARS”…. Extra £….from standard £75 si apoi fiecare bara marind largimea extra £4.50',
    questionIds: ['deco.dog_bars', 'open.dog_bars_count_rule'],
  },
  {
    id: 'deco.dog_bar_railheads',
    title: 'Opzione: Railheads anche sui dog bars',
    origin: 'Messaggio Marius',
    receivedAs: 'Stessa logica dei railheads in cima',
    summary:
      'Due file di railheads: cima + metà (sui dog bars). Stesso listino e stessa logica dei railheads superiori.',
    facts: [{ label: 'Regola', value: 'Identica ai railheads top' }],
    originalExcerpt:
      'Daca vor si railheads pe DOG BARS…adica 2 randuri de railheads, si deasupra porti si la mijloc functionaza exact ca la railheads de sus, deci identic.',
    questionIds: ['deco.dog_bar_railheads'],
  },
  {
    id: 'deco.arched_top',
    title: 'Opzione: Arched top (bolta / cima curva)',
    origin: 'Messaggio Marius',
    receivedAs: 'Extra uguale per ogni tipo di cancello',
    summary:
      'Cima curva invece di dritta (“bolta”). Extra £850, stessa cifra per tutte le tipologie di cancello nel messaggio.',
    facts: [
      { label: 'Prezzo', value: '£850' },
      { label: 'Ambito', value: 'Ogni tipo di cancello' },
    ],
    originalExcerpt:
      'poarta sa aiba o “bolta” adica partea de Sus sa nu fie dreapta, dar curvata…optiunea asta este pentru fiecare poarta la fel….extra £850',
    questionIds: ['deco.arched_top'],
  },
  {
    id: 'deco.circles',
    title: 'Opzione: Cerchi tra barre verticali',
    origin: 'Messaggio Marius + foto inviate',
    receivedAs: 'Barra extra + pezzo cerchio',
    summary:
      'Cerchi tra le barre (visibili in molte foto). Serve 1 barra orizzontale in più (£275) + £2.50 per cerchio; il numero cresce con la larghezza. Formula di conteggio ancora aperta.',
    facts: [
      { label: 'Barra extra', value: '£275' },
      { label: 'Cerchio', value: '£2.50 / pezzo' },
      { label: 'Quantità', value: 'Cresce con la larghezza' },
    ],
    originalExcerpt:
      'cercuri intre barile verticale…necesita de 1 bara in plus…£275 plus valoarea cercului…£2.50 si va creste numarul in functie de latimea porti',
    questionIds: ['deco.circles', 'open.circles_count_rule'],
  },
  {
    id: 'deco.bushes_spirals',
    title: 'Opzione: Bushes e Spirals',
    origin: 'Messaggio Marius',
    receivedAs: 'Setup + prezzi unitari min/max',
    summary:
      'Decorazioni sulle barre verticali. Bushes: setup £90, pezzo da £2.50 a £12.50. Spirals: minimo £3.80. Dettaglio catalogo ancora da definire insieme.',
    facts: [
      { label: 'Bushes setup', value: '£90' },
      { label: 'Bush unitario', value: '£2.50 – £12.50' },
      { label: 'Spiral minimo', value: '£3.80' },
    ],
    originalExcerpt:
      'BUSHES sau SPIRALS…Pret extra standard de £90 si apoi fiecare BUSH…minim £2.50…mai mari £12.50….spirals minim pret £3.80.',
    questionIds: ['deco.bushes', 'deco.spirals', 'open.bushes_spirals_catalog'],
  },
  {
    id: 'meta.followup',
    title: 'Disponibilità chiarimenti',
    origin: 'Messaggio Marius (chiusura)',
    receivedAs: 'Impegno a rispondere a follow-up',
    summary:
      'Marius si è reso disponibile a chiarire punti aperti (“contacteazama… iti clarific”). Questo intake esiste proprio per raccogliere quelle risposte in modo ordinato.',
    facts: [{ label: 'Stato', value: 'Aperto a domande di follow-up' }],
    originalExcerpt:
      'In legatura cu or si ce contacteazama si mai repede sau putin mai tarziu imi fac timp si iti clarific…',
    questionIds: [],
  },
]

const byQuestion = new Map<string, ProvenanceDoc[]>()
for (const doc of PROVENANCE_DOCS) {
  for (const qid of doc.questionIds) {
    const list = byQuestion.get(qid) ?? []
    list.push(doc)
    byQuestion.set(qid, list)
  }
}

export function getProvenanceForQuestion(questionId: string): ProvenanceDoc[] {
  return byQuestion.get(questionId) ?? []
}

/** Plain Italian “Spiega meglio” text built from provenance + question fields. */
export function buildPlainExplanation(input: {
  questionId: string
  label: string
  context: string
}): string {
  const docs = getProvenanceForQuestion(input.questionId)
  const parts: string[] = []

  parts.push(`Domanda: ${input.label}`)
  if (input.context.trim()) {
    parts.push(`Perché te la chiediamo: ${input.context.trim()}`)
  }

  if (docs.length === 0) {
    parts.push(
      'Origine: questa domanda chiude un dettaglio tecnico non ancora scritto nel messaggio di Marius. Se non sei sicuro, scegli “Non so / provvisorio” e lascia una nota.',
    )
    return parts.join('\n\n')
  }

  for (const doc of docs) {
    parts.push(`Origine — ${doc.title}`)
    parts.push(`Fonte: ${doc.origin}. ${doc.receivedAs}.`)
    parts.push(doc.summary)
    if (doc.facts.length > 0) {
      parts.push(doc.facts.map((f) => `• ${f.label}: ${f.value}`).join('\n'))
    }
  }

  parts.push(
    'Se qualcosa non combacia più con la realtà di officina, scegli “Correggo” o “Non sono sicuro” e scrivi la nota: aggiorniamo il configuratore di conseguenza.',
  )

  return parts.join('\n\n')
}
