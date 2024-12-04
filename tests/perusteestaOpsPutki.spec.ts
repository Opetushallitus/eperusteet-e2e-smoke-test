import { test, expect, Page } from '@playwright/test';
import {DEFAULT_VALUES} from "../utils/defaultvalues";
import {createNimi, login, waitMedium, waitSmall} from "../utils/commonmethods";

test.describe.configure({ mode: 'serial', retries: 0 });
test.describe('Uusi peruste ja perusteesta OPS', async () => {
  let page: Page;

  let perusteProjektiUrl;
  let opetussuunnitelmaUrl;
  let opsPohjaUrl;
  let opsNimi;

  let perusteProjektiNimi = 'TestAutomation';
  let pohjaNimi;
  let projektiNimi;
  let perusteDiaari = '111/111/1111';

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Luo uusi peruste', async ({ page }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl)
    await page.goto(DEFAULT_VALUES.uusiPerusteUrl);
    await page.getByText('Seuraava').click();
    projektiNimi = await createNimi(perusteProjektiNimi);
    await page.getByPlaceholder('Kirjoita projektin nimi').fill(projektiNimi);
    await page.locator('.multiselect').first().click();
    await page.getByText('Varhaiskasvatus').click();
    await page.getByText('Seuraava').click();
    await page.getByText('Seuraava').click();
    await page.getByRole('button', { name: 'Luo perusteprojekti' }).click();
    await expect(page.locator('h1').locator('span').first()).toHaveText(projektiNimi);
    perusteProjektiUrl = page.url();
  });

  test('Päivitä peruste', async ({ page }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl)
    await page.goto(perusteProjektiUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
    await page.getByRole('button', { name: 'Muokkaa' }).click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').fill(projektiNimi);
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').click();
    await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').fill(perusteDiaari);
    await page.getByRole('group', { name: 'Määräyksen päätöspäivämäärä' }).click();
    await page.getByRole('button', { name: '2' }).first().click();
    // Alku ja loppupäivä samassa groupissa, joten pitää kaivaa syvemmältä, jotta voi asettaa päivämäärän
    await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
    await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '2' }).first().click();
    await page.locator('li').filter({ hasText: 'Liitteet ja määräykset' }).click();
    await page.locator('.ProseMirror').fill("Kuvausteksti");
    await page.setInputFiles('input[type="file"]', './files/testpdf.pdf');
    // odotetaan, että pdf ladataan selaimeen
    await waitMedium(page);
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');
  });

  test('Julkaise peruste', async ({ page }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl)
    await page.goto(perusteProjektiUrl);
    await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
    await expect(page.locator('.julkaisu')).toContainText('Uusin versio');
  });

  test('Hae määräys määräyskokoelmasta', async ({ page }) => {
    await page.goto(DEFAULT_VALUES.julkinenMaarayksetUrl);
    await waitSmall(page);
    await page.getByPlaceholder('Hae määräyksiä').fill(projektiNimi);
    await waitSmall(page);
    await expect(page.locator('.maarays')).toHaveCount(1);
    await page.getByRole('link', { name: projektiNimi }).click();
    await expect(page.locator('.url')).toContainText('Avaa määräys');
  });

  test('Tarkista perusteen PDF ja luo uusi PDF', async ({ page }) => {
    await login(page, DEFAULT_VALUES.basePerusteetUrl)
    await page.goto(perusteProjektiUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
    await expect(page.locator('.sisalto')).toContainText('Julkaistu');
    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
    await expect(page.locator('.sisalto')).toContainText('Työversio');
  });

  test('Avaa julkinen peruste', async ({ page }) => {
    await page.goto(DEFAULT_VALUES.julkinenVarhaiskasvatusUrl);
    await expect(page.locator('body')).toContainText(projektiNimi);
    await page.getByRole('link', { name: projektiNimi }).click();
    await waitMedium(page);
    await expect(page.locator('.content')).toContainText(projektiNimi);
  });

  test('Luo OPS-pohja', async ({ page }) => {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(DEFAULT_VALUES.opsPohjatUrl);
    await expect(page.locator('.uusi')).toContainText('Luo uusi');
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    // odotetaan, että perustelistaus ladataan
    await waitMedium(page);
    await page.getByRole('combobox').selectOption({ label: projektiNimi + ' (' + perusteDiaari + ')' });
    await page.getByRole('textbox').click();
    pohjaNimi = await createNimi(perusteProjektiNimi + ' pohja');
    await page.getByRole('textbox').fill(pohjaNimi);
    await page.getByRole('button', { name: 'Luo pohja' }).click();
    await expect(page.locator('.done-icon')).toHaveCount(1);
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Aseta valmiiksi' }).click();
    await page.locator('.modal-content').getByRole('button', { name: 'Aseta valmiiksi' }).click();
    await expect(page.locator('body')).toContainText('Tilan vaihto onnistui');
    // otetaan ops-pohjan url talteen arkistointia varten.
    opsPohjaUrl = page.url()
  });

  test('Luo OPS pohjasta', async ({ page }) => {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(DEFAULT_VALUES.opsUrl);
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    await page.getByText('Kunnan tai koulutuksen järjestäjän opetussuunnitelman', { exact: true }).click();
    await page.getByText('Vain perustetta', { exact: true }).click();
    await expect(page.locator('.multiselect')).toHaveCount(1);
    await page.locator('.multiselect').first().click();
    await page.getByText(pohjaNimi + ' (' + perusteDiaari + ')').first().click();
    opsNimi = await createNimi(perusteProjektiNimi + ' ops');
    await page.locator('div').filter({ hasText: /^Opetussuunnitelman nimi \*Tähän opetussuunnitelman nimi$/ }).getByRole('textbox').fill(opsNimi);
    await page.getByText('Lisää kunta', { exact: true }).click();
    await page.getByRole('combobox').nth(1).click();
    await page.getByText('Jyväskylä').click();
    await waitSmall(page);
    await page.getByText('Lisää koulutuksen järjestäjä', { exact: true }).click();
    await page.getByRole('combobox').nth(2).click();
    await page.getByText('Jyväskylän kaupunki').click();
    await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
    await expect(page.locator('body')).toContainText('Opetussuunnitelma luotu onnistuneesti');
    // otetaan opsin url talteen, jonka avulla testataan loput opsiin liittyvät.
    opetussuunnitelmaUrl = page.url()
  });

  test('Päivitä OPS', async ({ page }) => {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Tiedot' }).click();
    await page.getByRole('button', { name: 'Muokkaa' }).click();
    await page.getByRole('textbox').nth(1).fill('test');
    await page.getByLabel('Suomi', { exact: true }).check({ force: true });
    await page.getByText('Valitse päivämäärä').click();
    await page.getByRole('button', { name: '1' }).first().click();
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');
  });

  test('Julkaise OPS', async ({ page }) => {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(opetussuunnitelmaUrl);
    await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
    await page.hover('.ep-valid-popover')
    await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
    await expect(page.locator('.julkaisu').first()).toContainText('Julkaistu versio');
  });

  test('Tarkista opsin PDF ja luo uusi PDF', async ({ page }) => {
    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
    await expect(page.locator('.sisalto')).toContainText('Julkaistu');
    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
    await expect(page.locator('.sisalto').first()).toContainText('Työversio');
  });

  test('Avaa julkinen ops', async ({ page }) => {
    await page.goto(DEFAULT_VALUES.julkinenVarhaiskasvatusUrl);
    await page.getByPlaceholder('Hae opetussuunnitelmaa').fill(opsNimi);
    await expect(page.locator('body')).toContainText(opsNimi);
    await page.getByRole('link', { name: opsNimi }).click();
    await expect(page.locator('h1')).toContainText(opsNimi);
  });

  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();
    await login(page, DEFAULT_VALUES.basePerusteetUrl)
    await page.goto(perusteProjektiUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
    await page.getByRole('button', { name: 'Kyllä' }).click();
    await expect(page.locator('body').first()).toContainText('Arkistoitu onnistuneesti');

    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(opsPohjaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Arkistoi pohja' }).click();
    await page.getByRole('button', { name: 'Kyllä' }).click();
    await expect(page.locator('body').first()).toContainText('Arkistoitu onnistuneesti');

    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.getByRole('menuitem', { name: 'Arkistoi opetussuunnitelma' }).click();
    await page.getByRole('button', { name: 'Kyllä' }).click();
    await expect(page.locator('body').first()).toContainText('Arkistoitu onnistuneesti');
  });
});
