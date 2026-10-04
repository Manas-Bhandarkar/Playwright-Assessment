import { type Page } from '@playwright/test';

export class StatementPage {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get rows() {
    return this.page.getByTestId('statement-list').locator('li');
  }

  get holdingList() {
    return this.page.getByTestId('statement-list');
  }

  get selectedMarkets() {
    return this.page.locator('#market-filter option:checked');
  }

  get termsResult() {
    return this.page.frameLocator('iframe[title="Statement terms"]').locator('#result');
  }

  async acceptTerms() {
    await this.page.frameLocator('iframe[title="Statement terms"]').locator('#accept').click();
  }

  async selectMarkets(markets: string[]) {
    await this.page.locator('#market-filter').selectOption(markets);
  }

  async clearMarkets() {
    await this.page.locator('#market-filter').selectOption([]);
  }
}