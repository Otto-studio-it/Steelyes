import type { Metadata } from 'next'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { SocialLinks } from '@/components/marketing/SocialLinks'
import { fetchPricingCatalog } from '@/lib/configurator/pricing-catalog-server'
import { isValidShareToken } from '@/lib/configurator/share-token'

import { BUSINESS, COVERAGE_COPY, SURVEY_COPY } from '@/lib/marketing/business'
import { GATE_DATA, resolveGateSlug } from '@/app/(marketing)/gates/gate-marketing-data'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Request a Steel Gate Quote | Contact Steelyes',
  description:
    'Get a quote for bespoke steel gates, electric gates, railings or security steelwork. Share your brief, measurements or photos to start a survey-led specification.',
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
        <p className="mb-3 inline-block border-l-2 border-[#9E000C] bg-[#EFEEEB] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
          Start your project
        </p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">Contact the workshop</h1>
        <p className="mt-3 max-w-xl font-mono text-sm text-[#5C403D]">
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
          <div className="flex aspect-video w-full items-center justify-center border border-zinc-200 bg-[#1B1C1A] p-8">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Coverage</p>
              <p className="mt-3 font-heading text-4xl font-black uppercase text-white">{COVERAGE_COPY.headline}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-white/60">{COVERAGE_COPY.body}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">The Workshop</h2>
              <p className="text-sm text-[#5C403D]">{BUSINESS.address.line1}</p>
              <p className="text-sm text-[#5C403D]">
                {BUSINESS.address.locality}, {BUSINESS.address.region}, {BUSINESS.address.postalCode}
              </p>
              <p className="text-sm text-[#5C403D]">{BUSINESS.address.country}</p>
            </div>
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">Direct contact</h2>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="block text-sm text-[#5C403D] transition-colors hover:text-[#9E000C]"
              >
                T: {BUSINESS.phoneDisplay}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="block text-sm text-[#5C403D] transition-colors hover:text-[#9E000C]"
              >
                E: {BUSINESS.email}
              </a>
              <SocialLinks className="mt-3 -ml-2.5" iconClassName="text-[#5C403D] hover:text-[#9E000C]" />
            </div>
          </div>
          <div className="border border-zinc-200 bg-[#F6F6F6] p-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{SURVEY_COPY.headline}</p>
            <p className="mt-2 font-heading text-xl font-black uppercase">Enquiry response</p>
            <p className="mt-3 text-sm text-[#5C403D]">{SURVEY_COPY.body}</p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'GeneralContractor'],
            name: BUSINESS.legalName,
            url: BUSINESS.website,
            telephone: BUSINESS.phoneDisplay,
            email: BUSINESS.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: BUSINESS.address.line1,
              addressLocality: BUSINESS.address.locality,
              addressRegion: BUSINESS.address.region,
              postalCode: BUSINESS.address.postalCode,
              addressCountry: 'GB',
            },
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
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
