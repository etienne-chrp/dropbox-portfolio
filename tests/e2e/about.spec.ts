import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should load the about page without errors', async ({ page }) => {
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
    
    const response = await page.goto('/about');
    
    // Check HTTP status
    expect(response?.status()).toBe(200);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify no error messages
    const errorText = await page.locator('text=/error|failed|exception/i').count();
    expect(errorText).toBe(0);
    
    // Check for critical console errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('metadataBase') &&
      !e.includes('Fast Refresh')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should display about content without errors', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    
    // Wait for content to load
    await page.waitForTimeout(5000);
    
    // The page should have a valid title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toContain('error');
    expect(title).not.toContain('Error');
    
    // Verify no "Failed to retrieve" messages
    const failedMessages = await page.locator('text=/failed to retrieve/i').count();
    expect(failedMessages).toBe(0);
  });
  
  test('should not display error boundaries', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Check for React error boundary indicators
    const errorBoundary = await page.locator('text=/application error|something went wrong/i').count();
    expect(errorBoundary).toBe(0);
  });
});
