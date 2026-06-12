import { expect, type Page } from '@playwright/test'

export async function waitForConfiguratorReady(page: Page) {
  // Pre-accept the cookie notice so its fixed banner never covers the mobile price bar.
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('sy_cookie_consent', 'accepted')
    } catch {}
  })
  await page.goto('/configurator')
  await expect(page.getByRole('heading', { name: 'Gate setup' })).toBeVisible()
}

export async function getSwingFrameStroke(page: Page): Promise<string | null> {
  const previewSvg = page.locator('svg[aria-label*="preview" i]').first()
  await expect(previewSvg).toBeVisible()
  const frame = previewSvg.locator('rect#swing-frame')
  await expect(frame).toBeVisible()
  return frame.getAttribute('stroke')
}

export async function goToConfiguratorStep(page: Page, stepLabel: string) {
  await page.getByRole('button', { name: new RegExp(stepLabel, 'i') }).click()
  await expect(page.getByRole('heading', { name: new RegExp(stepLabel, 'i') })).toBeVisible()
}

export async function continueWizard(page: Page) {
  const desktopContinue = page
    .locator('.rounded-\\[24px\\]')
    .getByRole('button', { name: /^Continue$/i })
    .first()

  if (await desktopContinue.isVisible()) {
    await desktopContinue.click()
    return
  }

  await page.getByRole('button', { name: /^Continue$/i }).last().click()
}

export async function walkToSummary(page: Page) {
  await waitForConfiguratorReady(page)

  // gate → dimensions → posts → options → fence → summary
  for (let index = 0; index < 5; index += 1) {
    await continueWizard(page)
  }

  await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
}

export async function walkToOptions(page: Page) {
  await waitForConfiguratorReady(page)

  // gate → dimensions → posts → options
  for (let index = 0; index < 3; index += 1) {
    await continueWizard(page)
  }

  await expect(page.getByRole('heading', { name: 'Options' })).toBeVisible()
}

export const DEFAULT_SERIALIZED_OPTIONS = [
  { key: 'middle_bar', enabled: false, quantity: 0 },
  { key: 'top_railheads', enabled: false, quantity: 0 },
  { key: 'dog_bars', enabled: false, quantity: 0 },
  { key: 'dog_bar_railheads', enabled: false, quantity: 0 },
  { key: 'arched_top', enabled: false, quantity: 0 },
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
