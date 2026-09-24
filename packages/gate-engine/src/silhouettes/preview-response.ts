import { hasOption } from '../internal/shared'
import type { GateConfig, GateOptionKey, GateType } from '../types'
import { getVictorianTipology, type VictorianTipology } from '../rules/tipology'
import { resolveCircleOverlays } from './resolve-circle-overlays'
import { resolveCollarOverlays } from './resolve-collar-overlays'
import {
  resolveSilhouette,
  SilhouetteResolveError,
  SILHOUETTE_INDEX,
  type SilhouetteResolution,
} from './resolve-silhouette'

export type DesignVisualChannel =
  | 'drawn_on_master'
  | 'drawn_as_overlay'
  | 'swatch_only'
  | 'strip_only'
  | 'quote_only'
  | 'priced_not_drawn'
  | 'same_drawing'

export type DesignSelectionChannel = {
  key: string
  selected: boolean
  visual: DesignVisualChannel
  note: string
}

export type DesignPreviewResponse = {
  ok: boolean
  error?: string
  resolution: SilhouetteResolution | null
  tipology: VictorianTipology
  motorSplit: boolean
  overlayFallback: boolean
  channels: DesignSelectionChannel[]
}

const MOTOR_SPLIT_TYPES = new Set<GateType>([
  'double_swing',
  'single_swing',
  'bifolding_double_swing',
  'single_bifolding',
])

export function packHasMotorSplit(gateType: GateType): boolean {
  const pack = SILHOUETTE_INDEX.packs[gateType]
  if (!pack) return false
  return Object.keys(pack.silhouettes).some((slug) => slug.endsWith('_motorised'))
}

function channel(
  key: string,
  selected: boolean,
  visual: DesignVisualChannel,
  note: string,
): DesignSelectionChannel {
  return { key, selected, visual, note }
}

function optionOn(config: GateConfig, key: GateOptionKey): boolean {
  return hasOption(config, key)
}

/**
 * Honest map of customer selections → what the Design drawing actually shows.
 * Domain source of truth for UI copy and mismatch warnings.
 */
