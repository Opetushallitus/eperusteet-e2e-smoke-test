import { expect } from "@playwright/test";
import { TestData } from "../utils/testUtils";
import { login, saveAndCheck, startEditMode, waitMedium, waitSmall } from "../../utils/commonmethods";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

export async function kotoPerusteSisallot(testData: TestData) {
  let page = testData.page;
  let url = testData.url;

  await page.goto(url!);
  await page.getByRole('button', { name: 'Uusi laaja-alainen osaaminen' }).first().click();
  await page.getByRole('button', { name: 'Lisää laaja-alainen osaaminen' }).click();

  await startEditMode(page);

  await page.getByRole('group', { name: 'Otsikko' }).getByRole('textbox').fill('opinto 1');
  await page.locator('.ProseMirror').nth(0).fill('opinnon kuvaus');

  await page.getByRole('button', { name: 'Lisää laaja-alainen osaaminen' }).click();
  await page.getByText('02. Monilukutaito').click();
  await page.locator('.ProseMirror').nth(1).fill('monilukutaito kuvaus');

  await saveAndCheck(page);
  await page.getByRole('link', { name: 'Yleisnäkymä' }).click();

  await page.getByRole('button', { name: 'Tavoitteet ja keskeiset sisällöt' }).first().click();
  await page.getByText('Kielitaitotasot').click();
  await page.getByRole('button', { name: 'Lisää kielitaitotaso' }).click();
  await expect(page.locator('.modal')).not.toBeVisible();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.getByRole('button', { name: 'Muokkaa' }).click();

  await page.getByRole('button', { name: 'Hae koodistosta' }).click();
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal')).toContainText('Työelämätaidot');
  await page.getByText('Työelämätaidot').click();
  await expect(page.locator('.modal')).not.toBeVisible();

  await page.locator('.ProseMirror').nth(0).fill('työelämätaidot kuvaus');

  await page.locator('button').filter({ hasText: 'Lisää kielitaitotaso' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).last().click();
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal')).toContainText('Työelämäjakso');
  await page.getByText('Työelämäjakso').click();
  await expect(page.locator('.modal')).not.toBeVisible();
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(0).fill('työelämäjakso tavoitteet');
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(1).fill('vastaanottaminen kuvaus');
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(2).fill('tuottaminen kuvaus');
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(3).fill('meditaatio kuvaus');

  await saveAndCheck(page);

  await page.locator('button').filter({ hasText: 'Tavoitteet ja keskeiset sisällöt' }).first().click();
  await page.getByText('Työelämä- ja yhteiskuntataitojen opinnot').click();
  await page.locator('.modal').getByRole('button').last().click();
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.getByRole('button', { name: 'Muokkaa' }).click();

  await page.getByRole('button', { name: 'Hae koodistosta' }).first().click();
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal')).toContainText('Yhteiskuntaosaaminen');
  await page.getByText('Yhteiskuntaosaaminen').click();
  await expect(page.locator('.modal')).not.toBeVisible();

  await page.locator('.ProseMirror').nth(0).fill('yhteiskuntaosaaminen kuvaus');

  await page.locator('button').filter({ hasText: 'Lisää opintokokonaisuus' }).click();
  await page.locator('button').filter({ hasText: 'Hae koodistosta' }).last().click();
  await expect(page.locator('.modal')).toBeVisible();
  await expect(page.locator('.modal')).toContainText('Ammatin valinta ja ohjaus');
  await page.getByText('Ammatin valinta ja ohjaus').click();
  await expect(page.locator('.modal')).not.toBeVisible();
  await page.locator('.editointi-container .taitotaso').getByRole('spinbutton').first().fill('1');
  await page.locator('.editointi-container .taitotaso').getByRole('spinbutton').last().fill('2');
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(0).fill('tavoitteet kuvaus');
  await page.locator('.editointi-container .taitotaso .ProseMirror').nth(1).fill('osaaminen kuvaus');

  await saveAndCheck(page);
}

export async function kotoPerusteJulkisetTarkistukset(testData: TestData) {
  let page = testData.page;
  let projektiNimi = testData.projektiNimi!;

  await page.goto(DEFAULT_VALUES.julkinenKotoKoosteUrlUrl );
  await expect(page.locator('body')).toContainText(projektiNimi);
  await page.getByRole('link', { name: projektiNimi }).click();
  await expect(page.locator('h1')).toContainText(projektiNimi);
  await expect(page.locator('.navigation-tree')).toContainText('opinto 1');
  await page.locator('.navigation-tree').getByText('opinto 1').click();
  await expect(page.locator('.content')).toContainText('opinnon kuvaus');
  await expect(page.locator('.content')).toContainText('Monilukutaito');
  await expect(page.locator('.content')).toContainText('monilukutaito kuvaus');

  await expect(page.locator('.navigation-tree')).toContainText('Työelämätaidot');
  await page.locator('.navigation-tree').getByText('Työelämätaidot').click();
  await expect(page.locator('.content')).toContainText('työelämätaidot kuvaus');
  await expect(page.locator('.content')).toContainText('Työelämäjakso');
  await expect(page.locator('.content')).toContainText('työelämäjakso tavoitteet');
  await expect(page.locator('.content')).toContainText('vastaanottaminen kuvaus');
  await expect(page.locator('.content')).toContainText('tuottaminen kuvaus');
  await expect(page.locator('.content')).toContainText('meditaatio kuvaus');

  await expect(page.locator('.navigation-tree')).toContainText('Yhteiskuntaosaaminen');
  await page.locator('.navigation-tree').getByText('Yhteiskuntaosaaminen').click();
  await expect(page.locator('.content')).toContainText('yhteiskuntaosaaminen kuvaus');
  await expect(page.locator('.content')).toContainText('Ammatin valinta ja ohjaus, 1 - 2 op');
  await expect(page.locator('.content')).toContainText('tavoitteet kuvaus');
  await expect(page.locator('.content')).toContainText('osaaminen kuvaus');
}

export async function createKotoOpetussuunnitelma(testData: TestData){
  let page = testData.page;

  await login(page, DEFAULT_VALUES.loginKotoutumiskoulutus);
  await waitMedium(page);

  await page.goto(DEFAULT_VALUES.kotoOpsUrl);
  await page.getByText('Luo uusi').click();
  await page.getByText('Perusteprojektia').click();

  await expect.poll(async () => {
    return page.locator('.multiselect').count();
  }).toBe(1);

  // await expect(page.locator('.multiselect')).toBeVisible();
  await page.locator('.multiselect').click();
  await expect(page.locator('.multiselect')).toContainText(testData.projektiNimi!);
  await page.getByText(testData.projektiNimi!).click();

  await page.getByRole('textbox').last().fill(testData.opsNimi!);
  await page.getByRole('button', { name: 'Luo opetussuunnitelma' }).click();
}

export async function kotoOpetussuunnitelmaSisallot(testData: TestData) {
  let page = testData.page;

  await expect(page.locator('.navigation')).toContainText('opinto 1');
  await page.locator('.navigation').getByText('opinto 1').click();
  await expect(page.locator('.editointikontrolli')).toContainText('opinto 1');
  await expect(page.locator('.editointikontrolli')).toContainText('opinnon kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('Monilukutaito');
  await expect(page.locator('.editointikontrolli')).toContainText('monilukutaito kuvaus');

  await startEditMode(page);

  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').fill('laaja-alaisen osaamisen paikallinen tarkennus');

  await saveAndCheck(page);

  await expect(page.locator('.navigation')).toContainText('Työelämätaidot');
  await page.locator('.navigation').getByText('Työelämätaidot').click();
  await expect(page.locator('.editointikontrolli')).toContainText('Työelämätaidot');
  await expect(page.locator('.editointikontrolli')).toContainText('työelämätaidot kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('Työelämäjakso');
  await expect(page.locator('.editointikontrolli')).toContainText('työelämäjakso tavoitteet');
  await expect(page.locator('.editointikontrolli')).toContainText('vastaanottaminen kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('tuottaminen kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('meditaatio kuvaus');
  await page.getByRole('button', { name: 'Muokkaa' }).click();

  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(0).fill('työelämätaidot paikallinen tarkennus');

  await page.getByRole('button', { name: 'Lisää laaja-alaisen osaamisen kuvaus' }).click();
  await page.getByText('Monilukutaito').click();
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(1).fill('monilukutaito paikallinen tarkennus');

  await saveAndCheck(page);

  await expect(page.locator('.navigation')).toContainText('Yhteiskuntaosaaminen');
  await page.locator('.navigation').getByText('Yhteiskuntaosaaminen').click();
  await expect(page.locator('.editointikontrolli')).toContainText('yhteiskuntaosaaminen kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('Ammatin valinta ja ohjaus, 1 - 2 op');
  await expect(page.locator('.editointikontrolli')).toContainText('tavoitteet kuvaus');
  await expect(page.locator('.editointikontrolli')).toContainText('osaaminen kuvaus');
  await startEditMode(page);

  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(0).fill('tavoitteet paikallinen tarkennus');
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(1).fill('sisältöjen paikallinen tarkennus');
  await page.getByRole('button', { name: 'Lisää laaja-alaisen osaamisen kuvaus' }).click();
  await page.getByText('Monilukutaito').click();
  await page.locator('.editointikontrolli .ep-content .is-editable .ProseMirror').nth(2).fill('monilukutaito paikallinen tarkennus');

  await saveAndCheck(page);
}

export async function kotoOpetussuunnitelmaJulkinenTarkistukset(testData: TestData) {
  let page = testData.page;
  let opsNimi = testData.opsNimi!;

  await page.goto(DEFAULT_VALUES.julkinenKotoKoosteUrlUrl);
  await waitMedium(page);

  await page.getByLabel('Hae opetussuunnitelmaa', { exact: true }).fill(opsNimi);
  await expect(page.locator('.opetussuunnitelma-container')).toContainText(opsNimi);
  await page.getByRole('link', { name: opsNimi }).click();
  await expect(page.locator('h1')).toContainText(opsNimi);

  await expect(page.locator('.navigation-tree')).toContainText('opinto 1');
  await page.locator('.navigation-tree').getByText('opinto 1').click();
  await expect(page.locator('.content').last()).toContainText('opinto 1');
  await expect(page.locator('.content').last()).toContainText('opinnon kuvaus');
  await expect(page.locator('.content').last()).toContainText('Monilukutaito');
  await expect(page.locator('.content').last()).toContainText('monilukutaito kuvaus');
  await expect(page.locator('.content').last()).toContainText('laaja-alaisen osaamisen paikallinen tarkennus');

  await expect(page.locator('.navigation-tree')).toContainText('Työelämätaidot');
  await page.locator('.navigation-tree').getByText('Työelämätaidot').click();
  await expect(page.locator('.content').last()).toContainText('Työelämätaidot');
  await expect(page.locator('.content').last()).toContainText('työelämätaidot kuvaus');
  await expect(page.locator('.content').last()).toContainText('Työelämäjakso');
  await expect(page.locator('.content').last()).toContainText('työelämäjakso tavoitteet');
  await expect(page.locator('.content').last()).toContainText('vastaanottaminen kuvaus');
  await expect(page.locator('.content').last()).toContainText('tuottaminen kuvaus');
  await expect(page.locator('.content').last()).toContainText('meditaatio kuvaus');
  await expect(page.locator('.content').last()).toContainText('työelämätaidot paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('monilukutaito paikallinen tarkennus');

  await expect(page.locator('.navigation-tree')).toContainText('Yhteiskuntaosaaminen');
  await page.locator('.navigation-tree').getByText('Yhteiskuntaosaaminen').click();
  await expect(page.locator('.content').last()).toContainText('yhteiskuntaosaaminen kuvaus');
  await expect(page.locator('.content').last()).toContainText('Ammatin valinta ja ohjaus, 1 - 2 op');
  await expect(page.locator('.content').last()).toContainText('tavoitteet kuvaus');
  await expect(page.locator('.content').last()).toContainText('osaaminen kuvaus');
  await expect(page.locator('.content').last()).toContainText('tavoitteet paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('sisältöjen paikallinen tarkennus');
  await expect(page.locator('.content').last()).toContainText('Monilukutaito');
  await expect(page.locator('.content').last()).toContainText('monilukutaito paikallinen tarkennus');
}
