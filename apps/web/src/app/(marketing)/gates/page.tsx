import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { PricingDisclaimer } from '@/components/marketing/PricingDisclaimer'
import { GATE_DATA, GATE_SLUGS } from './gate-marketing-data'

export const metadata: Metadata = {
  title: 'Bespoke Steel Gates | Driveway, Electric & Automatic Gates',
  description:
    'Made-to-measure steel driveway gates — double swing, sliding, cantilever, bifold and more. Surveyed, fabricated and installed across the UK.',
}

function badgeFor(availability: (typeof GATE_DATA)[keyof typeof GATE_DATA]['availability']): string {
  switch (availability) {
    case 'configure':
      return 'Configure'
    case 'schematic':
      return 'Schematic'
    case 'enquire':
      return 'Enquire'
  }
}

export default function GatesPage() {
  return (
    <MarketingShell pathname="/gates">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Our gates</p>
          <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
            Bespoke steel
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
            Eight mechanisms — written the way clients actually ask for them. Configure the types we can draw
            honestly; enquire for the rest. Every price stays indicative until survey.
          </p>
          <PricingDisclaimer className="mt-6 max-w-2xl" />
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            ['01. Gate type', 'Swing, slide, fold, radius'],
            ['02. Finish direction', 'Colour confirmed in specification'],
            ['03. Automation', 'Manual or automated, subject to survey'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#5C403D]">{label}</p>
              <div className="min-h-[48px] border border-zinc-300 bg-white px-3 py-3 font-heading text-sm font-bold uppercase leading-snug">
                {value}
              </div>
            </div>
          ))}
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] items-center justify-center self-end bg-[#1B1C1A] px-8 py-3 font-heading text-sm font-bold uppercase text-white"
          >
            Request a quote
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {GATE_SLUGS.map((slug) => {
            const gate = GATE_DATA[slug]
            return (
              <article key={slug} className="group">
                <Link href={`/gates/${slug}`} className="block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEEEB]">
                    <Image
                      src={gate.heroImage}
                      alt={`${gate.title} steel gate`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 bg-[#1B1C1A] px-2 py-1 font-mono text-[10px] uppercase text-white">
                      {badgeFor(gate.availability)}
                    </span>
                    <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[10px] uppercase">
                      Ref: {gate.ref}
                    </span>
                  </div>
                </Link>
                <h2 className="mt-5 font-heading text-3xl font-black uppercase">
                  <Link href={`/gates/${slug}`} className="transition-colors hover:text-[#9E000C]">
                    {gate.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#5C403D]">{gate.tagline}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-zinc-500">Client brief</p>
                    <p className="line-clamp-3 font-mono text-xs leading-5 text-zinc-700">{gate.customerVoice}</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-zinc-200 pt-4">
                    <span className="font-heading text-xs font-bold uppercase tracking-wide text-zinc-400">
                      Indicative, subject to survey
                    </span>
                    <Link
                      href={`/gates/${slug}`}
                      className="font-heading text-sm font-bold uppercase tracking-wide text-[#9E000C] hover:underline"
                    >
                      Read brief
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-16 flex flex-col items-center gap-3">
          <Link
            href="/configurator"
            className="inline-flex min-h-[48px] items-center border border-zinc-300 px-10 py-3 font-heading text-sm font-bold uppercase tracking-widest transition-colors hover:border-[#9E000C] hover:text-[#9E000C]"
          >
            Explore configurator
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Double &amp; single swing configure fully · all other types schematic explore
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
