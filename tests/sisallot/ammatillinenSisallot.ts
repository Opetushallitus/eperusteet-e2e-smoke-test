import { expect, Page } from "@playwright/test";
import { saveAndCheck, waitSmall } from "../../utils/commonmethods";
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
  await saveAndCheck(page);

  await page.getByRole('link', { name: 'Tutkinnon osat' }).click();
  await page.getByRole('link', { name: 'Testiosa' }).click();
  await expect(page.locator('body')).toContainText('Tutkinnon osan nimi');
  await page.getByRole('button', { name: 'Sisällön kieli' }).click();
  await page.getByRole('menuitem', { name: 'Svenska' }).click();
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await waitSmall(page);
  await page.getByRole('group', { name: 'Tutkinnon osan nimi' }).getByRole('textbox').fill('Testiosa sv');
  await saveAndCheck(page);
  await page.getByRole('button', { name: 'Sisällön kieli' }).click();
  await page.getByRole('menuitem', { name: 'Suomi' }).click();
  await page.getByRole('link', { name: 'Tutkinnon muodostuminen' }).click();
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
  await expect(page.locator('.sisalto')).toContainText('Julkaistu');
  // Työversio
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(0).click();
  await expect(page.locator('.sisalto')).toContainText('Työversio');
  // KV-liite
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(1).click();
  await expect(page.locator('.sisalto')).toContainText('kvliite.pdf');
}

export async function ammatillinenPerusteJulkinenTarkastukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await page.goto(DEFAULT_VALUES.julkinenAmmatillinenUrl);
  await page.getByLabel('Tutkinnon peruste tai tutkinnon osa', { exact: true }).fill(projektiNimi);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await page.getByRole('link', { name: 'Voimaantulo:' }).click();
  await expect(page.locator('.content')).toContainText(projektiNimi);

}

export async function ammatillinenToteutussuunnitelmaJulkinenTarkastukset(testData: TestData) {

}
