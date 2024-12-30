import { expect, Page } from "@playwright/test";
import { waitMedium, waitSmall } from "../utils/commonmethods";
import { perusteenTekstikappale } from "./perusteSisalto";

export async function perusopetuksenSisallot(page: Page, url: string) {
  await perusteenTekstikappale(page);
  await perusopetusLaajaAlaisetOsaamiset(page, url);
  await perusopetusVuosiluokkakokonaisuus(page, url);
  await perusopetusOppiaine(page, url);
}

export async function perusopetusLaajaAlaisetOsaamiset(page: Page, url) {
  await page.goto(url + 'perusopetus/laajaalaisetosaamiset');
  await page.getByRole('button', { name: 'Uusi laaja-alainen osaaminen' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Laaja-alainen osaaminen 1');
  await page.locator('.ProseMirror').fill("Laaja-alainen osaaminen 1 Kuvausteksti");
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await waitMedium(page);
  await page.goto(url + 'perusopetus/laajaalaisetosaamiset');
  await expect(page.locator('body')).toContainText('Laaja-alainen osaaminen 1');
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusVuosiluokkakokonaisuus(page: Page, url: string) {
  await page.goto(url + 'perusopetus/vuosiluokkakokonaisuudet');
  await expect(page.locator('body')).toContainText('Uusi vuosiluokkakokonaisuus');
  await page.getByRole('button', { name: 'Uusi vuosiluokkakokonaisuus' }).click();

  await page.getByText('Vuosiluokka 1').click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Vuosiluokkakokonaisuus 1');

  await page.locator('.ProseMirror').nth(0).fill("vlk1 lao 1 teksti");
  await page.locator('.ProseMirror').nth(1).fill("vlk1 paikallinen teksti");
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await waitMedium(page);
  await page.goto(url + 'perusopetus/vuosiluokkakokonaisuudet');
  await expect(page.locator('body')).toContainText('Vuosiluokkakokonaisuus 1');
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
  await waitSmall(page);

  await page.getByText('Vuosiluokat 1-1').click();

  await page.getByRole('button', { name: 'Muokkaa sisältöalueita' }).click();
  await page.locator('.modal-content').getByRole('textbox').fill('sisältöalueet otsikko');
  await page.locator('.modal-content').locator('.ProseMirror').fill("sisältöalueet kuvaus");
  await page.locator('.modal-content').getByRole('button', { name: 'Lisää sisältöalue' }).click();
  await page.locator('.modal-content').getByRole('textbox').nth(1).fill('sisältöalue 1');
  await page.locator('.modal-content').locator('.ProseMirror').nth(1).fill("sisältöalueen kuvaus");
  await page.locator('.modal-content').getByRole('button', { name: 'Tallenna' }).click();
  await waitSmall(page);

  await page.getByRole('button', { name: 'Lisää tavoite' }).click();
  await page.locator('.tavoite').getByRole('textbox').first().fill('tavoite 1');
  await page.locator('.tavoite').locator('select').selectOption({ label: 'tavoitealue 1' });
  await page.locator('.tavoite').getByRole('button', { name: 'Lisää laaja-alainen osaaminen' }).click();
  await page.locator('.tavoite').getByRole('menuitem', { name: 'Laaja-alainen osaaminen' }).click();
  await page.locator('.tavoite').getByRole('button', { name: 'Lisää sisältöalue' }).click();
  await page.locator('.tavoite').getByRole('menuitem', { name: 'sisältöalue' }).click();

  await page.getByRole('button', { name: 'Tallenna' }).click();
  await waitMedium(page);
  await page.goto(url + 'perusopetus/oppiaineet');
  await expect(page.locator('body')).toContainText('A1-kieli (A12)');
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
}

export async function perusopetusOpsLuonti(page: Page) {
  await page.getByText('Vuosiluokkakokonaisuus 1').click();
}

export async function perusopetusOpsSisallot(page: Page) {
  await page.getByRole('link', { name: 'Vuosiluokkakokonaisuus 1' }).click();
  await page.getByRole('link', { name: 'A1-kieli' }).click();
  await page.getByRole('button', { name: 'Vuosiluokkaista tavoitteet' }).click();
  await page.getByRole('button', { name: 'Tuo kaikki' }).click();
  await page.getByRole('button', { name: 'Tallenna' }).click();
  await waitMedium(page);
}

export async function perusopetusJulkinenOpsTarkistukset(page: Page) {
  await expect(page.locator('.navigation-tree')).toContainText('Vuosiluokkakokonaisuus 1');
  await expect(page.locator('.navigation-tree')).toContainText('Oppiaineet');
  page.locator('.navigation-tree').getByText('Oppiaineet').click();
  await expect(page.locator('.navigation-tree')).toContainText('A1-kieli');
}
