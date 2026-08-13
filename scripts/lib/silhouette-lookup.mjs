/**
 * Tipology-preserving silhouette lookup rules.
 *
 * Tipologies: base | arched | dog_bars | arched_dog_bars | composite
 * Decoration: plain | circles | collar_1 | circles_collar_1
 * Motor: optional `_motorised` twin (motor-split packs only)
 *
 * Baked deco rules exclude tipology options they do not include, so a missing
 * baked combo falls through to the tipology master + overlay instead of
 * stealing a wrong tipology (e.g. dog_bars+collar → base_collar_1).
 */

/** @typedef {{ when: Record<string, unknown>, slug: string }} LookupRule */

const TIPOLOGY_OPTIONS = {
  base: [],
  arched: ['arched_top'],
  dog_bars: ['dog_bars'],
  arched_dog_bars: ['arched_top', 'dog_bars'],
}

const ALL_TIP_OPTS = ['arched_top', 'dog_bars']
const TIPOLOGIES = ['arched_dog_bars', 'dog_bars', 'arched', 'base']
const DECOS = ['circles_collar_1', 'circles', 'collar_1']

/**
 * @param {string} tipology
 * @param {string} deco
 */
function optionsFor(tipology, deco) {
  const options = [...TIPOLOGY_OPTIONS[tipology]]
  if (deco === 'circles' || deco === 'circles_collar_1') options.push('circles')
  if (deco === 'collar_1' || deco === 'circles_collar_1') options.push('picket_collars')
  return options
}

/**
 * Strict withoutOptions for a baked deco master (excludes wrong tipology + opposite deco).
 * @param {string} tipology
 * @param {string} deco
 */
function withoutOptionsForBaked(tipology, deco) {
  /** @type {string[]} */
  const without = []
  for (const key of ALL_TIP_OPTS) {
    if (!TIPOLOGY_OPTIONS[tipology].includes(key)) without.push(key)
  }
  if (deco === 'collar_1') without.push('circles')
  if (deco === 'circles') without.push('picket_collars')
  return without
}

/**
 * @param {string[]} slugs
 * @param {{ motorSplit?: boolean }} [opts]
 * @returns {LookupRule[]}
 */
export function buildLookupRules(slugs, opts = {}) {
  const available = new Set(slugs)
  const motorSplit =
    opts.motorSplit ?? [...available].some((s) => s.endsWith('_motorised'))

  /** @type {LookupRule[]} */
  const rules = []

  if (available.has('composite_motorised')) {
    rules.push({
      when: { style: 'composite_boards', motorised: true },
      slug: 'composite_motorised',
    })
  }
  if (available.has('composite')) {
    rules.push({ when: { style: 'composite_boards' }, slug: 'composite' })
  }

  const motorStates = motorSplit ? [true, false] : [false]

  // Pass 1 — baked decorative masters (strict tipology + deco)
  for (const motorised of motorStates) {
    for (const tipology of TIPOLOGIES) {
      for (const deco of DECOS) {
        const candidate = motorised ? `${tipology}_${deco}_motorised` : `${tipology}_${deco}`
        if (!available.has(candidate)) continue

        const options = optionsFor(tipology, deco)
        const without = withoutOptionsForBaked(tipology, deco)
        /** @type {Record<string, unknown>} */
        const when = {
          style: 'traditional_victorian',
          options,
          withoutOptions: without,
        }
        if (motorSplit) when.motorised = motorised
        if (deco === 'collar_1' || deco === 'circles_collar_1') {
          when.optionVariants = { picket_collars: 'every_1' }
        }
        rules.push({ when, slug: candidate })
      }
    }
  }

  // Pass 2 — tipology fallbacks (match with circles/collar ON → overlay path)
  for (const motorised of motorStates) {
    for (const tipology of TIPOLOGIES) {
      const candidate = motorised ? `${tipology}_motorised` : tipology
      if (!available.has(candidate)) continue

      const options = [...TIPOLOGY_OPTIONS[tipology]]
      /** @type {string[]} */
      const without = []
      for (const key of ALL_TIP_OPTS) {
        if (!options.includes(key)) without.push(key)
      }

      /** @type {Record<string, unknown>} */
      const when = { style: 'traditional_victorian' }
      if (options.length) when.options = options
      if (without.length) when.withoutOptions = without
      if (motorSplit) when.motorised = motorised
      rules.push({ when, slug: candidate })
    }
  }

  return rules
}

/**
 * @param {LookupRule} rule
 */
export function ruleSpecificity(rule) {
  const when = rule.when ?? {}
  const options = Array.isArray(when.options) ? when.options.length : 0
  const without = Array.isArray(when.withoutOptions) ? when.withoutOptions.length : 0
  const variants =
    when.optionVariants && typeof when.optionVariants === 'object'
      ? Object.keys(when.optionVariants).length
      : 0
  const motor = typeof when.motorised === 'boolean' ? 1 : 0
  const style = when.style ? 1 : 0
  return options * 100 + variants * 40 + without * 10 + motor * 5 + style
}
