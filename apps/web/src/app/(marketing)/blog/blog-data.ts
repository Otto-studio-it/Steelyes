/**
 * Blog post metadata for SEO content marketing.
 * Posts target informational keywords that lead to commercial intent.
 */

export type BlogPostSlug =
  | 'steel-gate-costs-london-2026'
  | 'swing-vs-sliding-gates'
  | 'automating-existing-gates'
  | 'planning-permission-driveway-gates'

export type BlogPost = {
  slug: BlogPostSlug
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  readingTime: string
  category: 'guides' | 'costs' | 'maintenance' | 'planning'
  keywords: string[]
  content: string
}

export const BLOG_POSTS: Record<BlogPostSlug, BlogPost> = {
  'steel-gate-costs-london-2026': {
    slug: 'steel-gate-costs-london-2026',
    title: 'How Much Do Steel Gates Cost in London? (2026 Guide)',
    description:
      'A complete guide to steel gate prices in London for 2026. From basic manual gates to fully automated systems, understand what affects costs and get realistic budget expectations.',
    publishedAt: '2026-09-16',
    readingTime: '8 min read',
    category: 'costs',
    keywords: [
      'steel gate cost london',
      'driveway gate prices',
      'electric gate cost uk',
      'how much do gates cost',
    ],
    content: `
## What Affects Steel Gate Prices?

The cost of a bespoke steel gate in London depends on several factors:

### 1. Gate Type and Mechanism
- **Double swing gates**: The most common choice for UK driveways. Manual versions start from around £3,500 for a standard width, with automated systems from £6,000.
- **Sliding gates**: Require more engineering for the track and motor. Budget from £5,500 for manual, £8,000+ for automated.
- **Cantilever gates**: Premium option with no ground track. Typically £8,000-15,000 depending on width.

### 2. Width and Height
Gate pricing scales with size. A 3-metre opening costs significantly less than a 5-metre opening due to:
- More steel required
- Heavier components needing stronger posts
- Larger motors for automation

### 3. Automation
Adding automation typically adds £1,500-4,000 to the project:
- Ram-arm motors: £1,500-2,500
- Underground motors: £2,500-4,000
- Sliding gate motors: £2,000-3,500

### 4. Style and Finish
- Victorian spear-top railings: Standard pricing
- Solid infill panels: 15-25% premium
- Custom designs: Quoted per project

## Typical London Prices (2026)

| Gate Type | Manual | Automated |
|-----------|--------|-----------|
| Double swing (3m) | £3,500-5,500 | £6,000-9,000 |
| Double swing (4m) | £4,500-7,000 | £7,500-11,000 |
| Tracked sliding (4m) | £5,500-8,000 | £8,000-12,000 |
| Cantilever (4m) | £7,000-10,000 | £10,000-15,000 |

*Prices include supply and installation. Survey required for accurate quotation.*

## What's Included in a Quote?

A professional gate installation should include:
- Site survey and measurement
- Fabrication drawings
- All steelwork and hardware
- Posts and foundations
- Automation (if specified)
- Installation and commissioning
- Documentation and handover

## Getting an Accurate Quote

Every entrance is different. Online estimates give a starting point, but the only way to get an accurate price is through a site survey. This allows us to assess:
- Ground conditions and drainage
- Existing infrastructure
- Access for installation
- Any planning considerations

[Request a free survey](/contact) to get a detailed specification and fixed quote for your project.
    `,
  },

  'swing-vs-sliding-gates': {
    slug: 'swing-vs-sliding-gates',
    title: 'Swing vs Sliding Gates: Which is Right for Your Driveway?',
    description:
      'Comparing swing and sliding driveway gates. Learn which mechanism suits your property based on space, gradient, and usage patterns.',
    publishedAt: '2026-09-16',
    readingTime: '6 min read',
    category: 'guides',
    keywords: [
      'swing vs sliding gates',
      'driveway gate types',
      'sliding gate vs swing gate',
      'best gate for driveway',
    ],
    content: `
## The Space Question

The main factor determining whether you need swing or sliding gates is **space**.

### Swing Gates Need:
- Clear arc inside the driveway
- Typically 2.5-3m clearance from gate line
- Relatively level ground in the swing area

### Sliding Gates Need:
- Run-back space along the fence line
- Usually 1.1-1.3x the gate width
- Ground track or cantilever mechanism

## When to Choose Swing Gates

Swing gates work best when:
- Your drive is long enough for cars to clear the gate arc
- The ground is level in the swing area
- You want the classic "double opening" look
- Budget is a primary concern (usually cheaper than sliding)

## When to Choose Sliding Gates

Sliding gates are the better choice when:
- Cars park close to the gate line
- The driveway slopes toward the road
- You have space along the boundary
- Security is a priority (harder to force open)

## Automation Considerations

Both gate types can be automated, but the systems differ:

**Swing gate automation:**
- Ram-arm motors (visible, cost-effective)
- Underground motors (hidden, premium)
- Requires power and safety sensors

**Sliding gate automation:**
- Rack and pinion motor system
- Generally more robust for heavy use
- Photocells and safety edges required

## Cost Comparison

Sliding gates typically cost 15-30% more than equivalent swing gates due to:
- More complex mechanism
- Track or cantilever engineering
- Heavier-duty motors

However, in some situations sliding is the only practical option regardless of cost.

## Making the Decision

Visit our [gate configurator](/configurator) to explore both options visually, or [request a survey](/contact) and we'll recommend the best solution for your specific entrance.
    `,
  },

  'automating-existing-gates': {
    slug: 'automating-existing-gates',
    title: 'Automating Existing Manual Gates: A Complete Guide',
    description:
      'Can you add automation to existing manual gates? Learn about retrofit options, costs, and what to consider before automating your current driveway gates.',
    publishedAt: '2026-09-16',
    readingTime: '7 min read',
    category: 'guides',
    keywords: [
      'automate existing gates',
      'retrofit gate automation',
      'add motor to manual gate',
      'gate automation cost',
    ],
    content: `
## Can Any Gate Be Automated?

Most well-built manual gates can be automated, but several factors determine suitability:

### Structural Requirements
- **Gate weight**: Motors have maximum weight ratings
- **Hinge condition**: Must be in good order
- **Post stability**: Need to support motor forces
- **Gate balance**: Should swing freely without binding

### Technical Assessment
Before quoting retrofit automation, we check:
- Gate leaf weight and dimensions
- Post material and fixing method
- Hinge type and condition
- Available power supply location
- Safety sensor placement options

## Retrofit Automation Options

### Ram-Arm Motors
Most common for retrofit projects:
- Bolts to existing posts
- Works with most swing gates
- Visible but compact
- Cost: £1,200-2,200 per pair

### Underground Motors
Premium hidden option:
- Requires excavation at hinges
- Often not practical for retrofit
- Cost: £2,200-3,800 per pair

### Sliding Gate Conversion
Sometimes the best solution:
- Convert swing to sliding
- Requires new track and gate
- More cost but better result

## What's Involved?

A typical retrofit automation project includes:
1. Site survey and motor specification
2. Power supply installation or routing
3. Motor mounting and alignment
4. Control board programming
5. Safety device installation
6. Testing and commissioning

## Costs for London Properties

| Configuration | Typical Cost |
|--------------|--------------|
| Ram-arm pair (double swing) | £1,200-2,200 |
| Single swing gate | £900-1,500 |
| Video intercom addition | £350-700 |
| Keypad entry | £200-400 |

## When Retrofit Isn't Recommended

Sometimes it's better to replace the gates entirely:
- Gates are corroded or damaged
- Posts are unstable
- Hinges are worn
- Gates don't hang level
- You want to change the style

In these cases, a new supply and install project gives better long-term value.

[Book a survey](/contact) to assess your existing gates and get a clear recommendation.
    `,
  },

  'planning-permission-driveway-gates': {
    slug: 'planning-permission-driveway-gates',
    title: 'Do You Need Planning Permission for Driveway Gates?',
    description:
      'Understanding UK planning rules for driveway gates. Height limits, conservation areas, and when you need to apply for permission.',
    publishedAt: '2026-09-16',
    readingTime: '5 min read',
    category: 'planning',
    keywords: [
      'planning permission gates',
      'driveway gate regulations',
      'gate height limit',
      'permitted development gates',
    ],
    content: `
## Permitted Development Rules

In most cases, you **don't need planning permission** for driveway gates if:
- Gate height is **2 metres or less**
- Not adjacent to a highway used by vehicles (1 metre limit)
- Property isn't listed
- Not in a conservation area (some restrictions may apply)

## Height Limits Explained

### Standard Properties
- **2 metres maximum** anywhere on the property
- Measured from ground level on the higher side

### Adjacent to a Highway
- **1 metre maximum** where gate opens onto a road used by vehicles
- This applies to most front driveway gates

### Posts and Piers
- Posts are measured separately
- Often slightly taller than the gate for visual reasons
- Same height rules apply

## Conservation Areas

If your property is in a conservation area:
- Permitted development rights may be restricted
- Check with your local planning authority
- Design should be sympathetic to the area character
- We can advise on appropriate styles

## Listed Buildings

For listed properties:
- **Listed building consent** usually required
- Gates must be appropriate to the building's character
- May affect settings even if gates are new
- Consult your local conservation officer

## Automation and Electrical Work

Adding automation to gates doesn't typically require planning permission, but:
- Electrical work should comply with Part P regulations
- Safety standards (machinery directive) apply
- Professional installation recommended

## Our Approach

We survey every site and can advise on:
- Likely planning requirements
- Appropriate heights and styles
- Conservation area considerations
- When to seek pre-application advice

This isn't formal planning advice—always confirm with your local authority for your specific situation.

[Discuss your project](/contact) and we'll help you understand what's possible.
    `,
  },
}

export const BLOG_POST_SLUGS: BlogPostSlug[] = [
  'steel-gate-costs-london-2026',
  'swing-vs-sliding-gates',
  'automating-existing-gates',
  'planning-permission-driveway-gates',
]

export const BLOG_CATEGORIES = {
  guides: { label: 'Guides', description: 'How-to guides and comparisons' },
  costs: { label: 'Costs', description: 'Pricing information and budgeting' },
  maintenance: { label: 'Maintenance', description: 'Care and upkeep advice' },
  planning: { label: 'Planning', description: 'Regulations and permissions' },
} as const
