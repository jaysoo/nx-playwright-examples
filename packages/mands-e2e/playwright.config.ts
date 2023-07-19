import type { PlaywrightTestConfig } from '@playwright/test';

import { baseConfig } from '../../playwright.config.base';

// This matches the value of `--configuration=...` and is set by Nx CLI.
const NX_TASK_TARGET_CONFIGURATION =
  process.env['NX_TASK_TARGET_CONFIGURATION'];

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    cwd: '../../',
    command:
      NX_TASK_TARGET_CONFIGURATION === 'production'
        ? 'nx run demo:serve:production'
        : 'nx run demo:serve',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
};

export default config;
