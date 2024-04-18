import { test, expect, Page } from '@playwright/test';
import {DEFAULT_VALUES} from "../utils/defaultvalues";
import {login} from "../utils/commonmethods";

test.describe.configure({ mode: 'serial' });
test.describe('Uusi peruste ja perusteesta ammatillinen', async () => {
    let page: Page;
    let perusteProjektiUrl;
    let totsuUrl;

    let perusteProjektiNimi = 'TestAutomation';
    let perusteDiaari = '222/222/2222';

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
    });

    test('Luo uusi ammatillinen peruste', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(DEFAULT_VALUES.uusiPerusteUrl);
        await page.getByText('Seuraava').click();
        const projektiNimi = perusteProjektiNimi + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '').replace('.', '');
        await page.getByPlaceholder('Kirjoita projektin nimi').fill(projektiNimi);
        await page.locator('.multiselect').first().click();
        await page.getByText('Ammatillinen perustutkinto').click();
        await page.getByText('Seuraava').click();
        await page.getByText('Seuraava').click();
        await page.getByRole('button', { name: 'Luo perusteprojekti' }).click();
        await expect(page.locator('h1').locator('span').first()).toHaveText(projektiNimi);
        perusteProjektiUrl = page.url();
    });

    test('Päivitä peruste', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Perusteen tiedot' }).click();
        await page.getByRole('button', { name: 'Muokkaa' }).click();
        await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').click();
        await page.getByRole('group', { name: 'Perusteen nimi*' }).getByRole('textbox').fill(perusteProjektiNimi);
        await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').click();
        await page.getByRole('group', { name: 'Diaarinumero' }).getByRole('textbox').fill(perusteDiaari);
        await page.getByRole('group', { name: 'Määräyksen päätöspäivämäärä' }).click();
        await page.getByRole('button', { name: '2' }).first().click();
        // Alku ja loppupäivä samassa groupissa, joten pitää kaivaa syvemmältä, jotta voi asettaa päivämäärän
        await page.getByRole('group', { name: 'Voimassaolo' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
        await page.getByRole('dialog').getByRole('group').getByRole('button', { name: '2' }).first().click();
        await page.getByRole('button', { name: 'Lisää koulutuskoodi' }).click();
        await page.getByText('Agrologi', { exact: true }).first().click();
        await page.locator('li').filter({ hasText: 'Liitteet ja määräykset' }).click();
        await page.locator('.ProseMirror').nth(2).fill("Kuvausteksti");
        await page.setInputFiles('input[type="file"]', './files/testpdf.pdf');
        // odotetaan, että pdf ladataan selaimeen
        await page.waitForTimeout(5000);
        await page.getByRole('button', { name: 'Tallenna' }).click();
        await expect(page.locator('body')).toContainText('Tallennus onnistui');
    });

    test('Luo tutkinnon osa', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByRole('link', { name: 'Tutkinnon osat' }).click();
        await page.getByRole('button', { name: 'Lisää tutkinnon osa' }).click();
        // Koodistosta haun listaus ei jostain syystä renderöidy testissä, joten lisätään manuaalisesti
        await page.getByRole('group', { name: 'Tutkinnon osan nimi' }).getByRole('textbox').fill('Testiosa');
        await page.locator('input[type="number"]').fill('10');
        await page.getByRole('button', { name: 'Tallenna' }).click();
        await expect(page.locator('body')).toContainText('Tallennus onnistui');
    });

    test('Päivitä tutkinnon osa', async ({ page }) => {
        // Playwrightissa jokin bugi, joka ilmenee kun vaihtaa kieltä. Tämä tyhjentää tekstikentät ja tallennuksessa ohjaa satunnaisesti uuden luontiin mikä tuo testiin ennustamattomuutta.
        // Päivitetään tutkinnon osalle nimi ruotsiksi erikseen
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByRole('link', { name: 'Tutkinnon osat' }).click();
        await page.getByRole('link', { name: 'Testiosa' }).click();
        await expect(page.locator('body')).toContainText('Tutkinnon osan nimi');
        await page.getByRole('button', { name: 'Sisällön kieli' }).click();
        await page.getByRole('menuitem', { name: 'Svenska' }).click();
        await page.getByRole('button', { name: 'Muokkaa' }).click();
        await page.getByRole('group', { name: 'Tutkinnon osan nimi' }).getByRole('textbox').fill('Testiosa sv');
        await page.getByRole('button', { name: 'Tallenna' }).click();
        await expect(page.locator('body')).toContainText('Tallennus onnistui');
    });

    test('Päivitä tutkinnon rakenne', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByRole('link', { name: 'Tutkinnon muodostuminen' }).click();
        await page.getByRole('button', { name: 'Muokkaa' }).click();
        await page.getByRole('button', { name: 'Lisää ryhmä rakenteeseen' }).click();
        await page.getByLabel('Valinnaiset tutkinnon osat', { exact: true }).check({ force: true });
        await page.getByLabel('Pakolliset tutkinnon osat', { exact: true }).check({ force: true });
        await page.locator('input[type="number"]').fill('10');
        await page.locator('.modal-footer').getByRole('button', { name: 'Tallenna' }).click();
        await page.getByRole('button', { name: 'Muokkaa ryhmää', includeHidden: true }).click();
        await page.getByRole('button', { name: 'Liitä tutkinnon osa' }).click();
        await page.getByRole('cell', { name: 'Testiosa' }).first().click();
        await page.getByRole('button', { name: 'Liitä valitut tutkinnon osat' }).click();
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
        // Odotetaan julkaisuprosessin päättymistä
        await expect(page.locator('.julkaisu')).toContainText('Uusin versio');
    });

    test('Tarkista perusteen PDF ja luo uusi PDF', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
        await expect(page.locator('.sisalto')).toContainText('Julkaistu');
        // Työversio
        await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(0).click();
        await expect(page.locator('.sisalto')).toContainText('Työversio');
        // KV-liite
        await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).nth(1).click();
        await expect(page.locator('.sisalto')).toContainText('kvliite.pdf');
    });

    test('Luo totsu', async ({ page }) => {
        await login(page, DEFAULT_VALUES.loginAmmatillinenUrl);
        await page.waitForTimeout(10000);
        await page.goto(DEFAULT_VALUES.totsuUrl);
        await expect(page.locator('body')).toContainText('Nimi tai koulutuskoodi');
        await page.getByRole('button', { name: 'Lisää toteutussuunnitelma' }).click();
        await page.getByText('Tutkinnon perustetta').click();
        await page.getByRole('combobox').locator('div').filter({ hasText: 'Valitse perusteprojekti', }).click();
        await page.getByText('TestAutomation').first().click();
        const totsuNimi = perusteProjektiNimi + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '').replace('.', '');
        await page.getByRole('group', { name: 'Toteutussuunnitelman nimi *' }).getByRole('textbox').fill(totsuNimi);
        await page.getByRole('button', { name: 'Luo toteutussuunnitelma' }).click();
        await expect(page.locator('body')).toContainText('Tiedotteet');
        totsuUrl = page.url()
    });

    test('Päivitä totsu', async ({ page }) => {
        await login(page, DEFAULT_VALUES.loginAmmatillinenUrl)
        await page.waitForTimeout(10000);
        await page.goto(totsuUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Toteutussuunnitelman tiedot' }).click();
        await page.getByRole('button', { name: 'Muokkaa' }).click();
        await page.getByRole('group', { name: 'Päätösnumero' }).getByRole('textbox').fill('1');
        await page.getByRole('group', { name: 'Päätöspäivämäärä' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
        await page.getByRole('button', { name: '1' }).first().click();
        await page.getByRole('group', { name: 'Hyväksyjä' }).getByRole('textbox').fill('Tester');
        await page.getByLabel('Suomi', { exact: true }).check({ force: true });
        await page.getByRole('button', { name: 'Tallenna' }).click();
        await expect(page.locator('body')).toContainText('Tallennus onnistui');
    });

    test('Julkaise totsu', async ({ page }) => {
        await login(page, DEFAULT_VALUES.loginAmmatillinenUrl)
        await page.waitForTimeout(10000);
        await page.goto(totsuUrl);
        await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
        await page.hover('.ep-valid-popover')
        await page.getByRole('tooltip', { name: 'Siirry julkaisunäkymään' }).getByRole('link').click();
        await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
        await page.getByRole('button', { name: 'Julkaise' }).click();
        await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();
        // Manuaalinen odotus, että elementin teksti muuttuu kun julkaistu. Muuten playwright ei huomaa muutosta.
        await page.waitForTimeout(30000);
        await page.reload();
        await expect(page.locator('.julkaistu')).toContainText('Julkaistu versio');
    });

    test('Tarkista totsun PDF ja luo uusi PDF', async ({ page }) => {
        await login(page, DEFAULT_VALUES.loginAmmatillinenUrl)
        await page.waitForTimeout(10000);
        await page.goto(totsuUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
        await expect(page.locator('.sisalto')).toContainText('Julkaistu');
        await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
        await expect(page.locator('.sisalto').first()).toContainText('Työversio');
    });

    test('Arkistoi ammatillinen peruste', async ({ page }) => {
        await login(page, DEFAULT_VALUES.basePerusteetUrl)
        await page.goto(perusteProjektiUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Arkistoi peruste' }).click();
        await page.getByRole('button', { name: 'Kyllä' }).click();
        await expect(page.locator('body').first()).toContainText('Arkistoitu onnistuneesti');
    });

    test('Arkistoi totsu', async ({ page }) => {
        await login(page, DEFAULT_VALUES.loginAmmatillinenUrl)
        await page.waitForTimeout(10000);
        await page.goto(totsuUrl);
        await page.getByText('settings').click();
        await page.getByRole('menuitem', { name: 'Arkistoi toteutussuunnitelma' }).click();
        await page.getByRole('button', { name: 'Kyllä' }).click();
        await expect(page.locator('body').first()).toContainText('Suunnitelma arkistoitu');
    });
});
