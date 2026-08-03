'use client'

import { useMemo } from 'react'
import { buildGateRenderPlan, type GateConfig, type GateRenderPrimitive } from '@steelyes/gate-engine'

import { CONFIGURATOR_PHOTO_BACKGROUNDS, OFFICIAL_IMAGES } from '@/lib/marketing/marketing-images'

function renderPrimitive(primitive: GateRenderPrimitive) {
  switch (primitive.kind) {
    case 'rect':
      return (
        <rect
          key={primitive.id}
          x={primitive.x}
          y={primitive.y}
          width={primitive.width}
          height={primitive.height}
          rx={primitive.rx}
          fill={primitive.fill}
          fillOpacity={primitive.fillOpacity}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          opacity={primitive.opacity}
        />
      )
    case 'line':
      return (
        <line
          key={primitive.id}
          x1={primitive.x1}
          y1={primitive.y1}
          x2={primitive.x2}
          y2={primitive.y2}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          opacity={primitive.opacity}
        />
      )
    case 'circle':
      return (
        <circle
          key={primitive.id}
          cx={primitive.cx}
          cy={primitive.cy}
          r={primitive.r}
          fill={primitive.fill}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          opacity={primitive.opacity}
        />
      )
    case 'path':
      return (
        <path
          key={primitive.id}
          d={primitive.d}
          fill={primitive.fill}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          opacity={primitive.opacity}
        />
      )
  }
}

type ConfiguratorPhotoPreviewProps = {
  config: GateConfig
  compact?: boolean
  studio?: boolean
}

export function ConfiguratorPhotoPreview({ config, compact = false, studio = false }: ConfiguratorPhotoPreviewProps) {
  const plan = useMemo(() => buildGateRenderPlan(config, { viewMode: 'installation' }), [config])
  const backgroundSrc =
    CONFIGURATOR_PHOTO_BACKGROUNDS[config.gateType] ?? OFFICIAL_IMAGES.homepageHero

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        studio ? 'min-h-[clamp(260px,44vh,480px)] border-white/10 bg-steel' : 'min-h-[320px] border-steel/10 bg-paper lg:min-h-[420px]'
      } ${compact ? 'min-h-[220px]' : ''}`}
      aria-label="Photo simulation preview with schematic gate overlay"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/75">Photo simulation (schematic)</p>
        <p className="mt-1 max-w-md text-xs leading-5 text-white/90">
          Gate outline from your configuration overlaid on a reference installation photo. Final photo-match follows site survey.
        </p>
      </div>
      <div className="absolute inset-0 flex items-end justify-center pb-[18%]">
        <svg
          viewBox={plan.viewBox}
          className="h-[58%] w-[72%] drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          role="presentation"
        >
          <g opacity={0.92}>
            {plan.primitives.filter((primitive) => !primitive.id.includes('dimension')).map(renderPrimitive)}
          </g>
        </svg>
      </div>
    </div>
  )
}
