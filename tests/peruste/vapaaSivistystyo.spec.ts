import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { createVstOpetussuunnitelma, vstOpetussuunnitelmaJulkinenTarkistukset, vstOpetussuunnitelmaSisallot, vstPerusteJulkisetTarkistukset, vstPerusteSisallot } from '../sisallot/vstSisallot';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Vapaa sivistystyö - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Vapaa sivistystyö';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation vst');
  const opsNimi = createNimi('Testautomation vst ops');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    perusteDiaari,
    koulutustyyppi,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('perusteenLuontiJaTestit - Vapaa sivistystyö');
    await perusteenLuontiJaTestit(
      testData,
      vstPerusteSisallot,
      vstPerusteJulkisetTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
    );

    testData.page = await browser.newPage();
    console.log('amosaaOpetussuunnitelmaLuonti - Vapaa sivistystyö');
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      vstOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createVstOpetussuunnitelma,
      vstOpetussuunnitelmaSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Vapaa sivistystyö');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
