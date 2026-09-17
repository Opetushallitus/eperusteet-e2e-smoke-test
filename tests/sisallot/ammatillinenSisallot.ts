import { expect, Locator, Page } from "@playwright/test";
import { login, saveAndCheck, startEditMode, waitMedium, waitSmall, PERUSTE_PDF_LINKKI, tarkistaPdfSisalto, TOTS_PDF_LINKKI, luePdfTeksti, normalisoiPdfTeksti } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { TestData } from "../utils/testUtils";

export async function ammatillinenPerusteSisallot(testData: TestData) {
  await perusteenTiedot(testData);
  await perusteenSisallot(testData);
}

async function perusteenTiedot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.goto(url!);
  await page.getByText('Lisätoiminnot').click();
  await page.locator('.ep-dropdown-item').filter({ hasText: 'Perusteen tiedot' }).click();
  await startEditMode(page);
  await page.getByRole('button', { name: 'Lisää koulutuskoodi' }).click();
  await page.getByText('Agrologi', { exact: true }).first().click();
  await saveAndCheck(page);
}

async function perusteenSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await lisaaTutkinnonOsa(page, 'Testiosa');
  await lisaaYhteinenTutkinnonOsa(page, 'Yhteinen osa');
  await waitSmall(page);
  await page.goto(url + 'rakenne');
  await expect(page.locator('body')).toContainText('Tutkinnon rakenteen kuvaus');
  await startEditMode(page);
  await taytaTutkinnonMuodostuminen(page);
  await saveAndCheck(page);
  await lisaaOsaamisalanTekstikappale(page);
}

async function taytaTutkinnonMuodostuminen(page: Page) {
  // Tyhjien sisäryhmien pudotusalueella ei ole korkeutta ilman tätä.
  await page.addStyleTag({
    content: '.rakenne-moduuli-root, .rakenne-moduuli { min-height: 32px; }',
  });
  await lisaaOsaamisala(page, 'osaamisala1');
  await lisaaTutkintonimike(page, 'tutkintonimike1');

  await raahaaSortable(page, paaryhma(page, 'Ammatilliset tutkinnon osat'), page.locator('.drag-area-left > .flex.items-center').first());
  await expect(rakenneAlue(page)).toContainText('Ammatilliset tutkinnon osat');

  const ammatilliset = rakenneRyhma(page, 'Ammatilliset tutkinnon osat');
  const ammatillisetLapset = ammatilliset.locator(':scope > .children');
  await raahaaSortable(page, paaryhma(page, 'Valinnaiset tutkinnon osat'), ammatillisetLapset);
  await expect(ammatilliset).toContainText('Valinnaiset tutkinnon osat');

  await liitaTutkinnonOsatRyhmaan(page, 'Valinnaiset tutkinnon osat', ['Testiosa', 'Yhteinen osa'], ammatilliset);
  const valinnaiset = rakenneRyhma(page, 'Valinnaiset tutkinnon osat');
  await expect(valinnaiset).toContainText('Testiosa');
  await expect(valinnaiset).toContainText('Yhteinen osa');

  const sisarusKohde = valinnaiset.locator(':scope > .moduuli');
  await raahaaSortable(page, paaryhma(page, 'Tutkinnossa määriteltävä (paikallinen)'), sisarusKohde);
  await tallennaRakenneModal(page);
  await expect(ammatillisetLapset).toContainText('Tutkinnossa määriteltävä (paikallinen)');
  await expect(valinnaiset).not.toContainText('Tutkinnossa määriteltävä (paikallinen)');

  await raahaaSortable(page, page.locator('.osaamisalat').first(), sisarusKohde);
  await expect(ammatillisetLapset).toContainText('osaamisala1');
  await expect(valinnaiset).not.toContainText('osaamisala1');

  await raahaaSortable(page, page.locator('.tutkintonimikkeet').first(), sisarusKohde);
  await expect(ammatillisetLapset).toContainText('tutkintonimike1');
  await expect(valinnaiset).not.toContainText('tutkintonimike1');

  await kopioiValinnaisetOsaamisalalleJaTutkintonimikkeelle(page);

  await expect(page.locator('.sisalto')).toContainText('Testiosa');
  await expect(page.locator('.sisalto')).toContainText('Yhteinen osa');
  await expect(page.locator('.sisalto')).toContainText('osaamisala1');
  await expect(page.locator('.sisalto')).toContainText('tutkintonimike1');
}

function rakenneAlue(page: Page) {
  return page.locator('.drag-area-left');
}

