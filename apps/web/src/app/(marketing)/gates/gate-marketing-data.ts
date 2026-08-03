/**
 * Marketing copy for each gate type — written as a UK homeowner / site client
 * would brief Steelyes, then answered in Steelyes workshop English.
 * Prices stay indicative; enquire types do not pretend the configurator can finish them.
 */

import { GATE_SLUG_IMAGES } from '@/lib/marketing/marketing-images'

export type GateSlug =
  | 'double-swing'
  | 'single-swing'
  | 'tracked-sliding'
  | 'cantilever'
  | 'bifold'
  | 'single-bifold'
  | 'telescopic'
  | 'radius'

export type GateAvailability = 'configure' | 'schematic' | 'enquire'

export type GateData = {
  slug: GateSlug
  title: string
  subtitle: string
  ref: string
  tagline: string
  /** First-person client brief — how a customer would describe the need. */
  customerVoice: string
  description: string
  heroImage: string
  specs: { label: string; value: string }[]
  features: string[]
  detailImages: string[]
  availability: GateAvailability
  ctaLabel: string
  ctaHref: string
}

export const GATE_DATA: Record<GateSlug, GateData> = {
  'double-swing': {
    slug: 'double-swing',
    title: 'Double swing',
    subtitle: 'Two leaves · driveway classic',
    ref: 'ST-201',
    tagline: 'The gate most UK drives still ask for.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=double_swing',
    heroImage: GATE_SLUG_IMAGES['double-swing'].hero,
    detailImages: [...GATE_SLUG_IMAGES['double-swing'].gallery],
    customerVoice:
      '“We want proper driveway gates that open in the middle — look smart from the road, match the house, and still let the car in without drama. Prefer Victorian spears if it suits, or solid boards for privacy. Manual is fine for now; we might motorise later.”',
    description:
      'Double swing is Steelyes’ primary path: two leaves meeting in the centre, sized to your clear opening, with finish and style confirmed on survey. Configure indicative sizes and colours online, then we measure before fabrication. Automation can be planned from day one or added when you are ready — manual leaves keep a handle; motorised builds do not.',
    specs: [
      { label: 'Opening mechanism', value: 'Double-leaf swing' },
      { label: 'Best for', value: 'Standard UK driveways with swing clearance' },
      { label: 'Material', value: 'Steel — section confirmed per project' },
      { label: 'Finish', value: 'Black satin / matt / gloss or anthracite RAL 7016' },
      { label: 'Automation', value: 'Manual or motorised — survey required' },
      { label: 'Online path', value: 'Full 2D configurator' },
    ],
    features: [
      'Matches the brief most homeowners bring to a first call',
      'Victorian tube or composite boards — style chosen with you',
      'Posts, height, and handing confirmed on site',
      'Indicative price online; final quote after survey',
    ],
  },

  'single-swing': {
    slug: 'single-swing',
    title: 'Single swing',
    subtitle: 'One leaf · side access',
    ref: 'ST-202',
    tagline: 'A proper side gate — not an afterthought.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=single_swing',
    heroImage: GATE_SLUG_IMAGES['single-swing'].hero,
    detailImages: [...GATE_SLUG_IMAGES['single-swing'].gallery],
    customerVoice:
      '“We need a personnel gate for the side path — something that matches the main drive gates, locks properly, and doesn’t look cheap next to the brickwork. Narrow opening, but we still want it made to measure.”',
    description:
      'Single swing (pedestrian / side access) is one leaf, sized to the gap between posts or walls. We match spear work, boards, and powder colour to a main driveway gate when you want one frontage language. Locking and handing are settled on survey — not guessed from a photo.',
    specs: [
      { label: 'Opening mechanism', value: 'Single-leaf swing' },
      { label: 'Best for', value: 'Side paths, gardens, service access' },
      { label: 'Width', value: 'Made to measure' },
      { label: 'Finish', value: 'Matched to vehicle gate when required' },
      { label: 'Locking', value: 'Confirmed during specification' },
      { label: 'Online path', value: 'Full 2D configurator' },
    ],
    features: [
      'Human-scale access without a second vehicle leaf',
      'Can echo Victorian or board style of the main entrance',
      'Hardware chosen for daily use, not showroom gloss only',
      'Indicative online; survey locks the datum',
    ],
  },

  'tracked-sliding': {
    slug: 'tracked-sliding',
    title: 'Tracked sliding',
    subtitle: 'Ground track · single leaf',
    ref: 'ST-203',
    tagline: 'When the car stays and the leaf slides aside.',
    availability: 'configure',
    ctaLabel: 'Explore in configurator',
    ctaHref: '/configurator?gate=tracked_sliding',
    heroImage: GATE_SLUG_IMAGES['tracked-sliding'].hero,
    detailImages: [...GATE_SLUG_IMAGES['tracked-sliding'].gallery],
    customerVoice:
      '“We haven’t got room for two big leaves to swing into the drive — there’s a parked car or the path is too short. We need the gate to slide along the fence line. Happy with a track in the ground if it means it runs clean every day.”',
    description:
      'Tracked sliding sends one leaf along a ground rail into a parking / fence run. It suits sites with side space but little swing clearance. Online preview is schematic until survey confirms track levels, drainage, and motor choice — we will not invent foundation details in the configurator.',
    specs: [
      { label: 'Opening mechanism', value: 'Single-panel slide on ground track' },
      { label: 'Best for', value: 'Limited swing, usable side run' },
      { label: 'Ground works', value: 'Track & levels confirmed on survey' },
      { label: 'Finish', value: 'Powder coat — palette as specified' },
      { label: 'Automation', value: 'Common; confirmed with motor kit on survey' },
      { label: 'Online path', value: 'Schematic configurator' },
    ],
    features: [
      'Clears the driveway without a swing arc into parking',
      'Track line and falls reviewed before we cut steel',
      'Manual or automated planning from the same brief',
      'Indicative only until site dimensions are locked',
    ],
  },

  cantilever: {
    slug: 'cantilever',
    title: 'Cantilever sliding',
    subtitle: 'No track in the opening',
    ref: 'ST-204',
    tagline: 'Slide without a rail across the entrance.',
    availability: 'configure',
    ctaLabel: 'Explore in configurator',
    ctaHref: '/configurator?gate=cantilever_sliding',
    heroImage: GATE_SLUG_IMAGES.cantilever.hero,
    detailImages: [...GATE_SLUG_IMAGES.cantilever.gallery],
    customerVoice:
      '“I don’t want a track cut through the tarmac — we have block paving / a slope / a shared drive. The gate has to hang and slide without something in the middle of the entrance. Tell me honestly how much space I need beside the opening.”',
    description:
      'Cantilever sliding clears the opening without a full ground track in the light. The leaf needs a counterbalance tail — minimum one third of the clear opening (e.g. 4000 mm opening → ~1333 mm tail → ~5333 mm total run). Width online is the clear opening between posts; we show the site-space figure live so you are not surprised on install day.',
    specs: [
      { label: 'Opening mechanism', value: 'Cantilever slide (no track in light)' },
      { label: 'Width meaning', value: 'Clear opening between posts' },
      { label: 'Tail rule', value: 'Minimum 1/3 of clear opening (CA-05)' },
      { label: 'Site space', value: 'Opening + tail + posts/hardware' },
      { label: 'Automation', value: 'Available, subject to survey' },
      { label: 'Online path', value: 'Schematic + site-space warning' },
    ],
    features: [
      'Keeps the threshold clear of a through-track',
      'Honest run-back math before you commit the driveway',
      'Support / foundation detail settled on survey',
      'Not a catalogue guess — measured per entrance',
    ],
  },

  bifold: {
    slug: 'bifold',
    title: 'Bifold double',
    subtitle: 'Folding dual-leaf',
    ref: 'ST-205',
    tagline: 'Wide aperture. Short projection.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=bifolding_double_swing',
    heroImage: GATE_SLUG_IMAGES.bifold.hero,
    detailImages: [...GATE_SLUG_IMAGES.bifold.gallery],
    customerVoice:
      '“The drive is short — if a swing leaf opens, it hits the car. We still want a wide entrance when it’s open. Something that folds back against the wall or pier would solve it.”',
    description:
      'Bifold double swing folds each side as it opens, cutting the swing footprint. Online you get a labelled schematic (two panels per leaf from the product brief) — workshop panel count and stack are confirmed at survey before we fabricate.',
    specs: [
      { label: 'Opening mechanism', value: 'Bifold dual-leaf fold' },
      { label: 'Best for', value: 'Short drives, tight swing clearance' },
      { label: 'Online status', value: 'Schematic configurator' },
      { label: 'Material', value: 'Steel specification per project' },
      { label: 'Automation', value: 'Reviewed on survey' },
      { label: 'Lead time', value: 'After full design review' },
    ],
    features: [
      'Opens wide without a deep swing into the plot',
      'Schematic fold preview — not a fabrication drawing',
      'Finish and infill matched to the house frontage',
      'Quote path still ends with survey and confirmation',
    ],
  },

  'single-bifold': {
    slug: 'single-bifold',
    title: 'Single bifold',
    subtitle: 'One folding leaf',
    ref: 'ST-206',
    tagline: 'Side access that folds, not swings deep.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=single_bifolding',
    heroImage: GATE_SLUG_IMAGES['single-bifold'].hero,
    detailImages: [...GATE_SLUG_IMAGES['single-bifold'].gallery],
    customerVoice:
      '“Side gate is tight against a wall — a normal swing leaf would hit the bin store. Can it fold so it stacks neatly?”',
    description:
      'Single bifold is a folding personnel or narrow vehicle leaf for constrained side openings. Explore a schematic fold online; collection side and final panel layout stay workshop-confirmed before steel is cut.',
    specs: [
      { label: 'Opening mechanism', value: 'Single bifold fold' },
      { label: 'Best for', value: 'Narrow / wall-constrained side access' },
      { label: 'Online status', value: 'Schematic configurator' },
      { label: 'Material', value: 'Steel — confirmed per project' },
      { label: 'Hardware', value: 'Specified on survey' },
      { label: 'Lead time', value: 'After design review' },
    ],
    features: [
      'Folding action where a full swing will not fit',
      'Matched visually to main entrance when required',
      'Schematic only until workshop rules are locked',
      'Survey-led quote before fabrication',
    ],
  },

  telescopic: {
    slug: 'telescopic',
    title: 'Telescopic sliding',
    subtitle: 'Multi-panel slide',
    ref: 'ST-207',
    tagline: 'Wide opening. Shorter parked stack.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=telescopic_sliding',
    heroImage: GATE_SLUG_IMAGES.telescopic.hero,
    detailImages: [...GATE_SLUG_IMAGES.telescopic.gallery],
    customerVoice:
      '“The opening is wide but the run-back along the fence is short. A single long sliding leaf won’t fit. We need panels that telescope so the stack is shorter.”',
    description:
      'Telescopic sliding splits the leaf into overlapping panels so the parked stack is shorter than one full-width leaf. Online schematic uses three panels with ~80–120 mm overlap and the motor-side panel in front — survey still locks fabrication detail.',
    specs: [
      { label: 'Opening mechanism', value: 'Multi-panel telescopic slide' },
      { label: 'Best for', value: 'Wide light, short side run' },
      { label: 'Online status', value: 'Schematic configurator' },
      { label: 'Track / ground', value: 'Confirmed on survey' },
      { label: 'Automation', value: 'Reviewed with the kit on site' },
      { label: 'Lead time', value: 'After engineered design' },
    ],
    features: [
      'Shorter stack than a single long sliding leaf',
      'Three-panel schematic with labelled overlap band',
      'Early survey on track, drainage, and motor loads',
      'Quote path still ends with site measure',
    ],
  },

  radius: {
    slug: 'radius',
    title: 'Radius sliding',
    subtitle: 'Curved travel',
    ref: 'ST-208',
    tagline: 'When the opening isn’t a straight line.',
    availability: 'configure',
    ctaLabel: 'Configure this gate',
    ctaHref: '/configurator?gate=radius_sliding',
    heroImage: GATE_SLUG_IMAGES.radius.hero,
    detailImages: [...GATE_SLUG_IMAGES.radius.gallery],
    customerVoice:
      '“The entrance is on a curve — posts aren’t parallel in a simple rectangle. We need the gate to follow the radius, not fight it.”',
    description:
      'Radius sliding always travels on a curved path. The top may be straight or curved (arched top). Explore a labelled schematic online; curve radius and fabrication details stay survey-led.',
    specs: [
      { label: 'Opening mechanism', value: 'Curved-path sliding' },
      { label: 'Best for', value: 'Non-rectilinear entrances' },
      { label: 'Online status', value: 'Schematic configurator' },
      { label: 'Top profile', value: 'Straight or curved' },
      { label: 'Pricing', value: 'Indicative until survey' },
      { label: 'Lead time', value: 'Subject to engineered design' },
    ],
    features: [
      'Travel path always curved — not a straight-track product',
      'Optional curved crest via arched top',
      'Schematic preview for early conversation',
      'Survey before steel is cut',
    ],
  },
}

export const GATE_SLUGS: GateSlug[] = [
  'double-swing',
  'single-swing',
  'tracked-sliding',
  'cantilever',
  'bifold',
  'single-bifold',
  'telescopic',
  'radius',
]

/** Legacy marketing URLs → current slugs */
export const GATE_SLUG_REDIRECTS: Record<string, GateSlug> = {
  sliding: 'tracked-sliding',
  pedestrian: 'single-swing',
  architectural: 'radius',
  'double_swing': 'double-swing',
  'single_swing': 'single-swing',
  'tracked_sliding': 'tracked-sliding',
  cantilever_sliding: 'cantilever',
  bifolding_double_swing: 'bifold',
  single_bifolding: 'single-bifold',
  telescopic_sliding: 'telescopic',
  radius_sliding: 'radius',
}

export function resolveGateSlug(style: string): GateSlug | null {
  if (style in GATE_DATA) return style as GateSlug
  return GATE_SLUG_REDIRECTS[style] ?? null
}
