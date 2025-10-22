import { test, expect } from '@playwright/test';
    
test('Login', async ({ page }) => {
    await page.goto('https://theabbapayroll.com/login');
    await page.locator('#email').fill('yahshuabba.ecpmac@gmail.com');
    await page.locator('#password').fill('Test1@56');
    await page.locator('#signin-button').click();
    await page.goto('https://theabbapayroll.com/'); 
});