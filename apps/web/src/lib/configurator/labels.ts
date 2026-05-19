import type { FinishCode, GateStyle, GateType } from '@steelyes/gate-engine'

import { FINISH_OPTIONS } from './constants'

export function gateTypeLabel(gateType: GateType): string {
  return gateType.split('_').join(' ')
}

export function styleLabel(style: GateStyle): string {
  return style.split('_').join(' ')
}

export function finishLabel(finish: FinishCode): string {
  return FINISH_OPTIONS.find((item) => item.value === finish)?.label ?? finish
}

export function formatLabelText(key: string): string {
  return key.split('_').join(' ')
}
