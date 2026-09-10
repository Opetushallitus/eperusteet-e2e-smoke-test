import { expect } from "@playwright/test";
import { TestData } from "../utils/testUtils";
import { login, saveAndCheck, startEditMode, vahvistaDialogi, waitMedium, waitSmall, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

const TUVA_PERUSTE_TEKSTIT = [
  'Digiosaaminen',
  'laaja-alaisen osaamisen kuvaus',
  'Perustaitojen vahvistaminen',
  '1 - 2 viikkoa',
  'koulutuksen osan kuvaus',
  'koulutuksen osa tavoite 1',
  'keskeisen sisällön kuvaus',
  'osaamisen arvioinnin kuvaus',
];

export async function tuvaPerusteSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.goto(url!);
  await page.locator('button').filter({ hasText: 'Uusi laaja-alainen osaaminen' }).first().click();
  await page.locator('button').filter({ hasText: 'Lisää laaja-alainen osaaminen' }).click();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await startEditMode(page);
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await waitSmall(page);
  await page.getByText('Digiosaaminen').click();
  await waitSmall(page);
  await page.locator('.ProseMirror').nth(0).fill('laaja-alaisen osaamisen kuvaus');

  await saveAndCheck(page);

  await page.goto(url!);
  await page.locator('button').filter({ hasText: 'Uusi koulutuksen osa' }).first().click();
  await page.locator('button').filter({ hasText: 'Lisää koulutuksen osa' }).click();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await startEditMode(page);

  await page.getByText('Perusopetus', { exact: true}).click();

  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).click();
  await waitSmall(page);
  await page.getByText('Perustaitojen vahvistaminen').click();
  await waitSmall(page);

  await page.locator('.ep-form-group').filter({ hasText: 'Laajuus' }).getByRole('textbox').first().fill('1');
  await page.locator('.ep-form-group').filter({ hasText: 'Laajuus' }).getByRole('textbox').last().fill('2');

  await page.getByText('Yhteinen', { exact: true}).click();

  await page.locator('.ProseMirror').nth(0).fill('koulutuksen osan kuvaus');

  await page.locator('button').filter({ hasText: 'Lisää tavoite' }).click();
  await page.locator('.ep-form-group').filter({ hasText: 'Opiskelija' }).getByRole('textbox').fill('koulutuksen osa tavoite 1');

  await page.locator('.ProseMirror').nth(1).fill('laaja-alaisen osaamisen kuvaus');
  await page.locator('.ProseMirror').nth(2).fill('keskeisen sisällön kuvaus');
  await page.locator('.ProseMirror').nth(3).fill('osaamisen arvioinnin kuvaus');

  await saveAndCheck(page);
}

export async function tuvaPerusteJulkisetTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

  await page.goto(DEFAULT_VALUES.julkinenKoosteUrlUrl + 'tutkintoonvalmentava');
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator('h1')).toContainText(projektiNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: PERUSTE_PDF_LINKKI }), [
    projektiNimi,
    ...TUVA_PERUSTE_TEKSTIT,
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('Digiosaaminen');
  await page.locator('.navigation-tree').getByText('Digiosaaminen').click();
  await expect(page.locator('.content')).toContainText('laaja-alaisen osaamisen kuvaus');

  await expect(page.locator('.navigation-tree')).toContainText('Perustaitojen vahvistaminen');
  await page.locator('.navigation-tree').getByText('Perustaitojen vahvistaminen').click();
  await expect(page.locator('.content')).toContainText('1 - 2 viikkoa');
  await expect(page.locator('.content')).toContainText('koulutuksen osan kuvaus');
  await expect(page.locator('.content')).toContainText('koulutuksen osa tavoite 1');
  await expect(page.locator('.content')).toContainText('laaja-alaisen osaamisen kuvaus');
  await expect(page.locator('.content')).toContainText('keskeisen sisällön kuvaus');
  await expect(page.locator('.content')).toContainText('osaamisen arvioinnin kuvaus');
}

export async function createTuvaOpetussuunnitelmaPohja(testData: TestData){
  let page = testData.page;
  await login(page, DEFAULT_VALUES.loginTutkintoonvalmentava);
  await waitMedium(page);

  await page.goto(DEFAULT_VALUES.tuvaOphKoulutustoimijaOpsUrl);
  await page.getByText('Luo uusi').click();
  await page.getByRole('textbox').first().fill(testData.pohjaNimi!);
  await expect(page.locator('.multiselect')).toBeVisible();
  await page.locator('.multiselect').click();
  await expect(page.locator('.multiselect')).toContainText(testData.projektiNimi!);
  await page.getByText(testData.projektiNimi!).click();
  await page.locator('button').filter({ hasText: 'Luo pohja' }).click();
  await expect(page.locator('body')).toContainText('Yleisnäkymä');

  await page.locator('button').filter({ hasText: 'Aseta valmiiksi' }).click();
  await vahvistaDialogi(page, 'Kyllä');
  await expect(page.locator('body')).toContainText('Tilan vaihto onnistui');
}

export async function createTuvaOpetussuunnitelma(testData: TestData){
  let page = testData.page;

  await page.goto(DEFAULT_VALUES.tuvaOpsUrl);
  await page.getByText('Luo uusi').click();
  await page.getByText('Oletuspohjaa').click();

  await page.locator('.multiselect').nth(1).click();
  await expect(page.locator('.multiselect').nth(1)).toContainText(testData.pohjaNimi!);
  await page.getByText(testData.pohjaNimi!).click();

  await page.getByRole('textbox').last().fill(testData.opsNimi!);
  await page.locator('button').filter({ hasText: 'Luo toteutussuunnitelma' }).click();
}

