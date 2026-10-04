import { type Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/login');
  }

  async openDashboard() {
    await this.page.goto('/dashboard');
  }

  async login(area: string, username: string, password: string) {
    await this.page.getByLabel('Business area').selectOption(area);
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  get welcomeHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get areaBadge() {
    return this.page.locator('.area-badge');
  }

  async expectOnDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async expectOnLogin() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async logOut() {
    await this.page.getByRole('button', { name: 'Log Out' }).click();
  }
}
