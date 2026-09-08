import { expect, Page, test } from '@playwright/test';
import { julkaise, login, startEditMode, valitsePaiva, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { TestData } from "../utils/testUtils";

export async function opsTyokaluOpetussuunnitelmanLuontiJaTestit(
  testData: TestData,
  julkinenOpsTarkistukset: (testData: TestData) => Promise<void>,
  opetussuunnitelmaUrlCallBack: (url: string) => void,
  opsLuonti?: (testData: TestData) => Promise<void>,
  opsSisallot?: (testData: TestData) => Promise<void>,
) {
    let page = testData.page;
    let koulutustyyppi = testData.koulutustyyppi;
    let pohjaNimi = testData.pohjaNimi!;
    let opsNimi = testData.opsNimi!;

    await login(page, DEFAULT_VALUES.baseYlopsUrl)
    await page.goto(DEFAULT_VALUES.opsPohjatUrl);
    await expect(page.locator('.uusi')).toContainText('Luo uusi');
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    // odotetaan, että perustelistaus ladataan
    await waitMedium(page);
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(pohjaNimi);
    await page.locator('.ep-select').first().click();
    await page.locator('.p-select-overlay').getByText(testData.projektiNimi + ' (' + testData.perusteDiaari + ')').click();
    await page.getByRole('button', { name: 'Luo pohja' }).click();
    await expect(page.locator('.done-icon')).toHaveCount(1);
    await page.getByRole('button', { name: 'Aseta valmiiksi' }).click();
    await page.locator('.p-dialog').getByRole('button', { name: 'Aseta valmiiksi' }).click();
    await expect(page.locator('body')).toContainText('Tilan vaihto onnistui');
    // otetaan ops-pohjan url talteen arkistointia varten.
    const opsPohjaUrl = page.url()
    await opetussuunnitelmaUrlCallBack(opsPohjaUrl);

    await page.goto(DEFAULT_VALUES.opsUrl);
    await page.getByRole('link', { name: 'Luo uusi' }).click();
    await page.getByText('Kunnan tai koulutuksen järjestäjän opetussuunnitelman', { exact: true }).click();
    await page.getByText('Vain perustetta', { exact: true }).click();
    await expect(page.locator('.multiselect')).toHaveCount(1);
    await page.locator('.multiselect').first().click();
    await page.getByText(pohjaNimi).first().click();
    await page.locator('div').filter({ hasText: /^Opetussuunnitelman nimi \*Tähän opetussuunnitelman nimi$/ }).getByRole('textbox').fill(opsNimi);
    await page.getByRole('combobox').nth(1).click();
    await page.getByLabel('-searchbox').nth(1).fill('Jyväskylän kaupunki');
    await page.getByText('Jyväskylän kaupunki').click();
    await opsLuonti?.(testData);
    await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
    await expect(page.locator('body')).toContainText('Opetussuunnitelma luotu onnistuneesti');
    // otetaan opsin url talteen, jonka avulla testataan loput opsiin liittyvät.
    await expect(page.locator('body')).toContainText('Yleisnäkymä');
    const opetussuunnitelmaUrl = page.url();
    await opetussuunnitelmaUrlCallBack(opetussuunnitelmaUrl);

    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.locator('.ep-dropdown-item').filter({ hasText: 'Tiedot' }).click();
    await startEditMode(page);
    await page.getByRole('textbox').nth(1).fill('test');
    await page.getByText('Suomi').nth(1).click();
    await valitsePaiva(page, 'Hyväksymispäivämäärä', '1', 'form-content');
    await page.getByRole('button', { name: 'Tallenna' }).click();
    await expect(page.locator('body')).toContainText('Tallennus onnistui');

    await opsSisallot?.(testData);

    await page.goto(opetussuunnitelmaUrl);
    await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
    await page.locator('button').filter({ hasText: 'Siirry julkaisunäkymään' }).click();
    await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
    await julkaise(page, 'Julkaistu versio');

    await page.goto(opetussuunnitelmaUrl);
    await page.getByText('Lisätoiminnot').click();
    await page.locator('.ep-dropdown-item').filter({ hasText: 'Luo PDF' }).click();

    await expect.poll(async () => {
      return page.locator('.sisalto').textContent();
    }, {
      timeout: 300_000,
    }).toContain('Julkaistu');

    await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();

    await expect.poll(async () => {
      return page.locator('.sisalto').textContent();
    }, {
      timeout: 300_000,
    }).toContain('Työversio');

    const julkinenKoosteUrl = testData.julkinenKoosteUrl ?? DEFAULT_VALUES.julkinenKoosteUrlUrl + koulutustyyppi.toLowerCase();
    await page.goto(`${julkinenKoosteUrl}?haku=${opsNimi}`);
    // await page.waitForLoadState('networkidle');
    await expect(page.getByRole('link', { name: opsNimi })).toBeVisible();
    await page.getByRole('link', { name: opsNimi }).click();
    await page.waitForURL(/\/opetussuunnitelma\//);
    await expect(page.locator('.navigation-tree')).toBeVisible({ timeout: 300_000 });
    await expect(page.locator('.navigation-tree')).toContainText('Opetussuunnitelman tiedot');
    await expect(page.locator('h1')).toContainText(opsNimi);

    await julkinenOpsTarkistukset(testData);

    return opetussuunnitelmaUrl;
  }
