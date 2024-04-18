import { Page } from '@playwright/test';

export const login = async (page: Page, url) => {

  if (process.env.CI) {
    await page.goto(url);
    await page.locator('#username').fill(process.env.TEST_AUTOMATION_USERNAME!);
    await page.locator('#password').fill(process.env.TEST_AUTOMATION_PASSWORD!);
    await page.locator('input[type="submit"]').click();
  } else {
    await page.goto(url);
  }

};
