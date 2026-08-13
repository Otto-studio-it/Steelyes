/**
 * Schema.org JSON-LD builders shared across marketing pages.
 * Keeps entity data (provider, sameAs, areaServed) consistent everywhere it appears.
 */

import { BUSINESS, BUSINESS_SAME_AS } from './business'

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${BUSINESS.website}${path}`
}

/** PNG, 180×180 — Google's logo structured data does not support SVG. */
const LOGO_URL = `${BUSINESS.website}/apple-icon`

const PROVIDER = {
  '@type': ['LocalBusiness', 'GeneralContractor'],
  name: BUSINESS.legalName,
  url: BUSINESS.website,
  telephone: BUSINESS.phoneDisplay,
  logo: LOGO_URL,
  sameAs: [...BUSINESS_SAME_AS],
} as const

/**
 * Site-wide brand entity — renders on every page via the root layout, so
 * pages with no other schema (legal, gallery, ...) still carry an Organization.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.legalName,
    alternateName: BUSINESS.tradingName,
    url: BUSINESS.website,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: BUSINESS.phoneDisplay,
    email: BUSINESS.email,
    sameAs: [...BUSINESS_SAME_AS],
  }
}

type BreadcrumbItem = { name: string; path: string }

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

type ServiceSchemaInput = {
  name: string
  description: string
  path: string
  serviceType: string
  image?: string
}

/**
 * Bespoke, survey-priced work — no fixed catalogue price exists, so this stays
 * a Service (not Product+Offer) to avoid implying a price we can't confirm pre-survey.
 */
export function serviceSchema({ name, description, path, serviceType, image }: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
    provider: PROVIDER,
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
  }
}

type ItemListEntry = { name: string; path: string; description?: string }

export function itemListSchema(items: ItemListEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      ...(item.description ? { description: item.description } : {}),
    })),
  }
}

type HowToStep = { name: string; text: string }

type HowToSchemaInput = {
  name: string
  description: string
  path: string
  steps: HowToStep[]
}

export function howToSchema({ name, description, path, steps }: HowToSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: absoluteUrl(path),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

type FaqItem = { question: string; answer: string }

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
