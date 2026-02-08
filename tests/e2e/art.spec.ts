import { test, expect } from '@playwright/test';
import { waitForLoadingToComplete } from './test-utils';

test.describe('Art Portfolio Page', () => {
  test('should load the art page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      errors.push(err.message);
    });

    const response = await page.goto('/art');

    expect(response?.status()).toBe(200);

    await page.waitForLoadState('networkidle');

    const errorText = await page.locator('text=/error|failed|exception/i').count();
    expect(errorText).toBe(0);

    const criticalErrors = errors.filter(e =>
      !e.includes('Warning:') &&
      !e.includes('metadataBase') &&
      !e.includes('Fast Refresh')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should display art items successfully', async ({ page }) => {
    const response = await page.goto('/art');
    expect(response?.status()).toBe(200);

    await waitForLoadingToComplete(page);

    const failedMessages = await page.locator('text=/failed to retrieve/i').count();
    expect(failedMessages).toBe(0);

    const bufferErrors = await page.locator('text=/res.buffer is not a function/i').count();
    expect(bufferErrors).toBe(0);

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toContain('error');
    expect(title).not.toContain('Error');
  });

  test('should load thumbnails without errors', async ({ page }) => {
    const response = await page.goto('/art');
    expect(response?.status()).toBe(200);

    await waitForLoadingToComplete(page);

    const thumbnails = page.locator('img[src*="thumbnail"]');
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount > 0) {
      const firstThumbnail = thumbnails.first();
      await expect(firstThumbnail).toBeVisible();

      const imageLoaded = await firstThumbnail.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      expect(imageLoaded).toBe(true);
    }
  });

  test('should navigate to individual art item without errors', async ({ page }) => {
    const response = await page.goto('/art');
    expect(response?.status()).toBe(200);

    await waitForLoadingToComplete(page);

    const artLinks = page.locator('a[href*="/art/"]').filter({ hasNotText: /thumbnail/ });
    const count = await artLinks.count();

    if (count > 0) {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await artLinks.first().click();

      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/art/');

      const errorMessages = await page.locator('text=/error|failed|exception/i').count();
      expect(errorMessages).toBe(0);

      const criticalErrors = errors.filter(e =>
        !e.includes('Warning:') &&
        !e.includes('metadataBase') &&
        !e.includes('Fast Refresh') &&
        !e.includes('className') &&
        !e.includes('Failed to load resource') &&
        !e.includes('404')
      );
      expect(criticalErrors).toHaveLength(0);
    }
  });

  test('should not show "Failed to retrieve text file" errors', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('/art');
    await page.waitForTimeout(8000);

    const failedTextFileErrors = consoleLogs.filter(log =>
      log.includes('Failed to retrieve text file')
    );

    expect(failedTextFileErrors).toHaveLength(0);
  });
});
