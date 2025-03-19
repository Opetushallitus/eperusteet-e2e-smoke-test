import { test, expect, Page } from '@playwright/test';
import {DEFAULT_VALUES} from "../utils/defaultvalues";
import {createNimi, login, waitMedium, waitSmall} from "../utils/commonmethods";
import { perusopetuksenSisallot, perusopetusJulkinenOpsTarkistukset, perusopetusOpsLuonti, perusopetusOpsSisallot } from './sisallot/perusopetusSisalto';
import { varhaiskasvatusJulkinenOpsTarkistukset, varhaiskasvatusSisallot } from './sisallot/varhaiskasvatusSisalto';
import { lukioJulkinenOpsTarkistukset, lukioJulkinenTarkistukset, lukioOpsLuonti, lukioOpsSisallot, lukioSisallot } from './sisallot/lukioSisallot';
import { perusteenLuontiJaTestit } from './sisallot/perusteSisalto';
import { ammatillinenLisaTarkistukset, ammatillinenPerusteJulkinenTarkastukset, ammatillinenPerusteSisallot, ammatillinenToteutussuunnitelmaJulkinenTarkastukset } from './sisallot/ammatillinenSisallot';
import { opetussuunnitelmanLuontiJaTestit } from './sisallot/opstyokalu';
import { yleissivistavatJulkinenTarkistukset, yleissivistavatLisaTarkastukset } from './sisallot/yleissivistavat';
import { toteutussuunnitelmaLuontiJaTestit } from './sisallot/totsutyokalu';

export interface TestData {
  page: Page;
  projektiNimi: string;
  opsNimi: string;
  pohjaNimi?: string;
  perusteDiaari: string;
  koulutustyyppi: string;
  url?: string;
};

test.describe.configure({ mode: 'serial' });
test.describe('Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;

  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

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
      perusteSisallot: async (testData: TestData) => await varhaiskasvatusSisallot(testData),
      julkinenPerusteTarkistukset: async (testData: TestData) => await yleissivistavatJulkinenTarkistukset(testData),
      pohjaNimi: createNimi('Testautomation varhaiskasvatus pohja'),
      opsNimi: createNimi('Testautomation varhaiskasvatus ops'),
      opsLuonti: async (testData: TestData) => {},
      opsSisallot: async (testData: TestData) => {},
      lisaTarkistukset: async (testData: TestData) => await yleissivistavatLisaTarkastukset(testData),
      julkinenOpsTarkistukset: async (testData: TestData) => varhaiskasvatusJulkinenOpsTarkistukset(testData),
      paikallinentyokalu: 'opstyokalu',
    },
    {
      koulutustyyppi: 'Perusopetus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Perusopetus'),
      perusteSisallot: async (testData: TestData) => await perusopetuksenSisallot(testData),
      julkinenPerusteTarkistukset: async (testData: TestData) => await yleissivistavatJulkinenTarkistukset(testData),
      pohjaNimi: createNimi('Testautomation perusopetus pohja'),
      opsNimi: createNimi('Testautomation perusopetus ops'),
      opsLuonti: async (testData: TestData) => await perusopetusOpsLuonti(testData),
      opsSisallot: async (testData: TestData) => await perusopetusOpsSisallot(testData),
      lisaTarkistukset: async (testData: TestData) => await yleissivistavatLisaTarkastukset(testData),
      julkinenOpsTarkistukset: async (testData: TestData) => await perusopetusJulkinenOpsTarkistukset(testData),
      paikallinentyokalu: 'opstyokalu',
    },
    {
      koulutustyyppi: 'Lukiokoulutus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Lukiokoulutus'),
      perusteSisallot: async (testData: TestData) => await lukioSisallot(testData),
      julkinenPerusteTarkistukset: async (testData: TestData) => await lukioJulkinenTarkistukset(testData),
      pohjaNimi: createNimi('Testautomation Lukiokoulutus pohja'),
      opsNimi: createNimi('Testautomation Lukiokoulutus ops'),
      opsLuonti: async (testData: TestData) => await lukioOpsLuonti(testData),
      opsSisallot: async (testData: TestData) => await lukioOpsSisallot(testData),
      lisaTarkistukset: async (testData: TestData) => await yleissivistavatLisaTarkastukset(testData),
      julkinenOpsTarkistukset: async (testData: TestData) => await lukioJulkinenOpsTarkistukset(testData),
      paikallinentyokalu: 'opstyokalu',
    },
    {
      koulutustyyppi: 'Ammatillinen perustutkinto',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation ammatillinen'),
      perusteSisallot: async (testData: TestData) => await ammatillinenPerusteSisallot(testData),
      julkinenPerusteTarkistukset: async (testData: TestData) => await ammatillinenPerusteJulkinenTarkastukset(testData),
      pohjaNimi: undefined,
      opsNimi: createNimi('Testautomation ammatillinen totsu'),
      opsLuonti: async (testData: TestData) => {},
      opsSisallot: async (testData: TestData) => {},
      lisaTarkistukset: async (testData: TestData) => await ammatillinenLisaTarkistukset(testData),
      julkinenOpsTarkistukset: async (testData: TestData) => ammatillinenToteutussuunnitelmaJulkinenTarkastukset(testData),
      paikallinentyokalu: 'totsutyokalu',
    },
  ].forEach(({ koulutustyyppi, projektiNimi, perusteDiaari, perusteSisallot, pohjaNimi, opsNimi, opsLuonti, opsSisallot, lisaTarkistukset, julkinenPerusteTarkistukset, julkinenOpsTarkistukset, paikallinentyokalu }) => {

    const testData: TestData = {
      page,
      projektiNimi,
      opsNimi,
      pohjaNimi,
      perusteDiaari,
      koulutustyyppi,
    };

    test(`Luo, päivitä ja julkaise peruste ja ops ${koulutustyyppi}`, async ({ page, browser }) => {
      testData.page = await browser.newPage();
      await perusteenLuontiJaTestit(
        testData,
        perusteSisallot,
        lisaTarkistukset,
        julkinenPerusteTarkistukset,
        (url: string) => perusteProjektiUrls.push(url)
      );

      testData.page = await browser.newPage();
      if (paikallinentyokalu === 'opstyokalu') {
        await opetussuunnitelmanLuontiJaTestit(
          testData,
          opsLuonti,
          opsSisallot,
          julkinenOpsTarkistukset,
          (url: string) => opetussuunnitelmaUrls.push(url),
        );
      }

      if (paikallinentyokalu === 'totsutyokalu') {
        await toteutussuunnitelmaLuontiJaTestit(
          testData,
          opsLuonti,
          opsSisallot,
          julkinenOpsTarkistukset,
          (url: string) => opetussuunnitelmaUrls.push(url),
        )
      }

    });
  });

  test.afterAll(async ({ browser }) => {
    let page = await browser.newPage();

    await login(page, DEFAULT_VALUES.basePerusteetUrl);
    for await (const perusteProjektiUrl of perusteProjektiUrls) {
      console.log('perusteProjektiUrl', perusteProjektiUrl);

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
      console.log('opetussuunnitelmaUrl', opetussuunnitelmaUrl);

      await page.goto(opetussuunnitelmaUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('Arkistoitu');
      await waitMedium(page);
    }

    await page.close();
  });
});
