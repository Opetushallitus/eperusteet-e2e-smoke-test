import { test, expect } from '@playwright/test';
import { login } from '../utils/commonmethods';

test('login', async ({ page }) => {
  await login(page)
  await expect(page).toHaveTitle('Opintopolku - virkailijan työpöytä');
});

