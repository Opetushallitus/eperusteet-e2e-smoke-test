import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { createKotoOpetussuunnitelma, kotoOpetussuunnitelmaJulkinenTarkistukset, kotoOpetussuunnitelmaSisallot, kotoPerusteJulkisetTarkistukset, kotoPerusteSisallot } from '../sisallot/kotoSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Kotoutumiskoulutus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Kotoutumiskoulutuksen opetussuunnitelman perusteet';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation koto');
  const opsNimi = createNimi('Testautomation koto ops');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    perusteDiaari,
    koulutustyyppi,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    await perusteenLuontiJaTestit(
      testData,
      kotoPerusteSisallot,
      kotoPerusteJulkisetTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
    );

    testData.page = await browser.newPage();
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      kotoOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createKotoOpetussuunnitelma,
      kotoOpetussuunnitelmaSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url);
    }
  });
});
