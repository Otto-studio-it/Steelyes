/**
 * Marketing copy for each gate type — written as a UK homeowner / site client
 * would brief Steelyes, then answered in Steelyes workshop English.
 * Prices stay indicative; enquire types do not pretend the configurator can finish them.
 */

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
    ctaHref: '/configurator',
    heroImage: '/images/gates/classic-ornate-driveway-gate-arch.jpg',
    detailImages: [
      '/images/gates/classic-ornate-driveway-gate-arch.jpg',
      '/images/components/component-finial-spear.jpg',
      '/images/gates/pedestrian-gate-ornate-brick.jpg',
      '/images/components/component-finial-ball.jpg',
    ],
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
    ctaHref: '/configurator',
    heroImage: '/images/gates/pedestrian-gate-ornate-brick.jpg',
    detailImages: [
      '/images/gates/pedestrian-gate-ornate-brick.jpg',
      '/images/gates/classic-ornate-driveway-gate-arch.jpg',
      '/images/components/component-finial-star.jpg',
      '/images/railings/railings-ornate-bronze-driveway.jpg',
    ],
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
    availability: 'schematic',
    ctaLabel: 'Explore in configurator',
    ctaHref: '/configurator',
    heroImage: '/images/gates/sliding-gate-automated-open.jpg',
    detailImages: [
      '/images/gates/sliding-gate-anthracite-residential.jpg',
      '/images/gates/sliding-gate-classic-ornate-tudor.jpg',
      '/images/components/component-finial-diamond.jpg',
      '/images/components/component-finial-spear.jpg',
    ],
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
    availability: 'schematic',
    ctaLabel: 'Explore in configurator',
    ctaHref: '/configurator',
    heroImage: '/images/gates/sliding-gate-anthracite-residential.jpg',
    detailImages: [
      '/images/gates/sliding-gate-spear-finials.jpg',
      '/images/gates/sliding-gate-automated-open.jpg',
      '/images/components/component-finial-spear.jpg',
      '/images/components/component-finial-ball.jpg',
    ],
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
    availability: 'enquire',
    ctaLabel: 'Enquire for this type',
    ctaHref: '/contact?gate=bifold',
    heroImage: '/images/gates/sliding-gate-classic-ornate-tudor.jpg',
    detailImages: [
      '/images/gates/classic-ornate-driveway-gate-arch.jpg',
      '/images/components/component-finial-acorn.jpg',
      '/images/gates/sliding-gate-spear-finials.jpg',
      '/images/components/component-finial-diamond.jpg',
    ],
    customerVoice:
      '“The drive is short — if a swing leaf opens, it hits the car. We still want a wide entrance when it’s open. Something that folds back against the wall or pier would solve it.”',
    description:
      'Bifold double swing folds each side as it opens, cutting the swing footprint. Geometry (panels per leaf, stacking side) is still workshop-confirmed with you — we do not fake those rules online. Send the brief; we specify after survey rather than invent panel counts in the configurator.',
    specs: [
      { label: 'Opening mechanism', value: 'Bifold dual-leaf fold' },
      { label: 'Best for', value: 'Short drives, tight swing clearance' },
      { label: 'Online status', value: 'Enquire — not fully configurable yet' },
      { label: 'Material', value: 'Steel specification per project' },
      { label: 'Automation', value: 'Reviewed on survey' },
      { label: 'Lead time', value: 'After full design review' },
    ],
    features: [
      'Opens wide without a deep swing into the plot',
      'Specified with you — not a one-size fold recipe online',
      'Finish and infill matched to the house frontage',
      'Quote path starts with an enquiry and a measure',
    ],
  },

  'single-bifold': {
    slug: 'single-bifold',
    title: 'Single bifold',
    subtitle: 'One folding leaf',
    ref: 'ST-206',
    tagline: 'Side access that folds, not swings deep.',
    availability: 'enquire',
    ctaLabel: 'Enquire for this type',
    ctaHref: '/contact?gate=single-bifold',
    heroImage: '/images/home/privacy-horizontal-steel-gate.jpg',
    detailImages: [
      '/images/gates/pedestrian-gate-ornate-brick.jpg',
      '/images/home/modern-diagonal-steel-gate.jpg',
      '/images/components/component-finial-star.jpg',
      '/images/components/component-finial-ball.jpg',
    ],
    customerVoice:
      '“Side gate is tight against a wall — a normal swing leaf would hit the bin store. Can it fold so it stacks neatly?”',
    description:
      'Single bifold is a folding personnel or narrow vehicle leaf for constrained side openings. Collection side and panel layout are confirmed with Marius’s workshop rules before we quote steel — enquire so we can specify honestly rather than show fiction online.',
    specs: [
      { label: 'Opening mechanism', value: 'Single bifold fold' },
      { label: 'Best for', value: 'Narrow / wall-constrained side access' },
      { label: 'Online status', value: 'Enquire only' },
      { label: 'Material', value: 'Steel — confirmed per project' },
      { label: 'Hardware', value: 'Specified on survey' },
      { label: 'Lead time', value: 'After design review' },
    ],
    features: [
      'Folding action where a full swing will not fit',
      'Matched visually to main entrance when required',
      'No invented panel count in the public configurator',
      'Survey-led quote before fabrication',
    ],
  },

  telescopic: {
    slug: 'telescopic',
    title: 'Telescopic sliding',
    subtitle: 'Multi-panel slide',
    ref: 'ST-207',
    tagline: 'Wide opening. Shorter parked stack.',
    availability: 'enquire',
    ctaLabel: 'Enquire for this type',
    ctaHref: '/contact?gate=telescopic',
    heroImage: '/images/gates/sliding-gate-spear-finials.jpg',
    detailImages: [
      '/images/gates/sliding-gate-anthracite-residential.jpg',
      '/images/components/component-finial-spear.jpg',
      '/images/gates/privacy-diagonal-gate-dusk.jpg',
      '/images/components/component-finial-acorn.jpg',
    ],
    customerVoice:
      '“The opening is wide but the run-back along the fence is short. A single long sliding leaf won’t fit. We need panels that telescope so the stack is shorter.”',
    description:
      'Telescopic sliding splits the leaf into overlapping panels so the parked stack is shorter than one full-width leaf. Panel count and overlap order are still open workshop questions — we will not pretend the online tool knows them. Enquire with photos and a rough width; we engineer from survey.',
    specs: [
      { label: 'Opening mechanism', value: 'Multi-panel telescopic slide' },
      { label: 'Best for', value: 'Wide light, short side run' },
      { label: 'Online status', value: 'Enquire only' },
      { label: 'Track / ground', value: 'Confirmed on survey' },
      { label: 'Automation', value: 'Reviewed with the kit on site' },
      { label: 'Lead time', value: 'After engineered design' },
    ],
    features: [
      'Shorter stack than a single long sliding leaf',
      'Early survey on track, drainage, and motor loads',
      'Honest status: not yet a full online configure path',
      'Built when the geometry is closed with you',
    ],
  },

  radius: {
    slug: 'radius',
    title: 'Radius sliding',
    subtitle: 'Curved travel',
    ref: 'ST-208',
    tagline: 'When the opening isn’t a straight line.',
    availability: 'enquire',
    ctaLabel: 'Enquire for this type',
    ctaHref: '/contact?gate=radius',
    heroImage: '/images/gates/sliding-gate-classic-ornate-tudor.jpg',
    detailImages: [
      '/images/gates/privacy-diagonal-gate-dusk.jpg',
      '/images/gates/classic-ornate-driveway-gate-arch.jpg',
      '/images/components/component-finial-star.jpg',
      '/images/components/component-finial-acorn.jpg',
    ],
    customerVoice:
      '“The entrance is on a curve — posts aren’t parallel in a simple rectangle. We need the gate to follow the radius, not fight it.”',
    description:
      'Radius sliding follows a curved plan — rare, site-specific, and not something we invent in a generic configurator. Share drawings or a clear survey brief; Steelyes will define the product with you before any price is treated as firm.',
    specs: [
      { label: 'Opening mechanism', value: 'Radius / curved slide' },
      { label: 'Best for', value: 'Non-rectilinear entrances' },
      { label: 'Online status', value: 'Enquire only' },
      { label: 'Design input', value: 'Survey + drawings preferred' },
      { label: 'Pricing', value: 'On request after design review' },
      { label: 'Lead time', value: 'Subject to engineered design' },
    ],
    features: [
      'For curved plans — not a stretch of a straight sliding leaf',
      'Starts with your site evidence, not a stock SKU',
      'No fake online dimensions',
      'Quoted only when the radius is understood',
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
