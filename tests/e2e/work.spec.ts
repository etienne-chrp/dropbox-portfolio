import { test, expect } from '@playwright/test';

test.describe('Work Portfolio Page', () => {
  test('should load the work page without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    const response = await page.goto('/work');
    
    // Check HTTP status
    expect(response?.status()).toBe(200);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify no error messages displayed
    const errorText = await page.locator('text=/error|failed|exception/i').count();
    expect(errorText).toBe(0);
    
    // Check for critical console errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('metadataBase') &&
      !e.includes('Fast Refresh') &&
      !e.includes('WorkImage: `key`')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should display work items successfully', async ({ page }) => {
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    
    // Wait for content to load (adjust timeout for Dropbox API calls)
    await page.waitForTimeout(8000);
    
    // Verify no "Failed to retrieve" messages
    const failedMessages = await page.locator('text=/failed to retrieve/i').count();
    expect(failedMessages).toBe(0);
    
    // Verify no "res.buffer is not a function" errors
    const bufferErrors = await page.locator('text=/res.buffer is not a function/i').count();
    expect(bufferErrors).toBe(0);
    
    // The page should have a valid title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toContain('error');
    expect(title).not.toContain('Error');
  });

  test('should load thumbnails without errors', async ({ page }) => {
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    
    // Wait for thumbnails to load
    await page.waitForTimeout(10000);
    
    // Check for thumbnail images
    const thumbnails = page.locator('img[src*="thumbnail"]');
    const thumbnailCount = await thumbnails.count();
    
    if (thumbnailCount > 0) {
      // Verify at least one thumbnail loaded successfully
      const firstThumbnail = thumbnails.first();
      await expect(firstThumbnail).toBeVisible();
      
      // Check that the image actually loaded
      const imageLoaded = await firstThumbnail.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalWidth > 0;
      });
      expect(imageLoaded).toBe(true);
    }
  });

  test('should navigate to individual work item without errors', async ({ page }) => {
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    
    // Wait for work items to load
    await page.waitForTimeout(8000);
    
    // Try to find work item links
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const count = await workLinks.count();
    
    if (count > 0) {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await workLinks.first().click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Verify we navigated to a work detail page
      expect(page.url()).toContain('/work/');
      
      // Verify no error messages
      const errorMessages = await page.locator('text=/error|failed|exception/i').count();
      expect(errorMessages).toBe(0);
      
      // Check for critical console errors
      const criticalErrors = errors.filter(e => 
        !e.includes('Warning:') && 
        !e.includes('metadataBase') &&
        !e.includes('Fast Refresh') &&
        !e.includes('className')
      );
      expect(criticalErrors).toHaveLength(0);
    }
  });
  
  test('should not show "Failed to retrieve text file" errors', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });
    
    await page.goto('/work');
    await page.waitForTimeout(8000);
    
    // Check console logs for specific errors
    const failedTextFileErrors = consoleLogs.filter(log => 
      log.includes('Failed to retrieve text file')
    );
    
    expect(failedTextFileErrors).toHaveLength(0);
  });
});
