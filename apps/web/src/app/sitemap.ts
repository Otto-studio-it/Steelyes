import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.steelyes.co.uk'

// Bump when marketing page content actually changes — not on every build/deploy,
// which would make every lastmod identical and Google discounts that as a fake signal.
const CONTENT_LAST_UPDATED = new Date('2026-09-16')

// Area slugs for local SEO pages
const AREA_SLUGS = [
  'south-london',
  'sydenham',
  'lewisham',
  'bromley',
  'greenwich',
  'croydon',
  'surrey',
  'kent',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = CONTENT_LAST_UPDATED

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/gates`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...[
      'double-swing',
      'single-swing',
      'tracked-sliding',
      'cantilever',
      'bifold',
      'single-bifold',
      'telescopic',
      'radius',
    ].map((slug) => ({
      url: `${BASE_URL}/gates/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/railings`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/balconies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/structures`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/staircases`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services/security`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Area pages for local SEO
    {
      url: `${BASE_URL}/areas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...AREA_SLUGS.map((slug) => ({
      url: `${BASE_URL}/areas/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/installation`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/configurator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...['privacy-policy', 'cookie-policy', 'terms'].map((slug) => ({
      url: `${BASE_URL}/legal/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    })),
  ]

  return routes
}
