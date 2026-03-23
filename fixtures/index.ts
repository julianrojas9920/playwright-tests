import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from './users.json';

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(
      users.standard.username,
      users.standard.password
    );
    await use(page);
    await page.context().clearCookies();
  },
});

export { expect } from '@playwright/test';