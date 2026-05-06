import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { varhaiskasvatusSisallot } from '../sisallot/varhaiskasvatusSisalto';
import { yleissivistavatLisaTarkastukset, yleissivistavatJulkinenTarkistukset } from '../sisallot/yleissivistavat';
import { varhaiskasvatusJulkinenOpsTarkistukset } from '../sisallot/varhaiskasvatusSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from '../sisallot/opstyokalu';

test.describe('Varhaiskasvatus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Varhaiskasvatus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation Varhaiskasvatus');
  const opsNimi = createNimi('Testautomation varhaiskasvatus ops');
  const pohjaNimi = createNimi('Testautomation varhaiskasvatus pohja');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    pohjaNimi,
    perusteDiaari,
    koulutustyyppi,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('perusteenLuontiJaTestit - Varhaiskasvatus');
    await perusteenLuontiJaTestit(
      testData,
      varhaiskasvatusSisallot,
      yleissivistavatJulkinenTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
      yleissivistavatLisaTarkastukset,
    );

    testData.page = await browser.newPage();
    console.log('opsTyokaluOpetussuunnitelmanLuontiJaTestit - Varhaiskasvatus');
    await opsTyokaluOpetussuunnitelmanLuontiJaTestit(
      testData,
      varhaiskasvatusJulkinenOpsTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      async (testData: TestData) => {},
      async (testData: TestData) => {},
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Varhaiskasvatus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
