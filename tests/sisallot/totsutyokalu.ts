import { expect } from "@playwright/test";
import { createNimi, login, saveAndCheck, waitLong, waitMedium, waitSmall } from "../../utils/commonmethods";
import { TestData } from "../utils/testUtils";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";

export async function amosaaOpetussuunnitelmaLuonti(
  testData: TestData,
  julkinenOpsTarkistukset: (testData: TestData) => Promise<void>,
  opetussuunnitelmaUrlCallBack: (url: string) => void,
  opsLuonti?: (testData: TestData) => Promise<void>,
  opsSisallot?: (testData: TestData) => Promise<void>,
  opsPohjaLuonti?: (testData: TestData) => Promise<void>,
) {

  let page = testData.page;

  if (opsPohjaLuonti) {
    await opsPohjaLuonti(testData);
    await expect(page.locator('body')).toContainText('Yleisnäkymä');
    opetussuunnitelmaUrlCallBack(page.url());
  }

  await opsLuonti?.(testData);
  await expect(page.locator('body')).toContainText('Yleisnäkymä');
  const totsuUrl = page.url();
  opetussuunnitelmaUrlCallBack(page.url());

  await opsSisallot?.(testData);

  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem').first().click();
  await page.getByRole('button', { name: 'Muokkaa' }).click();
  await page.getByRole('group', { name: 'Päätösnumero' }).getByRole('textbox').fill('1');
  await page.getByRole('group', { name: 'Päätöspäivämäärä' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
  await page.getByRole('button', { name: '1' }).first().click();

  await page.getByRole('group', { name: 'Voimassaolo alkaa' }).getByRole('button', { name: 'Valitse päivämäärä' }).first().click();
  await page.getByRole('button', { name: '1' }).nth(1).click();

  await page.getByRole('group', { name: 'Hyväksyjä' }).getByRole('textbox').fill('Tester');
  await page.getByLabel('Suomi', { exact: true }).check({ force: true });
  await saveAndCheck(page);

  await page.goto(totsuUrl);
  await expect(page.locator('body')).toContainText('Siirry julkaisunäkymään');
  await page.locator('button').filter({ hasText: 'Siirry julkaisunäkymään' }).click();
  await expect(page.locator('.validation')).toContainText('Ei julkaisua estäviä virheitä');
  
  await page.getByRole('button', { name: 'Julkaise' }).click();
  await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();

  // Yritetään julkaisua 3 kertaa, koska koodistopalvelu saattaa heittää virhettä.
  let publishSuccess = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.getByRole('button', { name: 'Julkaise' }).click();
    await page.getByLabel('Vahvista julkaisu').getByRole('button', { name: 'Julkaise' }).click();

    const startTime = Date.now();
    const timeout = 60000;
    
    while (Date.now() - startTime < timeout || (await page.locator('.julkaisu').first().textContent())?.includes('Julkaisu kesken')) {
      const julkaistuText = await page.locator('.julkaisu').first().textContent();
      if (julkaistuText?.includes('Julkaistu versio')) {
        publishSuccess = true;
        break;
      }
      await page.waitForTimeout(3000);
      await page.reload();
    }
    
    if (publishSuccess) {
      break;
    } 
  }
  
  // Final assertion - will fail the test if all attempts failed
  await expect(page.locator('.julkaistu')).toContainText('Julkaistu versio');

  await page.getByText('Lisätoiminnot').click();
  await page.getByRole('menuitem', { name: 'Luo PDF' }).click();
  await expect(page.getByRole('button', { name: 'Luo PDF-tiedosto' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).click();
  await expect(page.getByRole('button').locator('.oph-spinner')).toBeVisible();
  await expect(page.getByRole('button').locator('.oph-spinner')).not.toBeVisible();
  await expect(page.locator('.pdf-box')).toHaveCount(2);
  await expect(page.locator('.pdf-box').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.pdf-box').first()).toContainText('Julkaistu', { timeout: 30_000 });
  await expect(page.locator('.pdf-box').last()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.pdf-box').last()).toContainText('Työversio', { timeout: 30_000 });

  // await expect.poll(async () => {
  //   return page.locator('.pdf-box').first().textContent();
  // }, {
  //     timeout: 300_000,
  //   }).toContain('Julkaistu');

  // await expect.poll(async () => {
  //   return page.locator('.pdf-box').last().textContent();
  // }, {
  //     timeout: 300_000,
  //   }).toContain('Työversio');


  await julkinenOpsTarkistukset(testData);
}
