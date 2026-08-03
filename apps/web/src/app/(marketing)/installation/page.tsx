import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { COVERAGE_COPY, SURVEY_COPY } from '@/lib/marketing/business'

export const metadata: Metadata = {
  title: 'Gate Installation | Supply & Install Steel Gates UK',
  description:
    'Steelyes handles the full installation path — site survey, fabrication, electric gate wiring, delivery and fitting across the UK.',
  alternates: { canonical: '/installation' },
}

export default function InstallationPage() {
  return (
    <MarketingShell pathname="/installation">
      <section className="relative overflow-hidden bg-steel py-14 md:py-24">
        <Image
          src="/images/gates/sliding-gate-automated-open.jpg"
          alt="Steelyes gate installation"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-8xl">
            Precision built.
            <br />
            <span className="text-primary">Master installed.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Site services</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">The supply & install benefit</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: 'On-site measurement',
              body: 'We visit before fabrication begins. Laser measurement of post positions, gate opening, and ground clearances. Site conditions — substrate, drainage, sight lines — recorded and fed directly into the fabrication drawing.',
            },
            {
              title: 'Structural alignment',
              body: 'Gate leaves set to drawing tolerance on-site. Fixing positions verified against the survey record. Where conditions differ from survey, we resolve on-site rather than fabricate adjustments afterwards.',
            },
            {
              title: 'Full handover',
              body: 'Every installation ends with a full commissioning check: automation cycle testing, manual override verification, and a complete handover to the client. Documentation provided for all motorised systems.',
            },
          ].map(({ title, body }) => (
            <article key={title} className="border border-zinc-200 bg-white p-6">
              <h3 className="font-heading text-2xl font-bold uppercase">{title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-deep">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <article className="border border-zinc-200 bg-paper p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Logistics</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">Nationwide engineering</h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-deep">
            We carry out installations across the UK — single-gate residential commissions to multi-gate commercial
            perimeters. One team from survey to sign-off, no third-party installers and no handoff between fabricator
            and site.
          </p>
          <ul className="mt-6 space-y-3 font-mono text-xs uppercase tracking-widest text-zinc-700">
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Site visit + laser survey</li>
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Final set-out review</li>
            <li className="min-h-[44px] border border-zinc-200 bg-white px-3 py-3">Commissioning + handover</li>
          </ul>
        </article>
        <div className="relative overflow-hidden border border-zinc-200">
          <div className="relative h-full min-h-[340px] w-full">
            <Image
              src="/images/gates/sliding-gate-anthracite-residential.jpg"
              alt="Steelyes gate installation on site"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-3 text-white">
            <p className="font-heading text-xs font-bold uppercase tracking-widest">Zones</p>
            <p className="font-mono text-[10px] uppercase text-white/80">{COVERAGE_COPY.headline}</p>
          </div>
          <div className="absolute -bottom-4 -left-1 bg-steel p-4 text-white md:p-6">
            <p className="font-heading text-xl font-black uppercase text-primary">{SURVEY_COPY.headline}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Confirmed per enquiry</p>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 text-center font-heading text-4xl font-black uppercase md:text-5xl">The installation blueprint</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              {
                step: 'Technical Survey',
                body: 'Site survey — laser measure, substrate check, access and drainage assessment. Survey scope and timing are confirmed before booking.',
              },
              {
                step: 'Frame Setting',
                body: 'Gate posts set and packed to tolerance. Leaf hanging verified against the fabrication drawing. Set-out confirmed before any fixings are committed.',
              },
              {
                step: 'On-site Wiring',
                body: 'For automated gates, supply cable routing, control board installation and safety device wiring are handled by qualified electricians within our installation scope.',
              },
              {
                step: 'Final Tuning',
                body: 'Closing force, speed settings, obstacle detection and manual override tested to manufacturer specification before handover. Documentation left on-site.',
              },
            ].map(({ step, body }, index) => (
              <article key={step} className="border border-zinc-200 bg-white p-6">
                <p className="mb-4 font-heading text-5xl font-black text-zinc-200">0{index + 1}</p>
                <h3 className="mb-2 font-heading text-xl font-bold uppercase">{step}</h3>
                <p className="text-sm font-light leading-relaxed text-muted-deep">{body}</p>
                <div className="mt-5 h-0.5 w-14 bg-primary" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <h2 className="mb-8 font-heading text-4xl font-black uppercase md:text-5xl">
          Technical <span className="text-primary">clarification</span>
        </h2>
        <div className="space-y-3">
          <details className="group border border-zinc-200 bg-white p-5" open>
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-bold uppercase tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Do you handle electrical connections for automation?
              <span className="shrink-0 font-mono text-lg text-zinc-500" aria-hidden="true">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-4 text-sm font-light text-muted-deep">
              Yes, where automation is included in scope. Electrical work is carried out by qualified electricians as part of the agreed installation package.
            </p>
          </details>
          {[
            {
              q: 'How long does a typical driveway install take?',
              a: 'Duration depends on gate type, automation, and site conditions. We confirm programme length in your written quotation after survey.',
            },
            {
              q: 'Can you install onto existing stone pillars?',
              a: 'Often yes, subject to structural review during survey. Post condition, fixing centres and load paths must be verified before fabrication.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-zinc-200 bg-white p-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-bold uppercase tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                {q}
                <span className="shrink-0 font-mono text-lg text-zinc-500" aria-hidden="true">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-4 text-sm font-light text-muted-deep">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-steel py-16 text-white md:py-20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/gates/privacy-diagonal-gate-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Ready to define your perimeter?
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Book your survey and we will outline gate geometry, set-out, and installation sequence for your project.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-[48px] items-center bg-primary px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Request a survey
          </Link>
        </div>
      </section>
    </MarketingShell>
  )
}
