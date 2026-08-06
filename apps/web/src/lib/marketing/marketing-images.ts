/**
 * Client-approved official photography — single source of truth for marketing image paths.
 * Assets live in public/images/official/ (copied from foto/).
 */

import type { GateType, GateStyle } from '@steelyes/gate-engine'

const gates = {
  doubleSwing: {
    hero: '/images/official/gates/double-swing-hero.webp',
    gallery: [
      '/images/official/gates/double-swing-hero.webp',
      '/images/official/gates/double-swing-2.jpg',
      '/images/official/gates/double-swing-3.jpg',
      '/images/official/gates/double-swing-4.jpg',
    ],
  },
  singleSwing: {
    hero: '/images/official/gates/single-swing-hero.jpg',
    gallery: [
      '/images/official/gates/single-swing-hero.jpg',
      '/images/official/gates/single-swing-2.jpg',
      '/images/official/gates/single-swing-3.jpg',
    ],
  },
  trackedSliding: {
    hero: '/images/official/gates/tracked-sliding-hero.jpg',
    gallery: [
      '/images/official/gates/tracked-sliding-hero.jpg',
      '/images/official/gates/tracked-sliding-2.jpg',
      '/images/official/gates/tracked-sliding-3.jpg',
    ],
  },
  cantilever: {
    hero: '/images/official/gates/cantilever-hero.jpg',
    gallery: [
      '/images/official/gates/cantilever-hero.jpg',
      '/images/official/gates/cantilever-2.jpg',
      '/images/official/gates/cantilever-3.jpg',
    ],
  },
  bifoldDouble: {
    hero: '/images/official/gates/bifold-double-hero.jpg',
    gallery: [
      '/images/official/gates/bifold-double-hero.jpg',
      '/images/official/gates/bifold-double-2.jpg',
      '/images/official/gates/bifold-double-3.jpg',
    ],
  },
  singleBifold: {
    hero: '/images/official/gates/single-bifold-hero.png',
    gallery: ['/images/official/gates/single-bifold-hero.png'],
  },
  telescopic: {
    hero: '/images/official/gates/telescopic-hero.png',
    gallery: [
      '/images/official/gates/telescopic-hero.png',
      '/images/official/gates/telescopic-2.png',
    ],
  },
  radius: {
    hero: '/images/official/gates/radius-hero.jpg',
    gallery: [
      '/images/official/gates/radius-hero.jpg',
      '/images/official/gates/radius-2.jpg',
    ],
  },
} as const

export const OFFICIAL_IMAGES = {
  gates,
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
      primary: '/images/official/services/staircase-1.jpg',
      secondary: '/images/official/services/staircase-2.jpg',
      glass: '/images/official/services/staircase-glass.jpg',
    },
    railings: {
      garden: '/images/official/services/garden-railing.jpg',
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
