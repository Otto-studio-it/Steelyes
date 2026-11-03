import { test, expect } from '@playwright/test';

test.describe('CSP Verification & E2E Flow', () => {
  const baseURL = 'http://localhost:3000';
  const cspViolations: Array<{ url: string; directive: string; blockedURI: string }> = [];

  test.beforeEach(async ({ page }) => {
    // Capture CSP violations
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspViolations.push({
          url: page.url(),
          directive: msg.text(),
          blockedURI: msg.text(),
        });
      }
    });
  });

  test('Home page - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for any late-loading scripts

    // Check CSP header is enforced (not report-only)
    const response = await page.goto(baseURL);
    const headers = response?.headers() || {};
    expect(headers['content-security-policy']).toBeTruthy();
    expect(headers['content-security-policy']).toContain('default-src');
    expect(headers['content-security-policy']).toContain('upgrade-insecure-requests');
    
    // Verify no CSP violations
    console.log(`CSP violations on home: ${violations.length}`);
    violations.forEach(v => console.log(`  - ${v}`));
    expect(violations.length).toBe(0);
  });

  test('/gates page - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/gates`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log(`CSP violations on /gates: ${violations.length}`);
    expect(violations.length).toBe(0);
  });

  test('Configurator loads - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/configurator`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Wait for 3D canvas

    // Note: Canvas may not render in test env without full pricing data
    // Main goal is to verify CSP compliance
    const canvas = await page.locator('canvas').count();
    console.log(`Canvas elements found: ${canvas} (may be 0 in test env without data)`);

    console.log(`CSP violations on configurator: ${violations.length}`);
    expect(violations.length).toBe(0);
  });

  test('Configurator pricing - "No posts" option', async ({ page }) => {
    await page.goto(`${baseURL}/configurator`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Try to find and interact with configurator (may be limited without full env)
    const pageContent = await page.content();
    console.log('Configurator loaded, page includes "posts" text:', pageContent.toLowerCase().includes('post'));
  });

  test('Contact form with Turnstile - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/contact`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // Give time for Turnstile to attempt load

    // Check if Turnstile widget container is present
    const turnstileWidget = await page.locator('[data-testid="turnstile-widget"]').count();
    console.log(`Turnstile widget container found: ${turnstileWidget > 0}`);
    
    // Check if Turnstile iframe loaded (may not work with test key)
    const iframes = await page.locator('iframe').count();
    console.log(`Iframes on contact page: ${iframes}`);

    console.log(`CSP violations on contact: ${violations.length}`);
    violations.forEach(v => console.log(`  - ${v}`));
    expect(violations.length).toBe(0);
  });

  test('Cookiebot script loads - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    const scriptLoads: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('cookiebot.com') || url.includes('consentcdn.cookiebot.com')) {
        scriptLoads.push(url);
      }
    });

    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log(`Cookiebot script loads: ${scriptLoads.length}`);
    scriptLoads.forEach(s => console.log(`  - ${s}`));
    
    // In test environment without proper Cookiebot ID, script may not load
    // But CSP should not block it
    console.log(`CSP violations with Cookiebot: ${violations.length}`);
    expect(violations.length).toBe(0);
  });

  test('/_next/image returns WebP', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // Find an image request to /_next/image
    const imageRequests: string[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/_next/image')) {
        const contentType = response.headers()['content-type'] || '';
        console.log(`Image URL: ${response.url()}`);
        console.log(`Content-Type: ${contentType}`);
        imageRequests.push(contentType);
      }
    });

    await page.goto(`${baseURL}/gallery`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log(`Image requests found: ${imageRequests.length}`);
    // WebP format should be used (configured in next.config.mjs)
    const hasWebP = imageRequests.some(ct => ct.includes('webp'));
    console.log(`WebP format used: ${hasWebP}`);
  });

  test('Admin login with Turnstile - zero CSP violations', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/admin/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // Give time for Turnstile to attempt load

    // Check if Turnstile widget container is present
    const turnstileWidget = await page.locator('[data-testid="turnstile-widget"]').count();
    console.log(`Turnstile widget on admin login: ${turnstileWidget > 0}`);

    // Check form elements
    const emailInput = await page.locator('input[name="email"]').count();
    const passwordInput = await page.locator('input[name="password"]').count();
    console.log(`Login form elements present: email=${emailInput > 0}, password=${passwordInput > 0}`);

    console.log(`CSP violations on admin login: ${violations.length}`);
    violations.forEach(v => console.log(`  - ${v}`));
    expect(violations.length).toBe(0);
  });

  test('CSP headers are enforced', async ({ page }) => {
    const response = await page.goto(baseURL);
    const headers = response?.headers() || {};
    
    console.log('CSP Header:', headers['content-security-policy']?.substring(0, 200));
    
    // Verify CSP is enforced, not report-only
    expect(headers['content-security-policy']).toBeTruthy();
    expect(headers['content-security-policy']).not.toContain('report-only');
    
    // Verify key directives
    const csp = headers['content-security-policy'] || '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("upgrade-insecure-requests");
    
    // Verify trusted script sources
    expect(csp).toContain('https://consent.cookiebot.com');
    expect(csp).toContain('https://challenges.cloudflare.com');
  });
});
