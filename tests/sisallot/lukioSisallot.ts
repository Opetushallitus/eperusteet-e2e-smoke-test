import { expect, Page } from "@playwright/test";
import { waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { yleissivistavatJulkinenTarkistukset } from "./yleissivistavat";
import { TestData } from "../utils/testUtils";

const oppiaineet = [
  {nimi: 'Historia', moduuliNimi: 'Antiikin elämää', oppimaaraNimi: 'Biologia'},
  {nimi: 'Fysiikka', moduuliNimi: 'Analyysi ja jatkuva jakauma', oppimaaraNimi: 'Elämänkatsomustieto'},
  {nimi: 'Filosofia', moduuliNimi: 'Aktiivinen elämä', oppimaaraNimi: 'Juutalainen uskonto'}
];

const laot = [
  {nimi: 'Hyvinvointiosaaminen'},
  {nimi: 'Yhteiskunnallinen osaaminen'},
];

export async function lukioSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  for (const oppiaine of oppiaineet) {
    await page.goto(url + 'lukio/oppiaineet');
    await lisaaOppiaine(page, oppiaine.nimi, oppiaine.moduuliNimi, oppiaine.oppimaaraNimi);
  }

  for(const lao of laot) {
    await page.goto(url + 'lukio/laajaalaisetosaamiset');
    await lisaaLaajaAlainenOsaaminen(page, lao.nimi, laot.indexOf(lao));
  }
}

