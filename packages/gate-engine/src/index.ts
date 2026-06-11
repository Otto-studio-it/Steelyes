export {
  DEFAULT_CONFIG_VERSION,
  DEFAULT_FINISH,
  DEFAULT_GATE_OPTIONS,
  DEFAULT_GATE_PRESETS,
  EMPTY_FENCE_PANEL_INPUT,
  DEFAULT_SITE_SURVEY_REQUESTED,
  FINISH_CODES,
  GATE_MECHANISMS,
  GATE_OPTION_KEYS,
  GATE_STYLES,
  GATE_TYPES,
  createGateConfig,
  createGatePreset,
} from './types'
export {
  normalizeGateConfig,
  validateGateConfig,
  validateGateConfigDraftInput,
  validateGateConfigSerializedInput,
} from './validation'
export {
  GATE_DIMENSION_LIMITS,
  GLOBAL_DIMENSION_LIMITS,
  getDimensionLimits,
} from './dimension-limits'
export type { DimensionLimits } from './dimension-limits'
export {
  collectCompatibilityIssues,
} from './rules/compatibility'
export {
  collectGeometryIssues,
  getDecorativeBarCapacity,
  getExpectedDogBarCount,
  getExpectedDogBarRailheadCount,
  getExpectedTopRailheadCount,
} from './rules/geometry'
export {
  CANTILEVER_RULE_WIDTH_MM,
  CANTILEVER_TAIL_RATIO_AT_4M,
  CANTILEVER_TAIL_RATIO_DEFAULT,
  cantileverTailNote,
  getCantileverTailRatio,
} from './rules/cantilever'
export {
  DEFAULT_PRICING_CATALOG,
  calculateGateBasePrice,
  calculateGateOptionPricing,
  calculateIndicativeGatePrice,
  calculateIndicativeGatePriceFromDraft,
} from './pricing'
export {
  resolveStyleAwareBasePrice,
  stylePricingAssumption,
  stylePricingSummary,
} from './pricing/style-pricing'
export {
  buildGateRenderPlan,
} from './rendering'
export {
  buildGateMeshPlan,
  mmToSceneUnits,
  MM_TO_SCENE_UNITS,
} from './mesh'
export {
  FINISH_CATALOG,
  getFinishDefinition,
  getFinishStrokeColor,
  listFinishDefinitions,
} from './finishes'
export {
  DEFAULT_RAILHEAD_VARIANT_CATALOG,
  RAILHEAD_OPTION_KEYS,
  collectVariantCatalogIssues,
  findRailheadVariant,
  getRailheadVariantCatalog,
  isRailheadOptionKey,
  isVariantCatalogBlocked,
  listRailheadVariantsForOption,
  railheadCatalogSummary,
  resolveRailheadVariantPricing,
} from './catalog'
export {
  deserializeGateConfig,
  parseGateConfigJson,
  serializeGateConfig,
  stringifyGateConfig,
} from './serialization'

export type {
  FencePanelInput,
  FencePanelSpec,
  FinishCode,
  GateConfig,
  GateDimensions,
  GateMechanism,
  GateOptionKey,
  GateOptionSelection,
  GatePreset,
  GateStyle,
  GateType,
} from './types'
export type { ValidationIssue, ValidationResult } from './validation'
export type {
  BasePricingResult,
  GateBasePriceEntry,
  OptionPricingEntry,
  OptionPricingResult,
  PricingCatalog,
  PricingCurrency,
  PricingIssue,
  PricingLineItem,
  PricingResult,
  PricingSource,
  PricingStatus,
} from './pricing'
export type {
  StyleBasePriceResolution,
  StyleBasePriceSource,
} from './pricing/style-pricing'
export type {
  GateRenderLabel,
  GateRenderPlan,
  GateRenderPrimitive,
} from './rendering'
export type {
  GateMeshBox,
  GateMeshBoxRole,
  GateMeshPlan,
} from './mesh/types'
export type {
  FinishDefinition,
  FinishMaterialTokens,
  FinishSchematicTokens,
} from './finishes'
export type {
  RailheadOptionKey,
  RailheadVariantCatalog,
  RailheadVariantDefinition,
  ResolvedVariantPricing,
  VariantAppliesTo,
  VariantCatalogStatus,
  VariantEntryStatus,
} from './catalog'
export type {
  SerializedFencePanelInput,
  SerializedGateConfig,
  SerializedGateConfigV1,
  SerializedGateOptionSelection,
} from './serialization'
