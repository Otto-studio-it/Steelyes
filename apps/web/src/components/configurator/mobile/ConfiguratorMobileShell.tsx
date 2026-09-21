'use client'

import { useEffect, useRef } from 'react'

import { CustomizeLink } from '@/components/configurator/mobile/CustomizeLink'
import { MobilePreviewChip } from '@/components/configurator/mobile/MobilePreviewChip'
import { MobileQuickActionBar } from '@/components/configurator/mobile/MobileQuickActionBar'
import { MobileQuickProgress } from '@/components/configurator/mobile/MobileQuickProgress'
import { QuickGateScreen } from '@/components/configurator/mobile/QuickGateScreen'
import { QuickOpeningScreen } from '@/components/configurator/mobile/QuickOpeningScreen'
import { QuickQuoteScreen } from '@/components/configurator/mobile/QuickQuoteScreen'
import type { ConfiguratorActId } from '@/lib/configurator/navigation'
import { useConfiguratorViewport } from '@/hooks/useConfiguratorViewport'
import { useConfiguratorConfig, useConfiguratorQuickStep, useConfiguratorStore } from '@/store/configuratorStore'
import type { TenantBundle } from '@steelyes/gate-engine'

const STICKY_PREVIEW_TOP = 'calc(3.5rem + env(safe-area-inset-top, 0px))'
const MOBILE_CONTENT_BOTTOM_INSET = 'calc(var(--cfg-actionbar-h, 5.5rem) + 1rem)'
const SAFE_AREA_X =
  'supports-[padding:max(0px)]:pl-[max(1rem,env(safe-area-inset-left))] supports-[padding:max(0px)]:pr-[max(1rem,env(safe-area-inset-right))]'

const CUSTOMIZE_BY_STEP: { label: string; act: ConfiguratorActId }[] = [
  { label: 'All details', act: 'choose' },
  { label: 'All details', act: 'define' },
  { label: 'Add decorative details', act: 'refine' },
]

function QuickScreen({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <QuickGateScreen />
    case 1:
      return <QuickOpeningScreen />
    case 2:
      return <QuickQuoteScreen />
    default:
      return null
  }
}

/** Mobile Quick Path shell — 3 linear screens, compact chrome, escape to Design Studio. */
export function ConfiguratorMobileShell({ tenant }: { tenant?: TenantBundle }) {
  const config = useConfiguratorConfig()
  const step = useConfiguratorQuickStep()
  const setQuickStepIndex = useConfiguratorStore((state) => state.setQuickStepIndex)
  const customize = CUSTOMIZE_BY_STEP[step]
  const { isLandscapePhone } = useConfiguratorViewport()

  // System / browser back (Android predictive back, iOS swipe-back) steps the
  // Quick Path down instead of leaving the page. Each forward move pushes a
  // history entry; any back pops it and drives prevQuickStep via popstate.
  const prevStepRef = useRef(step)
  useEffect(() => {
    const onPopState = () => {
      const state = useConfiguratorStore.getState()
      if (state.flowMode === 'quick' && state.quickStepIndex > 0) {
        state.prevQuickStep()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (step > prevStepRef.current) {
      window.history.pushState({ cfgQuickStep: step }, '')
    }
    prevStepRef.current = step
  }, [step])

  return (
    <div className="relative bg-canvas">
      <div
        className={`sticky z-30 border-b border-steel/10 bg-steel px-4 py-2 ${SAFE_AREA_X}`}
        style={{ top: STICKY_PREVIEW_TOP }}
      >
        <MobilePreviewChip
          config={config}
          tenant={tenant}
          showDimensionOverlay
          onDimensionOverlayClick={() => setQuickStepIndex(1)}
          size={step === 0 && !isLandscapePhone ? 'tall' : 'compact'}
        />
      </div>

      <section
        className={`mx-auto max-w-2xl px-4 py-4 ${SAFE_AREA_X}`}
        style={{ paddingBottom: MOBILE_CONTENT_BOTTOM_INSET }}
      >
        <MobileQuickProgress step={step} />

        <div key={step} className="mt-5">
          <QuickScreen step={step} />
        </div>

        <div className="mt-6">
          <CustomizeLink label={customize.label} targetAct={customize.act} fromStep={step} />
        </div>
      </section>

      <MobileQuickActionBar />
    </div>
  )
}
