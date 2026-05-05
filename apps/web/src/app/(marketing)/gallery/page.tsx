import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function GalleryPage() {
  return (
    <MarketingShell pathname="/gallery">
      <section className="mx-auto max-w-7xl border-l-4 border-[#9E000C] px-4 py-10 md:px-8 md:py-16">
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-8xl">
          The installation
          <br />
          <span className="text-[#9E000C]">Archive</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-light text-[#5C403D] md:text-lg">
          A definitive collection of Steelyes commissions. Each project is presented with the approved editorial tone.
        </p>
      </section>

      <section className="mx-auto mb-10 max-w-7xl border-b border-zinc-200 px-4 pb-8 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#795916]">Project filters</p>
            <div className="flex flex-wrap gap-2">
              {['All works', 'Cantilever', 'Bifold', 'Pedestrian', 'Architectural screens'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`min-h-[44px] border px-4 font-heading text-xs font-bold uppercase tracking-tight ${
                    index === 0 ? 'border-[#1B1C1A] bg-[#1B1C1A] text-white' : 'border-zinc-200 bg-[#F5F3F0] text-zinc-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="w-full md:w-auto">
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-[#795916]">Region selection</span>
            <select className="min-h-[44px] w-full border-0 border-b border-zinc-300 bg-transparent px-0 py-1 font-heading text-base font-bold uppercase tracking-tight focus:border-[#9E000C] focus:ring-0 md:w-64">
              <option>United Kingdom (All)</option>
              <option>South East & London</option>
              <option>The Midlands</option>
              <option>North West</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={`gallery-${index}`}
              className={`group relative overflow-hidden bg-[#EFEEEB] ${
                index === 0 || index === 5 ? 'lg:col-span-8' : 'lg:col-span-4'
              }`}
            >
              <MediaPlaceholder
                label={`Project image ${index + 1}`}
                aspectClassName={`w-full ${
                  index === 0 || index === 5 ? 'aspect-[16/9]' : index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-white">
                <p className="font-mono text-[10px] uppercase text-[#FFB4AB]">Project #{2000 + index}</p>
                <p className="font-heading text-xl font-bold uppercase">Project title {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <button
          type="button"
          className="mx-auto flex min-h-[48px] items-center justify-center border border-[#9E000C] bg-white px-8 font-heading text-sm font-bold uppercase tracking-tight text-[#9E000C]"
        >
          Load more projects
        </button>
      </section>
    </MarketingShell>
  )
}
