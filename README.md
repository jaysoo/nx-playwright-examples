# Playwright examples

This repo is used to test migration community Playwright plugins for Nx to the planned `@nx/playwright` plugin.

These are the plugins we are testing with:

- `@ns3/nx-playwright`
- `@mands/nx-playwright`
- `@nxkit/playwright`
- `@nx-extend/playwright` / `@nx-extend/e2e-runner`

In the main branch you can run the follow to see all tests passing with the community plugin:

```shell
nx run-many -t=e2e --no-parallel --verbose
```

## Migrating to `@nx/playwright`

The package is not published to npm yet, but the source exists [here](https://github.com/nrwl/nx/tree/master/packages/playwright) in the Nx repo.

To test it locally you can run the local registry and publish from the Nx repo.

```shell
nx local-registry
pnpm nx-release 17.0.0 --verbose
```

Now you can install `@nx/playwrigh@17.0.0` locally.

The [`migration` branch](https://github.com/jaysoo/nx-playwright-examples/pull/1) is the one we will use to show changes for each project to switch to `@nx/playwright:playwright` executor.

## Notes

Here are some additional findings that might be relevant for anyone using the community plugins.

### Changed or removed executor options

#### `devServerTarget`

Some plugins use the `devServerTarget` option to start the dev-server to test against. This option is likely borrow from our `@nx/cypress:cypress` executor, but it is unnecessary for Playwright since the latter has built-in support to start the server, and is more battle-tested compared to custom solutions.

```js
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Run your local dev server before starting the tests
  webServer: {
    // Needs to be relative path to workspace root, or else serve will fail.
    // TODO: If we set cwd from executor to workpace root then this is not needed.
    cwd: '../../',
    command: 'nx serve my-app',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
```

The lack of `devServerTarget` means that we need to migrate those options and merge them into the `playwright.config.ts` file instead.

For the `@nx-extend/e2e-runner` plugin, the custom `targets` option can continue to be used since it has nothing to do with Playwright.

**Note:** If e2e tests need to run in both development and production mode, then it needs to be configured in `webServer` section of `playwright.config.ts`. For example, `command: \`nx run my-app:serve:${process.env['NX_TASK_TARGET_CONFIGURATION']}\``. See https://nx.dev/reference/environment-variables#environment-variables for more details.

#### `command`

The `@ns3/nx-playwright` plugin uses `command` to determine which Playwright CLI command to run (e.g. `playwright test` to run e2e tests). Our design is that `@nx/playwright:playwright` is solely used for e2e testing (same as `@nx/cypress:cypress`), thus is did not make sense to support more commands from the executor.

#### `playwrightConfig`

This option is just `config` for `@nx/playwright:playwright` executor. Behavior remains the same.

#### `outputPath`

Since Playwright uses the `outputDir` option already to control where results are written to, we don't need another option to do the same thing. The only consideration here is that if the user customizes this value then they need to update `project.json` to the outputs are cached correctly.

### `playwright.config.ts` changes

Besides the addition of `webServer` in `playwright.config.ts`, here are some other notable changes.

#### `use.baseURL`

Since `process.env.BASE_URL` is not set by `@nx/playwright:playwright`, we need to provide a default value in `playwright.config.ts` (e.g. `http://127.0.0.1:4200`). We could add it when we fork the Playwright CLI to support backwards compat with the existing configuration used by `@ns3/nx-playwright`.

### Generators

Most plugins use the `project` generator to create a new project and configure it for Playwright. For example, `nx g @mands/nx-playwright my-app-e2e --project=my-app`. This will not be provided by `@nx/playwright` since we are moving away from a project generator (even for Cypress), instead the `@nx/playwright:configuration` generator will add Playwright to an existing project.

In practice, we will be adding `--e2eTestRunner=playwright` to all app generators, so this change shouldn't affect end users. For anyone else that wants the older behavior of creating a new project, you can create an empty project then run the `configuration` generator.

```shell
nx g @nx/workspace:lib my-app-e2e
nx g @nx/playwright:configuration --project=my-app-e2e
```

### Additional thoughts

Some other notes, in no particular order for things the team has discussed.

- We may create an Nx plugin for Playwright to help ease migrations. This plugin can bridge the cap between `devServerTarget` and `webServer` for example.
- Add correct `outputs` (in `project.json`) config for `outputDir` so caching will work.

