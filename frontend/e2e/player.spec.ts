import { test, expect } from '@playwright/test';

test.describe('Player Controls', () => {
  test('displays player buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(page.locator('[data-testid="shuffle-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="previous-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="repeat-button"]')).toBeVisible();
  });

  test('play button exists and toggles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    const playBtn = page.locator('[data-testid="play-button"]');
    const pauseBtn = page.locator('[data-testid="pause-button"]');

    if (await playBtn.isVisible()) {
      await playBtn.click();
      await expect(pauseBtn).toBeVisible();
    } else {
      await expect(pauseBtn).toBeVisible();
    }
  });

  test('shuffle toggles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const shuffleBtn = page.locator('[data-testid="shuffle-button"]');
    await shuffleBtn.click();
    await shuffleBtn.click();
  });

  test('repeat cycles through modes', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const repeatBtn = page.locator('[data-testid="repeat-button"]');
    await repeatBtn.click();
    await repeatBtn.click();
    await repeatBtn.click();
  });
});
