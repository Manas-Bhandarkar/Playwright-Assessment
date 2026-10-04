import { expect, test } from '../fixtures';
import { type APIRequestContext } from '@playwright/test';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SellPage } from '../pages/SellPage';

async function getHoldingQuantity(api: APIRequestContext, accountId: string, holdingName: string) {
  const response = await api.get(`account/${accountId}`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json() as {
    account: { holdings: { name: string; quantity: number }[] };
  };
  const holding = data.account.holdings.find((item) => item.name === holdingName);
  if (!holding) {
    throw new Error(`No holding named ${holdingName}`);
  }

  return holding.quantity;
}

// All five tests open the sell form for the first holding, "Bluechip Growth Fund".
// The sell form has two groups of radio buttons (Market and Settlement type), a quantity,
// a confirmation checkbox and a "Submit for Redemption" button.

// Selenium: SellTests.sellCashOnNse
//   Choose market NSE, settlement Cash, quantity 1, confirm, submit.
//   Expect the confirmation heading "Transaction submitted and under process",
//   the status "processing" and the settlement "cash".
test('07 Selling on NSE with cash settlement is confirmed', async ({ loggedInPage }) => {
  const dashboard = new DashboardPage(loggedInPage.page);
  await dashboard.openFirstHoldingSellForm();

  const sellPage = new SellPage(loggedInPage.page);
  await sellPage.chooseMarket('NSE');
  await sellPage.chooseSettlement('Cash');
  await sellPage.enterQuantity('1');
  await sellPage.confirmDetails();
  await sellPage.submit();

  const confirmation = new ConfirmationPage(loggedInPage.page);
  await expect(confirmation.heading).toHaveText('Transaction submitted and under process');
  await expect(confirmation.status).toHaveText('processing');
  await expect(confirmation.settlement).toHaveText('cash');
});

// Selenium: SellTests.chequeNeedsBranch
//   Choose Cheque, quantity 1, confirm, submit, without filling in a branch.
//   Expect the alert "Cheque settlement requires a branch" and to stay on the sell page.
test('08 Cheque settlement without a branch is rejected', async ({ loggedInPage }) => {
  const dashboard = new DashboardPage(loggedInPage.page);
  await dashboard.openFirstHoldingSellForm();

  const sellPage = new SellPage(loggedInPage.page);
  await sellPage.chooseSettlement('Cheque');
  await sellPage.enterQuantity('1');
  await sellPage.confirmDetails();
  await sellPage.submit();

  await expect(sellPage.errorMessage).toHaveText('Cheque settlement requires a branch');
  await sellPage.expectOnSellPage();
});

// Selenium: SellTests.chequeWithBranchConfirms
//   Choose NSE and Cheque, branch "Fort, Mumbai", quantity 1, confirm, submit.
//   Expect the settlement "cheque" and the status "processing".
test('09 Cheque settlement with a branch is confirmed', async ({ loggedInPage }) => {
  const dashboard = new DashboardPage(loggedInPage.page);
  await dashboard.openFirstHoldingSellForm();

  const sellPage = new SellPage(loggedInPage.page);
  await sellPage.chooseMarket('NSE');
  await sellPage.chooseSettlement('Cheque');
  await sellPage.enterChequeBranch('Fort, Mumbai');
  await sellPage.enterQuantity('1');
  await sellPage.confirmDetails();
  await sellPage.submit();

  const confirmation = new ConfirmationPage(loggedInPage.page);
  await expect(confirmation.settlement).toHaveText('cheque');
  await expect(confirmation.status).toHaveText('processing');
});

// Selenium: SellTests.oversellIsRejected
//   Quantity 9999, confirm, submit. Expect an alert like "Only 120 units available to sell".
//   The number depends on the account, so match the shape of the sentence.
test('10 Selling more than is held is rejected', async ({ loggedInPage }) => {
  const dashboard = new DashboardPage(loggedInPage.page);
  await dashboard.openFirstHoldingSellForm();

  const sellPage = new SellPage(loggedInPage.page);
  await sellPage.enterQuantity('9999');
  await sellPage.confirmDetails();
  await sellPage.submit();

  await expect(sellPage.errorMessage).toHaveText(/^Only .+ units available to sell$/);
});

// Selenium: SellTests.saleReducesQuantityOnServer
//   Ask the API for the holding's quantity, sell 2 through the UI, ask the API again,
//   expect the quantity to be 2 lower. Playwright's request fixture replaces the Java HttpClient.
test('11 A sale reduces the quantity held on the server', async ({ loggedInPage, api }) => {
  const { page, account } = loggedInPage;
  const before = await getHoldingQuantity(api, account.accountId, 'Bluechip Growth Fund');

  const dashboard = new DashboardPage(page);
  await dashboard.openFirstHoldingSellForm();

  const sellPage = new SellPage(page);
  await sellPage.enterQuantity('2');
  await sellPage.confirmDetails();
  await sellPage.submit();

  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toHaveText('Transaction submitted and under process');

  const after = await getHoldingQuantity(api, account.accountId, 'Bluechip Growth Fund');
  expect(after).toBe(before - 2);
});
