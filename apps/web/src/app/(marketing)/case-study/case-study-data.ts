/**
 * Case study data for project portfolio pages.
 * Each case study demonstrates expertise and targets long-tail keywords.
 */

export type CaseStudySlug =
  | 'victorian-gates-dulwich'
  | 'automated-sliding-gate-bromley'
  | 'security-gates-commercial-greenwich'

export type CaseStudy = {
  slug: CaseStudySlug
  title: string
  subtitle: string
  location: string
  area: string
  projectType: string
  completedDate: string
  description: string
  challenge: string
  solution: string
  result: string
  specifications: { label: string; value: string }[]
  keywords: string[]
}

export const CASE_STUDIES: Record<CaseStudySlug, CaseStudy> = {
  'victorian-gates-dulwich': {
    slug: 'victorian-gates-dulwich',
    title: 'Victorian Double Swing Gates',
    subtitle: 'Period-appropriate entrance for Edwardian property',
    location: 'Dulwich, SE21',
    area: 'South London',
    projectType: 'Residential driveway gates',
    completedDate: '2026-06',
    description:
      'A pair of bespoke double swing gates designed to complement an Edwardian villa in the Dulwich conservation area. The client wanted gates that looked like they could have been original to the property while incorporating modern automation.',
    challenge:
      'The entrance required gates that respected the conservation area guidelines while providing modern security and automation. The existing brick piers were over 100 years old and needed careful assessment before any mounting could be specified.',
    solution:
      'We designed Victorian-style gates with traditional spear-top railings, scrollwork details, and a finish to match the original ironwork on the property. Underground automation was specified to keep the mechanism hidden. The brick piers were surveyed by a structural engineer before we specified fixing positions.',
    result:
      'The gates received positive feedback from the client and neighbours, with several comments that they look "original to the house". The automation provides daily convenience while the manual override ensures access during any power outage.',
    specifications: [
      { label: 'Gate type', value: 'Double swing' },
      { label: 'Width', value: '3.4m total opening' },
      { label: 'Height', value: '1.8m at centre' },
      { label: 'Style', value: 'Victorian spear-top' },
      { label: 'Finish', value: 'Black satin powder coat' },
      { label: 'Automation', value: 'Underground motors' },
    ],
    keywords: [
      'victorian gates dulwich',
      'conservation area gates',
      'period gates south london',
      'edwardian house gates',
    ],
  },

  'automated-sliding-gate-bromley': {
    slug: 'automated-sliding-gate-bromley',
    title: 'Automated Sliding Gate',
    subtitle: 'Space-efficient solution for sloped driveway',
    location: 'Bromley, BR1',
    area: 'South East London',
    projectType: 'Residential automated gate',
    completedDate: '2026-04',
    description:
      'A tracked sliding gate installation for a property with a sloped driveway where traditional swing gates were not practical. The project included full automation with intercom integration.',
    challenge:
      'The driveway slopes significantly toward the house, making swing gates impossible — they would scrape the ground on opening. The client also needed the gate to integrate with their existing video intercom system.',
    solution:
      'We specified a tracked sliding gate with the track set into the slope gradient. The motor was positioned to account for the incline, and we integrated the automation with the existing intercom so visitors can be admitted remotely. A battery backup ensures operation during power cuts.',
    result:
      'The gate operates smoothly despite the challenging gradient. The client reports it has transformed their daily routine — no more getting out of the car to open gates in the rain. The intercom integration means they can admit deliveries remotely.',
    specifications: [
      { label: 'Gate type', value: 'Tracked sliding' },
      { label: 'Width', value: '4.2m opening' },
      { label: 'Height', value: '1.6m' },
      { label: 'Style', value: 'Contemporary horizontal' },
      { label: 'Finish', value: 'Anthracite RAL 7016' },
      { label: 'Automation', value: 'Sliding motor with intercom integration' },
    ],
    keywords: [
      'sliding gate bromley',
      'automated gates south london',
      'sloped driveway gate',
      'electric gate installation',
    ],
  },

  'security-gates-commercial-greenwich': {
    slug: 'security-gates-commercial-greenwich',
    title: 'Commercial Security Gates',
    subtitle: 'Multi-gate access control for business premises',
    location: 'Greenwich, SE10',
    area: 'South East London',
    projectType: 'Commercial security installation',
    completedDate: '2026-02',
    description:
      'A comprehensive security gate installation for a commercial property requiring controlled vehicle and pedestrian access, with integration into an existing access control system.',
    challenge:
      'The business needed separate vehicle and pedestrian access points, all controlled by their existing fob system. The gates needed to be robust enough for daily commercial use while maintaining a professional appearance.',
    solution:
      'We installed a cantilever sliding gate for vehicle access — chosen to avoid a ground track that would be problematic with heavy vehicle traffic. A matching pedestrian gate with magnetic lock provides staff access. Both gates integrate with the existing access control via relay outputs.',
    result:
      'The installation has improved site security and streamlined access for staff and deliveries. The cantilever mechanism handles the daily traffic without maintenance issues, and the consistent design presents a professional frontage.',
    specifications: [
      { label: 'Vehicle gate', value: 'Cantilever sliding, 5m opening' },
      { label: 'Pedestrian gate', value: 'Single swing, 1.1m' },
      { label: 'Height', value: '2.0m (security height)' },
      { label: 'Style', value: 'Contemporary vertical bar' },
      { label: 'Finish', value: 'Black gloss powder coat' },
      { label: 'Access control', value: 'Fob system integration' },
    ],
    keywords: [
      'commercial gates greenwich',
      'security gates london',
      'cantilever gate installation',
      'business security gates',
    ],
  },
}

export const CASE_STUDY_SLUGS: CaseStudySlug[] = [
  'victorian-gates-dulwich',
  'automated-sliding-gate-bromley',
  'security-gates-commercial-greenwich',
]
