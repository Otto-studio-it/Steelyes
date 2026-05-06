import { expect, test, type Locator, type Page } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin staging CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'E2E admin credentials are not set');

  test('redirects anonymous users to admin login', async ({ page }) => {
    for (const path of ['/admin/gates', '/admin/dashboard', '/admin/gate-options', '/admin/fencing']) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login\?redirectTo=/);
      expect(page.url()).toContain(`redirectTo=${encodeURIComponent(path)}`);
    }
  });

  test('logs in and shows dashboard sections', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByRole('link', { name: /Prezzi Cancelli/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Addon & Opzioni/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Pannelli Recinzione/i }).first()).toBeVisible();
  });

  test('updates and restores one gate manual price', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/gates');
    await expect(page.getByRole('heading', { name: /Prezzi Cancelli/i })).toBeVisible();

    const gateCard = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: /Single Swing Gate \(Metal\)/i })
      .first();

    await expect(gateCard).toBeVisible();
    await openCard(gateCard);

    const manualInput = gateCard.locator('input[type="number"]').first();
    const original = Number(await manualInput.inputValue());
    const updated = Number((original + 1).toFixed(2));

    await manualInput.fill(String(updated));
    await gateCard.getByRole('button', { name: /^Salva$/i }).click();
    await expect(gateCard.locator('input[type="number"]').first()).toBeHidden();

    await page.reload();
    const reloadedCard = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: /Single Swing Gate \(Metal\)/i })
      .first();
    await openCard(reloadedCard);
    await expect(reloadedCard.locator('input[type="number"]').first()).toHaveValue(String(updated));

    // rollback
    await reloadedCard.locator('input[type="number"]').first().fill(String(original));
    await reloadedCard.getByRole('button', { name: /^Salva$/i }).click();
    await expect(reloadedCard.locator('input[type="number"]').first()).toBeHidden();
  });

  test('updates and restores spirals per-unit price', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/gate-options');
    await expect(page.getByRole('heading', { name: /Addon & Opzioni/i })).toBeVisible();

    const spiralsCard = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: /spirals/i })
      .first();

    await expect(spiralsCard).toBeVisible();
    await openCard(spiralsCard);

    const perUnitInput = spiralsCard.locator('input[type="number"]').nth(1);
    const original = Number(await perUnitInput.inputValue());
    const updated = Number((original + 0.01).toFixed(2));

    await perUnitInput.fill(String(updated));
    await spiralsCard.getByRole('button', { name: /^Salva$/i }).click();
    await expect(spiralsCard.locator('input[type="number"]').nth(1)).toBeHidden();

    await page.reload();
    const reloadedSpirals = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: /spirals/i })
      .first();
    await openCard(reloadedSpirals);
    await expect(reloadedSpirals.locator('input[type="number"]').nth(1)).toHaveValue(String(updated));

    // rollback
    await reloadedSpirals.locator('input[type="number"]').nth(1).fill(String(original));
    await reloadedSpirals.getByRole('button', { name: /^Salva$/i }).click();
    await expect(reloadedSpirals.locator('input[type="number"]').nth(1)).toBeHidden();
  });

  test('creates and updates one fencing panel', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/fencing');
    await expect(page.getByRole('heading', { name: /Pannelli Recinzione/i })).toBeVisible();

    const token = `e2e-admin-crud-${Date.now()}`;
    const basePrice = String(100 + (Date.now() % 800));
    const perM2Price = String(10 + (Date.now() % 90));
    const updatedPerM2 = String(Number(perM2Price) + 1);

    await page.getByRole('button', { name: /\+ Aggiungi Pannello/i }).click();
    const createPanelForm = page.locator('form').filter({ has: page.getByRole('button', { name: /^Aggiungi$/i }) });
    await createPanelForm.locator('select').nth(0).selectOption('victorian');
    await createPanelForm.locator('select').nth(1).selectOption('metal');
    await createPanelForm.locator('input[type="number"]').nth(0).fill(basePrice);
    await createPanelForm.locator('input[type="number"]').nth(1).fill(perM2Price);
    await createPanelForm.locator('input[type="text"]').first().fill(token);
    await page.getByRole('button', { name: /^Aggiungi$/i }).click();

    await page.reload();
    const createdPanel = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: new RegExp(`Base:\\s*£${basePrice}`) })
      .filter({ hasText: new RegExp(`Per m²:\\s*£${perM2Price}`) })
      .first();

    await expect(createdPanel).toBeVisible();
    await openCard(createdPanel);
    await expect(createdPanel.locator('input[type="number"]').nth(0)).toHaveValue(basePrice);
    await expect(createdPanel.locator('input[type="number"]').nth(1)).toHaveValue(perM2Price);

    await createdPanel.locator('input[type="number"]').nth(1).fill(updatedPerM2);
    await createdPanel.getByRole('button', { name: /^Salva$/i }).click();
    await expect(createdPanel.locator('input[type="number"]').nth(1)).toBeHidden();

    await page.reload();
    const updatedPanel = page
      .locator('div.border.border-zinc-200.bg-white')
      .filter({ hasText: new RegExp(`Base:\\s*£${basePrice}`) })
      .first();
    await openCard(updatedPanel);
    await expect(updatedPanel.locator('input[type="number"]').nth(1)).toHaveValue(updatedPerM2);
  });
});

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(ADMIN_EMAIL!);
  await page.locator('#password').fill(ADMIN_PASSWORD!);
  await page.getByRole('button', { name: /^Accedi$/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

async function openCard(card: Locator) {
  const saveButton = card.getByRole('button', { name: /^Salva$/i });
  if (!(await saveButton.isVisible())) {
    await card.locator('button[type="button"]').first().click();
  }
  await expect(saveButton).toBeVisible();
}
