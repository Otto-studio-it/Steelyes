import Image from 'next/image'
import { MarketingShell } from '@/components/marketing/MarketingShell'

export default function InstallationPage() {
  return (
    <MarketingShell pathname="/installation">
      <section className="relative overflow-hidden bg-[#111111] py-14 md:py-24">
        <Image
          src="/images/gates/sliding-gate-automated-open.jpg"
          alt="Steelyes gate installation"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-8xl">
            Precision built.
            <br />
            <span className="text-[#9E000C]">Master installed.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Site services</p>
        <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">The supply & install benefit</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {['On-site measurement', 'Structural alignment', 'Full handover'].map((title) => (
            <article key={title} className="border border-zinc-200 bg-white p-6">
              <h3 className="font-heading text-2xl font-bold uppercase">{title}</h3>
              <p className="mt-3 text-sm font-light text-[#5C403D]">Approved section structure with placeholder copy.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <article className="border border-zinc-200 bg-[#F8F8F8] p-6 md:p-8">
          <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Logistics</p>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">Nationwide engineering</h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#5C403D]">
            From pre-install checks to final commissioning, the approved layout combines logistics copy and operational
            steps.
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
              unoptimized
            />
          </div>
          <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-3 text-white">
            <p className="font-heading text-xs font-bold uppercase tracking-widest">Zones</p>
            <p className="font-mono text-[10px] uppercase text-white/80">UK-wide install team</p>
          </div>
          <div className="absolute -bottom-4 -left-1 bg-[#1B1C1A] p-4 text-white md:p-6">
            <p className="font-heading text-3xl font-black text-[#9E000C]">48H</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Site survey response</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F6F6] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 text-center font-heading text-4xl font-black uppercase md:text-5xl">The installation blueprint</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {['Technical Survey', 'Frame Setting', 'On-site Wiring', 'Final Tuning'].map((step, index) => (
              <article key={step} className="border border-zinc-200 bg-white p-6">
                <p className="mb-4 font-heading text-5xl font-black text-zinc-200">0{index + 1}</p>
                <h3 className="mb-2 font-heading text-xl font-bold uppercase">{step}</h3>
                <p className="text-sm font-light text-[#5C403D]">Placeholder content for approved installation page flow.</p>
                <div className="mt-5 h-0.5 w-14 bg-[#9E000C]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <h2 className="mb-8 font-heading text-4xl font-black uppercase md:text-5xl">
          Technical <span className="text-[#9E000C]">clarification</span>
        </h2>
        <div className="space-y-3">
          <details className="border border-zinc-200 bg-white p-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-heading text-sm font-bold uppercase tracking-tight">
              Do you handle electrical connections for automation?
              <span className="font-mono text-lg text-zinc-500">−</span>
            </summary>
            <p className="mt-4 text-sm font-light text-[#5C403D]">
              Yes. Installation teams include certified electricians to manage supply, controls, and access integration.
            </p>
          </details>
          {[
            'How long does a typical driveway install take?',
            'Are your installers Gate Safe certified?',
            'Can you install onto existing stone pillars?',
          ].map((q) => (
            <button
              key={q}
              type="button"
              className="flex min-h-[52px] w-full items-center justify-between border border-zinc-200 bg-white px-5 text-left font-heading text-sm font-bold uppercase tracking-tight"
            >
              {q}
              <span className="font-mono text-lg text-zinc-500">+</span>
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101010] py-16 text-white md:py-20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/gates/privacy-diagonal-gate-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
            unoptimized
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] md:text-6xl">
            Ready to define your perimeter?
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light text-white/85 md:text-base">
            Book your survey and we will outline gate geometry, set-out, and installation sequence for your project.
          </p>
          <button className="mt-8 min-h-[48px] bg-[#9E000C] px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white">
            Book free survey
          </button>
        </div>
      </section>
    </MarketingShell>
  )
}
