import type { GateRenderLabel, GateRenderPlan, GateRenderPrimitive } from './render-plan'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function primitiveToSvg(primitive: GateRenderPrimitive): string {
  const opacity = primitive.opacity !== undefined ? ` opacity="${primitive.opacity}"` : ''

  switch (primitive.kind) {
    case 'rect': {
      const rx = primitive.rx !== undefined ? ` rx="${primitive.rx}"` : ''
      const fill = primitive.fill ? ` fill="${primitive.fill}"` : ' fill="none"'
      const fillOpacity = primitive.fillOpacity !== undefined ? ` fill-opacity="${primitive.fillOpacity}"` : ''
      const stroke = primitive.stroke ? ` stroke="${primitive.stroke}"` : ''
      const strokeWidth = primitive.strokeWidth !== undefined ? ` stroke-width="${primitive.strokeWidth}"` : ''
      const dash = primitive.strokeDasharray ? ` stroke-dasharray="${primitive.strokeDasharray}"` : ''
      return `<rect id="${primitive.id}" x="${primitive.x}" y="${primitive.y}" width="${primitive.width}" height="${primitive.height}"${rx}${fill}${fillOpacity}${stroke}${strokeWidth}${dash}${opacity} />`
    }
    case 'line': {
      const stroke = primitive.stroke ? ` stroke="${primitive.stroke}"` : ''
      const strokeWidth = primitive.strokeWidth !== undefined ? ` stroke-width="${primitive.strokeWidth}"` : ''
      const dash = primitive.strokeDasharray ? ` stroke-dasharray="${primitive.strokeDasharray}"` : ''
      const cap = primitive.strokeLinecap ? ` stroke-linecap="${primitive.strokeLinecap}"` : ''
      return `<line id="${primitive.id}" x1="${primitive.x1}" y1="${primitive.y1}" x2="${primitive.x2}" y2="${primitive.y2}"${stroke}${strokeWidth}${dash}${cap}${opacity} />`
    }
    case 'circle': {
      const fill = primitive.fill ? ` fill="${primitive.fill}"` : ' fill="none"'
      const stroke = primitive.stroke ? ` stroke="${primitive.stroke}"` : ''
      const strokeWidth = primitive.strokeWidth !== undefined ? ` stroke-width="${primitive.strokeWidth}"` : ''
      return `<circle id="${primitive.id}" cx="${primitive.cx}" cy="${primitive.cy}" r="${primitive.r}"${fill}${stroke}${strokeWidth}${opacity} />`
    }
    case 'path': {
      const fill = primitive.fill ? ` fill="${primitive.fill}"` : ' fill="none"'
      const stroke = primitive.stroke ? ` stroke="${primitive.stroke}"` : ''
      const strokeWidth = primitive.strokeWidth !== undefined ? ` stroke-width="${primitive.strokeWidth}"` : ''
      return `<path id="${primitive.id}" d="${primitive.d}"${fill}${stroke}${strokeWidth}${opacity} />`
    }
  }
}

function labelToSvg(label: GateRenderLabel): string {
  const anchor = label.anchor ?? 'start'
  const size = label.size ?? 12
  const fill = label.fill ?? '#1B1C1A'
  const weight = label.weight ?? 400
  return `<text id="${label.id}" x="${label.x}" y="${label.y}" text-anchor="${anchor}" font-size="${size}" fill="${fill}" font-weight="${weight}">${escapeXml(label.text)}</text>`
}

export function serializeGateRenderPlanToSvg(plan: GateRenderPlan): string {
  const primitives = [...plan.background, ...plan.primitives].map(primitiveToSvg).join('\n  ')
  const labels = plan.labels.map(labelToSvg).join('\n  ')

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${plan.viewBox}" width="${plan.width}" height="${plan.height}">`,
    `  <title>${escapeXml(plan.title)}</title>`,
    `  <desc>${escapeXml(`${plan.subtitle}. ${plan.notes.join(' ')}`)}</desc>`,
    `  ${primitives}`,
    `  ${labels}`,
    `</svg>`,
  ].join('\n')
}
