import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/** Strip wrapping quotes only when the same delimiter wraps both ends; otherwise leave value unchanged. */
function stripMatchingQuotes(raw: string): string {
  const v = raw.trim();
  if (v.length < 2) return v;
  const q = v[0];
  if ((q === '"' || q === "'") && v[v.length - 1] === q) {
    return v.slice(1, -1);
  }
  return v;
}

function loadEnvFromLocalFile() {
  const envPath = path.resolve(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [rawKey, ...rest] = trimmed.split('=');
    const key = rawKey.trim();
    if (!key || process.env[key] !== undefined) continue;
    process.env[key] = stripMatchingQuotes(rest.join('='));
  }
}

loadEnvFromLocalFile();

/**
 * See https://playwright.dev/docs/test-configuration.
 * Configurazione per E2E smoke test (Phase 0).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // URL di base per i test. Se Vercel è attivo (es. in CI), usalo. Altrimenti usa localhost per lo sviluppo locale.
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  testIgnore: '**/._*',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Se baseURL e' fornito dall'esterno, usiamo quel server senza avviarne uno nuovo.
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
