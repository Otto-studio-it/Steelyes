import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, MapPin } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { BUSINESS } from '@/lib/marketing/business'
import { breadcrumbSchema, itemListSchema } from '@/lib/marketing/schema'

import { AREA_DATA, AREA_SLUGS } from './area-data'

export const metadata: Metadata = {
  title: 'Areas We Serve | Steel Gates London, Surrey & South East',
  description:
    'Steelyes serves London, Surrey, Kent and the South East from our Sydenham workshop. Find steel gate fabrication and installation services in your area.',
  alternates: { canonical: '/areas' },
  keywords: [
    'steel gates london',
    'gate fabricator south london',
    'steel gates surrey',
    'steel gates kent',
    'driveway gates south east england',
  ],
}

export default function AreasPage() {
  const londonAreas = AREA_SLUGS.filter((slug) =>
    ['south-london', 'sydenham', 'lewisham', 'bromley', 'greenwich', 'croydon'].includes(slug)
  )
  const regionalAreas = AREA_SLUGS.filter((slug) => ['surrey', 'kent'].includes(slug))

  return (
    <MarketingShell pathname="/areas">
      {/* Hero */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">Service coverage</span>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
            Areas
            <br />
            <span className="text-primary">we serve</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            Steelyes fabricates and installs bespoke steel gates from our workshop in Sydenham, South London.
            We serve London, Surrey, Kent and the wider South East, with nationwide delivery available for
            supply-only orders.
          </p>
        </div>
      </section>

      {/* Workshop location */}
      <section className="border-b border-zinc-200 bg-canvas py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Workshop location</p>
              <p className="font-heading text-2xl font-black uppercase">{BUSINESS.address.line1}</p>
              <p className="text-muted-deep">
                {BUSINESS.address.locality}, {BUSINESS.address.region}, {BUSINESS.address.postalCode}
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center gap-2 bg-primary px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
              >
                Get a local quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* London areas */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">London coverage</p>
        <h2 className="mb-8 font-heading text-3xl font-black uppercase md:text-4xl">
          London & South East London
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {londonAreas.map((slug) => {
            const area = AREA_DATA[slug]
            return (
              <Link
                key={slug}
                href={`/areas/${slug}`}
                className="group border border-zinc-200 bg-white p-6 transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold uppercase group-hover:text-primary">
                      {area.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{area.region}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-light text-muted-deep">{area.description}</p>
                {area.postcodes && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {area.postcodes.slice(0, 4).map((code) => (
                      <span
                        key={code}
                        className="bg-paper px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-500"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Regional areas */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Regional coverage</p>
          <h2 className="mb-8 font-heading text-3xl font-black uppercase md:text-4xl">
            Surrey & Kent
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {regionalAreas.map((slug) => {
              const area = AREA_DATA[slug]
              return (
                <Link
                  key={slug}
                  href={`/areas/${slug}`}
                  className="group border border-zinc-200 bg-white p-6 transition-colors hover:border-primary md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-2xl font-bold uppercase group-hover:text-primary">
                        {area.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-zinc-500">{area.region}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-light text-muted-deep">{area.description}</p>
                  <p className="mt-4 font-mono text-xs text-zinc-500">
                    Serving: {area.nearbyAreas.slice(0, 4).join(', ')}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nationwide note */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="border border-zinc-200 bg-paper p-6 md:p-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">UK-wide</p>
          <h2 className="font-heading text-2xl font-black uppercase">Nationwide delivery available</h2>
          <p className="mt-3 max-w-2xl text-sm font-light text-muted-deep">
            For supply-only orders, we deliver fabricated gates and metalwork throughout the United Kingdom.
            Installation services are focused on London and the South East, but we can recommend trusted
            installers in other regions.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-heading text-sm font-bold uppercase text-primary hover:underline"
          >
            Discuss your project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="font-heading text-3xl font-black uppercase md:text-5xl">
            Ready for a local survey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-white/80">
            Tell us your location and project requirements. We&apos;ll confirm availability and arrange a site visit.
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
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              AREA_SLUGS.map((slug) => ({
                name: `Steel Gates ${AREA_DATA[slug].name}`,
                path: `/areas/${slug}`,
                description: AREA_DATA[slug].metaDescription,
              })),
            ),
          ),
        }}
      />
    </MarketingShell>
  )
}
