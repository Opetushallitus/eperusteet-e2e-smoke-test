import { expect } from "@playwright/test";
import { createNimi, login, waitLong, waitMedium } from "../../utils/commonmethods";
import { TestData } from "../perusteJaPaikalliset.spec";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

export async function toteutussuunnitelmaLuontiJaTestit(
  testData: TestData,
  opsLuonti: (testData: TestData) => Promise<void>,
  opsSisallot: (testData: TestData) => Promise<void>,
  julkinenOpsTarkistukset: (testData: TestData) => Promise<void>,
  opetussuunnitelmaUrlCallBack: (url: string) => void,
) {

  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await login(page, DEFAULT_VALUES.loginAmmatillinenUrl);
  await waitMedium(page);
  await page.goto(DEFAULT_VALUES.totsuUrl);
  await expect(page.locator('body')).toContainText('Nimi tai koulutuskoodi');
  await page.getByRole('button', { name: 'Lisää toteutussuunnitelma' }).click();
  await page.getByText('Tutkinnon perustetta').click();
  await page.getByRole('combobox').locator('div').filter({ hasText: 'Valitse perusteprojekti', }).click();
  await page.getByText(projektiNimi).first().click();
  await page.getByRole('group', { name: 'Toteutussuunnitelman nimi *' }).getByRole('textbox').fill(testData.opsNimi);
  await page.getByRole('button', { name: 'Luo toteutussuunnitelma' }).click();
  await expect(page.locator('body')).toContainText('Tiedotteet');
  const totsuUrl = page.url();
  opetussuunnitelmaUrlCallBack(page.url());

  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Toteutussuunnitelman tiedot' }).click();
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('group', { name: 'Päätösnumero' }).getByRole('textbox').fill('1');
  await page.getByRole('group', { name: 'Päätöspäivämäärä' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
  await page.getByRole('button', { name: '1' }).first().click();
  await page.getByRole('group', { name: 'Hyväksyjä' }).getByRole('textbox').fill('Tester');
  await page.getByLabel('Suomi', { exact: true }).check({ force: true });
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('body')).toContainText('Tallennus onnistui');

  await page.goto(totsuUrl);
  await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
  await page.hover('.ep-valid-popover')
  await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
  await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
  await page.getByRole('button', { name: 'Julkaise' }).click();
  await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
  await waitLong(page);
  await page.reload();
  await expect(page.locator('.julkaistu')).toContainText('Julkaistu versio');

  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
  await expect(page.locator('.pdf-box').nth(0)).toContainText('Julkaistu', { timeout: 600_000 });
  await expect(page.locator('.pdf-box').nth(1)).toContainText('Työversio', { timeout: 600_000 });

  await page.goto(DEFAULT_VALUES.julkinenAmmatillinenUrl);
  await waitMedium(page);
  await page.getByLabel('Tutkinnon peruste tai tutkinnon osa', { exact: true }).fill(projektiNimi);
  await waitMedium(page);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await expect(page.locator('body')).toContainText(testData.opsNimi);
  await page.getByRole('link', { name: testData.opsNimi }).click();
  await expect(page.locator('.content')).toContainText(testData.opsNimi);
}
