# Testing Integration

This project uses Vitest for unit/component tests and Playwright for end-to-end tests. React Testing Library powers user-centric component tests. jsdom provides the browser-like environment for renderer tests. MSW is available for API mocking.

## Stack

- Unit: `vitest@3.2.4` with `@vitest/coverage-v8@3.2.4`
- DOM env: `jsdom@26.1.0`
- React: `@testing-library/react@16.3.0`, `@testing-library/jest-dom@6.8.0`, `@testing-library/user-event@14.6.1`
- E2E: `@playwright/test@1.55.0` (Electron launcher)
- Mocking: `msw@2.11.1` (optional)

## Scripts

- `npm test` — run unit tests (Vitest)
- `npm run test:ui` — open Vitest UI
- `npm run test:cov` — run with coverage (V8)
- `npm run e2e` — build and run Playwright tests

## Configuration

- `vitest.config.ts`
  - environment: `jsdom`
  - setup: `src/renderer/test/setup.ts` extends matchers via `@testing-library/jest-dom`
  - excludes `tests/e2e/**` from unit collection
- `playwright.config.ts`
  - testDir: `tests/e2e`

## File Layout

- Unit/component tests: `src/**/__tests__/*.(test|spec).{ts,tsx}`
- E2E tests: `tests/e2e/*.spec.ts`
- Setup: `src/renderer/test/setup.ts`

## Examples

### Component Test

```ts
import { render, screen } from '@testing-library/react'
import App from '../App'

it('renders hello text', () => {
  render(<App />)
  expect(screen.getByText(/Hello from React!/i)).toBeInTheDocument()
})
```

### Electron E2E Test

```ts
import { test, expect, _electron as electron } from '@playwright/test'

test('loads main window', async () => {
  const app = await electron.launch({ args: ['.'] })
  const window = await app.firstWindow()
  await expect(window).toHaveTitle(/Electron Starter/i)
  await app.close()
})
```

### Mocking `electron` in Unit Tests

```ts
vi.mock('electron', () => ({
  ipcRenderer: {
    invoke: vi.fn(),
    on: vi.fn(),
    removeAllListeners: vi.fn()
  }
}))
```

## Tips

- Keep renderer tests pure; prefer Testing Library queries over implementation details.
- Use `environment: 'node'` overrides for main-process-only tests if needed.
- For API-heavy components, mock network via MSW.
- When E2E tests depend on production build, `npm run e2e` already builds before running.
