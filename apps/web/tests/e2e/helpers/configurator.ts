import { expect, type Page } from '@playwright/test'

export async function waitForConfiguratorReady(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('sy_cookie_consent', 'accepted')
    } catch {}
  })
  await page.goto('/configurator')
  await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
}

export async function getSwingFrameStroke(page: Page): Promise<string | null> {
  const previewSvg = page.locator('svg[aria-label*="preview" i]').first()
  await expect(previewSvg).toBeVisible()
  const frame = previewSvg.locator('rect#swing-frame')
  await expect(frame).toBeVisible()
  return frame.getAttribute('stroke')
}

export async function goToConfiguratorAct(page: Page, actLabel: string) {
  await page.getByRole('tab', { name: new RegExp(actLabel, 'i') }).click()
  await expect(page.getByRole('heading', { name: new RegExp(actLabel, 'i') })).toBeVisible()
}

/** @deprecated Use goToConfiguratorAct */
export const goToConfiguratorStep = goToConfiguratorAct

export async function continueWizard(page: Page) {
  const continueButton = page.getByTestId('configurator-action-bar').getByRole('button', { name: /^Continue$/i })
  if (await continueButton.isVisible()) {
    await continueButton.click()
    return
  }

  await page.getByRole('button', { name: /^Continue$/i }).last().click()
}

export async function walkToSummary(page: Page) {
  await waitForConfiguratorReady(page)

  // choose → define → refine → summary
  for (let index = 0; index < 3; index += 1) {
    await continueWizard(page)
  }

  await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
}

export async function walkToRefine(page: Page) {
  await waitForConfiguratorReady(page)

  // choose → define → refine
  for (let index = 0; index < 2; index += 1) {
    await continueWizard(page)
  }

  await expect(page.getByRole('heading', { name: 'Refine' })).toBeVisible()
}

/** @deprecated Use walkToRefine */
export const walkToOptions = walkToRefine

export const DEFAULT_SERIALIZED_OPTIONS = [
  { key: 'middle_bar', enabled: false, quantity: 0 },
  { key: 'top_railheads', enabled: false, quantity: 0 },
  { key: 'dog_bars', enabled: false, quantity: 0 },
  { key: 'dog_bar_railheads', enabled: false, quantity: 0 },
  { key: 'arched_top', enabled: false, quantity: 0 },
  { key: 'circles', enabled: false, quantity: 0 },
  { key: 'picket_collars', enabled: false, quantity: 0 },
  { key: 'bushes', enabled: false, quantity: 0 },
  { key: 'spirals', enabled: false, quantity: 0 },
] as const

export function buildTestConfigurationPayload() {
  return {
    version: 1 as const,
    gateType: 'double_swing' as const,
    style: 'traditional_victorian' as const,
    widthMm: 1800,
    heightMm: 1000,
    motorised: false,
    finish: 'matte_black' as const,
    siteSurveyRequested: false,
    options: DEFAULT_SERIALIZED_OPTIONS.map((option) => ({ ...option })),
    posts: {
      enabled: true,
      material: 'steel' as const,
      capStyle: 'ball' as const,
      extendAboveGateMm: 80,
    },
    fencePanels: {
      quantity: 0,
      panels: [],
    },
  }
}
