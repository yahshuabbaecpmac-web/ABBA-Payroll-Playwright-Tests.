import { test, expect } from '@playwright/test';

test('Login Flow', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.shopping_cart_link')).toBeVisible();
  await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  await page.click('#react-burger-menu-btn');
  await expect(page.locator('#logout_sidebar_link')).toBeVisible();
});

