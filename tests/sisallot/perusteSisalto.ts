import { expect, Page } from "@playwright/test";
import { login, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { TestData } from "../perusteJaPaikalliset.spec";
import test from "node:test";

export async function perusteenTekstikappale(page: Page) {
  await page.getByRole('button', { name: 'Uusi tekstikappale' }).first().click();
  await page.locator('.modal-content').getByRole('textbox').fill('tekstikappale 1');
  await page.getByRole('button', { name: 'Lisää tekstikappale' }).click();
  await waitSmall(page);
  await expect(page.locator('body')).toContainText('tekstikappale 1');
}

export async function perusteenLuontiJaTestit(
  testData: TestData,
  perusteSisallot: (testData: TestData) => Promise<void>,
  julkinenPerusteTarkistukset: (testData: TestData) => Promise<void>,
  perusteprojektiUrlCallBack: (url: string) => void,
  lisaTarkistukset?: (testData: TestData) => Promise<void>,
) {

  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;
  let perusteDiaari = testData.perusteDiaari!;
  let koulutustyyppi = testData.koulutustyyppi;

  await login(page, DEFAULT_VALUES.basePerusteetUrl)
  await page.goto(DEFAULT_VALUES.uusiPerusteUrl);
  await page.getByText('Seuraava').click();
  await page.getByPlaceholder('Kirjoita projektin nimi').fill(projektiNimi);
  await page.locator('.multiselect').first().click();
  await page.getByText(koulutustyyppi, { exact: true }).click();
  await page.getByText('Seuraava').click();
  await page.getByText('Seuraava').click();
  await page.getByRole('button', { name: 'Luo perusteprojekti' }).click();
  await expect(page.locator('h1').locator('span').first()).toHaveText(projektiNimi);
  const perusteProjektiUrl = page.url();
  testData.url = perusteProjektiUrl;
  perusteprojektiUrlCallBack(perusteProjektiUrl);

  await page.goto(perusteProjektiUrl);
  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').click();
  await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').fill(projektiNimi);
  await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').click();
  await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').fill(perusteDiaari);
  await page.getByRole('group', { name: 'Määräyksen päätöspäivämäärä' }).click();
  await page.getByRole('button', { name: '2' }).first().click();
  // Alku ja loppupäivä samassa groupissa, joten pitää kaivaa syvemmältä, jotta voi asettaa päivämäärän
  await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
  await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '2' }).first().click();
  await page.locator('li').filter({ hasText: 'Liitteet ja määräykset' }).click();

  if (await page.locator('.ProseMirror').count() > 1) {
    await page.locator('.ProseMirror').nth(2).fill("Kuvausteksti");
  }
  else {
    await page.locator('.ProseMirror').fill("Kuvausteksti");
  }
  await page.setInputFiles('input[type="file"]', './files/testpdf.pdf');
  // odotetaan, että pdf ladataan selaimeen
  await waitMedium(page);
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('body')).toContainText('Tallennus onnistui');

  await perusteSisallot(testData);

  await page.goto(perusteProjektiUrl);
  await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
  await page.hover('.ep-valid-popover')
  await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
  await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
  await page.getByRole('button', { name: 'Julkaise' }).click();
  await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
  await expect(page.locator('.julkaisu')).toContainText('Uusin versio');

  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Luo PDF' }).click();

  await expect(async () => {
    await expect(page.locator('.sisalto')).toContainText('Julkaistu', { timeout: 3_000 })
  }).toPass({ timeout: 300_000 });

  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(0).click();
  await expect(page.locator('.sisalto')).toContainText('Työversio');

  await lisaTarkistukset?.(testData);

  await page.goto(DEFAULT_VALUES.julkinenMaarayksetUrl);
  await waitSmall(page);
  await page.getByLabel('Hae määräyksiä').fill(projektiNimi);
  await waitSmall(page);
  await expect(page.locator('.maarays')).toHaveCount(1);
  await page.getByRole('link', { name: projektiNimi }).click();
  await expect(page.locator('.url')).toContainText('Avaa määräys');

  await julkinenPerusteTarkistukset(testData);
}
