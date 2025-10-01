# E2E Tests

End-to-end tests using Playwright to catch runtime issues before deployment.

## Running Tests

```bash
# Run all E2E tests
task test:e2e
bun run test:e2e

# Run tests with UI (interactive mode)
task test:e2e:ui

# Debug specific test
task test:e2e:debug

# Run tests in headed mode (see browser)
task test:e2e:headed
```

## First Time Setup

Install Playwright browsers:
```bash
task test:install
```

## What We Test

### Runtime Errors
- **Missing "use client" directives** - Components using React hooks need this
- **React hydration errors** - Server/client mismatch issues
- **Console errors** - Any JavaScript errors in the browser
- **Page errors** - Uncaught exceptions

### Functionality
- Page navigation
- Component rendering
- Key user interactions
- 404 handling

## Test Files

- `homepage.spec.ts` - Tests homepage loading and navigation
- `contact.spec.ts` - Tests contact page and chat interface
- `health-check.spec.ts` - Overall application health checks

## Writing New Tests

```typescript
import { test, expect } from '@playwright/test'

test('my new test', async ({ page }) => {
  // Track errors
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  // Navigate and test
  await page.goto('/my-page')
  await page.waitForLoadState('networkidle')

  // Check for errors
  expect(errors.length).toBe(0)

  // Test functionality
  await expect(page.locator('h1')).toBeVisible()
})
```

## CI/CD Integration

Tests automatically:
- Retry failed tests 2x in CI
- Run in parallel locally
- Generate HTML reports
- Take screenshots on failure

## Tips

1. **Run tests before deploying** - Catch issues early
2. **Check test reports** - `playwright-report/` folder after failures
3. **Use headed mode for debugging** - See what's happening in the browser
4. **Update tests when adding features** - Keep coverage current
