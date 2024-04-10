import { Page, chromium, expect } from '@playwright/test';
import { DEFAULT_VALUES } from './defaultvalues';

export const login = async (page: Page) => {

  if (process.env.CI) {
    await page.goto(DEFAULT_VALUES.loginUrl);
    await page.locator('#username').fill(process.env.TEST_AUTOMATION_USERNAME!);
    await page.locator('#password').fill(process.env.TEST_AUTOMATION_PASSWORD!);
    await page.locator('input[type="submit"]').click();
  } else {
    await page.goto(DEFAULT_VALUES.loginUrl);
  }

};
