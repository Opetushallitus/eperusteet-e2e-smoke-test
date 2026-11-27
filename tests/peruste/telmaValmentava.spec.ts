import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum, testAutomationPrefix } from "../utils/testUtils";
import { createTelmaValmentavaOpetussuunnitelma, createTelmaValmentavaOpetussuunnitelmaPohja, telmaValmentavaOpetussuunnitelmaJulkinenTarkistukset, telmaValmentavaOpetussuunnitelmaSisallot, telmaValmentavaPerusteJulkisetTarkistukset, telmaValmentavaPerusteSisallot } from '../sisallot/telmaValmentavaSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Telma valmentava koulutus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Telma';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi(`${testAutomationPrefix}telma valmentava`);
  const opsNimi = createNimi(`${testAutomationPrefix}telma valmentava ops`);
  const pohjaNimi = createNimi(`${testAutomationPrefix}telma valmentava oph pohja`);

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

    console.log('perusteenLuontiJaTestit - Telma valmentava koulutus');
    await perusteenLuontiJaTestit(
      testData,
      telmaValmentavaPerusteSisallot,
      telmaValmentavaPerusteJulkisetTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
    );

    testData.page = await browser.newPage();
    console.log('amosaaOpetussuunnitelmaLuonti - Telma valmentava koulutus');
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      telmaValmentavaOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createTelmaValmentavaOpetussuunnitelma,
      telmaValmentavaOpetussuunnitelmaSisallot,
      createTelmaValmentavaOpetussuunnitelmaPohja,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Telma valmentava koulutus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
