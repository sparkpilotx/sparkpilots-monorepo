import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'out/**', 'dist/**', 'node_modules/**'],
    environment: 'jsdom',
    setupFiles: ['./src/renderer/test/setup.ts'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**'],
      exclude: [
        'out/**',
        'dist/**',
        'coverage/**',
        'node_modules/**',
        'renderer/assets/**',
        'vitest.config.ts',
        'playwright.config.ts',
        'electron.vite.config.ts',
        'electron-builder.yml',
        'tests/**',
        'src/renderer/test/**'
      ],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage'
    },
    globals: true
  }
})
