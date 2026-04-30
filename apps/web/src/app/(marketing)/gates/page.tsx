import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function GatesPage() {
  return (
    <MarketingShell pathname="/gates">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#9E000C]">Our gates</p>
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.9] md:text-8xl">Bespoke steel</h1>
          <p className="mt-5 max-w-2xl text-lg font-light text-[#5C403D]">
            Engineered for permanence. Hand-finished in our British workshop using premium-grade structural steel and
            architectural coatings.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-[#F5F3F0] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-4 md:px-8">
          {['Style aesthetic', 'Profile size', 'Opening mechanism'].map((label, index) => (
            <div key={label}>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#5C403D]">
                0{index + 1}. {label}
              </label>
              <div className="min-h-[44px] border border-zinc-300 bg-white px-3 py-3 font-heading text-sm font-bold uppercase">
                Modern Industrial
              </div>
            </div>
          ))}
          <button className="min-h-[44px] self-end bg-[#1B1C1A] px-8 py-3 font-heading text-sm font-bold uppercase text-white">
            Apply specs
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article key={`gate-${index}`} className="group">
              <div className="relative overflow-hidden bg-[#EFEEEB]">
                <MediaPlaceholder label={`Gate card image ${index + 1}`} aspectClassName="aspect-[4/5] w-full" />
                <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[10px] uppercase">
                  Ref: ST-{index + 1}0{index + 1}
                </span>
              </div>
              <h2 className="mt-5 font-heading text-3xl font-black uppercase">
                {[
                  'The Ironclad Single',
                  'Foundry Privacy Double',
                  'Monolith Cantilever',
                  'Heritage Estate Leaf',
                  'Veneer Hybrid Hybrid',
                  'Precision CNC Series',
                ][index]}
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">Material grade</p>
                  <p className="font-mono text-base">S275 Structural Steel</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">Max span</p>
                  <p className="font-mono text-base">4500mm</p>
                </div>
                <div className="flex items-end justify-between border-t border-zinc-200 pt-4">
                  <span className="font-heading text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Est. Starting From
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#9E000C]">
                    {['£1,450.00', '£2,890.00', '£4,200.00', '£1,200.00', '£2,100.00', '£3,500.00'][index]}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <button className="min-h-[44px] border border-zinc-300 px-10 py-3 font-heading text-sm font-bold uppercase tracking-widest">
            Load engineering catalogue
          </button>
        </div>
      </section>
    </MarketingShell>
  )
}
