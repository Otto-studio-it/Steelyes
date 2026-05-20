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

import { saveGateConfiguration } from '@/app/(marketing)/configurator/actions'
import {
  CONFIGURATOR_SHARE_META_KEY,
  CONFIGURATOR_STEPS,
  CONFIGURATOR_STORAGE_KEY,
  PRIMARY_GATE_TYPE,
  type ConfiguratorStepId,
} from '@/lib/configurator/constants'
import { setOptionQuantity, updateOption } from '@/lib/configurator/option-actions'

type ShareMeta = {
  shareToken: string
  configurationId: string
  savedConfigHash: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

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

function readStoredShareMeta(): ShareMeta | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(CONFIGURATOR_SHARE_META_KEY)
  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored) as ShareMeta
    if (!parsed.shareToken || !parsed.configurationId || !parsed.savedConfigHash) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function persistConfig(config: GateConfig) {
  try {
    window.localStorage.setItem(CONFIGURATOR_STORAGE_KEY, stringifyGateConfig(config))
  } catch {
    // Best-effort persistence only.
  }
}

function persistShareMeta(meta: ShareMeta | null) {
  try {
    if (!meta) {
      window.localStorage.removeItem(CONFIGURATOR_SHARE_META_KEY)
      return
    }
    window.localStorage.setItem(CONFIGURATOR_SHARE_META_KEY, JSON.stringify(meta))
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
  shareToken: string | null
  configurationId: string | null
  savedConfigHash: string | null
  saveState: SaveState
  saveError: string | null
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
  ensureSavedConfiguration: () => Promise<{ shareToken: string; configurationId: string } | null>
}

function invalidateShareIfConfigChanged(config: GateConfig, get: () => ConfiguratorState, set: (partial: Partial<ConfiguratorState>) => void) {
  const hash = stringifyGateConfig(config)
  if (get().savedConfigHash && get().savedConfigHash !== hash) {
    set({
      shareToken: null,
      configurationId: null,
      savedConfigHash: null,
      saveState: 'idle',
      saveError: null,
    })
    persistShareMeta(null)
  }
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  config: createGateConfig(createGatePreset(PRIMARY_GATE_TYPE)),
  stepIndex: 0,
  hydrated: false,
  previewExpanded: true,
  shareToken: null,
  configurationId: null,
  savedConfigHash: null,
  saveState: 'idle',
  saveError: null,

  hydrate: () => {
    const config = readStoredConfig()
    const shareMeta = readStoredShareMeta()
    const hash = stringifyGateConfig(config)
    const shareStillValid = shareMeta?.savedConfigHash === hash

    set({
      config,
      hydrated: true,
      shareToken: shareStillValid ? shareMeta.shareToken : null,
      configurationId: shareStillValid ? shareMeta.configurationId : null,
      savedConfigHash: shareStillValid ? shareMeta.savedConfigHash : null,
      saveState: shareStillValid ? 'saved' : 'idle',
    })
  },

  setConfig: (config) => {
    invalidateShareIfConfigChanged(config, get, set)
    set({ config })
    if (get().hydrated) persistConfig(config)
  },

  patchConfig: (patch) => {
    const next = { ...get().config, ...patch }
    invalidateShareIfConfigChanged(next, get, set)
    set({ config: next })
    if (get().hydrated) persistConfig(next)
  },

  resetToPrimarySlice: () => {
    const config = createGateConfig(createGatePreset(PRIMARY_GATE_TYPE))
    set({
      config,
      stepIndex: 0,
      shareToken: null,
      configurationId: null,
      savedConfigHash: null,
      saveState: 'idle',
      saveError: null,
    })
    if (get().hydrated) {
      persistConfig(config)
      persistShareMeta(null)
    }
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

  ensureSavedConfiguration: async () => {
    const config = get().config
    const hash = stringifyGateConfig(config)

    const existingShareToken = get().shareToken
    const existingConfigurationId = get().configurationId

    if (existingShareToken && existingConfigurationId && get().savedConfigHash === hash) {
      return {
        shareToken: existingShareToken,
        configurationId: existingConfigurationId,
      }
    }

    set({ saveState: 'saving', saveError: null })

    const result = await saveGateConfiguration(stringifyGateConfig(config))

    if (!result.ok) {
      set({ saveState: 'error', saveError: result.error })
      return null
    }

    const meta: ShareMeta = {
      shareToken: result.shareToken,
      configurationId: result.configurationId,
      savedConfigHash: hash,
    }

    set({
      shareToken: result.shareToken,
      configurationId: result.configurationId,
      savedConfigHash: hash,
      saveState: 'saved',
      saveError: null,
    })
    persistShareMeta(meta)

    return {
      shareToken: result.shareToken,
      configurationId: result.configurationId,
    }
  },
}))

export function useConfiguratorConfig(): GateConfig {
  return useConfiguratorStore((state) => state.config)
}

export function useConfiguratorPricing(configOverride?: GateConfig): PricingResult {
  const storeConfig = useConfiguratorConfig()
  const config = configOverride ?? storeConfig
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
