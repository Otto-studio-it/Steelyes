export {
  DEFAULT_CONFIG_VERSION,
  DEFAULT_FINISH,
  DEFAULT_GATE_OPTIONS,
  DEFAULT_GATE_PRESETS,
  DEFAULT_GATE_POSTS,
  EMPTY_FENCE_PANEL_INPUT,
  DEFAULT_FULFILMENT_MODE,
  DEFAULT_SITE_SURVEY_REQUESTED,
  FULFILMENT_MODES,
  POST_CAP_LABELS,
  POST_CAP_STYLES,
  POST_MATERIAL_LABELS,
  POST_MATERIALS,
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
  VICTORIAN_TIPOLOGIES,
  applyVictorianTipology,
  getVictorianTipology,
} from './rules/tipology'
export type { VictorianTipology } from './rules/tipology'
export {
  PROVISIONAL_COUNT_RULES,
  collectGeometryIssues,
  getDecorativeBarCapacity,
  getExpectedDogBarCount,
  getExpectedDogBarRailheadCount,
  getExpectedTopRailheadCount,
  isProvisionalCountGuidance,
} from './rules/geometry'
export {
  CANTILEVER_TAIL_RATIO,
  CANTILEVER_TAIL_RATIO_AT_4M,
  cantileverTailNote,
  getCantileverSiteSpace,
  getCantileverTailMm,
  getCantileverTailRatio,
  getCantileverTotalRunMm,
} from './rules/cantilever'
export type { CantileverSiteSpace } from './rules/cantilever'
export {
  PROVISIONAL_BIFOLD_PANELS_PER_LEAF,
  PROVISIONAL_BIFOLD_PANEL_SPLIT_RATIO,
  PROVISIONAL_SINGLE_BIFOLD_COLLECTION_SIDE,
  BIFOLD_PANELS_PER_LEAF,
  BIFOLD_PANEL_SPLIT_RATIO,
  BIFOLD_PREVIEW_DEFAULT_HANDING,
  bifoldSchematicNote,
  getBifoldCollectionSide,
  getBifoldPanelCount,
  getBifoldPanelsPerLeaf,
  isBifoldGate,
} from './rules/bifold'
export type { BifoldCollectionSide } from './rules/bifold'
export {
  HEIGHT_MEANING,
  WIDTH_MEANING,
  clearOpeningLeafWidthMm,
  dimensionMeaningNote,
} from './rules/dimensions'
export type { HeightMeaning, WidthMeaning } from './rules/dimensions'
export {
  SIZE_UPLIFT_HEIGHT_GBP,
  SIZE_UPLIFT_HEIGHT_STEP_MM,
  SIZE_UPLIFT_WIDTH_GBP,
  SIZE_UPLIFT_WIDTH_STEP_MM,
  SHIP_GROUND_CLEARANCE_MM,
  SHIP_PICKET_SPACING_MM,
  SHIP_RAILHEAD_UNIT_GBP,
  TRACKED_RUNBACK_EXTRA_MM,
  ALUMINIUM_SETUP_GBP,
  aluminiumPanelCount,
  aluminiumUpgradeGbp,
  faceAreaM2,
} from './rules/ship-defaults'
export {
  TELESCOPIC_CLOSED_STACK_MM,
  TELESCOPIC_DEFAULT_PANEL_COUNT,
  TELESCOPIC_FRONT_PANEL,
  TELESCOPIC_LEAF_TAIL_MM,
  TELESCOPIC_OVERLAP_MM_MAX,
  TELESCOPIC_OVERLAP_MM_MIN,
  TELESCOPIC_OVERLAP_MM_SCHEMATIC,
  getTelescopicOverlapMm,
  getTelescopicPanelCount,
  telescopicSchematicNote,
} from './rules/telescopic'
export type { TelescopicFrontPanel } from './rules/telescopic'
export {
  RADIUS_TRAVEL_PATH,
  getRadiusLeafCount,
  getRadiusTopProfile,
  radiusSchematicNote,
} from './rules/radius'
export type { RadiusTopProfile, RadiusTravelPath } from './rules/radius'
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
  buildGateGeometryPlan,
  buildSwingRailLayout,
  buildSwingVictorianGeometryPlan,
  DEFAULT_PICKET_SPACING_MM,
  DEFAULT_TUBE_OUTER_MM,
  SWING_RAIL_COUNT,
  VICTORIAN_DOUBLE_SWING_ZONE_RATIOS,
} from './geometry'
export type {
  GateGeometryPlan,
  SwingVictorianGeometryPlan,
  SwingRailLayout,
  VerticalZoneRatios,
} from './geometry'
export {
  buildGateRenderPlan,
  serializeGateRenderPlanToSvg,
  CAD_COLORS,
  CAD_DIMENSION,
  CAD_STROKES,
  CAD_BRICK_HATCH,
  CAD_GROUND,
  CAD_POST_LAYOUT,
  CAD_STYLE_SOURCE,
  CAD_PROVISIONAL_GROUND_CLEARANCE_MM,
  CAD_CLEARANCE_MIN_PX,
  CAD_PROVISIONAL_CENTER_GAP_MM,
  CAD_PROVISIONAL_SIDE_GAP_MM,
  getCadTechnicalPalette,
  getCadClearancePx,
  buildCadTechnicalBackground,
  buildCadMountingPosts,
  buildCadDimensionLayer,
  restylePrimitivesForCadTechnical,
  isCadTechnicalView,
} from './rendering'
export type { GateRenderViewMode } from './rendering/render-plan'
export type { CadTechnicalPalette } from './rendering/cad-style'
export type { CadDimensionLayer, CadDimensionLayerInput } from './rendering/cad-dimensions'
export { normalizeGatePosts } from './posts'
export {
  buildGateMeshPlan,
  buildMeshOpening,
  checkMeshOpeningEnvelope,
  measureMeshOpening,
  mmToSceneUnits,
  MESH_ENVELOPE_TOLERANCE_MM,
  MM_TO_SCENE_UNITS,
} from './mesh'
export type {
  GateMeshBox,
  GateMeshBoxRole,
  GateMeshCylinder,
  GateMeshFidelity,
  GateMeshOpening,
  GateMeshOpeningCheck,
  GateMeshOpeningMeasurement,
  GateMeshPlan,
} from './mesh'
export {
  FINISH_CATALOG,
  buildCustomFinishTokens,
  getFinishDefinition,
  getFinishStrokeColor,
  isValidFinishHex,
  listFinishDefinitions,
  normalizeFinishHex,
  resolveFinishDefinition,
} from './finishes'
export {
  DEFAULT_MOTOR_CATALOG,
  findMotorDefinition,
  listMotorsForGateType,
} from './catalog/motors'
export type { GateMotorDefinition, MotorMount } from './catalog/motors'
export {
  buildGateCutList,
  serializeCutListCsv,
} from './fabrication/cut-list'
export type { CutListLine, GateCutList } from './fabrication/cut-list'
export {
  STEELYES_TENANT_ID,
  createDefaultTenantFeatures,
} from './platform/tenant-bundle'
export type { TenantBranding, TenantBundle, TenantFeatureFlags, TenantLeadRouting } from './platform/tenant-bundle'
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
  railheadCatalogSlug,
  railheadPhotoFileSlug,
  railheadProductCard,
  railheadProductDescription,
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
  FulfilmentMode,
  GateConfig,
  GateDimensions,
  GateMechanism,
  GateOptionKey,
  GateOptionSelection,
  GatePostsConfig,
  GatePreset,
  GateStyle,
  GateType,
  PostCapStyle,
  PostMaterial,
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
  FinishDefinition,
  FinishMaterialTokens,
  FinishSchematicTokens,
} from './finishes'
export type {
  RailheadOptionKey,
  RailheadProductCard,
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
export {
  SILHOUETTE_INDEX,
  SilhouetteResolveError,
  listSilhouettePublicPaths,
  resolveSilhouette,
} from './silhouettes/resolve-silhouette'
export type {
  SilhouetteIndex,
  SilhouetteIndexEntry,
  SilhouetteLookupRule,
  SilhouettePackIndex,
  SilhouetteResolution,
  SilhouetteResolveInput,
} from './silhouettes/resolve-silhouette'
export {
  RAILHEAD_OVERLAY_LAYOUT,
  resolveRailheadOverlays,
} from './silhouettes/resolve-railhead-overlays'
export type {
  RailheadOverlayInstance,
  RailheadOverlayPlan,
  RailheadOverlayRow,
} from './silhouettes/resolve-railhead-overlays'
export {
  CIRCLE_OVERLAY_PATHS,
  resolveCircleOverlays,
} from './silhouettes/resolve-circle-overlays'
export type {
  CircleBandOverlay,
  CircleOverlayPlan,
} from './silhouettes/resolve-circle-overlays'
export {
  COLLAR_OVERLAY_PATHS,
  COLLAR_SPACING_VARIANTS,
  resolveCollarOverlays,
} from './silhouettes/resolve-collar-overlays'
export type {
  CollarOverlay,
  CollarOverlayPlan,
  CollarSpacingVariant,
} from './silhouettes/resolve-collar-overlays'
export {
  HANDLE_OVERLAY_LAYOUT,
  resolveHandleOverlay,
} from './silhouettes/resolve-handle-overlay'
export type {
  HandleOverlayInstance,
  HandleOverlayPlan,
} from './silhouettes/resolve-handle-overlay'
export { resolveMotorOverlay } from './silhouettes/resolve-motor-overlay'
export type {
  MotorOverlayInstance,
  MotorOverlayPlan,
} from './silhouettes/resolve-motor-overlay'
export {
  describeDesignPreview,
  designPreviewMismatchNotes,
  packHasMotorSplit,
} from './silhouettes/preview-response'
export type {
  DesignPreviewResponse,
  DesignSelectionChannel,
  DesignVisualChannel,
} from './silhouettes/preview-response'
