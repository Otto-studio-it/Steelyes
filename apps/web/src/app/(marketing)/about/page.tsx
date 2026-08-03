import type { Metadata } from 'next'
import Image from 'next/image'

import { MarketingShell } from '@/components/marketing/MarketingShell'

export const metadata: Metadata = {
  title: 'About | UK Steel Gate Manufacturer & Fabricator',
  description:
    'Steelyes is a UK steel fabrication specialist. Bespoke driveway gates, railings and structural steelwork designed and built around each site and brief.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <MarketingShell pathname="/about">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <p className="mb-3 inline-block border-l-2 border-[#9E000C] bg-[#EFEEEB] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
          British Engineering Excellence
        </p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          Forged with
          <br />
          <span className="text-[#9E000C]">intent.</span>
        </h1>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-black uppercase sm:text-4xl">The workshop ethos</h2>
          <p className="text-base font-light leading-relaxed text-[#5C403D] md:text-lg">
            Every gate we build starts with the same question: what does this entrance actually need? Not a catalogue
            answer — a measured one. We survey the site, understand the substrate, the access requirements, the finish
            direction, and we fabricate around that reality. No approximations shipped to site and adjusted in the
            field. Steel cut to drawing, delivered ready to install.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="font-heading text-3xl font-black uppercase">Survey-led</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E000C]">Every project</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-black uppercase">Made to order</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E000C]">No stock gates</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/home-welding.jpg"
              alt="Steelyes workshop — steel fabrication in progress"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden md:translate-y-10">
            <Image
              src="/images/home/steelwork-finial-detail.jpg"
              alt="Steel finial detail — Steelyes fabrication quality"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#1B1C1A] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">What defines our craft</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              [
                '01',
                'No catalogue compromises',
                'Every gate is drawn from scratch. Dimensions, fixing centres, leaf weights and clearances are resolved on paper before a single cut is made. Nothing is adapted from stock.',
              ],
              [
                '02',
                'Engineering-first detailing',
                'We resolve structural details — hinge loads, post embedment, motor torque requirements — before specifying aesthetics. The geometry follows the engineering, not the other way around.',
              ],
              [
                '03',
                'Clean geometric language',
                'Our work avoids decoration for its own sake. Lines are sharp, proportions are deliberate, finishes are consistent. The result reads as considered rather than assembled.',
              ],
            ].map(([step, title, body]) => (
              <article key={step} className="border border-white/20 bg-white/5 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFB4AB]">{step}</p>
                <h3 className="mt-3 font-heading text-2xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            UK fabrication,
            <br />
            <span className="text-[#9E000C]">survey-led delivery</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-[#5C403D] md:text-base">
            We work on commissions across the United Kingdom, with our workshop based in Enfield, London. Projects range
            from single residential entrances to multi-gate commercial perimeters — each surveyed, drawn, fabricated and
            installed by the same team where our scope includes installation.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-zinc-200">
          <Image
            src="/images/home/modern-perforated-gate-detail.jpg"
            alt="Perforated steel gate detail — Steelyes fabrication"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>
    </MarketingShell>
  )
}