async function lisaaLaajaAlainenOsaaminen(page: Page, nimi: string, index: number) {
  await page.locator('button').filter({ hasText: 'Muokkaa' }).click();
  await page.locator('button').filter({ hasText: 'Uusi laaja-alainen' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).nth(index).click();
  await expect(page.locator('.modal-content')).toContainText('Hyvinvointiosaaminen');
  await page.locator('.modal-content').getByText(nimi).click();
  await page.locator('.ProseMirror').nth(index).fill(nimi + ' kuvaus');

  await page.locator('button').filter({ hasText: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
}

async function lisaaOppiaine(page: Page, nimi: string, moduuliNimi: string, oppimaaraNimi: string) {
  await page.locator('button').filter({ hasText: 'Uusi oppiaine' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.modal-content')).toContainText(nimi);
  await page.locator('.modal-content').getByText(nimi).click();
  await page.locator('.ProseMirror').nth(0).fill(nimi + ' tehtava');
  await page.locator('.ProseMirror').nth(1).fill(nimi + ' lao');
  await page.locator('.ProseMirror').nth(2).fill(nimi + ' tavoite');
  await page.locator('.ProseMirror').nth(3).fill(nimi + ' osaamisen arviointi');
  await page.locator('.ProseMirror').nth(4).fill(nimi + ' pakollinen moduuli');
  await page.locator('.ProseMirror').nth(5).fill(nimi + ' valinnainen moduuli');
  await page.locator('button').filter({ hasText: 'Lisää tavoitealue', }).click();
  await page.locator('button').filter({ hasText: 'Lisää tavoite', hasNotText: 'tavoitealue' }).click();
  await page.locator('.tavoitealue').nth(0).getByRole('textbox').nth(0).fill(nimi + ' tavoitealue');
  await page.locator('.tavoitealue').nth(0).getByRole('textbox').nth(1).fill(nimi + ' kohde');
  await page.locator('.tavoitealue').nth(0).getByRole('textbox').nth(2).fill(nimi + ' tavoite');

  await page.locator('button').filter({ hasText: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');

  await page.locator('button').filter({ hasText: 'Uusi oppimäärä' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.modal-content')).toContainText(oppimaaraNimi);
  await page.locator('.modal-content').getByText(oppimaaraNimi).click();

  await page.locator('button').filter({ hasText: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');

  await page.locator('button').filter({ hasText: 'Lisää pakollinen moduuli' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.modal-content')).toContainText(moduuliNimi);
  await page.locator('.modal-content').getByText(moduuliNimi).click();
  await page.getByText('Pakollinen').check();
  await page.getByRole('group', { name: 'Laajuus' }).getByRole('textbox').fill('4');
  await page.locator('.ProseMirror').nth(0).fill(moduuliNimi + ' kuvaus');

  await page.locator('button').filter({ hasText: 'Tallenna' }).click();
  await expect(page.locator('.notification')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
}

export async function lukioJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  await yleissivistavatJulkinenTarkistukset(testData)

  await page.locator('.navigation-tree').getByText('Laaja-alaisen osaamisen osa-alueet').click();
  for (const lao of laot) {
    await expect(page.locator('.navigation-tree')).toContainText(lao.nimi);
    await expect(page.locator('.laaja-alaiset')).toContainText(lao.nimi + ' kuvaus');
  };

  await page.locator('.navigation-tree').getByText('Oppiaineet').click();
  for (const oppiaine of oppiaineet) {
    await page.locator('.navigation-tree').getByText(oppiaine.nimi).click();
    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.nimi);
    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.oppimaaraNimi);
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tehtava');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' lao');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoite');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoitealue');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' osaamisen arviointi');

    await page.locator('.navigation-tree').getByText(oppiaine.oppimaaraNimi).click();
    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.moduuliNimi);
    await expect(page.locator('.content')).toContainText(oppiaine.moduuliNimi);
    await expect(page.locator('.content')).toContainText('4 op');
    await page.locator('.content').locator('a').filter({ hasText: oppiaine.moduuliNimi }).last().click();
    await expect(page.locator('.content')).toContainText('Pakollinen');
    await expect(page.locator('.content')).toContainText('4 op');
  }
}

export async function lukioOpsLuonti(testData: TestData) {
  let page = testData.page;
}

export async function lukioOpsSisallot(testData: TestData) {
  let page = testData.page;

  for (const oppiaine of oppiaineet) {
    await page.getByRole('link', { name: 'Yleisnäkymä' }).click();
    await page.getByRole('link', { name: 'Oppiaineet' }).click();
    await page.locator('.navigation').getByRole('link', { name: oppiaine.nimi }).click();
    await waitSmall(page);
    await expect(page.locator('.navigation')).toContainText(oppiaine.nimi);
    await expect(page.locator('.navigation')).toContainText(oppiaine.oppimaaraNimi);
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tehtava');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' lao');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoite');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoitealue');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' osaamisen arviointi');
    await expect(page.locator('.content')).toContainText(oppiaine.oppimaaraNimi);

    await page.locator('.navigation').getByRole('link', { name: oppiaine.oppimaaraNimi }).click();
    await page.locator('.content').locator('button').filter({ hasText: 'Uusi opintojakso' }).click();
    await expect(page.locator('.editointikontrolli')).toContainText('Peruuta');
    await expect(page.locator('.editointikontrolli')).toContainText('Tallenna');
    await page.locator('.content').getByRole('textbox').nth(0).fill(oppiaine.oppimaaraNimi + ' opintojakso');
    await page.locator('.content').getByRole('textbox').nth(1).fill('opintojakso_' + oppiaineet.indexOf(oppiaine));
    await page.locator('.moduuli').locator('.moduulibox').filter({ hasText: oppiaine.moduuliNimi }).click();

    await page.mouse.wheel(0, -1080);
    await page.locator('button').filter({ hasText: 'Tallenna' }).click();
    await expect(page.locator('.editointikontrolli')).toContainText('Muokkaa');
  }
}

export async function lukioJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;


  await page.locator('.navigation-tree').getByText('Oppiaineet').click();
  for (const oppiaine of oppiaineet) {
    await page.locator('.navigation-tree').getByText(oppiaine.nimi).click();
    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.oppimaaraNimi);
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tehtava');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' lao');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoite');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' tavoitealue');
    await expect(page.locator('.content')).toContainText(oppiaine.nimi + ' osaamisen arviointi');
    await expect(page.locator('.content')).toContainText(oppiaine.oppimaaraNimi);
    await page.locator('.content').getByText(oppiaine.oppimaaraNimi).nth(0).click();

    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.oppimaaraNimi + ' opintojakso');
    await expect(page.locator('.navigation-tree')).toContainText(oppiaine.moduuliNimi);

    await page.locator('.navigation-tree').getByText(oppiaine.moduuliNimi).click();
    await expect(page.locator('.content')).toContainText('Pakollinen');
    await expect(page.locator('.content')).toContainText('4 op');
  }
}
