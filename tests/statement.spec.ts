import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { StatementPage } from '../pages/StatementPage';

// The dashboard has a "View statement" link that opens the statement in a NEW WINDOW.
// Selenium handled that with getWindowHandles() and switchTo().window().

// Selenium: StatementTests.statementOpensInNewWindow
//   Click the link, wait until there are two windows, switch to the new one, expect the
//   heading "Account Statement", close it, and return to the dashboard.
test('13 The statement opens in a new window', async ({ seededLoginPage }) => {
  const dashboard = new DashboardPage(seededLoginPage.page);
  const statementPopupPromise = seededLoginPage.page.waitForEvent('popup');
  await dashboard.openStatementLink();

  const statementPopup = await statementPopupPromise;
  const statement = new StatementPage(statementPopup);
  await expect(statement.heading).toHaveText('Account Statement');

  await statementPopup.close();
  await expect(dashboard.welcomeHeading).toHaveText(`Welcome, ${seededLoginPage.account.username}`);
});

// Selenium: StatementTests.termsCanBeAcceptedInIframe
//   In the statement window there is an iframe titled "Statement terms" with an
//   "Accept terms" button. Click it and expect the text "Terms accepted" inside the frame.
//   Selenium used switchTo().frame() and switchTo().defaultContent().
test('14 The terms can be accepted inside the iframe', async ({ seededLoginPage }) => {
  const dashboard = new DashboardPage(seededLoginPage.page);
  const statementPopupPromise = seededLoginPage.page.waitForEvent('popup');
  await dashboard.openStatementLink();

  const statementPopup = await statementPopupPromise;
  const statement = new StatementPage(statementPopup);
  await statement.acceptTerms();

  await expect(statement.termsResult).toHaveText('Terms accepted');
  await expect(statement.heading).toHaveText('Account Statement');
});

// Selenium: StatementTests.marketFilterMultiSelect
//   The statement has a "Markets" multi-select. Choose BSE (1 holding, "National Infra Bond"),
//   then NSE and BSE together (3 holdings), then clear it (3 holdings again).
//   Selenium used the Select class: selectByValue, getAllSelectedOptions, deselectAll.
test('15 The market filter accepts several selections', async ({ seededLoginPage }) => {
  const dashboard = new DashboardPage(seededLoginPage.page);
  const statementPopupPromise = seededLoginPage.page.waitForEvent('popup');
  await dashboard.openStatementLink();

  const statementPopup = await statementPopupPromise;
  const statement = new StatementPage(statementPopup);
  await expect(statement.rows).toHaveCount(3);

  await statement.selectMarkets(['BSE']);
  await expect(statement.rows).toHaveCount(1);
  await expect(statement.holdingList).toContainText('National Infra Bond');

  await statement.selectMarkets(['NSE', 'BSE']);
  await expect(statement.rows).toHaveCount(3);
  await expect(statement.selectedMarkets).toHaveCount(2);

  await statement.clearMarkets();
  await expect(statement.rows).toHaveCount(3);
});
