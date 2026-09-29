import { Page, Locator, expect } from '@playwright/test';

/** Login page for the demo "core banking portal" (the-internet.herokuapp.com/login). */
export class InventoryPage {

    readonly page: Page;
    readonly title : Locator;
    readonly menuBtn : Locator;
    readonly logoutBtn : Locator;

    constructor(page:Page){
this.page=page;
this.title =page.locator('.title');
this.menuBtn=page.getByRole('button',{name: /Open Menu/i});
this.logoutBtn=page.getByRole('button',{name: /logout/i});
    }

    async expectLoaded(){
        await expect(this.title).toHaveText('Products');
    }
async logout(){
    await this.menuBtn.click();
    await this.logoutBtn.click();
}

productByName(name:string){
    return this.page.locator('.inventory_item').filter({ hasText: name})
}
}
