import { expect } from "@playwright/test";
import { TestData } from "../utils/testUtils";
import { login, saveAndCheck, startEditMode, waitMedium, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { perusteenTekstikappale, PERUSTE_SMOKE } from "./perusteSisalto";

const LUKUTAITO_PAIKALLINEN_TARKENNUS = 'tekstikappale paikallinen tarkennus';

export async function lukutaitoPerusteSisallot(testData: TestData) {
  await perusteenTekstikappale(testData.page);
}

export async function lukutaitoPerusteJulkisetTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

  await page.goto(DEFAULT_VALUES.julkinenKotoKoosteUrlUrl);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await expect(page.locator('h1')).toContainText(projektiNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: PERUSTE_PDF_LINKKI }), [
    projektiNimi,
    PERUSTE_SMOKE.tekstikappaleNimi,
    PERUSTE_SMOKE.tekstikappaleTeksti,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content')).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);
}

export async function createLukutaitoOpetussuunnitelma(testData: TestData){
  let page = testData.page;

  await login(page, DEFAULT_VALUES.loginKotoutuminen);
  await waitMedium(page);

  await page.goto(DEFAULT_VALUES.kotoOpsUrl);
  await page.getByText('Luo uusi').click();
  await page.getByText('Perusteprojektia').click();
  await page.locator('.multiselect').last().click();
  await expect(page.locator('.multiselect').last()).toContainText(testData.projektiNimi!);
  await page.getByText(testData.projektiNimi!).click();

  await page.getByRole('textbox').last().fill(testData.opsNimi!);
  await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
}

export async function lukutaitoOpetussuunnitelmaSisallot(testData: TestData) {
  let page = testData.page;

  await expect(page.locator('.navigation')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.editointikontrolli')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator('.editointikontrolli')).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await startEditMode(page);

  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').fill(LUKUTAITO_PAIKALLINEN_TARKENNUS);

  await saveAndCheck(page);
}

export async function lukutaitoOpetussuunnitelmaJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  let opsNimi = testData.opsNimi!;

  await page.goto(DEFAULT_VALUES.julkinenKotoKoosteUrlUrl);
  await waitMedium(page);

  await page.getByLabel('Hae opetussuunnitelmaa', { exact: true }).fill(opsNimi);
  await expect(page.locator('.opetussuunnitelma-container')).toContainText(opsNimi);
  await page.getByRole('link', { name: opsNimi }).click();
  await expect(page.locator('h1')).toContainText(opsNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    opsNimi,
    PERUSTE_SMOKE.tekstikappaleNimi,
    PERUSTE_SMOKE.tekstikappaleTeksti,
    LUKUTAITO_PAIKALLINEN_TARKENNUS,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);
  await expect(page.locator('.content').last()).toContainText(LUKUTAITO_PAIKALLINEN_TARKENNUS);
}
