import { expect, Page } from "@playwright/test";
import { avaaLisatoiminto, julkaise, login, luoPDF, startEditMode, valitsePaiva, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { TestData } from "../utils/testUtils";

export async function perusteenTekstikappale(page: Page) {
  await page.getByRole('button', { name: 'Uusi tekstikappale' }).first().click();
  await page.locator('.p-dialog-content').getByRole('textbox').fill('tekstikappale 1');
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
  const perusteProjektiUrl = page.url() + (page.url().endsWith('/') ? '' : '/');
  testData.url = perusteProjektiUrl;
  perusteprojektiUrlCallBack(perusteProjektiUrl);

  await page.goto(perusteProjektiUrl);
  await page.getByText('Lisätoiminnot').click();
  await page.locator('.ep-dropdown-item').filter({ hasText: 'Perusteen tiedot' }).click();
  await startEditMode(page);
  await page.locator('.ep-form-group').filter({ hasText: 'Perusteen nimi*' }).getByRole('textbox').click();
  await page.locator('.ep-form-group').filter({ hasText: 'Perusteen nimi*' }).getByRole('textbox').fill(projektiNimi);
  await page.locator('.ep-form-group').filter({ hasText: 'Diaarinumero' }).getByRole('textbox').click();
  await page.locator('.ep-form-group').filter({ hasText: 'Diaarinumero' }).getByRole('textbox').fill(perusteDiaari);
  await valitsePaiva(page, 'Voimassaolo', '1');
  await valitsePaiva(page, 'Määräyksen päätöspäivämäärä', '1');

  await page.locator('.p-tab').filter({ hasText: 'Liitteet ja määräykset' }).click();

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
  await page.locator('button').filter({ hasText: 'Siirry julkaisunäkymään' }).click();
  await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');

  await expect.poll(async () => {
    return page.getByRole('button', { name: 'Julkaise' });
  }).toBeTruthy();

  await julkaise(page, 'Uusin versio');

  await avaaLisatoiminto(page, 'Luo PDF');
  await luoPDF(page, testData.pdfLkm);
  await lisaTarkistukset?.(testData);

  await page.goto(DEFAULT_VALUES.julkinenMaarayksetUrl);
  await waitSmall(page);
  await page.getByLabel('Hae määräyksiä').fill(projektiNimi);

  await expect.poll(async () => {
    return page.locator('.ep-maarayskokoelma-maarays').count();
  }).toBe(1);

  await page.locator('.ep-maarayskokoelma-maarays').click();
  await expect(page.getByRole('link', { name: 'Avaa määräys picture_as_pdf' })).toBeVisible();

  await julkinenPerusteTarkistukset(testData);
}
