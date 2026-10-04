import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';

// Selenium: DashboardTests.dashboardListsHoldings
//   Logs in as the shared demo account, then checks: 3 holdings, the first one is
//   "Bluechip Growth Fund", and its details start with "NSE".
test('04 Dashboard lists the holdings for the account', async ({ loggedInPage }) => {
  const dashboard = new DashboardPage(loggedInPage.page);

  await expect(dashboard.holdingRows).toHaveCount(3);
  await expect(dashboard.firstHoldingName).toHaveText('Bluechip Growth Fund');
  await expect(dashboard.firstHoldingMeta).toHaveText(/^NSE/);
});

// Selenium: DashboardTests.emptyAccountShowsMessage
//   Expects an account with no holdings to show the empty-state message and zero rows.
test('05 An account with no holdings shows the empty message', async ({ emptyAccountPage }) => {
  const dashboard = new DashboardPage(emptyAccountPage.page);

  await expect(dashboard.noHoldingsMessage).toHaveText('No holdings remaining.');
  await expect(dashboard.holdingRows).toHaveCount(0);
});
