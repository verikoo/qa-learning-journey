// pages.ts
// Custom fixtures: tests ask for page objects by name instead of creating them.
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

import { users } from '../test-data/users';

type PageFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page, loginPage }, use) => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.title).toHaveText('Products');

        await use(inventoryPage);
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

});



export { expect };