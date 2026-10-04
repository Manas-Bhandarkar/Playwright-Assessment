import { test as base, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/';

export interface SeededAccount {
  accountId: string;
  username: string;
  password: string;
}

interface SeedOptions {
  holdings?: { name: string; market: string; quantity: number; avgPrice: number }[];
}

type Fixtures = {
  /** An API client pointed at the Sandbox API. (given) */
  api: APIRequestContext;
  /** Creates a brand-new account for this test. (given) */
  createAccount: (options?: SeedOptions) => Promise<SeededAccount>;
  /** A page already signed in as a brand-new account, sitting on the dashboard. (YOU BUILD THIS) */
  loggedInPage: { page: Page; account: SeededAccount };
  /** A newly seeded account signed in through the login form. */
  seededLoginPage: { page: Page; account: SeededAccount };
  /** A page signed in as a newly seeded account with no holdings. */
  emptyAccountPage: { page: Page; account: SeededAccount };
};

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const api = await pwRequest.newContext({ baseURL: API_URL });
    await use(api);
    await api.dispose();
  },

  createAccount: async ({ api }, use) => {
    await use(async (options = {}) => {
      const res = await api.post('test/seed-account', { data: options });
      expect(res.ok()).toBeTruthy();
      return res.json();
    });
  },

  // Create a fresh account and seed its browser session before opening the dashboard.
  loggedInPage: async ({ page, createAccount }, use) => {
    const account = await createAccount();
    await page.goto('/');
    await page.evaluate((accountId) => {
      window.localStorage.setItem('holdingsSandbox.accountId', accountId);
    }, account.accountId);
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(account.username);

    await use({ page, account });
  },

  seededLoginPage: async ({ page, createAccount }, use) => {
    const account = await createAccount();
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('Retail Banking', account.username, account.password);
    await loginPage.expectOnDashboard();

    await use({ page, account });
  },

  emptyAccountPage: async ({ page, createAccount }, use) => {
    const account = await createAccount({ holdings: [] });
    await page.goto('/');
    await page.evaluate((accountId) => {
      window.localStorage.setItem('holdingsSandbox.accountId', accountId);
    }, account.accountId);
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(account.username);

    await use({ page, account });
  },
});

export { expect };
