/**
 * Location-specific marketing data for area landing pages.
 * Each area targets local search queries like "steel gates [area]".
 */

export type AreaSlug =
  | 'south-london'
  | 'sydenham'
  | 'lewisham'
  | 'bromley'
  | 'greenwich'
  | 'croydon'
  | 'surrey'
  | 'kent'

export type AreaData = {
  slug: AreaSlug
  name: string
  region: string
  description: string
  metaDescription: string
  postcodes?: string[]
  nearbyAreas: string[]
  localContext: string
  services: string[]
}

export const AREA_DATA: Record<AreaSlug, AreaData> = {
  'south-london': {
    slug: 'south-london',
    name: 'South London',
    region: 'Greater London',
    description:
      'Steelyes serves residential and commercial properties across South London from our Sydenham workshop. We fabricate and install bespoke steel gates, railings, balconies and security steelwork throughout the area.',
    metaDescription:
      'Steel gates South London. Bespoke driveway gates, electric gates, railings and security steelwork. Survey-led fabrication from our local Sydenham workshop.',
    postcodes: ['SE', 'SW', 'BR', 'CR'],
    nearbyAreas: ['Sydenham', 'Lewisham', 'Bromley', 'Greenwich', 'Croydon'],
    localContext:
      'South London properties often feature Victorian and Edwardian architecture requiring gates that complement period details. Our workshop in Sydenham gives us direct access to residential streets across Dulwich, Peckham, Brixton, Clapham, and surrounding areas.',
    services: [
      'Bespoke driveway gates',
      'Electric and automated gates',
      'Victorian-style railings',
      'Glass balustrades',
      'Security grilles',
    ],
  },

  sydenham: {
    slug: 'sydenham',
    name: 'Sydenham',
    region: 'SE26, London',
    description:
      'Our workshop is based in Sydenham at 106 Newlands Park Road, SE26 5NB. Local projects benefit from reduced logistics costs and faster turnaround times.',
    metaDescription:
      'Steel gates Sydenham SE26. Local workshop at 106 Newlands Park Road. Bespoke driveway gates, railings and metalwork from your neighbourhood fabricator.',
    postcodes: ['SE26', 'SE23', 'SE6'],
    nearbyAreas: ['Forest Hill', 'Catford', 'Bellingham', 'Penge', 'Crystal Palace'],
    localContext:
      'Sydenham and the surrounding SE26 area features a mix of Victorian terraces, Edwardian semis, and post-war developments. Many properties have front gardens suitable for driveway gates, and the hilly terrain often requires careful consideration of gate mechanisms and drainage.',
    services: [
      'Local site surveys',
      'Same-week consultations',
      'Driveway gates for sloped entrances',
      'Victorian railings',
      'Side access gates',
    ],
  },

  lewisham: {
    slug: 'lewisham',
    name: 'Lewisham',
    region: 'SE London Borough',
    description:
      'We serve the London Borough of Lewisham including Blackheath, Deptford, New Cross, Brockley and Catford. Our Sydenham workshop is within the borough, making local surveys straightforward.',
    metaDescription:
      'Steel gates Lewisham. Bespoke driveway gates, electric gates and railings across the borough. Local fabricator based in Sydenham SE26.',
    postcodes: ['SE4', 'SE6', 'SE8', 'SE13', 'SE14', 'SE23', 'SE26'],
    nearbyAreas: ['Blackheath', 'Deptford', 'New Cross', 'Brockley', 'Catford'],
    localContext:
      'Lewisham borough includes conservation areas in Blackheath and period properties throughout. Gate designs often need to respect local planning guidelines while providing security for urban properties.',
    services: [
      'Conservation-area compliant gates',
      'Period-appropriate railings',
      'Electric gates for terraced properties',
      'Security gates',
      'Balcony steelwork',
    ],
  },

  bromley: {
    slug: 'bromley',
    name: 'Bromley',
    region: 'BR London Borough',
    description:
      'Steelyes covers the London Borough of Bromley including Beckenham, Chislehurst, Orpington, Petts Wood and Hayes. Larger properties in these areas often require wider driveway gates and automation.',
    metaDescription:
      'Steel gates Bromley. Bespoke driveway gates, automated gates and railings. Serving Beckenham, Chislehurst, Orpington and surrounding BR postcodes.',
    postcodes: ['BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR6', 'BR7'],
    nearbyAreas: ['Beckenham', 'Chislehurst', 'Orpington', 'Petts Wood', 'Hayes'],
    localContext:
      'Bromley properties tend to have larger plots and longer driveways than inner London. Many clients request sliding or cantilever gates where space allows, and automation is popular for the convenience it offers.',
    services: [
      'Wide driveway gates (4m+)',
      'Sliding and cantilever gates',
      'Gate automation systems',
      'Estate railings',
      'Security perimeters',
    ],
  },

  greenwich: {
    slug: 'greenwich',
    name: 'Greenwich',
    region: 'SE London Borough',
    description:
      'We serve the Royal Borough of Greenwich including Blackheath, Eltham, Woolwich, Charlton and Greenwich town. The area includes both historic properties and modern developments.',
    metaDescription:
      'Steel gates Greenwich. Bespoke gates and railings for historic and modern properties. Serving Blackheath, Eltham, Woolwich and SE postcodes.',
    postcodes: ['SE3', 'SE7', 'SE9', 'SE10', 'SE18'],
    nearbyAreas: ['Blackheath', 'Eltham', 'Woolwich', 'Charlton', 'Kidbrooke'],
    localContext:
      'Greenwich combines Georgian terraces, Victorian villas, and contemporary riverside developments. Gate designs range from traditional wrought-iron styles for period properties to minimalist steel panels for modern homes.',
    services: [
      'Heritage-style gates',
      'Contemporary steel gates',
      'Riverside property gates',
      'Automated access systems',
      'Railings and balustrades',
    ],
  },

  croydon: {
    slug: 'croydon',
    name: 'Croydon',
    region: 'CR London Borough',
    description:
      'Steelyes serves the London Borough of Croydon including Purley, Coulsdon, Sanderstead, Selsdon and South Croydon. The borough offers a mix of suburban properties with substantial frontages.',
    metaDescription:
      'Steel gates Croydon. Bespoke driveway gates and railings across CR postcodes. Serving Purley, Coulsdon, Sanderstead and surrounding areas.',
    postcodes: ['CR0', 'CR2', 'CR5', 'CR8'],
    nearbyAreas: ['Purley', 'Coulsdon', 'Sanderstead', 'Selsdon', 'South Croydon'],
    localContext:
      'Croydon offers larger suburban properties, particularly in the southern parts of the borough. Many homes have space for double gates and the driveways to accommodate them, making automation practical.',
    services: [
      'Double driveway gates',
      'Automated gate systems',
      'Matching pedestrian gates',
      'Front garden railings',
      'Security upgrades',
    ],
  },

  surrey: {
    slug: 'surrey',
    name: 'Surrey',
    region: 'South East England',
    description:
      'We take commissions throughout Surrey including Guildford, Woking, Epsom, Reigate and the Surrey Hills. Larger properties and longer driveways are common, often requiring bespoke engineering solutions.',
    metaDescription:
      'Steel gates Surrey. Bespoke driveway gates, electric gates and estate railings. Serving Guildford, Woking, Epsom, Reigate and surrounding areas.',
    nearbyAreas: ['Guildford', 'Woking', 'Epsom', 'Reigate', 'Cobham', 'Esher'],
    localContext:
      'Surrey properties often feature long driveways, established gardens, and privacy requirements. Gate automation is popular, and many projects involve coordinating with existing landscaping and estate management.',
    services: [
      'Estate entrance gates',
      'Long-run sliding gates',
      'Automated access control',
      'Perimeter railings',
      'Bespoke metalwork',
    ],
  },

  kent: {
    slug: 'kent',
    name: 'Kent',
    region: 'South East England',
    description:
      'Steelyes serves North and West Kent including Sevenoaks, Tonbridge, Tunbridge Wells, Dartford and the Medway towns. Rural and semi-rural properties often require gates engineered for challenging access.',
    metaDescription:
      'Steel gates Kent. Bespoke driveway gates and automated gates across Sevenoaks, Tonbridge, Tunbridge Wells, Dartford and Medway.',
    nearbyAreas: ['Sevenoaks', 'Tonbridge', 'Tunbridge Wells', 'Dartford', 'Medway'],
    localContext:
      'Kent properties range from village cottages to country estates. Gate engineering often needs to account for uneven ground, long approaches, and integration with rural settings while maintaining security.',
    services: [
      'Country estate gates',
      'Farm and field access gates',
      'Automated security systems',
      'Traditional and contemporary designs',
      'Coordination with landscaping',
    ],
  },
}

export const AREA_SLUGS: AreaSlug[] = [
  'south-london',
  'sydenham',
  'lewisham',
  'bromley',
  'greenwich',
  'croydon',
  'surrey',
  'kent',
]
