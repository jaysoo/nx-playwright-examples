import { test, expect } from '@playwright/test';

test('demo', async ({ page }) => {
  await page.goto('/');

  const greeting = page.locator('h1');
  await expect(greeting).toContainText('Welcome demo');
});