export function describeDesignPreview(config: GateConfig): DesignPreviewResponse {
  let resolution: SilhouetteResolution | null = null
  let error: string | undefined

  try {
    resolution = resolveSilhouette(config)
  } catch (err) {
    error =
      err instanceof SilhouetteResolveError
        ? err.message
        : 'Preloaded design master is unavailable for this configuration.'
  }

  const baked = new Set(resolution?.bakedOptions ?? [])
  const circlesOn = optionOn(config, 'circles')
  const collarsOn = optionOn(config, 'picket_collars')
  const circlesOverlay =
    circlesOn && !baked.has('circles') ? resolveCircleOverlays(config).bands.length > 0 : false
  const collarOverlay =
    collarsOn && !baked.has('picket_collars')
      ? resolveCollarOverlays(config).overlays.length > 0
      : false

  const overlayFallback = Boolean(resolution) && (circlesOverlay || collarOverlay)
  const motorSplit = MOTOR_SPLIT_TYPES.has(config.gateType) || packHasMotorSplit(config.gateType)

  const channels: DesignSelectionChannel[] = [
    channel(
      'gateType',
      true,
      'drawn_on_master',
      'Mechanism swaps the official 2D master pack.',
    ),
    channel(
      'style',
      true,
      'drawn_on_master',
      config.style === 'composite_boards'
        ? 'Composite Boards uses the composite master. Circles swap that master. Other Victorian decoration stays off.'
        : 'Traditional Victorian uses the Victorian tipology matrix.',
    ),
    channel(
      'tipology',
      config.style === 'traditional_victorian',
      config.style === 'traditional_victorian' ? 'drawn_on_master' : 'priced_not_drawn',
      config.style === 'traditional_victorian'
        ? `Victorian shape on the drawing: ${getVictorianTipology(config).replace(/_/g, ' ')}.`
        : 'Victorian shapes are not drawn on Composite Boards.',
    ),
    channel(
      'motorised',
      config.motorised,
      motorSplit ? 'drawn_on_master' : 'same_drawing',
      motorSplit
        ? 'Manual and motorised swing/bifold masters are separate drawings.'
        : 'Sliding packs share one 2D drawing for manual and motorised.',
    ),
    channel(
      'finish',
      true,
      'swatch_only',
      'Finish is a colour swatch on Design. Masters stay line-art CAD.',
    ),
    channel(
      'dimensions',
      true,
      'strip_only',
      'Width and height appear in the millimetre strip — the SVG does not morph.',
    ),
    channel(
      'arched_top',
      optionOn(config, 'arched_top'),
      optionOn(config, 'arched_top') && baked.has('arched_top')
        ? 'drawn_on_master'
        : optionOn(config, 'arched_top')
          ? 'priced_not_drawn'
          : 'drawn_on_master',
      'Arched top is a Victorian tipology — it must swap the master, not an overlay.',
    ),
    channel(
      'dog_bars',
      optionOn(config, 'dog_bars'),
      optionOn(config, 'dog_bars') && baked.has('dog_bars')
        ? 'drawn_on_master'
        : optionOn(config, 'dog_bars')
          ? 'priced_not_drawn'
          : 'drawn_on_master',
      'Dog bars are a Victorian tipology — they must swap the master, not an overlay.',
    ),
    channel(
      'circles',
      circlesOn,
      !circlesOn
        ? 'drawn_on_master'
        : baked.has('circles')
          ? 'drawn_on_master'
          : circlesOverlay
            ? 'drawn_as_overlay'
            : 'priced_not_drawn',
      circlesOn && !baked.has('circles')
        ? 'No baked circles master for this combo — generic overlay on the tipology drawing.'
        : 'Circles swap a baked master when the pack includes that cell.',
    ),
    channel(
      'picket_collars',
      collarsOn,
      !collarsOn
        ? 'drawn_on_master'
        : baked.has('picket_collars')
          ? 'drawn_on_master'
          : collarOverlay
            ? 'drawn_as_overlay'
            : 'priced_not_drawn',
      collarsOn && !baked.has('picket_collars')
        ? 'No baked collar master for this combo — generic overlay on the tipology drawing.'
        : 'Collars swap a baked master when the pack includes that cell.',
    ),
    channel(
      'middle_bar',
      optionOn(config, 'middle_bar'),
      'priced_not_drawn',
      'Priced option. Official Victorian masters already include a mid rail; toggling this does not swap Design.',
    ),
    channel(
      'top_railheads',
      optionOn(config, 'top_railheads'),
      'quote_only',
      'Railhead SKU is stored for the quote (CA-17). It is not composited on Design.',
    ),
    channel(
      'dog_bar_railheads',
      optionOn(config, 'dog_bar_railheads'),
      'quote_only',
      'Dog-bar railheads are quote metadata. They are not drawn on Design.',
    ),
    channel(
      'handle',
      !config.motorised,
      'priced_not_drawn',
      'Leaf handle is not UI-composited. Some manual masters bake it; Design never invents one.',
    ),
  ]

  return {
    ok: Boolean(resolution),
    error,
    resolution,
    tipology: getVictorianTipology(config),
    motorSplit,
    overlayFallback,
    channels,
  }
}

export function designPreviewMismatchNotes(config: GateConfig): string[] {
  const described = describeDesignPreview(config)
  return described.channels
    .filter((item) => item.selected)
    .filter((item) =>
      item.visual === 'quote_only' ||
      item.visual === 'priced_not_drawn' ||
      item.visual === 'same_drawing' ||
      item.visual === 'swatch_only' ||
      item.visual === 'strip_only' ||
      item.visual === 'drawn_as_overlay',
    )
    .map((item) => item.note)
}
