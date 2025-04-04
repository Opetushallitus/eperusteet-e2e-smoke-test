import { test, expect, Page } from '@playwright/test';
import {CI_baseUrl, DEFAULT_VALUES} from "../utils/defaultvalues";
import {createNimi, login, waitMedium, waitSmall} from "../utils/commonmethods";
import { perusopetuksenSisallot, perusopetusJulkinenOpsTarkistukset, perusopetusOpsLuonti, perusopetusOpsSisallot } from './sisallot/perusopetusSisalto';
import { varhaiskasvatusJulkinenOpsTarkistukset, varhaiskasvatusSisallot } from './sisallot/varhaiskasvatusSisalto';
import { lukioJulkinenOpsTarkistukset, lukioJulkinenTarkistukset, lukioOpsLuonti, lukioOpsSisallot, lukioSisallot } from './sisallot/lukioSisallot';
import { perusteenLuontiJaTestit } from './sisallot/perusteSisalto';
import { ammatillinenLisaTarkistukset, ammatillinenPerusteJulkinenTarkastukset, ammatillinenPerusteSisallot, ammatillinenToteutussuunnitelmaJulkinenTarkastukset, createToteutussuunnitelma } from './sisallot/ammatillinenSisallot';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from './sisallot/opstyokalu';
import { yleissivistavatJulkinenTarkistukset, yleissivistavatLisaTarkastukset } from './sisallot/yleissivistavat';
import { amosaaOpetussuunnitelmaLuonti } from './sisallot/totsutyokalu';
import { createJotpaOpetussuunnitelma, createVstOpetussuunnitelma, jotpaOpetussuunnitelmaJulkinenTarkistukset, vstOpetussuunnitelmaJulkinenTarkistukset, vstOpetussuunnitelmaSisallot, vstPerusteJulkisetTarkistukset, vstPerusteSisallot } from './sisallot/vstSisallot';
import { createTuvaOpetussuunnitelma, createTuvaOpetussuunnitelmaPohja, tuvaOpetussuunnitelmaJulkinenTarkistukset, tuvaOpetussuunnitelmaSisallot, tuvaPerusteJulkisetTarkistukset, tuvaPerusteSisallot } from './sisallot/tuvaSisalto';

