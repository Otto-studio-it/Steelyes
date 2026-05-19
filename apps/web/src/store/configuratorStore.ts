'use client'

import {
  calculateIndicativeGatePrice,
  createGateConfig,
  createGatePreset,
  deserializeGateConfig,
  stringifyGateConfig,
  type GateConfig,
  type GateOptionKey,
  type PricingResult,
} from '@steelyes/gate-engine'
import { create } from 'zustand'

import {
  CONFIGURATOR_STEPS,
  CONFIGURATOR_STORAGE_KEY,
  PRIMARY_GATE_TYPE,
  type ConfiguratorStepId,
} from '@/lib/configurator/constants'
import { setOptionQuantity, updateOption } from '@/lib/configurator/option-actions'

function readStoredConfig(): GateConfig {
  if (typeof window === 'undefined') {
    return createGateConfig(createGatePreset(PRIMARY_GATE_TYPE))
  }

  const stored = window.localStorage.getItem(CONFIGURATOR_STORAGE_KEY)
  if (!stored) {
    return createGateConfig(createGatePreset(PRIMARY_GATE_TYPE))
  }

  try {
    return deserializeGateConfig(stored)
  } catch {
    return createGateConfig(createGatePreset(PRIMARY_GATE_TYPE))
  }
}

function persistConfig(config: GateConfig) {
  try {
    window.localStorage.setItem(CONFIGURATOR_STORAGE_KEY, stringifyGateConfig(config))
  } catch {
    // Best-effort persistence only.
  }
}

function stepIndexForId(stepId: ConfiguratorStepId): number {
  return CONFIGURATOR_STEPS.findIndex((step) => step.id === stepId)
}

type ConfiguratorState = {
  config: GateConfig
  stepIndex: number
  hydrated: boolean
  previewExpanded: boolean
  hydrate: () => void
  setConfig: (config: GateConfig) => void
  patchConfig: (patch: Partial<GateConfig>) => void
  resetToPrimarySlice: () => void
  setStepIndex: (index: number) => void
  goToStep: (stepId: ConfiguratorStepId) => void
  nextStep: () => void
  prevStep: () => void
  togglePreviewExpanded: () => void
  toggleOption: (key: GateOptionKey, enabled: boolean) => void
  setOptionQty: (key: GateOptionKey, quantity: number) => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  config: createGateConfig(createGatePreset(PRIMARY_GATE_TYPE)),
  stepIndex: 0,
  hydrated: false,
  previewExpanded: true,

  hydrate: () => {
    const config = readStoredConfig()
    set({ config, hydrated: true })
  },

  setConfig: (config) => {
    set({ config })
    if (get().hydrated) persistConfig(config)
  },

  patchConfig: (patch) => {
    const next = { ...get().config, ...patch }
    set({ config: next })
    if (get().hydrated) persistConfig(next)
  },

  resetToPrimarySlice: () => {
    const config = createGateConfig(createGatePreset(PRIMARY_GATE_TYPE))
    set({ config, stepIndex: 0 })
    if (get().hydrated) persistConfig(config)
  },

  setStepIndex: (stepIndex) => {
    const clamped = Math.max(0, Math.min(stepIndex, CONFIGURATOR_STEPS.length - 1))
    set({ stepIndex: clamped })
  },

  goToStep: (stepId) => {
    get().setStepIndex(stepIndexForId(stepId))
  },

  nextStep: () => {
    get().setStepIndex(get().stepIndex + 1)
  },

  prevStep: () => {
    get().setStepIndex(get().stepIndex - 1)
  },

  togglePreviewExpanded: () => {
    set({ previewExpanded: !get().previewExpanded })
  },

  toggleOption: (key, enabled) => {
    const config = updateOption(get().config, key, enabled, enabled ? 1 : 0)
    get().setConfig(config)
  },

  setOptionQty: (key, quantity) => {
    const config = setOptionQuantity(get().config, key, quantity)
    get().setConfig(config)
  },
}))

export function useConfiguratorConfig(): GateConfig {
  return useConfiguratorStore((state) => state.config)
}

export function useConfiguratorPricing(): PricingResult {
  const config = useConfiguratorConfig()
  return calculateIndicativeGatePrice(config)
}

export function useConfiguratorStep() {
  const stepIndex = useConfiguratorStore((state) => state.stepIndex)
  return {
    stepIndex,
    step: CONFIGURATOR_STEPS[stepIndex],
    isFirst: stepIndex === 0,
    isLast: stepIndex === CONFIGURATOR_STEPS.length - 1,
    totalSteps: CONFIGURATOR_STEPS.length,
  }
}

export function isPrimarySlice(config: GateConfig): boolean {
  return config.gateType === PRIMARY_GATE_TYPE
}
