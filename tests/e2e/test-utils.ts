import { Page } from '@playwright/test';

export interface ErrorCollector {
  errors: string[];
  warnings: string[];
}

/**
 * Set up error listeners on a page to collect console errors and page errors
 */
export function collectPageErrors(page: Page): ErrorCollector {
  const collector: ErrorCollector = {
    errors: [],
    warnings: []
  };

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      collector.errors.push(text);
    } else if (msg.type() === 'warning') {
      collector.warnings.push(text);
    }
  });

  page.on('pageerror', err => {
    collector.errors.push(err.message);
  });

  return collector;
}

/**
 * Filter out known non-critical errors/warnings
 */
export function getCriticalErrors(errors: string[]): string[] {
  const ignoredPatterns = [
    /Warning:/i,
    /metadataBase/i,
    /Fast Refresh/i,
    /WorkImage: `key`/i,
    /Unexpected `className` prop/i,
  ];

  return errors.filter(error => {
    return !ignoredPatterns.some(pattern => pattern.test(error));
  });
}

/**
 * Get specific Dropbox-related errors
 */
export function getDropboxErrors(errors: string[]): string[] {
  const dropboxErrorPatterns = [
    /Failed to retrieve/i,
    /res\.buffer is not a function/i,
    /TypeError.*buffer/i,
    /Dropbox.*error/i,
  ];

  return errors.filter(error => {
    return dropboxErrorPatterns.some(pattern => pattern.test(error));
  });
}

/**
 * Check if page displays error messages in the UI
 */
export async function hasVisibleErrors(page: Page): Promise<boolean> {
  const errorSelectors = [
    'text=/application error/i',
    'text=/something went wrong/i',
    'text=/failed to/i',
    'text=/cannot read properties/i',
    'text=/typeerror/i',
    'text=/error:/i',
  ];

  for (const selector of errorSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Wait for network requests to complete, with a reasonable timeout
 */
export async function waitForNetwork(page: Page, timeout = 10000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch (e) {
    // Fallback to domcontentloaded if networkidle takes too long
    await page.waitForLoadState('domcontentloaded');
  }
}
