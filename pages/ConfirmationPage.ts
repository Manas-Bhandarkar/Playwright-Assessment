import { type Page } from '@playwright/test';

export class ConfirmationPage {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByTestId('confirmation-heading');
  }

  get status() {
    return this.page.getByTestId('transaction-status');
  }

  get settlement() {
    return this.page.locator('dt').filter({ hasText: /^Settlement$/ }).locator('~ dd').first();
  }
}