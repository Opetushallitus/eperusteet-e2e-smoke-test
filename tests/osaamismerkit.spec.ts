import test, { expect, Page } from "@playwright/test";
import { DEFAULT_VALUES } from "../utils/defaultvalues";
import { createNimi, login, waitSmall } from "../utils/commonmethods";
import { luoTeemaJaOsaamismerkki, poistaOsaamismerkki, tarkistaJulkisivuNakyvyys } from "./sisallot/osaamismerkit";

test.describe.configure({ mode: 'serial' });
test.describe('Uusi osaamismerkki', async () => {
  let page: Page;

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Luo, päivitä ja julkaise osaamismerkkiteema ja osaamismerkki', async ({ page, browser }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl);

    await luoTeemaJaOsaamismerkki(page);
    await tarkistaJulkisivuNakyvyys(page);

  });

  test.afterAll(async ({ browser }) => {
    await poistaOsaamismerkki(browser);
  });
});

// export async function luoTeemaJaOsaamismerkki(page: Page) {
//   await luoTeema(page);
//   await luoOsaamismerkki(page);
// }

// export async function luoTeema(page: Page) {
//   await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
//   await expect(page.locator('body')).toContainText('Osaamismerkit');
//   await expect(page.locator('body')).toContainText('Teemojen hallinta');
//   await page.click('text=Teemojen hallinta');
//   await expect(page.locator('body')).toContainText('Osaamismerkki-teemojen hallinta');
//   await page.click('text=Lisää teema');
//   await expect(page.locator('body .p-dialog-content')).toBeVisible();
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(0).fill(osaamismerkkiTeemaNimi);
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(1).fill(osaamismerkkiTeemaNimi + ' kuvaus');

//   await asetaKieli(page, 'Svenska');

//   await page.locator('.p-dialog-content').getByRole('textbox').nth(0).fill(osaamismerkkiTeemaNimi);
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(1).fill(osaamismerkkiTeemaNimi + ' kuvaus');

//   await asetaKieli(page, 'Suomi');

//   await page.setInputFiles('input[type="file"]', './files/osaamismerkki_ikoni.png');
//   await page.click('text=Tallenna');

//   await expect(page.locator('body .ep-table')).toContainText(osaamismerkkiTeemaNimi);
// }

// async function tarkistaJulkisivuNakyvyys(page) {
//   await page.goto(DEFAULT_VALUES.julkinenUrl);
//   await page.getByRole('link', { name: 'Kansalliset perustaitojen osaamismerkit' }).click();
//   await page.getByLabel('Hae osaamismerkkejä').fill(osaamismerkkiNimi);
//   await expect(page.locator('body .tile')).toContainText(osaamismerkkiNimi);
//   await page.click('text=' + osaamismerkkiNimi);
//   await expect(page.locator('body')).toContainText(osaamismerkkiNimi + ' kuvaus');
// }

// export const luoOsaamismerkki = async (page: Page) => {
//   await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
//   await waitSmall(page);
//   await expect(page.locator('body')).toContainText('Osaamismerkit');
//   // await page.click('text=Lisää osaamismerkki');
//   await page.locator('button').filter({ hasText: 'Lisää osaamismerkki' }).click();
//   await expect(page.locator('.p-dialog-content')).toBeVisible();

//   const dialogContent = page.locator('.p-dialog-content');
//   await dialogContent.locator('.multiselect').first().click();
//   await dialogContent.getByText(osaamismerkkiTeemaNimi, { exact: true }).click();
//   await dialogContent.locator('button.p-datepicker-dropdown').first().click();
//   await page.locator('.p-datepicker-panel .p-datepicker-day-view td[aria-label="1"]').first().click();
//   await dialogContent.getByRole('button', { name: 'Lisää osaamistavoite' }).click();
//   await dialogContent.getByRole('button', { name: 'Lisää arviointikriteeri' }).click();

//   await taytaOsaamismerkinTiedot(page);
//   await asetaKieli(page, 'Svenska');
//   await taytaOsaamismerkinTiedot(page);
//   await asetaKieli(page, 'Suomi');

//   await page.click('text=Tallenna');

//   await page.getByPlaceholder('Etsi').fill(osaamismerkkiNimi);
//   await expect(page.locator('body .ep-table')).toContainText(osaamismerkkiNimi);
//   await page.click('text=' + osaamismerkkiNimi);
//   await page.getByText('Näytetään julkisena', { exact: true }).click();
//   await expect(page.locator('.p-dialog-content input[type="checkbox"]').first()).toBeChecked();
//   await waitSmall(page);
//   await page.click('text=Tallenna');
//   await expect(page.locator('.p-dialog')).not.toBeVisible();
// };

// async function taytaOsaamismerkinTiedot(page) {
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(0).fill(osaamismerkkiNimi);
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(1).fill(osaamismerkkiNimi + ' kuvaus');
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(3).fill('osaamistavoite 1');
//   await page.locator('.p-dialog-content').getByRole('textbox').nth(4).fill('arviointikriteeri 1');
// }

// async function asetaKieli(page, kieli) {
//   await page.locator('.p-dialog-header').locator('.kielivalinta').click();
//   await page.locator('.p-select-overlay').getByRole('option', { name: kieli }).click();
// }

// export const poistaOsaamismerkki = async (browser: any) => {
//   let page = await browser.newPage();
//   await login(page, DEFAULT_VALUES.basePerusteetUrl);
//   await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
//   await page.getByPlaceholder('Etsi').fill(osaamismerkkiNimi);
//   await expect(page.locator('body')).toContainText(osaamismerkkiNimi);
//   await page.click('text=' + osaamismerkkiNimi);
//   await page.getByText('Näytetään julkisena', { exact: true }).click();
//   await expect(page.locator('.p-dialog-content input[type="checkbox"]').first()).not.toBeChecked();
//   await page.click('text=Poista');
//   await expect(page.locator('body')).toContainText('Osaamismerkin poistaminen onnistui');

//   await waitSmall(page);

//   await page.goto(DEFAULT_VALUES.osaamismerkkiTeematUrl);
//   await expect(page.locator('body')).toContainText(osaamismerkkiTeemaNimi);
//   await page.click('text=' + osaamismerkkiTeemaNimi);
//   await page.getByRole('button', { name: 'Poista' }).click();
//   await expect(page.locator('body')).toContainText('Teeman poistaminen onnistui');
//   page.close();
// };
