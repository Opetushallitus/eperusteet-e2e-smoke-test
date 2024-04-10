import { test, expect, Page } from '@playwright/test';
import {login} from "../utils/commonmethods";
import {DEFAULT_VALUES} from "../utils/defaultvalues";

test.describe.configure({ mode: 'serial' });
test.describe('test', async () => {
  let page: Page;
  let perusteProjektiUrl;
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Uusi peruste luotu', async () => {
    await login(page)
    await page.goto(DEFAULT_VALUES.uusiPerusteUrl);
    await page.getByText('Seuraava').click();
    const projektiNimi = 'TestAutomation ' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '').replace('.', '');
    await page.getByPlaceholder('Kirjoita projektin nimi').fill(projektiNimi);
    await page.locator('.multiselect').first().click();
    await page.getByText('Varhaiskasvatus').click();
    await page.getByText('Seuraava').click();
    await page.getByText('Seuraava').click();
    await page.getByRole('button', { name: 'Luo perusteprojekti' }).click();
    await expect(page.locator('h1').locator('span').first()).toHaveText(projektiNimi, { timeout: 15000 });
    // otetaan perusteprojektin url talteen, jonka avulla testataan loput
    let perusteId = page.url().replace(DEFAULT_VALUES.perusteprojektiUrl, '').replace(/[^0-9]+/g, '');
    perusteProjektiUrl = DEFAULT_VALUES.perusteprojektiUrl + '/' + perusteId;
  });

  test('Päivitä peruste', async ({ page }) => {
    await login(page)
    await page.goto(perusteProjektiUrl);
    await page.getByText('settings').click();
    await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
    await page.getByRole('button', { name: 'Muokkaa' }).click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').fill('TestAutomation');
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').fill('111/111/1111');
    await page.getByRole('group', { name: 'Määräyksen päätöspäivämäärä' }).click();
    await page.getByRole('button', { name: '2' }).first().click();
    // Alku ja loppupäivä samassa groupissa, joten pitää kaivaa syvemmältä, jotta voi asettaa päivämäärän
    await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
    await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '2' }).first().click();
    await page.locator('li').filter({ hasText: 'Liitteet ja määräykset' }).click();
    await page.locator('.ProseMirror').fill("Kuvausteksti");
    await page.setInputFiles('input[type="file"]', './files/testpdf.pdf');
    // odotetaan, että pdf ladataan selaimeen
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');
  });

  test('Julkaise peruste', async ({ page }) => {
    await login(page)
    await page.goto(perusteProjektiUrl);
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
    //odotetaan julkaisuprosessin päättymistä
    await page.waitForTimeout(10000);
    await expect(page.locator('.julkaisu').first()).toContainText('Uusin versio');
  });

  test('Tarkista PDF ja luo uusi PDF', async ({ page }) => {
    await login(page)
    await page.goto(perusteProjektiUrl);
    await page.getByText('settings').click();
    await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
    await expect(page.locator('.sisalto')).toContainText('Julkaistu');
    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
    //odotetaan generointiprosessin päättymistä
    await page.waitForTimeout(10000);
    await expect(page.locator('.sisalto')).toContainText('Työversio');
  });

  test('Arkistoi peruste', async () => {
    await login(page)
    await page.goto(perusteProjektiUrl);
    await page.getByText('settings').click();
    await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
    await page.getByRole('button', { name: 'Kyllä' }).click();
    await expect(page.locator('body')).toContainText('Arkistoitu onnistuneesti');
  });
});
