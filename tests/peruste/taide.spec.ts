import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { varhaiskasvatusSisallot } from '../sisallot/varhaiskasvatusSisalto';
import { yleissivistavatLisaTarkastukset, yleissivistavatJulkinenTarkistukset } from '../sisallot/yleissivistavat';
import { varhaiskasvatusJulkinenOpsTarkistukset } from '../sisallot/varhaiskasvatusSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from '../sisallot/opstyokalu';
import { taideJulkinenOpsTarkistukset, taideJulkinenPerusteTarkistukset, taideOpsSisallot, taideSisallot } from '../sisallot/taideSisallot';
import { DEFAULT_VALUES } from '../../utils/defaultvalues';

test.describe('Taiteen perusopetus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Taiteen perusopetus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation Taiteen perusopetus');
  const opsNimi = createNimi('Testautomation Taiteen perusopetus ops');
  const pohjaNimi = createNimi('Testautomation Taiteen perusopetus pohja');
  const julkinenKoosteUrl = DEFAULT_VALUES.julkinenTaideKoosteUrlUrl;

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    pohjaNimi,
    perusteDiaari,
    koulutustyyppi,
    julkinenKoosteUrl,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('perusteenLuontiJaTestit - Taiteen perusopetus');
    await perusteenLuontiJaTestit(
      testData,
      taideSisallot,
      taideJulkinenPerusteTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
      yleissivistavatLisaTarkastukset,
    );

    testData.page = await browser.newPage();
    console.log('opsTyokaluOpetussuunnitelmanLuontiJaTestit - Taiteen perusopetus');
    await opsTyokaluOpetussuunnitelmanLuontiJaTestit(
      testData,
      taideJulkinenOpsTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      async (testData: TestData) => {},
      taideOpsSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Taiteen perusopetus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
