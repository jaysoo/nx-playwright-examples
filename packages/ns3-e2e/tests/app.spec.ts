import { expect, test } from '@playwright/test';

test('should start page', async ({ page }) => {
  await page.goto(`/`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Demo/);
});
