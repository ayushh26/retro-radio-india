import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test('admin page loads with login form', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-username"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('[data-testid="login-username"]').fill('wronguser');
    await page.locator('[data-testid="login-password"]').fill('wrongpass');
    await page.locator('[data-testid="login-submit"]').click();

    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
  });

  test('login with valid credentials shows dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('[data-testid="login-username"]').fill('admin');
    await page.locator('[data-testid="login-password"]').fill('admin123');
    await page.locator('[data-testid="login-submit"]').click();

    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });
});
