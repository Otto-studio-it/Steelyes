import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function ConfiguratorPage() {
  return (
    <MarketingShell pathname="/configurator">
      <section className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[42%_58%]">
        <aside className="order-2 border-t border-zinc-200 bg-white p-4 md:order-1 md:border-r md:border-t-0 md:p-8">
          <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Gate configurator</h1>
          <p className="mt-2 text-sm font-light text-[#5C403D]">
            Configure style, dimensions, and finish. UI replica based on approved preview.
          </p>

          <div className="mt-8 space-y-8">
            {[
              ['01', 'Select foundation style'],
              ['02', 'Dimensions (mm)'],
              ['03', 'Steel profile'],
              ['04', 'Architectural finish'],
              ['05', 'Additional upgrades'],
            ].map(([step, title]) => (
              <section key={step}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="bg-[#9E000C] px-2 py-1 font-mono text-xs text-white">{step}</span>
                  <h2 className="font-heading text-xl font-bold uppercase">{title}</h2>
                </div>
                <div className="rounded border border-zinc-200 bg-[#F5F3F0] p-4 text-sm text-[#5C403D]">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="min-h-[44px] border border-zinc-300 bg-white px-2 text-xs uppercase">
                      Option A
                    </button>
                    <button type="button" className="min-h-[44px] border border-zinc-300 bg-white px-2 text-xs uppercase">
                      Option B
                    </button>
                  </div>
                </div>
              </section>
            ))}
            <button className="min-h-[48px] w-full bg-[#9E000C] px-6 py-3 font-heading text-lg font-bold uppercase text-white">
              Generate technical quote
            </button>
          </div>
        </aside>

        <section className="order-1 bg-[#FBF9F6] p-4 md:order-2 md:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 border border-zinc-800 bg-[#1B1C1A] p-6 text-white">
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">Estimated lead value</p>
              <p className="mt-1 font-heading text-5xl font-black uppercase">£2,845</p>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ['Width', '3800 mm'],
                  ['Height', '1800 mm'],
                  ['Drive', 'Automated'],
                  ['Finish', 'Matt black'],
                ].map(([k, v]) => (
                  <div key={k} className="border border-white/20 bg-white/5 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">{k}</p>
                    <p className="mt-1 font-heading text-sm font-bold uppercase">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <MediaPlaceholder
                label="Configurator technical preview"
                aspectClassName="aspect-[16/9] w-full border border-zinc-200 bg-white"
              />
              <div className="absolute bottom-6 left-1/2 flex w-[70%] -translate-x-1/2 flex-col items-center">
                <div className="relative h-px w-full bg-zinc-300">
                  <span className="absolute -left-0.5 -top-1 h-3 w-px bg-zinc-300" />
                  <span className="absolute -right-0.5 -top-1 h-3 w-px bg-zinc-300" />
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Width: 3600mm</p>
              </div>
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center">
                <div className="relative h-40 w-px bg-zinc-300">
                  <span className="absolute -left-1 -top-0.5 h-px w-3 bg-zinc-300" />
                  <span className="absolute -bottom-0.5 -left-1 h-px w-3 bg-zinc-300" />
                </div>
                <p className="ml-1 [writing-mode:vertical-lr] font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Height: 1800mm
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                ['Material specification', 'S235JR Grade Steel'],
                ['Coat integrity', 'Double Powder-Coated'],
                ['Build origin', 'Sheffield, UK'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{k}</p>
                  <p className="mt-1 font-heading text-sm font-bold uppercase">{v}</p>
                  <div className="mt-2 h-0.5 w-8 bg-[#9E000C]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </MarketingShell>
  )
}
