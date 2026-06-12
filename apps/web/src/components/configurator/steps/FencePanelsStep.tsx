'use client'

import { EMPTY_FENCE_PANEL_INPUT } from '@steelyes/gate-engine'

import { HEIGHT_PRESETS_MM, WIDTH_PRESETS_MM } from '@/lib/configurator/constants'
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
    <div className="space-y-5">
      <p className="text-sm leading-6 text-muted-deep">
        Add matching fence panels alongside the gate opening. Panel sizes are indicative — final lengths are confirmed
        after site survey.
      </p>

      <div className="rounded-2xl border border-steel/10 bg-paper p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">Include fence panels</p>
            <p className="mt-1 text-xs leading-5 text-muted-deep">Optional run of panels to either side of the gate.</p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`inline-flex min-h-[44px] min-w-[88px] items-center justify-center rounded-full px-4 font-heading text-xs font-bold uppercase tracking-tight transition ${
              enabled ? 'bg-primary text-white' : 'border border-steel/12 bg-white text-steel'
            }`}
          >
            {enabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {enabled ? (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Panel count</span>
            <input
              type="number"
              min={1}
              max={12}
              value={fencePanels.quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
            />
          </label>

          {fencePanels.panels.map((panel, index) => (
            <div key={`fence-panel-${index}`} className="rounded-2xl border border-steel/10 bg-white p-4">
              <p className="font-heading text-xs font-bold uppercase tracking-tight text-steel">Panel {index + 1}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Height (mm)</span>
                  <select
                    className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
                    value={panel.heightMm}
                    onChange={(event) => updatePanel(index, { heightMm: Number(event.target.value) })}
                  >
                    {HEIGHT_PRESETS_MM.map((value) => (
                      <option key={value} value={value}>
                        {value} mm
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Length (mm)</span>
                  <select
                    className="h-12 w-full rounded-xl border border-steel/12 bg-white px-4 font-body text-base text-steel shadow-sm outline-none transition focus:border-primary"
                    value={panel.lengthMm}
                    onChange={(event) => updatePanel(index, { lengthMm: Number(event.target.value) })}
                  >
                    {WIDTH_PRESETS_MM.map((value) => (
                      <option key={value} value={value}>
                        {value} mm
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
