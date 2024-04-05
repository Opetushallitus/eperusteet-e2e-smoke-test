import { Page, chromium, expect } from '@playwright/test';
import { DEFAULT_VALUES } from './defaultvalues';

export const login = async (page: Page) => {

  if (process.env.CI) {
    await page.goto(DEFAULT_VALUES.loginUrl);
    await page.locator('#username').fill(process.env.TEST_AUTOMATION_USERNAME!);
    await page.locator('#password').fill(process.env.TEST_AUTOMATION_PASSWORD!);
    await page.locator('input[type="submit"]').click();
  } else {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      httpCredentials: {
        username: 'test',
        password: 'test',
      },
    });
    const page = await context.newPage();
    await page.goto(DEFAULT_VALUES.loginUrl);
  }

};
