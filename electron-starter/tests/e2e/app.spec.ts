import { test, expect, _electron as electron } from '@playwright/test'

test('loads main window', async () => {
  const app = await electron.launch({ args: ['.'] })
  const window = await app.firstWindow()
  await expect(window).toHaveTitle(/Electron Starter/i)
  await app.close()
})
