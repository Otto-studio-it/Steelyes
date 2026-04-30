import Link from 'next/link'
import { ArrowRight, MapPin, Star } from 'lucide-react'

import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function HomePage() {
  return (
    <MarketingShell pathname="/">
      <section className="relative min-h-[780px] overflow-hidden bg-[#1B1C1A] md:min-h-[870px]">
        <MediaPlaceholder
          label="Homepage hero image"
          aspectClassName="absolute inset-0 h-full w-full"
          className="bg-[#2B2B2B] [&>span]:text-white/35"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <h1 className="max-w-3xl font-heading text-5xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl">
            Your gate,
            <br />
            built by hand.
          </h1>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/configurator"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#9E000C] px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#9B1515] md:text-lg"
            >
              Configure your gate
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex min-h-[44px] items-center justify-center border border-white px-7 py-3 font-heading text-base font-bold uppercase tracking-tight text-white transition-colors hover:bg-white hover:text-[#1B1C1A] md:text-lg"
            >
              View our work
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            ['500+', 'Gates installed'],
            ['10yr', 'Workmanship warranty'],
            ['UK-wide', 'Supply & installation'],
            ['Free', 'Site survey'],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-mono text-lg font-bold text-[#9E000C]">{value}</p>
              <p className="font-heading text-sm font-bold uppercase text-[#5C403D]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#795916]">Precision engineering</p>
            <h2 className="font-heading text-4xl font-black uppercase leading-none md:text-5xl">The steel standards</h2>
          </div>
          <Link href="/gates" className="hidden font-heading text-sm font-bold uppercase text-[#9E000C] md:block">
            Browse all collections
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {['Modern', 'Classic', 'Privacy'].map((title, index) => (
            <article key={title} className="overflow-hidden rounded border border-zinc-200 bg-[#F5F3F0]">
              <MediaPlaceholder label={`${title} gate image`} aspectClassName="aspect-[4/5] w-full" />
              <div className="p-6">
                <h3 className="font-heading text-3xl font-bold uppercase">{title}</h3>
                <p className="mt-2 text-sm font-light text-[#5C403D]">
                  Placeholder descriptive copy for approved design structure matching client preview.
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-zinc-400">Durability</p>
                    <p className="font-mono text-sm font-bold">High-Grade</p>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" aria-hidden />
                  <div>
                    <p className="font-mono text-[10px] uppercase text-zinc-400">{index === 1 ? 'Forging' : 'Finish'}</p>
                    <p className="font-mono text-sm font-bold">{index === 1 ? 'Traditional' : 'Powder Coat'}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-14 text-center font-heading text-4xl font-black uppercase md:text-5xl">The process</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            {[
              ['01', 'Consultation'],
              ['02', 'Specification'],
              ['03', 'Fabrication'],
              ['04', 'Installation'],
            ].map(([n, label]) => (
              <article key={label} className="relative">
                <p className="mb-3 font-heading text-7xl font-black text-[#EFEEEB] md:text-8xl">{n}</p>
                <h3 className="font-heading text-2xl font-bold uppercase">{label}</h3>
                <p className="mt-2 text-sm font-light text-[#5C403D]">Approved process block placeholder copy.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#C41E1E] py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-5xl font-black uppercase leading-[0.92] md:text-6xl">
              Design your gate
              <br />
              in minutes.
            </h2>
            <p className="mt-5 text-lg font-light opacity-90">
              Experience our digital configurator with approved visual style and structure.
            </p>
            <Link
              href="/configurator"
              className="mt-8 inline-flex min-h-[44px] items-center justify-center bg-white px-9 py-4 font-heading text-lg font-bold uppercase tracking-tight text-[#9E000C]"
            >
              Start configuring
            </Link>
          </div>
          <div className="w-full max-w-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className="space-y-4">
              {[
                ['Material_selector', 'Galvanised Steel'],
                ['Finish_type', 'Anthracite Grey'],
                ['Automation', 'Hydraulic Swing'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/25 pb-3">
                  <span className="font-mono text-xs uppercase">{k}</span>
                  <span className="font-mono text-xs uppercase">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 text-right">
              <p className="font-mono text-4xl font-bold">£3,450.00</p>
              <p className="font-mono text-xs uppercase opacity-70">Estimated workshop price</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF9F6] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <h2 className="mb-6 font-heading text-4xl font-black uppercase">Voices from the forge</h2>
              <article className="border-l-4 border-[#9E000C] bg-[#EFEEEB] p-5">
                <div className="mb-3 flex text-[#795916]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={`star-${idx}`} className="h-4 w-4 fill-current stroke-current" />
                  ))}
                </div>
                <p className="text-sm italic text-[#5C403D]">
                  &ldquo;The structural quality is unmatched. You can feel the weight and precision the moment it moves.&rdquo;
                </p>
                <p className="mt-3 font-mono text-xs uppercase font-bold">- David R., Cotswolds</p>
              </article>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="relative col-span-2 h-72 overflow-hidden">
                <MediaPlaceholder label="Workshop location image" aspectClassName="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div>
                    <p className="font-heading text-4xl font-bold uppercase">Workshop location</p>
                    <p className="font-mono text-sm uppercase text-white/80">Sheffield, United Kingdom</p>
                  </div>
                </div>
              </div>
              <article className="bg-[#E4E2DF] p-6">
                <h3 className="font-heading text-2xl font-bold uppercase">UK-wide delivery</h3>
                <p className="mt-3 text-sm font-light text-[#5C403D]">Operating from South Yorkshire, we install nationwide.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[#9E000C]">
                  <MapPin className="h-4 w-4" aria-hidden />
                  <span className="font-mono text-xs uppercase">View coverage map</span>
                </div>
              </article>
              <MediaPlaceholder label="Technical detail image" aspectClassName="aspect-square w-full" />
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
