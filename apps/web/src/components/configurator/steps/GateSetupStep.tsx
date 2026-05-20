'use client'

import { CircleSlashed, RefreshCcw } from 'lucide-react'
import { createGateConfig, createGatePreset, GATE_STYLES, GATE_TYPES, type GateStyle, type GateType } from '@steelyes/gate-engine'

import { FinishPicker } from '@/components/configurator/FinishPicker'
import { gateTypeLabel, styleLabel } from '@/lib/configurator/labels'
import { isPrimarySlice, useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

export function GateSetupStep() {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)
  const patchConfig = useConfiguratorStore((state) => state.patchConfig)
  const resetToPrimarySlice = useConfiguratorStore((state) => state.resetToPrimarySlice)
  const primarySlice = isPrimarySlice(config)

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-[#5B514D]">
        Start with the gate mechanism, style, finish, and motorisation. The first production slice is tuned around{' '}
        <strong className="font-semibold text-[#1B1C1A]">double swing</strong>.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">Gate type</span>
          <select
            className="h-12 w-full rounded-xl border border-[#1B1C1A]/12 bg-white px-4 font-body text-base text-[#1B1C1A] shadow-sm outline-none transition focus:border-[#9E000C]"
            value={config.gateType}
            onChange={(event) => {
              const nextType = event.target.value as GateType
              setConfig(createGateConfig(createGatePreset(nextType)))
            }}
          >
            {GATE_TYPES.map((gateType) => (
              <option key={gateType} value={gateType}>
                {gateTypeLabel(gateType)}
              </option>
            ))}
          </select>
          {primarySlice ? (
            <p className="text-xs leading-5 text-[#5B514D]">
              Primary path is set to double swing for this vertical slice.
            </p>
          ) : (
            <p className="text-xs leading-5 text-[#9E000C]">
              You are outside the primary slice. You can still explore, but this path is not the main reference yet.
            </p>
          )}
        </label>

        <label className="space-y-2">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">Style</span>
          <select
            className="h-12 w-full rounded-xl border border-[#1B1C1A]/12 bg-white px-4 font-body text-base text-[#1B1C1A] shadow-sm outline-none transition focus:border-[#9E000C]"
            value={config.style}
            onChange={(event) => {
              patchConfig({ style: event.target.value as GateStyle })
            }}
          >
            {GATE_STYLES.map((style) => (
              <option key={style} value={style}>
                {styleLabel(style)}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2 sm:col-span-2">
          <FinishPicker
            value={config.finish}
            onChange={(finish) => {
              patchConfig({ finish })
            }}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D]">Motorised</span>
          <button
            type="button"
            className={`flex min-h-[52px] w-full items-center justify-between rounded-xl border px-4 font-heading text-sm font-bold uppercase tracking-tight transition ${
              config.motorised
                ? 'border-[#9E000C] bg-[#9E000C] text-white'
                : 'border-[#1B1C1A]/12 bg-white text-[#1B1C1A]'
            }`}
            onClick={() => patchConfig({ motorised: !config.motorised })}
          >
            <span>{config.motorised ? 'Yes, motorised' : 'Manual only'}</span>
            <CircleSlashed className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-[#1B1C1A]/12 bg-[#F9F7F4] px-4 py-3">
        <p className="text-sm text-[#5B514D]">Reset to the default double swing starting point.</p>
        <button
          type="button"
          onClick={resetToPrimarySlice}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#1B1C1A]/10 bg-white px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6D615D] transition hover:border-[#9E000C]/35 hover:text-[#9E000C]"
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
