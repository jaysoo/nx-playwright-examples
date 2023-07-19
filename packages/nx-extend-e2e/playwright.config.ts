import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // globalSetup: require.resolve('./playwright.global-setup'),
  outputDir: '../../dist/packages/nx-extend-e2e',

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    // baseURL: 'http://localhost:4200'
  },
};

export default config;
