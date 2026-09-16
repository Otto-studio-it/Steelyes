'use client'

import { useMemo } from 'react'
import { resolveFinishDefinition, type GateConfig } from '@steelyes/gate-engine'

import { buildColourFitDrawing } from '@/lib/configurator/colour-fit'
import { gateTypeLabel } from '@/lib/configurator/labels'

type ColourFitPreviewProps = {
  config: GateConfig
  compact?: boolean
}

/**
 * Live CAD colour/fit view. Follows finish, millimetres and middle bar.
 * Official workshop masters stay on the Design tab.
 */
export function ColourFitPreview({ config, compact = false }: ColourFitPreviewProps) {
  const finish = resolveFinishDefinition(config)
  const drawing = useMemo(() => {
    try {
      return { ok: true as const, value: buildColourFitDrawing(config) }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Colour fit schematic is unavailable for this configuration.'
      return { ok: false as const, message }
    }
  }, [config])

  return (
    <div data-testid="colour-fit-preview" data-finish={drawing.ok ? drawing.value.finishHex : undefined}>
      <div className={`flex items-center justify-between border-b border-steel/10 px-4 ${compact ? 'py-2.5' : 'py-3 lg:px-5 lg:py-4'}`}>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Colour fit</p>
          <h2
            className={`mt-0.5 truncate font-heading font-black uppercase tracking-tight text-steel ${
              compact ? 'text-base sm:text-lg' : 'text-sm lg:mt-1 lg:text-lg'
            }`}
          >
            {gateTypeLabel(config.gateType)}
          </h2>
        </div>
        <div
          className="inline-flex items-center gap-2 border border-steel/12 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
          title="Selected finish colour"
        >
          <span
            className="h-3.5 w-3.5 shrink-0 border border-black/20"
            style={{ backgroundColor: finish.schematic.frame }}
            aria-hidden
          />
          <span className="max-w-[7rem] truncate">{finish.label}</span>
        </div>
      </div>

      {drawing.ok ? (
        // eslint-disable-next-line @next/next/no-img-element -- live CAD SVG as data URI
        <img
          src={drawing.value.dataUri}
          alt={`${gateTypeLabel(config.gateType)} colour fit schematic, ${config.widthMm} by ${config.heightMm} millimetres, ${finish.label}`}
          className={`w-full bg-white object-contain object-top ${compact ? 'max-h-[240px]' : 'max-h-[min(52vh,520px)]'}`}
        />
      ) : (
        <p className="px-4 py-8 text-sm leading-6 text-muted-deep" role="status">
          {drawing.message}
        </p>
      )}

      <div className="border-t border-steel/10 bg-white px-4 py-3 lg:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Clear opening × height</p>
        <p className="mt-1 font-mono text-lg font-semibold tabular-nums tracking-tight text-steel sm:text-xl">
          {config.widthMm}
          <span className="mx-1.5 text-muted">×</span>
          {config.heightMm}
          <span className="ml-2 text-sm font-normal text-muted">mm</span>
        </p>
        <p className="mt-2 font-mono text-[10px] leading-4 text-muted">
          Schematic CAD — finish, size and middle bar follow this drawing. The official workshop master stays on
          Design.
        </p>
      </div>
    </div>
  )
}
