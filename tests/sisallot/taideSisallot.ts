import { expect, Page } from "@playwright/test";
import { perusteenTekstikappale } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";
import { yleissivistavatJulkinenTarkistukset } from "./yleissivistavat";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { saveAndCheck, waitMedium, waitSmall } from "../../utils/commonmethods";

export async function taideSisallot(testData: TestData) {
  let page = testData.page;
  await perusteenTekstikappale(page);

  await page.locator('button').filter({ hasText: 'Uusi taiteenala' }).first().click();
  await expect(page.locator('button').filter({ hasText: 'Hae koodistosta' })).toBeVisible();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal')).toContainText('Alkuvaihe');
  await page.getByText('Alkuvaihe').click();
  await expect(page.locator('.modal')).not.toBeVisible();

  await page.locator('.ProseMirror').nth(0).fill('alkuvaihe kuvaus');

  await page.locator('button').filter({ hasText: 'Lisää tekstikappale' }).click();
  await expect(page.locator('.ProseMirror')).toHaveCount(2);
  await page.locator('input[type="text"]').last().fill('alkuvaiheteksti 1');
  await page.locator('.ProseMirror').last().fill('alkuvaiheteksti 1 kuvaus');
  await saveAndCheck(page);
}

export async function taideJulkinenPerusteTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi;

  await page.goto(DEFAULT_VALUES.julkinenTaideKoosteUrlUrl);
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator('h1')).toContainText(projektiNimi);

  await expect(page.locator('.navigation-tree')).toContainText('Alkuvaihe');
  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');

  await page.locator('.navigation-tree').getByText('Alkuvaihe').click();
  await expect(page.locator('.content')).toContainText('alkuvaihe kuvaus');
  await expect(page.locator('.navigation-tree')).toContainText('alkuvaiheteksti 1');
  await page.locator('.navigation-tree').getByText('alkuvaiheteksti 1').click();
  await expect(page.locator('.content')).toContainText('alkuvaiheteksti 1 kuvaus');
}

export async function taideOpsSisallot(testData: TestData) {
  let page = testData.page;
  await expect(page.locator('.navigation')).toContainText('Alkuvaihe');
  await page.locator('.navigation').getByText('Alkuvaihe').click();

  await waitSmall(page);
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.locator('button').filter({ hasText: 'Muokkaa' }).click();
  await waitSmall(page);
  await expect(page.locator('.ProseMirror.form-control')).toHaveCount(1);
  await page.locator('.ProseMirror.form-control').nth(0).fill('alkuvaihe paikallinen tarkennus');

  await saveAndCheck(page);
}

export async function taideJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;
  await expect(page.locator('.navigation-tree')).toContainText('Alkuvaihe');
  await page.locator('.navigation-tree').getByText('Alkuvaihe').click();
  await expect(page.locator('.content')).toContainText('alkuvaihe paikallinen tarkennus');
}
