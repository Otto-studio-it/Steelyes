import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeWeldingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1B1C1A] md:min-h-[870px]">
      <Image
        src="/images/home/hero-modern-driveway-gate.jpg"
        alt="Modern bespoke steel driveway gate installed at a residential entrance"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay alleggerito — immagine reale deve essere visibile */}
      <div className="absolute inset-0 bg-black/38 md:bg-black/32" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      <div
        className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-28
                   supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))]
                   supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]"
      >
        {/* Overline differenziata dall'H1 */}
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/75">
          Steel fabrication · Made to measure
        </p>
        {/* Scala progressiva: 36px → 48px → 60px → 96px */}
        <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-8xl">
          Bespoke steel gates,
          <br />
          built to define your property.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
          Made-to-measure driveway, pedestrian, sliding and automated gates, designed around your entrance and fabricated
          for long-term strength.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#9E000C] px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515] md:text-lg"
          >
            Request a quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link
            href="/configurator"
            className="inline-flex min-h-[48px] items-center justify-center border border-white px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-white hover:text-[#1B1C1A] md:text-lg"
          >
            Configure your gate
          </Link>
        </div>
      </div>
    </section>
  )
}