export interface TestData {
  page: Page;
  projektiNimi?: string;
  opsNimi?: string;
  pohjaNimi?: string;
  perusteDiaari?: string;
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
      perusteSisallot: varhaiskasvatusSisallot,
      lisaTarkistukset: yleissivistavatLisaTarkastukset,
      julkinenPerusteTarkistukset: yleissivistavatJulkinenTarkistukset,
      opsNimi: createNimi('Testautomation varhaiskasvatus ops'),
      pohjaNimi: createNimi('Testautomation varhaiskasvatus pohja'),
      opsLuonti: async (testData: TestData) => {},
      opsSisallot: async (testData: TestData) => {},
      paikallinenLuontiJaTestit: opsTyokaluOpetussuunnitelmanLuontiJaTestit,
      julkinenOpsTarkistukset: varhaiskasvatusJulkinenOpsTarkistukset,
    },
    {
      koulutustyyppi: 'Perusopetus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Perusopetus'),
      perusteSisallot: perusopetuksenSisallot,
      lisaTarkistukset: yleissivistavatLisaTarkastukset,
      julkinenPerusteTarkistukset: yleissivistavatJulkinenTarkistukset,
      pohjaNimi: createNimi('Testautomation perusopetus pohja'),
      opsNimi: createNimi('Testautomation perusopetus ops'),
      opsLuonti: perusopetusOpsLuonti,
      opsSisallot: perusopetusOpsSisallot,
      paikallinenLuontiJaTestit: opsTyokaluOpetussuunnitelmanLuontiJaTestit,
      julkinenOpsTarkistukset: perusopetusJulkinenOpsTarkistukset,
    },
    {
      koulutustyyppi: 'Lukiokoulutus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation Lukiokoulutus'),
      perusteSisallot: lukioSisallot,
      lisaTarkistukset: yleissivistavatLisaTarkastukset,
      julkinenPerusteTarkistukset: lukioJulkinenTarkistukset,
      opsNimi: createNimi('Testautomation Lukiokoulutus ops'),
      pohjaNimi: createNimi('Testautomation Lukiokoulutus pohja'),
      opsLuonti: lukioOpsLuonti,
      opsSisallot: lukioOpsSisallot,
      paikallinenLuontiJaTestit: opsTyokaluOpetussuunnitelmanLuontiJaTestit,
      julkinenOpsTarkistukset: lukioJulkinenOpsTarkistukset,
    },
    {
      koulutustyyppi: 'Ammatillinen perustutkinto',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation ammatillinen'),
      perusteSisallot: ammatillinenPerusteSisallot,
      lisaTarkistukset: ammatillinenLisaTarkistukset,
      julkinenPerusteTarkistukset: ammatillinenPerusteJulkinenTarkastukset,
      opsNimi: createNimi('Testautomation ammatillinen totsu'),
      pohjaNimi: undefined,
      opsLuonti: createToteutussuunnitelma,
      opsSisallot: async (testData: TestData) => {},
      paikallinenLuontiJaTestit: amosaaOpetussuunnitelmaLuonti,
      julkinenOpsTarkistukset: ammatillinenToteutussuunnitelmaJulkinenTarkastukset,
    },
    {
      koulutustyyppi: 'Vapaa sivistystyö',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation vst'),
      perusteSisallot: vstPerusteSisallot,
      julkinenPerusteTarkistukset: vstPerusteJulkisetTarkistukset,
      lisaTarkistukset: async (testData: TestData) => {},
      opsNimi: createNimi('Testautomation vst ops'),
      pohjaNimi: undefined,
      opsLuonti: createVstOpetussuunnitelma,
      opsSisallot: vstOpetussuunnitelmaSisallot,
      paikallinenLuontiJaTestit: amosaaOpetussuunnitelmaLuonti,
      julkinenOpsTarkistukset: vstOpetussuunnitelmaJulkinenTarkistukset,
    },
    {
      koulutustyyppi: 'Vapaa sivistystyö - jotpa',
      opsNimi: createNimi('Testautomation vst ops'),
      pohjaNimi: undefined,
      opsLuonti: createJotpaOpetussuunnitelma,
      opsSisallot: vstOpetussuunnitelmaSisallot,
      paikallinenLuontiJaTestit: amosaaOpetussuunnitelmaLuonti,
      julkinenOpsTarkistukset: jotpaOpetussuunnitelmaJulkinenTarkistukset,
    },
    {
      koulutustyyppi: 'Tutkintokoulutukseen valmentava koulutus',
      perusteDiaari: `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`,
      projektiNimi: createNimi('TestAutomation tuva'),
      perusteSisallot: tuvaPerusteSisallot,
      julkinenPerusteTarkistukset: tuvaPerusteJulkisetTarkistukset,
      lisaTarkistukset: async (testData: TestData) => {},
      opsNimi: createNimi('Testautomation tuva ops'),
      pohjaNimi: createNimi('Testautomation tuva oph pohja'),
      paikallinenLuontiJaTestit: amosaaOpetussuunnitelmaLuonti,
      opsPohjaLuonti: createTuvaOpetussuunnitelmaPohja,
      opsLuonti: createTuvaOpetussuunnitelma,
      opsSisallot: tuvaOpetussuunnitelmaSisallot,
      julkinenOpsTarkistukset: tuvaOpetussuunnitelmaJulkinenTarkistukset,
    },
  ].forEach(({
    koulutustyyppi,
    projektiNimi,
    perusteDiaari,
    perusteSisallot,
    pohjaNimi,
    opsNimi,
    opsPohjaLuonti,
    opsLuonti,
    opsSisallot,
    lisaTarkistukset,
    julkinenPerusteTarkistukset,
    julkinenOpsTarkistukset,
    paikallinenLuontiJaTestit }) => {

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

      if (projektiNimi) {
        await perusteenLuontiJaTestit(
          testData,
          perusteSisallot,
          lisaTarkistukset,
          julkinenPerusteTarkistukset,
          (url: string) => perusteProjektiUrls.push(url)
        );
      }

      testData.page = await browser.newPage();
      if (paikallinenLuontiJaTestit) {
        await paikallinenLuontiJaTestit(
            testData,
            opsLuonti,
            opsSisallot,
            julkinenOpsTarkistukset,
            (url: string) => opetussuunnitelmaUrls.push(url),
            opsPohjaLuonti,
        )
      }
    });
  });

  test.afterAll(async ({ browser }) => {
    for await (const perusteProjektiUrl of perusteProjektiUrls) {
      console.log('perusteProjektiUrl', perusteProjektiUrl);

      let page = await browser.newPage();
      await login(page, CI_baseUrl);
      await page.goto(perusteProjektiUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('arkistoitu', { ignoreCase: true });
      await page.close();
    }


    for await (const opetussuunnitelmaUrl of opetussuunnitelmaUrls) {
      console.log('opetussuunnitelmaUrl', opetussuunnitelmaUrl);

      let page = await browser.newPage();
      await login(page, CI_baseUrl);
      await page.goto(opetussuunnitelmaUrl);
      await expect(page.locator('body')).toContainText('Lisätoiminnot');
      await page.getByText('Lisätoiminnot').click();
      await page.getByRole('menuitem', { name: 'Arkistoi' }).click();
      await page.getByRole('button', { name: 'Kyllä' }).click();
      await expect(page.locator('body')).toContainText('arkistoitu', { ignoreCase: true });
      await page.close();
    }

  });
});
