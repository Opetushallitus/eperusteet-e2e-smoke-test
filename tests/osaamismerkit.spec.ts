import test, { expect, Page } from "@playwright/test";
import { DEFAULT_VALUES } from "../utils/defaultvalues";
import { createNimi, login, waitSmall } from "../utils/commonmethods";

test.describe.configure({ mode: 'serial' });
test.describe('Uusi osaamismerkki', async () => {
  let page: Page;

  const osaamismerkkiTeemaNimi = createNimi('Testautomation osaamismerkkiteema');
  const osaamismerkkiNimi = createNimi('Testautomation osaamismerkki');

  test.afterEach(async () => {
    await page.close();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Luo, päivitä ja julkaise osaamismerkkiteema ja osaamismerkki', async ({ page, browser }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl);

    await luoTeema(page);
    await luoOsaamismerkki(page);
    await tarkistaJulkisivuNakyvyys(page);

  });

  test.afterAll(async ({ browser }) => {
      let page = await browser.newPage();
      await login(page, DEFAULT_VALUES.basePerusteetUrl);

      await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
      await page.getByPlaceholder('Etsi').fill(osaamismerkkiNimi);
      await expect(page.locator('body')).toContainText(osaamismerkkiNimi);
      await page.click('text=' + osaamismerkkiNimi);
      await page.getByLabel('Näytetään julkisena', { exact: true }).uncheck({ force: true });
      await page.click('text=Poista');
      await expect(page.locator('body')).toContainText('Osaamismerkin poistaminen onnistui');

      await waitSmall(page);

      await page.goto(DEFAULT_VALUES.osaamismerkkiTeematUrl);
      await expect(page.locator('body')).toContainText(osaamismerkkiTeemaNimi);
      await page.click('text=' + osaamismerkkiTeemaNimi);
      await page.getByRole('button', { name: 'Poista' }).click();
      await expect(page.locator('body')).toContainText('Teeman poistaminen onnistui');

  });

  async function luoTeema(page) {
    await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
    await expect(page.locator('body')).toContainText('Osaamismerkit');
    await expect(page.locator('body')).toContainText('Teemojen hallinta');
    await page.click('text=Teemojen hallinta');
    await expect(page.locator('body')).toContainText('Osaamismerkki-teemojen hallinta');
    await page.click('text=Lisää teema');
    await expect(page.locator('body .modal-content')).toBeVisible();
    await page.locator('.modal-content').getByRole('textbox').nth(0).fill(osaamismerkkiTeemaNimi);
    await page.locator('.modal-content').getByRole('textbox').nth(1).fill(osaamismerkkiTeemaNimi + ' kuvaus');

    await asetaKieli(page, 'Svenska');

    await page.locator('.modal-content').getByRole('textbox').nth(0).fill(osaamismerkkiTeemaNimi);
    await page.locator('.modal-content').getByRole('textbox').nth(1).fill(osaamismerkkiTeemaNimi + ' kuvaus');

    await asetaKieli(page, 'Suomi');

    await page.setInputFiles('input[type="file"]', './files/osaamismerkki_ikoni.png');
    await page.click('text=Tallenna');

    await expect(page.locator('body .table')).toContainText(osaamismerkkiTeemaNimi);
  }

  async function luoOsaamismerkki(page) {
    await page.goto(DEFAULT_VALUES.osaamismerkitUrl);
    await expect(page.locator('body')).toContainText('Osaamismerkit');
    await page.click('text=Lisää osaamismerkki');
    await page.locator('.modal-content').locator('.multiselect').first().click();
    await page.locator('.modal-content').getByText(osaamismerkkiTeemaNimi, { exact: true }).click();
    await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
    await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '1' }).first().click();
    await page.getByRole('button', { name: 'Lisää osaamistavoite' }).click();
    await page.getByRole('button', { name: 'Lisää arviointikriteeri' }).click();

    await taytaOsaamismerkinTiedot(page);
    await asetaKieli(page, 'Svenska');
    await taytaOsaamismerkinTiedot(page);
    await asetaKieli(page, 'Suomi');

    await page.click('text=Tallenna');

    await page.getByPlaceholder('Etsi').fill(osaamismerkkiNimi);
    await expect(page.locator('body .table')).toContainText(osaamismerkkiNimi);
    await page.click('text=' + osaamismerkkiNimi);
    await page.getByLabel('Näytetään julkisena', { exact: true }).check({ force: true });
    await page.click('text=Tallenna');
  }

  async function tarkistaJulkisivuNakyvyys(page) {
    await page.goto(DEFAULT_VALUES.julkinenUrl);
    await page.getByRole('link', { name: 'Osaamismerkit Kansalliset' }).click();
    await page.getByLabel('Hae osaamismerkkejä').fill(osaamismerkkiNimi);
    await expect(page.locator('body .tile')).toContainText(osaamismerkkiNimi);
    await page.click('text=' + osaamismerkkiNimi);
    await expect(page.locator('body')).toContainText(osaamismerkkiNimi + ' kuvaus');
  }

  async function taytaOsaamismerkinTiedot(page) {
    await page.locator('.modal-content').getByRole('textbox').nth(0).fill(osaamismerkkiNimi);
    await page.locator('.modal-content').getByRole('textbox').nth(1).fill(osaamismerkkiNimi + ' kuvaus');
    await page.locator('.modal-content').getByRole('textbox').nth(3).fill('osaamistavoite 1');
    await page.locator('.modal-content').getByRole('textbox').nth(4).fill('arviointikriteeri 1');
  }

  async function asetaKieli(page, kieli) {
    await page.locator('.modal-content').getByRole('button', { name: 'Sisällön kieli' }).click();
    await page.locator('.modal-content').getByRole('menuitem', { name: kieli }).click();
  }
});
