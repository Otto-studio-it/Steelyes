import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

import { HomeWeldingHero } from '@/components/marketing/HomeWeldingHero'
import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Bespoke Steel Gates UK | Made-to-Measure Driveway Gates | Steelyes',
  description:
    'Made-to-measure steel driveway, pedestrian, sliding and automated gates, designed around your entrance and built for long-term strength.',
}

const capabilityItems = [
  ['Made to measure', 'Built around your opening'],
  ['Survey-led', 'Specified before fabrication'],
  ['Manual or automated', 'Driveway, sliding and pedestrian gates'],
  ['Supply & install', 'One route from brief to handover'],
]

const gateStandardItems = [
  {
    title: 'Modern',
    body: 'Clean horizontal lines, strong geometry and a sharp architectural finish for contemporary homes and new entrances.',
    detailA: ['Profile', 'Architectural'],
    detailB: ['Finish', 'Powder coated'],
    image: '/images/home/modern-diagonal-steel-gate.jpg',
    imageAlt: 'Modern diagonal black steel driveway gate installed between brick pillars',
  },
  {
    title: 'Classic',
    body: 'Traditional proportions, heavier steel presence and timeless detailing for period homes, estates and formal driveways.',
    detailA: ['Style', 'Traditional'],
    detailB: ['Build', 'Steel framed'],
    image: '/images/home/classic-ornate-driveway-gate.jpg',
    imageAlt: 'Classic ornate black steel driveway gate with decorative finials',
  },
  {
    title: 'Privacy',
    body: 'Closed and semi-closed gate designs for entrances that need screening, security and a quieter street-facing profile.',
    detailA: ['Coverage', 'Screened'],
    detailB: ['Use', 'Driveway privacy'],
    image: '/images/home/privacy-horizontal-steel-gate.jpg',
    imageAlt: 'Privacy steel gate with horizontal infill and matching frontage panels',
  },
]

const processItems = [
  [
    '01',
    'Consultation',
    'Tell us about the entrance, access, style, automation needs and any photos, sketches or measurements you already have.',
  ],
  [
    '02',
    'Specification',
    'We turn the brief into dimensions, steel sections, finish direction, automation options and survey requirements.',
  ],
  [
    '03',
    'Fabrication',
    'Your gate is built to the agreed specification, with steelwork prepared for finishing, hardware and installation.',
  ],
  [
    '04',
    'Installation',
    'We coordinate delivery, fitting, alignment, handover and final adjustments so the gate works cleanly on site.',
  ],
]

