/**
 * Client intake question catalog.
 * Labels/context in Italian for Marius; question_id stable for DB answers.
 */

export type IntakeAnswerStatus = 'proposed' | 'confirmed' | 'provisional' | 'missing'
export type IntakeAnswerSource = 'seed' | 'client' | 'admin'

export type IntakeInputType =
  | 'confirm' // confirm / correct / unsure — value is { choice, note? }
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'choice' // single radio among options

export type IntakeSectionId =
  | 'confirm_shared'
  | 'confirm_gates'
  | 'confirm_decorations'
  | 'open_pricing'
  | 'open_dimensions'
  | 'open_decorations'
  | 'open_composite'
  | 'open_fencing'
  | 'open_preview'
  | 'gate_double_swing'
  | 'gate_single_swing'
  | 'gate_tracked_sliding'
  | 'gate_cantilever_sliding'
  | 'gate_bifolding_double'
  | 'gate_single_bifolding'
  | 'gate_telescopic'
  | 'gate_radius'
  | 'launch'

export type IntakeQuestion = {
  id: string
  section: IntakeSectionId
  label: string
  /** Why we ask — shown under the label */
  context: string
  input: IntakeInputType
  options?: { value: string; label: string }[]
  placeholder?: string
  blocking?: boolean
  /** Seed shown as proposed for client to confirm */
  seed?: { value: unknown; status: IntakeAnswerStatus }
}

export type IntakeSection = {
  id: IntakeSectionId
  title: string
  intro: string
  phase: 'confirm' | 'open' | 'gate' | 'launch'
}

export const INTAKE_SECTIONS: IntakeSection[] = [
  {
    id: 'confirm_shared',
    title: 'Regole che abbiamo già',
    intro: 'Controlla queste regole commerciali. Conferma, correggi, o segnala se non sei sicuro.',
    phase: 'confirm',
  },
  {
    id: 'confirm_gates',
    title: 'Prezzi FROM per tipo di cancello',
    intro: 'Questi sono i prezzi base che ci hai dato. Confermali o correggi i numeri.',
    phase: 'confirm',
  },
  {
    id: 'confirm_decorations',
    title: 'Opzioni decorative già descritte',
    intro: 'Extra Victorian che abbiamo registrato. Conferma prezzi e significato.',
    phase: 'confirm',
  },
  {
    id: 'open_pricing',
    title: 'Prezzi ancora da chiarire',
    intro: 'Serve per aggiornare listino e preventivi senza inventare formule.',
    phase: 'open',
  },
  {
    id: 'open_dimensions',
    title: 'Cosa significano larghezza e altezza',
    intro: 'Decide cosa digita il cliente nel configuratore e come calcoliamo il prezzo.',
    phase: 'open',
  },
  {
    id: 'open_decorations',
    title: 'Catalogo decorazioni completo',
    intro: 'Senza varianti e formule di conteggio non possiamo chiudere listino e preview.',
    phase: 'open',
  },
  {
    id: 'open_composite',
    title: 'Composite Boards e finiture',
    intro: 'Stile privacy / pannelli chiusi: costruzione, colori, prezzi.',
    phase: 'open',
  },
  {
    id: 'open_fencing',
    title: 'Pannelli di recinzione',
    intro: 'Li hai chiesti nel brief: quantità, misure per pannello, stile abbinato al cancello.',
    phase: 'open',
  },
  {
    id: 'open_preview',
    title: 'Quanto deve sembrare reale la preview',
    intro: 'Allinea le aspettative sul 3D/2D (70/80% vs schema accettabile al lancio).',
    phase: 'open',
  },
  {
    id: 'gate_double_swing',
    title: 'Double Swing',
    intro: 'Battente a due ante — domande specifiche su misure e struttura.',
    phase: 'gate',
  },
  {
    id: 'gate_single_swing',
    title: 'Single Swing',
    intro: 'Battente a un’anta — lato cerniera/serratura e regole misure.',
    phase: 'gate',
  },
  {
    id: 'gate_tracked_sliding',
    title: 'Tracked Sliding',
    intro: 'Scorrevole su binario — binario, motore, spazio di apertura.',
    phase: 'gate',
  },
  {
    id: 'gate_cantilever_sliding',
    title: 'Cantilever Sliding',
    intro: 'Scorrevole a sbalzo — la coda (tail) è un dato bloccante per la preview.',
    phase: 'gate',
  },
  {
    id: 'gate_bifolding_double',
    title: 'Bifolding Double Swing',
    intro: 'Battente a libro doppio — come si piega e quanto spazio occupa aperto.',
    phase: 'gate',
  },
  {
    id: 'gate_single_bifolding',
    title: 'Single Bifolding',
    intro: 'A libro singolo — lato di raccolta e geometria di piega.',
    phase: 'gate',
  },
  {
    id: 'gate_telescopic',
    title: 'Telescopic Sliding',
    intro: 'Scorrevole telescopico — numero pannelli e ordine di sovrapposizione (oggi bloccato).',
    phase: 'gate',
  },
  {
    id: 'gate_radius',
    title: 'Radius Sliding',
    intro: 'Il meno definito: percorso curvo, solo cima arcuata, o entrambi?',
    phase: 'gate',
  },
  {
    id: 'launch',
    title: 'Dati per il lancio del sito',
    intro: 'Non bloccano il motore cancelli, ma servono per pubblicare il sito in modo ufficiale.',
    phase: 'launch',
  },
]

