'use client'

import { useState } from 'react'
import Image from 'next/image'

type GalleryItem = {
  src: string
  label: string
  ref: string
  span: 'wide' | 'narrow'
  category: 'gates' | 'railings' | 'balconies'
}

const GALLERY_ITEMS: GalleryItem[] = [
  { src: '/images/gates/sliding-gate-anthracite-residential.jpg', label: 'Anthracite sliding gate', ref: 'ST-2001', span: 'wide', category: 'gates' },
  { src: '/images/railings/railings-black-cross-london.jpg', label: 'Black cross railings, London', ref: 'ST-2002', span: 'narrow', category: 'railings' },
  { src: '/images/balconies/balcony-juliet-glass-london.jpg', label: 'Juliet glass balcony, London', ref: 'ST-2003', span: 'narrow', category: 'balconies' },
  { src: '/images/gates/classic-ornate-driveway-gate-arch.jpg', label: 'Classic ornate driveway gate', ref: 'ST-2004', span: 'narrow', category: 'gates' },
  { src: '/images/railings/railings-ornate-copper-scroll.jpg', label: 'Ornate copper scroll railings', ref: 'ST-2005', span: 'narrow', category: 'railings' },
  { src: '/images/gates/privacy-diagonal-gate-dusk.jpg', label: 'Privacy diagonal gate at dusk', ref: 'ST-2006', span: 'wide', category: 'gates' },
  { src: '/images/balconies/balcony-rooftop-glass-london.jpg', label: 'Rooftop glass balcony, London', ref: 'ST-2007', span: 'narrow', category: 'balconies' },
  { src: '/images/railings/railings-victorian-spear-london.jpg', label: 'Victorian spear railings, London', ref: 'ST-2008', span: 'narrow', category: 'railings' },
  { src: '/images/gates/sliding-gate-classic-ornate-tudor.jpg', label: 'Classic ornate Tudor sliding gate', ref: 'ST-2009', span: 'narrow', category: 'gates' },
  { src: '/images/railings/railings-curved-black-steps.jpg', label: 'Curved black step railings', ref: 'ST-2010', span: 'narrow', category: 'railings' },
]

const FILTERS = [
  { label: 'All works', value: 'all' },
  { label: 'Gates', value: 'gates' },
  { label: 'Railings', value: 'railings' },
  { label: 'Balconies', value: 'balconies' },
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
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#795916]">Project filters</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveFilter(value)}
                  aria-pressed={activeFilter === value}
                  className={`min-h-[44px] border px-4 font-heading text-xs font-bold uppercase tracking-tight transition-colors ${
                    activeFilter === value
                      ? 'border-[#1B1C1A] bg-[#1B1C1A] text-white'
                      : 'border-zinc-200 bg-[#F5F3F0] text-zinc-700 hover:border-zinc-400'
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
    </>
  )
}
