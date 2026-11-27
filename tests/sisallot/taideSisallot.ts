import { expect, Page } from "@playwright/test";
import { perusteenTekstikappale } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { saveAndCheck, startEditMode, waitMedium, waitSmall, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";

const TAIDE_SMOKE = {
  taiteenala: 'Alkuvaihe',
  taiteenalaKuvaus: 'alkuvaihe kuvaus',
  taiteenalaTeksti: 'alkuvaiheteksti 1',
  taiteenalaTekstiKuvaus: 'alkuvaiheteksti 1 kuvaus',
  vaiheLaajuus: '300',
  vaiheLaajuusLyhenne: '300 t',
  vaiheKuvaus: 'vaihe kuvaus',
  tavoitealue: 'vaihe tavoitealue 1',
  tavoitteidenJohdanto: 'vaihe tavoitteiden johdanto',
  tavoite: 'vaihe tavoite 1',
  vaiheTeksti: 'vaiheteksti 1',
  vaiheTekstiKuvaus: 'vaiheteksti 1 kuvaus',
  taiteenalaTarkennus: 'alkuvaihe paikallinen tarkennus',
  vaiheTarkennus: 'vaiheteksti paikallinen tarkennus',
  opintokokonaisuusNimi: 'opintokokonaisuus 1',
  opintokokonaisuusLaajuus: '50',
  opintokokonaisuusKuvaus: 'opintokokonaisuus kuvaus',
  opintokokonaisuusArviointi: 'opintokokonaisuus osaamisen arviointi',
} as const;

// Vaiheen nimi valitaan tpovaihe-koodiston ensimmäisestä rivistä, joten se luetaan talteen ajon aikana.
let vaiheNimi = '';

function muokattavatEditorit(page: Page) {
  return page.locator('.editointikontrolli .ProseMirror[contenteditable="true"]');
}

export async function taideSisallot(testData: TestData) {
  let page = testData.page;
  await perusteenTekstikappale(page);

  await page.locator('button').filter({ hasText: 'Uusi taiteenala' }).first().click();
  await expect(page.locator('button').filter({ hasText: 'Hae koodistosta' })).toBeVisible();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.ep-modal')).toBeVisible();
  await expect(page.locator('.ep-modal')).toContainText(TAIDE_SMOKE.taiteenala);
  await page.locator('.ep-modal').getByText(TAIDE_SMOKE.taiteenala).click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();

  await page.locator('.ProseMirror').nth(0).fill(TAIDE_SMOKE.taiteenalaKuvaus);

  await page.locator('button').filter({ hasText: 'Lisää tekstikappale' }).click();
  await expect(page.locator('.ProseMirror')).toHaveCount(2);
  await page.locator('input[type="text"]').last().fill(TAIDE_SMOKE.taiteenalaTeksti);
  await page.locator('.ProseMirror').last().fill(TAIDE_SMOKE.taiteenalaTekstiKuvaus);
  await saveAndCheck(page);

  await taiteenalanVaihe(page);
}

async function taiteenalanVaihe(page: Page) {
  await page.locator('button').filter({ hasText: 'Lisää vaihe' }).first().click();
  await expect(page.locator('h2').filter({ hasText: 'Nimetön vaihe' })).toBeVisible();
  await expect(page.locator('button').filter({ hasText: 'Tallenna' })).toBeVisible();

  // Vaiheen nimi koodistosta
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).first().click();
  await expect(page.locator('.ep-modal')).toBeVisible();
  const ensimmainenKoodi = page.locator('.ep-modal span.link-style.clickable').first();
  await expect(ensimmainenKoodi).toBeVisible();
  vaiheNimi = (await ensimmainenKoodi.textContent())?.trim() ?? '';
  expect(vaiheNimi).not.toEqual('');
  await ensimmainenKoodi.click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();
  await expect(page.locator('h2').filter({ hasText: vaiheNimi })).toBeVisible();

  // Laajuus ja yksikkö
  const laajuusGroup = page.locator('.ep-form-group').filter({ has: page.locator('label', { hasText: 'Laajuus' }) }).first();
  await laajuusGroup.locator('input').first().fill(TAIDE_SMOKE.vaiheLaajuus);
  await laajuusGroup.locator('.multiselect').click();
  await page.getByText('tuntia', { exact: true }).click();

  await page.locator('.ProseMirror').nth(0).fill(TAIDE_SMOKE.vaiheKuvaus);

  // Tavoitealue omalla otsikolla, johdannolla ja tavoitteella
  await page.locator('button').filter({ hasText: 'Lisää tavoitealue' }).click();
  const tavoitealue = page.locator('.tavoitesisaltoalue').last();
  await expect(tavoitealue).toBeVisible();
  await tavoitealue.locator('input[type="text"]').nth(0).fill(TAIDE_SMOKE.tavoitealue);
  await tavoitealue.locator('input[type="text"]').nth(1).fill(TAIDE_SMOKE.tavoitteidenJohdanto);
  await tavoitealue.locator('button').filter({ hasText: /Lisää tavoite$/ }).click();
  await tavoitealue.locator('input[type="text"]').last().fill(TAIDE_SMOKE.tavoite);

  // Vapaa tekstikappale
  await page.locator('button').filter({ hasText: 'Lisää tekstikappale' }).click();
  await expect(page.locator('.ProseMirror')).toHaveCount(2);
  await page.locator('input[type="text"]').last().fill(TAIDE_SMOKE.vaiheTeksti);
  await page.locator('.ProseMirror').last().fill(TAIDE_SMOKE.vaiheTekstiKuvaus);

  await saveAndCheck(page);
  await expect(page.locator('.navigation')).toContainText(vaiheNimi);
}

