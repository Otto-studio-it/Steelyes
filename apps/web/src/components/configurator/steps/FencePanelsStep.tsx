'use client'

import { EMPTY_FENCE_PANEL_INPUT, FENCE_PANEL_LIMITS } from '@steelyes/gate-engine'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function FencePanelsStep() {
  const config = useConfiguratorConfig()
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const fencePanels = config.fencePanels
  const enabled = fencePanels.quantity > 0

  const updatePanel = (index: number, patch: Partial<{ heightMm: number; lengthMm: number }>) => {
    const panels = fencePanels.panels.map((panel, panelIndex) =>
      panelIndex === index ? { ...panel, ...patch } : panel,
    )
    patchConfig({ fencePanels: { ...fencePanels, panels } })
  }

  const setEnabled = (nextEnabled: boolean) => {
    if (!nextEnabled) {
      patchConfig({ fencePanels: EMPTY_FENCE_PANEL_INPUT })
      return
    }

    patchConfig({
      fencePanels: {
        quantity: 1,
        panels: [{ heightMm: config.heightMm, lengthMm: 2400 }],
      },
    })
  }

  const setQuantity = (quantity: number) => {
    const count = Math.max(0, Math.min(12, quantity))
    if (count === 0) {
      patchConfig({ fencePanels: EMPTY_FENCE_PANEL_INPUT })
      return
    }

    const panels = Array.from({ length: count }, (_, index) => fencePanels.panels[index] ?? {
      heightMm: config.heightMm,
      lengthMm: 2400,
    })

    patchConfig({ fencePanels: { quantity: count, panels } })
  }

  return (
    <div className="space-y-4">
      <div className="border border-steel/10 bg-paper p-4">
        <ConfiguratorSwitch
          checked={enabled}
          onCheckedChange={setEnabled}
          label="Include railing panels"
          description="Optional run of panels to either side of the gate."
          id="fence-panels-enabled"
        />
      </div>

      {enabled ? (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Number of railing panels</span>
            <input
              type="number"
              min={1}
              max={12}
              value={fencePanels.quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>

          {fencePanels.panels.map((panel, index) => (
            <div key={`fence-panel-${index}`} className="border border-steel/10 bg-white p-4">
              <p className="font-heading text-xs font-bold uppercase tracking-tight text-steel">Panel {index + 1}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted">
                    Height (mm, up to {FENCE_PANEL_LIMITS.maxHeightMm / 1000} m)
                  </span>
                  <input
                    type="number"
                    min={FENCE_PANEL_LIMITS.minHeightMm}
                    max={FENCE_PANEL_LIMITS.maxHeightMm}
                    value={panel.heightMm}
                    onChange={(event) => updatePanel(index, { heightMm: Number(event.target.value) })}
                    className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted">
                    Length (mm, up to {FENCE_PANEL_LIMITS.maxLengthMm / 1000} m)
                  </span>
                  <input
                    type="number"
                    min={FENCE_PANEL_LIMITS.minLengthMm}
                    max={FENCE_PANEL_LIMITS.maxLengthMm}
                    value={panel.lengthMm}
                    onChange={(event) => updatePanel(index, { lengthMm: Number(event.target.value) })}
                    className="h-12 w-full border border-steel/12 bg-white px-4 font-body text-base text-steel outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
