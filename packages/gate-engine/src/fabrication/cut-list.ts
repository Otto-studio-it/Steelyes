import type { GateConfig } from '../types'
import { buildGateGeometryPlan } from '../geometry'
import { DEFAULT_PICKET_OUTER_MM, DEFAULT_TUBE_OUTER_MM } from '../geometry/constants'
import { getLeafCount, isSlidingGate } from '../internal/shared'
import { getBifoldPanelsPerLeaf, isBifoldGate } from '../rules/bifold'
import { getCantileverTailMm } from '../rules/cantilever'

export type CutListLine = {
  id: string
  role: 'rail' | 'picket' | 'frame' | 'post' | 'panel' | 'hardware'
  profile: string
  lengthMm: number
  quantity: number
  note?: string
}

export type GateCutList = {
  gateType: GateConfig['gateType']
  widthMm: number
  heightMm: number
  lines: CutListLine[]
  notes: string[]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Nominal meeting gap between double leaves — same value the 3D mesh uses. */
const MEETING_GAP_MM = 6

export function buildGateCutList(config: GateConfig): GateCutList {
  const notes = ['Schematic cut list from geometry recipe — workshop to verify on survey.']
  const lines: CutListLine[] = []
  const geometry = buildGateGeometryPlan(config)
  const leafCount = getLeafCount(config.gateType)
  const sliding = isSlidingGate(config.gateType)

  if (config.posts.enabled && config.posts.material !== 'none') {
    lines.push({
      id: 'mount-post',
      role: 'post',
      profile: config.posts.material,
      lengthMm: config.heightMm + config.posts.extendAboveGateMm + 60,
      quantity: 2,
      note: `${config.posts.capStyle} cap`,
    })
  }

  if (sliding) {
    lines.push({
      id: 'sliding-panel-frame',
      role: 'panel',
      profile: 'frame section',
      lengthMm: config.widthMm,
      quantity: 1,
    })

    if (config.gateType === 'cantilever_sliding') {
      // CA-05: a cantilever has no ground track across the opening — it carries a counterbalance tail.
      lines.push({
        id: 'counterbalance-tail',
        role: 'frame',
        profile: 'frame section',
        lengthMm: Math.round(getCantileverTailMm(config.widthMm)),
        quantity: 1,
        note: 'beyond the parking post — no ground track in the opening',
      })
    } else {
      lines.push({
        id: 'track-rail',
        role: 'rail',
        profile: 'ground track',
        lengthMm: config.widthMm,
        quantity: 1,
      })
    }

    if (config.style === 'traditional_victorian') {
      notes.push('Sliding Victorian infill (rails, pickets) is not itemised yet — take it from the workshop drawing.')
    }
  } else {
    const frameTube = geometry?.tubeProfile.outer ?? DEFAULT_TUBE_OUTER_MM
    const frameProfile = `${frameTube}mm frame tube`
    const panelsPerLeaf = isBifoldGate(config.gateType) ? getBifoldPanelsPerLeaf(config.gateType) : 1
    const panelCount = leafCount * panelsPerLeaf
    const leafWidth = config.widthMm / leafCount - (leafCount > 1 ? MEETING_GAP_MM / 2 : 0)
    const panelWidth = leafWidth / panelsPerLeaf
    // Horizontals run between the stiles.
    const horizontalLength = Math.round(panelWidth - frameTube * 2)
    const archedTop = config.options.some((option) => option.key === 'arched_top' && option.enabled)

    lines.push({
      id: 'leaf-stiles',
      role: 'frame',
      profile: frameProfile,
      lengthMm: config.heightMm,
      quantity: panelCount * 2,
      note: `vertical stiles — 2 per ${panelsPerLeaf > 1 ? 'bifold panel' : 'leaf'}`,
    })

    lines.push({
      id: 'leaf-top-member',
      role: 'frame',
      profile: frameProfile,
      lengthMm: horizontalLength,
      quantity: panelCount,
      note: archedTop ? 'rolled to the arch — straight length is the chord, allow for the curve' : 'top of leaf',
    })

    const rails = geometry?.rails ?? {
      top: 0,
      upperMid: 0.14,
      spearBand: 0.62,
      lowerMid: 0.71,
      bottom: 0.98,
    }

    const railRatios = [rails.upperMid, rails.spearBand, rails.lowerMid, rails.bottom]
    for (let index = 0; index < railRatios.length; index += 1) {
      lines.push({
        id: `horizontal-rail-${index + 1}`,
        role: 'rail',
        profile: frameProfile,
        lengthMm: horizontalLength,
        quantity: panelCount,
        note: `zone ratio ${railRatios[index]?.toFixed(2)}`,
      })
    }

    if (config.style === 'traditional_victorian') {
      // geometry.pickets: upperCount is per leaf, lowerCount is for the whole gate.
      const upperPerLeaf = geometry?.pickets.upperCount ?? clamp(Math.round(leafWidth / 100), 6, 18)
      const lowerTotal = geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 16, 28)
      const upperHeight = config.heightMm * (rails.spearBand - rails.upperMid)
      const lowerHeight = config.heightMm * (rails.bottom - rails.lowerMid)
      const picketProfile = `${DEFAULT_PICKET_OUTER_MM}mm round`

      lines.push({
        id: 'upper-pickets',
        role: 'picket',
        profile: picketProfile,
        lengthMm: Math.round(upperHeight),
        quantity: upperPerLeaf * leafCount,
      })

      lines.push({
        id: 'lower-pickets',
        role: 'picket',
        profile: picketProfile,
        lengthMm: Math.round(lowerHeight),
        quantity: Math.round(lowerTotal / leafCount) * leafCount * (geometry?.pickets.kickPlateMultiplier ?? 1),
      })
    }
  }

  // CA-01: handle is base hardware on manual gates only — never on motorised.
  if (!config.motorised) {
    lines.push({
      id: 'manual-handle',
      role: 'hardware',
      profile: sliding ? 'pull handle' : 'lever handle',
      lengthMm: 0,
      quantity: 1,
      note: 'Omitted when motorised',
    })
  } else {
    notes.push('Motorised build: no leaf handle (CA-01).')
  }

  if (geometry) {
    notes.push(...geometry.notes)
  }

  return {
    gateType: config.gateType,
    widthMm: config.widthMm,
    heightMm: config.heightMm,
    lines,
    notes,
  }
}

export function serializeCutListCsv(cutList: GateCutList): string {
  const header = 'id,role,profile,length_mm,quantity,note'
  const rows = cutList.lines.map((line) =>
    [
      line.id,
      line.role,
      line.profile,
      line.lengthMm,
      line.quantity,
      line.note ?? '',
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  )
  return [header, ...rows].join('\n')
}
