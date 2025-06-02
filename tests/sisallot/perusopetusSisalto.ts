import { expect, Page } from '@playwright/test';
import { waitMedium, waitSmall } from '../../utils/commonmethods';
import { perusteenTekstikappale } from './perusteSisalto';
import { TestData } from "../utils/testUtils";

export async function perusopetuksenSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url!;

  await perusteenTekstikappale(page);
  await perusopetusLaajaAlaisetOsaamiset(page, url);
  await perusopetusVuosiluokkakokonaisuus(page, url, '1');
  await perusopetusVuosiluokkakokonaisuus(page, url, '2');
  await perusopetusOppiaine(page, url);
}

export async function perusopetusLaajaAlaisetOsaamiset(page: Page, url) {
  await page.goto(url + 'perusopetus/laajaalaisetosaamiset');
  await page.getByRole('button', { name: 'Uusi laaja-alainen osaaminen' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Laaja-alainen osaaminen 1');
  await page.locator('.ProseMirror').fill('Laaja-alainen osaaminen 1 Kuvausteksti');
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.goto(url + 'perusopetus/laajaalaisetosaamiset');
  await expect(page.locator('body')).toContainText('Laaja-alainen osaaminen 1');
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusVuosiluokkakokonaisuus(page: Page, url: string, vlk: string) {
  await page.goto(url + 'perusopetus/vuosiluokkakokonaisuudet');
  await expect(page.locator('body')).toContainText('Uusi vuosiluokkakokonaisuus');
  await page.getByRole('button', { name: 'Uusi vuosiluokkakokonaisuus' }).click();

  await page.getByText('Vuosiluokka ' + vlk).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Vuosiluokkakokonaisuus ' + vlk);

  await page.locator('.ProseMirror').nth(0).fill('vlk' + vlk + ' lao 1 teksti');
  await page.locator('.ProseMirror').nth(1).fill('vlk' + vlk + ' paikallinen teksti');
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.goto(url + 'perusopetus/vuosiluokkakokonaisuudet');
  await expect(page.locator('body')).toContainText('Vuosiluokkakokonaisuus ' + vlk);
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusOppiaine(page: Page, url: string) {
  await page.goto(url + 'perusopetus/oppiaineet');
  await page.getByRole('button', { name: 'Uusi oppiaine' }).nth(1).click();
  await page.getByRole('button', { name: 'Hae koodistosta' }).click();
  await waitMedium(page);
  await page.getByText('A1-kieli').first().click();

  await page.getByRole('button', { name: 'Muokkaa tavoitealueita' }).click();
  await page.locator('.modal-content').getByRole('button', { name: 'Lisää tavoitealue' }).click();
  await page.locator('.modal-content').getByRole('textbox').fill('tavoitealue 1');
  await page.locator('.modal-content').getByRole('button', { name: 'Tallenna' }).click();

  await page.getByText('Vuosiluokat 1-1').click();

  await page.getByRole('button', { name: 'Muokkaa sisältöalueita' }).click();
  await page.locator('.modal-content').getByRole('textbox').fill('sisältöalueet otsikko');
  await page.locator('.modal-content').locator('.ProseMirror').fill('sisältöalueet kuvaus');
  await page.locator('.modal-content').getByRole('button', { name: 'Lisää sisältöalue' }).click();
  await page.locator('.modal-content').getByRole('textbox').nth(1).fill('sisältöalue 1');
  await page.locator('.modal-content').locator('.ProseMirror').nth(1).fill('sisältöalueen kuvaus');
  await page.locator('.modal-content').getByRole('button', { name: 'Tallenna' }).click();

  await page.getByRole('button', { name: 'Lisää tavoite' }).click();
  await page.locator('.tavoite').getByRole('textbox').first().fill('tavoite 1');
  await page.locator('.tavoite').locator('select').selectOption({ label: 'tavoitealue 1' });
  await page.locator('.tavoite').getByRole('button', { name: 'Lisää laaja-alainen osaaminen' }).click();
  await page.locator('.tavoite').getByRole('menuitem', { name: 'Laaja-alainen osaaminen' }).click();
  await page.locator('.tavoite').getByRole('button', { name: 'Lisää sisältöalue' }).click();
  await page.locator('.tavoite').getByRole('menuitem', { name: 'sisältöalue' }).click();

  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.goto(url + 'perusopetus/oppiaineet');
  await expect(page.locator('body')).toContainText('A1-kieli (A12)');
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusOpsLuonti(testData: TestData) {
  let page = testData.page;
  await page.getByText('Vuosiluokkakokonaisuus 1').click();
  await page.getByText('Vuosiluokkakokonaisuus 2').click();
}

export async function perusopetusOpsSisallot(testData: TestData) {
  let page = testData.page;
  await opsOppiaineenVuosiluokanMuokkaus(page);

  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();

  await perusopetusValinnainenOppiaine(page, 'Valinnainen oppiaine 1');
  await perusopetusValinnainenOppiaine(page, 'Valinnainen oppiaine 2');
  await perusopetusValinnainenOppiaine(page, 'Valinnainen oppiaine 3');
  await perusopetusValinnainenOppiaine(page, 'Valinnainen oppiaine 4');
  await perusopetusValinnainenOppiaine(page, 'Valinnainen oppiaine 5');
}

export async function opsOppiaineenVuosiluokanMuokkaus(page: Page) {
  await page.getByRole('link', { name: 'Vuosiluokkakokonaisuus 1' }).click();
  await page.getByRole('link', { name: 'A1-kieli' }).click();
  await page.getByRole('button', { name: 'Vuosiluokkaista tavoitteet' }).click();
  await page.getByRole('button', { name: 'Tuo kaikki' }).click();
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await expect(page.locator('.navigation')).toContainText('Vuosiluokka 1');
  await page.locator('.navigation').getByRole('link', { name: 'Vuosiluokka 1' }).click();
  await expect(page.locator('.tavoite')).toContainText('tavoite 1');
  await expect(page.locator('.tavoite')).toContainText('sisältöalue 1');
  await expect(page.locator('.tavoite')).toContainText('sisältöalueen kuvaus');
  await expect(page.locator('.tavoite')).toContainText('Laaja-alainen osaaminen 1');
  await page.getByRole('button', { name: 'Laaja-alainen osaaminen 1' }).click();
  await expect(page.locator('.tavoite')).toContainText('Laaja-alainen osaaminen 1 Kuvausteksti');
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.locator('.ProseMirror').nth(0).fill('tavoite 1 paikallinen tarkennus');
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
}

export async function perusopetusValinnainenOppiaine(page: Page, oppiaineNimi: string) {
  await page.getByRole('link', { name: 'Vuosiluokkakokonaisuus 1' }).click();
  await page.getByRole('link', { name: 'Valinnaisuus perusopetuksessa' }).click();
  await page.getByRole('button', { name: 'Lisää valinnainen oppiaine' }).click();
  await page.getByRole('textbox').first().fill(oppiaineNimi);
  await page.getByText('Syventävä').check();
  await page.getByText('Valitse...').click();
  await page.getByText('A1-kieli').click();
  await page.getByText('1. lk').check();
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await expect(page.locator('body')).toContainText(oppiaineNimi);
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;
  await expect(page.locator('.navigation-tree')).toContainText('Vuosiluokkakokonaisuus 1');
  await expect(page.locator('.navigation-tree')).toContainText('Vuosiluokkakokonaisuus 2');
  await expect(page.locator('.navigation-tree')).toContainText('Oppiaineet');
  await page.locator('.navigation-tree').getByText('Oppiaineet').click();
  await expect(page.locator('.navigation-tree')).toContainText('A1-kieli');
  await expect(page.locator('.navigation-tree')).toContainText('Valinnaisuus perusopetuksessa');
  await page.locator('.navigation-tree').getByText('Valinnaisuus perusopetuksessa').click();

  await expect(page.locator('.navigation-tree')).toContainText('Valinnainen oppiaine 1');
  await expect(page.locator('.navigation-tree')).toContainText('Valinnainen oppiaine 2');
  await expect(page.locator('.navigation-tree')).toContainText('Valinnainen oppiaine 3');
  await expect(page.locator('.navigation-tree')).toContainText('Valinnainen oppiaine 4');
  await expect(page.locator('.navigation-tree')).toContainText('Valinnainen oppiaine 5');
}
