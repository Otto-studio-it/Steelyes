import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeWeldingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1B1C1A] md:min-h-[920px]">
      <Image
        src="/images/home/hero-modern-driveway-gate.jpg"
        alt="Modern bespoke steel driveway gate installed at a residential entrance"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* layered overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

      {/* overline brand strip */}
      <div className="absolute left-0 right-0 top-0 flex items-center gap-6 px-4 pt-24 md:px-8 md:pt-28">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Est. London</span>
        <span className="h-px flex-1 bg-white/15" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Steel fabrication</span>
      </div>

      {/* main content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-36 pt-40 md:min-h-[920px] md:justify-end md:px-8 md:pb-32">
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#9E000C]">
          Made to measure · Survey-led specification
        </p>
        <h1 className="max-w-4xl font-heading text-[clamp(2.25rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-white">
          Bespoke steel gates,
          <br />
          <span className="text-white/90">built to define</span>
          <br />
          your property.
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
          Made-to-measure driveway, pedestrian, sliding and automated gates — designed around your entrance and fabricated
          for long-term strength.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 bg-[#9E000C] px-8 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#C41E1E] sm:w-auto"
          >
            Request a quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/gates"
            className="inline-flex min-h-[52px] w-full items-center justify-center border border-white/40 px-8 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
          >
            Explore gate styles
          </Link>
        </div>
      </div>

      {/* bottom stat bar — 2-col on mobile, 4-col on md+ */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/55 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-4 md:grid-cols-4 md:px-8">
          {[
            ['Made to measure', 'Your opening'],
            ['Survey-led', 'Before fabrication'],
            ['Automated options', 'All gate types'],
            ['Supply & install', 'Brief to handover'],
          ].map(([val, label]) => (
            <div key={label} className="px-3 py-4 first:pl-0 md:px-6">
              <p className="font-heading text-xs font-black uppercase text-white sm:text-sm md:text-base">{val}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-white/45 md:text-[10px]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
