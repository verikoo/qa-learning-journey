// products.spec.ts
// Tests for the SauceDemo products page, using page objects.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Products Page', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.title).toHaveText('Products');

    });

    test('shows 6 product', async () => {
        await expect(inventoryPage.productNames).toHaveCount(6);
    });

    test('adding and removing product updates the cart badge', async () => {

        await inventoryPage.addToCart('sauce-labs-backpack');

        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.removeButton('sauce-labs-backpack'));

        await inventoryPage.removeFromCart('sauce-labs-backpack');

        await expect(inventoryPage.cartBadge).toBeHidden();

    });

    test('sorting by price low to high orders the prices correctly', async () => {

        await inventoryPage.sortBy('Price (low to high)');

        const prices = await inventoryPage.getPrices();
        expect(prices).toEqual([...prices].sort((a, b) => a - b));

    });

});