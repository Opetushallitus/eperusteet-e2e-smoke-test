import { expect, Page } from "@playwright/test";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { waitMedium } from "../../utils/commonmethods";
import { TestData } from "../perusteJaPaikalliset.spec";

export async function yleissivistavatLisaTarkastukset(testData: TestData) {
  let page = testData.page;

  await page.goto(testData.url!);
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
  await expect(page.locator('.sisalto')).toContainText('Julkaistu', { timeout: 600_000 });
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
  await expect(page.locator('.sisalto')).toContainText('Työversio', { timeout: 600_000 });
}

export async function yleissivistavatJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await page.goto(DEFAULT_VALUES.julkinenKoosteUrlUrl + testData.koulutustyyppi.toLowerCase());
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator('h1')).toContainText(projektiNimi);
}
