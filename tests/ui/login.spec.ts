import {test, expect} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';


test.describe ('Login flow',()=>{
    test('Login and verify navigation to landing page', async ({page})=>{
       const loginPage  = new LoginPage(page);
       const inventoryPage = new InventoryPage(page);
        await loginPage.goto();

        await loginPage.login('standard_user','secret_sauce');

        await inventoryPage.expectLoaded();
        await expect(page).toHaveURL(/inventory/);
      //  await page.getByLabel('Username').fill('tomsmith');
        //await page.getByLabel('Password').fill('SuperSecretPassword!');

       // await page.getByRole('button',{name : /login/i}).click();
       // await expect(page.locator('h2')).toHaveText(/Secure Area/i);
    })

    test('Saucelabs Login', async ({page})=>{
        await page.goto('https://saucedemo.com');

        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('secret_sauce');

        await page.getByRole('button',{name : /login/i}).click();
        await expect(page).toHaveURL(/inventory/);

        const targetItem =page.locator(".inventory_item").filter({hasText:'Sauce Labs Backpack'});

        await expect(targetItem).toBeVisible();
        await expect(targetItem.locator("//div[@class='inventory_item_price']")).toHaveText('$29.99'); 
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    })

    test('User logsout from inventory page', async ({page})=>{
       const loginPage  = new LoginPage(page);
       const inventoryPage = new InventoryPage(page);
        await loginPage.goto();

        await loginPage.login('standard_user','secret_sauce');

        await inventoryPage.expectLoaded();
        await expect(page).toHaveURL(/inventory/);

        await inventoryPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
})
})
