import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'

export const metadata: Metadata = {
  title: 'Glass Balustrades & Terraces | Bespoke Steel & Glass',
  description:
    'Bespoke glass balustrades and terrace enclosures fabricated to survey-led specification. Steel and glass systems designed around real fixing conditions and site constraints.',
  alternates: { canonical: '/services/railings' },
}

const CAPABILITIES = [
  { title: 'Glass balustrades', detail: 'Frameless and semi-framed glass panels with steel base channels and posts.' },
  { title: 'Terrace enclosures', detail: 'Terrace perimeter systems combining glass and steel to suit the building edge.' },
  { title: 'Handrails', detail: 'Clean steel handrail geometry with repeatable sections and tight junctions.' },
  { title: 'Gates integration', detail: 'Consistent finish language where balustrade work sits alongside gate and railing projects.' },
] as const

const SPEC_ITEMS = [
  { label: 'Material', value: 'Steel + toughened / laminated glass (grade per survey)' },
  { label: 'Finish', value: 'Powder coat / paint system — see finish palette' },
  { label: 'Fixings', value: 'Verified on site before fabrication sign-off' },
  { label: 'Compliance', value: 'Confirmed during specification; no public claims pre-approval' },
] as const

export default function RailingsServicePage() {
  return (
    <MarketingShell pathname="/services/railings">
      <section className="mx-auto max-w-7xl border-l-4 border-primary px-4 py-10 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Service</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Glass Balustrades
          <br />
          <span className="text-primary">&amp; Terraces</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-muted-deep md:text-lg">
          Glass balustrade and terrace systems engineered from the site outward — fixing conditions, glass specification,
          and edge geometry verified before fabrication is committed. Where client specification is pending, the page
          intentionally stays conservative.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-paper">
          <Image
            src={OFFICIAL_IMAGES.services.railings.garden}
            alt="Steel cable balustrade on a garden terrace"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-black/0 p-4 text-white">
            <p className="font-heading text-xl font-bold uppercase">Bespoke garden balustrade</p>
          </div>
        </div>
        <article className="border border-steel bg-steel p-6 text-white md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/55">Core brief</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Open views.
            <br />
            Safe <span className="text-primary">edges.</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-white/75">
            We fabricate glass balustrade and terrace enclosure systems for residential and commercial settings.
            The work is defined by precise steel base channels, glass selection matched to the survey, and fixing
            conditions confirmed before production.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {SPEC_ITEMS.map((item) => (
              <div key={item.label} className="border border-white/15 bg-white/5 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">{item.label}</p>
                <p className="mt-2 font-heading text-sm font-bold uppercase tracking-tight text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Capabilities</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">Safe edges and enclosures</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <article key={capability.title} className="border border-zinc-200 bg-white p-6">
              <h3 className="font-heading text-xl font-bold uppercase">{capability.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-deep">{capability.detail}</p>
              <div className="mt-5 h-0.5 w-14 bg-primary" />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Workflow</p>
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">From survey to safe edge</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              {
                step: 'Site survey',
                body: 'We confirm fixing substrates, edge conditions, and the dimensions that drive the build.',
              },
              {
                step: 'Drawings',
                body: 'Fabrication drawings are prepared for review; changes are locked before production.',
              },
              {
                step: 'Fabrication',
                body: 'Sections are cut, welded, dressed, and prepared for finishing with consistent junction details.',
              },
              {
                step: 'Install',
                body: 'On-site install and alignment are coordinated around access and protection of finished surfaces.',
              },
            ].map((item, index) => (
              <article key={item.step} className="border border-zinc-200 bg-white p-6">
                <p className="mb-4 font-heading text-5xl font-black text-zinc-200">0{index + 1}</p>
                <h3 className="mb-2 font-heading text-xl font-bold uppercase">{item.step}</h3>
                <p className="text-sm font-light leading-relaxed text-muted-deep">{item.body}</p>
                <div className="mt-5 h-0.5 w-14 bg-primary" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-steel py-16 text-white md:py-20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={OFFICIAL_IMAGES.services.staircases.primary}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Send drawings.
            <br />
            We will <span className="text-primary">confirm fit.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Share plans, photos, or a rough sketch. We will outline what is feasible and what needs a survey before
            glass specification, pricing, or compliance statements are finalised.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center bg-primary px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              Request a quote
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-[48px] items-center justify-center border border-white/30 bg-white/5 px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              Back to services
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
