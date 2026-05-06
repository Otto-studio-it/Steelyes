import Link from 'next/link'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'
import { GATE_SLUGS } from './gate-marketing-data'

const GATE_DISPLAY = [
  { title: 'Sliding Gates', slug: GATE_SLUGS[4] },
  { title: 'Bifold Gates', slug: GATE_SLUGS[1] },
  { title: 'Cantilever Gates', slug: GATE_SLUGS[0] },
  { title: 'Pedestrian Gates', slug: GATE_SLUGS[2] },
  { title: 'Telescopic Gates', slug: GATE_SLUGS[3] },
  { title: 'Architectural Gates', slug: GATE_SLUGS[5] },
] as const

export default function GatesPage() {
  return (
    <MarketingShell pathname="/gates">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Our gates</p>
          <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">Bespoke steel</h1>
          <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
            Made-to-measure driveway, pedestrian, sliding and automated gate styles, specified around your entrance,
            finish direction, access needs and site conditions.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            ['01. Gate type', 'Sliding, swing, bifold, pedestrian'],
            ['02. Finish direction', 'Colour and coating confirmed in specification'],
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
          {GATE_DISPLAY.map(({ title, slug }, index) => (
            <article key={slug} className="group">
              <Link href={`/gates/${slug}`} className="block">
                <div className="relative overflow-hidden bg-[#EFEEEB]">
                  <MediaPlaceholder label={`Gate card image ${index + 1}`} aspectClassName="aspect-[4/5] w-full" />
                  <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[10px] uppercase">
                    Ref: ST-{index + 1}0{index + 1}
                  </span>
                </div>
              </Link>
              <h2 className="mt-5 font-heading text-3xl font-black uppercase">
                <Link href={`/gates/${slug}`} className="transition-colors hover:text-[#9E000C]">
                  {title}
                </Link>
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">Material</p>
                  <p className="font-mono text-base">Specified per project</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">Sizing</p>
                  <p className="font-mono text-base">Made to measure</p>
                </div>
                <div className="flex items-end justify-between border-t border-zinc-200 pt-4">
                  <span className="font-heading text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Indicative, subject to survey
                  </span>
                  <Link
                    href={`/gates/${slug}`}
                    className="font-heading text-sm font-bold uppercase tracking-wide text-[#9E000C] hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <button className="min-h-[48px] border border-zinc-300 px-10 py-3 font-heading text-sm font-bold uppercase tracking-widest">
            Load engineering catalogue
          </button>
        </div>
      </section>
    </MarketingShell>
  )
}