export async function tuvaOpetussuunnitelmaSisallot(testData: TestData) {
  let page = testData.page;

  await expect(page.locator('.navigation')).toContainText('Digiosaaminen');
  await page.locator('.navigation').getByText('Digiosaaminen').click();
  await startEditMode(page);
  
  await expect(page.locator('.editointikontrolli .ProseMirror').first()).toContainText('laaja-alaisen osaamisen kuvaus');
  await page.locator('.editointikontrolli .ProseMirror').last().fill('laaja-alaisen osaamisen kuvaus paikallinen tarkennus');

  await saveAndCheck(page);

  await expect(page.locator('.navigation')).toContainText('Koulutuksen osat');
  await page.locator('.navigation').getByText('Koulutuksen osat').click();
  await expect(page.locator('.navigation')).toContainText('Perustaitojen vahvistaminen');
  await page.locator('.navigation').getByText('Perustaitojen vahvistaminen').click();
  await expect(page.locator('.editointikontrolli')).toContainText('1 - 2 viikkoa');
  await expect(page.locator('.editointikontrolli')).toContainText('koulutuksen osan kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('koulutuksen osa tavoite 1');
  await expect(page.locator('.editointikontrolli')).toContainText('laaja-alaisen osaamisen kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('keskeisen sisällön kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('osaamisen arvioinnin kuvaus');

  await startEditMode(page);
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(0).fill('tavoitteen paikallinen tarkennus');

  await page.locator('.ep-dropdown').filter({ hasText: 'Lisää laaja-alaisen osaamisen kuvaus' }).click();
  await page.getByText('Monilukutaito').click();
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(1).fill('monilukutaito paikallinen tarkennus');
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(2).fill('keskeisen sisällön paikallinen tarkennus');
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(3).fill('arvioinninen paikallinen tarkennus');

  await page.locator('button').filter({ hasText: 'Lisää koulutuksen järjestäjä' }).click();
  await page.locator('button').filter({ hasText: 'Hae organisaatio' }).click();
  await expect(page.locator('.ep-modal')).toContainText('Valitse koulutuksen järjestäjä');
  await page.getByText('Aalto-korkeakoulusäätiö sr').click();
  await page.locator('.ep-koulutuksen-jarjestaja-select .ep-form-group').nth(1).getByRole('textbox').fill('www.google.com');
  await page.locator('.ep-koulutuksen-jarjestaja-select .ProseMirror').last().fill('käytännön toteutus paikallinen tarkennus');

  await saveAndCheck(page);
}

export async function tuvaOpetussuunnitelmaJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  let opsNimi = testData.opsNimi!;

  await page.goto(DEFAULT_VALUES.julkinenTuvaKoosteUrlUrl);
  await waitMedium(page);

  await page.getByLabel('Hae opetussuunnitelmaa', { exact: true }).fill(opsNimi);
  await expect(page.locator('.opetussuunnitelma-container')).toContainText(opsNimi);
  await page.getByRole('link', { name: opsNimi }).click();
  await expect(page.locator('h1')).toContainText(opsNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    opsNimi,
    ...TUVA_PERUSTE_TEKSTIT,
    'laaja-alaisen osaamisen kuvaus paikallinen tarkennus',
    'Koulutuksen osat',
    'tavoitteen paikallinen tarkennus',
    'Monilukutaito',
    'monilukutaito paikallinen tarkennus',
    'arvioinninen paikallinen tarkennus',
    'Aalto-korkeakoulusäätiö sr',
    'www.google.com',
    'käytännön toteutus paikallinen tarkennus',
  ]);

  await expect(page.locator('.navigation-tree')).toContainText('Digiosaaminen');
  await page.locator('.navigation-tree').getByText('Digiosaaminen').click();
  await expect(page.locator('.content').last()).toContainText('laaja-alaisen osaamisen kuvaus');
  await expect(page.locator('.content').last()).toContainText('laaja-alaisen osaamisen kuvaus paikallinen tarkennus');

  await expect(page.locator('.navigation-tree')).toContainText('Koulutuksen osat');
  await page.locator('.navigation-tree').getByText('Koulutuksen osat').click();
  await expect(page.locator('.navigation-tree')).toContainText('Perustaitojen vahvistaminen');
  await page.locator('.navigation-tree').getByText('Perustaitojen vahvistaminen').click();
  await expect(page.locator('.content').last()).toContainText('1 - 2 viikkoa');
  await expect(page.locator('.content').last()).toContainText('koulutuksen osan kuvaus');
  await expect(page.locator('.content').last()).toContainText('koulutuksen osa tavoite 1');
  await expect(page.locator('.content').last()).toContainText('tavoitteen paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('Monilukutaito');
  await expect(page.locator('.content').last()).toContainText('monilukutaito paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('keskeisen sisällön kuvaus');
  await expect(page.locator('.content').last()).toContainText('osaamisen arvioinnin kuvaus');
  await expect(page.locator('.content').last()).toContainText('arvioinninen paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('Aalto-korkeakoulusäätiö sr');
  await expect(page.locator('.content').last()).toContainText('www.google.com');
  await expect(page.locator('.content').last()).toContainText('käytännön toteutus paikallinen tarkennus');

}
