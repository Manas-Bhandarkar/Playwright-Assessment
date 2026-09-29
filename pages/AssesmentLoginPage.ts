import { Page, Locator, expect } from '@playwright/test';

/** Login page for the demo "core banking portal" (the-internet.herokuapp.com/login). */
export class AssesmentLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly businessArea: Locator;
  readonly balanceValue:Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /Log In/i });
    this.businessArea = page.getByLabel('Business area');
    this.balanceValue = page.getByTestId('account-balance');
  }

  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

    async selectBusinessArea( businessArea: string) {
    await this.businessArea.selectOption(businessArea);
    
  }
  async checkBalance(balance: string) {
    await expect(this.balanceValue).toContainText(balance);
  }
}
