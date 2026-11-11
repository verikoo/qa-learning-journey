// products.spec.ts
// Tests for the SauceDemo products page, using custom fixtures.

import { test, expect } from '../fixtures/pages';

test.describe('Products Page', () => {
    test('shows 6 products', { tag: '@smoke' }, async ({ inventoryPage }) => {
        await expect(inventoryPage.productNames).toHaveCount(6);
    });

    test('adding and removing a product updates the cart badge', async ({ inventoryPage }) => {
        await inventoryPage.addToCart('sauce-labs-backpack');

        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.removeButton('sauce-labs-backpack')).toBeVisible();

        await inventoryPage.removeFromCart('sauce-labs-backpack');

        await expect(inventoryPage.cartBadge).toBeHidden();
    });

    test('sorting by price low to high orders the prices', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('Price (low to high)');

        const prices = await inventoryPage.getPrices();

        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
});