export async function taideJulkinenPerusteTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await page.goto(DEFAULT_VALUES.julkinenTaideKoosteUrlUrl);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator('h1')).toContainText(projektiNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: PERUSTE_PDF_LINKKI }), [
    projektiNimi!,
    'tekstikappale 1',
    TAIDE_SMOKE.taiteenala,
    TAIDE_SMOKE.taiteenalaKuvaus,
    TAIDE_SMOKE.taiteenalaTeksti,
    TAIDE_SMOKE.taiteenalaTekstiKuvaus,
    `${vaiheNimi}, ${TAIDE_SMOKE.vaiheLaajuusLyhenne}`,
    TAIDE_SMOKE.vaiheKuvaus,
    'Tavoitealueet',
    TAIDE_SMOKE.tavoitealue,
    TAIDE_SMOKE.tavoitteidenJohdanto,
    TAIDE_SMOKE.tavoite,
    TAIDE_SMOKE.vaiheTeksti,
    TAIDE_SMOKE.vaiheTekstiKuvaus,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText(TAIDE_SMOKE.taiteenala);
  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');

  // TPO2026: taiteenalan vapaat tekstit näytetään taiteenalan sivulla, ei alasivuina
  await page.locator('.navigation-tree').getByText(TAIDE_SMOKE.taiteenala).click();
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.taiteenalaKuvaus);
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.taiteenalaTeksti);
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.taiteenalaTekstiKuvaus);

  await expect(page.locator('.navigation-tree')).toContainText(vaiheNimi);
  await page.locator('.navigation-tree').getByText(vaiheNimi, { exact: true }).click();
  const content = page.locator('.content');
  await expect(content.locator('h2')).toContainText(vaiheNimi);
  await expect(content).toContainText('Laajuus');
  await expect(content).toContainText(TAIDE_SMOKE.vaiheLaajuusLyhenne);
  await expect(content).toContainText(TAIDE_SMOKE.vaiheKuvaus);
  await expect(content).toContainText('Tavoitteet ja keskeiset sisältöalueet');
  await expect(content).toContainText(TAIDE_SMOKE.tavoitealue);
  await expect(content).toContainText(TAIDE_SMOKE.tavoitteidenJohdanto);
  await expect(content).toContainText(TAIDE_SMOKE.tavoite);
  await expect(content).toContainText(TAIDE_SMOKE.vaiheTeksti);
  await expect(content).toContainText(TAIDE_SMOKE.vaiheTekstiKuvaus);
}

export async function taideOpsLuonti(testData: TestData) {
  let page = testData.page;
  const taiteenalat = page.locator('.ep-toggle-group');
  await expect(taiteenalat).toContainText(TAIDE_SMOKE.taiteenala);
  await taiteenalat.getByText(TAIDE_SMOKE.taiteenala).click();
}

