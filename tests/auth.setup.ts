import { test as setup } from '@playwright/test';
import {DEFAULT_VALUES} from "../utils/defaultvalues";

const authFile = 'playwright/.auth/eperusteet.json';

setup('authenticate', async ({ page }) => {
    await page.goto(DEFAULT_VALUES.basePerusteetUrl);
    if (process.env.CI) {
        await page.locator('#username').fill(process.env.TEST_AUTOMATION_USERNAME!);
        await page.locator('#password').fill(process.env.TEST_AUTOMATION_PASSWORD!);
        await page.locator('input[type="submit"]').click();
    }
    await page.context().storageState({ path: authFile });
});
