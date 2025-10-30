import { test, expect } from '@playwright/test';

const DEFAULT_EMAIL = 'yahshuabba.ecpmac@gmail.com';
const DEFAULT_PASSWORD = 'Test1@56';
const BASE_URL = 'https://theabbapayroll.com';

async function loginPayroll(page, email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: /Email Address/i }).fill(email);
  await page.getByRole('textbox', { name: /Password/i }).fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/dashboard|\/$/);
}

test.describe('Employee List Functional Tests (Excluding Import & Export)', () => {
  test.beforeEach(async ({ page }) => {
    await loginPayroll(page);
    await page.getByRole('link', { name: /Employees/i }).click();
    await page.waitForLoadState('networkidle');
  });
  test('Record per page should be changeable', async ({ page }) => {
  await page.getByRole('link', { name: /Employees/i }).click();
  await page.getByRole('link', { name: /List/i }).click();
  await page.waitForURL(/employees\/list/);
  await page.waitForLoadState('networkidle');
  const dropdown = page.locator('text=Records per page:').locator('..').locator('select, [role="combobox"]');
  await expect(dropdown).toBeVisible({ timeout: 15000 });
  await dropdown.click();
  await page.getByText('20', { exact: true }).click();
  await expect(dropdown).toContainText('20');
  });

  test('User should be able to navigate pagination forward and backward', async ({ page }) => {
    await page.getByRole('link', { name: /Next/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('link', { name: /Previous/i })).toBeVisible();
    await page.getByRole('link', { name: /Previous/i }).click();
  });

  test('Total Records number should be accurate to the list', async ({ page }) => {
    const rows = await page.locator('table tbody tr').count();
    const totalText = await page.getByText(/Total Records:/i).innerText();
    const totalNumber = parseInt(totalText.replace(/\D/g, ''), 10);
    expect(totalNumber).toBeGreaterThanOrEqual(rows);
  });

  test('Employee Number should be visible', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: /Employee ID/i })).toBeVisible();
  });

  test('Employee Full Name should be visible', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: /Name/i })).toBeVisible();
  });

  test('User should navigate slider (horizontal scroll)', async ({ page }) => {
    const table = page.locator('table');
    await table.evaluate(el => el.scrollBy(500, 0));
    await expect(table).toBeVisible();
  });

 test('User should be able to delete an employee record', async ({ page }) => {
  const deleteButton = page.locator('table tbody tr:first-child button').nth(1);
  await deleteButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const reasonInput = dialog.getByRole('textbox', { name: /Enter reason/i });
  if (await reasonInput.isVisible()) {
    await reasonInput.fill('Playwright automated test deletion');
  }
  await dialog.getByRole('button', { name: /^Yes$/ }).click();
  await expect(page.getByText(/Employee deleted successfully/i)).toBeVisible({ timeout: 10000 });
  });

 test('User should open Departments section', async ({ page }) => {

  await page.getByRole('link', { name: /Employees/i }).click();
  await page.waitForURL(/employees\/list/, { timeout: 15000 });


  const departmentLink = page.getByRole('link', { name: /Department/i });
  await expect(departmentLink).toBeVisible({ timeout: 15000 });
  await departmentLink.click();

  await page.waitForURL(/employees\/department/, { timeout: 15000 });
  await expect(page).toHaveURL(/employees\/department/);


  });
 test('User should be able to click more options or 3 dots', async ({ page }) => {
  await page.getByRole('link', { name: /Employees/i }).click();
  await page.waitForURL(/employees\/list/, { timeout: 15000 });

  const departmentLink = page.getByRole('link', { name: /Department/i });
  await expect(departmentLink).toBeVisible({ timeout: 15000 });
  await departmentLink.click();

  await page.waitForURL(/employees\/department/, { timeout: 15000 });
  await expect(page).toHaveURL(/employees\/department/);

  const threeDotsButton = page.locator('//i[@class="text-lg mgc_more_2_line"]');
  await threeDotsButton.scrollIntoViewIfNeeded();
  await expect(threeDotsButton).toBeVisible({ timeout: 10000 });
  await threeDotsButton.click();

  const actionMenu = page.locator('div.absolute.right-2.mt-2.w-48.bg-white.rounded-md.shadow-lg');
  await expect(actionMenu).toBeVisible({ timeout: 10000 });

  const menuItems = actionMenu.getByRole('button', { name: /Export|Export Detail|Import/i });
  await expect(menuItems).toHaveCount(3);
});





  });

  test('Search button should be functional', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('Castillo');
    await page.getByRole('button', { name: /|Search/i }).click();
    await expect(page.locator('table')).toContainText('Castillo');
  });

test('Filter functionality should open the modal, allow selection, and apply the filter on search button click', async ({ page }) => {
  await page.waitForURL(/employees\/list/, { timeout: 15000 });

  const departmentLink = page.getByRole('link', { name: /Department/i });
  await expect(departmentLink).toBeVisible({ timeout: 15000 });
  await departmentLink.click();

  await page.waitForURL(/employees\/department/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  const filterButton = page.locator('//i[@class="text-lg mgc_filter_2_fill"]');
  await filterButton.scrollIntoViewIfNeeded();
  await expect(filterButton).toBeVisible({ timeout: 15000 });
  await filterButton.click();

  const filterModal = page.getByRole('dialog', { name: /Advance Filter/i });
  await expect(filterModal).toBeVisible({ timeout: 15000 });

  const departmentCombobox = filterModal
    .locator('label:has-text("Department")')
    .locator('xpath=following-sibling::*')
    .first()
    .getByRole('combobox');

  await departmentCombobox.click();
  await page.getByRole('option', { name: /Operations/i }).click();
  await page.getByRole('option', { name: /Media/i }).click();

  await filterModal.getByRole('button', { name: /Search/i }).click();
  await expect(filterModal).toBeHidden({ timeout: 15000 });

  await expect(page.getByText(/Records per page:/i)).toBeVisible();
});
