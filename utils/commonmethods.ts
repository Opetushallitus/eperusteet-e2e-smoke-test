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

export const waitSmall = async (page) => {
  await page.waitForTimeout(3_000);
}

export const waitMedium = async (page) => {
  await page.waitForTimeout(15_000);
}

export const waitLong = async (page) => {
  await page.waitForTimeout(60_000);
}
