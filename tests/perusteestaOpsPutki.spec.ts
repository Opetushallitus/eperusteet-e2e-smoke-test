import { test, expect, Page } from '@playwright/test';
import {DEFAULT_VALUES} from "../utils/defaultvalues";
import {createNimi, login, waitMedium, waitSmall} from "../utils/commonmethods";
import { perusopetuksenSisallot, perusopetusJulkinenOpsTarkistukset, perusopetusOpsLuonti, perusopetusOpsSisallot } from './perusopetusSisalto';
import { varhaiskasvatusJulkinenOpsTarkistukset, varhaiskasvatusSisallot } from './varhaiskasvatusSisalto';
import { lukioJulkinenOpsTarkistukset, lukioJulkinenTarkistukset, lukioOpsLuonti, lukioOpsSisallot, lukioSisallot } from './lukioSisallot';

test.describe.configure({ mode: 'serial', retries: 0 });
test.describe('Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;

  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];
  let opsPohjaUrls: string[] = [];
  let perusteProjektit = {};

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  [
    {
      koulutustyyppi: 'Varhaiskasvatus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Varhaiskasvatus'),
      perusteSisallot: async (page: Page, url: string) => await varhaiskasvatusSisallot(page),
      julkinenPerusteTarkistukset: async (page: Page) => {},
      pohjaNimi: createNimi('Testautomation varhaiskasvatus pohja'),
      opsNimi: createNimi('Testautomation varhaiskasvatus ops'),
      opsLuonti: async (page: Page) => {},
      opsSisallot: async (page: Page) => {},
      julkinenOpsTarkistukset: async (page: Page) => varhaiskasvatusJulkinenOpsTarkistukset(page),
    },
    {
      koulutustyyppi: 'Perusopetus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Perusopetus'),
      perusteSisallot: async (page: Page, url: string) => await perusopetuksenSisallot(page, url),
      julkinenPerusteTarkistukset: async (page: Page) => {},
      pohjaNimi: createNimi('Testautomation perusopetus pohja'),
      opsNimi: createNimi('Testautomation perusopetus ops'),
      opsLuonti: async (page: Page) => await perusopetusOpsLuonti(page),
      opsSisallot: async (page: Page) => await perusopetusOpsSisallot(page),
      julkinenOpsTarkistukset: async (page: Page) => await perusopetusJulkinenOpsTarkistukset(page),
    },
    {
      koulutustyyppi: 'Lukiokoulutus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Lukiokoulutus'),
      perusteSisallot: async (page: Page, url: string) => await lukioSisallot(page, url),
      julkinenPerusteTarkistukset: async (page: Page) => await lukioJulkinenTarkistukset(page),
      pohjaNimi: createNimi('Testautomation Lukiokoulutus pohja'),
      opsNimi: createNimi('Testautomation Lukiokoulutus ops'),
      opsLuonti: async (page: Page) => await lukioOpsLuonti(page),
      opsSisallot: async (page: Page) => await lukioOpsSisallot(page),
      julkinenOpsTarkistukset: async (page: Page) => await lukioJulkinenOpsTarkistukset(page),
    },
  ].forEach(({ koulutustyyppi, projektiNimi, perusteDiaari, perusteSisallot, pohjaNimi, opsNimi, opsLuonti, opsSisallot, julkinenPerusteTarkistukset, julkinenOpsTarkistukset }) => {
    perusteProjektit[koulutustyyppi] = {
      nimi: projektiNimi + ' (' + perusteDiaari + ')',
      diaari: perusteDiaari,
    };

    test(`Luo, päivitä ja julkaise peruste ja ops ${koulutustyyppi}`, async ({ page }) => {
      await perusteenTestit(page, koulutustyyppi, projektiNimi, perusteDiaari, perusteSisallot, julkinenPerusteTarkistukset);
      await opetussuunnitelmanTestit(page, koulutustyyppi, pohjaNimi, opsNimi, opsLuonti, opsSisallot, julkinenOpsTarkistukset);
    });
  });

  async function perusteenTestit(
    page: Page,
    koulutustyyppi: string,
    projektiNimi: string,
    perusteDiaari: string,
    perusteSisallot: (page: Page, url: string) => Promise<void>,
    julkinenPerusteTarkistukset: (page: Page) => Promise<void>
    )
  {
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
    const perusteProjektiUrl = page.url();
    perusteProjektiUrls.push(perusteProjektiUrl);

    await page.goto(perusteProjektiUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
    await page.getByRole('button', { name: 'Muokkaa' }).click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').fill(projektiNimi);
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').fill(perusteDiaari);
    await page.getByRole('group', { name: 'Määräyksen päätöspäivämäärä' }).click();
    await page.getByRole('button', { name: '2' }).first().click();
    // Alku ja loppupäivä samassa groupissa, joten pitää kaivaa syvemmältä, jotta voi asettaa päivämäärän
    await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
    await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '2' }).first().click();
    await page.locator('li').filter({ hasText: 'Liitteet ja määräykset' }).click();
    await page.locator('.ProseMirror').fill("Kuvausteksti");
    await page.setInputFiles('input[type="file"]', './files/testpdf.pdf');
    // odotetaan, että pdf ladataan selaimeen
    await waitMedium(page);
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');

    await perusteSisallot(page, perusteProjektiUrl);

    await page.goto(perusteProjektiUrl);
    await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
    await expect(page.locator('.julkaisu')).toContainText('Uusin versio');

    await page.goto(DEFAULT_VALUES.julkinenMaarayksetUrl);
    await waitSmall(page);
    await page.getByPlaceholder('Hae määräyksiä').fill(projektiNimi);
    await waitSmall(page);
    await expect(page.locator('.maarays')).toHaveCount(1);
    await page.getByRole('link', { name: projektiNimi }).click();
    await expect(page.locator('.url')).toContainText('Avaa määräys');

    await page.goto(perusteProjektiUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
    await expect(page.locator('.sisalto')).toContainText('Julkaistu');
    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
    await expect(page.locator('.sisalto')).toContainText('Työversio');

    await page.goto(DEFAULT_VALUES.julkinenKoosteUrlUrl + koulutustyyppi.toLowerCase());
    await expect(page.locator('body')).toContainText(projektiNimi);
    await page.getByRole('link', { name: projektiNimi }).click();
    await waitMedium(page);
    await expect(page.locator('h1')).toContainText(projektiNimi);

    await julkinenPerusteTarkistukset(page);
  }

  async function opetussuunnitelmanTestit(page: Page, koulutustyyppi: string, pohjaNimi: string, opsNimi: string, opsLuonti: (page: Page) => Promise<void>, opsSisallot: (page: Page) => Promise<void>, julkinenOpsTarkistukset: (page: Page) => Promise<void>) {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(DEFAULT_VALUES.opsPohjatUrl);
    await expect(page.locator('.uusi')).toContainText('Luo uusi');
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    // odotetaan, että perustelistaus ladataan
    await waitMedium(page);
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(pohjaNimi);
    await page.getByRole('combobox').selectOption({ label: perusteProjektit[koulutustyyppi].nimi });
    await page.getByRole('button', { name: 'Luo pohja' }).click();
    await expect(page.locator('.done-icon')).toHaveCount(1);
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Aseta valmiiksi' }).click();
    await page.locator('.modal-content').getByRole('button', { name: 'Aseta valmiiksi' }).click();
    await expect(page.locator('body')).toContainText('Tilan vaihto onnistui');
    // otetaan ops-pohjan url talteen arkistointia varten.
    const opsPohjaUrl = page.url()
    opsPohjaUrls.push(opsPohjaUrl);

    await page.goto(DEFAULT_VALUES.opsUrl);
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    await page.getByText('Kunnan tai koulutuksen järjestäjän opetussuunnitelman', { exact: true }).click();
    await page.getByText('Vain perustetta', { exact: true }).click();
    await expect(page.locator('.multiselect')).toHaveCount(1);
    await page.locator('.multiselect').first().click();
    await page.getByText(pohjaNimi + ' (' + perusteProjektit[koulutustyyppi].diaari + ')').first().click();
    await page.locator('div').filter({ hasText: /^Opetussuunnitelman nimi \*Tähän opetussuunnitelman nimi$/ }).getByRole('textbox').fill(opsNimi);
    await page.getByText('Lisää kunta', { exact: true }).click();
    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Jyväskylä').click();
    await waitSmall(page);
    await page.getByText('Lisää koulutuksen järjestäjä', { exact: true }).click();
    await page.getByRole('combobox').nth(2).click();
    await page.getByText('Jyväskylän kaupunki').click();
    await opsLuonti(page);
    await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
    await expect(page.locator('body')).toContainText('Opetussuunnitelma luotu onnistuneesti');
    // otetaan opsin url talteen, jonka avulla testataan loput opsiin liittyvät.
    const opetussuunnitelmaUrl = page.url();
    opetussuunnitelmaUrls.push(opetussuunnitelmaUrl);

    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Tiedot' }).click();
    await page.getByRole('button', { name: 'Muokkaa' }).click();
    await page.getByRole('textbox').nth(1).fill('test');
    await page.getByText('Suomi').nth(3).click();
    await page.getByText('Valitse päivämäärä').click();
    await page.getByRole('button', { name: '1' }).first().click();
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');

    await opsSisallot(page);

    await page.goto(opetussuunnitelmaUrl);
    await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
    await expect(page.locator('.julkaisu').first()).toContainText('Julkaistu versio');

    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
    await expect(page.locator('.sisalto')).toContainText('Julkaistu');
    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
    await expect(page.locator('.sisalto').first()).toContainText('Työversio');

    await page.goto(DEFAULT_VALUES.julkinenKoosteUrlUrl + koulutustyyppi.toLowerCase());
    await page.getByPlaceholder('Hae opetussuunnitelmaa').fill(opsNimi);
    await expect(page.locator('body')).toContainText(opsNimi);
    await page.getByRole('link', { name: opsNimi }).click();
    await expect(page.locator('h1')).toContainText(opsNimi);

    await julkinenOpsTarkistukset(page);
  }

  test.afterAll(async ({ browser }) => {
    let page = await browser.newPage();

    await login(page, DEFAULT_VALUES.basePerusteetUrl);
    for await (const perusteProjektiUrl of perusteProjektiUrls) {
      await page.goto(perusteProjektiUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('Arkistoitu onnistuneesti');
      await waitMedium(page);
    }

    await page.close();
    page = await browser.newPage();
    await login(page, DEFAULT_VALUES.baseYlopsUrl);

    for await (const opetussuunnitelmaUrl of opetussuunnitelmaUrls) {
      await page.goto(opetussuunnitelmaUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi opetussuunnitelma' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('Arkistoitu onnistuneesti');
      await waitMedium(page);
    }

    for await (const opsPohjaUrl of opsPohjaUrls) {
      await page.goto(opsPohjaUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi pohja' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('Arkistoitu onnistuneesti');
      await waitMedium(page);
    }

    await page.close();
  });
});
