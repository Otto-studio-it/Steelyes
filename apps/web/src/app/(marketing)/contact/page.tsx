import type { Metadata } from 'next'

import { loadGateConfigurationByShareToken } from '@/app/(marketing)/configurator/actions'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { isValidShareToken } from '@/lib/configurator/share-token'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Request a Steel Gate Quote | Contact Steelyes',
  description:
    'Get a quote for bespoke steel gates, electric gates, railings or security steelwork. Share your brief, measurements or photos to start a survey-led specification.',
}

type ContactPageProps = {
  searchParams?: {
    shareToken?: string
  }
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const shareToken = searchParams?.shareToken?.trim()
  const attachedConfig =
    shareToken && isValidShareToken(shareToken)
      ? await loadGateConfigurationByShareToken(shareToken)
      : null

  return (
    <MarketingShell pathname="/contact">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <p className="mb-3 inline-block border-l-2 border-[#9E000C] bg-[#EFEEEB] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
          Start your project
        </p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">Contact the workshop</h1>
        <p className="mt-3 max-w-xl font-mono text-sm text-[#5C403D]">Direct line to our fabrication team.</p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <ContactForm shareToken={attachedConfig ? shareToken : undefined} attachedConfig={attachedConfig} />

        <div className="space-y-8">
          <div className="flex aspect-video w-full items-center justify-center border border-zinc-200 bg-[#1B1C1A] p-8">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Coverage</p>
              <p className="mt-3 font-heading text-4xl font-black uppercase text-white">UK-wide</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-white/60">
                Site survey available across England,<br />Wales &amp; Scotland
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">The Workshop</h2>
              <p className="text-sm text-[#5C403D]">Unit 7, Meridian Industrial Estate</p>
              <p className="text-sm text-[#5C403D]">Enfield, London, EN3 7TW</p>
              <p className="text-sm text-[#5C403D]">United Kingdom</p>
            </div>
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">Direct contact</h2>
              <a
                href="tel:+447803002145"
                className="block text-sm text-[#5C403D] transition-colors hover:text-[#9E000C]"
              >
                T: +44 7803 002145
              </a>
              <a
                href="mailto:steelyes@yahoo.com"
                className="block text-sm text-[#5C403D] transition-colors hover:text-[#9E000C]"
              >
                E: steelyes@yahoo.com
              </a>
            </div>
          </div>
          <div className="border border-zinc-200 bg-[#F6F6F6] p-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Response window</p>
            <p className="mt-2 font-heading text-3xl font-black uppercase">24-48h</p>
            <p className="mt-3 text-sm text-[#5C403D]">Typical callback for survey bookings and technical feasibility.</p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'GeneralContractor'],
            name: 'Steelyes',
            url: 'https://www.steelyes.co.uk',
            telephone: '+44 7803 002145',
            email: 'steelyes@yahoo.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Unit 7, Meridian Industrial Estate',
              addressLocality: 'Enfield',
              addressRegion: 'London',
              postalCode: 'EN3 7TW',
              addressCountry: 'GB',
            },
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+44 7803 002145',
              email: 'steelyes@yahoo.com',
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
