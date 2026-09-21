import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

/** Committed 2D masters — tests may read these, never write them by default. */
export const REPO_MASTERS_ROOT = path.resolve(here, '../../../../docs/frontend/2d-masters')

let cachedOutputRoot: string | null = null

/**
 * Where exporter tests write generated SVG / JSON.
 *
 * Default: a throwaway temp dir, so `pnpm test` never touches the committed masters
 * (the silhouettes are the client's definitive drawings — see definitive-masters.test.ts).
 * Set WRITE_MASTERS=1 to regenerate into docs/frontend/2d-masters on purpose.
 */
export function mastersOutputRoot(): string {
  if (process.env.WRITE_MASTERS === '1') return REPO_MASTERS_ROOT
  if (!cachedOutputRoot) {
    cachedOutputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'steelyes-2d-masters-'))
  }
  return cachedOutputRoot
}
