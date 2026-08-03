import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { HomeWeldingHero } from '@/components/marketing/HomeWeldingHero'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { Reveal } from '@/components/marketing/Reveal'
import { BUSINESS, BUSINESS_SAME_AS } from '@/lib/marketing/business'

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
    src: '/images/client-uploads/selected/1000048883.JPG',
    alt: 'Wide black steel gate and rail frontage',
    tall: true,
  },
  { src: '/images/client-uploads/selected/1000051985.JPG', alt: 'Steel railings and stair landing', tall: false },
  {
    src: '/images/client-uploads/selected/1000052004.JPG',
    alt: 'Balcony and terrace steel structure',
    tall: true,
  },
  { src: '/images/client-uploads/selected/1000052013.JPG', alt: 'Steel frame under fabrication', tall: false },
  {
    src: '/images/client-uploads/selected/1000052209.JPG',
    alt: 'Glass balcony with steel fixing points',
    tall: false,
  },
  { src: '/images/client-uploads/selected/1000051989.JPG', alt: 'Staircase and railing installation', tall: false },
] as const

export default function HomePage() {
  return (
    <MarketingShell pathname="/">
      {/* 1 — Hero */}
      <HomeWeldingHero />

      {/* 2 — Proof */}
      <section className="bg-steel py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">From workshop to entrance</p>
              <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">Completed work</h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white"
            >
              View full archive <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {mosaicImages.map(({ src, alt, tall }, index) => (
              <Reveal
                key={src}
                delay={index * 50}
                className={`group relative overflow-hidden bg-[#2A2A2A] ${tall ? 'md:row-span-2' : ''}`}
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
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6" delay={80}>
            <Link
              href="/gallery"
              className="inline-flex min-h-[48px] w-full items-center justify-center border border-white/20 bg-white/5 px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              View all projects
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 3 — Range (single index: gates + services) */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-0">
          <Reveal className="relative hidden lg:col-span-5 lg:block lg:pr-12">
            <div className="relative aspect-[3/4] overflow-hidden bg-paper">
              <Image
                src="/images/client-uploads/selected/1000051998.JPG"
                alt="Steelyes bespoke steel gate installed at a residential frontage"
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

      {/* 4 — Process / installation */}
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
                  src="/images/home/modern-perforated-gate-detail.jpg"
                  alt="Close-up of modern perforated steel gate detail"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden bg-paper">
                  <Image
                    src="/images/home/steelwork-finial-detail.jpg"
                    alt="Close-up detail of black steel railings with decorative finials"
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

      {/* 5 — Final CTA */}
      <section className="relative overflow-hidden bg-steel py-20 text-white md:py-28">
        <Image
          src="/images/gates/privacy-diagonal-gate-dusk.jpg"
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
              Send photos, measurements or a rough idea of the steelwork you need. We will help turn it into a
              measured specification and a clear quote path.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-primary px-10 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-primary-container sm:w-auto"
              >
                Request a quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
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
            image: `${BUSINESS.website}/images/home/hero-modern-driveway-gate.jpg`,
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
