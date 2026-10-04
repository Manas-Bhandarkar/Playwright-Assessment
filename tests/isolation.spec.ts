import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';

// Selenium: IsolationTests.seededAccountStartsClean
//   Creates an account through the API, logs in as it through the login page, and checks:
//   the welcome text, 3 holdings and the balance "₹1,25,000.50".
test('12 A freshly seeded account starts with the default holdings and balance', async ({ seededLoginPage }) => {
  const dashboard = new DashboardPage(seededLoginPage.page);

  await expect(dashboard.welcomeHeading).toHaveText(`Welcome, ${seededLoginPage.account.username}`);
  await expect(dashboard.holdingRows).toHaveCount(3);
  await expect(dashboard.balance).toHaveText('\u20B91,25,000.50');
});
