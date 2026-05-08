import Image from 'next/image'
import { MarketingShell } from '@/components/marketing/MarketingShell'

const GALLERY_ITEMS = [
  { src: '/images/gates/sliding-gate-anthracite-residential.jpg', label: 'Anthracite sliding gate', ref: 'ST-2001', span: 'wide' },
  { src: '/images/railings/railings-black-cross-london.jpg', label: 'Black cross railings, London', ref: 'ST-2002', span: 'narrow' },
  { src: '/images/balconies/balcony-juliet-glass-london.jpg', label: 'Juliet glass balcony, London', ref: 'ST-2003', span: 'narrow' },
  { src: '/images/gates/classic-ornate-driveway-gate-arch.jpg', label: 'Classic ornate driveway gate', ref: 'ST-2004', span: 'narrow' },
  { src: '/images/railings/railings-ornate-copper-scroll.jpg', label: 'Ornate copper scroll railings', ref: 'ST-2005', span: 'narrow' },
  { src: '/images/gates/privacy-diagonal-gate-dusk.jpg', label: 'Privacy diagonal gate at dusk', ref: 'ST-2006', span: 'wide' },
  { src: '/images/balconies/balcony-rooftop-glass-london.jpg', label: 'Rooftop glass balcony, London', ref: 'ST-2007', span: 'narrow' },
  { src: '/images/railings/railings-victorian-spear-london.jpg', label: 'Victorian spear railings, London', ref: 'ST-2008', span: 'narrow' },
  { src: '/images/gates/sliding-gate-classic-ornate-tudor.jpg', label: 'Classic ornate Tudor sliding gate', ref: 'ST-2009', span: 'narrow' },
  { src: '/images/railings/railings-curved-black-steps.jpg', label: 'Curved black step railings', ref: 'ST-2010', span: 'narrow' },
] as const

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
              <option>South East &amp; London</option>
              <option>The Midlands</option>
              <option>North West</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.ref}
              className={`group relative overflow-hidden bg-[#EFEEEB] ${
                item.span === 'wide' ? 'lg:col-span-8' : 'lg:col-span-4'
              }`}
            >
              <div className={`relative w-full ${item.span === 'wide' ? 'aspect-[16/9]' : index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes={item.span === 'wide' ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/0 p-4 text-white">
                <p className="font-mono text-[10px] uppercase text-[#FFB4AB]">{item.ref}</p>
                <p className="font-heading text-xl font-bold uppercase">{item.label}</p>
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
