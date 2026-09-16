'use client'

import {
  applyVictorianTipology,
  getVictorianTipology,
  resolveSilhouette,
  VICTORIAN_TIPOLOGIES,
  type VictorianTipology,
} from '@steelyes/gate-engine'

import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

const TIPOLOGY_COPY: Record<VictorianTipology, { label: string; description: string }> = {
  base: {
    label: 'Straight top',
    description: 'Rectangular Victorian frame',
  },
  arched: {
    label: 'Arched top',
    description: 'Curved top rail',
  },
  dog_bars: {
    label: 'Dog bars',
    description: 'Lower infill bars',
  },
  arched_dog_bars: {
    label: 'Arched + dog bars',
    description: 'Both shapes together',
  },
}

function tipologyThumb(config: ReturnType<typeof useConfiguratorConfig>, tipology: VictorianTipology): string {
  try {
    return resolveSilhouette(applyVictorianTipology(config, tipology)).publicPath
  } catch {
    return `/2d-masters/${config.gateType}/silhouettes/${tipology}.svg`
  }
}

/**
 * First-screen Victorian shape picker — swapping these MUST change the Design drawing.
 * Hidden on Composite Boards (those options are not drawn).
 */
export function TipologyPicker() {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)

  if (config.style !== 'traditional_victorian') {
    return (
      <p className="border-l-4 border-steel/20 bg-paper px-4 py-3 text-sm leading-6 text-muted-deep">
        Victorian shapes (arch, dog bars) are not available on Composite Boards. Switch style to
        Traditional Victorian to change the drawing.
      </p>
    )
  }

  const selected = getVictorianTipology(config)

  return (
    <div className="space-y-2">
      <span className="block font-mono text-xs uppercase tracking-widest text-muted">Gate shape</span>
      <p className="text-sm leading-6 text-muted-deep">
        This is the drawing the customer sees. Each card swaps the official 2D master for this mechanism.
      </p>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" role="radiogroup" aria-label="Gate shape">
        {VICTORIAN_TIPOLOGIES.map((tipology) => {
          const copy = TIPOLOGY_COPY[tipology]
          const isSelected = selected === tipology
          const thumb = tipologyThumb(config, tipology)

          return (
            <button
              key={tipology}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setConfig(applyVictorianTipology(config, tipology))}
              className={`overflow-hidden border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-steel/12 bg-white hover:border-primary/30'
              }`}
            >
              <div className="relative h-24 w-full bg-[#F3F2EF]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static public master SVG */}
                <img src={thumb} alt="" className="h-full w-full object-contain object-top p-1" />
              </div>
              <div className="border-t border-steel/8 px-3 py-2">
                <span className="block font-heading text-xs font-bold uppercase tracking-tight text-steel">
                  {copy.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-deep">{copy.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
