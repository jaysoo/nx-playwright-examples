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
    baseURL: 'http://127.0.0.1:4200',
  },
  webServer: {
    cwd: '../../',
    command: 'nx run demo:serve',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
};

export default config;
