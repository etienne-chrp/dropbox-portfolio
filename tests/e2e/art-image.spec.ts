import { test, expect } from '@playwright/test';
import { waitForLoadingToComplete } from './test-utils';

test.describe('Art Image Page', () => {
  test('should load art image page from art detail page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const response = await page.goto('/art');
    expect(response?.status()).toBe(200);

    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    if (artLinkCount > 0) {
      await artLinks.first().click();
      await page.waitForLoadState('networkidle');

      const artErrors = await page.locator('text=/error|failed|exception/i').count();
      expect(artErrors).toBe(0);

      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();

      if (imageLinkCount > 0) {
        const imageHref = await imageLinks.first().getAttribute('href');
        expect(imageHref).toContain('/img/');

        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);

        await waitForLoadingToComplete(page);

        expect(page.url()).toContain('/art/');
        expect(page.url()).toContain('/img/');

        const imgErrors = await page.locator('text=/error|failed|exception/i').count();
        expect(imgErrors).toBe(0);

        const criticalErrors = errors.filter(e =>
          !e.includes('Warning:') &&
          !e.includes('metadataBase')
        );
        expect(criticalErrors).toHaveLength(0);
      }
    }
  });

  test('should display image on art image page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    expect(artLinkCount).toBeGreaterThan(0);

    await artLinks.first().click();
    await page.waitForLoadState('networkidle');

    const imageLinks = page.locator('a[href*="/img/"]');
    const imageLinkCount = await imageLinks.count();

    expect(imageLinkCount).toBeGreaterThan(0);

    await imageLinks.first().click();
    await page.waitForLoadState('networkidle');

    const img = page.locator('picture img');
    await expect(img).toBeVisible({ timeout: 15000 });

    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).not.toContain('undefined');
    expect(src).not.toContain('null');

    const imageLoaded = await img.evaluate((el: HTMLImageElement) => {
      return el.complete && el.naturalWidth > 0;
    });
    expect(imageLoaded).toBe(true);

    const errorMessages = await page.locator('text=/error|failed|exception/i').count();
    expect(errorMessages).toBe(0);

    const criticalErrors = errors.filter(e =>
      !e.includes('Warning:') &&
      !e.includes('metadataBase')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper metadata and title', async ({ page }) => {
    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    if (artLinkCount > 0) {
      await artLinks.first().click();
      await page.waitForLoadState('networkidle');

      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();

      if (imageLinkCount > 0) {
        await imageLinks.first().click();
        await page.waitForLoadState('networkidle');

        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      }
    }
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    const response = await page.goto('/art/NonExistent/img/test.jpg', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    }).catch(() => null);

    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should return 200 status for valid image pages', async ({ page }) => {
    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    expect(artLinkCount).toBeGreaterThan(0);

    await artLinks.first().click();
    await page.waitForLoadState('networkidle');

    const imageLinks = page.locator('a[href*="/img/"]');
    const imageLinkCount = await imageLinks.count();

    expect(imageLinkCount).toBeGreaterThan(0);

    const firstImageUrl = await imageLinks.first().getAttribute('href');
    expect(firstImageUrl).toBeTruthy();

    const response = await page.goto(firstImageUrl!);

    expect(response?.status()).toBe(200);
  });

  test('should load high-resolution image from Dropbox', async ({ page }) => {
    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    if (artLinkCount > 0) {
      await artLinks.first().click();
      await page.waitForLoadState('networkidle');

      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();

      if (imageLinkCount > 0) {
        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);

        await waitForLoadingToComplete(page);

        const img = page.locator('picture img');
        await img.waitFor({ state: 'visible', timeout: 15000 });

        await img.evaluate((el: HTMLImageElement) => {
          if (el.complete && el.naturalWidth > 0) return;
          return new Promise((resolve) => {
            el.onload = resolve;
            el.onerror = resolve;
          });
        });

        const isVisible = await img.isVisible();
        expect(isVisible).toBe(true);

        const imageLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        expect(imageLoaded).toBe(true);
      }
    }
  });

  test('should navigate back to art detail from image page', async ({ page }) => {
    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    if (artLinkCount > 0) {
      const firstArtUrl = await artLinks.first().getAttribute('href');
      await artLinks.first().click();
      await page.waitForLoadState('networkidle');

      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();

      if (imageLinkCount > 0) {
        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);
        await page.waitForLoadState('networkidle');

        await page.goBack();
        await page.waitForLoadState('networkidle');

        const currentPath = new URL(page.url()).pathname;
        expect(currentPath).toMatch(/^\/art\/[^/]+$/);
        expect(currentPath).not.toContain('/img/');
      }
    }
  });

  test('should have accessible image with alt text', async ({ page }) => {
    await page.goto('/art');
    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const artLinkCount = await artLinks.count();

    if (artLinkCount > 0) {
      await artLinks.first().click();
      await page.waitForLoadState('networkidle');

      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();

      if (imageLinkCount > 0) {
        await imageLinks.first().click();
        await page.waitForLoadState('networkidle');

        const img = page.locator('picture img');
        const alt = await img.getAttribute('alt');

        expect(alt).not.toBeNull();
      }
    }
  });
});
