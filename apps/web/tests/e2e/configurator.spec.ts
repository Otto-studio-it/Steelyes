import { expect, test } from '@playwright/test'

import {
  continueWizard,
  getSwingFrameStroke,
  goToConfiguratorStep,
  waitForConfiguratorReady,
  walkToOptions,
  walkToSummary,
} from './helpers/configurator'
import { deleteSharedConfiguration, seedSharedConfiguration } from './helpers/supabase-config'

test.describe('configurator release flow', () => {
  test('loads the wizard on gate setup', async ({ page }) => {
    await waitForConfiguratorReady(page)

    await expect(page.getByRole('heading', { name: /Design your gate installation/i })).toBeVisible()
    await expect(page.getByRole('radiogroup', { name: 'Gate finish' })).toBeVisible()
    await expect(page.getByText(/Indicative pricing/i).first()).toBeVisible()
  })

  test('updates preview stroke color when finish changes', async ({ page }) => {
    await waitForConfiguratorReady(page)

    const matteStroke = await getSwingFrameStroke(page)
    expect(matteStroke).toBe('#1A1A1A')

    await page.getByRole('radio', { name: /Bronze/i }).click()
    await expect(page.getByRole('radio', { name: /Bronze/i })).toHaveAttribute('aria-checked', 'true')

    await expect
      .poll(async () => getSwingFrameStroke(page), {
        message: 'Preview stroke should reflect the selected bronze finish',
      })
      .toBe('#8B6914')
    expect(matteStroke).not.toBe(await getSwingFrameStroke(page))
  })

  test('walks through all steps to summary', async ({ page }) => {
    await walkToSummary(page)

    await expect(page.getByText(/Share configuration/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Copy share link/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
  })

  test('shows survey-required pricing when top railheads are enabled', async ({ page }) => {
    await walkToOptions(page)

    const railheadsCard = page.locator('div').filter({ hasText: /^Top railheads/i }).first()
    await railheadsCard.getByRole('button', { name: /^Off$/i }).click()
    await expect(railheadsCard.getByRole('button', { name: /^On$/i })).toBeVisible()

    await expect(page.getByText(/Price on request|Survey required/i).first()).toBeVisible()
  })

  test('persists site survey request through reload and summary', async ({ page }) => {
    await walkToOptions(page)

    const siteSurveyCheckbox = page.getByRole('checkbox', { name: /site survey requested/i })
    await siteSurveyCheckbox.check()
    await expect(siteSurveyCheckbox).toBeChecked()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Gate setup' })).toBeVisible()
    await walkToOptions(page)
    await expect(page.getByRole('checkbox', { name: /site survey requested/i })).toBeChecked()

    await continueWizard(page)
    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
    await expect(page.getByText(/Site survey requested/i).filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByText(/^Requested$/i).filter({ visible: true }).first()).toBeVisible()
  })

  test('restores draft configuration after reload', async ({ page }) => {
    await waitForConfiguratorReady(page)
    await page.getByRole('radio', { name: /Pearl white/i }).click()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Gate setup' })).toBeVisible()
    await expect(page.getByRole('radio', { name: /Pearl white/i })).toHaveAttribute('aria-checked', 'true')
  })

  test('step rail allows jumping back to earlier steps', async ({ page }) => {
    await walkToSummary(page)
    await goToConfiguratorStep(page, 'Dimensions')
    await expect(page.getByRole('slider', { name: 'Width' })).toBeVisible()
  })
})

test.describe('configurator mobile portrait', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows mobile price bar on portrait', async ({ page }) => {
    await waitForConfiguratorReady(page)

    await expect(page.getByTestId('configurator-preview-pinned')).toBeVisible()
    await expect(page.locator('.fixed').getByText(/Live estimate|Survey required|Price on request/i)).toBeVisible()
    await expect(page.locator('.fixed').getByRole('button', { name: /^Continue$/i })).toBeVisible()
  })

  test('keeps the pinned gate preview visible while moving through steps', async ({ page }) => {
    await waitForConfiguratorReady(page)

    const preview = page.locator('[data-testid="configurator-preview-pinned"] svg[aria-label*="preview" i]').first()
    await expect(preview).toBeVisible()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Dimensions' })).toBeVisible()
    await expect(preview).toBeVisible()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Mounting posts' })).toBeVisible()
    await expect(preview).toBeVisible()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Options' })).toBeVisible()
    await expect(preview).toBeVisible()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Fence panels' })).toBeVisible()
    await expect(preview).toBeVisible()
  })
})

test.describe('configurator share route', () => {
  const shareToken = `e2e-share-${Date.now()}`

  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Supabase credentials are required for share-route E2E',
  )

  test.beforeAll(async () => {
    const seeded = await seedSharedConfiguration(shareToken)
    expect(seeded).toBe(true)
  })

  test.afterAll(async () => {
    await deleteSharedConfiguration(shareToken)
  })

  test('renders a read-only shared configuration', async ({ page }) => {
    await page.goto(`/quote/${shareToken}`)

    await expect(page.getByRole('heading', { name: /Gate quote preview/i })).toBeVisible()
    await expect(page.getByText(/Read-only view/i)).toBeVisible()
    await expect(page.locator('svg[aria-label*="preview" i]').first().locator('rect#swing-frame')).toBeVisible()
    await expect(page.getByRole('link', { name: /Request survey-led quote/i })).toHaveAttribute(
      'href',
      `/contact?shareToken=${encodeURIComponent(shareToken)}`,
    )
    await expect(page.getByRole('link', { name: /Download indicative PDF/i })).toHaveAttribute(
      'href',
      `/api/quote/${encodeURIComponent(shareToken)}/pdf`,
    )
  })

  test('serves an indicative PDF for a shared configuration', async ({ request }) => {
    const response = await request.get(`/api/quote/${shareToken}/pdf`)
    expect(response.ok()).toBeTruthy()
    expect(response.headers()['content-type']).toContain('application/pdf')
    const body = await response.body()
    expect(body.byteLength).toBeGreaterThan(500)
    expect(body.subarray(0, 4).toString()).toBe('%PDF')
  })

  test('prefills contact handoff with attached configuration', async ({ page }) => {
    await page.goto(`/contact?shareToken=${shareToken}`)

    await expect(page.getByText(/Attached configuration/i)).toBeVisible()
    await expect(page.getByText(/double swing · traditional victorian/i)).toBeVisible()
    await expect(page.locator('input[name="share_token"]')).toHaveValue(shareToken)
  })
})

test.describe('configurator live save', () => {
  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Supabase credentials are required for live save E2E',
  )

  test('copies a share link after saving from summary', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await walkToSummary(page)

    await page.getByRole('button', { name: /Copy share link/i }).click()
    await expect(page.getByRole('button', { name: /Link copied/i })).toBeVisible({ timeout: 15_000 })

    const sharePath = await page.evaluate(async () => {
      return navigator.clipboard.readText()
    })

    expect(sharePath).toMatch(/\/quote\/[A-Za-z0-9_-]+$/)
    const token = sharePath.split('/quote/')[1]
    expect(token).toBeTruthy()

    await page.goto(sharePath)
    await expect(page.getByRole('heading', { name: /Gate quote preview/i })).toBeVisible()

    if (token) {
      await deleteSharedConfiguration(token)
    }
  })
})
