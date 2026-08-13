import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'
import { breadcrumbSchema, howToSchema, serviceSchema } from '@/lib/marketing/schema'

export const metadata: Metadata = {
  title: 'Steel Structures | Bespoke Structural Steelwork',
  description:
    'Bespoke steel structures designed and fabricated to survey-led specification. Structural frames, supports, and custom steel fabrication across residential and commercial projects.',
  alternates: { canonical: '/services/structures' },
}

const CAPABILITIES = [
  { title: 'Structural frames', detail: 'Load-bearing steel frames designed around the specific site conditions and substrate.' },
  { title: 'Support columns', detail: 'Vertical steel columns fabricated to confirmed dimensions and load requirements.' },
  { title: 'Bespoke sections', detail: 'Custom profiles and assemblies where standard sections do not fit the brief.' },
  { title: 'Integration', detail: 'Consistent finish language where steel structures sit alongside gate and railing work.' },
] as const

const SPEC_ITEMS = [
  { label: 'Material', value: 'Steel (section and grade per structural review)' },
  { label: 'Finish', value: 'Powder coat / paint system — see finish palette' },
  { label: 'Fixings', value: 'Verified on site before fabrication sign-off' },
  { label: 'Compliance', value: 'Confirmed during specification; no public claims pre-approval' },
] as const

const WORKFLOW_STEPS = [
  { step: 'Site survey', body: 'Fixing substrates, floor levels, and structural constraints are confirmed before design is locked.' },
  { step: 'Drawings', body: 'Fabrication drawings reviewed and signed off before production starts.' },
  { step: 'Fabrication', body: 'Frame sections cut, welded, and prepared for finishing with consistent edge and corner details.' },
  { step: 'Install', body: 'On-site fixing and alignment coordinated around access windows and building protection.' },
] as const

export default function StructuresServicePage() {
  return (
    <MarketingShell pathname="/services/structures">
      <section className="mx-auto max-w-7xl border-l-4 border-primary px-4 py-10 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Service</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Steel
          <br />
          <span className="text-primary">Structures</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-muted-deep md:text-lg">
          Structural steelwork designed from the site constraints outward — fixing substrate, load paths, and access
          verified before fabrication is committed. Where specification is pending, the page intentionally stays
          conservative.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-paper lg:order-2 lg:aspect-auto lg:min-h-[34rem]">
          <Image
            src={OFFICIAL_IMAGES.services.structures.hero}
            alt="Bespoke steel structure fabricated and installed"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-black/0 p-4 text-white">
            <p className="font-heading text-xl font-bold uppercase">Bespoke steel structure</p>
          </div>
        </div>
        <article className="border border-zinc-200 bg-canvas p-6 md:p-8 lg:order-1 lg:flex lg:flex-col lg:justify-center">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Core brief</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Engineered.
            <br />
            Built <span className="text-primary">to last.</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-deep">
            We fabricate structural steel elements for residential and commercial settings. The work starts from the
            fixing substrate outward, with load paths and access confirmed before production is committed.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {SPEC_ITEMS.map((item) => (
              <div key={item.label} className="border border-zinc-200 bg-canvas p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{item.label}</p>
                <p className="mt-2 font-heading text-sm font-bold uppercase tracking-tight text-steel">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Capabilities</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">Load-bearing scope</h2>
        <div className="grid grid-cols-1 border-t border-zinc-200 md:grid-cols-2">
          {CAPABILITIES.map((capability, index) => (
            <article
              key={capability.title}
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-zinc-200 py-6 md:px-6 md:odd:border-r"
            >
              <p className="font-heading text-3xl font-black text-zinc-200">0{index + 1}</p>
              <div>
                <h3 className="font-heading text-xl font-bold uppercase">{capability.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-deep">{capability.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Workflow</p>
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">From design to erection</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {WORKFLOW_STEPS.map((item, index) => (
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
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Send drawings.
            <br />
            We will <span className="text-primary">confirm fit.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Share plans, photos, or a rough brief. We will outline what is feasible and what needs a survey before
            structural or compliance details are finalised.
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: 'Steel Structures', path: '/services/structures' },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: 'Steel Structures',
              description: metadata.description!,
              path: '/services/structures',
              serviceType: 'Structural steel fabrication',
              image: OFFICIAL_IMAGES.services.structures.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToSchema({
              name: 'How Steelyes fabricates steel structures',
              description: metadata.description!,
              path: '/services/structures',
              steps: WORKFLOW_STEPS.map(({ step, body }) => ({ name: step, text: body })),
            }),
          ),
        }}
      />
    </MarketingShell>
  )
}
