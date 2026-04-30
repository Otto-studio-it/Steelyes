import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function AboutPage() {
  return (
    <MarketingShell pathname="/about">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <p className="mb-3 inline-block border-l-2 border-[#9E000C] bg-[#EFEEEB] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
          British Engineering Excellence
        </p>
        <h1 className="font-heading text-5xl font-black uppercase leading-[0.9] md:text-8xl">
          Forged with
          <br />
          <span className="text-[#9E000C]">intent.</span>
        </h1>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-4xl font-black uppercase">The workshop ethos</h2>
          <p className="text-lg font-light leading-relaxed text-[#5C403D]">
            Our workshop is where raw steel meets digital accuracy. Placeholder copy until final client content is
            inserted.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div>
              <p className="font-heading text-5xl font-black">15+</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E000C]">Years Experience</p>
            </div>
            <div>
              <p className="font-heading text-5xl font-black">2.4k</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9E000C]">Forged installs</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MediaPlaceholder label="Workshop image one" aspectClassName="aspect-[4/5] w-full" />
          <MediaPlaceholder label="Workshop image two" aspectClassName="aspect-[4/5] w-full translate-y-10" />
        </div>
      </section>

      <section className="bg-[#1B1C1A] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 font-heading text-4xl font-black uppercase md:text-5xl">What defines our craft</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ['01', 'No catalogue compromises'],
              ['02', 'Engineering-first detailing'],
              ['03', 'Clean geometric language'],
            ].map(([step, title]) => (
              <article key={step} className="border border-white/20 bg-white/5 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFB4AB]">{step}</p>
                <h3 className="mt-3 font-heading text-2xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-sm text-white/80">Placeholder copy until client finalizes the approved story text.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
            Built for London,
            <br />
            <span className="text-[#9E000C]">designed to endure</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-[#5C403D] md:text-base">
            This block mirrors the approved split-layout style used across the page: statement copy on the left,
            supporting visual on the right.
          </p>
        </div>
        <MediaPlaceholder label="Fabrication close-up" aspectClassName="aspect-[4/3] w-full border border-zinc-200" />
      </section>
    </MarketingShell>
  )
}
