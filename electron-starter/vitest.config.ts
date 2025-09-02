import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'out/**', 'dist/**', 'node_modules/**'],
    environment: 'jsdom',
    setupFiles: ['./src/renderer/test/setup.ts'],
    coverage: {
      provider: 'v8'
    },
    globals: true
  }
})
