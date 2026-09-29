import {test, expect} from '@playwright/test';
import { AssesmentLoginPage } from '@pages/AssesmentLoginPage';



test.describe ('Login flow',()=>{
    test('Assesment login and balance check', async ({page})=>{
       const assesmentLoginPage  = await new AssesmentLoginPage(page)
        await assesmentLoginPage.goto();
        await assesmentLoginPage.selectBusinessArea('Retail Banking');
        await assesmentLoginPage.login('demo','demo1234');
        await expect(page).toHaveURL(/dashboard/);
        await assesmentLoginPage.checkBalance('₹1,25,000.50')
        
      
    })



})