function rakenneRyhma(page: Page, nimi: string) {
  return page.locator('.drag-area-left .muodostumisnode').filter({
    has: page.locator(':scope > .moduuli .nimi', { hasText: nimi }),
  }).first();
}

function paaryhma(page: Page, nimi: string) {
  return page.locator('.paaryhmat .paaryhma').filter({ hasText: nimi });
}

async function lisaaOsaamisala(page: Page, nimi: string) {
  await page.getByRole('button', { name: 'Lisää osaamisala' }).click();
  await page.locator('.osaamisalat').getByRole('textbox').fill(nimi);
  await expect(page.locator('.osaamisalat').getByRole('textbox')).toHaveValue(nimi);
}

async function lisaaTutkintonimike(page: Page, nimi: string) {
  await page.getByRole('button', { name: 'Lisää tutkintonimike' }).click();
  await page.locator('.tutkintonimikkeet').getByRole('textbox').fill(nimi);
  await expect(page.locator('.tutkintonimikkeet').getByRole('textbox')).toHaveValue(nimi);
}

async function liitaTutkinnonOsatRyhmaan(page: Page, ryhmaNimi: string, osat: string[], parent?: Locator) {
  const ryhma = parent
    ? parent.locator('.muodostumisnode').filter({
      has: page.locator(':scope > .moduuli .nimi', { hasText: ryhmaNimi }),
    }).first()
    : rakenneRyhma(page, ryhmaNimi);
  await ryhma.locator(':scope > .moduuli .ep-dropdown').click();
  await page.locator('.ep-dropdown-popover').last().getByRole('button', { name: 'Liitä tutkinnon osa' }).click();
  for (const osa of osat) {
    await page.getByRole('cell', { name: osa }).first().click();
  }
  await page.getByRole('button', { name: 'Liitä valitut tutkinnon osat' }).click();
}

async function lisaaValinnaisetAliryhma(page: Page, kohdeNimi: string) {
  const kohde = rakenneRyhma(page, kohdeNimi);
  await kohde.locator(':scope > .moduuli .ep-dropdown').click();
  await page.locator('.ep-dropdown-popover').last().getByRole('button', { name: 'Lisää ryhmä' }).click();
  const modal = page.locator('.ep-modal').filter({ hasText: 'Lisää ryhmä' });
  await expect(modal).toBeVisible();
  await modal.getByRole('radio', { name: 'Valinnaiset tutkinnon osat' }).click();
  await modal.getByRole('button', { name: 'Tallenna' }).click();
  await expect(modal).toBeHidden();
  await expect(kohde).toContainText('Valinnaiset tutkinnon osat');
}

function valinnaisetAliryhma(page: Page, kohdeNimi: string) {
  return rakenneRyhma(page, kohdeNimi).locator('.muodostumisnode').filter({
    has: page.locator(':scope > .moduuli .nimi', { hasText: 'Valinnaiset tutkinnon osat' }),
  });
}

async function kopioiValinnaisetOsaamisalalleJaTutkintonimikkeelle(page: Page) {
  for (const kohdeNimi of ['osaamisala1', 'tutkintonimike1']) {
    const kohde = rakenneRyhma(page, kohdeNimi);
    if (await valinnaisetAliryhma(page, kohdeNimi).count() === 0) {
      await lisaaValinnaisetAliryhma(page, kohdeNimi);
    }
    const nested = valinnaisetAliryhma(page, kohdeNimi).first();
    if (!(await nested.innerText()).includes('Testiosa')) {
      await liitaTutkinnonOsatRyhmaan(page, 'Valinnaiset tutkinnon osat', ['Testiosa', 'Yhteinen osa'], kohde);
    }
    await expect(kohde).toContainText('Testiosa');
    await expect(kohde).toContainText('Yhteinen osa');
  }
}

async function lisaaOsaamisalanTekstikappale(page: Page) {
  await page.reload();
  await page.getByRole('button', { name: 'Uusi tekstikappale' }).first().click();
  const modal = page.locator('.ep-modal').filter({ hasText: 'Lisää uusi tekstikappale' });
  await expect(modal).toBeVisible();
  await modal.getByRole('radio', { name: 'Osaamisala' }).click();
  await expect(modal.locator('.p-select').first()).toBeVisible();
  await modal.locator('.p-select').first().click();
  await page.locator('.p-select-option, [role="option"]').filter({ hasText: 'osaamisala1' }).first().click();
  await modal.getByRole('button', { name: 'Lisää tekstikappale' }).click();
  await waitSmall(page);
  await expect(page.locator('body')).toContainText('osaamisala1');
  await startEditMode(page);
  await page.locator('.ProseMirror').fill('osaamisala1 kuvaus');
  await saveAndCheck(page);
}

