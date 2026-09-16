import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  GATE_TYPES,
  SILHOUETTE_INDEX,
  createGateConfig,
  createGatePreset,
  resolveCircleOverlays,
  resolveCollarOverlays,
  resolveSilhouette,
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from '../src/index'

const TIP = [
  { id: 'base', opts: {} as Partial<Record<GateOptionKey, true>> },
  { id: 'arched', opts: { arched_top: true as const } },
  { id: 'dog_bars', opts: { dog_bars: true as const } },
  { id: 'arched_dog_bars', opts: { arched_top: true as const, dog_bars: true as const } },
]

const DECO = [
  { id: 'plain', opts: {} as Partial<Record<GateOptionKey, true | { variant: string }>> },
  { id: 'circles', opts: { circles: true as const } },
  { id: 'collar_1', opts: { picket_collars: { variant: 'every_1' } } },
  { id: 'circles_collar_1', opts: { circles: true as const, picket_collars: { variant: 'every_1' } } },
]

function withOptions(
  config: GateConfig,
  enabled: Partial<Record<GateOptionKey, { quantity?: number; variant?: string } | true>>,
  motorised: boolean,
  style: GateConfig['style'] = 'traditional_victorian',
): GateConfig {
  return {
    ...config,
    motorised,
    style,
    options: config.options.map((option) => {
      const next = enabled[option.key]
      if (!next) return { ...option, enabled: false, quantity: 0, variant: undefined }
      if (next === true) return { ...option, enabled: true, quantity: 1 }
      return {
        ...option,
        enabled: true,
        quantity: next.quantity ?? 1,
        variant: next.variant,
      }
    }),
  }
}

