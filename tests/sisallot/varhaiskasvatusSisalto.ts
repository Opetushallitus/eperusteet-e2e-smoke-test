import { expect, Page } from "@playwright/test";
import { perusteenTekstikappale } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";

export async function varhaiskasvatusSisallot(testData: TestData) {
  await perusteenTekstikappale(testData.page);
}

export async function varhaiskasvatusJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;
  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');
}
