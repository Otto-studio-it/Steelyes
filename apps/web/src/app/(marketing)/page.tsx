import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

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
  },
  {
    title: 'Classic',
    body: 'Traditional proportions, heavier steel presence and timeless detailing for period homes, estates and formal driveways.',
    detailA: ['Style', 'Traditional'],
    detailB: ['Build', 'Steel framed'],
  },
  {
    title: 'Privacy',
    body: 'Closed and semi-closed gate designs for entrances that need screening, security and a quieter street-facing profile.',
    detailA: ['Coverage', 'Screened'],
    detailB: ['Use', 'Driveway privacy'],
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
      <section className="relative min-h-[640px] overflow-hidden bg-[#1B1C1A] md:min-h-[870px]">
        <MediaPlaceholder
          label="Homepage hero image"
          aspectClassName="absolute inset-0 h-full w-full"
          className="bg-[#2B2B2B] [&>span]:text-white/35"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-28">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/75">Bespoke steel gates</p>
          <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-5xl md:text-8xl">
            Bespoke steel gates,
            <br />
            built to define your property.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            Made-to-measure driveway, pedestrian, sliding and automated gates, designed around your entrance and fabricated
            for long-term strength.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#9E000C] px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515] md:text-lg"
            >
              Request a quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/configurator"
              className="inline-flex min-h-[48px] items-center justify-center border border-white px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-white hover:text-[#1B1C1A] md:text-lg"
            >
              Configure your gate
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
          {capabilityItems.map(([value, label]) => (
            <div key={label}>
              <p className="font-mono text-lg font-bold text-[#9E000C]">{value}</p>
              <p className="font-heading text-sm font-bold uppercase text-[#5C403D]">{label}</p>
            </div>
          ))}
        </div>
      </section>

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
          {gateStandardItems.map(({ title, body, detailA, detailB }) => (
            <article key={title} className="overflow-hidden rounded border border-zinc-200 bg-[#F5F3F0]">
              <MediaPlaceholder label={`${title} gate image`} aspectClassName="aspect-[4/5] w-full" />
              <div className="p-6">
                <h3 className="font-heading text-3xl font-bold uppercase">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
                <div className="mt-5 flex items-center gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-zinc-400">{detailA[0]}</p>
                    <p className="font-mono text-sm font-bold">{detailA[1]}</p>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" aria-hidden />
                  <div>
                    <p className="font-mono text-[10px] uppercase text-zinc-400">{detailB[0]}</p>
                    <p className="font-mono text-sm font-bold">{detailB[1]}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">The process</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5C403D] md:text-base">
              From first photos to final handover, every gate starts with the opening it needs to serve.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            {processItems.map(([n, label, body]) => (
              <article key={label} className="relative">
                <p className="mb-3 font-heading text-7xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>
                <h3 className="font-heading text-2xl font-bold uppercase">{label}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#C41E1E] py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-5xl font-black uppercase leading-[0.92] md:text-6xl">
              Design your gate
              <br />
              in minutes.
            </h2>
            <p className="mt-5 text-lg font-light opacity-90">
              Explore gate type, finish, automation and options before requesting a survey-led quote.
            </p>
            <Link
              href="/configurator"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-white px-9 py-4 font-heading text-lg font-bold uppercase tracking-tight text-[#9E000C]"
            >
              Start configuring
            </Link>
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
                  <span className="font-mono text-[11px] uppercase">{k}</span>
                  <span className="text-right font-mono text-[11px] uppercase">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 text-right">
              <p className="font-mono text-3xl font-bold uppercase sm:text-4xl">Survey-led quote</p>
              <p className="font-mono text-xs uppercase opacity-70">Indicative pricing confirmed after specification</p>
            </div>
          </div>
        </div>
      </section>

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
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="relative col-span-2 h-72 overflow-hidden">
                <MediaPlaceholder label="Installed steel gate project image" aspectClassName="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div>
                    <p className="font-heading text-4xl font-bold uppercase">Installed gates</p>
                    <p className="font-mono text-sm uppercase text-white/80">Real entrances, real specifications</p>
                  </div>
                </div>
              </div>
              <article className="bg-[#E4E2DF] p-6">
                <h3 className="font-heading text-2xl font-bold uppercase">Fabrication details</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#5C403D]">
                  Close-up steelwork, joints, hinges, finishes and hardware prepared around the agreed specification.
                </p>
              </article>
              <MediaPlaceholder label="Technical detail image" aspectClassName="aspect-square w-full" />
            </div>
          </div>
        </div>
      </section>

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
