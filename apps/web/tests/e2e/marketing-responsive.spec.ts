import { expect, test, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const screenshotDir = '/private/tmp/steelyes-responsive-qa'

async function revealFullPage(page: Page, viewportHeight: number) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)

  for (let y = 0; y < pageHeight; y += Math.max(320, viewportHeight - 120)) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(180)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1_500)
}

test.beforeAll(async () => {
  await mkdir(screenshotDir, { recursive: true })
})

for (const viewport of VIEWPORTS) {
  test(`homepage responsive — ${viewport.name} ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Steelyes Ltd', exact: true })).toBeVisible()

    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(horizontalOverflow).toBe(false)

    const cookieDialog = page.getByRole('dialog', { name: 'Cookie notice' })
    if (await cookieDialog.isVisible()) {
      await cookieDialog.getByRole('button', { name: 'Got it' }).click()
    }

    if (viewport.width < 1024) {
      const menuButton = page.getByRole('button', { name: 'Open navigation menu' })
      await menuButton.click()

      const mobileNavigation = page.locator('#mobile-navigation')
      await expect(mobileNavigation.getByRole('link', { name: 'Configure a gate', exact: true })).toBeVisible()
      await expect(mobileNavigation.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()

      if (viewport.width === 375) {
        await page.screenshot({ path: `${screenshotDir}/mobile-menu.png`, fullPage: false })
      }

      await page.getByRole('button', { name: 'Close navigation menu' }).click()
      await page.evaluate(() => window.scrollTo(0, 700))

      const conversionBar = page.getByTestId('mobile-conversion-bar')
      await expect(conversionBar.getByRole('link', { name: 'Configure gate', exact: true })).toBeVisible()
      await expect(conversionBar.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()
    } else {
      const header = page.locator('header')
      await expect(header.getByRole('link', { name: 'Configure a gate', exact: true })).toBeVisible()
      await expect(header.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()
    }

    await revealFullPage(page, viewport.height)
    const failedImages = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
      images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    )
    expect(failedImages).toEqual([])

    await page.screenshot({
      path: `${screenshotDir}/homepage-${viewport.width}.png`,
      fullPage: true,
    })
  })
}
