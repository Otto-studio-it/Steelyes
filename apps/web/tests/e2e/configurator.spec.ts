import { expect, test } from '@playwright/test'

import {
  continueWizard,
  getSwingFrameStroke,
  goToConfiguratorAct,
  waitForConfiguratorReady,
  walkToRefine,
  walkToSummary,
} from './helpers/configurator'
import { deleteSharedConfiguration, seedSharedConfiguration } from './helpers/supabase-config'

test.describe('configurator release flow', () => {
  test('loads the design studio on choose act', async ({ page }) => {
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

  test('walks through all acts to summary', async ({ page }) => {
    await walkToSummary(page)

    await expect(page.getByText(/Share configuration/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Copy share link/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
  })

  test('shows survey-required pricing when top railheads are enabled', async ({ page }) => {
    await walkToRefine(page)

    const railheadsSwitch = page.getByRole('switch', { name: /Top railheads/i })
    await railheadsSwitch.click()
    await expect(railheadsSwitch).toHaveAttribute('aria-checked', 'true')

    await expect(page.getByText(/Price on request|Survey required/i).first()).toBeVisible()
  })

  test('persists site survey request through reload and summary', async ({ page }) => {
    await walkToRefine(page)

    const siteSurveyCheckbox = page.getByRole('checkbox', { name: /site survey requested/i })
    await siteSurveyCheckbox.check()
    await expect(siteSurveyCheckbox).toBeChecked()

    await page.reload()
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    await walkToRefine(page)
    await expect(page.getByRole('checkbox', { name: /site survey requested/i })).toBeChecked()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
    await expect(page.getByText(/Site survey requested/i).filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByText(/^Requested$/i).filter({ visible: true }).first()).toBeVisible()
  })

  test('restores draft configuration after reload', async ({ page }) => {
    await waitForConfiguratorReady(page)
    await page.getByRole('radio', { name: /Pearl white/i }).click()

    await page.reload()
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    await expect(page.getByRole('radio', { name: /Pearl white/i })).toHaveAttribute('aria-checked', 'true')
  })

  test('act rail allows jumping back to earlier acts', async ({ page }) => {
    await walkToSummary(page)
    await goToConfiguratorAct(page, 'Define')
    await expect(page.getByRole('slider', { name: 'Width' })).toBeVisible()
  })
})

async function gotoQuickPath(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('sy_cookie_consent', 'accepted')
    } catch {}
  })
  await page.goto('/configurator')
  // Phase 2: phones default to the Quick Path, not the Design Studio.
  await expect(page.getByText(/Step 1 of 3/i)).toBeVisible()
}

test.describe('configurator mobile quick path', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('defaults phones to Quick Path screen 1 with compact chrome', async ({ page }) => {
    await gotoQuickPath(page)

    // No Design Studio header or act heading on the quick path.
    await expect(page.getByText('Design studio')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toHaveCount(0)

    // 96px chip + compact action bar with a live estimate and Continue.
    await expect(page.getByRole('button', { name: /Open full gate preview/i })).toBeVisible()
    await expect(page.getByTestId('configurator-preview-pinned')).toHaveCount(0)
    await expect(page.getByTestId('configurator-action-bar').getByText(/Live estimate|Survey required|Price on request/i)).toBeVisible()
    await expect(page.getByTestId('configurator-action-bar').getByRole('button', { name: /^Continue$/i })).toBeVisible()
  })

  test('walks the three quick screens to the quote handoff', async ({ page }) => {
    await gotoQuickPath(page)

    // Screen 1 → 2: opening with curated width presets.
    await continueWizard(page)
    await expect(page.getByText(/Step 2 of 3/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Standard drive/i })).toBeVisible()

    // Screen 2 → 3: quote ready with site survey + quote CTA, no Continue.
    await continueWizard(page)
    await expect(page.getByText(/Step 3 of 3/i)).toBeVisible()
    await expect(page.getByRole('checkbox', { name: /site survey requested/i })).toBeVisible()
    await expect(page.getByTestId('configurator-action-bar').getByRole('button', { name: /Request quote/i })).toBeVisible()
    await expect(page.getByTestId('configurator-action-bar').getByRole('button', { name: /^Continue$/i })).toHaveCount(0)
  })

  test('opens the full preview in a bottom sheet from the chip', async ({ page }) => {
    await gotoQuickPath(page)

    await page.getByRole('button', { name: /Open full gate preview/i }).click()

    const sheet = page.getByRole('dialog')
    await expect(sheet.getByText(/Gate preview/i)).toBeVisible()
    await expect(sheet.getByTestId('configurator-preview-pinned')).toBeVisible()
    await expect(sheet.locator('svg[aria-label*="preview" i]').first().locator('rect#swing-frame')).toBeVisible()

    await sheet.getByRole('button', { name: /Close gate preview/i }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('Customise everything switches to the Design Studio and back', async ({ page }) => {
    await gotoQuickPath(page)

    await page.getByRole('button', { name: /Customise everything/i }).click()

    // Design Studio is now active with its act heading + back-to-quick link.
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    const backToQuick = page.getByRole('button', { name: /Quick path/i })
    await expect(backToQuick).toBeVisible()

    await backToQuick.click()
    await expect(page.getByText(/Step 1 of 3/i)).toBeVisible()
  })

  test('browser back returns to the previous quick screen', async ({ page }) => {
    await gotoQuickPath(page)

    await continueWizard(page)
    await expect(page.getByText(/Step 2 of 3/i)).toBeVisible()

    // Phase 3: system / browser back steps down instead of leaving the page.
    await page.goBack()
    await expect(page.getByText(/Step 1 of 3/i)).toBeVisible()
  })

  test('in-app Back steps down the quick path', async ({ page }) => {
    await gotoQuickPath(page)

    await continueWizard(page)
    await expect(page.getByText(/Step 2 of 3/i)).toBeVisible()

    await page.getByTestId('configurator-action-bar').getByRole('button', { name: /^Back$/i }).click()
    await expect(page.getByText(/Step 1 of 3/i)).toBeVisible()
  })
})

test.describe('configurator quick path small phone (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('renders without horizontal overflow', async ({ page }) => {
    await gotoQuickPath(page)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    await expect(page.getByTestId('configurator-action-bar').getByRole('button', { name: /^Continue$/i })).toBeVisible()
  })
})

test.describe('configurator quick path landscape phone', () => {
  test.use({ viewport: { width: 740, height: 360 } })

  test('still defaults to the Quick Path in landscape', async ({ page }) => {
    await gotoQuickPath(page)

    await expect(page.getByRole('button', { name: /Open full gate preview/i })).toBeVisible()
    await expect(page.getByTestId('configurator-action-bar')).toBeVisible()
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
