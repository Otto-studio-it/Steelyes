import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'
import { breadcrumbSchema, itemListSchema } from '@/lib/marketing/schema'

export const metadata: Metadata = {
  title: 'Steel Fabrication Services London | Gates, Railings, Balconies & Security',
  description:
    'London steel fabrication specialists. Bespoke railings, balustrades, structural balconies and security doors. Survey-led fabrication from our Sydenham workshop.',
  alternates: { canonical: '/services' },
  keywords: ['steel fabrication london', 'metal railings london', 'balconies fabrication', 'steel staircases london', 'security grilles london'],
}

const SERVICES = [
  {
    title: 'Glass Balustrades & Terraces',
    href: '/services/railings',
    label: 'Residential + commercial',
    description:
      'Frameless and semi-framed glass balustrade systems and terrace enclosures fabricated to survey-led specification.',
  },
  {
    title: 'Metal & Glass Balconies',
    href: '/services/balconies',
    label: 'Structural steelwork',
    description:
      'Metal and glass balcony frames, infill panels, and fixings designed around access, load paths, and retrofit installation.',
  },
  {
    title: 'Steel Structures',
    href: '/services/structures',
    label: 'Bespoke fabrication',
    description:
      'Structural steel frames, support columns, and bespoke sections designed around real site conditions and load requirements.',
  },
  {
    title: 'Platforms & Staircases',
    href: '/services/staircases',
    label: 'Precision fabrication',
    description:
      'Steel staircases, raised platforms, and mezzanine structures engineered around confirmed tread geometry and fixing substrates.',
  },
  {
    title: 'Security Grills',
    href: '/services/security',
    label: 'Perimeter hardening',
    description:
      'Steel security grills, doors, access enclosures, and protective screens built for high-wear use and serviceability.',
  },
] as const

export default function ServicesPage() {
  return (
    <MarketingShell pathname="/services">
      <section className="relative overflow-hidden bg-steel py-14 md:py-24">
        <Image
          src={OFFICIAL_IMAGES.about.teamWorkshop}
          alt="Steel fabrication in the Steelyes workshop"
          fill
          className="object-cover opacity-50"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-white/75">Bespoke forge</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-8xl">
            Steelwork beyond
            <br />
            <span className="text-primary">the gate.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-white/85 md:text-base">
            A focused set of fabrication services that sit naturally alongside gates, delivered with the same emphasis on
            set-out, finish, and long-term serviceability. Details remain conservative until final client approvals are
            supplied.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Service index</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">Fabrication disciplines</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.href} className="border border-zinc-200 bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{service.label}</p>
              <h3 className="mt-3 font-heading text-2xl font-bold uppercase">{service.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-deep">{service.description}</p>
              <Link
                href={service.href}
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center border border-steel bg-canvas px-5 font-heading text-xs font-bold uppercase tracking-tight text-steel transition-colors hover:bg-paper"
              >
                View {service.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <article className="border border-zinc-200 bg-paper p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Approach</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Site-first <span className="text-primary">engineering</span>
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-deep">
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
        <div className="relative min-h-[340px] overflow-hidden border border-zinc-200">
          <Image
            src={OFFICIAL_IMAGES.about.teamWorkshop}
            alt="Steelyes workshop — steel fabrication in progress"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-steel py-16 text-white md:py-20">
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
            className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-primary px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Request a quote
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListSchema(
              SERVICES.map((service) => ({
                name: service.title,
                path: service.href,
                description: service.description,
              })),
            ),
          ),
        }}
      />
    </MarketingShell>
  )
}
