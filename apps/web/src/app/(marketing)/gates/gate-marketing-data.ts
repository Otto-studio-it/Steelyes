export type GateSlug = 'cantilever' | 'bifold' | 'pedestrian' | 'telescopic' | 'sliding' | 'architectural'

export type GateData = {
  slug: GateSlug
  title: string
  subtitle: string
  ref: string
  tagline: string
  description: string
  specs: { label: string; value: string }[]
  features: string[]
}

export const GATE_DATA: Record<GateSlug, GateData> = {
  cantilever: {
    slug: 'cantilever',
    title: 'Cantilever',
    subtitle: 'Counter-balanced slide',
    ref: 'ST-101',
    tagline: 'Sliding access where a ground track may not suit.',
    description:
      'A cantilever gate is designed to slide without relying on a full ground track across the entrance. It is a useful route for driveways where levels, drainage, or surface finish need to be considered during specification.',
    specs: [
      { label: 'Opening mechanism', value: 'Cantilever slide' },
      { label: 'Material', value: 'Steel specification confirmed per project' },
      { label: 'Span', value: 'Confirmed after measurement and survey' },
      { label: 'Finish direction', value: 'Colour and coating confirmed during specification' },
      { label: 'Automation', value: 'Available, subject to survey' },
      { label: 'Lead time', value: 'Subject to specification' },
    ],
    features: [
      'Keeps the driveway threshold clear',
      'Useful where surface levels need review',
      'Specified around post, support, and run-back requirements',
      'Can be planned for manual or automated operation',
    ],
  },
  bifold: {
    slug: 'bifold',
    title: 'Bifold',
    subtitle: 'Folding dual-leaf',
    ref: 'ST-102',
    tagline: 'Maximum aperture. Minimal footprint.',
    description:
      'Bi-fold gates reduce the swing space needed by folding the leaves as they open. They are useful for tighter entrances, short driveways, or sites where a full swing gate would interrupt parking or access.',
    specs: [
      { label: 'Opening mechanism', value: 'Bifold (dual-leaf fold)' },
      { label: 'Material', value: 'Steel specification confirmed per project' },
      { label: 'Span', value: 'Confirmed after measurement and survey' },
      { label: 'Finish direction', value: 'Colour and coating confirmed during specification' },
      { label: 'Automation', value: 'Available, subject to survey' },
      { label: 'Lead time', value: 'Subject to specification' },
    ],
    features: [
      'Compact open footprint',
      'Useful where swing clearance is limited',
      'Access control can be reviewed during specification',
      'Infill, privacy level, and finish specified to the entrance',
    ],
  },
  pedestrian: {
    slug: 'pedestrian',
    title: 'Pedestrian',
    subtitle: 'Personnel-access gate',
    ref: 'ST-103',
    tagline: 'Controlled access at human scale.',
    description:
      'Single-leaf pedestrian gates create a controlled access point for side entrances, gardens, service paths, and property boundaries. The design can be matched to the wider gate style for a consistent frontage.',
    specs: [
      { label: 'Opening mechanism', value: 'Single-leaf swing' },
      { label: 'Material', value: 'Steel specification confirmed per project' },
      { label: 'Width', value: 'Made to measure' },
      { label: 'Finish direction', value: 'Colour and coating confirmed during specification' },
      { label: 'Locking', value: 'Confirmed during specification' },
      { label: 'Lead time', value: 'Subject to specification' },
    ],
    features: [
      'Matches vehicle gate aesthetics',
      'Useful for side entrances and boundaries',
      'Access options reviewed during specification',
      'Hardware selected around site use and opening direction',
    ],
  },
  telescopic: {
    slug: 'telescopic',
    title: 'Telescopic',
    subtitle: 'Multi-panel slide',
    ref: 'ST-104',
    tagline: 'Wide openings. Shorter stack.',
    description:
      'Telescopic sliding gates split the opening across multiple moving panels, reducing the side space normally needed by a single long sliding leaf. They are best reviewed early because track, drainage, and run-back space all matter.',
    specs: [
      { label: 'Opening mechanism', value: 'Telescopic slide' },
      { label: 'Material', value: 'Steel specification confirmed per project' },
      { label: 'Span', value: 'Confirmed after measurement and survey' },
      { label: 'Finish direction', value: 'Colour and coating confirmed during specification' },
      { label: 'Automation', value: 'Reviewed during specification' },
      { label: 'Lead time', value: 'Subject to specification' },
    ],
    features: [
      'Reduced run-back compared with a single long leaf',
      'Useful for wider or constrained entrances',
      'Track and ground conditions reviewed before fabrication',
      'Security and access options specified by site need',
    ],
  },
  sliding: {
    slug: 'sliding',
    title: 'Sliding',
    subtitle: 'Single-panel slide',
    ref: 'ST-105',
    tagline: 'Clean travel. Reliable every cycle.',
    description:
      'Sliding gates are a practical choice where the entrance has usable side space but limited swing clearance. The final system is specified around opening width, driveway levels, finish, and automation requirements.',
    specs: [
      { label: 'Opening mechanism', value: 'Single-panel slide' },
      { label: 'Material', value: 'Steel specification confirmed per project' },
      { label: 'Span', value: 'Confirmed after measurement and survey' },
      { label: 'Finish direction', value: 'Colour and coating confirmed during specification' },
      { label: 'Automation', value: 'Available, subject to survey' },
      { label: 'Lead time', value: 'Subject to specification' },
    ],
    features: [
      'Works where swing clearance is restricted',
      'Track or cantilever options reviewed by site',
      'Suitable for manual or automated planning',
      'Access control can be reviewed during specification',
    ],
  },
  architectural: {
    slug: 'architectural',
    title: 'Architectural',
    subtitle: 'Statement fabrication',
    ref: 'ST-106',
    tagline: 'When specification meets design intent.',
    description:
      'Architectural gates are fully bespoke projects where the entrance, property style, privacy needs, and design intent shape the specification. They are the right route when a standard catalogue style is not enough.',
    specs: [
      { label: 'Opening mechanism', value: 'Specified to project' },
      { label: 'Material', value: 'Confirmed during design review' },
      { label: 'Span', value: 'Confirmed after measurement and survey' },
      { label: 'Finish', value: 'Specified to project' },
      { label: 'Pricing', value: 'Price on request, survey required' },
      { label: 'Lead time', value: 'Subject to full design review' },
    ],
    features: [
      'Made for non-standard entrances',
      'Designed around property style and privacy needs',
      'Detailing reviewed during specification',
      'Useful where architects or contractors are involved',
    ],
  },
}

export const GATE_SLUGS: GateSlug[] = ['cantilever', 'bifold', 'pedestrian', 'telescopic', 'sliding', 'architectural']
