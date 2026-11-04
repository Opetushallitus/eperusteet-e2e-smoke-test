import { expect, Page } from "@playwright/test";
import { perusteenTekstikappale } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";
import { yleissivistavatJulkinenTarkistukset } from "./yleissivistavat";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { saveAndCheck, startEditMode, waitMedium, waitSmall, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";

const TAIDE_PERUSTE_TEKSTIT = [
  'Alkuvaihe',
  'tekstikappale 1',
  'alkuvaihe kuvaus',
  'alkuvaiheteksti 1',
  'alkuvaiheteksti 1 kuvaus',
  '5 op',
  'taiteen osa 1',
  'taiteen osa 1 kuvaus',
  '2 op',
  'tavoite1',
  'tavoite2',
] as const;

export async function taideSisallot(testData: TestData) {
  let page = testData.page;
  await perusteenTekstikappale(page);

  await page.locator('button').filter({ hasText: 'Uusi taiteenala' }).first().click();
  await expect(page.locator('button').filter({ hasText: 'Hae koodistosta' })).toBeVisible();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await expect(page.locator('.ep-modal')).toBeVisible();
  await expect(page.locator('.ep-modal')).toContainText('Alkuvaihe');
  await page.getByText('Alkuvaihe').click();
  await expect(page.locator('.ep-modal')).not.toBeVisible();

  await page.locator('.ep-form-group').filter({ hasText: 'Laajuus' }).getByRole('textbox').fill('5');
  await page.locator('.ProseMirror').nth(0).fill('alkuvaihe kuvaus');

  await page.locator('button').filter({ hasText: 'Lisää tekstikappale' }).click();
  await expect(page.locator('.ProseMirror')).toHaveCount(2);
  await page.locator('input[type="text"]').last().fill('alkuvaiheteksti 1');
  await page.locator('.ProseMirror').last().fill('alkuvaiheteksti 1 kuvaus');
  await saveAndCheck(page);

  await page.locator('button').filter({ hasText: 'Uusi taiteenosa' }).first().click();
  await expect(page.locator('.p-dialog-content')).toBeVisible();
  await page.locator('.p-dialog-content').getByRole('textbox').fill('taiteen osa 1');
  await page.locator('button').filter({ hasText: 'Lisää taiteenosa' }).click();
  await expect(page.locator('.p-dialog-content')).not.toBeVisible();
  await waitSmall(page);

  await startEditMode(page);
  await page.locator('.ep-form-group').filter({ hasText: 'Laajuus' }).getByRole('textbox').fill('2');
  await page.locator('.ProseMirror').nth(0).fill('taiteen osa 1 kuvaus');
  await page.locator('button').filter({ hasText: 'Lisää tavoite' }).click();
  await page.getByRole('textbox').last().fill('tavoite1');
  await page.locator('button').filter({ hasText: 'Lisää tavoite' }).click();
  await page.getByRole('textbox').last().fill('tavoite2');
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

  await tarkistaPdfSisalto(page.getByRole('link', { name: PERUSTE_PDF_LINKKI }), [
    projektiNimi!,
    ...TAIDE_PERUSTE_TEKSTIT,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('Alkuvaihe');
  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');

  await page.locator('.navigation-tree').getByText('Alkuvaihe').click();
  await expect(page.locator('.content')).toContainText('5 op');
  await expect(page.locator('.content')).toContainText('alkuvaihe kuvaus');
  await expect(page.locator('.navigation-tree')).toContainText('alkuvaiheteksti 1');
  await expect(page.locator('.navigation-tree')).toContainText('taiteen osa 1');
  await page.locator('.navigation-tree').getByText('alkuvaiheteksti 1').click();
  await expect(page.locator('.content')).toContainText('alkuvaiheteksti 1 kuvaus');

  await page.locator('.navigation-tree').getByText('taiteen osa 1').click();
  await expect(page.locator('.content')).toContainText('2 op');
  await expect(page.locator('.content')).toContainText('taiteen osa 1 kuvaus');
  await expect(page.locator('.content')).toContainText('tavoite1');
  await expect(page.locator('.content')).toContainText('tavoite2');
}

export async function taideOpsSisallot(testData: TestData) {
  let page = testData.page;

  await page.locator('button, a').filter({ hasText: 'Lisää taiteenala' }).first().click();
  await expect(page.locator('.p-dialog-content')).toBeVisible();
  await page.locator('.p-dialog-content .p-select').click();
  await page.locator('.p-select-overlay').getByText('Alkuvaihe').click();
  await page.locator('.p-dialog-footer').getByRole('button', { name: 'Lisää taiteenala' }).click();
  await expect(page.locator('.p-dialog-content')).not.toBeVisible();

  await expect(page.locator('.navigation')).toContainText('Alkuvaihe');
  await page.locator('.navigation').getByText('Alkuvaihe').click();

  await waitSmall(page);
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await startEditMode(page);
  await waitSmall(page);
  await expect(page.locator('.editointikontrolli .ProseMirror')).toHaveCount(2);
  await page.locator('.editointikontrolli .ProseMirror').last().fill('alkuvaihe paikallinen tarkennus');

  await saveAndCheck(page);

  await expect(page.locator('.navigation')).toContainText('taiteen osa 1');
  await page.locator('.navigation').getByText('taiteen osa 1').click();
  await expect(page.locator('.content')).toContainText('2 op');
  await expect(page.locator('.content')).toContainText('taiteen osa 1 kuvaus');
  await expect(page.locator('.content')).toContainText('tavoite1');
  await expect(page.locator('.content')).toContainText('tavoite2');
  await startEditMode(page);
  await waitSmall(page);
  await expect(page.locator('.editointikontrolli .ProseMirror')).toHaveCount(2);
  await page.locator('.editointikontrolli .ProseMirror').last().fill('taiteen osa paikallinen tarkennus');
  await saveAndCheck(page);
}

export async function taideJulkinenOpsTarkistukset(testData: TestData) {
  let page = testData.page;

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    testData.opsNimi!,
    ...TAIDE_PERUSTE_TEKSTIT,
    'alkuvaihe paikallinen tarkennus',
    'taiteen osa paikallinen tarkennus',
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('tekstikappale 1');
  await page.locator('.navigation-tree').getByText('tekstikappale 1').click();
  await expect(page.locator('.content')).toContainText('tekstikappale 1 kuvaus');

  await expect(page.locator('.navigation-tree')).toContainText('Alkuvaihe');

  await page.locator('.navigation-tree').getByText('Alkuvaihe').click();
  await expect(page.locator('.content')).toContainText('alkuvaihe kuvaus');  
  await expect(page.locator('.content')).toContainText('alkuvaiheteksti 1');
  await expect(page.locator('.content')).toContainText('alkuvaiheteksti 1 kuvaus');
  await expect(page.locator('.content')).toContainText('alkuvaihe paikallinen tarkennus');

  await page.locator('.navigation-tree').getByText('taiteen osa 1').click();
  await expect(page.locator('.content')).toContainText('2 op');
  await expect(page.locator('.content')).toContainText('taiteen osa 1 kuvaus');
  await expect(page.locator('.content')).toContainText('tavoite1');
  await expect(page.locator('.content')).toContainText('tavoite2');
  await expect(page.locator('.content')).toContainText('taiteen osa paikallinen tarkennus');
}
