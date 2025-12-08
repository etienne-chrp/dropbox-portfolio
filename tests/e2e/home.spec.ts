import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    const response = await page.goto('/');
    
    // Check HTTP status
    expect(response?.status()).toBe(200);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify no React error boundaries or error messages
    const errorText = await page.locator('text=/error|failed|exception/i').count();
    expect(errorText).toBe(0);
    
    // Check for critical console errors (ignore warnings)
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('metadataBase') &&
      !e.includes('Fast Refresh')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Wait for navigation to be visible
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Check for navigation links
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verify navigation has links
    const navLinks = nav.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
  
  test('should not display error messages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for common error indicators
    const errorIndicators = [
      page.locator('text=/application error/i'),
      page.locator('text=/something went wrong/i'),
      page.locator('text=/failed to/i'),
      page.locator('text=/cannot read properties/i'),
      page.locator('text=/typeerror/i'),
    ];
    
    for (const indicator of errorIndicators) {
      const count = await indicator.count();
      expect(count).toBe(0);
    }
  });
});
