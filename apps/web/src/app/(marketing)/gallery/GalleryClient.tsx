'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type GalleryItem = {
  src: string
  label: string
  ref: string
  span: 'wide' | 'narrow'
  category: 'gates' | 'railings' | 'balconies' | 'fabrication'
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: '/images/client-uploads/selected/1000048883.JPG',
    label: 'Wide black steel frontage',
    ref: 'ST-3001',
    span: 'wide',
    category: 'gates',
  },
  {
    src: '/images/client-uploads/selected/1000048866.JPG',
    label: 'Residential gate with clean geometry',
    ref: 'ST-3002',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: '/images/client-uploads/selected/1000051998.JPG',
    label: 'Decorative driveway gate arch',
    ref: 'ST-3003',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: '/images/client-uploads/selected/1000052251.JPG',
    label: 'Privacy gate with horizontal infill',
    ref: 'ST-3004',
    span: 'narrow',
    category: 'gates',
  },
  {
    src: '/images/client-uploads/selected/1000051985.JPG',
    label: 'Steel railings and stair landing',
    ref: 'ST-3005',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: '/images/client-uploads/selected/1000051989.JPG',
    label: 'Stair railing installation',
    ref: 'ST-3006',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: '/images/client-uploads/selected/1000052203.JPG',
    label: 'Balcony rail detail on townhouse frontage',
    ref: 'ST-3007',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: '/images/client-uploads/selected/1000048813.JPG',
    label: 'Ornamental railing detail',
    ref: 'ST-3008',
    span: 'narrow',
    category: 'railings',
  },
  {
    src: '/images/client-uploads/selected/1000052004.JPG',
    label: 'Terrace and balcony structure',
    ref: 'ST-3009',
    span: 'wide',
    category: 'balconies',
  },
  {
    src: '/images/client-uploads/selected/1000052209.JPG',
    label: 'Glass balcony edge detail',
    ref: 'ST-3010',
    span: 'narrow',
    category: 'balconies',
  },
  {
    src: '/images/client-uploads/selected/1000052212.JPG',
    label: 'Glass balcony under install',
    ref: 'ST-3011',
    span: 'narrow',
    category: 'balconies',
  },
  {
    src: '/images/client-uploads/selected/1000052013.JPG',
    label: 'Structural frame during fabrication',
    ref: 'ST-3012',
    span: 'wide',
    category: 'fabrication',
  },
  {
    src: '/images/client-uploads/selected/1000052007.JPG',
    label: 'Workshop fit-up and frame build',
    ref: 'ST-3013',
    span: 'narrow',
    category: 'fabrication',
  },
  {
    src: '/images/client-uploads/selected/1000052032.JPG',
    label: 'Fabrication detail in progress',
    ref: 'ST-3014',
    span: 'narrow',
    category: 'fabrication',
  },
  {
    src: '/images/client-uploads/selected/1000052181.JPG',
    label: 'Detail of panel and edge finish',
    ref: 'ST-3015',
    span: 'narrow',
    category: 'fabrication',
  },
  {
    src: '/images/client-uploads/selected/1000048834.JPG',
    label: 'Ornamental finish detail',
    ref: 'ST-3016',
    span: 'narrow',
    category: 'fabrication',
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
                  className={`min-h-[44px] border px-4 font-heading text-xs font-bold uppercase tracking-tight transition-colors ${
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
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {filtered.map((item, index) => (
            <div
              key={item.ref}
              className={`group relative overflow-hidden bg-paper ${
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
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/0 p-4 text-white">
                <p className="font-mono text-[10px] uppercase text-primary-soft">{item.ref}</p>
                <p className="font-heading text-xl font-bold uppercase">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-muted-deep">
            Have a gate, railing or fabrication project in mind? Share the site details and the type of work you need.
          </p>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center bg-primary px-8 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
          >
            Request a quote
          </Link>
        </div>
      </section>
    </>
  )
}
