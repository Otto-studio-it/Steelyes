'use client'

import { ChevronLeft, DraftingCompass, ShieldCheck } from 'lucide-react'

import { ActProgressRail } from '@/components/configurator/ActProgressRail'
import { ChooseActPanel } from '@/components/configurator/acts/ChooseActPanel'
import { DefineActPanel } from '@/components/configurator/acts/DefineActPanel'
import { RefineActPanel } from '@/components/configurator/acts/RefineActPanel'
import { ConfiguratorActionBar } from '@/components/configurator/ConfiguratorActionBar'
import { ConfiguratorStudioHeader } from '@/components/configurator/ConfiguratorStudioHeader'
import { ConfiguratorMobileShell } from '@/components/configurator/mobile/ConfiguratorMobileShell'
import { MobilePreviewChip } from '@/components/configurator/mobile/MobilePreviewChip'
import { PreviewCanvas } from '@/components/configurator/PreviewCanvas'
import { SummaryStep } from '@/components/configurator/steps/SummaryStep'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { CONFIGURATOR_ACTS } from '@/lib/configurator/navigation'
import { humanizeValidationMessage } from '@/lib/configurator/labels'
import type { TenantBundle } from '@steelyes/gate-engine'
import {
  isPrimarySlice,
  useConfiguratorAct,
  useConfiguratorActValidationIssues,
  useConfiguratorConfig,
  useConfiguratorFlowMode,
  useConfiguratorStore,
  useConfiguratorValidationIssues,
} from '@/store/configuratorStore'

// Reserve exactly the measured compact action-bar height (published as
// --cfg-actionbar-h by ConfiguratorActionBar) plus an 8pt breathing gap.
// Fallback covers the first paint before the ResizeObserver runs.
const MOBILE_CONTENT_BOTTOM_INSET = 'calc(var(--cfg-actionbar-h, 5.5rem) + 1rem)'
const STICKY_PREVIEW_TOP = 'calc(3.5rem + env(safe-area-inset-top, 0px))'
const SAFE_AREA_X =
  'supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]'

function ActPanel() {
  const { act } = useConfiguratorAct()

  switch (act.id) {
    case 'choose':
      return <ChooseActPanel />
    case 'define':
      return <DefineActPanel />
    case 'refine':
      return <RefineActPanel />
    case 'summary':
      return <SummaryStep />
    default:
      return null
  }
}

