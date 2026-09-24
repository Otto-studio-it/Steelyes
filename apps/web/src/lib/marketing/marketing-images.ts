/**
 * Client-approved official photography — single source of truth for marketing image paths.
 * Numbered page photos are served from the London Spaces CDN. 01 is the cover.
 * Balconies, security, structures, about, and the homepage welding hero stay local.
 */

import type { GateType, GateStyle } from '@steelyes/gate-engine'

const MEDIA_CDN = 'https://steelyes-foto.lon1.cdn.digitaloceanspaces.com'

function photoSet(folder: string, files: readonly string[]) {
  const gallery = files.map((file) => `${MEDIA_CDN}/${folder}/${file}`)
  return { hero: gallery[0]!, gallery }
}

const gates = {
  doubleSwing: photoSet('double-swing', [
    '01.jpg',
    '02.webp',
    '03.jpg',
    '04.jpg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
    '08.jpg',
    '09.jpg',
    '10.jpg',
  ]),
  singleSwing: photoSet('single-swing', [
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '04.jpg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
  ]),
  trackedSliding: photoSet('tracked-sliding', [
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '04.jpg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
    '08.jpg',
    '09.jpg',
  ]),
  cantilever: photoSet('cantilever', [
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '04.jpg',
    '05.jpg',
    '06.jpg',
    '07.jpg',
    '08.jpg',
  ]),
  bifoldDouble: photoSet('bifold', ['01.jpg', '02.jpg', '03.jpg']),
  singleBifold: photoSet('single-bifold', ['01.jpg', '02.jpg']),
  telescopic: photoSet('telescopic', ['01.png', '02.png']),
  radius: photoSet('radius', ['01.jpg', '02.jpg', '03.png']),
}

const staircasePhotos = photoSet('staircases', [
  '01.jpg',
  '02.jpg',
  '03.jpg',
  '04.jpg',
  '05.jpg',
  '06.jpg',
  '07.jpg',
])

const gatesAllPhotos = photoSet('gates-all', [
  '01.jpg',
  '02.jpg',
  '03.jpg',
  '04.jpg',
  '05.jpg',
  '06.jpg',
  '07.png',
  '08.jpg',
])

const railingPhotos = photoSet('railings', [
  '01.jpg',
  '02.jpg',
  '03.jpg',
  '04.jpg',
  '05.jpg',
  '06.jpg',
  '07.jpg',
  '08.jpg',
])

export const OFFICIAL_IMAGES = {
  gates: { ...gates, all: gatesAllPhotos },
  services: {
    securityGrills: [
      '/images/official/services/security-grills-1.jpg',
      '/images/official/services/security-grills-2.jpg',
      '/images/official/services/security-grills-3.jpg',
    ],
    balconies: {
      metal: '/images/official/services/balcony-metal.jpg',
      glass: '/images/official/services/balcony-glass.jpg',
      mixed: '/images/official/services/balcony-mixed.jpg',
    },
    staircases: {
      hero: staircasePhotos.hero,
      gallery: staircasePhotos.gallery,
      primary: staircasePhotos.gallery[0]!,
      secondary: staircasePhotos.gallery[1]!,
      glass: staircasePhotos.gallery[2]!,
    },
    railings: {
      hero: railingPhotos.hero,
      gallery: railingPhotos.gallery,
      garden: railingPhotos.gallery[0]!,
    },
    structures: {
      hero: '/images/official/services/steel-structure-hero.png',
    },
  },
  about: {
    teamWorkshop: '/images/official/about/team-workshop.jpg',
  },
  /** Homepage hero — client-selected tracked sliding installation with clear copy space. */
  homepageHero: '/images/home/hero-tracked-sliding-gate.jpg',
} as const

export const GATE_SLUG_IMAGES = {
  'double-swing': gates.doubleSwing,
  'single-swing': gates.singleSwing,
  'tracked-sliding': gates.trackedSliding,
  cantilever: gates.cantilever,
  bifold: gates.bifoldDouble,
  'single-bifold': gates.singleBifold,
  telescopic: gates.telescopic,
  radius: gates.radius,
}

export const GATE_TYPE_IMAGES: Partial<Record<GateType, string>> = {
  double_swing: gates.doubleSwing.hero,
  single_swing: gates.singleSwing.hero,
  tracked_sliding: gates.trackedSliding.hero,
  cantilever_sliding: gates.cantilever.hero,
  bifolding_double_swing: gates.bifoldDouble.hero,
  single_bifolding: gates.singleBifold.hero,
  telescopic_sliding: gates.telescopic.hero,
  radius_sliding: gates.radius.hero,
}

export const STYLE_IMAGES: Record<GateStyle, string> = {
  traditional_victorian: gates.doubleSwing.hero,
  composite_boards: '/images/official/gates/composite-boards-hero.jpg',
}

export const CONFIGURATOR_PHOTO_BACKGROUNDS: Partial<Record<GateType, string>> = {
  double_swing: gates.doubleSwing.hero,
  single_swing: gates.singleSwing.hero,
  tracked_sliding: gates.trackedSliding.hero,
  cantilever_sliding: gates.cantilever.hero,
  bifolding_double_swing: gates.bifoldDouble.hero,
  single_bifolding: gates.singleBifold.hero,
  telescopic_sliding: gates.telescopic.hero,
  radius_sliding: gates.radius.hero,
}
