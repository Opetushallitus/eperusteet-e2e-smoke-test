import { test, expect } from '@playwright/test';
import { login } from '../utils/commonmethods';
import { DEFAULT_VALUES } from '../utils/defaultvalues';

test('login', async ({ page }) => {
  await login(page, DEFAULT_VALUES.basePerusteetUrl)
  await page.goto(DEFAULT_VALUES.perusteprojektitUrl);
  await expect(page).toHaveTitle(DEFAULT_VALUES.loginTitleExpect);
});

