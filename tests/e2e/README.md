# E2E Tests

This directory contains end-to-end tests for the Dropbox Portfolio application using Playwright.

## Running Tests Locally

### Prerequisites
- Node.js 22.x installed
- Dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install --with-deps`)

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### View test report
```bash
npm run test:e2e:report
```

## Test Structure

- `home.spec.ts` - Tests for the home page
- `work.spec.ts` - Tests for the work portfolio page
- `about.spec.ts` - Tests for the about page

## CI/CD Integration

These tests are automatically run on Vercel preview deployments via GitHub Actions. The workflow is triggered by Vercel's `repository_dispatch` event after successful deployments.

See `.github/workflows/e2e-tests.yml` for the workflow configuration.

## Writing New Tests

Follow the existing test patterns:
1. Use descriptive test names
2. Wait for network idle state when appropriate
3. Add appropriate timeouts for Dropbox API calls
4. Use proper selectors and assertions

For more information, see [Playwright Documentation](https://playwright.dev/).
