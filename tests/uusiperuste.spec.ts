import { test, expect } from '@playwright/test';
import { login } from '../utils/commonmethods';
import { DEFAULT_VALUES } from '../utils/defaultvalues';

test('uusi peruste luotu', async ({ page }) => {
  test.slow();

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
  await expect(page.locator('h1').locator('span').first()).toHaveText(projektiNimi);
});