async function tallennaRakenneModal(page: Page) {
  const modal = page.locator('.ep-modal');
  if (await modal.isVisible().catch(() => false)) {
    await modal.locator('button').filter({ hasText: 'Tallenna' }).click();
    await expect(modal).toBeHidden();
  }
}

async function raahaaSortable(page: Page, source: Locator, target: Locator) {
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  await source.hover({ position: { x: 12, y: 20 } });
  await page.mouse.down();
  await page.waitForTimeout(200);
  const sourceBox = await source.boundingBox();
  if (!sourceBox) {
    throw new Error('Raahauksen lähdettä ei löytynyt');
  }
  await page.mouse.move(sourceBox.x + 20, sourceBox.y + 40, { steps: 8 });
  await page.waitForTimeout(200);
  const targetBox = await target.boundingBox();
  if (!targetBox) {
    throw new Error('Raahauksen kohdetta ei löytynyt');
  }
  const dropX = targetBox.x + Math.min(80, targetBox.width / 2);
  const dropY = targetBox.y + Math.max(8, targetBox.height / 2);
  await page.mouse.move(dropX, dropY, { steps: 30 });
  await page.waitForTimeout(200);
  await page.mouse.move(dropX + 1, dropY + 1);
  await page.mouse.up();
  await page.waitForTimeout(500);
}

export async function lisaaTutkinnonOsa(page: Page, nimi: string, yhteinen: boolean = false) {
  await page.getByRole('link', { name: 'Tutkinnon osat' }).click();
  await page.getByRole('button', { name: 'Lisää tutkinnon osa' }).click();
  await waitSmall(page);
  if (yhteinen) {
    await page.getByText('Yhteinen tutkinnon osa', { exact: true }).click();
  }
  // Koodistosta haun listaus ei jostain syystä renderöidy testissä, joten lisätään manuaalisesti
  await page.locator('.ep-form-group').filter({ hasText: 'Tutkinnon osan nimi' }).getByRole('textbox').fill(nimi);
  await lisaaTutkinnonOsaNimiKielella(page, nimi, 'Svenska');
  await lisaaTutkinnonOsaNimiKielella(page, nimi, 'In English');
  await page.locator('.ep-form-group').filter({ hasText: 'Laajuus' }).getByRole('textbox').fill('10');
  await saveAndCheck(page);
  await waitSmall(page);
}

async function vaihdaKieli(page: Page, kieli: string) {
  await page.locator('.ep-navbar .kieli-valikko').click();
  await page.locator('.ep-dropdown-popover .ep-dropdown-item').filter({ hasText: kieli }).click();
}

async function lisaaTutkinnonOsaNimiKielella(page: Page, nimi: string, kieli: string) {
  await vaihdaKieli(page, kieli);
  await page.locator('.ep-form-group').filter({ hasText: 'Tutkinnon osan nimi' }).getByRole('textbox').fill(nimi + ' ' + kieli);
  await vaihdaKieli(page, 'Suomi');
}

export async function lisaaYhteinenTutkinnonOsa(page: Page, nimi: string) {
  await lisaaTutkinnonOsa(page, nimi, true);
  await page.getByRole('button', { name: 'Lisää osa-alue' }).click();
  await page.locator('.ep-form-group').filter({ hasText: 'Osa-alueen nimi' }).getByRole('textbox').fill('osaalue');

  await page.getByRole('button', { name: 'Hae koodistosta' }).first().click();
  await expect(page.locator('.ep-modal')).toBeVisible();
  await expect(page.locator('.ep-modal')).toContainText('Etiikka');
  await page.getByText('Etiikka').click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();

  await page.locator('input[type="radio"]').first().click();
  await saveAndCheck(page);
}

