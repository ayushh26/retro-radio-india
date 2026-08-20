import { test, expect } from '@playwright/test';

test.describe('Theme Selector', () => {
  test('opens and lists all themes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const selector = page.locator('[data-testid="theme-selector"]');
    await selector.click();

    const options = page.locator('[data-testid="theme-option"]');
    await expect(options).toHaveCount(6);
  });

  test('selects a theme and closes dropdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.locator('[data-testid="theme-selector"]').click();
    const options = page.locator('[data-testid="theme-option"]');
    await options.nth(1).click();

    await expect(page.locator('[data-testid="theme-option"]')).toHaveCount(0);
  });
});
