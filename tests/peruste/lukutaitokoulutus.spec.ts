import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { createLukutaitoOpetussuunnitelma, lukutaitoOpetussuunnitelmaJulkinenTarkistukset, lukutaitoOpetussuunnitelmaSisallot, lukutaitoPerusteJulkisetTarkistukset, lukutaitoPerusteSisallot } from '../sisallot/lukutaitoSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Lukutaitokoulutus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Lukutaitokoulutus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation lukutaito');
  const opsNimi = createNimi('Testautomation lukutaito ops');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    perusteDiaari,
    koulutustyyppi,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('perusteenLuontiJaTestit - Lukutaitokoulutus');
    await perusteenLuontiJaTestit(
      testData,
      lukutaitoPerusteSisallot,
      lukutaitoPerusteJulkisetTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
    );

    testData.page = await browser.newPage();
    console.log('amosaaOpetussuunnitelmaLuonti - Lukutaitokoulutus');
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      lukutaitoOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createLukutaitoOpetussuunnitelma,
      lukutaitoOpetussuunnitelmaSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Lukutaitokoulutus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
