import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { ammatillinenLisaTarkistukset, ammatillinenPerusteJulkinenTarkastukset, ammatillinenPerusteSisallot, ammatillinenToteutussuunnitelmaJulkinenTarkastukset, createToteutussuunnitelma } from '../sisallot/ammatillinenSisallot';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Ammatillinen perustutkinto - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Ammatillinen perustutkinto';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation ammatillinen');
  const opsNimi = createNimi('Testautomation ammatillinen totsu');

  const testData: TestData = {
    page,
    projektiNimi,
    opsNimi,
    pohjaNimi: undefined,
    perusteDiaari,
    koulutustyyppi,
    pdfLkm: 3,
  };

  test(`Luo, päivitä ja julkaise peruste ja ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    console.log('perusteenLuontiJaTestit - Ammatillinen perustutkinto');
    testData.page = await browser.newPage();

    await perusteenLuontiJaTestit(
      testData,
      ammatillinenPerusteSisallot,
      ammatillinenPerusteJulkinenTarkastukset,
      (url: string) => perusteProjektiUrls.push(url),
      ammatillinenLisaTarkistukset,
    );

    console.log('amosaaOpetussuunnitelmaLuonti - Ammatillinen perustutkinto');
    testData.page = await browser.newPage();
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      ammatillinenToteutussuunnitelmaJulkinenTarkastukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createToteutussuunnitelma,
      async (testData: TestData) => {},
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive peruste ja ops - Ammatillinen perustutkinto');
    for await (const url of perusteProjektiUrls) {
      await archiveFoundation(browser, url, projektiNimi);
    }

    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
