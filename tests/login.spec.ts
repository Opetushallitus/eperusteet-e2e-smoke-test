import { test, expect } from '@playwright/test';
import { login } from '../utils/commonmethods';
import { DEFAULT_VALUES } from '../utils/defaultvalues';

test('login', async ({ page }) => {
  await login(page)
  await page.goto(DEFAULT_VALUES.perusteprojektitUrl);
  await expect(page).toHaveTitle(DEFAULT_VALUES.loginTitleExpect + ' ei toimi');
});

