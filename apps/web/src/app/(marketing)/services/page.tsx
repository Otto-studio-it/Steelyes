import Link from 'next/link'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

const SERVICES = [
  {
    title: 'Railings',
    href: '/services/railings',
    label: 'Residential + commercial',
    description:
      'Guardrails, balustrades, handrails, and perimeter details fabricated to suit your architecture and site constraints.',
  },
  {
    title: 'Balconies',
    href: '/services/balconies',
    label: 'Structural steelwork',
    description:
      'Balcony frames, infill panels, and fixings designed around access, load paths, and the realities of retrofit installation.',
  },
  {
    title: 'Security',
    href: '/services/security',
    label: 'Perimeter hardening',
    description:
      'Steel security doors, grilles, access enclosures, and protective screens, built for high-wear use and serviceability.',
  },
] as const

export default function ServicesPage() {
  return (
    <MarketingShell pathname="/services">
      <section className="relative overflow-hidden bg-[#111111] py-14 md:py-24">
        <MediaPlaceholder
          label="Services hero image"
          aspectClassName="absolute inset-0 h-full w-full"
          className="bg-[#2A2A2A] [&>span]:text-white/35"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-white/75">Bespoke forge</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-8xl">
            Steelwork beyond
            <br />
            <span className="text-[#9E000C]">the gate.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-white/85 md:text-base">
            A focused set of fabrication services that sit naturally alongside gates, delivered with the same emphasis on
            set-out, finish, and long-term serviceability. Details remain conservative until final client approvals are
            supplied.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Service index</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">Fabrication disciplines</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.href} className="border border-zinc-200 bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{service.label}</p>
              <h3 className="mt-3 font-heading text-2xl font-bold uppercase">{service.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-[#5C403D]">{service.description}</p>
              <Link
                href={service.href}
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center border border-[#1B1C1A] bg-[#F5F3F0] px-5 font-heading text-xs font-bold uppercase tracking-tight text-[#1B1C1A] transition-colors hover:bg-[#EFEEEB]"
              >
                View {service.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="flex flex-col items-start gap-4 border border-zinc-200 bg-[#F5F3F0] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#9E000C]">Service catalogue 2026</p>
            <h3 className="mt-2 font-heading text-xl font-black uppercase">Download our full service catalogue</h3>
            <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-[#5C403D]">
              All gate types, services, finishes, and options in one document. Indicative pricing — confirmed by free site survey.
            </p>
          </div>
          <a
            href="/downloads/steelyes-listino-2026.pdf"
            download
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 bg-[#9E000C] px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <article className="border border-zinc-200 bg-[#F8F8F8] p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Approach</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Site-first <span className="text-[#9E000C]">engineering</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#5C403D]">
            Every project starts with the constraints: fixing substrate, access, drainage paths, sight lines, and the
            tolerances your build will actually hold. Where specification is pending, we default to survey-required language
            rather than inventing certainty.
          </p>
          <ul className="mt-6 space-y-3 font-mono text-xs uppercase tracking-widest text-zinc-700">
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Measure + set-out checks</li>
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Fabrication drawings (approval gate)</li>
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Finish + install coordination</li>
          </ul>
        </article>
        <div className="relative overflow-hidden border border-zinc-200">
          <MediaPlaceholder label="Workshop steel fabrication" aspectClassName="h-full min-h-[340px] w-full" />
          <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-3 text-white">
            <p className="font-heading text-xs font-bold uppercase tracking-widest">Process note</p>
            <p className="font-mono text-[10px] uppercase text-white/80">Imagery pending approval</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101010] py-16 text-white md:py-20">
        <div className="absolute inset-0 opacity-20">
          <MediaPlaceholder
            label="Technical texture pattern"
            aspectClassName="absolute inset-0 h-full w-full"
            className="bg-black [&>span]:text-white/40"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Need steelwork
            <br />
            integrated with gates?
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Share drawings or a rough brief. We will confirm feasibility after a survey and outline the next steps without
            committing to unverified timelines, certifications, or coverage claims.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-[#9E000C] px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Request a quote
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}
