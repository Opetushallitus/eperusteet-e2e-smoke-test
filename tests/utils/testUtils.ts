import { Page, test, expect } from '@playwright/test';
import { CI_baseUrl, DEFAULT_VALUES } from "../../utils/defaultvalues";
import { login, waitMedium, waitSmall } from "../../utils/commonmethods";

export interface TestData {
  page: Page;
  projektiNimi?: string;
  opsNimi?: string;
  pohjaNimi?: string;
  perusteDiaari?: string;
  koulutustyyppi: string;
  url?: string;
  julkinenKoosteUrl?: string;
  pdfLkm?: number;
};

export async function archiveFoundation(browser: any, url: string, nimi: string) {
  let page = await browser.newPage();
  await login(page, url)
  await page.goto(url);
  await expect(page.locator('body')).toContainText(nimi);
  await expect(page.locator('body')).toContainText('Lisätoiminnot');
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
  await page.getByRole('button', { name: 'Kyllä' }).click();
  await expect(page.locator('body')).toContainText('arkistoitu', { ignoreCase: true });
  await page.close();
}

export async function archiveCurriculum(browser: any, url: string, nimi: string) {
  let page = await browser.newPage();
  await login(page, url)
  await page.goto(url);
  await expect(page.locator('body')).toContainText('Lisätoiminnot');
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Arkistoi' }).click();
  await page.getByRole('button', { name: 'Kyllä' }).click();
  await expect(page.locator('body')).toContainText('arkistoitu', { ignoreCase: true });
  await page.close();
}