function SpecPanel() {
  const { actIndex, act } = useConfiguratorAct()
  const actValidationIssues = useConfiguratorActValidationIssues()
  const summaryValidationIssues = useConfiguratorValidationIssues()
  const validationIssues = act.id === 'summary' ? summaryValidationIssues : actValidationIssues
  const blocked = validationIssues.length > 0 && act.id !== 'summary'

  return (
    <div className="border border-steel/10 bg-white">
      <div className="border-l border-steel/20 p-4 sm:p-5">
        <ActProgressRail />
        <div key={CONFIGURATOR_ACTS[actIndex].id} className="mt-5">
          <ActPanel />
        </div>

        {blocked ? (
          <div
            id="cfg-act-validation"
            role="alert"
            tabIndex={-1}
            className="mt-5 border border-steel/20 bg-paper px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-steel/40"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-steel">
              Resolve before continuing
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-deep">
              {validationIssues.slice(0, 3).map((issue) => (
                <li key={`${issue.field}:${issue.code}`}>{humanizeValidationMessage(issue.message)}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 hidden lg:block">
          <ConfiguratorActionBar variant="inline" />
        </div>
      </div>
    </div>
  )
}

function DesktopIntro() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Gate configurator</p>
      <h1 className="mt-2 text-balance font-heading text-[clamp(1.85rem,5vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-steel">
        Design your gate.
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-deep lg:text-lg">
        Choose how your gate opens, then set its shape, size, finish and options. The drawing
        updates as you go, with your measurements shown underneath.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 border border-steel/12 bg-white/80 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-steel">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Estimated pricing
        </span>
        <span className="inline-flex items-center gap-2 border border-steel/12 bg-white/80 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-muted">
          <DraftingCompass className="h-3.5 w-3.5" aria-hidden />
          Official 2D design
        </span>
      </div>
    </div>
  )
}

function MobileShell({
  config,
  tenant,
  showDimensionOverlay,
  onDimensionOverlayClick,
  onBackToQuick,
}: {
  config: ReturnType<typeof useConfiguratorConfig>
  tenant?: TenantBundle
  showDimensionOverlay: boolean
  onDimensionOverlayClick: () => void
  onBackToQuick?: () => void
}) {
  return (
    <div className="relative bg-canvas">
      <div
        className={`sticky z-30 border-b border-steel/10 bg-steel px-4 py-2 ${SAFE_AREA_X}`}
        style={{ top: STICKY_PREVIEW_TOP }}
      >
        <MobilePreviewChip
          config={config}
          tenant={tenant}
          showDimensionOverlay={showDimensionOverlay}
          onDimensionOverlayClick={onDimensionOverlayClick}
        />
      </div>

      <section
        className={`mx-auto max-w-7xl px-4 py-4 ${SAFE_AREA_X}`}
        style={{ paddingBottom: MOBILE_CONTENT_BOTTOM_INSET }}
      >
        {onBackToQuick ? (
          <button
            type="button"
            onClick={onBackToQuick}
            className="mb-3 inline-flex min-h-[44px] items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            Quick setup
          </button>
        ) : null}

        <SpecPanel />
      </section>

      <ConfiguratorActionBar variant="compact" className="lg:hidden" />
    </div>
  )
}

function DesktopShell({
  config,
  tenant,
  embed,
  showDimensionOverlay,
  onDimensionOverlayClick,
}: {
  config: ReturnType<typeof useConfiguratorConfig>
  tenant?: TenantBundle
  embed: boolean
  showDimensionOverlay: boolean
  onDimensionOverlayClick: () => void
  }) {
  return (
    <div className="relative min-h-screen bg-canvas">
      <ConfiguratorStudioHeader embed={embed} />

      <section className={`mx-auto max-w-7xl px-4 py-6 lg:px-8 ${embed ? 'py-4' : 'lg:py-8'} ${SAFE_AREA_X}`}>
        {embed ? null : <DesktopIntro />}

        <div className={`grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] ${embed ? 'mt-4' : 'mt-8'}`}>
          <div className="sticky top-[7.5rem] self-start">
            <PreviewCanvas
              config={config}
              tenant={tenant}
              showDimensionOverlay={showDimensionOverlay}
              onDimensionOverlayClick={onDimensionOverlayClick}
            />
          </div>

          <SpecPanel />
        </div>
      </section>
    </div>
  )
}

export function ConfiguratorShell({ embed = false, tenant }: { embed?: boolean; tenant?: TenantBundle }) {
  const config = useConfiguratorConfig()
  const viewport = useConfiguratorViewport()
  const flowMode = useConfiguratorFlowMode()
  const goToAct = useConfiguratorStore((state) => state.goToAct)
  const setQuickStepIndex = useConfiguratorStore((state) => state.setQuickStepIndex)
  const setFlowMode = useConfiguratorStore((state) => state.setFlowMode)
  const { act } = useConfiguratorAct()

  if (!viewport.ready) {
    return null
  }

  const isDesktop = viewport.mode === 'desktop'

  const showDimensionOverlay = act.id === 'define' || act.id === 'choose'

  // Phones + tablet default to Quick Path; desktop keeps Design Studio.
  if (viewport.isMobileQuickEligible && flowMode === 'quick') {
    return <ConfiguratorMobileShell tenant={tenant} />
  }

  return isDesktop ? (
    <DesktopShell
      config={config}
      tenant={tenant}
      embed={embed}
      showDimensionOverlay={showDimensionOverlay}
      onDimensionOverlayClick={() => goToAct('define')}
    />
  ) : (
    <MobileShell
      config={config}
      tenant={tenant}
      showDimensionOverlay={showDimensionOverlay}
      onDimensionOverlayClick={() => goToAct('define')}
      onBackToQuick={
        viewport.isMobileQuickEligible && isPrimarySlice(config)
          ? () => {
              setQuickStepIndex(0)
              setFlowMode('quick')
            }
          : undefined
      }
    />
  )
}

/** Design Studio shell — alias for embed compatibility */
export const ConfiguratorStudioShell = ConfiguratorShell
