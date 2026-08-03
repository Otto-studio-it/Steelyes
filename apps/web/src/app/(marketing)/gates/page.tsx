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
  alternates: { canonical: '/gates' },
}

function badgeFor(availability: (typeof GATE_DATA)[keyof typeof GATE_DATA]['availability']): string {
  switch (availability) {
    case 'configure':
      return 'Configure online'
    case 'schematic':
      return 'Preview online'
    case 'enquire':
      return 'Quote only'
  }
}

export default function GatesPage() {
  return (
    <MarketingShell pathname="/gates">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Gate mechanisms</p>
          <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
            Choose how
            <br />
            your gate moves
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light text-muted-deep md:text-lg">
            Start with the mechanism your entrance needs: swing, sliding, folding or radius. Style, privacy level,
            infill and finish are specified within that gate type after access and clearances are understood.
          </p>
          <PricingDisclaimer className="mt-6 max-w-2xl" />
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-canvas py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            ['01. Gate type', 'Swing, slide, fold, radius'],
            ['02. Finish direction', 'Colour confirmed in specification'],
            ['03. Automation', 'Manual or automated, subject to survey'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-deep">{label}</p>
              <div className="min-h-[48px] border border-zinc-300 bg-white px-3 py-3 font-heading text-sm font-bold uppercase leading-snug">
                {value}
              </div>
            </div>
          ))}
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] items-center justify-center self-end bg-steel px-8 py-3 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
                    <Image
                      src={gate.heroImage}
                      alt={`${gate.title} steel gate`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 bg-steel px-2 py-1 font-mono text-[10px] uppercase text-white">
                      {badgeFor(gate.availability)}
                    </span>
                  </div>
                </Link>
                <h2 className="mt-5 font-heading text-3xl font-black uppercase">
                  <Link href={`/gates/${slug}`} className="transition-colors hover:text-primary">
                    {gate.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-deep">{gate.tagline}</p>
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
                      className="font-heading text-sm font-bold uppercase tracking-wide text-primary hover:underline"
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
            className="inline-flex min-h-[48px] items-center border border-zinc-300 px-10 py-3 font-heading text-sm font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Explore configurator
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Double &amp; single swing and all other types — full configure · indicative totals
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
