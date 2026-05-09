import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { HomeWeldingHero } from '@/components/marketing/HomeWeldingHero'
import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Bespoke Steel Gates UK | Made-to-Measure Driveway Gates | Steelyes',
  description:
    'Made-to-measure steel driveway, pedestrian, sliding and automated gates, designed around your entrance and built for long-term strength.',
}

const gateStyles = [
  {
    title: 'Modern',
    body: 'Clean horizontal lines, strong geometry and a sharp architectural finish for contemporary homes.',
    image: '/images/home/modern-diagonal-steel-gate.jpg',
    imageAlt: 'Modern diagonal black steel driveway gate installed between brick pillars',
    tag: 'Architectural profile',
  },
  {
    title: 'Classic',
    body: 'Traditional proportions, heavier steel presence and timeless detailing for period homes and formal driveways.',
    image: '/images/home/classic-ornate-driveway-gate.jpg',
    imageAlt: 'Classic ornate black steel driveway gate with decorative finials',
    tag: 'Steel framed',
  },
  {
    title: 'Privacy',
    body: 'Closed and semi-closed designs for entrances that need screening, security and a quieter street-facing profile.',
    image: '/images/home/privacy-horizontal-steel-gate.jpg',
    imageAlt: 'Privacy steel gate with horizontal infill and matching frontage panels',
    tag: 'Screened infill',
  },
]

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
]

const mosaicImages = [
  {
    src: '/images/gates/sliding-gate-anthracite-residential.jpg',
    alt: 'Anthracite residential sliding gate',
    tall: true,
  },
  { src: '/images/railings/railings-black-cross-london.jpg', alt: 'Black cross steel railings, London', tall: false },
  {
    src: '/images/gates/pedestrian-gate-ornate-brick.jpg',
    alt: 'Ornate pedestrian gate on brick pillar',
    tall: false,
  },
  { src: '/images/home/architectural-cutout-gate.jpg', alt: 'Architectural cutout steel gate', tall: true },
  { src: '/images/balconies/balcony-juliet-glass-london.jpg', alt: 'Juliet glass balcony, London', tall: false },
  {
    src: '/images/railings/railings-ornate-bronze-driveway.jpg',
    alt: 'Ornate bronze-finish driveway railings',
    tall: false,
  },
]

