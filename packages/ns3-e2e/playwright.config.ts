import type { PlaywrightTestConfig } from '@playwright/test';

// This matches the value of `--configuration=...` and is set by Nx CLI.
const NX_TASK_TARGET_CONFIGURATION =
  process.env['NX_TASK_TARGET_CONFIGURATION'];

const BASE_URL =
  process.env['BASE_URL'] ?? NX_TASK_TARGET_CONFIGURATION === 'local'
    ? 'http://127.0.0.1:4200'
    : 'http://example.com';

const WEB_SERVER_CMD =
  NX_TASK_TARGET_CONFIGURATION === 'local'
    ? 'nx run demo:serve:development'
    : 'nx run demo:serve:production';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 1 : undefined,
  /* TestOptions https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  webServer: {
    cwd: '../../',
    command: WEB_SERVER_CMD,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
};

export default config;