export default function HomePage() {
  return (
    <MarketingShell pathname="/">
      <HomeWeldingHero />

      {/* ── Capability strip ── */}
      <section className="border-b border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
          {capabilityItems.map(([value, label]) => (
            <div key={label}>
              {/* heading per valore forte, mono per descrizione tecnica */}
              <p className="font-heading text-lg font-black uppercase text-[#9E000C] sm:text-xl">{value}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-[#5C403D]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust / Proof section — FASE 4 ── */}
      <section className="border-b border-zinc-200 bg-white py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 divide-y divide-zinc-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ['Survey-led', 'Every gate specified before fabrication'],
              ['Made to order', 'No stock — built around your entrance'],
              ['Supply & install', 'One route from brief to handover'],
            ].map(([stat, desc]) => (
              <div
                key={stat}
                className="py-6 text-center first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <p className="font-heading text-2xl font-black uppercase text-[#9E000C] md:text-3xl">{stat}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#5C403D]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steel Standards ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#795916]">Precision engineering</p>
            <h2 className="font-heading text-4xl font-black uppercase leading-none md:text-5xl">The steel standards</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5C403D] md:text-base">
              Choose the look that suits your entrance, then refine the dimensions, finish, infill and automation around
              the property.
            </p>
          </div>
          <Link href="/gates" className="hidden font-heading text-sm font-bold uppercase text-[#9E000C] md:block">
            Browse gate styles
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {gateStandardItems.map(({ title, body, detailA, detailB, image, imageAlt }) => (
            <article key={title} className="overflow-hidden rounded border border-zinc-200 bg-[#F5F3F0]">
              {/* Immagine cliccabile → /gates */}
              <Link href="/gates" className="group block">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#E4E2DF] sm:aspect-[4/5]">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    unoptimized
                    loading="eager"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
              <div className="p-6">
                <h3 className="font-heading text-3xl font-bold uppercase">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
                <div className="mt-5 flex items-center gap-4">
                  <div>
                    {/* label portato da text-[10px] a text-xs (12px) */}
                    <p className="font-mono text-xs uppercase text-zinc-400">{detailA[0]}</p>
                    <p className="font-mono text-sm font-bold">{detailA[1]}</p>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" aria-hidden />
                  <div>
                    <p className="font-mono text-xs uppercase text-zinc-400">{detailB[0]}</p>
                    <p className="font-mono text-sm font-bold">{detailB[1]}</p>
                  </div>
                </div>
                <Link
                  href="/gates"
                  className="mt-5 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-[#9E000C] transition-colors hover:text-[#9B1515]"
                >
                  Browse {title.toLowerCase()} gates <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── The Process ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">The process</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5C403D] md:text-base">
              From first photos to final handover, every gate starts with the opening it needs to serve.
            </p>
          </div>
          {/* Posizione relativa per il connettore visivo desktop */}
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            <div
              className="absolute top-[2.5rem] left-0 right-0 hidden h-px bg-zinc-200 md:block"
              aria-hidden
            />
            {processItems.map(([n, label, body]) => (
              <article key={label} className="relative">
                {/* text-5xl mobile → text-8xl desktop */}
                <p className="mb-3 font-heading text-5xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>
                <h3 className="font-heading text-2xl font-bold uppercase">{label}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Configurator CTA ── */}
      <section className="bg-[#C41E1E] py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            {/* H2 ridotto su mobile: text-4xl → sm:text-5xl → md:text-6xl */}
            <h2 className="font-heading text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Design your gate
              <br />
              in minutes.
            </h2>
            <p className="mt-5 text-lg font-light opacity-90">
              Explore gate type, finish, automation and options before requesting a survey-led quote.
            </p>
            {/* CTA full-width su mobile */}
            <Link
              href="/configurator"
              className="mt-8 inline-flex w-full min-h-[48px] items-center justify-center bg-white px-9 py-4 font-heading text-lg font-bold uppercase tracking-tight text-[#9E000C] sm:w-auto"
            >
              Start configuring
            </Link>
            {/* Disclaimer — gestisce aspettative sul configurator */}
            <p className="mt-3 font-mono text-xs uppercase opacity-60">
              Specification confirmed after survey
            </p>
          </div>
          <div className="w-full max-w-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
            <div className="space-y-4">
              {[
                ['Gate_type', 'Driveway gate'],
                ['Material', 'Galvanised steel'],
                ['Finish', 'Anthracite grey'],
                ['Automation', 'Optional'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 border-b border-white/25 pb-3">
                  {/* text-[11px] → text-xs (12px) */}
                  <span className="font-mono text-xs uppercase">{k}</span>
                  <span className="text-right font-mono text-xs uppercase">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 text-right">
              {/* text-3xl → text-4xl per contrasto WCAG large text ≥3:1 */}
              <p className="font-mono text-4xl font-bold uppercase sm:text-5xl">Survey-led quote</p>
              <p className="font-mono text-xs uppercase opacity-70">Indicative pricing confirmed after specification</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="bg-[#FBF9F6] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <h2 className="mb-6 font-heading text-4xl font-black uppercase">From workshop to entrance</h2>
              <p className="text-sm font-light leading-relaxed text-[#5C403D] md:text-base">
                See completed gates, fabrication details and finish examples from recent Steelyes projects.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/gallery"
                  className="inline-flex min-h-[48px] items-center justify-center bg-[#9E000C] px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515]"
                >
                  View our work
                </Link>
                <Link
                  href="/installation"
                  className="inline-flex min-h-[48px] items-center justify-center border border-[#9E000C] px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-[#9E000C] transition-colors hover:bg-[#9E000C] hover:text-white"
                >
                  How installation works
                </Link>
              </div>
            </div>
            {/* Grid: cols-1 su mobile, cols-2 da md — evita cramped a 375px */}
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative col-span-1 h-64 overflow-hidden md:col-span-2 md:h-72">
                <Image
                  src="/images/home/installed-classic-frontage-gate.jpg"
                  alt="Installed black steel frontage gate at a residential entrance"
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                {/* Overlay spostato bottom-left — non compete con il soggetto della foto */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-heading text-2xl font-bold uppercase">Installed gates</p>
                  <p className="font-mono text-xs uppercase text-white/70">Real entrances</p>
                </div>
              </div>
              <article className="bg-[#E4E2DF] p-6">
                <h3 className="font-heading text-2xl font-bold uppercase">Fabrication details</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#5C403D]">
                  Close-up steelwork, joints, hinges, finishes and hardware prepared around the agreed specification.
                </p>
              </article>
              {/* aspect-[16/9] su mobile invece di aspect-square — non spezza il layout */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E4E2DF] md:aspect-square">
                <Image
                  src="/images/home/steelwork-finial-detail.jpg"
                  alt="Close-up detail of black steel railings with decorative finials"
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-zinc-200 bg-[#1B1C1A] py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl font-black uppercase leading-none md:text-5xl">Ready to plan your entrance?</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/80 md:text-base">
              Send photos, measurements or a rough idea of the gate you need. We will help turn it into a measured
              specification and quote path.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center bg-white px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-[#1B1C1A] transition-colors hover:bg-[#EFEEEB]"
            >
              Request a quote
            </Link>
            <Link
              href="/gates"
              className="inline-flex min-h-[48px] items-center justify-center border border-white px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-white hover:text-[#1B1C1A]"
            >
              Explore gate styles
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