export async function ammatillinenLisaTarkistukset(testData: TestData) {
  let page = testData.page;
  let url = testData.url!;

  await page.goto(url);
  await page.getByText('Lisätoiminnot').click();
  await page.locator('.ep-dropdown-item').filter({ hasText: 'Luo PDF' }).click();
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

  const pdfLink = page.getByRole('link', { name: PERUSTE_PDF_LINKKI });
  await page.locator('.navigation-tree').getByRole('link').first().click();
  await expect(pdfLink).toBeVisible();
  const pdfText = await luePdfTeksti(pdfLink);
  expect(pdfText.toLowerCase()).toContain(normalisoiPdfTeksti(projektiNimi).toLowerCase());
  expect(pdfText.toLowerCase()).toContain(normalisoiPdfTeksti('osaamisala1 kuvaus').toLowerCase());
  tarkistaRakenneTekstit(pdfText, 'PDF');

  await page.locator('.navigation-tree').getByText('Tutkinnon muodostuminen').click();
  await expect(page.locator('.content')).toContainText('Tutkinnon muodostuminen');
  await page.getByRole('button', { name: 'Avaa kaikki' }).click();
  await expect(page.getByRole('button', { name: 'Sulje kaikki' })).toBeVisible();
  await tarkistaJulkinenRakenne(page);

  await expect(page.locator('.navigation-tree')).toContainText('osaamisala1');
  await page.locator('.navigation-tree').getByText('osaamisala1').click();
  await expect(page.locator('.content')).toContainText('osaamisala1');
  await expect(page.locator('.content')).toContainText('osaamisala1 kuvaus');
}

const AMMATILLINEN_RAKENNE_TEKSTIT = [
  'Ammatilliset tutkinnon osat',
  'Tutkinnossa määriteltävä (paikallinen)',
  'osaamisala1',
  'Valinnaiset tutkinnon osat',
  'Testiosa',
  'Yhteinen osa',
  'tutkintonimike1',
  'Valinnaiset tutkinnon osat',
  'Testiosa',
  'Yhteinen osa',
  'Valinnaiset tutkinnon osat',
  'Testiosa',
  'Yhteinen osa',
] as const;

async function tarkistaJulkinenRakenne(page: Page) {
  tarkistaRakenneTekstit(await page.locator('.peruste-rakenne').innerText(), 'Julkisivun rakenne');
}

function tarkistaRakenneTekstit(teksti: string, virheenEtuliite: string) {
  const normalisoitu = normalisoiPdfTeksti(teksti).toLowerCase();
  let kohta = 0;
  for (const nimi of AMMATILLINEN_RAKENNE_TEKSTIT) {
    const haettava = normalisoiPdfTeksti(nimi).toLowerCase();
    const seuraava = normalisoitu.indexOf(haettava, kohta);
    expect(seuraava, `${virheenEtuliite} ei sisältänyt järjestyksessä: ${nimi}`).toBeGreaterThan(-1);
    kohta = seuraava + haettava.length;
  }
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
  
  await tarkistaPdfSisalto(page.getByRole('link', { name: TOTS_PDF_LINKKI }), [
    projektiNimi,
    testData.opsNimi!,
    'Tutkinnon osat',
    'Testiosa',
    'Yhteinen osa',
    'Testiosa',
    'Yhteinen osa',
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('Tutkinnon osat');
  await page.locator('.navigation-tree').getByText('Tutkinnon osat').click();
  await expect(page.locator('.content')).toContainText('Testiosa');
  await expect(page.locator('.content')).toContainText('Yhteinen osa');
  await page.locator('.navigation-tree').getByText('Testiosa').click();
  await expect(page.getByRole('heading', { name: 'Testiosa, 10 osp' })).toBeVisible();
  await expect(page.locator('.navigation-tree')).toContainText('Yhteinen osa');
  await page.locator('.navigation-tree').getByText('Yhteinen osa').click();
  await expect(page.getByRole('heading', { name: 'Yhteinen osa, 10 osp' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'osaalue (ETK) expand_less' })).toBeVisible();
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
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('combobox').nth(1).locator('input').fill(projektiNimi);
  await page.getByText(projektiNimi).first().click();
  await page.locator('.ep-form-group').filter({ hasText: 'Toteutussuunnitelman nimi *' }).getByRole('textbox').fill(testData.opsNimi);
  await page.getByRole('button', { name: 'Luo toteutussuunnitelma' }).click();
}

export async function ammatillinenToteutussuunnitelmaSisallot(testData: TestData) {
  let page = testData.page;

  await expect(page.locator('.navigation')).toContainText('Tutkinnon osat');
  await page.locator('.navigation').getByText('Tutkinnon osat').click();
  await expect(page.locator('.navigation')).toContainText('Testiosa');
  await page.locator('.navigation').getByText('Testiosa').click();
  await expect(page.locator('.editointikontrolli')).toContainText('Testiosa');
  await expect(page.locator('.navigation')).toContainText('Yhteinen osa');
  await page.locator('.navigation').getByText('Yhteinen osa').click();
  await expect(page.locator('.editointikontrolli')).toContainText('Yhteinen osa');
}
