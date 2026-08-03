import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'

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

export default function StructuresServicePage() {
  return (
    <MarketingShell pathname="/services/structures">
      <section className="mx-auto max-w-7xl border-l-4 border-[#9E000C] px-4 py-10 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[#9E000C]">Service</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Steel
          <br />
          <span className="text-[#9E000C]">Structures</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[#5C403D] md:text-lg">
          Structural steelwork designed from the site constraints outward — fixing substrate, load paths, and access
          verified before fabrication is committed. Where specification is pending, the page intentionally stays
          conservative.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-[#EFEEEB]">
          <Image
            src="/images/balconies/balcony-steel-structure.jpg"
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
        <article className="border border-zinc-200 bg-white p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Core brief</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Engineered.
            <br />
            Built <span className="text-[#9E000C]">to last.</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#5C403D]">
            We fabricate structural steel elements for residential and commercial settings. The work starts from the
            fixing substrate outward, with load paths and access confirmed before production is committed.
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
                body: 'Fixing substrates, floor levels, and structural constraints are confirmed before design is locked.',
              },
              {
                step: 'Drawings',
                body: 'Fabrication drawings reviewed and signed off before production starts.',
              },
              {
                step: 'Fabrication',
                body: 'Frame sections cut, welded, and prepared for finishing with consistent edge and corner details.',
              },
              {
                step: 'Install',
                body: 'On-site fixing and alignment coordinated around access windows and building protection.',
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
            structural or compliance details are finalised.
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
