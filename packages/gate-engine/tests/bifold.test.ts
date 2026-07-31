import { describe, expect, it } from 'vitest'

import {
  PROVISIONAL_BIFOLD_PANELS_PER_LEAF,
  bifoldSchematicNote,
  buildGateMeshPlan,
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  getBifoldPanelCount,
  getBifoldPanelsPerLeaf,
  isBifoldGate,
} from '../src/index'

describe('bifold schematic rule (catalog provisional)', () => {
  it('treats catalog default as 2 panels per leaf', () => {
    expect(getBifoldPanelsPerLeaf('bifolding_double_swing')).toBe(PROVISIONAL_BIFOLD_PANELS_PER_LEAF)
    expect(getBifoldPanelCount('bifolding_double_swing')).toBe(4)
    expect(getBifoldPanelCount('single_bifolding')).toBe(2)
    expect(isBifoldGate('double_swing')).toBe(false)
  })

  it('draws fold stiles on the 2D plan for both bifold types', () => {
    for (const gateType of ['bifolding_double_swing', 'single_bifolding'] as const) {
      const plan = buildGateRenderPlan(createGateConfig(createGatePreset(gateType)), {
        viewMode: 'technical',
      })
      expect(plan.primitives.some((p) => p.id === 'bifold-fold-1')).toBe(true)
      expect(plan.notes).toContain(bifoldSchematicNote(gateType))
      expect(plan.labels.some((l) => l.id === 'label-bifold-fold')).toBe(true)
    }

    const doublePlan = buildGateRenderPlan(createGateConfig(createGatePreset('bifolding_double_swing')), {
      viewMode: 'installation',
    })
    expect(doublePlan.primitives.some((p) => p.id === 'bifold-fold-2')).toBe(true)

    const swingPlan = buildGateRenderPlan(createGateConfig(createGatePreset('double_swing')))
    expect(swingPlan.primitives.some((p) => p.id.startsWith('bifold-fold'))).toBe(false)
  })

  it('keeps 3D leaf-fold boxes for bifold types', () => {
    const mesh = buildGateMeshPlan(createGateConfig(createGatePreset('bifolding_double_swing')))
    expect(mesh.boxes.some((b) => b.id === 'leaf-fold-1')).toBe(true)
    expect(mesh.boxes.some((b) => b.id === 'leaf-fold-2')).toBe(true)
    expect(mesh.notes).toContain(bifoldSchematicNote('bifolding_double_swing'))
  })
})
