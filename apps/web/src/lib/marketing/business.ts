/**
 * Confirmed business details and safe public copy fallbacks.
 * Update here when Marius supplies company number, VAT, or final contact info.
 */

export const BUSINESS = {
  legalName: 'Steelyes Ltd',
  tradingName: 'Steelyes',
  /** Official public inbox — invoices, site enquiries, quote notifications. */
  email: 'info@steelyes.co.uk',
  phone: '+447803002145',
  phoneDisplay: '+44 7803 002145',
  website: 'https://www.steelyes.co.uk',
  address: {
    line1: '106 Newlands Park Road',
    locality: 'Sydenham',
    region: 'London',
    postalCode: 'SE26 5NB',
    country: 'United Kingdom',
  },
  /**
   * CA-07 — canonical social profiles (tracking params stripped).
   * Facebook is still a share/ redirect until Marius supplies a vanity URL.
   */
  social: {
    instagram: 'https://www.instagram.com/steelyes_ltd',
    facebook: 'https://www.facebook.com/share/179t5dQVcD/',
    tiktok: 'https://www.tiktok.com/@steelyesltd',
  },
  /** Intake PDF 2026-07-26. */
  companyNumber: '13415956' as string | null,
  vatNumber: '392 1130 22' as string | null,
} as const

export const BUSINESS_SAME_AS = [
  BUSINESS.social.instagram,
  BUSINESS.social.facebook,
  BUSINESS.social.tiktok,
] as const

export const PRICING_DISCLAIMER =
  'Estimated pricing. Final quotation confirmed after site survey.'

export const COVERAGE_COPY = {
  headline: 'UK projects',
  body: 'We take commissions across the United Kingdom. Service availability and survey scheduling are confirmed per enquiry.',
} as const

export const SURVEY_COPY = {
  headline: 'Survey-led',
  body: 'Site surveys are arranged per project. Scope and any survey fee are confirmed before booking.',
} as const

export const GALLERY_CONSENT_NOTICE =
  'Gallery images show completed Steelyes work. Residential property photos are published only with owner consent. Some images may show workshop or in-progress fabrication.'

export const LEGAL_DRAFT_NOTICE =
  'Legal pages are under final review. Company registration and VAT appear in the site footer.'

export function formatBusinessAddress(multiline = true): string {
  const { line1, locality, region, postalCode, country } = BUSINESS.address
  if (multiline) {
    return `${line1}\n${locality}, ${region}, ${postalCode}\n${country}`
  }
  return `${line1}, ${locality}, ${region}, ${postalCode}, ${country}`
}

export function formatCompanyRegistration(): string {
  if (BUSINESS.companyNumber) {
    return `Company no. ${BUSINESS.companyNumber}`
  }
  return 'Company no. pending confirmation'
}

export function formatVatRegistration(): string {
  if (BUSINESS.vatNumber) {
    return `VAT ${BUSINESS.vatNumber}`
  }
  return 'VAT no. pending confirmation'
}
