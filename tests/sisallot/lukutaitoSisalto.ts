import { expect, Locator, Page } from "@playwright/test";
import { TestData } from "../utils/testUtils";
import { login, saveAndCheck, startEditMode, waitMedium, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { perusteenTekstikappale, PERUSTE_SMOKE } from "./perusteSisalto";

const LUKUTAITO_PAIKALLINEN_TARKENNUS = 'tekstikappale paikallinen tarkennus';

const LUKUTAITO_TAVOITESISALTOALUE = {
  otsikko: 'Monilukutaito',
  teksti: 'monilukutaitoteksti',
  tavoitealueenOtsikko: 'Numeeriset taidot',
  tavoite: 'tavoite1',
  keskeinenSisaltoalue: 'keskeinensisältöalue',
  paikallinenTarkennus: 'tavoitesisältöalue paikallinen tarkennus',
} as const;

const LUKUTAITO_TAVOITESISALTOALUE_TEKSTIT = [
  LUKUTAITO_TAVOITESISALTOALUE.otsikko,
  LUKUTAITO_TAVOITESISALTOALUE.teksti,
  LUKUTAITO_TAVOITESISALTOALUE.tavoitealueenOtsikko,
  LUKUTAITO_TAVOITESISALTOALUE.tavoite,
  LUKUTAITO_TAVOITESISALTOALUE.keskeinenSisaltoalue,
];

async function valitseKoodistosta(page: Page, hakuNappi: Locator, koodi: string) {
  await hakuNappi.click();
  await expect(page.locator('.ep-modal')).toBeVisible();
  await page.locator('.ep-modal').getByRole('searchbox').fill(koodi);
  await expect(page.locator('.ep-modal')).toContainText(koodi);
  await page.locator('.ep-modal').getByText(koodi, { exact: true }).first().click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();
}

async function tarkistaTavoitesisaltoalueenSisallot(sisalto: Locator) {
  for (const teksti of LUKUTAITO_TAVOITESISALTOALUE_TEKSTIT) {
    await expect(sisalto).toContainText(teksti);
  }
}

export async function lukutaitoPerusteSisallot(testData: TestData) {
  let page = testData.page;

  await perusteenTekstikappale(page);

  await page.goto(testData.url!);
  await page.locator('button').filter({ hasText: 'Tavoitteet ja sisältöalueet' }).first().click();
  await page.locator('button').filter({ hasText: 'Lisää tavoite ja sisältöalue' }).click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();
  await startEditMode(page);

  await valitseKoodistosta(page, page.locator('button').filter({ hasText: 'Hae koodistosta' }).first(), LUKUTAITO_TAVOITESISALTOALUE.otsikko);
  await page.locator('.ProseMirror').first().fill(LUKUTAITO_TAVOITESISALTOALUE.teksti);

  await page.locator('button').filter({ hasText: 'Lisää tavoitealueen otsikko' }).click();
  await valitseKoodistosta(page, page.locator('.tavoitealue button').filter({ hasText: 'Hae koodistosta' }).last(), LUKUTAITO_TAVOITESISALTOALUE.tavoitealueenOtsikko);

  await page.locator('button').filter({ hasText: 'Lisää tavoitteet ja sisältöalueet' }).click();
  await page.locator('.tavoitesisaltoalue button').filter({ hasText: /Lisää tavoite$/ }).click();
  await page.locator('.tavoitesisaltoalue input').first().fill(LUKUTAITO_TAVOITESISALTOALUE.tavoite);

  await page.locator('.tavoitesisaltoalue button').filter({ hasText: 'Lisää keskeinen sisältöalue' }).click();
  await page.locator('.tavoitesisaltoalue input').last().fill(LUKUTAITO_TAVOITESISALTOALUE.keskeinenSisaltoalue);

  await saveAndCheck(page);
  await tarkistaTavoitesisaltoalueenSisallot(page.locator('.editointi-container'));
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
    ...LUKUTAITO_TAVOITESISALTOALUE_TEKSTIT,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content')).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await expect(page.locator('.navigation-tree')).toContainText(LUKUTAITO_TAVOITESISALTOALUE.otsikko);
  await page.locator('.navigation-tree').getByText(LUKUTAITO_TAVOITESISALTOALUE.otsikko).click();
  await tarkistaTavoitesisaltoalueenSisallot(page.locator('.content'));
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

  await expect(page.locator('.navigation')).toContainText(LUKUTAITO_TAVOITESISALTOALUE.otsikko);
  await page.locator('.navigation').getByText(LUKUTAITO_TAVOITESISALTOALUE.otsikko).click();
  await expect(page.locator('.editointikontrolli')).toContainText(LUKUTAITO_TAVOITESISALTOALUE.otsikko);
  await tarkistaTavoitesisaltoalueenSisallot(page.locator('.editointikontrolli'));

  await startEditMode(page);

  await expect(page.locator('.editointikontrolli .tavoitealue input')).toHaveCount(0);
  await expect(page.locator('.editointikontrolli button').filter({ hasText: 'Hae koodistosta' })).toHaveCount(0);
  await expect(page.locator('.editointikontrolli')).toContainText('Tavoitesisältöalueen paikallinen tarkennus');
  await expect(page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror')).toHaveCount(1);
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').fill(LUKUTAITO_TAVOITESISALTOALUE.paikallinenTarkennus);

  await saveAndCheck(page);
  await expect(page.locator('.editointikontrolli')).toContainText(LUKUTAITO_TAVOITESISALTOALUE.paikallinenTarkennus);
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
    ...LUKUTAITO_TAVOITESISALTOALUE_TEKSTIT,
    LUKUTAITO_TAVOITESISALTOALUE.paikallinenTarkennus,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator('.content').last()).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);
  await expect(page.locator('.content').last()).toContainText(LUKUTAITO_PAIKALLINEN_TARKENNUS);

  await expect(page.locator('.navigation-tree')).toContainText(LUKUTAITO_TAVOITESISALTOALUE.otsikko);
  await page.locator('.navigation-tree').getByText(LUKUTAITO_TAVOITESISALTOALUE.otsikko).click();
  await tarkistaTavoitesisaltoalueenSisallot(page.locator('.content').last());
  await expect(page.locator('.content').last()).toContainText(LUKUTAITO_TAVOITESISALTOALUE.paikallinenTarkennus);
}
