import { expect, test, type Page } from '@playwright/test'

async function skipCookieBanner(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('sy_cookie_consent', 'accepted')
    } catch {
      // Ignore quota / private-mode failures; the banner is dismissed in-test if needed.
    }
  })
}

async function expectConfiguratorOpened(page: Page) {
  await expect(page).toHaveURL(/\/configurator(?:\?|$)/)
  const studioHeading = page.getByRole('heading', { name: /Design your gate|Choose your gate/i })
  const actionBar = page.getByTestId('configurator-action-bar')
  await expect(studioHeading.or(actionBar).first()).toBeVisible({ timeout: 20_000 })
}

test.describe('header Configurator navigation', () => {
  test('desktop Configurator opens the configurator from the homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await skipCookieBanner(page)
    await page.goto('/')

    await page.locator('header').getByRole('link', { name: 'Configurator', exact: true }).click()
    await expectConfiguratorOpened(page)
  })

  test('desktop Configurator opens the configurator from About', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await skipCookieBanner(page)
    await page.goto('/about')

    await page.locator('header').getByRole('link', { name: 'Configurator', exact: true }).click()
    await expectConfiguratorOpened(page)
  })

  test('mobile menu Configure a gate opens the configurator', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await skipCookieBanner(page)
    await page.goto('/')

    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Configure a gate', exact: true }).click()
    await expectConfiguratorOpened(page)
  })

  test('mobile Configurator click shows a loading indicator while the page opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await skipCookieBanner(page)
    await page.goto('/')

    await page.route((url) => url.pathname === '/configurator', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await route.continue()
    })

    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Configure a gate', exact: true }).click()
    await expect(page.getByTestId('configurator-loading')).toBeVisible()
    await expectConfiguratorOpened(page)
  })
})
