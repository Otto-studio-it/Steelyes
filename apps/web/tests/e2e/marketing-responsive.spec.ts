import { expect, test, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const screenshotDir = path.join(tmpdir(), 'steelyes-responsive-qa')

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

test('floating conversion chrome never stacks with cookie consent', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const cookieDialog = page.getByRole('dialog', { name: 'Cookie notice' })
  await expect(cookieDialog).toBeVisible()
  await expect(page.getByTestId('mobile-conversion-bar')).toHaveCount(0)

  await cookieDialog.getByRole('button', { name: 'Got it' }).click()
  await page.evaluate(() => window.scrollTo(0, 700))

  const conversionBar = page.getByTestId('mobile-conversion-bar')
  await expect(conversionBar).toBeVisible()
  await expect(conversionBar.getByRole('link')).toHaveCount(1)

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(conversionBar).toHaveCount(0)
})

for (const viewport of VIEWPORTS) {
  test(`homepage responsive — ${viewport.name} ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Steelyes Ltd', exact: true })).toBeVisible()
    await expect(page.getByTestId('page-scroll-progress')).toHaveCount(1)

    const hero = page.locator('main section').first()
    await expect(hero.getByRole('link', { name: 'Configure a gate', exact: true })).toBeVisible()
    await expect(hero.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()

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
      await expect(conversionBar.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()
      await expect(conversionBar.getByRole('link')).toHaveCount(1)
    } else {
      const header = page.locator('header')
      await expect(header.getByRole('link', { name: 'Configurator', exact: true })).toBeVisible()
      await expect(header.getByRole('link', { name: 'Configurator', exact: true })).toHaveAttribute(
        'data-configurator-placement',
        'desktop-primary-nav',
      )
      await expect(header.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()
    }

    await revealFullPage(page, viewport.height)
    const configuratorProduct = page.locator('section[aria-labelledby="home-configurator-title"]')
    await expect(configuratorProduct.getByRole('heading', { name: 'Design the entrance before the survey.' })).toBeVisible()
    await expect(configuratorProduct.getByRole('link', { name: 'Open the configurator' })).toHaveAttribute(
      'href',
      '/configurator',
    )
    await configuratorProduct.getByRole('button', { name: 'Finish' }).click()
    await expect(configuratorProduct.getByText('Anthracite grey', { exact: true })).toBeVisible()
    const closingCta = page.getByRole('heading', { name: 'Plan your entrance.' }).locator('..')
    await expect(closingCta.getByRole('link', { name: 'Configure a gate', exact: true })).toBeVisible()
    await expect(closingCta.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()

    const failedImages = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
      images
        .filter((image) => image.offsetParent !== null)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    )
    expect(failedImages).toEqual([])

    await page.screenshot({
      path: `${screenshotDir}/homepage-${viewport.width}.png`,
      fullPage: true,
    })
  })
}

for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
  test(`gallery exposes the configurator — ${viewport.name} ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/gallery')

    const cookieDialog = page.getByRole('dialog', { name: 'Cookie notice' })
    if (await cookieDialog.isVisible()) {
      await cookieDialog.getByRole('button', { name: 'Got it' }).click()
    }

    await revealFullPage(page, viewport.height)
    const projectCount = page.getByRole('status')
    const initialProjectCount = await projectCount.textContent()
    await page.getByRole('group', { name: 'Filter gallery by category' }).getByRole('button', { name: 'Gates' }).click()
    await expect(projectCount).not.toHaveText(initialProjectCount ?? '')
    const designCta = page.getByRole('link', { name: 'Design your gate' })
    await expect(designCta).toBeVisible()
    await expect(designCta).toHaveAttribute('href', '/configurator')
    await expect(designCta).toHaveAttribute('data-configurator-placement', 'gallery-footer')

    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(horizontalOverflow).toBe(false)
  })
}

