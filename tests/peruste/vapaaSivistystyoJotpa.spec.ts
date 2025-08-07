import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveCurriculum } from "../utils/testUtils";
import { createJotpaOpetussuunnitelma, jotpaOpetussuunnitelmaJulkinenTarkistukset, vstOpetussuunnitelmaSisallot } from '../sisallot/vstSisallot';
import { amosaaOpetussuunnitelmaLuonti } from '../sisallot/totsutyokalu';

test.describe('Vapaa sivistystyö - jotpa - Uusi OPS', async () => {
  let page: Page;
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Vapaa sivistystyö - jotpa';
  const opsNimi = createNimi('Testautomation vst ops');

  const testData: TestData = {
    page,
    opsNimi,
    koulutustyyppi,
  };

  test(`Luo, päivitä ja julkaise ops - ${koulutustyyppi}`, async ({ page, browser }) => {
    testData.page = await browser.newPage();

    console.log('amosaaOpetussuunnitelmaLuonti - Vapaa sivistystyö - jotpa');
    await amosaaOpetussuunnitelmaLuonti(
      testData,
      jotpaOpetussuunnitelmaJulkinenTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      createJotpaOpetussuunnitelma,
      vstOpetussuunnitelmaSisallot,
    );
  });

  test.afterAll(async ({ browser }) => {
    console.log('Archive ops - Vapaa sivistystyö - jotpa');
    for await (const url of opetussuunnitelmaUrls) {
      await archiveCurriculum(browser, url, opsNimi);
    }
  });
});
