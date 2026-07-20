'use client'

import {
  DEFAULT_PRICING_CATALOG,
  calculateIndicativeGatePrice,
  createGateConfig,
  createGatePreset,
  deserializeGateConfig,
  stringifyGateConfig,
  validateGateConfig,
  type GateConfig,
  type GateOptionKey,
  type PricingCatalog,
  type PricingResult,
  type ValidationIssue,
} from '@steelyes/gate-engine'
import { create } from 'zustand'

import { saveGateConfiguration } from '@/app/(marketing)/configurator/actions'
import {
  CONFIGURATOR_ACTS,
  CONFIGURATOR_SHARE_META_KEY,
  CONFIGURATOR_STORAGE_KEY,
  PRIMARY_GATE_TYPE,
  QUICK_PATH_STEP_COUNT,
  type ConfiguratorActId,
  type ConfiguratorFlowMode,
} from '@/lib/configurator/navigation'
import { setOptionQuantity, updateOption, setOptionVariant } from '@/lib/configurator/option-actions'
import { validateConfiguratorAct, validateConfiguratorActsBeforeIndex } from '@/lib/configurator/step-validation'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'

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

function actIndexForId(actId: ConfiguratorActId): number {
  return CONFIGURATOR_ACTS.findIndex((act) => act.id === actId)
}

type ConfiguratorState = {
  config: GateConfig
  actIndex: number
  flowMode: ConfiguratorFlowMode
  quickStepIndex: number
  hydrated: boolean
  previewExpanded: boolean
  pricingCatalog: PricingCatalog
  shareToken: string | null
  configurationId: string | null
  savedConfigHash: string | null
  saveState: SaveState
  saveError: string | null
  hydrate: () => void
  setPricingCatalog: (catalog: PricingCatalog) => void
  setConfig: (config: GateConfig) => void
  patchConfig: (patch: Partial<GateConfig>) => void
  resetToPrimarySlice: () => void
  setActIndex: (index: number) => void
  goToAct: (actId: ConfiguratorActId) => void
  nextAct: () => void
  prevAct: () => void
  setFlowMode: (mode: ConfiguratorFlowMode) => void
  setQuickStepIndex: (index: number) => void
  nextQuickStep: () => void
  prevQuickStep: () => void
  togglePreviewExpanded: () => void
  toggleOption: (key: GateOptionKey, enabled: boolean) => void
  setOptionQty: (key: GateOptionKey, quantity: number) => void
  setOptionVariant: (key: GateOptionKey, variant: string | undefined) => void
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
  actIndex: 0,
  flowMode: 'quick',
  quickStepIndex: 0,
  hydrated: false,
  previewExpanded: true,
  pricingCatalog: DEFAULT_PRICING_CATALOG,
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

  setPricingCatalog: (pricingCatalog) => {
    set({ pricingCatalog })
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
      actIndex: 0,
      flowMode: 'quick',
      quickStepIndex: 0,
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

  setActIndex: (actIndex) => {
    const clamped = Math.max(0, Math.min(actIndex, CONFIGURATOR_ACTS.length - 1))
    const current = get().actIndex

    if (clamped > current) {
      const blockingIssues = validateConfiguratorActsBeforeIndex(get().config, clamped, CONFIGURATOR_ACTS)
      if (blockingIssues.length > 0) {
        return
      }
    }

    set({ actIndex: clamped })
    if (clamped > current) {
      captureConfiguratorEvent('configurator act completed', {
        act_id: CONFIGURATOR_ACTS[current].id,
        act_index: current,
      })
    }
  },

  goToAct: (actId) => {
    get().setActIndex(actIndexForId(actId))
  },

  nextAct: () => {
    get().setActIndex(get().actIndex + 1)
  },

  prevAct: () => {
    get().setActIndex(get().actIndex - 1)
  },

  setFlowMode: (flowMode) => {
    if (get().flowMode === flowMode) return
    set({ flowMode })
    captureConfiguratorEvent('configurator flow mode', { mode: flowMode })
  },

  setQuickStepIndex: (index) => {
    const clamped = Math.max(0, Math.min(index, QUICK_PATH_STEP_COUNT - 1))
    set({ quickStepIndex: clamped })
  },

  nextQuickStep: () => {
    const current = get().quickStepIndex
    const next = Math.min(current + 1, QUICK_PATH_STEP_COUNT - 1)
    if (next === current) return
    set({ quickStepIndex: next })
    captureConfiguratorEvent('quick step completed', { step: current })
    if (next === QUICK_PATH_STEP_COUNT - 1) {
      captureConfiguratorEvent('quick path completed')
    }
  },

  prevQuickStep: () => {
    get().setQuickStepIndex(get().quickStepIndex - 1)
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

  setOptionVariant: (key, variant) => {
    const config = setOptionVariant(get().config, key, variant)
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

    captureConfiguratorEvent('configuration saved', {
      share_token: result.shareToken,
      gate_type: config.gateType,
      width_mm: config.widthMm,
      height_mm: config.heightMm,
    })

    return {
      shareToken: result.shareToken,
      configurationId: result.configurationId,
    }
  },
}))

export function useConfiguratorConfig(): GateConfig {
  return useConfiguratorStore((state) => state.config)
}

export function useConfiguratorPricing(
  configOverride?: GateConfig,
  catalogOverride?: PricingCatalog,
): PricingResult {
  const storeConfig = useConfiguratorConfig()
  const storeCatalog = useConfiguratorStore((state) => state.pricingCatalog)
  const config = configOverride ?? storeConfig
  return calculateIndicativeGatePrice(config, catalogOverride ?? storeCatalog)
}

export function useConfiguratorValidationIssues(): ValidationIssue[] {
  const config = useConfiguratorConfig()
  const result = validateGateConfig(config)
  return result.ok ? [] : result.issues
}

export function useConfiguratorActValidationIssues(): ValidationIssue[] {
  const config = useConfiguratorConfig()
  const act = useConfiguratorStore((state) => CONFIGURATOR_ACTS[state.actIndex])
  return validateConfiguratorAct(act.id, config)
}

export function useConfiguratorAct() {
  const actIndex = useConfiguratorStore((state) => state.actIndex)
  return {
    actIndex,
    act: CONFIGURATOR_ACTS[actIndex],
    isFirst: actIndex === 0,
    isLast: actIndex === CONFIGURATOR_ACTS.length - 1,
    totalActs: CONFIGURATOR_ACTS.length,
  }
}

export function useConfiguratorFlowMode(): ConfiguratorFlowMode {
  return useConfiguratorStore((state) => state.flowMode)
}

export function useConfiguratorQuickStep(): number {
  return useConfiguratorStore((state) => state.quickStepIndex)
}

export function isPrimarySlice(config: GateConfig): boolean {
  return config.gateType === PRIMARY_GATE_TYPE
}

export function isPrimaryStyle(config: GateConfig): boolean {
  return config.gateType === PRIMARY_GATE_TYPE && config.style === 'traditional_victorian'
}
