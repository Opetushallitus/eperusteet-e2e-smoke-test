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
