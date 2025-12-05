import { expect, Page } from "@playwright/test";
import { login, saveAndCheck, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { TestData } from '../perusteJaPaikalliset.spec';

export async function ammatillinenPerusteSisallot(testData: TestData) {
  await perusteenTiedot(testData);
  await perusteenSisallot(testData);
}

async function perusteenTiedot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.goto(url!);
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('button', { name: 'Lisää koulutuskoodi' }).click();
  await page.getByText('Agrologi', { exact: true }).first().click();
  await saveAndCheck(page);
}

async function perusteenSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.getByRole('link', { name: 'Tutkinnon osat' }).click();
  await page.getByRole('button', { name: 'Lisää tutkinnon osa' }).click();
  await waitSmall(page);
  // Koodistosta haun listaus ei jostain syystä renderöidy testissä, joten lisätään manuaalisesti
  await page.getByRole('group', { name: 'Tutkinnon osan nimi' }).getByRole('textbox').fill('Testiosa');
  await page.locator('input[type="number"]').fill('10');
  await page.getByRole('button', { name: 'Sisällön kieli' }).click();
  await page.getByRole('menuitem', { name: 'Svenska' }).click();
  await page.getByRole('group', { name: 'Tutkinnon osan nimi' }).getByRole('textbox').fill('Testiosa sv');
  await page.getByRole('button', { name: 'Sisällön kieli' }).click();
  await page.getByRole('menuitem', { name: 'Suomi' }).click();
  await saveAndCheck(page);
  await waitSmall(page);
  await page.goto(url + 'rakenne');
  await expect(page.locator('body')).toContainText('Tutkinnon rakenteen kuvaus');
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('button', { name: 'Lisää ryhmä rakenteeseen' }).click();
  await page.getByLabel('Valinnaiset tutkinnon osat', { exact: true }).check({ force: true });
  await page.getByLabel('Pakolliset tutkinnon osat', { exact: true }).check({ force: true });
  await page.locator('input[type="number"]').fill('10');
  await page.locator('.modal-footer').getByRole('button', { name: 'Tallenna' }).click();
  await page.getByRole('button', { name: 'Muokkaa ryhmää', includeHidden: true }).click();
  await page.getByRole('button', { name: 'Liitä tutkinnon osa' }).click();
  await page.getByRole('cell', { name: 'Testiosa' }).first().click();
  await page.getByRole('button', { name: 'Liitä valitut tutkinnon osat' }).click();
  await expect(page.locator('.sisalto')).toContainText('Testiosa');

  await waitSmall(page);
  await saveAndCheck(page);
}

export async function ammatillinenLisaTarkistukset(testData: TestData) {
  let page = testData.page;
  let url = testData.url!;

  await page.goto(url);
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
  // KV-liite
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(1).click();
  await expect(page.locator('.sisalto')).toContainText('kvliite.pdf');
}

export async function ammatillinenPerusteJulkinenTarkastukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

  await page.goto(DEFAULT_VALUES.julkinenAmmatillinenUrl);
  await page.getByLabel('Tutkinnon peruste tai tutkinnon osa', { exact: true }).fill(projektiNimi);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await page.getByRole('link', { name: 'Voimaantulo:' }).click();
  await expect(page.locator('.content')).toContainText(projektiNimi);

}

export async function ammatillinenToteutussuunnitelmaJulkinenTarkastukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

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

export async function createToteutussuunnitelma(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

  await login(page, DEFAULT_VALUES.loginAmmatillinenUrl);
  await waitMedium(page);
  await page.goto(DEFAULT_VALUES.totsuUrl);
  await expect(page.locator('body')).toContainText('Nimi tai koulutuskoodi');
  await page.getByRole('button', { name: 'Lisää toteutussuunnitelma' }).click();
  await page.getByText('Tutkinnon perustetta').click();
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').locator('input').fill(projektiNimi);
  await page.getByText(projektiNimi).first().click();
  await page.getByRole('group', { name: 'Toteutussuunnitelman nimi *' }).getByRole('textbox').fill(testData.opsNimi);
  await page.getByRole('button', { name: 'Luo toteutussuunnitelma' }).click();
}
