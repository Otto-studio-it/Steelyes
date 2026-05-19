'use client'

import { buildGateRenderPlan, type GateConfig, type GateRenderPrimitive } from '@steelyes/gate-engine'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { useConfiguratorStore } from '@/store/configuratorStore'

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
          strokeDasharray={primitive.strokeDasharray}
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
          strokeDasharray={primitive.strokeDasharray}
          strokeLinecap={primitive.strokeLinecap}
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
          fillOpacity={primitive.fillOpacity}
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
          fillOpacity={primitive.fillOpacity}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          strokeLinecap={primitive.strokeLinecap}
          strokeLinejoin={primitive.strokeLinejoin}
          opacity={primitive.opacity}
        />
      )
  }
}

type ConfiguratorPreviewProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  className?: string
}

export function ConfiguratorPreview({
  config,
  compact = false,
  collapsible = false,
  className = '',
}: ConfiguratorPreviewProps) {
  const previewExpanded = useConfiguratorStore((state) => state.previewExpanded)
  const togglePreviewExpanded = useConfiguratorStore((state) => state.togglePreviewExpanded)
  const plan = buildGateRenderPlan(config)
  const showBody = !collapsible || previewExpanded || !compact

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#1B1C1A]/10 bg-[#FBFBF8] shadow-[0_12px_32px_rgba(25,20,18,0.08)] lg:rounded-[28px] lg:shadow-[0_24px_64px_rgba(25,20,18,0.14)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#1B1C1A]/8 px-4 py-3 lg:px-5 lg:py-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8A807B]">2D preview</p>
          <h2 className="mt-0.5 truncate font-heading text-sm font-black uppercase tracking-tight text-[#1B1C1A] lg:mt-1 lg:text-lg">
            {plan.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!compact ? (
            <div className="hidden rounded-full border border-[#1B1C1A]/10 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#6D615D] sm:inline-flex">
              technical drawing
            </div>
          ) : null}
          {collapsible ? (
            <button
              type="button"
              onClick={togglePreviewExpanded}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#1B1C1A]/10 bg-white text-[#6D615D] transition hover:border-[#9E000C]/30 hover:text-[#9E000C]"
              aria-expanded={previewExpanded}
              aria-label={previewExpanded ? 'Collapse preview' : 'Expand preview'}
            >
              {previewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {showBody ? (
        <div className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_54%),linear-gradient(180deg,rgba(251,251,248,1),rgba(244,241,236,1))] p-3 lg:p-4">
          <svg
            viewBox={plan.viewBox}
            role="img"
            aria-label={`${plan.title}. ${plan.subtitle}. ${plan.notes.join(' ')}`}
            className={`h-auto w-full ${compact && !previewExpanded ? 'max-h-[120px]' : ''}`}
          >
            <title>{plan.title}</title>
            <desc>{`${plan.subtitle}. ${plan.notes.join(' ')}`}</desc>
            <rect x="0" y="0" width={plan.width} height={plan.height} rx="24" fill="#FEFEFC" stroke="#E8E4DD" strokeWidth="2" />
            <path d="M 0 720 H 1200" stroke="rgba(25,20,18,0.06)" strokeWidth="1.5" />
            <path d="M 72 620 H 1128" stroke="rgba(25,20,18,0.05)" strokeWidth="1" strokeDasharray="10 14" />
            {plan.primitives.map(renderPrimitive)}
            {plan.labels.map((label) => (
              <text
                key={label.id}
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fontSize={label.size}
                fontWeight={label.weight}
                fill={label.fill}
                opacity={label.opacity}
                fontFamily="var(--font-ibm-plex-mono)"
              >
                {label.text}
              </text>
            ))}
          </svg>
        </div>
      ) : (
        <div className="px-4 py-3">
          <p className="text-sm text-[#5B514D]">Tap to expand the live schematic preview.</p>
        </div>
      )}
    </div>
  )
}
