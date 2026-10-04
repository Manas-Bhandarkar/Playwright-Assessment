import { type Page, expect } from '@playwright/test';

export class SellPage {
  constructor(private readonly page: Page) {}

  async chooseMarket(market: string) {
    await this.page.getByLabel(market, { exact: true }).check();
  }

  async chooseSettlement(settlement: string) {
    await this.page.getByLabel(settlement, { exact: true }).check();
  }

  async enterQuantity(quantity: string) {
    await this.page.locator('#quantity').fill(quantity);
  }

  async enterChequeBranch(branch: string) {
    await this.page.locator('#chequeBranch').fill(branch);
  }

  async confirmDetails() {
    await this.page.locator('[name="confirmed"]').check();
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Submit for Redemption' }).click();
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  async expectOnSellPage() {
    await expect(this.page).toHaveURL(/\/sell\//);
  }
}