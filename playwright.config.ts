import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 3,
  workers: 1,
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
  },
  maxFailures: process.env.CI ? 99 : 1,
  timeout: 60_000 * 10,
  expect: {
    timeout: process.env.CI ? 90_000 : 15_000,
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      // use: { ...devices['Desktop Chrome'], channel: 'chromium' },
      use: {
        viewport: { width: 1920, height: 1440 },
      }
    },
  ],
});
