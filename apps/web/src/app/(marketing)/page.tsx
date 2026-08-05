import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { HomeWeldingHero } from '@/components/marketing/HomeWeldingHero'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { Reveal } from '@/components/marketing/Reveal'
import { BUSINESS, BUSINESS_SAME_AS } from '@/lib/marketing/business'
import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'

export const metadata: Metadata = {
  title: 'Bespoke Steel Gates UK | Made-to-Measure Driveway Gates',
  description:
    'Made-to-measure steel driveway, pedestrian, sliding and automated gates, designed around your entrance and built for long-term strength.',
  alternates: { canonical: '/' },
}

const RANGE_LINKS = [
  { label: 'Driveway automated gates & railings', href: '/gates' },
  { label: 'Glass balustrades & terraces', href: '/services/railings' },
  { label: 'Metal & glass balconies', href: '/services/balconies' },
  { label: 'Steel structures', href: '/services/structures' },
  { label: 'Platforms & staircases', href: '/services/staircases' },
  { label: 'Security grills', href: '/services/security' },
] as const

const processItems = [
  {
    n: '01',
    label: 'Consultation',
    body: 'Tell us about the entrance, access needs, style direction and any photos, sketches or measurements you already have.',
  },
  {
    n: '02',
    label: 'Specification',
    body: 'We turn the brief into dimensions, steel sections, finish direction, automation options and survey requirements.',
  },
  {
    n: '03',
    label: 'Fabrication',
    body: 'Your gate is built to the agreed specification, with steelwork prepared for finishing, hardware and installation.',
  },
  {
    n: '04',
    label: 'Installation',
    body: 'We coordinate delivery, fitting, alignment, handover and final adjustments so the gate works cleanly on site.',
  },
] as const

const mosaicImages = [
  {
    src: OFFICIAL_IMAGES.gates.doubleSwing.hero,
    alt: 'Double swing steel driveway gate',
    tall: true,
  },
  {
    src: OFFICIAL_IMAGES.services.staircases.primary,
    alt: 'Steel staircase and landing',
    tall: false,
  },
  {
    src: OFFICIAL_IMAGES.services.balconies.glass,
    alt: 'Glass balcony with steel structure',
    tall: true,
  },
  {
    src: OFFICIAL_IMAGES.about.teamWorkshop,
    alt: 'Steelyes workshop team at fabrication',
    tall: false,
  },
  {
    src: OFFICIAL_IMAGES.services.balconies.metal,
    alt: 'Metal balcony installation',
    tall: false,
  },
  {
    src: OFFICIAL_IMAGES.services.staircases.secondary,
    alt: 'Staircase and railing installation',
    tall: false,
  },
] as const

