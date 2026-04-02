import { expect } from "@playwright/test";
import { avaaLisatoiminto, createNimi, julkaise, login, luoPDF, saveAndCheck, startEditMode, valitsePaiva, waitLong, waitMedium, waitSmall } from "../../utils/commonmethods";
import { TestData } from "../utils/testUtils";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

export async function amosaaOpetussuunnitelmaLuonti(
  testData: TestData,
  julkinenOpsTarkistukset: (testData: TestData) => Promise<void>,
  opetussuunnitelmaUrlCallBack: (url: string) => void,
  opsLuonti?: (testData: TestData) => Promise<void>,
  opsSisallot?: (testData: TestData) => Promise<void>,
  opsPohjaLuonti?: (testData: TestData) => Promise<void>,
) {

  let page = testData.page;

  if (opsPohjaLuonti) {
    await opsPohjaLuonti(testData);
    await expect(page.locator('body')).toContainText('Yleisnäkymä');
    opetussuunnitelmaUrlCallBack(page.url());
  }

  await opsLuonti?.(testData);
  await expect(page.locator('body')).toContainText('Yleisnäkymä');
  const totsuUrl = page.url();
  opetussuunnitelmaUrlCallBack(page.url());

  await opsSisallot?.(testData);

  // await page.getByText('Lisätoiminnot').click();
  // await page.getByRole('menuitem').first().click();
  await avaaLisatoiminto(page, 'tiedot');
  await startEditMode(page);
  await valitsePaiva(page, 'Päätöspäivämäärä', '1');
  await valitsePaiva(page, 'Voimassaolo alkaa', '1');
  await page.locator('.ep-form-group').filter({ hasText: 'Päätösnumero' }).getByRole('textbox').fill('1');
  await page.locator('.ep-form-group').filter({ hasText: 'Hyväksyjä' }).getByRole('textbox').fill('Tester');
  await page.getByLabel('Suomi', { exact: true }).check({ force: true });
  await saveAndCheck(page);

  await page.goto(totsuUrl);
  await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
  await page.locator('button').filter({ hasText: 'Siirry julkaisunäkymään' }).click();
  await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
  
  await julkaise(page, 'Julkaistu versio');
  await avaaLisatoiminto(page, 'Luo PDF');
  await luoPDF(page);
  await julkinenOpsTarkistukset(testData);
}
