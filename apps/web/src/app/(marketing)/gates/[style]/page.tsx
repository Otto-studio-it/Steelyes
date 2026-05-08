import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { MarketingShell } from '@/components/marketing/MarketingShell'

import { GATE_DATA, GATE_SLUGS, type GateSlug } from '../gate-marketing-data'

export function generateStaticParams() {
  return GATE_SLUGS.map((style) => ({ style }))
}

export function generateMetadata({ params }: { params: { style: string } }) {
  const gate = GATE_DATA[params.style as GateSlug]
  if (!gate) return {}
  return {
    title: `${gate.title} Gates | Bespoke Steel Gates | Steelyes`,
    description: gate.description,
  }
}

export default function GateDetailPage({ params }: { params: { style: string } }) {
  const gate = GATE_DATA[params.style as GateSlug]
  if (!gate) notFound()

  return (
    <MarketingShell pathname="/gates">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-3 flex items-center gap-3">
          <Link
            href="/gates"
            className="font-mono text-[10px] uppercase tracking-widest text-[#9E000C] hover:underline"
          >
            Our gates
          </Link>
          <span className="font-mono text-[10px] text-zinc-400">/</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">{gate.title}</span>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#9E000C]">{gate.subtitle}</p>
            <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">
              {gate.title}
            </h1>
            <p className="mt-4 font-heading text-lg font-bold uppercase tracking-wide text-[#5C403D]">
              {gate.tagline}
            </p>
            <p className="mt-5 max-w-xl text-base font-light text-[#5C403D] md:text-lg">{gate.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-block bg-[#1B1C1A] px-8 py-3 font-heading text-sm font-bold uppercase text-white"
              >
                Request a quote
              </Link>
              <Link
                href="/gates"
                className="inline-block border border-zinc-300 px-8 py-3 font-heading text-sm font-bold uppercase"
              >
                All gate types
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEEEB]">
            <Image
              src={gate.heroImage}
              alt={`${gate.title} gate`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
            <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase">
              Ref: {gate.ref}
            </span>
          </div>
        </div>
      </section>

      {/* Specs strip */}
      <section className="border-y border-zinc-200 bg-[#F5F3F0] py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Technical specification</p>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gate.specs.map((spec) => (
              <div key={spec.label} className="border-l-2 border-[#9E000C] pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{spec.label}</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-[#1B1C1A]">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            All specifications are indicative and subject to site survey and confirmation.
          </p>
        </div>
      </section>

      {/* Features + gallery */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-[#9E000C]">Key features</p>
            <ul className="space-y-4">
              {gate.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 block h-2 w-2 shrink-0 bg-[#9E000C]" aria-hidden />
                  <span className="font-mono text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gate.detailImages.map((src, n) => (
              <div key={n} className="relative aspect-square overflow-hidden bg-[#EFEEEB]">
                <Image
                  src={src}
                  alt={`${gate.title} gate detail ${n + 1}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="border-t border-zinc-200 bg-[#F5F3F0] py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Pricing</p>
              <p className="mt-1 font-heading text-2xl font-black uppercase text-[#1B1C1A]">
                Indicative, subject to survey
              </p>
              <p className="mt-2 max-w-md font-mono text-xs text-zinc-500">
                Final pricing depends on span, infill, finish, ground conditions, and automation requirements. Contact us
                to start a measured quote path.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block self-start bg-[#9E000C] px-10 py-4 font-heading text-sm font-bold uppercase text-white md:self-auto"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
