'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'

const PREVIEW_STATES = [
  { label: 'Mechanism', eyebrow: 'Current design', value: 'Double swing · Victorian' },
  { label: 'Dimensions', eyebrow: 'Clear opening', value: '3600 × 1800 mm' },
  { label: 'Finish', eyebrow: 'Powder coat', value: 'Anthracite grey' },
] as const

export function ConfiguratorProductPreview() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    if (interactive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % PREVIEW_STATES.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [interactive])

  const active = PREVIEW_STATES[activeIndex]

  return (
    <div className="relative border border-steel/12 bg-white p-3 sm:p-5" aria-label="Configurator preview demonstration">
      <div className="flex items-center justify-between gap-3 border-b border-steel/10 pb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Live design preview</span>
        <span className="border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Estimated price
        </span>
      </div>

      <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-paper sm:aspect-[16/10]">
        <Image
          src={OFFICIAL_IMAGES.gates.doubleSwing.hero}
          alt="Double swing steel gate shown as an example of the online configurator"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-steel/80 via-transparent to-transparent" />
        <div key={active.label} className="absolute inset-x-4 bottom-4 text-white motion-safe:animate-[marketing-preview-in_320ms_ease-out_both]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">{active.eyebrow}</p>
          <p className="mt-1 font-heading text-xl font-black uppercase sm:text-2xl">{active.value}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 divide-x divide-steel/10 border border-steel/10 bg-paper">
        {PREVIEW_STATES.map((state, index) => {
          const selected = index === activeIndex
          return (
            <button
              key={state.label}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setInteractive(true)
                setActiveIndex(index)
              }}
              className={`tap-feedback relative min-h-[48px] px-1 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:px-3 sm:tracking-widest ${
                selected ? 'bg-steel text-white' : 'text-muted-deep hover:bg-white hover:text-primary'
              }`}
            >
              {state.label}
              <span
                className={`absolute inset-x-2 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ${
                  selected ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
