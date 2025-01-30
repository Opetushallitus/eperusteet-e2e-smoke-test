import { Page } from "@playwright/test";

export async function lukioSisallot(page: Page, url: string) {

}

export async function lukioOpsLuonti(page: Page) {
  await page.getByLabel("Ei", { exact: true }).nth(0).click({ force: true});
  await page.getByLabel("Ei", { exact: true }).nth(1).click({ force: true});
}

export async function lukioOpsSisallot(page: Page) {
}

export async function lukioJulkinenOpsTarkistukset(page: Page) {
}
