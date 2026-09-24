import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

import { MarketingPhoto } from '@/components/marketing/MarketingPhoto'
import { SectionPhotos } from '@/components/marketing/SectionPhotos'
import { SectionVideos } from '@/components/marketing/SectionVideos'
import { PAGE_VIDEOS } from '@/lib/marketing/page-videos'
import { MarketingShell } from '@/components/marketing/MarketingShell'
import { PricingDisclaimer } from '@/components/marketing/PricingDisclaimer'

import {
  GATE_DATA,
  GATE_SLUGS,
  resolveGateSlug,
  type GateSlug,
} from '../gate-marketing-data'
import { breadcrumbSchema, serviceSchema } from '@/lib/marketing/schema'

export function generateStaticParams() {
  return GATE_SLUGS.map((style) => ({ style }))
}

export function generateMetadata({ params }: { params: { style: string } }) {
  const resolved = resolveGateSlug(params.style)
  const gate = resolved ? GATE_DATA[resolved] : null
  if (!gate) return {}
  return {
    title: `${gate.title} Gates London | Bespoke Steel Gates UK`,
    description: `${gate.description} Made-to-measure ${gate.title.toLowerCase()} gates fabricated in our London workshop.`,
    alternates: { canonical: `/gates/${resolved}` },
    keywords: [`${gate.title.toLowerCase()} gates london`, 'bespoke steel gates', 'made to measure gates uk'],
  }
}

function availabilityLabel(availability: (typeof GATE_DATA)[GateSlug]['availability']): string {
  switch (availability) {
    case 'configure':
      return 'Configure online'
    case 'schematic':
      return 'Schematic online'
    case 'enquire':
      return 'Enquire to specify'
  }
}

export default function GateDetailPage({ params }: { params: { style: string } }) {
  const resolved = resolveGateSlug(params.style)
  if (!resolved) notFound()

  if (params.style !== resolved) {
    redirect(`/gates/${resolved}`)
  }

  const gate = GATE_DATA[resolved]

  return (
    <MarketingShell pathname="/gates">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-3 flex items-center gap-3">
          <Link
            href="/gates"
            className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
          >
            Our gates
          </Link>
          <span className="font-mono text-[10px] text-zinc-400">/</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">{gate.title}</span>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{gate.subtitle}</p>
            <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
              {gate.title}
            </h1>
            <p className="mt-4 font-heading text-lg font-bold uppercase tracking-wide text-muted-deep">
              {gate.tagline}
            </p>
            <p className="mt-3 inline-block border border-zinc-300 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {availabilityLabel(gate.availability)}
            </p>
            <p className="mt-5 max-w-xl text-base font-light text-muted-deep md:text-lg">{gate.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={gate.ctaHref}
                className="inline-block bg-steel px-8 py-3 font-heading text-sm font-bold uppercase text-white"
              >
                {gate.ctaLabel}
              </Link>
              <Link
                href="/gates"
                className="inline-block border border-zinc-300 px-8 py-3 font-heading text-sm font-bold uppercase"
              >
                All gate types
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-paper">
            <MarketingPhoto
              src={gate.heroImage}
              alt={`${gate.title} steel gate`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase">
              Ref: {gate.ref}
            </span>
          </div>
        </div>
      </section>

      {/* Client voice */}
      <section className="border-y border-zinc-200 bg-steel py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary-container">
            How clients usually ask for this
          </p>
          <blockquote className="max-w-3xl font-heading text-2xl font-bold uppercase leading-snug tracking-tight md:text-3xl">
            {gate.customerVoice}
          </blockquote>
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-zinc-400">
            We take that brief, measure the opening, and only then lock steel, finish, and automation — indicative
            online figures are never the final workshop quote.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-canvas py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Technical specification</p>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gate.specs.map((spec) => (
              <div key={spec.label} className="border-l-2 border-primary pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{spec.label}</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-steel">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <PricingDisclaimer className="mt-6 max-w-2xl" compact />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-primary">What you get</p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {gate.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 block h-2 w-2 shrink-0 bg-primary" aria-hidden />
              <span className="font-mono text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <SectionPhotos
        images={gate.detailImages.filter((src) => src !== gate.heroImage)}
        title={gate.title}
      />
      <SectionVideos
        clips={PAGE_VIDEOS[resolved]?.clips ?? []}
        music={PAGE_VIDEOS[resolved]?.music ?? ''}
      />

      <section className="border-t border-zinc-200 bg-canvas py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Next step</p>
              <p className="mt-1 font-heading text-2xl font-black uppercase text-steel">
                {gate.availability === 'enquire' ? 'Talk to Steelyes' : 'Start from your opening'}
              </p>
              <p className="mt-2 max-w-md font-mono text-xs text-zinc-500">
                {gate.availability === 'enquire'
                  ? 'This type is specified after survey — tell us the site constraints and we will engineer it with you.'
                  : 'Set an indicative size online, then book the survey that makes the quote real.'}
              </p>
            </div>
            <Link
              href={gate.ctaHref}
              className="inline-block self-start bg-primary px-10 py-4 font-heading text-sm font-bold uppercase text-white md:self-auto"
            >
              {gate.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Gates', path: '/gates' },
              { name: gate.title, path: `/gates/${resolved}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: `${gate.title} Gates`,
              description: gate.description,
              path: `/gates/${resolved}`,
              serviceType: `${gate.title} steel gate fabrication and installation`,
              image: gate.heroImage,
            }),
          ),
        }}
      />
    </MarketingShell>
  )
}
