import { test, expect } from '@playwright/test';

test('Wikipedia Playwright software search', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.getByRole('searchbox', { name: 'Search Wikipedia' }).fill('Playwright software');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/search/);
  await expect(page.locator('#mw-content-text')).toBeVisible();

  await page.getByRole('link', { name: 'Playwright (software)' }).click();
  await expect(page.getByRole('heading', { name: 'Playwright (software)' })).toBeVisible();
  await expect(page.locator('#mw-content-text')).toContainText('End-to-end testing framework');

  const imgCount = await page.locator('img').count();
  expect(imgCount).toBeGreaterThan(0);

  await page.goto('https://en.wikipedia.org/wiki/Playwright_(software)');
  await page.locator('#mw-content-text a', { hasText: 'Node.js' }).first().click();
  await expect(page.locator('#firstHeading')).toContainText('Node.js');
  await expect(page.locator('#mw-content-text')).toBeVisible();
  await expect(page.locator('.infobox')).toBeVisible();
});
