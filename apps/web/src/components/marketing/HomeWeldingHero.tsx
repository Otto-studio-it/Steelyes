import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeWeldingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1B1C1A] md:min-h-[calc(100svh-4rem)]">
      <Image
        src="/images/home/hero-modern-driveway-gate.jpg"
        alt="Modern bespoke steel driveway gate installed at a residential entrance"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center motion-safe:animate-hero-image-in motion-reduce:opacity-100"
      />
      {/* layered overlays — keep product photo visible while protecting left-side copy */}
      <div className="absolute inset-0 bg-black/38 md:bg-black/32" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent md:h-28" />

      {/* overline brand strip */}
      <div className="absolute left-0 right-0 top-0 flex items-center gap-6 px-4 pt-24 md:px-8 md:pt-8">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 motion-safe:animate-hero-reveal motion-reduce:opacity-100">
          London
        </span>
        <span
          className="h-px flex-1 origin-left bg-white/15 motion-safe:animate-hero-line-draw motion-safe:[animation-delay:120ms] motion-reduce:scale-x-100"
          aria-hidden
        />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 motion-safe:animate-hero-reveal motion-safe:[animation-delay:280ms] motion-reduce:opacity-100">
          Steel fabrication
        </span>
      </div>

      {/* main content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-20 pt-40 supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))] md:min-h-[calc(100svh-4rem)] md:justify-center md:px-8 md:pb-16 md:pt-20">
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#9E000C] motion-safe:animate-hero-reveal motion-safe:[animation-delay:200ms] motion-reduce:opacity-100">
          Made to measure · Survey-led specification
        </p>
        <h1 className="max-w-[min(100%,42rem)] text-balance font-heading text-[clamp(1.75rem,4.2vw+0.35rem,3.75rem)] font-bold leading-[1.18] tracking-[-0.02em] text-white motion-safe:animate-hero-reveal motion-safe:[animation-delay:320ms] motion-reduce:opacity-100 sm:leading-[1.14] md:max-w-[48rem] md:text-[clamp(2rem,3.6vw+0.5rem,3.75rem)] md:leading-[1.12]">
          Bespoke metalworks, gates and railings, glass balustrades and structural steel{' '}
          <span className="text-white/88">to define and upgrade your property.</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80 motion-safe:animate-hero-reveal motion-safe:[animation-delay:440ms] motion-reduce:opacity-100 md:text-base">
          Made to measure gates, railings, balconies and steelwork supplied and installed with care for long term
          durability and reliability.
        </p>
        <div className="mt-8 flex flex-col gap-3 motion-safe:animate-hero-reveal motion-safe:[animation-delay:560ms] motion-reduce:opacity-100 sm:flex-row">
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
