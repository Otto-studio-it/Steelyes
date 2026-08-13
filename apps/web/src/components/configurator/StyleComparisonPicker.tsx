'use client'

import Image from 'next/image'
import { GATE_STYLES, type GateStyle } from '@steelyes/gate-engine'

import { STYLE_IMAGES } from '@/lib/configurator/presentation'
import { styleLabel } from '@/lib/configurator/labels'
import { applyGateStyle } from '@/lib/configurator/style-actions'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function StyleComparisonPicker() {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)

  return (
    <div className="space-y-2">
      <span className="block font-mono text-xs uppercase tracking-widest text-muted">Gate style</span>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Gate style">
        {GATE_STYLES.map((style) => {
          const selected = config.style === style

          return (
            <button
              key={style}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setConfig(applyGateStyle(config, style as GateStyle))}
              className={`overflow-hidden border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                selected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-steel/12 bg-white hover:border-primary/30'
              }`}
            >
              <div className="relative h-28 w-full bg-steel/5">
                <Image
                  src={STYLE_IMAGES[style]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  aria-hidden
                />
              </div>
              <div className="border-t border-steel/8 px-4 py-3">
                <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  {styleLabel(style)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
