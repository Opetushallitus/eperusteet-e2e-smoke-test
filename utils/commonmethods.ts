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

export const createNimi = async (nimi: string) => {
  // korjataan timezonea
  const currentDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
  return  nimi + ' ' + currentDate.toISOString().slice(0, 16).replace(/[T]/g, ' ');
};
