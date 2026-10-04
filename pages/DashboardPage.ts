import { type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  get holdingRows() {
    return this.page.locator('.holdings-list > li');
  }

  get welcomeHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get balance() {
    return this.page.getByTestId('account-balance');
  }

  get firstHoldingName() {
    return this.holdingRows.first().locator('div p').first();
  }

  get firstHoldingMeta() {
    return this.holdingRows.first().locator('div p').nth(1);
  }

  get noHoldingsMessage() {
    return this.page.getByText('No holdings remaining.', { exact: true });
  }

  async openFirstHoldingSellForm() {
    await this.page.locator('a[role="button"]').first().click();
  }

  async openStatementLink() {
    await this.page.getByRole('link', { name: 'View statement' }).click();
  }
}