export default function HomePage() {
  return (
    <MarketingShell pathname="/">
      {/* 1 — Hero */}
      <HomeWeldingHero />

      {/* 2 — Proof */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="mb-8">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">From workshop to entrance</p>
              <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">Completed work</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {mosaicImages.map(({ src, alt, tall }, index) => (
              <Reveal
                key={src}
                delay={index * 50}
                className={`group relative overflow-hidden bg-steel ${tall ? 'md:row-span-2' : ''}`}
              >
                <div
                  className={`relative w-full ${
                    tall ? 'aspect-[4/3] md:aspect-[2/3]' : 'aspect-[4/3] md:aspect-square'
                  }`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.06]"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6" delay={80}>
            <Link
              href="/gallery"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-white/30 bg-white/5 px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              View all projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 3 — Configurator product */}
      <section aria-labelledby="home-configurator-title" className="border-b border-zinc-200 bg-canvas py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Gate configurator</p>
            <h2
              id="home-configurator-title"
              className="mt-3 max-w-xl font-heading text-4xl font-black uppercase leading-[0.92] text-steel sm:text-5xl md:text-6xl"
            >
              Design the entrance before the survey.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-deep">
              Choose how the gate moves, set your opening size and compare finishes in a live visual tool. You will see
              an estimated price as you work; Steelyes confirms the final specification on site before fabrication.
            </p>

            <ol className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['01', 'Choose a mechanism', 'Swing, sliding, bifold and specialist layouts.'],
                ['02', 'Set size and finish', 'Tune the opening, style, colour and automation.'],
                ['03', 'Prepare your quote', 'Save the design and send it with the project brief.'],
              ].map(([number, title, body]) => (
                <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-steel/12 pt-4">
                  <span className="font-mono text-xs font-bold text-primary">{number}</span>
                  <span>
                    <span className="block font-heading text-sm font-bold uppercase text-steel">{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-deep">{body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/configurator"
              data-configurator-placement="home-product-section"
              className="group mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-primary px-8 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              Open the configurator
              <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delay={100} className="relative border border-steel/12 bg-white p-3 sm:p-5">
            <div className="flex items-center justify-between border-b border-steel/10 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Live design preview</span>
              <span className="border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                Estimated price
              </span>
            </div>
            <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-paper sm:aspect-[16/10]">
              <Image
                src={OFFICIAL_IMAGES.gates.doubleSwing.hero}
                alt="Double swing steel gate shown as an example of the online configurator"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-steel/75 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Current design</p>
                  <p className="mt-1 font-heading text-xl font-black uppercase sm:text-2xl">Double swing · Victorian</p>
                </div>
                <span className="hidden border border-white/40 bg-black/30 px-3 py-2 font-mono text-xs uppercase sm:inline-flex">
                  Live preview
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x divide-steel/10 border border-steel/10 bg-paper py-3 text-center">
              {['Mechanism', 'Dimensions', 'Finish'].map((label) => (
                <span key={label} className="font-mono text-[10px] uppercase tracking-widest text-muted-deep">
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — Range (single index: gates + services) */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-0">
          <Reveal className="relative hidden lg:col-span-5 lg:block lg:pr-12">
            <div className="relative aspect-[3/4] overflow-hidden bg-paper">
              <Image
                src={OFFICIAL_IMAGES.gates.trackedSliding.hero}
                alt="Tracked sliding steel gate installed at a residential frontage"
                fill
                sizes="42vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Installed project</p>
                <p className="font-heading text-2xl font-black uppercase text-white">Residential frontage</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="flex flex-col justify-center lg:col-span-7 lg:pl-16" delay={80}>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">What we build</p>
            <h2 className="font-heading text-3xl font-black uppercase leading-[0.9] sm:text-4xl md:text-5xl">
              Gates, railings and structural steel —
              <span className="text-primary"> one workshop.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-deep md:text-base">
              Survey-led specification, fabrication and install across driveway gates, glass balustrades, balconies,
              staircases and security steelwork.
            </p>

            <ul className="mt-8 divide-y divide-zinc-200 border-t border-zinc-200">
              {RANGE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex min-h-[56px] items-center justify-between gap-4 py-3 transition-colors hover:text-primary"
                  >
                    <span className="font-heading text-base font-bold uppercase sm:text-lg">{item.label}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gates"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-steel bg-steel px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary"
              >
                Browse gates <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-zinc-300 px-6 font-heading text-sm font-bold uppercase text-steel transition-colors hover:border-primary hover:text-primary"
              >
                Browse services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 — Process / installation */}
      <section className="border-t border-zinc-200 bg-canvas py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">How it works</p>
              <h2 className="mb-10 font-heading text-4xl font-black uppercase leading-none md:text-5xl">
                Installation process
              </h2>
              <ol className="divide-y divide-zinc-200 border-y border-zinc-200">
                {processItems.map(({ n, label, body }) => (
                  <li key={label} className="flex gap-5 py-5">
                    <span className="w-10 shrink-0 font-heading text-3xl font-black leading-none text-zinc-200 md:text-4xl">
                      {n}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold uppercase md:text-xl">{label}</h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-deep">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/installation"
                className="mt-8 inline-flex min-h-[48px] items-center gap-2 font-heading text-sm font-bold uppercase text-primary hover:underline"
              >
                Full installation details <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>

            <Reveal className="hidden flex-col gap-4 lg:flex" delay={120}>
              <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                <Image
                  src={OFFICIAL_IMAGES.gates.cantilever.hero}
                  alt="Cantilever sliding steel gate detail"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden bg-paper">
                  <Image
                    src={OFFICIAL_IMAGES.gates.singleSwing.hero}
                    alt="Single swing steel gate at side access"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center bg-steel p-6 text-white">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Each project</p>
                  <p className="mt-2 font-heading text-2xl font-black uppercase leading-none">
                    Survey
                    <br />
                    first.
                  </p>
                  <p className="mt-3 font-mono text-xs text-white/60">No fabrication without confirmed dimensions.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — Final CTA */}
      <section className="relative overflow-hidden bg-steel py-20 text-white md:py-28">
        <Image
          src={OFFICIAL_IMAGES.gates.doubleSwing.gallery[1]}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Ready to start</p>
            <h2 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-6xl">
              Plan your
              <br />
              entrance.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              Start visually in the gate configurator, or send us photos, measurements and a rough brief for a direct
              quote. Both paths lead to a survey-led specification.
            </p>
            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/contact"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-primary px-6 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Request a quote
                <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/configurator"
                data-configurator-placement="home-closing-cta"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 border border-white/60 bg-black/20 px-6 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Configure a gate
                <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'GeneralContractor'],
            name: BUSINESS.tradingName,
            url: BUSINESS.website,
            telephone: BUSINESS.phoneDisplay,
            email: BUSINESS.email,
            description:
              'Bespoke steel driveway gates, electric gates, railings, balconies and security doors. Survey-led specification, supply and install across the UK.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: BUSINESS.address.line1,
              addressLocality: BUSINESS.address.locality,
              addressRegion: BUSINESS.address.region,
              postalCode: BUSINESS.address.postalCode,
              addressCountry: 'GB',
            },
            // Postcode-district-level (EN3) approximation — replace with the exact
            // surveyed coordinates for Unit 7, Meridian Industrial Estate when available.
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 51.6538,
              longitude: -0.0342,
            },
            image: `${BUSINESS.website}${OFFICIAL_IMAGES.homepageHero}`,
            sameAs: [...BUSINESS_SAME_AS],
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Steel Fabrication Services',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bespoke Steel Driveway Gates' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electric & Automatic Gates' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Steel Railings & Balustrades' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Steel Balconies' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Security Gates & Steel Doors' } },
              ],
            },
          }),
        }}
      />
    </MarketingShell>
  )
}
