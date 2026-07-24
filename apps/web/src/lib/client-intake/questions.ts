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
  | 'open_commercial'
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
    id: 'open_commercial',
    title: 'Installazione, IVA, consegna e pagamenti',
    intro:
      'Regole commerciali mai chiarite nei messaggi: decidono cosa promette il sito e cosa scriviamo nei preventivi.',
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
  {
    id: 'open.size_uplift_scope',
    section: 'open_pricing',
    label: 'La regola di rincaro misure è la stessa per tutte le 8 tipologie?',
    context:
      'Un cantilever più largo costa più di uno swing più largo? Se la regola cambia per tipo, indica quali differiscono.',
    input: 'choice',
    options: [
      { value: 'same_all', label: 'Stessa regola per tutti' },
      { value: 'differs', label: 'Cambia per tipo (scrivi sopra quali)' },
      { value: 'unsure', label: 'Non so' },
    ],
  },

  // ── Open commercial (installazione, IVA, consegna, pagamenti) ──
  {
    id: 'open.vat_included',
    section: 'open_commercial',
    label: 'I prezzi FROM sono IVA inclusa o esclusa?',
    context:
      'Nei messaggi WhatsApp i prezzi (es. Double Swing Auto £3800) non dicono mai se includono VAT 20%. Serve per ogni prezzo mostrato sul sito e sui preventivi: sbagliare qui significa mostrare tutti i prezzi sbagliati del 20%.',
    input: 'choice',
    options: [
      { value: 'inc_vat', label: 'IVA inclusa (prezzo finale consumatore)' },
      { value: 'ex_vat', label: 'IVA esclusa (+20% da aggiungere)' },
      { value: 'unsure', label: 'Non so / dipende dal cliente' },
    ],
    blocking: true,
  },
  {
    id: 'open.from_includes_install',
    section: 'open_commercial',
    label: 'Il prezzo FROM include l’installazione / posa in opera?',
    context:
      'Mai chiarito nel listino WhatsApp. Decide se il configuratore mostra “fornitura e posa” o “solo cancello”; cambia anche il testo dei preventivi PDF.',
    input: 'choice',
    options: [
      { value: 'includes_install', label: 'Sì, fornitura + posa inclusa' },
      { value: 'supply_only', label: 'No, solo fornitura (posa a parte)' },
      { value: 'depends', label: 'Dipende (spiega sotto)' },
    ],
    blocking: true,
  },
  {
    id: 'open.survey_cost',
    section: 'open_commercial',
    label: 'Il sopralluogo (survey) è gratuito o a pagamento?',
    context:
      'Il sito in bozza promette “free survey” nella trust bar della homepage: va confermato prima del lancio, altrimenti lo togliamo.',
    input: 'choice',
    options: [
      { value: 'free', label: 'Gratuito' },
      { value: 'paid', label: 'A pagamento (indica quanto sotto)' },
      { value: 'free_if_order', label: 'Gratuito solo se si conferma l’ordine' },
    ],
  },
  {
    id: 'open.delivery_terms',
    section: 'open_commercial',
    label: 'Consegna e trasporto: incluso nel prezzo? Fino a dove arrivate?',
    context:
      'Serve per definire le zone servite sul sito e se il preventivo deve aggiungere un costo di trasporto per distanza.',
    input: 'textarea',
    placeholder: 'Es. incluso entro 50 miglia da Londra, oltre £X/miglio…',
  },
  {
    id: 'open.lead_time',
    section: 'open_commercial',
    label: 'Tempi di produzione e consegna tipici (per tipo di cancello, se cambiano)',
    context:
      'Il cliente finale lo chiede sempre. Va mostrato nel configuratore e nel preventivo per gestire le aspettative.',
    input: 'textarea',
    placeholder: 'Es. 4–6 settimane standard, 8 per automatizzati…',
  },
  {
    id: 'open.deposit_terms',
    section: 'open_commercial',
    label: 'Come funzionano acconto e pagamenti?',
    context:
      'Es. 50% alla conferma, saldo a installazione. Serve per il testo del preventivo e per le condizioni di vendita sul sito.',
    input: 'textarea',
    placeholder: 'Es. 50% deposito, saldo a fine posa…',
  },
  {
    id: 'open.auto_includes',
    section: 'open_commercial',
    label: 'Cosa include esattamente il prezzo “Automated”?',
    context:
      'I listini distinguono solo Auto vs Manual. Per descrivere l’opzione servono i dettagli: marca/modello motore, fotocellule, quanti telecomandi, tastierino, collegamento elettrico incluso o no.',
    input: 'textarea',
    placeholder: 'Es. motore BFT, 2 telecomandi, fotocellule incluse, scavi esclusi…',
    blocking: true,
  },
  {
    id: 'open.automation_limits',
    section: 'open_commercial',
    label: 'Ci sono limiti oltre i quali NON automatizzate (peso, larghezza, tipo)?',
    context:
      'Dal PDF catalogo: “limiti tecnici della meccanica automatizzata” mai definiti. Serve per non vendere “Automated” su misure che poi in officina non si possono motorizzare.',
    input: 'textarea',
    placeholder: 'Es. sopra 5 m o 400 kg per anta solo motori industriali, prezzo a parte…',
  },
  {
    id: 'open.finish_included',
    section: 'open_commercial',
    label: 'Zincatura e verniciatura sono incluse nel prezzo FROM?',
    context:
      'Serve per la palette finiture del configuratore: se la verniciatura a polvere è un extra va prezzata, se è inclusa va detto nel preventivo.',
    input: 'choice',
    options: [
      { value: 'both_included', label: 'Zincatura + verniciatura incluse' },
      { value: 'galv_only', label: 'Solo zincatura inclusa, vernice extra' },
      { value: 'both_extra', label: 'Entrambe extra' },
      { value: 'depends', label: 'Dipende (spiega nelle note finiture)' },
    ],
  },

  // ── Open dimensions ─────────────────────────────────────────
  {
    id: 'open.posts_offering',
    section: 'open_dimensions',
    label: 'Che pali/pilastri vendete con i cancelli? Materiali, sezione, cima?',
    context:
      'Il configuratore oggi fa scegliere pali in acciaio/mattone/pietra/legno con cima flat/ball/pyramid/spear e 120 mm sopra il telaio — tutto inventato da noi. Serve la gamma reale: cosa producete voi, cosa fa il muratore del cliente.',
    input: 'textarea',
    placeholder: 'Es. pali acciaio 100×100 con ball finial; mattone lo fa il cliente…',
    blocking: true,
  },
  {
    id: 'open.posts_pricing',
    section: 'open_dimensions',
    label: 'I pali sono inclusi nel prezzo FROM o extra? A che prezzo?',
    context:
      'Il preventivo deve sapere se il FROM copre anche i pali di sostegno o se vanno aggiunti come voce separata.',
    input: 'textarea',
    placeholder: 'Es. coppia pali acciaio inclusa; pilastri muratura esclusi…',
    blocking: true,
  },
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
    id: 'open.arched_geometry',
    section: 'open_decorations',
    label: 'Com’è fatto l’arco (£850)? Quanto si alza al centro rispetto ai lati?',
    context:
      'Il 3D oggi disegna una curva inventata. Serve la freccia tipica dell’arco (es. +150 mm al centro) e se la curva è sempre uguale o scala con la larghezza.',
    input: 'textarea',
    placeholder: 'Es. +150 mm al centro su 2 m, proporzionale sulla larghezza…',
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
    id: 'open.fencing_panel_specs',
    section: 'open_fencing',
    label: 'Misure standard dei pannelli e pali: cosa è incluso?',
    context:
      'Nel brief ogni pannello ha height + length ma mancano le taglie standard (es. pannelli da 1830 mm?) e se i pali di fissaggio sono inclusi nel prezzo del pannello o venduti a parte.',
    input: 'textarea',
    placeholder: 'Es. pannelli standard 1800×1200, pali £X cad, inclusi ogni 2 pannelli…',
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
  {
    id: 'open.posts_in_preview',
    section: 'open_preview',
    label: 'La preview deve mostrare anche pali/pilastri di default, o solo il cancello?',
    context: 'Vale per tutte le famiglie. Dal PDF audit double swing (brick pillars sì/no).',
    input: 'choice',
    options: [
      { value: 'with_posts', label: 'Sì, con pali/pilastri' },
      { value: 'gate_only', label: 'Solo il cancello' },
      { value: 'per_family', label: 'Dipende dalla famiglia (spiega nelle note foto)' },
    ],
  },
  {
    id: 'open.motor_in_preview',
    section: 'open_preview',
    label: 'Motore, cremagliera e fotocellule devono vedersi nella preview?',
    context: 'Soprattutto per tracked e cantilever: disegno tecnico completo o pulito commerciale?',
    input: 'choice',
    options: [
      { value: 'show', label: 'Sì, mostrare l’automazione' },
      { value: 'hide', label: 'No, preview pulita' },
      { value: 'toggle', label: 'Meglio un interruttore mostra/nascondi' },
    ],
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
    id: 'gate.double_swing.rail_structure',
    section: 'gate_double_swing',
    label: 'Struttura del telaio: quanti rail orizzontali e che sezione di tubo usate?',
    context:
      'Oggi il disegno 3D usa 4 rail e tubo 40×2,5 mm presi dall’analisi delle foto, non da un tuo dato. Serve il valore di officina per disegnare il cancello giusto e per la cut list di produzione.',
    input: 'textarea',
    placeholder: 'Es. 4 rail, tubo quadro 40×40×3 mm…',
    blocking: true,
  },
  {
    id: 'gate.double_swing.picket_spacing',
    section: 'gate_double_swing',
    label: 'Interasse delle barre verticali (picket)?',
    context:
      'Il 3D oggi usa 110 mm di default. Il valore vero cambia l’aspetto del cancello e il conteggio dei railheads.',
    input: 'text',
    placeholder: 'Es. 110 mm centro-centro…',
  },
  {
    id: 'gate.double_swing.ground_clearance',
    section: 'gate_double_swing',
    label: 'Quanta luce da terra lasciate sotto il cancello?',
    context:
      'Dal PDF audit: mai specificato. Cambia il disegno in preview e l’altezza utile del corpo.',
    input: 'text',
    placeholder: 'Es. 50 mm standard, di più su pendenze…',
  },
  {
    id: 'gate.double_swing.center_detail',
    section: 'gate_double_swing',
    label: 'Al centro delle due ante: piastra decorativa, latch semplice, o entrambi?',
    context: 'Serve per disegnare il gruppo centrale nella preview 2D/3D.',
    input: 'choice',
    options: [
      { value: 'latch_plate', label: 'Piastra decorativa con latch' },
      { value: 'simple_latch', label: 'Latch semplice' },
      { value: 'both', label: 'Entrambi, dipende dal modello' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.double_swing.deco_photo_mapping',
    section: 'gate_double_swing',
    label: 'Nelle foto che ci hai mandato: quali elementi sono top bands, basket twist, spear row e cerchi?',
    context:
      'I nomi del listino non sono mai stati collegati agli elementi reali nelle foto. Senza questa mappa il 3D disegna decorazioni inventate.',
    input: 'textarea',
    placeholder: 'Es. i due anelli in alto = top bands, la torsione al centro = basket twist…',
    blocking: true,
  },
  {
    id: 'gate.double_swing.size_limits',
    section: 'gate_double_swing',
    label: 'Double Swing: larghezza e altezza minime e massime REALI, e step standard?',
    context:
      'Dal PDF catalogo: oggi abbiamo solo la misura iniziale (1800/1900 × 900/1000). Il configuratore accetta 600–6000 mm per tutti i cancelli — limite inventato. Servono i veri min/max di produzione per bloccare configurazioni impossibili.',
    input: 'textarea',
    placeholder: 'Es. W 1800–4000 mm, H 900–2000 mm, step 100 mm…',
    blocking: true,
  },
  {
    id: 'gate.double_swing.opening_direction',
    section: 'gate_double_swing',
    label: 'Le ante aprono verso l’interno, l’esterno, o sceglie il cliente?',
    context:
      'Dal PDF catalogo: il sistema deve supportare inward/outward. Serve il default di fabbrica e se ci sono limiti (es. mai verso strada).',
    input: 'choice',
    options: [
      { value: 'inward_default', label: 'Interno di default' },
      { value: 'outward_default', label: 'Esterno di default' },
      { value: 'client_chooses', label: 'Sceglie il cliente' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.double_swing.dog_bars_real',
    section: 'gate_double_swing',
    label: 'Dog bars e dog bar railheads sono opzioni di produzione vere o solo etichette visive?',
    context: 'Decide se vanno mostrate come opzioni acquistabili nel configuratore.',
    input: 'choice',
    options: [
      { value: 'real_options', label: 'Opzioni vere che produciamo' },
      { value: 'visual_labels', label: 'Solo descrizioni visive' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.single_swing.default_handing',
    section: 'gate_single_swing',
    label: 'Single Swing: lato cerniera / serratura di default?',
    context: 'Es. cerniera a sinistra vista da fuori, serratura a destra.',
    input: 'textarea',
  },
  {
    id: 'gate.single_swing.reuse_double',
    section: 'gate_single_swing',
    label: 'Il single swing riusa identica la struttura del double swing (rail, pali, decorazioni)?',
    context:
      'Dal PDF audit: se è identico, il 3D riusa lo stesso disegno con una sola anta. Se cambia qualcosa (meno decorazioni, rail diversi), scrivilo.',
    input: 'choice',
    options: [
      { value: 'identical', label: 'Identico, solo un’anta' },
      { value: 'reduced', label: 'Simile ma ridotto (scrivi sotto cosa cambia)' },
      { value: 'different', label: 'Struttura diversa (spiega sotto)' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.single_swing.reuse_double_note',
    section: 'gate_single_swing',
    label: 'Note sulle differenze dal double swing (incluso limiti arched top)',
    context: '',
    input: 'textarea',
  },
  {
    id: 'gate.single_swing.size_limits',
    section: 'gate_single_swing',
    label: 'Single Swing: min/max reali di larghezza e altezza, e step?',
    context:
      'Dal PDF catalogo: confermata solo la misura iniziale (800/900 × 900/1000). Servono i limiti veri, anche per capire dove finisce il pedonale e inizia il driveway.',
    input: 'textarea',
    placeholder: 'Es. W 800–1500 mm, H 900–2000 mm…',
    blocking: true,
  },
  {
    id: 'gate.single_swing.opening_direction',
    section: 'gate_single_swing',
    label: 'Il single swing apre verso interno o esterno di default? Vincoli in spazi ridotti?',
    context:
      'Dal PDF catalogo: serve default + eventuali limiti quando lo spazio di rotazione è poco.',
    input: 'textarea',
    placeholder: 'Es. interno di default, esterno solo se richiesto e lo spazio lo permette…',
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
    id: 'gate.tracked.track_run',
    section: 'gate_tracked_sliding',
    label: 'Quanto è lungo il binario rispetto alla luce, e quanto spazio laterale serve a cancello aperto (runback)?',
    context:
      'Dal PDF audit: senza la corsa reale la preview non può mostrare l’apertura corretta né avvisare il cliente dello spazio necessario.',
    input: 'textarea',
    placeholder: 'Es. binario = luce × 2, runback = luce + 300 mm…',
    blocking: true,
  },
  {
    id: 'gate.tracked.size_limits',
    section: 'gate_tracked_sliding',
    label: 'Tracked: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (2500/2600 × 900/1000).',
    input: 'textarea',
    placeholder: 'Es. W 2500–6000 mm, H 900–2200 mm…',
    blocking: true,
  },
  {
    id: 'gate.tracked.frame_tube',
    section: 'gate_tracked_sliding',
    label: 'Le famiglie scorrevoli (tracked, cantilever, telescopic, bifold) usano la stessa sezione tubo dello swing?',
    context:
      'La struttura del telaio è chiesta in dettaglio solo per il double swing. Se gli scorrevoli usano tubi o rinforzi diversi, il 3D e la cut list devono saperlo.',
    input: 'choice',
    options: [
      { value: 'same', label: 'Stesso tubo per tutte le famiglie' },
      { value: 'different', label: 'Diverso (spiega nelle note binario)' },
      { value: 'unsure', label: 'Non so' },
    ],
  },
  {
    id: 'gate.tracked.upper_guide',
    section: 'gate_tracked_sliding',
    label: 'C’è una guida superiore anti-ribaltamento? Quando serve e deve vedersi in preview?',
    context:
      'Dal PDF catalogo: il sistema può prevedere guida superiore. Serve sapere se c’è sempre, solo sopra certe misure, e se disegnarla.',
    input: 'textarea',
    placeholder: 'Es. sempre presente sul palo di ricezione, non disegnarla…',
  },
  {
    id: 'gate.tracked.deco_reuse',
    section: 'gate_tracked_sliding',
    label: 'Le decorazioni Victorian sullo sliding sono le stesse dello swing o semplificate?',
    context: 'Decide se il 3D riusa il disegno decorativo dello swing sul pannello scorrevole.',
    input: 'choice',
    options: [
      { value: 'same', label: 'Stesse decorazioni' },
      { value: 'simplified', label: 'Semplificate (spiega nelle note)' },
      { value: 'unsure', label: 'Non so' },
    ],
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
    id: 'gate.cantilever.carriage_guide',
    section: 'gate_cantilever_sliding',
    label: 'Cantilever: dove stanno i carrelli di sostegno, quanta luce da terra, e c’è una guida a terra visibile?',
    context:
      'Dal PDF audit: il cantilever non tocca terra nella luce di passaggio — la preview deve mostrare carrelli e clearance giusti per essere credibile.',
    input: 'textarea',
    placeholder: 'Es. due carrelli sul lato coda, 100 mm da terra, nessuna guida nella luce…',
    blocking: true,
  },
  {
    id: 'gate.cantilever.size_limits',
    section: 'gate_cantilever_sliding',
    label: 'Cantilever: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (2500/2600 × 900/1000).',
    input: 'textarea',
    placeholder: 'Es. W 2500–8000 mm, H 900–2200 mm…',
    blocking: true,
  },
  {
    id: 'gate.cantilever.foundation',
    section: 'gate_cantilever_sliding',
    label: 'Che basamento/fondazione serve sul lato coda? Va mostrato in pianta?',
    context:
      'Dal PDF catalogo: vincoli di fondazione e posa mai definiti. Servono per la vista in pianta e per il testo di sopralluogo nel preventivo.',
    input: 'textarea',
    placeholder: 'Es. plinto cemento 2000×400 mm sul lato coda…',
  },
  {
    id: 'gate.cantilever.support_visibility',
    section: 'gate_cantilever_sliding',
    label: 'Nella preview, quanta struttura di supporto del cantilever si deve vedere?',
    context: '',
    input: 'choice',
    options: [
      { value: 'full', label: 'Tutta (coda, carrelli, pali)' },
      { value: 'minimal', label: 'Solo il cancello, supporti minimi' },
      { value: 'unsure', label: 'Decidete voi' },
    ],
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
    id: 'gate.bifold.size_limits',
    section: 'gate_bifolding_double',
    label: 'Bifold double: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (2900/3000 × 900/1000 min).',
    input: 'textarea',
    placeholder: 'Es. W 2900–5000 mm, H 900–2000 mm…',
    blocking: true,
  },
  {
    id: 'gate.bifold.fold_footprint',
    section: 'gate_bifolding_double',
    label: 'A cancello aperto, quanto spazio occupano i pannelli piegati (ingombro)?',
    context:
      'Dal PDF audit: serve il rapporto di piega tra pannello esterno e interno e l’ingombro reale da aperto, per disegnare l’apertura e avvisare il cliente dello spazio.',
    input: 'textarea',
    placeholder: 'Es. i due pannelli si impacchettano a 90°, ingombro ~600 mm per lato…',
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
    id: 'gate.single_bifold.reuse_footprint',
    section: 'gate_single_bifolding',
    label: 'Il single bifold riusa la stessa logica del bifold double? Che ingombro ha da aperto?',
    context:
      'Se è metà del bifold double, il 3D riusa lo stesso meccanismo. Se cambia (anche apertura interno/esterno), spiega.',
    input: 'textarea',
  },
  {
    id: 'gate.single_bifold.size_limits',
    section: 'gate_single_bifolding',
    label: 'Single bifold: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (1500/1600 × 900/1000 min).',
    input: 'textarea',
    placeholder: 'Es. W 1500–2500 mm, H 900–2000 mm…',
    blocking: true,
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
    id: 'gate.telescopic.size_limits',
    section: 'gate_telescopic',
    label: 'Telescopic: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (2000/2100 × 900/1000).',
    input: 'textarea',
    placeholder: 'Es. W 2000–6000 mm, H 900–2200 mm…',
    blocking: true,
  },
  {
    id: 'gate.telescopic.width_rule',
    section: 'gate_telescopic',
    label: 'Nel telescopic, la larghezza indicata dal cliente è la luce netta o la corsa totale dei pannelli?',
    context: 'Dal PDF audit: senza questa regola prezzo e disegno partono dal numero sbagliato.',
    input: 'choice',
    options: [
      { value: 'clear_opening', label: 'Luce netta di passaggio' },
      { value: 'total_run', label: 'Corsa/lunghezza totale pannelli' },
      { value: 'unsure', label: 'Non so' },
    ],
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
  {
    id: 'gate.radius.size_limits',
    section: 'gate_radius',
    label: 'Radius: min/max reali di larghezza e altezza, e step?',
    context: 'Dal PDF catalogo: solo misura iniziale confermata (1600/1700 × 900/1000).',
    input: 'textarea',
    placeholder: 'Es. W 1600–4000 mm, H 900–2000 mm…',
    blocking: true,
  },
  {
    id: 'gate.radius.preview_views',
    section: 'gate_radius',
    label: 'Se il radius va mostrato: cosa deve far vedere la preview in pianta e di fronte?',
    context: 'Es. curva del percorso vista dall’alto + prospetto normale, oppure solo cima arcuata.',
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