export async function taideOpsSisallot(testData: TestData) {
  let page = testData.page;

  // Taiteenalan paikallinen tarkennus
  await expect(page.locator('.navigation')).toContainText(TAIDE_SMOKE.taiteenala);
  await page.locator('.navigation').getByText(TAIDE_SMOKE.taiteenala, { exact: true }).click();
  await waitSmall(page);
  await startEditMode(page);
  await expect(muokattavatEditorit(page)).toHaveCount(1);
  await muokattavatEditorit(page).first().fill(TAIDE_SMOKE.taiteenalaTarkennus);
  await saveAndCheck(page);
  await expect(page.locator('.content, .editointi-container').first()).toContainText(vaiheNimi);

  // Vaiheen vapaan tekstin paikallinen tarkennus
  await expect(page.locator('.navigation')).toContainText(vaiheNimi);
  await page.locator('.navigation').getByText(vaiheNimi, { exact: true }).click();
  await waitSmall(page);
  await expect(page.locator('.editointi-container')).toContainText(TAIDE_SMOKE.vaiheKuvaus);
  await expect(page.locator('.editointi-container')).toContainText(TAIDE_SMOKE.tavoitealue);
  await startEditMode(page);
  await muokattavatEditorit(page).last().fill(TAIDE_SMOKE.vaiheTarkennus);
  await saveAndCheck(page);

  // Opintokokonaisuus
  await page.locator('button').filter({ hasText: 'Lisää opintokokonaisuus' }).first().click();
  await expect(page.locator('button').filter({ hasText: 'Tallenna' })).toBeVisible();
  const nimiGroup = page.locator('.form-content').filter({ hasText: 'Opintokokonaisuuden nimi' }).first();
  await nimiGroup.locator('input').first().fill(TAIDE_SMOKE.opintokokonaisuusNimi);
  const okLaajuusGroup = page.locator('.form-content').filter({ hasText: 'Laajuus' }).first();
  await okLaajuusGroup.locator('input').first().fill(TAIDE_SMOKE.opintokokonaisuusLaajuus);
  await muokattavatEditorit(page).nth(0).fill(TAIDE_SMOKE.opintokokonaisuusKuvaus);
  await page.locator('label.valinta-rivi').filter({ hasText: TAIDE_SMOKE.tavoitealue }).locator('input[type="checkbox"]').check();
  await expect(page.locator('label.valinta-rivi').filter({ hasText: TAIDE_SMOKE.tavoite }).locator('input[type="checkbox"]')).toBeChecked();
  await muokattavatEditorit(page).nth(1).fill(TAIDE_SMOKE.opintokokonaisuusArviointi);
  await saveAndCheck(page);

  await expect(page.locator('.navigation')).toContainText(TAIDE_SMOKE.opintokokonaisuusNimi);
}

export async function taideJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    testData.opsNimi!,
    'tekstikappale 1',
    TAIDE_SMOKE.taiteenala,
    TAIDE_SMOKE.taiteenalaTarkennus,
    `${vaiheNimi}, ${TAIDE_SMOKE.vaiheLaajuusLyhenne}`,
    TAIDE_SMOKE.vaiheKuvaus,
    TAIDE_SMOKE.tavoitealue,
    TAIDE_SMOKE.tavoite,
    TAIDE_SMOKE.vaiheTarkennus,
    TAIDE_SMOKE.opintokokonaisuusNimi,
    TAIDE_SMOKE.opintokokonaisuusKuvaus,
    'Osaamisen arviointi',
    TAIDE_SMOKE.opintokokonaisuusArviointi,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');
  await page.locator('.navigation-tree').getByText('tekstikappale 1').click();
  await expect(page.locator('.content')).toContainText('tekstikappale 1 kuvaus');

  await expect(page.locator('.navigation-tree')).toContainText(TAIDE_SMOKE.taiteenala);
  await page.locator('.navigation-tree').getByText(TAIDE_SMOKE.taiteenala, { exact: true }).click();
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.taiteenalaTarkennus);
  await expect(page.locator('.content')).toContainText('Opetuksen vaiheet');
  await expect(page.locator('.content')).toContainText(vaiheNimi);

  await page.locator('.navigation-tree').getByText(vaiheNimi, { exact: true }).click();
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.vaiheKuvaus);
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.tavoitealue);
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.vaiheTarkennus);
  await expect(page.locator('.content')).toContainText('Opintokokonaisuudet');
  await expect(page.locator('.content')).toContainText(TAIDE_SMOKE.opintokokonaisuusNimi);

  await page.locator('.navigation-tree').getByText(TAIDE_SMOKE.opintokokonaisuusNimi, { exact: true }).click();
  const content = page.locator('.content');
  await expect(content.locator('h2')).toContainText(TAIDE_SMOKE.opintokokonaisuusNimi);
  await expect(content).toContainText('Laajuus');
  await expect(content).toContainText(`${TAIDE_SMOKE.opintokokonaisuusLaajuus} t`);
  await expect(content).toContainText(TAIDE_SMOKE.opintokokonaisuusKuvaus);
  await expect(content).toContainText(TAIDE_SMOKE.tavoitealue);
  await expect(content).toContainText(TAIDE_SMOKE.tavoite);
  await expect(content).toContainText('Osaamisen arviointi');
  await expect(content).toContainText(TAIDE_SMOKE.opintokokonaisuusArviointi);
}
