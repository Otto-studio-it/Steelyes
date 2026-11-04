import { test, expect } from '@playwright/test';

test.describe('UK PECR/GDPR Consent System', () => {
  const baseURL = 'http://localhost:3000';

  test.beforeEach(async ({ context }) => {
    // Clear cookies and localStorage before each test
    await context.clearCookies();
    await context.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('Cookie banner appears on first visit', async ({ page }) => {
    await page.goto(baseURL);
    
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    await expect(banner).toBeVisible();
    
    // Check for equal prominence buttons
    const acceptButton = banner.locator('button:has-text("Accept All")');
    const rejectButton = banner.locator('button:has-text("Reject All")');
    const manageButton = banner.locator('button:has-text("Manage Preferences")');
    
    await expect(acceptButton).toBeVisible();
    await expect(rejectButton).toBeVisible();
    await expect(manageButton).toBeVisible();
  });

  test('No Google scripts before consent', async ({ page }) => {
    const googleRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        googleRequests.push(url);
      }
    });

    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    expect(googleRequests.length).toBe(0);
  });

  test('No Google cookies before consent', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    const cookies = await page.context().cookies();
    const googleCookies = cookies.filter(c => 
      c.name.includes('_ga') || 
      c.name.includes('_gid') || 
      c.name.includes('_gcl')
    );
    
    expect(googleCookies.length).toBe(0);
  });

  test('Reject all keeps Google blocked', async ({ page }) => {
    const googleRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        googleRequests.push(url);
      }
    });

    await page.goto(baseURL);
    
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const rejectButton = banner.locator('button:has-text("Reject All")');
    await rejectButton.click();
    
    // Wait and verify banner is gone
    await expect(banner).not.toBeVisible();
    
    // Reload page and verify no Google scripts
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    expect(googleRequests.length).toBe(0);
    
    // Verify consent stored
    const consent = await page.evaluate(() => {
      const stored = localStorage.getItem('sy_cookie_consent');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(consent).toBeTruthy();
    expect(consent.categories.marketing).toBe(false);
    expect(consent.categories.analytics).toBe(false);
  });

  test('Accept marketing loads gtag only when GOOGLE_ADS_ID is set', async ({ page }) => {
    // Check if env var is set
    const hasGoogleAdsId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
    
    const googleRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        googleRequests.push(url);
      }
    });

    await page.goto(baseURL);
    
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const acceptButton = banner.locator('button:has-text("Accept All")');
    await acceptButton.click();
    
    await expect(banner).not.toBeVisible();
    
    // Reload to trigger script loading
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give scripts time to load
    
    if (hasGoogleAdsId) {
      expect(googleRequests.length).toBeGreaterThan(0);
      expect(googleRequests.some(url => url.includes('gtag/js'))).toBe(true);
    } else {
      expect(googleRequests.length).toBe(0);
    }
  });

  test('Manage preferences shows toggles', async ({ page }) => {
    await page.goto(baseURL);
    
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const manageButton = banner.locator('button:has-text("Manage Preferences")');
    await manageButton.click();
    
    // Should show preferences dialog
    const prefDialog = page.locator('[role="dialog"][aria-label="Cookie preferences"]');
    await expect(prefDialog).toBeVisible();
    
    // Check for toggles (off by default)
    const analyticsCheckbox = prefDialog.locator('input[type="checkbox"]').first();
    const marketingCheckbox = prefDialog.locator('input[type="checkbox"]').last();
    
    await expect(analyticsCheckbox).not.toBeChecked();
    await expect(marketingCheckbox).not.toBeChecked();
    
    // Check analytics
    await analyticsCheckbox.check();
    await expect(analyticsCheckbox).toBeChecked();
    
    // Save
    const saveButton = prefDialog.locator('button:has-text("Save Preferences")');
    await saveButton.click();
    
    await expect(prefDialog).not.toBeVisible();
    
    // Verify stored
    const consent = await page.evaluate(() => {
      const stored = localStorage.getItem('sy_cookie_consent');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(consent.categories.analytics).toBe(true);
    expect(consent.categories.marketing).toBe(false);
  });

  test('Banner reopenable from footer Cookie Settings link', async ({ page }) => {
    await page.goto(baseURL);
    
    // Accept first
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const acceptButton = banner.locator('button:has-text("Accept All")');
    await acceptButton.click();
    
    await expect(banner).not.toBeVisible();
    
    // Click footer link
    const footerLink = page.locator('footer a:has-text("Cookie Settings")');
    await footerLink.click();
    
    // Should reload and clear consent
    await page.waitForLoadState('networkidle');
    
    // Banner should appear again
    await expect(banner).toBeVisible();
  });

  test('Consent version stored correctly', async ({ page }) => {
    await page.goto(baseURL);
    
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const acceptButton = banner.locator('button:has-text("Accept All")');
    await acceptButton.click();
    
    const consent = await page.evaluate(() => {
      const stored = localStorage.getItem('sy_cookie_consent');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(consent.version).toBe(1);
    expect(consent.timestamp).toBeTruthy();
    expect(typeof consent.timestamp).toBe('number');
    expect(consent.categories).toBeTruthy();
  });

  test('No CSP violations with consent system', async ({ page }) => {
    const cspViolations: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto(baseURL);
    
    // Accept all
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const acceptButton = banner.locator('button:has-text("Accept All")');
    await acceptButton.click();
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`CSP violations: ${cspViolations.length}`);
    cspViolations.forEach(v => console.log(`  - ${v}`));
    
    expect(cspViolations.length).toBe(0);
  });

  test('Cookie policy page shows consent settings', async ({ page }) => {
    await page.goto(`${baseURL}/legal/cookie-policy`);
    await page.waitForLoadState('networkidle');
    
    const heading = page.locator('h1:has-text("Cookie Policy")');
    await expect(heading).toBeVisible();
    
    // Should show consent preference manager
    const settingsHeading = page.locator('h3:has-text("Manage Cookie Preferences")');
    await expect(settingsHeading).toBeVisible();
  });

  test('Google Consent Mode default state set', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('domcontentloaded');
    
    // Check that dataLayer exists and has default consent
    const hasDefaultConsent = await page.evaluate(() => {
      const dataLayer = (window as any).dataLayer;
      if (!dataLayer || !Array.isArray(dataLayer)) return false;
      
      return dataLayer.some((entry: any) => 
        Array.isArray(entry) && 
        entry[0] === 'consent' && 
        entry[1] === 'default'
      );
    });
    
    expect(hasDefaultConsent).toBe(true);
  });

  test('Consent updates Google Consent Mode', async ({ page }) => {
    await page.goto(baseURL);
    
    // Accept all
    const banner = page.locator('[role="dialog"][aria-label="Cookie notice"]');
    const acceptButton = banner.locator('button:has-text("Accept All")');
    await acceptButton.click();
    
    await page.waitForTimeout(1000);
    
    // Check that dataLayer has update consent
    const hasUpdateConsent = await page.evaluate(() => {
      const dataLayer = (window as any).dataLayer;
      if (!dataLayer || !Array.isArray(dataLayer)) return false;
      
      return dataLayer.some((entry: any) => 
        Array.isArray(entry) && 
        entry[0] === 'consent' && 
        entry[1] === 'update'
      );
    });
    
    expect(hasUpdateConsent).toBe(true);
  });
});
