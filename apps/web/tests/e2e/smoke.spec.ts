import { test, expect } from '@playwright/test';

// Smoke test basico per la Phase 0. 
// Verifica solo che l'infrastruttura di deploy e routing funzioni.
test('homepage responde e mostra il wordmark', async ({ page }) => {
  await page.goto('/');

  // Verifica che non ci siano errori di server (es. 500)
  const title = await page.title();
  expect(title).toBeDefined();

  // Requisito Phase 0: la preview deve mostrare il wordmark STEELYES.
  // Il copy hero puo' cambiare, il brand "Steelyes" deve restare stabile.
  await expect(page.getByRole('link', { name: 'Steelyes Ltd', exact: true })).toBeVisible();
});
