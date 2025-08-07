import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { createTuvaOpetussuunnitelma, createTuvaOpetussuunnitelmaPohja, tuvaOpetussuunnitelmaJulkinenTarkistukset, tuvaOpetussuunnitelmaSisallot, tuvaPerusteJulkisetTarkistukset, tuvaPerusteSisallot } from '../sisallot/tuvaSisalto';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Tutkintokoulutukseen valmentava koulutus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Tutkintokoulutukseen valmentava koulutus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation tuva');
  const opsNimi = createNimi('Testautomation tuva ops');
  const pohjaNimi = createNimi('Testautomation tuva oph pohja');

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

    console.log('perusteenLuontiJaTestit - Tutkintokoulutukseen valmentava koulutus');
    await perusteenLuontiJaTestit(
      testData,
      tuvaPerusteSisallot,
      tuvaPerusteJulkisetTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
    );

    testData.page = await browser.newPage();
    console.log('amosaaOpetussuunnitelmaLuonti - Tutkintokoulutukseen valmentava koulutus');
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      tuvaOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createTuvaOpetussuunnitelma,
      tuvaOpetussuunnitelmaSisallot,
      createTuvaOpetussuunnitelmaPohja,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Tutkintokoulutukseen valmentava koulutus');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
