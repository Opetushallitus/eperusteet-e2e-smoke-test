import { expect, Locator, Page } from '@playwright/test';

/** Fills a field without logging the value in HTML reports or traces. */
async function fillSecret(locator: Locator, value: string) {
  await locator.evaluate((input: HTMLInputElement, secret) => {
    input.value = secret;
  }, value);
}

export const login = async (page: Page, url) => {
  if (process.env.CI) {
    console.log('url', url);
    await page.goto(url);
    await fillSecret(page.locator('#username'), process.env.TEST_AUTOMATION_USERNAME!);
    await fillSecret(page.locator('#password'), process.env.TEST_AUTOMATION_PASSWORD!);
    await page.locator('input[type="submit"]').click();
  } else {
    await page.goto(url);
  }
};

export const createNimi = (nimi: string) => {
  // korjataan timezonea
  const currentDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
  return nimi + ' ' + currentDate.toISOString().slice(0, 16).replace(/[T]/g, ' ');
};

export const waitSmall = async (page) => {
  await page.waitForTimeout(3_000);
}

export const waitMedium = async (page) => {
  await page.waitForTimeout(10_000);
}

export const waitLong = async (page) => {
  await page.waitForTimeout(60_000);
}

export async function startEditMode(page: Page) {
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.locator('button').getByText('Muokkaa', { exact: true }).click();
  await expect(page.locator('.editointi-container')).toContainText('Tallenna');
  await page.waitForTimeout(500);
}

export async function saveAndCheck(page: Page) {
  await page.locator('button').filter({ hasText: 'Tallenna'}).first().click();
  await expect(page.locator('body')).toContainText('Tallennus onnistui');
  await expect(page.locator('.editointi-container')).toContainText('Muokkaa');
  await page.waitForTimeout(500);
}

export async function avaaLisatoiminto(page: Page, lisatoiminto: string) {
  await page.getByText('Lisätoiminnot').click();
  await page.locator('.ep-dropdown-item').filter({ hasText: lisatoiminto }).click();
}

export async function valitsePaiva(page: Page, kentta: string, paiva: string, parentClass: string = 'ep-form-group') {
  await page.locator('.' + parentClass).filter({ hasText: kentta }).locator('.ep-date-picker').first().click();
  await page.locator('.p-datepicker-panel .p-datepicker-day-view td[aria-label="' + paiva + '"]').first().click();
  await expect(page.locator('.p-datepicker-panel')).not.toBeVisible();
}

async function kaynnistaJulkaisu(page: Page) {
  // Avaa vahvistusdialogi. Sivulla voi olla useita 'Julkaise'-nappeja, joten .first().
  await page.getByRole('button', { name: 'Julkaise', exact: true }).first().click();

  const dialog = page.locator('.p-confirmdialog');
  await expect(dialog).toBeVisible();

  // Klikkaa vahvistus ja varmista että dialogi sulkeutuu eli vahvistus rekisteröityi.
  await dialog.getByRole('button', { name: 'Julkaise', exact: true }).click();
  await expect(dialog).toBeHidden();
}

export async function julkaise(page: Page, julkaisuTeksti: string) {
  await kaynnistaJulkaisu(page);

  const maxJulkaisuFailureRetries = 3;
  let julkaisuFailureRetryCount = 0;

  await expect.poll(async () => {
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.julkaisu').first().waitFor({ state: 'visible' });
    const text = (await page.locator('.julkaisu').first().textContent()) ?? '';
    if (text.includes('Julkaisu epäonnistui')) {
      if (julkaisuFailureRetryCount >= maxJulkaisuFailureRetries) {
        throw new Error(
          'Julkaisu epäonnistui yli sallitun määrän uudelleenyrityksiä (3).',
        );
      }
      julkaisuFailureRetryCount++;
      await kaynnistaJulkaisu(page);
      await waitSmall(page);
      return '';
    }
    return text;
  }, 
  { 
    intervals: [5_000, 10_000, 20_000, 30_000],
    timeout: 600_000 
  }).toContain(julkaisuTeksti);
}

export async function luoPDF(page: Page, pdfLkm: number = 2) {
  await page.getByRole('button', { name: 'Luo PDF-tiedosto' }).first().click();
  await expect(page.getByRole('button').locator('.oph-spinner')).toBeVisible();
  await expect(page.getByRole('button').locator('.oph-spinner')).not.toBeVisible();
  await expect(page.locator('.pdf-box')).toHaveCount(pdfLkm);
  await page.reload();
  await expect(page.locator('.pdf-box').first()).toContainText('Julkaistu');
  await expect(page.locator('.pdf-box').nth(1)).toContainText('Työversio');
}

export async function vahvistaDialogi(page: Page, dialogiTeksti: string) {
  const dialog = page.locator('.p-confirmdialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: dialogiTeksti, exact: true }).click();
  await expect(dialog).toBeHidden();
}