'use client'

import {
  applyVictorianTipology,
  getVictorianTipology,
  resolveSilhouette,
  VICTORIAN_TIPOLOGIES,
  type VictorianTipology,
} from '@steelyes/gate-engine'

import { SelectedCheck } from '@/components/configurator/SelectedCheck'
import { useScrollSelectedIntoView } from '@/hooks/useScrollSelectedIntoView'
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
  const selected = config.style === 'traditional_victorian' ? getVictorianTipology(config) : null
  const stripRef = useScrollSelectedIntoView<HTMLDivElement>(selected)

  if (config.style !== 'traditional_victorian') {
    return (
      <p className="border-l-4 border-steel/20 bg-paper px-4 py-3 text-sm leading-6 text-muted-deep">
        Victorian shapes (arch, dog bars) are not available on Composite Boards. Switch style to
        Traditional Victorian to change the drawing.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <span className="block font-mono text-xs uppercase tracking-widest text-muted">Gate shape</span>
      <p className="text-sm leading-6 text-muted-deep">
        Choose the top and lower section. The drawing updates as you pick.
        <span className="sm:hidden"> Swipe to compare.</span>
      </p>
      {/* Phones: snap strip with large drawings (the shapes differ in small details). ≥sm: grid. */}
      <div
        ref={stripRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        role="radiogroup"
        aria-label="Gate shape"
      >
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
              className={`relative w-[74%] shrink-0 snap-start overflow-hidden border-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto ${
                isSelected ? 'border-primary bg-primary/5' : 'border-steel/12 bg-white hover:border-primary/30'
              }`}
            >
              {isSelected ? <SelectedCheck /> : null}
              <div className="relative h-40 w-full bg-[#F3F2EF] sm:h-28">
                {/* eslint-disable-next-line @next/next/no-img-element -- static public master SVG */}
                <img src={thumb} alt="" className="h-full w-full object-contain object-center p-1" />
              </div>
              <div className="border-t border-steel/8 px-3 py-2.5">
                <span className="block font-heading text-sm font-bold uppercase tracking-tight text-steel sm:text-xs">
                  {copy.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted-deep sm:text-xs">{copy.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
