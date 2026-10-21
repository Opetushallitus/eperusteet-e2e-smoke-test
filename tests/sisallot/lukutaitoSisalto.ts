import { expect, Locator, Page } from "@playwright/test";
import { TestData } from "../utils/testUtils";
import { login, saveAndCheck, startEditMode, waitMedium, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { perusteenTekstikappale, PERUSTE_SMOKE } from "./perusteSisalto";

const LUKUTAITO_PAIKALLINEN_TARKENNUS = 'tekstikappale paikallinen tarkennus';

const LUKUTAITO_TAVOITTEET = {
  nimi: 'lukutaito tavoite ja sisältöalue',
  tavoitealueOtsikko: 'tavoite 1',
  tavoite1: 'opiskella',
  tavoite2: 'ajatella',
  paikallinenTarkennus: 'tavoitteiden paikallinen tarkennus',
} as const;

const LUKUTAITO_TAVOITTEET_TEKSTIT = [
  LUKUTAITO_TAVOITTEET.nimi,
  LUKUTAITO_TAVOITTEET.tavoitealueOtsikko,
  'Opiskelija osaa',
  LUKUTAITO_TAVOITTEET.tavoite1,
  LUKUTAITO_TAVOITTEET.tavoite2,
] as const;

async function tarkistaTavoitteet(kohde: Locator) {
  for (const teksti of LUKUTAITO_TAVOITTEET_TEKSTIT) {
    await expect(kohde).toContainText(teksti);
  }
}

async function lisaaTavoitteetJaSisaltoalueet(page: Page) {
  await page.getByRole('button', { name: 'Tavoitteet ja sisältöalueet', exact: true }).click();
  const dialogi = page.locator('.ep-modal');
  await expect(dialogi).toBeVisible();
  await dialogi.getByRole('button', { name: 'Lisää tavoite ja sisältöalue' }).click();
  await expect(dialogi).not.toBeVisible();
  await page.waitForURL(/lukutaitokoulutus_tavoitteetjasisaltoalueet\/\d+/);
  await expect(page.getByRole('heading', { name: 'Nimetön tavoite ja sisältöalue', exact: true })).toBeVisible();

  await startEditMode(page);
  await page.getByRole('button', { name: 'Lisää tavoitealue', exact: true }).click();
  const lisaaTavoite = page.getByRole('button', { name: 'Lisää tavoite', exact: true });
  await lisaaTavoite.click();
  await lisaaTavoite.click();

  const tavoitealue = page.locator('.tavoitealue');
  await expect(tavoitealue.getByRole('textbox')).toHaveCount(3);
  await page.locator('.ep-form-group').filter({ hasText: 'Nimi' }).getByRole('textbox').fill(LUKUTAITO_TAVOITTEET.nimi);
  await tavoitealue.getByRole('textbox').nth(0).fill(LUKUTAITO_TAVOITTEET.tavoitealueOtsikko);
  await tavoitealue.getByRole('textbox').nth(1).fill(LUKUTAITO_TAVOITTEET.tavoite1);
  await tavoitealue.getByRole('textbox').nth(2).fill(LUKUTAITO_TAVOITTEET.tavoite2);

  await saveAndCheck(page);
  await tarkistaTavoitteet(page.locator('.editointi-container'));
}

export async function lukutaitoPerusteSisallot(testData: TestData) {
  await perusteenTekstikappale(testData.page);
  await lisaaTavoitteetJaSisaltoalueet(testData.page);
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
    ...LUKUTAITO_TAVOITTEET_TEKSTIT,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content')).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await expect(page.locator('.navigation-tree')).toContainText(LUKUTAITO_TAVOITTEET.nimi);
  await page.locator('.navigation-tree').getByText(LUKUTAITO_TAVOITTEET.nimi).click();
  await tarkistaTavoitteet(page.locator('.content'));
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

  await expect(page.locator('.navigation')).toContainText(LUKUTAITO_TAVOITTEET.nimi);
  await page.locator('.navigation').getByText(LUKUTAITO_TAVOITTEET.nimi, { exact: true }).click();
  await tarkistaTavoitteet(page.locator('.editointikontrolli'));
  await expect(page.locator('.editointikontrolli input')).toHaveCount(0);

  await startEditMode(page);
  await expect(page.locator('.editointikontrolli input')).toHaveCount(0);
  const paikallinenTarkennus = page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror');
  await expect(paikallinenTarkennus).toHaveCount(1);
  await expect(paikallinenTarkennus).not.toContainText(LUKUTAITO_TAVOITTEET.tavoitealueOtsikko);
  await expect(paikallinenTarkennus).not.toContainText(LUKUTAITO_TAVOITTEET.tavoite1);
  await expect(paikallinenTarkennus).not.toContainText(LUKUTAITO_TAVOITTEET.tavoite2);
  await paikallinenTarkennus.fill(LUKUTAITO_TAVOITTEET.paikallinenTarkennus);

  await saveAndCheck(page);
  await expect(page.locator('.editointikontrolli')).toContainText(LUKUTAITO_TAVOITTEET.paikallinenTarkennus);
  await tarkistaTavoitteet(page.locator('.editointikontrolli'));
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
    ...LUKUTAITO_TAVOITTEET_TEKSTIT,
    LUKUTAITO_TAVOITTEET.paikallinenTarkennus,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);
  await expect(page.locator('.content').last()).toContainText(LUKUTAITO_PAIKALLINEN_TARKENNUS);

  await expect(page.locator('.navigation-tree')).toContainText(LUKUTAITO_TAVOITTEET.nimi);
  await page.locator('.navigation-tree').getByText(LUKUTAITO_TAVOITTEET.nimi).click();
  await tarkistaTavoitteet(page.locator('.content').last());
  await expect(page.locator('.content').last()).toContainText(LUKUTAITO_TAVOITTEET.paikallinenTarkennus);
}
