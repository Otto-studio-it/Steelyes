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

export type FAQ = {
  question: string
  answer: string
}

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
  faqs: FAQ[]
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
    faqs: [
      {
        question: 'Do you install gates across all South London postcodes?',
        answer: 'Yes, we cover SE, SW, BR and CR postcodes from our Sydenham workshop. Our team regularly works in Dulwich, Peckham, Brixton, Clapham, Lewisham, Greenwich, and surrounding areas.',
      },
      {
        question: 'How quickly can you survey a South London property?',
        answer: 'Being local, we can typically arrange surveys within a week for South London addresses. Many bookings can be accommodated within a few days depending on current schedule.',
      },
      {
        question: 'Are there any travel charges for South London installations?',
        answer: 'There are no additional travel charges for properties within our core South London coverage area. The survey and installation costs are included in your quotation.',
      },
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
    faqs: [
      {
        question: 'Where exactly is your Sydenham workshop?',
        answer: 'We\'re at 106 Newlands Park Road, Sydenham, London SE26 5NB. The workshop is near Sydenham station and easily accessible from Crystal Palace, Forest Hill, and Penge.',
      },
      {
        question: 'Can I visit the workshop to see gate samples?',
        answer: 'Yes, we welcome visits by appointment. You can see fabrication in progress, material samples, and discuss your project directly with our team.',
      },
      {
        question: 'Do Sydenham projects get faster turnaround?',
        answer: 'Local projects often benefit from quicker surveys and reduced logistics time. Being neighbours means we can be more flexible with timing and follow-up visits.',
      },
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
    faqs: [
      {
        question: 'Do I need planning permission for gates in Lewisham?',
        answer: 'Most residential gates don\'t require planning permission under permitted development. However, properties in Blackheath conservation area may need approval. We can advise during the survey.',
      },
      {
        question: 'Can you make gates for terraced houses in Lewisham?',
        answer: 'Yes, many Lewisham terraces have side access or front garden gates. We design gates to maximise space efficiency for urban properties.',
      },
      {
        question: 'Are you familiar with Lewisham Council requirements?',
        answer: 'As a local business within the borough, we\'re experienced with Lewisham planning guidelines and conservation area requirements.',
      },
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
    faqs: [
      {
        question: 'What gate types work best for Bromley\'s larger driveways?',
        answer: 'Sliding gates are popular in Bromley where there\'s space along the boundary. For driveways over 4m wide, we often recommend cantilever systems that don\'t require a ground track.',
      },
      {
        question: 'Do you cover all Bromley postcodes?',
        answer: 'Yes, we serve all BR postcodes including Bromley, Beckenham, Chislehurst, Orpington, Petts Wood, Hayes, and surrounding areas.',
      },
      {
        question: 'Can you integrate gates with existing intercom systems?',
        answer: 'Absolutely. Many Bromley properties already have intercom or video entry. We integrate automation with existing systems or can install new complete solutions.',
      },
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
    faqs: [
      {
        question: 'Can you match heritage gate styles in Greenwich conservation areas?',
        answer: 'Yes, we regularly work in Blackheath and Greenwich conservation areas. We can design gates that meet heritage guidelines while incorporating modern security features.',
      },
      {
        question: 'Do you make gates for riverside developments?',
        answer: 'Yes, we serve Greenwich Peninsula and riverside properties. Coastal-adjacent locations may benefit from galvanised finishes for additional corrosion resistance.',
      },
      {
        question: 'What\'s the lead time for Greenwich projects?',
        answer: 'Typical projects take 4-8 weeks from survey to installation. Being close to our Sydenham workshop means surveys can be arranged quickly.',
      },
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
    faqs: [
      {
        question: 'Do you cover South Croydon and the CR8 area?',
        answer: 'Yes, we serve all Croydon postcodes including Purley, Coulsdon, Sanderstead (CR5, CR8), and central Croydon (CR0, CR2).',
      },
      {
        question: 'What security features can gates include?',
        answer: 'Options include automated locks, intercom/video entry, sensor lighting, and integration with home security systems. We discuss requirements during the survey.',
      },
      {
        question: 'Can you install matching pedestrian and driveway gates?',
        answer: 'Absolutely. Many Croydon properties benefit from coordinated designs where the pedestrian gate complements the main driveway gates in style and finish.',
      },
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
    faqs: [
      {
        question: 'Is there a travel charge for Surrey properties?',
        answer: 'Most of Surrey is within our standard coverage area with no additional travel fees. For properties further into the county, any charges are confirmed before booking a survey.',
      },
      {
        question: 'Can you work with estate managers and landscapers?',
        answer: 'Yes, we regularly coordinate with other contractors on larger Surrey projects. We can work to existing plans or collaborate on integrated entrance designs.',
      },
      {
        question: 'What gate widths can you fabricate for estate entrances?',
        answer: 'We fabricate gates to any width required. Estate entrances often need 5-6m openings, which we typically serve with sliding or bi-fold mechanisms.',
      },
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
    faqs: [
      {
        question: 'Which parts of Kent do you cover?',
        answer: 'We serve North and West Kent including Sevenoaks, Tonbridge, Tunbridge Wells, Dartford, Gravesend, and the Medway towns. Contact us for locations further into the county.',
      },
      {
        question: 'Can you handle uneven or rural sites?',
        answer: 'Yes, rural Kent properties often have challenging access. We engineer solutions for slopes, uneven ground, and long approaches during the survey.',
      },
      {
        question: 'Do you provide gates suitable for farms and estates?',
        answer: 'Absolutely. We fabricate field gates, five-bar style gates, and estate entrance gates. Designs can be traditional or contemporary depending on the setting.',
      },
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
