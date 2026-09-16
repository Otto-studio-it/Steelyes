import type { Metadata } from 'next'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { SocialLinks } from '@/components/marketing/SocialLinks'
import { FAQSection, FAQSchemaScript, type FAQItem } from '@/components/marketing/FAQSection'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { isValidShareToken } from '@/lib/configurator/share-token'

import { BUSINESS, COVERAGE_COPY, SURVEY_COPY } from '@/lib/marketing/business'
import { GATE_DATA, resolveGateSlug } from '@/app/(marketing)/gates/gate-marketing-data'
import { breadcrumbSchema } from '@/lib/marketing/schema'

import { ContactForm } from './ContactForm'

const CONTACT_FAQ: FAQItem[] = [
  {
    question: 'How much does a site survey cost?',
    answer: 'Most residential surveys within London and the South East are free. For larger or complex projects, or locations further afield, there may be a survey fee which is confirmed before booking. Any fee is credited against the final order.',
  },
  {
    question: 'How quickly can you provide a quote?',
    answer: 'We respond to enquiries within 1 business day with initial guidance. A formal written quotation is provided after the site survey, typically within 3-5 working days of the survey visit.',
  },
  {
    question: 'What information do you need to provide a quote?',
    answer: 'Helpful information includes: approximate opening width, gate type preference (swing/sliding), whether automation is wanted, any photos of the entrance, and your postcode. The more detail you provide, the more accurate our initial guidance will be.',
  },
  {
    question: 'Do you offer finance or payment plans?',
    answer: 'We require a deposit on order (typically 50%) with the balance due before installation. We don\'t currently offer formal finance, but can discuss staged payments for larger projects.',
  },
  {
    question: 'What areas do you cover?',
    answer: 'We cover London, Surrey, Kent, and the wider South East for full supply and installation. For supply-only orders, we deliver nationwide. Coverage and any travel fees are confirmed when you get in touch.',
  },
]

export const metadata: Metadata = {
  title: 'Request a Steel Gate Quote London | Contact Steelyes',
  description:
    'Get a quote for bespoke steel gates in London. Contact our Sydenham workshop for driveway gates, electric gates, railings or security steelwork. Free site survey available.',
  alternates: { canonical: '/contact' },
  keywords: ['steel gates quote london', 'gate fabricator contact', 'driveway gates south london', 'steelyes contact'],
}

type ContactPageProps = {
  searchParams?: {
    shareToken?: string
    gate?: string
  }
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const shareToken = searchParams?.shareToken?.trim()
  const gateSlug = searchParams?.gate ? resolveGateSlug(searchParams.gate) : null
  const gateInterest = gateSlug ? GATE_DATA[gateSlug] : null
  const attachedConfig =
    shareToken && isValidShareToken(shareToken)
      ? await loadGateConfigurationByShareToken(shareToken)
      : null
  const pricingCatalog = attachedConfig ? await fetchPricingCatalog() : undefined

  return (
    <MarketingShell pathname="/contact">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <p className="mb-3 inline-block border-l-2 border-primary bg-paper px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
          Start your project
        </p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">Contact the workshop</h1>
        <p className="mt-3 max-w-xl font-mono text-sm text-muted-deep">
          {gateInterest
            ? `Enquiry focused on ${gateInterest.title.toLowerCase()} gates.`
            : 'Direct line to our fabrication team.'}
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <ContactForm
          shareToken={attachedConfig ? shareToken : undefined}
          attachedConfig={attachedConfig}
          pricingCatalog={pricingCatalog}
          gateInterest={gateInterest ? { title: gateInterest.title, customerVoice: gateInterest.customerVoice } : null}
        />

        <div className="space-y-8">
          <div className="flex aspect-video w-full items-center justify-center border border-zinc-200 bg-steel p-8">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Coverage</p>
              <p className="mt-3 font-heading text-4xl font-black uppercase text-white">{COVERAGE_COPY.headline}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-white/60">{COVERAGE_COPY.body}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-primary">The Workshop</h2>
              <p className="text-sm text-muted-deep">{BUSINESS.address.line1}</p>
              <p className="text-sm text-muted-deep">
                {BUSINESS.address.locality}, {BUSINESS.address.region}, {BUSINESS.address.postalCode}
              </p>
              <p className="text-sm text-muted-deep">{BUSINESS.address.country}</p>
            </div>
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-primary">Direct contact</h2>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="block text-sm text-muted-deep transition-colors hover:text-primary"
              >
                T: {BUSINESS.phoneDisplay}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="block text-sm text-muted-deep transition-colors hover:text-primary"
              >
                E: {BUSINESS.email}
              </a>
              <SocialLinks className="mt-3 -ml-2.5" iconClassName="text-muted-deep hover:text-primary" />
            </div>
          </div>
          <div className="border border-zinc-200 bg-canvas p-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{SURVEY_COPY.headline}</p>
            <p className="mt-2 font-heading text-xl font-black uppercase">Enquiry response</p>
            <p className="mt-3 text-sm text-muted-deep">{SURVEY_COPY.body}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <FAQSection
            subtitle="Before you get in touch"
            title="Quote process questions"
            items={CONTACT_FAQ}
          />
        </div>
      </section>

      <FAQSchemaScript items={CONTACT_FAQ} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'GeneralContractor'],
            '@id': `${BUSINESS.website}/#business`,
            name: BUSINESS.legalName,
            alternateName: 'Steelyes',
            url: BUSINESS.website,
            telephone: BUSINESS.phoneDisplay,
            email: BUSINESS.email,
            logo: `${BUSINESS.website}/apple-icon`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: BUSINESS.address.line1,
              addressLocality: BUSINESS.address.locality,
              addressRegion: BUSINESS.address.region,
              postalCode: BUSINESS.address.postalCode,
              addressCountry: 'GB',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 51.4285,
              longitude: -0.0485,
            },
            areaServed: [
              { '@type': 'City', name: 'London' },
              { '@type': 'AdministrativeArea', name: 'South East London' },
              { '@type': 'AdministrativeArea', name: 'Surrey' },
              { '@type': 'AdministrativeArea', name: 'Kent' },
              { '@type': 'Country', name: 'United Kingdom' },
            ],
            priceRange: '££££',
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '17:00',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: BUSINESS.phoneDisplay,
              email: BUSINESS.email,
              contactType: 'customer service',
              areaServed: 'GB',
              availableLanguage: 'English',
            },
          }),
        }}
      />
    </MarketingShell>
  )
}