export default function HomePage() {
  return (
    <MarketingShell pathname="/">
      <HomeWeldingHero />

      {/* ── Marquee ticker ── */}
      <div className="overflow-hidden border-y border-zinc-200 bg-[#F5F3F0] py-3" aria-hidden="true">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((pass) => (
            <span key={pass} className="flex shrink-0 items-center gap-8 pr-8">
              {[
                'Bespoke steel gates',
                'Made to measure',
                'Survey-led specification',
                'Driveway · Pedestrian · Sliding',
                'Supply & install',
                'Automated options',
                'Steel fabrication London',
                'Built to order',
              ].map((item) => (
                <span key={item} className="flex items-center gap-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#5C403D]">{item}</span>
                  <span className="text-[#9E000C]" aria-hidden>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Editorial intro / what we build ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-0">
          {/* Left: large featured image */}
          <div className="relative lg:col-span-5 lg:pr-12">
            {/* On mobile use 4/3 landscape; portrait on desktop */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEEEB] md:aspect-[3/4]">
              <Image
                src="/images/home/installed-classic-frontage-gate.jpg"
                alt="Steelyes bespoke steel gate installed at a residential frontage"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Installed project</p>
                <p className="font-heading text-xl font-black uppercase text-white md:text-2xl">
                  Residential frontage
                </p>
              </div>
            </div>
            {/* floating badge — sits over the image bottom-right */}
            <div className="absolute bottom-4 right-4 bg-[#9E000C] px-4 py-3 text-white md:-bottom-4 md:right-0">
              <p className="font-mono text-[10px] uppercase tracking-widest">Survey-led</p>
              <p className="font-heading text-lg font-black uppercase md:text-xl">Made to order</p>
            </div>
          </div>

          {/* Right: headline + services list */}
          <div className="flex flex-col justify-center lg:col-span-7 lg:pl-16">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Steel fabrication</p>
            <h2 className="font-heading text-3xl font-black uppercase leading-[0.9] sm:text-4xl md:text-5xl lg:text-6xl">
              Everything your entrance needs —
              <br />
              <span className="text-[#9E000C]">nothing it doesn&apos;t.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#5C403D] md:text-base">
              Every gate starts with the opening it needs to serve. We survey, specify, fabricate and install around
              the real site — not a catalogue assumption.
            </p>

            {/* Services list */}
            <ul className="mt-8 divide-y divide-zinc-200 border-t border-zinc-200">
              {[
                { label: 'Driveway & automated gates', href: '/gates' },
                { label: 'Railings & balustrades', href: '/services/railings' },
                { label: 'Steel balconies', href: '/services/balconies' },
                { label: 'Security doors & grilles', href: '/services/security' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex min-h-[56px] items-center justify-between gap-4 py-3 transition-colors hover:text-[#9E000C]"
                  >
                    <span className="font-heading text-base font-bold uppercase sm:text-lg">{item.label}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-zinc-400 transition-all group-hover:text-[#9E000C] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-[#1B1C1A] px-8 py-3 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-[#9E000C] sm:w-auto sm:self-start"
            >
              Request a quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gate styles — editorial grid ── */}
      <section className="border-t border-zinc-200 bg-[#F5F3F0] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#795916]">Gate styles</p>
              <h2 className="font-heading text-4xl font-black uppercase leading-none md:text-5xl">The steel range</h2>
            </div>
            <Link
              href="/gates"
              className="hidden font-mono text-xs uppercase tracking-widest text-[#9E000C] underline underline-offset-4 hover:no-underline md:block"
            >
              All gate types →
            </Link>
          </div>

          {/* Mobile: horizontal scroll prevents stacked 500px-tall cards */}
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            {gateStyles.map(({ title, body, image, imageAlt, tag }) => (
              <article
                key={title}
                className="group w-72 shrink-0 bg-white md:w-auto"
              >
                <Link href="/gates" className="block">
                  {/* landscape on mobile scroll, portrait on md+ grid */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E4E2DF] md:aspect-[3/4]">
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 768px) 288px, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </Link>
                <div className="border-x border-b border-zinc-200 p-5 md:p-6">
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-[#9E000C]">{tag}</p>
                  <h3 className="font-heading text-2xl font-black uppercase md:text-3xl">{title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
                  <Link
                    href="/gates"
                    className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-[#9E000C] hover:underline"
                  >
                    Browse {title.toLowerCase()} gates <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/gates"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-[#9E000C] font-heading text-sm font-bold uppercase text-[#9E000C]"
            >
              All gate types <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Process ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Left: process steps */}
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">How it works</p>
              <h2 className="mb-10 font-heading text-4xl font-black uppercase leading-none md:text-5xl">The process</h2>
              <ol className="divide-y divide-zinc-200 border-y border-zinc-200">
                {processItems.map(({ n, label, body }) => (
                  <li key={label} className="flex gap-5 py-5">
                    <span className="w-10 shrink-0 font-heading text-3xl font-black leading-none text-zinc-200 md:text-4xl">
                      {n}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold uppercase md:text-xl">{label}</h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Mobile-only visual break */}
              <div className="relative mt-6 aspect-[4/3] overflow-hidden lg:hidden">
                <Image
                  src="/images/home/modern-perforated-gate-detail.jpg"
                  alt="Close-up of modern perforated steel gate detail"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <Link
                href="/installation"
                className="mt-8 inline-flex min-h-[48px] items-center gap-2 font-heading text-sm font-bold uppercase text-[#9E000C] hover:underline"
              >
                How installation works <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            {/* Right: stacked real photos — hidden on mobile, shown lg+ */}
            <div className="hidden flex-col gap-4 lg:flex">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEEEB]">
                <Image
                  src="/images/home/modern-perforated-gate-detail.jpg"
                  alt="Close-up of modern perforated steel gate detail"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden bg-[#EFEEEB]">
                  <Image
                    src="/images/home/steelwork-finial-detail.jpg"
                    alt="Close-up detail of black steel railings with decorative finials"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center bg-[#1B1C1A] p-6 text-white">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Each project</p>
                  <p className="mt-2 font-heading text-2xl font-black uppercase leading-none">
                    Survey
                    <br />
                    first.
                  </p>
                  <p className="mt-3 font-mono text-xs text-white/60">No fabrication without confirmed dimensions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo mosaic ── */}
      <section className="bg-[#1B1C1A] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
                From workshop to entrance
              </p>
              <h2 className="font-heading text-4xl font-black uppercase text-white md:text-5xl">Completed work</h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white"
            >
              View full archive <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>

          {/*
            Mobile: 2-col grid, uniform aspect-[4/3] — no row-span.
            md+: 3-col with row-span-2 for tall items.
            lg+: 6-col editorial layout.
          */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {mosaicImages.map(({ src, alt, tall }) => (
              <div
                key={src}
                className={`group relative overflow-hidden bg-[#2A2A2A] ${tall ? 'md:row-span-2' : ''}`}
              >
                {/* Mobile: uniform 4/3. Tall on md+: 2/3 portrait. Others: square. */}
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
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gallery"
              className="inline-flex min-h-[48px] w-full items-center justify-center border border-white/20 bg-white/5 px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              View all projects
            </Link>
            <Link
              href="/case-study"
              className="inline-flex min-h-[48px] w-full items-center justify-center border border-white/10 px-8 font-heading text-sm font-bold uppercase text-white/50 transition-colors hover:text-white sm:w-auto"
            >
              Case studies
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quote CTA — photo-backed ── */}
      <section className="relative overflow-hidden bg-[#1B1C1A] py-20 text-white md:py-32">
        <Image
          src="/images/gates/privacy-diagonal-gate-dusk.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        {/* strong vertical overlay on mobile so text stays legible across full width */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Ready to start</p>
            <h2 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-6xl lg:text-7xl">
              Plan your
              <br />
              entrance.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              Send photos, measurements or a rough idea of the gate you need. We will help turn it into a measured
              specification and a clear quote path.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-[#9E000C] px-10 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#C41E1E] sm:w-auto"
              >
                Request a quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/gates"
                className="inline-flex min-h-[52px] w-full items-center justify-center border border-white/30 px-10 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
              >
                Explore gate styles
              </Link>
            </div>
          </div>

          {/* stat strip */}
          <div className="mt-14 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
            {[
              ['100%', 'Made to order'],
              ['Survey-led', 'Every project'],
              ['Supply & install', 'One route'],
            ].map(([stat, desc]) => (
              <div key={desc} className="px-4 first:pl-0 last:pr-0 md:px-8">
                <p className="font-heading text-lg font-black uppercase text-white md:text-2xl lg:text-3xl">{stat}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/40 md:text-[10px]">
                  {desc}
                </p>
              </div>
            ))}
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
            description:
              'Bespoke steel driveway gates, electric gates, railings, balconies and security doors. Survey-led specification, supply and install across the UK.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Unit 7, Meridian Industrial Estate',
              addressLocality: 'Enfield',
              addressRegion: 'London',
              postalCode: 'EN3 7TW',
              addressCountry: 'GB',
            },
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
