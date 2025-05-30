import { test, expect, Page } from '@playwright/test';
import { createNimi } from "../../utils/commonmethods";
import { TestData, archiveFoundation, archiveCurriculum } from "../utils/testUtils";
import { lukioJulkinenOpsTarkistukset, lukioJulkinenTarkistukset, lukioOpsLuonti, lukioOpsSisallot, lukioSisallot } from '../sisallot/lukioSisallot';
import { yleissivistavatLisaTarkastukset } from '../sisallot/yleissivistavat';
import { perusteenLuontiJaTestit } from '../sisallot/perusteSisalto';
import { opsTyokaluOpetussuunnitelmanLuontiJaTestit } from '../sisallot/opstyokalu';

test.describe('Lukiokoulutus - Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;
  let perusteProjektiUrls: string[] = [];
  let opetussuunnitelmaUrls: string[] = [];

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  const koulutustyyppi = 'Lukiokoulutus';
  const perusteDiaari = `${Math.floor(100 + Math.random() * 900)}/${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}`;
  const projektiNimi = createNimi('TestAutomation Lukiokoulutus');
  const opsNimi = createNimi('Testautomation Lukiokoulutus ops');
  const pohjaNimi = createNimi('Testautomation Lukiokoulutus pohja');

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

    await perusteenLuontiJaTestit(
      testData,
      lukioSisallot,
      lukioJulkinenTarkistukset,
      (url: string) => perusteProjektiUrls.push(url),
      yleissivistavatLisaTarkastukset,
    );

    testData.page = await browser.newPage();
    await opsTyokaluOpetussuunnitelmanLuontiJaTestit(
      testData,
      lukioJulkinenOpsTarkistukset,
      (url: string) => opetussuunnitelmaUrls.push(url),
      lukioOpsLuonti,
      lukioOpsSisallot,
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
