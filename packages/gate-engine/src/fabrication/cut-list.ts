import type { GateConfig } from '../types'
import { buildGateGeometryPlan } from '../geometry'
import { getLeafCount, isSlidingGate } from '../internal/shared'

export type CutListLine = {
  id: string
  role: 'rail' | 'picket' | 'frame' | 'post' | 'panel'
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

export function buildGateCutList(config: GateConfig): GateCutList {
  const notes = ['Schematic cut list from geometry recipe — workshop to verify on survey.']
  const lines: CutListLine[] = []
  const geometry = buildGateGeometryPlan(config)
  const leafCount = getLeafCount(config.gateType)
  const leafWidth = config.widthMm / leafCount

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

  if (isSlidingGate(config.gateType)) {
    lines.push({
      id: 'sliding-panel-frame',
      role: 'panel',
      profile: 'frame section',
      lengthMm: config.widthMm,
      quantity: 1,
    })
    lines.push({
      id: 'track-rail',
      role: 'rail',
      profile: 'ground track',
      lengthMm: config.widthMm,
      quantity: 1,
    })
  } else {
    for (let leafIndex = 0; leafIndex < leafCount; leafIndex += 1) {
      lines.push({
        id: `leaf-${leafIndex + 1}-frame`,
        role: 'frame',
        profile: 'rect hollow',
        lengthMm: leafWidth - 24,
        quantity: 2,
        note: 'vertical stile pair',
      })
    }

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
        profile: geometry ? `${geometry.tubeProfile.outer}mm round` : '40×40 RHS',
        lengthMm: config.widthMm - 48,
        quantity: leafCount,
        note: `zone ratio ${railRatios[index]?.toFixed(2)}`,
      })
    }

    if (config.style === 'traditional_victorian') {
      const upperCount = geometry?.pickets.upperCount ?? clamp(Math.round(config.widthMm / 210), 8, 16)
      const lowerCount = geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 16, 28)
      const upperHeight = config.heightMm * (rails.spearBand - rails.upperMid)
      const lowerHeight = config.heightMm * (rails.bottom - rails.lowerMid)

      lines.push({
        id: 'upper-pickets',
        role: 'picket',
        profile: geometry ? `${geometry.tubeProfile.outer}mm round` : '16mm round',
        lengthMm: Math.round(upperHeight),
        quantity: Math.round(upperCount / leafCount) * leafCount,
      })

      lines.push({
        id: 'lower-pickets',
        role: 'picket',
        profile: geometry ? `${geometry.tubeProfile.outer}mm round` : '16mm round',
        lengthMm: Math.round(lowerHeight),
        quantity: Math.round(lowerCount / leafCount) * leafCount * (geometry?.pickets.kickPlateMultiplier ?? 1),
      })
    }
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
