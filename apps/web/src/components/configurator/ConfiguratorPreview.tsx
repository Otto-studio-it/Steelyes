'use client'

import { useMemo } from 'react'
import {
  buildGateRenderPlan,
  getFinishDefinition,
  type GateConfig,
  type GateRenderPrimitive,
  type GateRenderViewMode,
} from '@steelyes/gate-engine'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { useConfiguratorStore } from '@/store/configuratorStore'

function renderPrimitive(primitive: GateRenderPrimitive) {
  switch (primitive.kind) {
    case 'rect':
      return (
        <rect
          key={primitive.id}
          id={primitive.id}
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
  viewMode?: GateRenderViewMode
  compact?: boolean
  collapsible?: boolean
  pinned?: boolean
  studio?: boolean
  className?: string
}

type PreviewSvgProps = {
  plan: ReturnType<typeof buildGateRenderPlan>
  studio?: boolean
  className?: string
}

export function PreviewSvg({ plan, studio = false, className = '' }: PreviewSvgProps) {
  const isTechnical = plan.viewMode === 'technical'
  // Technical CAD sheets use plan.background paper/ground — no cream chrome overlay.
  const showChromeFrame = plan.viewMode !== 'installation' && !isTechnical
  const frameFill = showChromeFrame ? '#FEFEFC' : 'transparent'
  const frameStroke = showChromeFrame ? '#E8E4DD' : 'transparent'

  return (
    <svg
      viewBox={plan.viewBox}
      role="img"
      aria-label={`${plan.title}. ${plan.subtitle}. ${plan.notes.join(' ')}`}
      className={`h-auto w-full ${className}`}
    >
      <title>{plan.title}</title>
      <desc>{`${plan.subtitle}. ${plan.notes.join(' ')}`}</desc>
      {plan.background.map(renderPrimitive)}
      {showChromeFrame ? (
        <rect
          x="0"
          y="0"
          width={plan.width}
          height={plan.height}
          rx="24"
          fill={frameFill}
          stroke={frameStroke}
          strokeWidth={2}
        />
      ) : null}
      {plan.primitives.map(renderPrimitive)}
      {plan.labels.map((label) => (
        <text
          key={label.id}
          x={label.x}
          y={label.y}
          textAnchor={label.anchor}
          fontSize={label.size}
          fontWeight={label.weight}
          fill={studio && plan.viewMode === 'installation' ? '#F5F3F0' : label.fill}
          opacity={label.opacity}
          fontFamily={
            isTechnical ? 'var(--font-ibm-plex-mono), ui-monospace, monospace' : 'var(--font-ibm-plex-mono)'
          }
        >
          {label.text}
        </text>
      ))}
    </svg>
  )
}

export function ConfiguratorPreview({
  config,
  viewMode = 'installation',
  compact = false,
  collapsible = false,
  pinned = false,
  studio = false,
  className = '',
}: ConfiguratorPreviewProps) {
  const previewExpanded = useConfiguratorStore((state) => state.previewExpanded)
  const togglePreviewExpanded = useConfiguratorStore((state) => state.togglePreviewExpanded)
  const plan = useMemo(() => buildGateRenderPlan(config, { viewMode }), [config, viewMode])
  const finish = getFinishDefinition(config.finish)
  const isCollapsedPeek = !pinned && collapsible && compact && !previewExpanded
  const showFullBody = pinned || !collapsible || previewExpanded || !compact

  const shellClass = studio
    ? 'border-white/10 bg-steel text-white'
    : 'border-steel/10 bg-paper text-steel'

  const frameClass = studio
    ? 'overflow-hidden border-0 shadow-none rounded-none'
    : 'overflow-hidden rounded-2xl border shadow-[0_12px_32px_rgba(25,20,18,0.08)] lg:rounded-[28px] lg:shadow-[0_24px_64px_rgba(25,20,18,0.14)]'

  return (
    <div
      className={`${frameClass} ${shellClass} ${pinned && !studio ? 'shadow-[0_16px_40px_rgba(0,0,0,0.22)]' : ''} ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 ${studio ? 'border-white/10' : 'border-steel/8'} ${pinned ? 'py-2.5' : 'py-3 lg:px-5 lg:py-4'}`}
      >
        <div className="min-w-0">
          <p className={`font-mono text-[10px] uppercase tracking-[0.28em] ${studio ? 'text-white/55' : 'text-muted'}`}>
            {viewMode === 'installation' ? 'Installation preview' : 'Technical drawing'}
          </p>
          <h2
            className={`mt-0.5 truncate font-heading font-black uppercase tracking-tight ${
              pinned ? 'text-base sm:text-lg' : 'text-sm lg:mt-1 lg:text-lg'
            }`}
          >
            {plan.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
              studio ? 'border-white/15 bg-white/5 text-white/70' : 'border-steel/10 bg-white text-muted'
            }`}
            title={
              viewMode === 'technical'
                ? 'Colour appears in Installation view'
                : 'Schematic finish preview'
            }
          >
            <span
              className="h-3.5 w-3.5 shrink-0 border border-black/20"
              style={{ backgroundColor: finish.schematic.frame }}
              aria-hidden
            />
            <span className="max-w-[7rem] truncate">{finish.label}</span>
          </div>
          {!compact || pinned ? (
            <div
              className={`border px-3 py-1 font-mono text-xs uppercase tracking-widest ${
                studio ? 'border-white/15 bg-white/5 text-white/70' : 'border-steel/10 bg-white text-muted'
              } ${pinned ? 'inline-flex' : 'hidden sm:inline-flex'}`}
            >
              {config.widthMm} × {config.heightMm} mm
            </div>
          ) : null}
          {collapsible && !pinned ? (
            <button
              type="button"
              onClick={togglePreviewExpanded}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border transition ${
                studio
                  ? 'border-white/15 bg-white/5 text-white/80 hover:text-white'
                  : 'border-steel/10 bg-white text-muted hover:border-primary/30 hover:text-primary'
              }`}
              aria-expanded={previewExpanded}
              aria-label={previewExpanded ? 'Collapse preview' : 'Expand preview'}
            >
              {previewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {isCollapsedPeek ? (
        <button
          type="button"
          onClick={togglePreviewExpanded}
          className="flex w-full items-center gap-3 bg-gradient-to-b from-paper to-canvas px-3 py-3 text-left transition hover:from-white hover:to-paper"
          aria-label="Expand live schematic preview"
        >
          <div className="h-[72px] w-[112px] shrink-0 overflow-hidden rounded-xl border border-steel/10 bg-white">
            <PreviewSvg plan={plan} className="h-full w-full scale-[1.35] origin-top" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xs font-bold uppercase tracking-tight text-steel">Live preview</p>
            <p className="mt-1 text-sm leading-5 text-muted-deep">Tap to expand the gate preview.</p>
          </div>
        </button>
      ) : null}

      {showFullBody ? (
        <div
          className={`p-3 lg:p-4 ${studio ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,#242422,#151514)]' : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_54%),linear-gradient(180deg,rgba(251,251,248,1),rgba(244,241,236,1))]'} ${pinned ? 'flex min-h-[clamp(260px,44vh,480px)] items-center justify-center' : ''}`}
        >
          <PreviewSvg plan={plan} studio={studio} className={pinned ? 'max-h-[44vh] w-full' : ''} />
        </div>
      ) : null}
    </div>
  )
}
