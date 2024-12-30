import { expect, Page } from "@playwright/test";
import { waitSmall } from "../utils/commonmethods";

export async function perusteenTekstikappale(page: Page) {
  await page.getByRole('button', { name: 'Uusi tekstikappale' }).first().click();
  await page.locator('.modal-content').getByRole('textbox').fill('tekstikappale 1');
  await page.getByRole('button', { name: 'Lisää tekstikappale' }).click();
  await waitSmall(page);
  await expect(page.locator('body')).toContainText('tekstikappale 1');
}