test('marketing motion respects reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/gallery')

  await page.getByRole('group', { name: 'Filter gallery by category' }).getByRole('button', { name: 'Gates' }).click()
  const firstCard = page.locator('.marketing-gallery-item').first()
  await expect(firstCard).toBeVisible()
  expect(await firstCard.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
})

for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
  test(`gate taxonomy — ${viewport.name} ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/gates')

    const cookieDialog = page.getByRole('dialog', { name: 'Cookie notice' })
    if (await cookieDialog.isVisible()) {
      await cookieDialog.getByRole('button', { name: 'Got it' }).click()
    }

    await expect(page.getByRole('heading', { level: 1, name: 'Choose how your gate moves' })).toBeVisible()

    const decisionGuide = page.locator('section[aria-labelledby="gate-decisions-title"]')
    await expect(decisionGuide.getByRole('heading', { name: 'How it moves' })).toBeVisible()
    await expect(decisionGuide.getByRole('heading', { name: 'How it looks' })).toBeVisible()
    await expect(decisionGuide.getByRole('link', { name: 'Configure a gate', exact: true })).toBeVisible()
    await expect(decisionGuide.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()

    await decisionGuide.getByRole('link', { name: 'Compare mechanisms' }).click()
    await expect(page.locator('#gate-mechanisms')).toBeInViewport()
    await expect(page.getByRole('heading', { name: 'Compare the movement' })).toBeVisible()

    await revealFullPage(page, viewport.height)
    const failedImages = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
      images
        .filter((image) => image.offsetParent !== null)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    )
    expect(failedImages).toEqual([])

    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(horizontalOverflow).toBe(false)

    await page.screenshot({
      path: `${screenshotDir}/gates-${viewport.width}.png`,
      fullPage: true,
    })
  })
}

test('gate cards deep-link to the matching configurator mechanism', async ({ page }) => {
  const expectedLinks = {
    'Double swing': '/configurator?gate=double_swing',
    'Single swing': '/configurator?gate=single_swing',
    'Tracked sliding': '/configurator?gate=tracked_sliding',
    'Cantilever sliding': '/configurator?gate=cantilever_sliding',
    'Bifold double': '/configurator?gate=bifolding_double_swing',
    'Single bifold': '/configurator?gate=single_bifolding',
    'Telescopic sliding': '/configurator?gate=telescopic_sliding',
    'Radius sliding': '/configurator?gate=radius_sliding',
  } as const

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/gates')

  for (const [title, href] of Object.entries(expectedLinks)) {
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    await expect(card.getByRole('link', { name: 'Configure', exact: true })).toHaveAttribute('href', href)
  }

  await page.goto('/configurator?gate=tracked_sliding')
  await expect(page.locator('main').getByRole('heading', { level: 2, name: 'Tracked Sliding', exact: true })).toBeVisible()
  await expect(page.locator('main').getByText('Tracked Sliding · Traditional Victorian Style', { exact: true })).toBeVisible()
})

const SERVICE_ROUTES = [
  { route: '/services/railings', title: 'Glass Balustrades & Terraces', signature: 'Safe edges and enclosures' },
  { route: '/services/balconies', title: 'Metal & Glass Balconies', signature: 'Frames, decks and guards' },
  { route: '/services/structures', title: 'Steel Structures', signature: 'Load-bearing scope' },
  { route: '/services/staircases', title: 'Platforms & Staircases', signature: 'Access geometry' },
  { route: '/services/security', title: 'Perimeter Security', signature: 'Protective systems' },
] as const

for (const service of SERVICE_ROUTES) {
  test(`service identity — ${service.route}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(service.route)

    await expect(page.getByRole('heading', { level: 1, name: service.title })).toBeVisible()
    await expect(page.getByRole('heading', { name: service.signature })).toBeVisible()

    await revealFullPage(page, 812)
    const failedImages = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
      images
        .filter((image) => image.offsetParent !== null)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    )
    expect(failedImages).toEqual([])

    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(horizontalOverflow).toBe(false)
  })
}
