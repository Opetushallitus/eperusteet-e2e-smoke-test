import { test, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import {
  aikuistenperusopetusSisallot,
  aikuistenperusopetusJulkinenOpsTarkistukset,
  aikuistenperusopetusJulkinenPerusteTarkistukset,
  aikuistenperusopetusOpsSisallot,
} from '../sisallot/aikuistenperusopetusSisalto';
import { yleissivistavatLisaTarkastukset } from '../sisallot/yleissivistavat';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from '../sisallot/opstyokalu';
import { DEFAULT_VALUES } from '../../utils/defaultvalues';

test.describe('Aikuisten perusopetus - Uusi peruste ja perusteesta OPS', async () => {
  let page!: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Aikuisten perusopetus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation Aikuisten perusopetus');
  const opsNimi = createNimi('Testautomation aikuisten perusopetus ops');
  const pohjaNimi = createNimi('Testautomation aikuisten perusopetus pohja');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    pohjaNimi,
    perusteDiaari,
    koulutustyyppi,
    julkinenKoosteUrl: DEFAULT_VALUES.julkinenPerusopetusKoosteUrl,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('perusteenLuontiJaTestit - Aikuisten perusopetus');
    await perusteenLuontiJaTestit(
      testData,
      aikuistenperusopetusSisallot,
      aikuistenperusopetusJulkinenPerusteTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
      yleissivistavatLisaTarkastukset,
    );

    testData.page = await browser.newPage();
    console.log('opsTyokaluOpetussuunnitelmanLuontiJaTestit - Aikuisten perusopetus');
    await opsTyokaluOpetussuunnitelmanLuontiJaTestit(
      testData,
      aikuistenperusopetusJulkinenOpsTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      async (testData: TestData) => {},
      aikuistenperusopetusOpsSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Aikuisten perusopetus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
