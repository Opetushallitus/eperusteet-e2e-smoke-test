import { expect } from "@playwright/test";
import { TestData } from "../perusteJaPaikalliset.spec";
import { login, saveAndCheck, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

export async function vstPerusteSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.goto(url!);
  await page.getByRole('button', { name: 'Uusi opintokokonaisuus' }).first().click();
  await page.getByRole('button', { name: 'Lisää opintokokonaisuus' }).click();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('button', { name: 'Hae koodistosta' }).click();
  await waitSmall(page);
  await page.getByText('Aktiivinen kansalaisuus').click();
  await waitSmall(page);
  await page.getByRole('spinbutton').fill('77');
  await page.locator('.ProseMirror').nth(0).fill('opintokokonaisuus kuvaus');
  await page.getByRole('group', { name: 'Tavoitteiden otsikko *' }).getByRole('textbox').fill('opintokokonaisuus tavoitteet');
  await page.getByRole('button', { name: 'Lisää tavoite' }).click();
  await page.getByRole('textbox').nth(2).fill('opintokokonaisuus tavoite 1');
  await page.getByRole('button', { name: 'Lisää arvioinnin kriteeri' }).click();
  await page.getByRole('textbox').nth(3).fill('opintokokonaisuus arvioinnin kriteeri 1');

  await saveAndCheck(page);
}

export async function vstPerusteJulkisetTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await page.goto(DEFAULT_VALUES.julkinenKoosteUrlUrl + 'vapaasivistystyo');
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator('h1')).toContainText(projektiNimi);
  await expect(page.locator('.navigation-tree')).toContainText('Aktiivinen kansalaisuus');
  await page.locator('.navigation-tree').getByText('Aktiivinen kansalaisuus').click();
  await expect(page.locator('.content')).toContainText('77');
  await expect(page.locator('.content')).toContainText('opintokokonaisuus kuvaus');
  await expect(page.locator('.content')).toContainText('opintokokonaisuus tavoitteet');
  await expect(page.locator('.content')).toContainText('opintokokonaisuus tavoite 1');
  await expect(page.locator('.content')).toContainText('opintokokonaisuus arvioinnin kriteeri 1');
}

export async function createVstOpetussuunnitelma(testData: TestData) {
  let page = testData.page;
  await login(page, DEFAULT_VALUES.loginVapaasivistystyo);
  await waitMedium(page);
  await page.goto(DEFAULT_VALUES.vstOpsUrl);
  await page.getByText('Luo uusi').click();

  await page.getByText('Perusteprojektia', { exact: true }).click();

  await expect(page.locator('.multiselect')).toBeVisible();
  await page.locator('.multiselect').click();
  await expect(page.locator('.multiselect')).toContainText(testData.projektiNimi);
  await page.getByText(testData.projektiNimi).click();

  await page.getByRole('textbox').last().fill(testData.opsNimi);
  await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
}

export async function vstOpetussuunnitelmaSisallot(testData: TestData) {
  let page = testData.page;

  await page.getByRole('button', { name: 'Uusi opintokokonaisuus' }).first().click();
  await page.locator('.modal-content').getByRole('textbox').first().fill('paikallinen opintokokonaisuus');
  await page.getByRole('button', { name: 'Lisää opintokokonaisuus' }).click();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.getByRole('button', { name: 'Muokkaa' }).click();

  await page.getByRole('spinbutton').fill('88');
  await page.getByText('Valitse laajuusyksikkö').click();
  await page.getByText('opintopistettä' ).click();

  await page.locator('.ProseMirror').nth(0).fill('opintokokonaisuus kuvaus');
  await page.getByRole('group', { name: 'Tavoitteiden otsikko *' }).getByRole('textbox').fill('opintokokonaisuus tavoitteet');
  await page.locator('.ProseMirror').nth(1).fill('tavoitteiden kuvaus teksti');

  await page.getByRole('button', { name: 'Lisää tavoite' }).click();
  await page.getByRole('textbox').nth(3).fill('opintokokonaisuus tavoite 1');

  await page.locator('.ProseMirror').nth(2).fill('keskeinen sisältö teksti');
  await page.locator('.ProseMirror').nth(3).fill('arvioinnin kuvaus teksti');

  await page.getByRole('button', { name: 'Lisää arvioinnin kriteeri' }).click();
  await page.getByRole('textbox').nth(4).fill('opintokokonaisuus arvioinnin kriteeri 1');

  await page.getByRole('button', { name: 'Lisää osaamismerkkikappale' }).click();
  await page.locator('.ProseMirror').nth(4).fill('osaamismerkkikappale teksti');

  await page.getByRole('button', { name: 'Lisää osaamismerkkejä' }).click();
  await waitSmall(page);
  await page.locator('.modal-content table tr .btn-link').first().click();
  await page.locator('.modal-content').getByRole('button', { name: 'Lisää valitut' }).click();
  await waitSmall(page);

  await saveAndCheck(page);
}

export async function vstOpetussuunnitelmaJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  let opsNimi = testData.opsNimi;

  await page.goto(DEFAULT_VALUES.julkinenVstKoosteUrlUrl);
  await waitMedium(page);

  await page.getByLabel('Hae opetussuunnitelmaa', { exact: true }).fill(opsNimi);
  await expect(page.locator('.opetussuunnitelma-container')).toContainText(opsNimi);
  await page.getByRole('link', { name: opsNimi }).click();
  await expect(page.locator('h1')).toContainText(opsNimi);
  await expect(page.locator('.navigation-tree')).toContainText('paikallinen opintokokonaisuus');
  await page.locator('.navigation-tree').getByText('paikallinen opintokokonaisuus').click();
  await expect(page.locator('.content').last()).toContainText('88 op');
  await expect(page.locator('.content').last()).toContainText('opintokokonaisuus kuvaus');
  await expect(page.locator('.content').last()).toContainText('opintokokonaisuus tavoitteet');
  await expect(page.locator('.content').last()).toContainText('tavoitteiden kuvaus teksti');
  await expect(page.locator('.content').last()).toContainText('opintokokonaisuus tavoite 1');
  await expect(page.locator('.content').last()).toContainText('keskeinen sisältö teksti');
  await expect(page.locator('.content').last()).toContainText('arvioinnin kuvaus teksti');
  await expect(page.locator('.content').last()).toContainText('opintokokonaisuus arvioinnin kriteeri 1');
  await expect(page.locator('.content').last()).toContainText('osaamismerkkikappale teksti');
  await expect(page.locator('.content').last().locator('a[href*="osaamismerkit"]')).toBeVisible();
}
