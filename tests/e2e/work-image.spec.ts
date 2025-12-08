import { test, expect } from '@playwright/test';
import { waitForLoadingToComplete } from './test-utils';

test.describe('Work Image Page', () => {
  test('should load work image page from work detail page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Start from the work listing page
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    
    // Wait for work items to load
    await waitForLoadingToComplete(page);
    
    // Find and click the first work item
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    if (workLinkCount > 0) {
      // Click on the first work item
      await workLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Verify no errors on work detail page
      const workErrors = await page.locator('text=/error|failed|exception/i').count();
      expect(workErrors).toBe(0);
      
      // Find image links on the work detail page
      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();
      
      if (imageLinkCount > 0) {
        // Get the href before clicking to verify it's correct
        const imageHref = await imageLinks.first().getAttribute('href');
        expect(imageHref).toContain('/img/');
        
        // Click on the first image link and wait for navigation
        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);
        
        // Wait for loading to complete
        await waitForLoadingToComplete(page);
        
        // Verify we're on an image page
        expect(page.url()).toContain('/work/');
        expect(page.url()).toContain('/img/');
        
        // Verify no error messages on image page
        const imgErrors = await page.locator('text=/error|failed|exception/i').count();
        expect(imgErrors).toBe(0);
        
        // Check for critical console errors
        const criticalErrors = errors.filter(e => 
          !e.includes('Warning:') && 
          !e.includes('metadataBase')
        );
        expect(criticalErrors).toHaveLength(0);
      }
    }
  });

  
  test('should display image on work image page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate to a work page first
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    // Ensure we have work items to test
    expect(workLinkCount).toBeGreaterThan(0);
    
    await workLinks.first().click();
    await page.waitForLoadState('networkidle');
    
    // Find and click an image link
    const imageLinks = page.locator('a[href*="/img/"]');
    const imageLinkCount = await imageLinks.count();
    
    // Ensure we have image links to test
    expect(imageLinkCount).toBeGreaterThan(0);
    
    await imageLinks.first().click();
    await page.waitForLoadState('networkidle');
    
    // Wait for the image to load
    const img = page.locator('picture img');
    await expect(img).toBeVisible({ timeout: 15000 });
    
    // Verify the image has a valid src attribute
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).not.toContain('undefined');
    expect(src).not.toContain('null');
    
    // Verify the image actually loaded successfully
    const imageLoaded = await img.evaluate((el: HTMLImageElement) => {
      return el.complete && el.naturalWidth > 0;
    });
    expect(imageLoaded).toBe(true);
    
    // Verify no error messages
    const errorMessages = await page.locator('text=/error|failed|exception/i').count();
    expect(errorMessages).toBe(0);
    
    // Check for critical console errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('metadataBase')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper metadata and title', async ({ page }) => {
    // Navigate through work listing to get to an image
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    if (workLinkCount > 0) {
      await workLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();
      
      if (imageLinkCount > 0) {
        await imageLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Verify the page has a title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      }
    }
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    // Try to navigate to a potentially non-existent image page
    // This tests error handling
    const response = await page.goto('/work/NonExistent/img/test.jpg', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    }).catch(() => null);
    
    // Page should either redirect, show 404, or handle the error
    // We just verify the page doesn't crash
    const title = await page.title();
    expect(title).toBeTruthy();
  });
  
  test('should return 200 status for valid image pages', async ({ page }) => {
    // Navigate to work listing
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    expect(workLinkCount).toBeGreaterThan(0);
    
    await workLinks.first().click();
    await page.waitForLoadState('networkidle');
    
    // Find image links
    const imageLinks = page.locator('a[href*="/img/"]');
    const imageLinkCount = await imageLinks.count();
    
    expect(imageLinkCount).toBeGreaterThan(0);
    
    // Get the URL of the first image link
    const firstImageUrl = await imageLinks.first().getAttribute('href');
    expect(firstImageUrl).toBeTruthy();
    
    // Navigate to the image page and check status
    const response = await page.goto(firstImageUrl!);
    
    // Should return 200, not 404 or 500
    expect(response?.status()).toBe(200);
  });

  test('should load high-resolution image from Dropbox', async ({ page }) => {
    // Navigate to work page
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    if (workLinkCount > 0) {
      await workLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();
      
      if (imageLinkCount > 0) {
        // Wait for navigation to image page
        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);
        
        // Wait for loading to complete
        await waitForLoadingToComplete(page);
        
        // Wait for the image element
        const img = page.locator('picture img');
        await img.waitFor({ state: 'visible', timeout: 15000 });
        
        // Wait for image to actually load
        await img.evaluate((el: HTMLImageElement) => {
          if (el.complete && el.naturalWidth > 0) return;
          return new Promise((resolve) => {
            el.onload = resolve;
            el.onerror = resolve;
          });
        });
        
        // Verify image loaded successfully
        const isVisible = await img.isVisible();
        expect(isVisible).toBe(true);
        
        // Check if image has loaded (naturalWidth > 0 means image loaded)
        const imageLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        expect(imageLoaded).toBe(true);
      }
    }
  });

  test('should navigate back to work detail from image page', async ({ page }) => {
    // Navigate to an image page
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    if (workLinkCount > 0) {
      const firstWorkUrl = await workLinks.first().getAttribute('href');
      await workLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();
      
      if (imageLinkCount > 0) {
        // Wait for navigation to image page
        await Promise.all([
          page.waitForURL('**/img/**', { timeout: 10000 }),
          imageLinks.first().click()
        ]);
        await page.waitForLoadState('networkidle');
        
        // Go back using browser back button
        await page.goBack();
        await page.waitForLoadState('networkidle');
        
        // Verify we're back on the work detail page (not the listing)
        const currentPath = new URL(page.url()).pathname;
        expect(currentPath).toMatch(/^\/work\/[^/]+$/); // Matches /work/{name} but not /work or /work/{name}/img/...
        expect(currentPath).not.toContain('/img/');
      }
    }
  });

  test('should have accessible image with alt text', async ({ page }) => {
    // Navigate to an image page
    await page.goto('/work');
    await waitForLoadingToComplete(page);
    
    const workLinks = page.locator('a[href*="/work/"]').filter({ hasNotText: /thumbnail/ });
    const workLinkCount = await workLinks.count();
    
    if (workLinkCount > 0) {
      await workLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      const imageLinks = page.locator('a[href*="/img/"]');
      const imageLinkCount = await imageLinks.count();
      
      if (imageLinkCount > 0) {
        await imageLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Check for alt text
        const img = page.locator('picture img');
        const alt = await img.getAttribute('alt');
        
        // Alt text should exist (even if empty)
        expect(alt).not.toBeNull();
      }
    }
  });
});
