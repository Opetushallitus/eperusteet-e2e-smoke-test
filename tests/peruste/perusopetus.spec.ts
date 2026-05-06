import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { perusopetuksenSisallot, perusopetusJulkinenOpsTarkistukset, perusopetusOpsLuonti, perusopetusOpsSisallot } from '../sisallot/perusopetusSisalto';
import { yleissivistavatLisaTarkastukset, yleissivistavatJulkinenTarkistukset } from '../sisallot/yleissivistavat';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from '../sisallot/opstyokalu';
import { DEFAULT_VALUES } from '../../utils/defaultvalues';

test.describe('Perusopetus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Perusopetus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation Perusopetus');
  const opsNimi = createNimi('Testautomation perusopetus ops');
  const pohjaNimi = createNimi('Testautomation perusopetus pohja');

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

    console.log('perusteenLuontiJaTestit - Perusopetus');
    await perusteenLuontiJaTestit(
      testData,
      perusopetuksenSisallot,
      yleissivistavatJulkinenTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
      yleissivistavatLisaTarkastukset,
    );

    testData.page = await browser.newPage();
    console.log('opsTyokaluOpetussuunnitelmanLuontiJaTestit - Perusopetus');
    await opsTyokaluOpetussuunnitelmanLuontiJaTestit(
      testData,
      perusopetusJulkinenOpsTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      perusopetusOpsLuonti,
      perusopetusOpsSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Perusopetus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
