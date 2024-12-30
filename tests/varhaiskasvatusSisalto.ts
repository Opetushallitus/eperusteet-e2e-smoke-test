import { expect, Page } from "@playwright/test";
import { perusteenTekstikappale } from "./perusteSisalto";

export async function varhaiskasvatusSisallot(page: Page) {
  await perusteenTekstikappale(page);
}

export async function varhaiskasvatusJulkinenOpsTarkistukset(page: Page) {
  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');
}
