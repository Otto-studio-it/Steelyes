import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowDown, ArrowRight } from 'lucide-react'

import { MarketingPhoto } from '@/components/marketing/MarketingPhoto'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { SectionPhotos } from '@/components/marketing/SectionPhotos'
import { SectionVideos } from '@/components/marketing/SectionVideos'
import { PAGE_VIDEOS } from '@/lib/marketing/page-videos'
import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'
import { PricingDisclaimer } from '@/components/marketing/PricingDisclaimer'
import { FAQSection, FAQSchemaScript, type FAQItem } from '@/components/marketing/FAQSection'
import { GATE_DATA, GATE_SLUGS } from './gate-marketing-data'
import { breadcrumbSchema, itemListSchema } from '@/lib/marketing/schema'

const GATES_FAQ: FAQItem[] = [
  {
    question: 'What is the difference between swing and sliding gates?',
    answer: 'Swing gates open inward or outward like a door, requiring clear space for the arc. Sliding gates move horizontally along a track or cantilever system, ideal when you have limited space in front of the opening but room along the boundary.',
  },
  {
    question: 'Can any gate type be automated?',
    answer: 'Yes, all our gate types can be automated. The motor system varies by mechanism — swing gates use ram-arm or underground motors, while sliding gates use rack-and-pinion systems. We specify the right motor during survey based on gate weight and usage.',
  },
  {
    question: 'How do I know which gate type suits my driveway?',
    answer: 'The main factors are: available swing space, side run for sliding, ground slope, and parking position. Our configurator helps you visualise options, but the site survey confirms what will actually work for your entrance.',
  },
  {
    question: 'What is a cantilever gate?',
    answer: 'A cantilever gate slides without a ground track in the opening. It hangs from a counterbalanced frame and needs approximately 1.5x the opening width for the side run. Ideal for sloped or uneven ground, or where you want to avoid cutting a track into the driveway.',
  },
  {
    question: 'How long does a gate project take?',
    answer: 'From survey to installation, typical projects take 4-8 weeks depending on complexity and current workload. We confirm lead times in your quotation after the site survey.',
  },
]

export const metadata: Metadata = {
  title: 'Bespoke Steel Gates London | Driveway, Electric & Automatic Gates',
  description:
    'Made-to-measure steel driveway gates in London — double swing, sliding, cantilever, bifold and more. Survey-led fabrication from our Sydenham workshop, installed across London and the UK.',
  alternates: { canonical: '/gates' },
  keywords: ['steel gates london', 'driveway gates london', 'electric gates london', 'automatic gates south london', 'bespoke gates uk'],
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

      <section className="border-y border-zinc-200 bg-canvas py-10 md:py-14" aria-labelledby="gate-decisions-title">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">A clearer way to choose</p>
              <h2 id="gate-decisions-title" className="font-heading text-3xl font-black uppercase leading-none md:text-4xl">
                Two decisions,
                <br />
                in the right order.
              </h2>
            </div>

            <ol className="grid gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-2">
              <li className="bg-white p-5 md:p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">01 · Opening mechanism</p>
                <h3 className="mt-3 font-heading text-xl font-black uppercase">How it moves</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-deep">
                  Swing, sliding, folding or radius is determined by the opening, parking space, ground and side run.
                </p>
                <a
                  href="#gate-mechanisms"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 font-heading text-sm font-bold uppercase text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Compare mechanisms <ArrowDown className="h-4 w-4" aria-hidden />
                </a>
              </li>
              <li className="bg-white p-5 md:p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">02 · Appearance</p>
                <h3 className="mt-3 font-heading text-xl font-black uppercase">How it looks</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-deep">
                  Choose Victorian steelwork or composite boards, then adjust privacy, colour, dimensions and options.
                </p>
                <Link
                  href="/configurator"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 font-heading text-sm font-bold uppercase text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Explore appearance <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            </ol>
          </div>

          <div className="mt-8 grid w-full gap-3 sm:max-w-xl sm:grid-cols-2 lg:ml-auto">
            <Link
              href="/configurator"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-zinc-300 bg-white px-6 py-3 font-heading text-sm font-bold uppercase text-steel transition-colors hover:border-steel hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Configure a gate <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-primary px-6 py-3 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Request a quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <SectionPhotos
        images={OFFICIAL_IMAGES.gates.all.gallery.filter((src) => src !== OFFICIAL_IMAGES.gates.all.hero)}
        title="Steel gates"
      />
      <SectionVideos clips={PAGE_VIDEOS['gates-all'].clips} music={PAGE_VIDEOS['gates-all'].music} />

      <section id="gate-mechanisms" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Opening mechanisms</p>
          <h2 className="font-heading text-3xl font-black uppercase leading-none md:text-4xl">Compare the movement</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-deep md:text-base">
            These are engineering layouts, not visual styles. Open a type to understand the space it needs and where
            survey decisions begin.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {GATE_SLUGS.map((slug) => {
            const gate = GATE_DATA[slug]
            return (
              <article key={slug} className="group">
                <Link href={`/gates/${slug}`} className="block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
                    <MarketingPhoto
                      src={gate.heroImage}
                      alt={`${gate.title} steel gate`}
                      className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
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
                    <div className="flex shrink-0 items-center gap-4 pl-3">
                      <Link
                        href={`/gates/${slug}`}
                        className="inline-flex min-h-[44px] items-center font-heading text-sm font-bold uppercase tracking-wide text-muted-deep hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        Read brief
                      </Link>
                      <Link
                        href={gate.ctaHref}
                        className="inline-flex min-h-[44px] items-center gap-1 font-heading text-sm font-bold uppercase tracking-wide text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        Configure <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-zinc-200 pt-10 text-center">
          <div className="grid w-full gap-3 sm:max-w-xl sm:grid-cols-2">
            <Link
              href="/configurator"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-zinc-300 bg-white px-6 py-3 font-heading text-sm font-bold uppercase text-steel transition-colors hover:border-steel hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Configure a gate <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-primary px-6 py-3 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Request a quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            All mechanisms can be explored online · Preview detail varies by type · Final specification follows survey
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-zinc-200 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <FAQSection
            subtitle="Common questions"
            title="Gate mechanisms explained"
            items={GATES_FAQ}
          />
        </div>
      </section>

      <FAQSchemaScript items={GATES_FAQ} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Gates', path: '/gates' }])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              GATE_SLUGS.map((slug) => ({
                name: `${GATE_DATA[slug].title} Gates`,
                path: `/gates/${slug}`,
                description: GATE_DATA[slug].tagline,
              })),
            ),
          ),
        }}
      />
    </MarketingShell>
  )
}
