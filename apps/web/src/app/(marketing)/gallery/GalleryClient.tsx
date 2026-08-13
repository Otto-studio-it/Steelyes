'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'

type GalleryItem = {
  src: string
  label: string
  ref: string
  span: 'wide' | 'narrow'
  category: 'gates' | 'railings' | 'balconies' | 'fabrication'
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: OFFICIAL_IMAGES.gates.doubleSwing.hero,
    label: 'Double swing driveway gate',
    ref: 'ST-3001',
    span: 'wide',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.gates.trackedSliding.hero,
    label: 'Tracked sliding steel gate',
    ref: 'ST-3002',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.gates.cantilever.hero,
    label: 'Cantilever sliding gate',
    ref: 'ST-3003',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.gates.bifoldDouble.hero,
    label: 'Bifold double swing gate',
    ref: 'ST-3004',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.gates.singleSwing.hero,
    label: 'Single swing side gate',
    ref: 'ST-3005',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.gates.telescopic.hero,
    label: 'Telescopic sliding gate',
    ref: 'ST-3006',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: OFFICIAL_IMAGES.services.staircases.glass,
    label: 'Glass staircase balustrade',
    ref: 'ST-3008',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: OFFICIAL_IMAGES.services.staircases.primary,
    label: 'Steel staircase installation',
    ref: 'ST-3009',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: OFFICIAL_IMAGES.services.staircases.secondary,
    label: 'Staircase and landing detail',
    ref: 'ST-3010',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: OFFICIAL_IMAGES.services.balconies.glass,
    label: 'Glass balcony terrace',
    ref: 'ST-3011',
    span: 'wide',
    category: 'balconies',
  },
  {
    src: OFFICIAL_IMAGES.services.balconies.metal,
    label: 'Metal balcony structure',
    ref: 'ST-3012',
    span: 'narrow',
    category: 'balconies',
  },
  {
    src: OFFICIAL_IMAGES.services.balconies.mixed,
    label: 'Balcony frontage detail',
    ref: 'ST-3013',
    span: 'narrow',
    category: 'balconies',
  },
  {
    src: OFFICIAL_IMAGES.services.structures.hero,
    label: 'Steel structure with glass enclosure',
    ref: 'ST-3014',
    span: 'wide',
    category: 'fabrication',
  },
  {
    src: OFFICIAL_IMAGES.about.teamWorkshop,
    label: 'Workshop fabrication team',
    ref: 'ST-3015',
    span: 'narrow',
    category: 'fabrication',
  },
  {
    src: OFFICIAL_IMAGES.services.securityGrills[0],
    label: 'Security grille installation',
    ref: 'ST-3016',
    span: 'narrow',
    category: 'fabrication',
  },
  {
    src: OFFICIAL_IMAGES.services.railings.garden,
    label: 'Garden terrace balustrade',
    ref: 'ST-3017',
    span: 'narrow',
    category: 'railings',
  },
]

const FILTERS = [
  { label: 'All works', value: 'all' },
  { label: 'Gates', value: 'gates' },
  { label: 'Railings', value: 'railings' },
  { label: 'Balconies', value: 'balconies' },
  { label: 'Fabrication', value: 'fabrication' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

export function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  const filtered = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter)

  return (
    <>
      <section className="mx-auto mb-10 max-w-7xl border-b border-zinc-200 px-4 pb-8 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-foundry-gold">Project filters</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveFilter(value)}
                  aria-pressed={activeFilter === value}
                  className={`tap-feedback min-h-[44px] border px-4 font-heading text-xs font-bold uppercase tracking-tight ${
                    activeFilter === value
                      ? 'border-steel bg-steel text-white'
                      : 'border-zinc-200 bg-canvas text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400" role="status" aria-live="polite">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div key={activeFilter} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {filtered.map((item, index) => (
            <div
              key={item.ref}
              className={`marketing-gallery-item group relative overflow-hidden bg-paper ${
                item.span === 'wide' ? 'lg:col-span-8' : 'lg:col-span-4'
              }`}
              style={{ animationDelay: `${Math.min(index, 5) * 45}ms` }}
            >
              <div className={`relative w-full ${item.span === 'wide' ? 'aspect-[16/9]' : index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes={item.span === 'wide' ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                  className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/0 p-4 text-white">
                <p className="font-mono text-[10px] uppercase text-primary-soft">{item.ref}</p>
                <p className="font-heading text-xl font-bold uppercase">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-6 border-t border-zinc-200 pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foundry-gold">From inspiration to design</p>
            <h2 className="mt-2 max-w-2xl font-heading text-3xl font-black uppercase leading-none text-steel sm:text-4xl">
              Found a direction for your gate?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-deep">
              Explore the mechanism, proportions, finish and estimated price online. Final dimensions and specification
              are confirmed after site survey.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            <Link
              href="/configurator"
              data-configurator-placement="gallery-footer"
              className="tap-feedback group inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-primary px-8 font-heading text-sm font-bold uppercase text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Design your gate
              <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="tap-feedback inline-flex min-h-[48px] w-full items-center justify-center border border-steel/25 px-8 font-heading text-sm font-bold uppercase text-steel hover:border-steel hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
