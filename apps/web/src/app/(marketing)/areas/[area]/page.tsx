import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, MapPin, Phone } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema } from '@/lib/marketing/schema'

import { AREA_DATA, AREA_SLUGS, type AreaSlug } from '../area-data'

export function generateStaticParams() {
  return AREA_SLUGS.map((area) => ({ area }))
}

export function generateMetadata({ params }: { params: { area: string } }): Metadata {
  const area = AREA_DATA[params.area as AreaSlug]
  if (!area) return {}

  return {
    title: `Steel Gates ${area.name} | Bespoke Driveway Gates & Railings`,
    description: area.metaDescription,
    alternates: { canonical: `/areas/${area.slug}` },
    keywords: [
      `steel gates ${area.name.toLowerCase()}`,
      `driveway gates ${area.name.toLowerCase()}`,
      `electric gates ${area.name.toLowerCase()}`,
      `gate fabricator ${area.name.toLowerCase()}`,
      'bespoke gates',
    ],
  }
}

export default function AreaPage({ params }: { params: { area: string } }) {
  const area = AREA_DATA[params.area as AreaSlug]
  if (!area) notFound()

  return (
    <MarketingShell pathname={`/areas/${area.slug}`}>
      {/* Hero */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">{area.region}</span>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
            Steel Gates
            <br />
            <span className="text-primary">{area.name}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            {area.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-primary px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/configurator"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-white/40 bg-white/5 px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-white/10"
            >
              Configure a gate
            </Link>
          </div>
        </div>
      </section>

      {/* Local context */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Local expertise</p>
            <h2 className="font-heading text-3xl font-black uppercase md:text-4xl">
              Gates for {area.name} properties
            </h2>
            <p className="mt-4 text-base font-light leading-relaxed text-muted-deep">{area.localContext}</p>

            {area.postcodes && (
              <div className="mt-6">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">Postcodes served</p>
                <div className="flex flex-wrap gap-2">
                  {area.postcodes.map((code) => (
                    <span
                      key={code}
                      className="border border-zinc-200 bg-paper px-3 py-1 font-mono text-xs uppercase"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border border-zinc-200 bg-canvas p-6 md:p-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Services in {area.name}</p>
            <ul className="space-y-3">
              {area.services.map((service) => (
                <li key={service} className="flex items-start gap-3">
                  <span className="mt-1.5 block h-2 w-2 shrink-0 bg-primary" />
                  <span className="font-mono text-sm">{service}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-zinc-200 pt-6">
              <p className="mb-2 font-heading text-sm font-bold uppercase">Get a local quote</p>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                <span className="font-mono text-sm">{BUSINESS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby areas */}
      <section className="border-y border-zinc-200 bg-paper py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">Also serving nearby</p>
          <div className="flex flex-wrap gap-3">
            {area.nearbyAreas.map((nearby) => (
              <span
                key={nearby}
                className="border border-zinc-300 bg-white px-4 py-2 font-heading text-sm font-bold uppercase"
              >
                {nearby}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Gate types */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Available gate types</p>
        <h2 className="mb-8 font-heading text-3xl font-black uppercase md:text-4xl">
          Choose your mechanism
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Double Swing', href: '/gates/double-swing', desc: 'Classic driveway gates' },
            { title: 'Sliding', href: '/gates/tracked-sliding', desc: 'Space-saving slide' },
            { title: 'Cantilever', href: '/gates/cantilever', desc: 'No ground track' },
            { title: 'Bifold', href: '/gates/bifold', desc: 'Folds for short drives' },
          ].map((gate) => (
            <Link
              key={gate.href}
              href={gate.href}
              className="group border border-zinc-200 bg-white p-5 transition-colors hover:border-primary"
            >
              <h3 className="font-heading text-lg font-bold uppercase group-hover:text-primary">{gate.title}</h3>
              <p className="mt-1 font-mono text-xs text-zinc-500">{gate.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/gates"
            className="inline-flex min-h-[44px] items-center gap-2 font-heading text-sm font-bold uppercase text-primary hover:underline"
          >
            View all gate types <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="font-heading text-3xl font-black uppercase md:text-5xl">
            Ready for your {area.name} project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-white/80">
            Request a survey and we&apos;ll provide a detailed specification and quote for your property.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 bg-primary px-10 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-primary-dark"
          >
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Areas', path: '/areas' },
              { name: area.name, path: `/areas/${area.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${BUSINESS.website}/#business`,
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
            areaServed: {
              '@type': 'AdministrativeArea',
              name: area.name,
            },
          }),
        }}
      />
    </MarketingShell>
  )
}
