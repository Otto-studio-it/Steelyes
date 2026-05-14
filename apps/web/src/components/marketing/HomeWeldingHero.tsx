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
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-20 pt-40 md:min-h-[920px] md:justify-end md:px-8 md:pb-24">
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#9E000C]">
          Made to measure · Survey-led specification
        </p>
        <h1 className="max-w-[min(100%,42rem)] text-balance font-heading text-[clamp(1.75rem,4.2vw+0.35rem,3.75rem)] font-bold leading-[1.18] tracking-[-0.02em] text-white sm:leading-[1.14] md:max-w-[48rem] md:text-[clamp(2rem,3.6vw+0.5rem,3.75rem)] md:leading-[1.12]">
          Bespoke metalworks, glass balustrades and steel structures{' '}
          <span className="text-white/88">to define your property.</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
          Made to measure gates, railings, balconies and steelwork supplied and installed with care for long term
          durability and reliability.
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
            href="/gallery"
            className="inline-flex min-h-[52px] w-full items-center justify-center border border-white/40 px-8 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
          >
            Explore full archive
          </Link>
        </div>
      </div>
    </section>
  )
}
