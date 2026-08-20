import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays main elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Retro Radio India/);
    await expect(page.locator('[data-testid="radio-app"]')).toBeVisible();
    await expect(page.locator('[data-testid="theme-selector"]')).toBeVisible();
  });

  test('displays theme name after loading', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const heading = page.locator('h1');
    await expect(heading.first()).not.toBeEmpty();
  });
});