const CONFIRM_OPTIONS = [
  { value: 'confirm', label: 'Confermo' },
  { value: 'correct', label: 'Correggo (scrivi sotto)' },
  { value: 'unsure', label: 'Non sono sicuro' },
]

function gatePriceSeed(
  id: string,
  label: string,
  victorian: { h: string; w: string; auto: number; manual: number },
  composite: { auto: number; manual: number },
  note?: string,
): IntakeQuestion {
  return {
    id,
    section: 'confirm_gates',
    label,
    context:
      note ??
      `Victorian H ${victorian.h}, W ${victorian.w}. Auto FROM £${victorian.auto}, Manual FROM £${victorian.manual}. Composite Auto £${composite.auto} / Manual £${composite.manual}.`,
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: {
      status: 'proposed',
      value: {
        victorian_height_mm: victorian.h,
        victorian_width_mm: victorian.w,
        victorian_auto_gbp: victorian.auto,
        victorian_manual_gbp: victorian.manual,
        composite_auto_gbp: composite.auto,
        composite_manual_gbp: composite.manual,
        choice: null,
        note: '',
      },
    },
  }
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  // ── Confirm shared ──────────────────────────────────────────
  {
    id: 'shared.prices_are_from',
    section: 'confirm_shared',
    label: 'Tutti i prezzi sono “FROM GBP” (indicativi, non finali)',
    context:
      '“FROM” significa “a partire da”: è il prezzo base di listino, non il totale dopo misure extra, opzioni o sopralluogo. Marius l’ha scritto così nel messaggio sui cancelli.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, statement: true, note: '' } },
  },
  {
    id: 'shared.price_grows_with_size',
    section: 'confirm_shared',
    label: 'Se aumentano altezza o larghezza, il prezzo aumenta',
    context:
      'Nel messaggio: “Marind inaltimea si lungimea pretul creste”. Serve per la formula di rincaro dimensioni (ancora da dettagliare con gli step esatti).',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, statement: true, note: '' } },
  },
  {
    id: 'shared.price_grows_with_options',
    section: 'confirm_shared',
    label: 'Le opzioni decorative aumentano il prezzo',
    context:
      'Railheads, dog bars, arched top, cerchi, bushes, spirals, ecc. si sommano al FROM. Stesso messaggio Marius sulle opzioni Victorian.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, statement: true, note: '' } },
  },
  {
    id: 'shared.eight_gate_types',
    section: 'confirm_shared',
    label: 'Le 8 tipologie di cancello sono ancora tutte valide',
    context:
      'Double Swing, Single Swing, Tracked Sliding, Cantilever Sliding, Bifolding Double, Single Bifolding, Telescopic Sliding, Radius Sliding.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, statement: true, note: '' } },
  },
  {
    id: 'shared.two_styles',
    section: 'confirm_shared',
    label: 'Gli stili principali restano Traditional Victorian e Composite Boards',
    context: 'Il configuratore propone questi due infill/stili per ogni tipologia.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, statement: true, note: '' } },
  },

  // ── Confirm gates ───────────────────────────────────────────
  gatePriceSeed(
    'gate.double_swing.prices',
    'Double Swing — prezzi FROM',
    { h: '900/1000', w: '1800/1900', auto: 3800, manual: 1800 },
    { auto: 3800, manual: 1800 },
  ),
  gatePriceSeed(
    'gate.single_swing.prices',
    'Single Swing — prezzi FROM',
    { h: '900/1000', w: '800/900', auto: 2700, manual: 850 },
    { auto: 2700, manual: 750 },
    'Victorian Auto £2700 / Manual £850. Composite Auto £2700 / Manual £750. H 900/1000, W 800/900.',
  ),
  gatePriceSeed(
    'gate.tracked_sliding.prices',
    'Tracked Sliding — prezzi FROM',
    { h: '900/1000', w: '2500/2600', auto: 3600, manual: 2200 },
    { auto: 3600, manual: 2200 },
  ),
  gatePriceSeed(
    'gate.cantilever_sliding.prices',
    'Cantilever Sliding — prezzi FROM',
    { h: '900/1000', w: '2500/2600', auto: 4200, manual: 2900 },
    { auto: 4200, manual: 2900 },
  ),
  gatePriceSeed(
    'gate.bifolding_double.prices',
    'Bifolding Double Swing — prezzi FROM',
    { h: '900/1000', w: '2900/3000', auto: 4200, manual: 2500 },
    { auto: 4200, manual: 2500 },
  ),
  gatePriceSeed(
    'gate.single_bifolding.prices',
    'Single Bifolding — prezzi FROM',
    { h: '900/1000', w: '1500/1600', auto: 3000, manual: 1900 },
    { auto: 3000, manual: 1900 },
  ),
  gatePriceSeed(
    'gate.telescopic.prices',
    'Telescopic Sliding — prezzi FROM',
    { h: '900/1000', w: '2000/2100', auto: 4200, manual: 3100 },
    { auto: 4200, manual: 3100 },
  ),
  gatePriceSeed(
    'gate.radius.prices',
    'Radius Sliding — prezzi FROM',
    { h: '900/1000', w: '1600/1700', auto: 4200, manual: 2500 },
    { auto: 4200, manual: 2500 },
  ),

  // ── Confirm decorations ─────────────────────────────────────
  {
    id: 'deco.middle_bar',
    section: 'confirm_decorations',
    label: 'Middle bar — extra £275',
    context: 'Barra che divide il cancello in due parti in altezza.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, price_gbp: 275, note: '' } },
  },
  {
    id: 'deco.top_railheads_range',
    section: 'confirm_decorations',
    label: 'Railheads in cima — range esempio £1.25–£25 per pezzo',
    context: 'Il catalogo varianti esatto manca ancora; qui confermi solo che il range ha senso.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, min_gbp: 1.25, max_gbp: 25, note: '' } },
  },
  {
    id: 'deco.dog_bars',
    section: 'confirm_decorations',
    label: 'Dog bars (barre doppie in basso) — £75 + £4.50 per barra extra in larghezza',
    context: 'Serve capire se £75 è fisso e £4.50 è per barra o per incremento larghezza.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: {
      status: 'proposed',
      value: { choice: null, base_gbp: 75, extra_per_bar_gbp: 4.5, note: '' },
    },
  },
  {
    id: 'deco.dog_bar_railheads',
    section: 'confirm_decorations',
    label: 'Seconda fila di railheads sui dog bars — stesso listino della cima',
    context: 'Due file: cima + metà. Confermi che prezzi e varianti sono uguali?',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, same_as_top: true, note: '' } },
  },
  {
    id: 'deco.arched_top',
    section: 'confirm_decorations',
    label: 'Arched / curved top — extra £850, su ogni tipo di cancello',
    context: 'Cima curva invece di dritta.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, price_gbp: 850, all_gate_types: true, note: '' } },
  },
  {
    id: 'deco.circles',
    section: 'confirm_decorations',
    label: 'Cerchi tra le barre — barra extra £275 + cerchio £2.50 (conteggio con larghezza)',
    context: 'Manca ancora la formula esatta di quanti cerchi per mm di larghezza.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: {
      status: 'proposed',
      value: { choice: null, bar_gbp: 275, circle_gbp: 2.5, note: '' },
    },
  },
  {
    id: 'deco.bushes',
    section: 'confirm_decorations',
    label: 'Bushes — setup £90, pezzo da £2.50 a £12.50',
    context: 'Catalogo taglie/varianti ancora da chiudere.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: {
      status: 'proposed',
      value: { choice: null, setup_gbp: 90, min_gbp: 2.5, max_gbp: 12.5, note: '' },
    },
  },
  {
    id: 'deco.spirals',
    section: 'confirm_decorations',
    label: 'Spirals — da £3.80 a pezzo (minimo)',
    context: 'Varianti e regola di conteggio ancora aperte.',
    input: 'confirm',
    options: CONFIRM_OPTIONS,
    seed: { status: 'proposed', value: { choice: null, min_gbp: 3.8, note: '' } },
  },

  // ── Open pricing ────────────────────────────────────────────
  {
    id: 'open.prices_still_valid',
    section: 'open_pricing',
    label: 'I prezzi FROM elencati sopra sono ancora validi oggi?',
    context: 'Se sono cambiati, indica i nuovi valori nelle note delle sezioni cancello.',
    input: 'choice',
    options: [
      { value: 'yes', label: 'Sì, ancora validi' },
      { value: 'mostly', label: 'Quasi — alcuni da aggiornare (scrivi quali)' },
      { value: 'no', label: 'No, vanno rivisti' },
    ],
    blocking: true,
  },
  {
    id: 'open.prices_still_valid_note',
    section: 'open_pricing',
    label: 'Se alcuni prezzi sono cambiati, quali?',
    context: 'Elenco libero: tipo cancello + nuovo FROM.',
    input: 'textarea',
    placeholder: 'Es. Cantilever manual ora FROM 3100…',
  },
  {
    id: 'open.show_from_on_public',
    section: 'open_pricing',
    label: 'I prezzi FROM devono comparire anche sul sito pubblico, o solo nel configuratore?',
    context: 'Impatta marketing vs solo tool di preventivo.',
    input: 'choice',
    options: [
      { value: 'public_and_config', label: 'Sito pubblico + configuratore' },
      { value: 'config_only', label: 'Solo configuratore / preventivo' },
      { value: 'unsure', label: 'Non so ancora' },
    ],
  },
  {
    id: 'open.size_uplift_formula',
    section: 'open_pricing',
    label: 'Come aumenta il prezzo quando crescono larghezza/altezza?',
    context:
      'Esempio: ogni 100 mm di larghezza +£X, ogni 100 mm di altezza +£Y. Se non c’è tabella, descrivi la regola che usate in officina.',
    input: 'textarea',
    placeholder: 'Descrivi step e importi…',
    blocking: true,
  },

  // ── Open dimensions ─────────────────────────────────────────
  {
    id: 'open.width_meaning',
    section: 'open_dimensions',
    label: 'La larghezza digitata dal cliente cos’è?',
    context: 'Luce netta di passaggio, oppure misura totale incluso montanti/pilastri?',
    input: 'choice',
    options: [
      { value: 'clear_opening', label: 'Solo luce netta (apertura libera)' },
      { value: 'overall_with_posts', label: 'Misura totale con montanti/pilastri' },
      { value: 'depends', label: 'Dipende dal tipo di cancello (spiega sotto)' },
      { value: 'unsure', label: 'Non so / da definire' },
    ],
    blocking: true,
  },
  {
    id: 'open.width_meaning_note',
    section: 'open_dimensions',
    label: 'Note sulla larghezza (se “dipende” o eccezioni)',
    context: 'Es. cantilever = luce + coda, swing = luce tra pilastri…',
    input: 'textarea',
  },
  {
    id: 'open.height_meaning',
    section: 'open_dimensions',
    label: 'L’altezza digitata cos’è?',
    context: 'Solo corpo cancello, oppure include arco / railheads / finials?',
    input: 'choice',
    options: [
      { value: 'body_only', label: 'Solo corpo / telaio' },
      { value: 'includes_top_decor', label: 'Include cima decorativa / arco / finials' },
      { value: 'depends', label: 'Dipende (spiega sotto)' },
      { value: 'unsure', label: 'Non so / da definire' },
    ],
    blocking: true,
  },
  {
    id: 'open.height_meaning_note',
    section: 'open_dimensions',
    label: 'Note sull’altezza',
    context: '',
    input: 'textarea',
  },
  {
    id: 'open.dimension_bands',
    section: 'open_dimensions',
    label: 'I valori tipo 1800/1900 sono preset fissi o estremi di un range?',
    context: 'Decide se il cliente sceglie da lista o digita liberamente tra min e max.',
    input: 'choice',
    options: [
      { value: 'presets', label: 'Preset / taglie tipiche' },
      { value: 'range_min_max', label: 'Range continuo min→max' },
      { value: 'from_minimum', label: 'Sono il minimo FROM, poi si scala' },
      { value: 'unsure', label: 'Non so' },
    ],
    blocking: true,
  },

  // ── Open decorations catalog ────────────────────────────────
  {
    id: 'open.railhead_variants',
    section: 'open_decorations',
    label: 'Elenco varianti railhead ufficiali (nome + prezzo unitario)',
    context: 'Anche una foto/lista WhatsApp trascritta va bene. Senza questo il catalogo resta provvisorio.',
    input: 'textarea',
    placeholder: 'Es. Spear £1.25, Ball £3, Basket £25…',
    blocking: true,
  },
  {
    id: 'open.railhead_count_rule',
    section: 'open_decorations',
    label: 'Come si contano i railheads in base alla larghezza?',
    context: 'Es. uno ogni X mm, oppure N fissi per anta, ecc.',
    input: 'textarea',
    blocking: true,
  },
  {
    id: 'open.dog_bars_count_rule',
    section: 'open_decorations',
    label: 'Regola esatta per dog bars (£75 e £4.50)',
    context: '£4.50 è per ogni barra in più, per ogni 100 mm, o altro?',
    input: 'textarea',
  },
  {
    id: 'open.circles_count_rule',
    section: 'open_decorations',
    label: 'Formula conteggio cerchi in base alla larghezza',
    context: '',
    input: 'textarea',
  },
  {
    id: 'open.bushes_spirals_catalog',
    section: 'open_decorations',
    label: 'Varianti bushes/spirals (taglie + prezzi) e regola di conteggio',
    context: '',
    input: 'textarea',
  },
  {
    id: 'open.option_compatibility',
    section: 'open_decorations',
    label: 'Quali decorazioni non si possono mettere su certi tipi/stili?',
    context: 'Es. niente railheads su Composite, niente arched su telescopic…',
    input: 'textarea',
    blocking: true,
  },

  // ── Composite ───────────────────────────────────────────────
  {
    id: 'open.composite_same_price',
    section: 'open_composite',
    label: 'I prezzi Composite coincidono sempre col Victorian salvo dove indicato diversamente?',
    context: 'Nel brief spesso Auto/Manual coincidono; Single Swing manual no (£750 vs £850).',
    input: 'choice',
    options: [
      { value: 'yes', label: 'Sì, stessa regola' },
      { value: 'no', label: 'No, ci sono altre differenze' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'open.composite_build',
    section: 'open_composite',
    label: 'Come è costruito il pannello Composite? (spessore, rinforzi, aspetto)',
    context: 'Serve per preview e per non inventare geometrie sbagliate.',
    input: 'textarea',
  },
  {
    id: 'open.finish_palette',
    section: 'open_composite',
    label: 'Palette finiture/colori ufficiali (e se cambiano il prezzo)',
    context: 'Elenco RAL / nomi commerciali + eventuali moltiplicatori.',
    input: 'textarea',
    blocking: true,
  },

  // ── Fencing ─────────────────────────────────────────────────
  {
    id: 'open.fencing_pricing',
    section: 'open_fencing',
    label: 'Come si prezzano i pannelli di recinzione?',
    context: 'Per pannello, al metro, o formula altezza × lunghezza?',
    input: 'choice',
    options: [
      { value: 'per_panel', label: 'Prezzo per pannello' },
      { value: 'per_metre', label: 'Prezzo al metro lineare' },
      { value: 'formula', label: 'Formula altezza × lunghezza (spiega sotto)' },
      { value: 'unsure', label: 'Non ancora definito' },
    ],
    blocking: true,
  },
  {
    id: 'open.fencing_pricing_detail',
    section: 'open_fencing',
    label: 'Dettaglio prezzi / listino pannelli',
    context: 'Numeri concreti se li hai.',
    input: 'textarea',
  },
  {
    id: 'open.fencing_match_gate',
    section: 'open_fencing',
    label: 'Lo stile del pannello deve sempre abbinarsi al cancello scelto?',
    context: 'Nel brief: sì, idealmente almeno un pannello visibile accanto al cancello.',
    input: 'choice',
    options: [
      { value: 'always', label: 'Sempre abbinato' },
      { value: 'optional', label: 'Opzionale / cliente sceglie' },
      { value: 'unsure', label: 'Non so' },
    ],
  },

  // ── Preview ─────────────────────────────────────────────────
  {
    id: 'open.preview_fidelity',
    section: 'open_preview',
    label: 'Per il lancio, che livello di somiglianza accetti?',
    context: 'Hai chiesto ~70/80% sui railheads; possiamo partire schematici e migliorare dopo.',
    input: 'choice',
    options: [
      { value: 'schematic_ok', label: 'Schema tecnico ok al lancio' },
      { value: 'close_to_photo', label: 'Vicino alle foto (70/80%) obbligatorio' },
      { value: 'photo_exact', label: 'Deve sembrare la foto reale' },
    ],
  },
  {
    id: 'open.reference_photos',
    section: 'open_preview',
    label: 'Hai una foto ufficiale di riferimento per famiglia (Victorian / Composite / sliding)?',
    context: 'Indica quali usare come baseline, o “uso quelle già mandate”.',
    input: 'textarea',
  },

  // ── Per-gate ────────────────────────────────────────────────
  {
    id: 'gate.double_swing.width_includes_posts',
    section: 'gate_double_swing',
    label: 'Double Swing: la larghezza include i pilastri?',
    context: '',
    input: 'choice',
    options: [
      { value: 'clear_only', label: 'Solo luce tra pilastri' },
      { value: 'with_posts', label: 'Luce + pilastri' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.double_swing.arched_limits',
    section: 'gate_double_swing',
    label: 'Ci sono limiti di larghezza per l’arched top sul double swing?',
    context: '',
    input: 'textarea',
  },
  {
    id: 'gate.single_swing.default_handing',
    section: 'gate_single_swing',
    label: 'Single Swing: lato cerniera / serratura di default?',
    context: 'Es. cerniera a sinistra vista da fuori, serratura a destra.',
    input: 'textarea',
  },
  {
    id: 'gate.tracked.track_details',
    section: 'gate_tracked_sliding',
    label: 'Tracked: tipo di binario, posizione, e se il motore/rack devono vedersi in preview',
    context: '',
    input: 'textarea',
    blocking: true,
  },
  {
    id: 'gate.cantilever.tail_ratio',
    section: 'gate_cantilever_sliding',
    label: 'Cantilever: rapporto coda / luce (tail ratio) ufficiale',
    context:
      'Bloccante. Esempio industria ~1/3 della luce, o 28%. Senza questo la preview è inventata.',
    input: 'text',
    placeholder: 'Es. 33% della luce, oppure 800 mm fissi…',
    blocking: true,
  },
  {
    id: 'gate.cantilever.width_meaning',
    section: 'gate_cantilever_sliding',
    label: 'Cantilever: la larghezza nel configuratore è solo luce o luce + coda?',
    context: '',
    input: 'choice',
    options: [
      { value: 'clear_only', label: 'Solo luce di passaggio' },
      { value: 'clear_plus_tail', label: 'Luce + coda (assemblaggio totale)' },
      { value: 'unsure', label: 'Non so' },
    ],
    blocking: true,
  },
  {
    id: 'gate.bifold.panels_per_leaf',
    section: 'gate_bifolding_double',
    label: 'Bifold double: quanti pannelli per anta e come si piega?',
    context: '',
    input: 'textarea',
    blocking: true,
  },
  {
    id: 'gate.single_bifold.collection_side',
    section: 'gate_single_bifolding',
    label: 'Single bifold: lato di raccolta di default e rapporto di piega',
    context: '',
    input: 'textarea',
  },
  {
    id: 'gate.telescopic.panel_count',
    section: 'gate_telescopic',
    label: 'Telescopic: numero pannelli, ordine di sovrapposizione, stack aperto/chiuso',
    context: 'Senza questo la cinematica resta bloccata.',
    input: 'textarea',
    blocking: true,
  },
  {
    id: 'gate.radius.definition',
    section: 'gate_radius',
    label: 'Radius Sliding: cos’è esattamente il prodotto?',
    context: 'Percorso a terra curvo, solo profilo superiore arcuato, o entrambi?',
    input: 'choice',
    options: [
      { value: 'curved_path', label: 'Scorre su percorso curvo' },
      { value: 'curved_top_only', label: 'Scorrevole dritto con cima arcuata' },
      { value: 'both', label: 'Entrambi (percorso + cima)' },
      { value: 'defer', label: 'Rimandare / non mostrare al lancio' },
      { value: 'unsure', label: 'Da definire insieme' },
    ],
    blocking: true,
  },
  {
    id: 'gate.radius.definition_note',
    section: 'gate_radius',
    label: 'Dettagli aggiuntivi sul Radius Sliding',
    context: '',
    input: 'textarea',
  },

  // ── Launch ──────────────────────────────────────────────────
  {
    id: 'launch.company_legal',
    section: 'launch',
    label: 'Ragione sociale, company number, VAT (se pubblici sul sito)',
    context: '',
    input: 'textarea',
  },
  {
    id: 'launch.contact',
    section: 'launch',
    label: 'Email e telefono ufficiali da mostrare',
    context: '',
    input: 'textarea',
  },
  {
    id: 'launch.install_zones',
    section: 'launch',
    label: 'Zone di installazione / aree servite',
    context: '',
    input: 'textarea',
  },
  {
    id: 'launch.logo_assets',
    section: 'launch',
    label: 'Hai un logo SVG / file ufficiali da usare?',
    context: 'Se sì, come ce li mandi (Drive, email…)?',
    input: 'textarea',
  },
  {
    id: 'launch.photo_consent',
    section: 'launch',
    label: 'Le foto installazione possono andare in gallery pubblica?',
    context: 'Serve consenso esplicito prima del lancio gallery.',
    input: 'choice',
    options: [
      { value: 'yes', label: 'Sì, ok pubbliche' },
      { value: 'select', label: 'Solo alcune (indico quali)' },
      { value: 'no', label: 'No, non pubblicare' },
    ],
  },
]

export function getQuestionById(id: string): IntakeQuestion | undefined {
  return INTAKE_QUESTIONS.find((q) => q.id === id)
}

export function getQuestionsBySection(section: IntakeSectionId): IntakeQuestion[] {
  return INTAKE_QUESTIONS.filter((q) => q.section === section)
}

export function sectionMeta(id: IntakeSectionId): IntakeSection {
  const found = INTAKE_SECTIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown intake section: ${id}`)
  return found
}
