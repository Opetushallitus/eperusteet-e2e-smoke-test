import { expect } from "@playwright/test";
import { OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";
import { perusteenTekstikappale, PERUSTE_SMOKE } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";

export async function varhaiskasvatusSisallot(testData: TestData) {
  await perusteenTekstikappale(testData.page);
}

export async function varhaiskasvatusJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;

  await expect(page.locator('.navigation-tree')).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await page.locator('.navigation-tree').getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator('.content')).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    testData.opsNimi!,
    PERUSTE_SMOKE.tekstikappaleNimi,
    PERUSTE_SMOKE.tekstikappaleTeksti,
  ]);
}