function publicExists(publicPath: string): boolean {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return fs.existsSync(path.resolve(here, '../../../apps/web/public', publicPath.replace(/^\//, '')))
}

function tipologyMatches(tipId: string, slug: string): boolean {
  if (tipId === 'base') {
    return !slug.includes('arched') && !slug.includes('dog_bars') && !slug.includes('composite')
  }
  if (tipId === 'arched') return slug.includes('arched') && !slug.includes('dog_bars')
  if (tipId === 'dog_bars') return slug.includes('dog_bars') && !slug.startsWith('arched')
  if (tipId === 'arched_dog_bars') return slug.includes('arched') && slug.includes('dog_bars')
  return false
}

describe('2D matrix audit (report)', () => {
  it('enumerates all client victorian + composite combos and writes report', () => {
    type Row = {
      gateType: string
      combo: string
      motor: boolean
      slug: string
      status: string
      bakedOptions: string
      circlesBaked: boolean
      collarBaked: boolean
      circlesOv: number
      collarOv: number
      fileOk: boolean
    }

    const rows: Row[] = []
    const gateSummary: Array<Record<string, unknown>> = []

    for (const gateType of GATE_TYPES) {
      const pack = SILHOUETTE_INDEX.packs[gateType as GateType]
      expect(pack).toBeTruthy()
      const motorSplit = Object.keys(pack.silhouettes).some((k) => k.endsWith('_motorised'))
      let baked = 0
      let overlay = 0
      let missingFile = 0
      let fail = 0
      let compositeOk = 0
      const issues: Array<Record<string, unknown>> = []

      for (const tip of TIP) {
        for (const deco of DECO) {
          for (const motor of motorSplit ? [false, true] : [false]) {
            const base = createGateConfig(createGatePreset(gateType as GateType))
            const opts = { ...tip.opts, ...deco.opts }
            const config = withOptions(base, opts, motor)
            const combo = `${tip.id}${deco.id === 'plain' ? '' : `_${deco.id}`}${motor ? '_motorised' : ''}`
            try {
              const r = resolveSilhouette(config)
              const fileOk = publicExists(r.publicPath)
              const wantCircles = Boolean(opts.circles)
              const wantCollar = Boolean(opts.picket_collars)
              const circlesBaked = r.bakedOptions.includes('circles')
              const collarBaked = r.bakedOptions.includes('picket_collars')
              const circlesOv =
                wantCircles && !circlesBaked ? resolveCircleOverlays(config).bands.length : 0
              const collarOv =
                wantCollar && !collarBaked ? resolveCollarOverlays(config).overlays.length : 0

              let status = 'baked'
              if (!fileOk) {
                status = 'missing_file'
                missingFile += 1
              } else if ((wantCircles && !circlesBaked) || (wantCollar && !collarBaked)) {
                status = 'overlay_fallback'
                overlay += 1
                if ((wantCircles && circlesOv === 0) || (wantCollar && collarOv === 0)) {
                  status = 'overlay_gap'
                  issues.push({ combo, slug: r.slug, status, motor })
                }
              } else {
                baked += 1
              }

              if (fileOk && !tipologyMatches(tip.id, r.slug)) {
                issues.push({ combo, slug: r.slug, status: 'tipology_drift', motor })
              }

              rows.push({
                gateType,
                combo,
                motor,
                slug: r.slug,
                status,
                bakedOptions: r.bakedOptions.join('+'),
                circlesBaked,
                collarBaked,
                circlesOv,
                collarOv,
                fileOk,
              })
            } catch (error) {
              fail += 1
              issues.push({
                combo,
                status: 'resolve_fail',
                motor,
                err: error instanceof Error ? error.message : String(error),
              })
              rows.push({
                gateType,
                combo,
                motor,
                slug: '',
                status: 'resolve_fail',
                bakedOptions: '',
                circlesBaked: false,
                collarBaked: false,
                circlesOv: 0,
                collarOv: 0,
                fileOk: false,
              })
            }
          }
        }
      }

      // collar every_2 (no baked masters — expect overlay)
      {
        const base = createGateConfig(createGatePreset(gateType as GateType))
        const config = withOptions(base, { picket_collars: { variant: 'every_2' } }, false)
        try {
          const r = resolveSilhouette(config)
          const collarBaked = r.bakedOptions.includes('picket_collars')
          const collarOv = resolveCollarOverlays(config).overlays.length
          const status = collarBaked
            ? 'baked_every_2'
            : collarOv > 0
              ? 'overlay_every_2'
              : 'every_2_gap'
          if (status === 'every_2_gap') issues.push({ combo: 'base_collar_every_2', slug: r.slug, status })
          rows.push({
            gateType,
            combo: 'base_collar_every_2',
            motor: false,
            slug: r.slug,
            status,
            bakedOptions: r.bakedOptions.join('+'),
            circlesBaked: false,
            collarBaked,
            circlesOv: 0,
            collarOv,
            fileOk: publicExists(r.publicPath),
          })
        } catch (error) {
          issues.push({
            combo: 'base_collar_every_2',
            status: 'resolve_fail',
            err: error instanceof Error ? error.message : String(error),
          })
        }
      }

      for (const motor of motorSplit ? [false, true] : [false]) {
        const base = createGateConfig(createGatePreset(gateType as GateType))
        const config = withOptions(base, {}, motor, 'composite_boards')
        try {
          const r = resolveSilhouette(config)
          const fileOk = publicExists(r.publicPath)
          const ok = r.slug.includes('composite') && fileOk
          if (ok) compositeOk += 1
          else issues.push({
            combo: `composite${motor ? '_motorised' : ''}`,
            slug: r.slug,
            status: fileOk ? 'composite_slug_drift' : 'missing_file',
          })
          rows.push({
            gateType,
            combo: `composite${motor ? '_motorised' : ''}`,
            motor,
            slug: r.slug,
            status: ok ? 'baked' : 'composite_issue',
            bakedOptions: r.bakedOptions.join('+'),
            circlesBaked: false,
            collarBaked: false,
            circlesOv: 0,
            collarOv: 0,
            fileOk,
          })
        } catch (error) {
          fail += 1
          issues.push({
            combo: 'composite',
            status: 'resolve_fail',
            err: error instanceof Error ? error.message : String(error),
          })
        }
      }

      gateSummary.push({
        gateType,
        motorSplit,
        presentSvgs: Object.keys(pack.silhouettes).length,
        baked,
        overlay,
        missingFile,
        fail,
        compositeOk,
        issueCount: issues.length,
        issues,
      })
    }

    const outPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../docs/frontend/2d-masters/AUDIT_2D_MATRIX_2026-08-13.json',
    )
    const report = {
      generatedAt: new Date().toISOString(),
      totalRows: rows.length,
      gateSummary,
      overlayFallbacks: rows.filter((r) => r.status === 'overlay_fallback'),
      hardFails: rows.filter((r) =>
        ['resolve_fail', 'missing_file', 'overlay_gap', 'composite_issue', 'every_2_gap'].includes(
          r.status,
        ),
      ),
      tipologyDrifts: rows.filter((r) =>
        gateSummary.some(
          (g) =>
            g.gateType === r.gateType &&
            Array.isArray(g.issues) &&
            (g.issues as Array<{ combo: string; status: string }>).some(
              (i) => i.combo === r.combo && i.status === 'tipology_drift',
            ),
        ),
      ),
      every2: rows.filter((r) => r.combo === 'base_collar_every_2'),
      rows,
    }
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2))

    // Soft assert: no resolve failures / missing public files
    expect(
      report.hardFails.filter((r) => r.status === 'resolve_fail' || r.status === 'missing_file'),
    ).toHaveLength(0)

    expect(
      report.overlayFallbacks,
      report.overlayFallbacks.map((row) => `${row.gateType}:${row.combo}`).join(', '),
    ).toEqual([])

    // Tipology must never drift (dog_bars+collar must not resolve to base_collar, etc.)
    const drifts = gateSummary.flatMap((g) =>
      (g.issues as Array<{ status: string; combo: string; slug?: string }>).filter(
        (issue) => issue.status === 'tipology_drift',
      ).map((issue) => `${g.gateType}:${issue.combo}→${issue.slug ?? '?'}`),
    )
    expect(drifts, drifts.join('; ')).toEqual([])
  })
})
