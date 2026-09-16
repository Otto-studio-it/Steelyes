import { expect, test } from '@playwright/test'

import {
  continueWizard,
  goToConfiguratorAct,
  waitForConfiguratorReady,
  walkToRefine,
  walkToSummary,
} from './helpers/configurator'
import { deleteQuoteTestData, deleteSharedConfiguration, seedSharedConfiguration } from './helpers/supabase-config'

test.describe('configurator release flow', () => {
  test('loads the design studio on choose act', async ({ page }) => {
    await waitForConfiguratorReady(page)

    await expect(page.getByRole('heading', { name: /Design your gate/i })).toBeVisible()
    await expect(page.getByRole('radiogroup', { name: 'Gate finish' })).toBeVisible()
    await expect(page.getByText(/Estimated pricing/i).first()).toBeVisible()
  })

  test('swaps the Design master when Victorian shape changes', async ({ page }) => {
    await waitForConfiguratorReady(page)

    const preview = page.getByTestId('design-master-preview')
    await expect(preview).toHaveAttribute('data-tipology', 'base')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /\/base\.svg/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/base/i)

    await page.getByRole('radio', { name: /^Arched top/i }).click()
    await expect(page.getByRole('radio', { name: /^Arched top/i })).toHaveAttribute('aria-checked', 'true')
    await expect(preview).toHaveAttribute('data-tipology', 'arched')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /arched/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/arched/i)

    await page.getByRole('radio', { name: /^Dog bars/i }).click()
    await expect(preview).toHaveAttribute('data-tipology', 'dog_bars')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /dog_bars/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/dog bars/i)
  })

  test('shows the selected finish as a swatch beside the Design master', async ({ page }) => {
    await waitForConfiguratorReady(page)

    await page.getByRole('radio', { name: /Anthracite/i }).click()
    await expect(page.getByRole('radio', { name: /Anthracite/i })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByTestId('configurator-preview-pinned').getByText(/Anthracite/i)).toBeVisible()
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /\/base\.svg/)
  })

  test('sliding drive records motor without swapping the Design master', async ({ page }) => {
    await waitForConfiguratorReady(page)

    await page.getByRole('button', { name: /^Change$/i }).click()
    await page.getByRole('radio', { name: /Tracked sliding/i }).click()
    const preview = page.getByTestId('design-master-preview')
    await expect(preview).toHaveAttribute('data-motorised', 'true')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /tracked_sliding\/silhouettes\/base\.svg/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/base/i)

    await page.getByRole('switch', { name: /Motorised/i }).click()
    await expect(page.getByRole('switch', { name: /Manual only/i })).toHaveAttribute('aria-checked', 'false')
    await expect(preview).toHaveAttribute('data-motorised', 'false')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /tracked_sliding\/silhouettes\/base\.svg/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/base/i)
  })

  test('walks through all acts to summary', async ({ page }) => {
    await walkToSummary(page)

    await expect(page.getByTestId('quote-request-form')).toBeVisible()
    await expect(page.getByRole('button', { name: /Email my design/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
  })

  test('railhead chooser stores SKU for summary without Design overlays', async ({ page }) => {
    await walkToRefine(page)

    await page.getByRole('button', { name: /^Decoration/i }).click()
    await page.getByRole('switch', { name: /Top railheads/i }).click()

    const chooser = page.getByTestId('railhead-chooser')
    await expect(chooser).toBeVisible()
    await expect(page.getByRole('heading', { name: /Railhead model/i })).toBeVisible()
    await chooser.getByRole('radio', { name: /RH32/i }).click()
    await expect(chooser.getByRole('radio', { name: /RH32/i })).toHaveAttribute('aria-checked', 'true')

    // Design drawing must not composite railhead SVGs on the master (chooser + side chip photos are OK).
    await expect(page.getByTestId('design-railhead-chip')).toHaveAttribute('data-sku', 'RH32')
    await expect(page.getByTestId('design-railhead-chip').locator('img')).toHaveAttribute('src', /RH32/)
    await expect(page.locator('img[src*="/2d-masters/railheads/silhouettes/"]')).toHaveCount(0)

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
    await expect(page.getByText(/^Railheads$/i).first()).toBeVisible()
    await expect(page.getByText(/^RH32$/i).filter({ visible: true }).first()).toBeVisible()
  })

  test('collar spacing swaps the Design master immediately', async ({ page }) => {
    await walkToRefine(page)

    const chooser = page.getByTestId('collar-chooser')
    await expect(chooser).toBeVisible()
    await chooser.getByRole('radio', { name: /Every picket/i }).click()
    await expect(chooser.getByRole('radio', { name: /Every picket/i })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByTestId('design-master-preview')).toHaveAttribute('data-collars', 'true')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /collar/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/collar/i)
  })

  test('circles swap the Design master immediately', async ({ page }) => {
    await walkToRefine(page)

    await page.getByRole('button', { name: /^Decoration/i }).click()
    await page.getByRole('switch', { name: /Circles/i }).click()
    await expect(page.getByRole('switch', { name: /Circles/i })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByTestId('design-master-preview')).toHaveAttribute('data-circles', 'true')
    await expect(page.getByTestId('design-master-img')).toHaveAttribute('src', /circles/)
    await expect(page.getByTestId('design-master-slug')).toContainText(/circles/i)
  })

  test('persists site survey request through reload and summary', async ({ page }) => {
    await walkToRefine(page)

    // Survey preference lives under the Site accordion group.
    await page.getByRole('button', { name: /^Site/i }).click()
    const siteSurveyCheckbox = page.getByRole('checkbox', { name: /site survey requested/i })
    await siteSurveyCheckbox.check()
    await expect(siteSurveyCheckbox).toBeChecked()

    await page.reload()
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    await walkToRefine(page)
    await page.getByRole('button', { name: /^Site/i }).click()
    await expect(page.getByRole('checkbox', { name: /site survey requested/i })).toBeChecked()

    await continueWizard(page)
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
    await expect(page.getByText(/Site survey requested/i).filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByText(/^Requested$/i).filter({ visible: true }).first()).toBeVisible()
  })

  test('restores draft configuration after reload', async ({ page }) => {
    await waitForConfiguratorReady(page)
    await page.getByRole('radio', { name: /Anthracite/i }).click()

    await page.reload()
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    await expect(page.getByRole('radio', { name: /Anthracite/i })).toHaveAttribute('aria-checked', 'true')
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

    // No full-options studio chrome on the quick path.
    await expect(page.getByText('Gate configurator')).toHaveCount(0)
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
    await expect(sheet.getByTestId('design-master-preview')).toBeVisible()
    await expect(sheet.getByTestId('design-master-slug')).toBeVisible()

    await sheet.getByRole('button', { name: /Close gate preview/i }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('All details switches to full options and back to Quick setup', async ({ page }) => {
    await gotoQuickPath(page)

    await page.getByRole('button', { name: /All details/i }).click()

    // Full-options density is now active with its act heading + back-to-simple link.
    await expect(page.getByRole('heading', { name: /Choose your gate/i })).toBeVisible()
    const backToQuick = page.getByRole('button', { name: /Quick setup/i })
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
    await expect(page.getByTestId('design-master-preview')).toBeVisible()
    await expect(page.getByTestId('design-master-slug')).toBeVisible()
    await expect(page.getByRole('link', { name: /Request survey-led quote/i })).toHaveAttribute(
      'href',
      `/contact?shareToken=${encodeURIComponent(shareToken)}`,
    )
    await expect(page.getByRole('link', { name: /Download estimate PDF/i })).toHaveAttribute(
      'href',
      `/api/quote/${encodeURIComponent(shareToken)}/pdf`,
    )
    // Workshop fabrication documents must not be exposed on the public share page.
    await expect(page.getByRole('link', { name: /cut list/i })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /workshop PDF/i })).toHaveCount(0)
  })

  test('blocks the workshop cut list for unauthenticated visitors', async ({ request }) => {
    const response = await request.get(`/api/quote/${shareToken}/cut-list`)
    expect(response.status()).toBe(403)
  })

  test('serves an estimate PDF for a shared configuration', async ({ request }) => {
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
    await expect(page.getByText(/double swing · traditional victorian/i).first()).toBeVisible()
    await expect(page.locator('input[name="share_token"]')).toHaveValue(shareToken)
  })
})

test.describe('configurator live save', () => {
  const testEmail = `e2e-quote-${Date.now()}@example.com`

  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Supabase credentials are required for live save E2E',
  )

  test.afterAll(async () => {
    await deleteQuoteTestData(testEmail)
  })

  test('submits a quote request from the summary form', async ({ page }) => {
    await walkToSummary(page)

    const form = page.getByTestId('quote-request-form')
    await form.locator('input[name="name"]').fill('E2E Tester')
    await form.locator('input[name="email"]').fill(testEmail)
    await form.locator('input[name="phone"]').fill('+44 7700 900000')
    await form.locator('input[name="postcode"]').fill('EN3 7TW')

    // Desktop uses the inline action bar; the submit button is bound to the form id.
    await page.getByRole('button', { name: /Request quote/i }).first().click()

    await expect(page.getByTestId('quote-request-success')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('button', { name: /Request sent/i }).first()).toBeVisible()
  })
})
