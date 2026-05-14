import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Steel Platforms & Staircases | Bespoke Fabrication | Steelyes',
  description:
    'Bespoke steel platforms and staircases fabricated to survey-led specification. Treads, stringers, landings and platforms designed around real site conditions.',
}

const CAPABILITIES = [
  { title: 'Staircases', detail: 'Steel stringers, treads, and risers fabricated to confirmed dimensions and loads.' },
  { title: 'Platforms', detail: 'Raised platforms and mezzanine structures designed around access and substrate conditions.' },
  { title: 'Landings', detail: 'Intermediate landings, edge protection, and returns where the stair geometry requires.' },
  { title: 'Integration', detail: 'Consistent finish and rail language where staircases connect to gates or balustrade work.' },
] as const

const SPEC_ITEMS = [
  { label: 'Material', value: 'Steel (section and grade per structural review)' },
  { label: 'Finish', value: 'Powder coat / paint system — see finish palette' },
  { label: 'Fixings', value: 'Verified on site before fabrication sign-off' },
  { label: 'Compliance', value: 'Confirmed during specification; no public claims pre-approval' },
] as const

export default function StaircasesServicePage() {
  return (
    <MarketingShell pathname="/services/staircases">
      <section className="mx-auto max-w-7xl border-l-4 border-[#9E000C] px-4 py-10 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#9E000C]">Service</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Platforms &
          <br />
          <span className="text-[#9E000C]">Staircases</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[#5C403D] md:text-lg">
          Steel staircases and platforms engineered from the site outward — fixing points, tread geometry, and load
          paths verified before fabrication is committed. Where specification is pending, the page intentionally stays
          conservative.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-[#EFEEEB]">
          <Image
            src="/images/balconies/balcony-juliet-glass-london.jpg"
            alt="Steel staircase and platform installed"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-black/0 p-4 text-white">
            <p className="font-heading text-xl font-bold uppercase">Bespoke steel staircase</p>
          </div>
        </div>
        <article className="border border-zinc-200 bg-white p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Core brief</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Precise.
            <br />
            Built <span className="text-[#9E000C]">to last.</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#5C403D]">
            We fabricate staircases and platforms for residential and commercial settings. The work starts from the
            fixing substrate outward — tread geometry, riser heights, and structural connections confirmed before
            production is committed.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {SPEC_ITEMS.map((item) => (
              <div key={item.label} className="border border-zinc-200 bg-[#F5F3F0] p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{item.label}</p>
                <p className="mt-2 font-heading text-sm font-bold uppercase tracking-tight text-[#1B1C1A]">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Capabilities</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">What we build</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <article key={capability.title} className="border border-zinc-200 bg-white p-6">
              <h3 className="font-heading text-xl font-bold uppercase">{capability.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-[#5C403D]">{capability.detail}</p>
              <div className="mt-5 h-0.5 w-14 bg-[#9E000C]" />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F6F6F6] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Workflow</p>
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">From brief to handover</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              {
                step: 'Site survey',
                body: 'Floor levels, fixing substrates, and head heights are confirmed before geometry is locked.',
              },
              {
                step: 'Drawings',
                body: 'Fabrication drawings reviewed and signed off before production starts.',
              },
              {
                step: 'Fabrication',
                body: 'Stringers, treads, and landings cut, welded, and prepared for finishing.',
              },
              {
                step: 'Install',
                body: 'On-site fixing and alignment coordinated around access and finished surface protection.',
              },
            ].map((item, index) => (
              <article key={item.step} className="border border-zinc-200 bg-white p-6">
                <p className="mb-4 font-heading text-5xl font-black text-zinc-200">0{index + 1}</p>
                <h3 className="mb-2 font-heading text-xl font-bold uppercase">{item.step}</h3>
                <p className="text-sm font-light leading-relaxed text-[#5C403D]">{item.body}</p>
                <div className="mt-5 h-0.5 w-14 bg-[#9E000C]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101010] py-16 text-white md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Send drawings.
            <br />
            We will <span className="text-[#9E000C]">confirm fit.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Share plans, photos, or a rough brief. We will outline what is feasible and what needs a survey before
            dimensions or compliance details are finalised.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center bg-[#9E000C] px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
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
