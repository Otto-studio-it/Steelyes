import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'Steel Security Doors & Grilles | Perimeter Hardening',
  description:
    'Steel security doors, grilles, access enclosures, and protective screens built for high-wear use and serviceability.',
  alternates: { canonical: '/services/security' },
}

const CAPABILITIES = [
  { title: 'Security doors', detail: 'Heavy-duty steel doors specified around access frequency, load, and fit.' },
  { title: 'Grilles & screens', detail: 'Fixed and hinged steel grilles for windows, openings, and plant enclosures.' },
  { title: 'Access enclosures', detail: 'Secure enclosures for equipment, plant rooms, and controlled-access areas.' },
  { title: 'Perimeter screens', detail: 'Protective steel screens and barriers built for durability and serviceability.' },
] as const

const SPEC_ITEMS = [
  { label: 'Material', value: 'Steel (section and gauge per use case)' },
  { label: 'Finish', value: 'Powder coat / paint system (palette pending)' },
  { label: 'Hardware', value: 'Locking and access hardware confirmed per spec' },
  { label: 'Compliance', value: 'Confirmed during specification; no public claims pre-approval' },
] as const

export default function SecurityServicePage() {
  return (
    <MarketingShell pathname="/services/security">
      <section className="mx-auto max-w-7xl border-l-4 border-primary px-4 py-10 md:px-8 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Service</p>
        <h1 className="mt-3 font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Perimeter
          <br />
          <span className="text-primary">Security</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-muted-deep md:text-lg">
          Steel security doors, grilles, access enclosures, and protective screens built for high-wear use and
          serviceability. Where client specification is pending, the page intentionally stays conservative.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-paper">
          <Image
            src="/images/gates/sliding-gate-anthracite-residential.jpg"
            alt="Steel security gate installation"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-black/0 p-4 text-white">
            <p className="font-heading text-xl font-bold uppercase">Steel security fabrication</p>
          </div>
        </div>
        <article className="border border-zinc-200 bg-white p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Core brief</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Built for
            <br />
            <span className="text-primary">duty.</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-deep">
            We fabricate security steelwork for commercial and residential perimeters. The work is specified around
            access patterns, opening dimensions, and hardware requirements, with compliance confirmed during
            specification rather than assumed upfront.
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
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">Protective systems</h2>
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
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">From threat brief to install</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              {
                step: 'Site review',
                body: 'Opening dimensions, substrate, and access conditions confirmed before any drawing work.',
              },
              {
                step: 'Specification',
                body: 'Hardware, gauge, and locking approach locked before production is committed.',
              },
              {
                step: 'Fabrication',
                body: 'Frames and leaves cut, welded, and prepared for finishing with hardware provisions in place.',
              },
              {
                step: 'Install',
                body: 'On-site fitting, alignment, and hardware commissioning coordinated around site access.',
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
            src="/images/railings/railings-victorian-spear-london.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Send your brief.
            <br />
            We will <span className="text-primary">confirm fit.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Share plans, photos, or a rough idea of the opening. We will outline what is feasible before hardware or
            compliance details are finalised.
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
