import { MarketingShell } from '@/components/marketing/MarketingShell'
import { MediaPlaceholder } from '@/components/marketing/MediaPlaceholder'

export default function ContactPage() {
  return (
    <MarketingShell pathname="/contact">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <p className="mb-3 inline-block border-l-2 border-[#9E000C] bg-[#EFEEEB] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9E000C]">
          Start your project
        </p>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.9] sm:text-5xl md:text-7xl">Contact the workshop</h1>
        <p className="mt-3 max-w-xl font-mono text-sm text-[#5C403D]">Direct line to our fabrication team.</p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-16 md:px-8 lg:grid-cols-2">
        <form className="space-y-6 border border-zinc-200 bg-white p-5 md:p-8">
          <h2 className="font-heading text-2xl font-black uppercase">Project brief</h2>
          <div className="inline-flex items-center gap-3 border border-[#9E000C]/20 bg-[#9E000C]/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse bg-[#9E000C]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E000C]">
              We respond within 1 business day
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="text-sm font-medium">
              Full name
              <input
                autoComplete="name"
                className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:ring-0"
              />
            </label>
            <label className="text-sm font-medium">
              Email
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:ring-0"
              />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Project type
            <select className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:ring-0">
              <option>Automated Swing Gates</option>
              <option>Pedestrian Entry</option>
              <option>Cantilever Sliding</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Postcode
            <input
              autoComplete="postal-code"
              className="mt-2 min-h-[44px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:ring-0"
            />
          </label>
          <label className="block text-sm font-medium">
            Project details
            <textarea
              rows={5}
              className="mt-2 min-h-[120px] w-full border-b border-zinc-300 bg-transparent px-0 focus:border-[#9E000C] focus:ring-0"
            />
          </label>
          <button
            type="button"
            className="inline-flex min-h-[44px] w-full items-center justify-center bg-[#9E000C] px-8 py-3 font-heading text-base font-bold uppercase tracking-[0.08em] text-white"
          >
            Send specification
          </button>
        </form>

        <div className="space-y-8">
          <MediaPlaceholder label="Location map placeholder" aspectClassName="aspect-video w-full border border-zinc-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">The Forge</h2>
              <p className="text-sm text-[#5C403D]">Unit 4, Vulcan Works, Sheffield, S1 4ST, United Kingdom</p>
            </div>
            <div>
              <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-[#9E000C]">Direct contact</h2>
              <p className="text-sm text-[#5C403D]">T: +44 (0) 114 234 5678</p>
              <p className="text-sm text-[#5C403D]">E: forge@steelyes.co.uk</p>
            </div>
          </div>
          <div className="border border-zinc-200 bg-[#F6F6F6] p-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Response window</p>
            <p className="mt-2 font-heading text-3xl font-black uppercase">24-48h</p>
            <p className="mt-3 text-sm text-[#5C403D]">Typical callback for survey bookings and technical feasibility.</p>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
