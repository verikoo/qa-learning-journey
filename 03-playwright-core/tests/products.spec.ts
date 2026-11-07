// products.spec.ts
// Tests for the SauceDemo products page: list, cart, and sorting.
import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
    // Runs before EACH test in this group: every test starts logged in
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/inventory\.html/);

    });

    test('shows 6 product', async ({ page }) => {
        await expect(page.getByTestId('inventory-item-name')).toHaveCount(6);

    });

    test('adding and removing product updates the cart badge', async ({ page }) => {
        const cartBadge = page.getByTestId('shopping-cart-badge');

        await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

        await expect(cartBadge).toHaveText('1');
        await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

        await page.getByTestId('remove-sauce-labs-backpack').click();

        await expect(cartBadge).toBeHidden();

    });

    test('sorting by price low to high orders the prices correctly', async ({ page }) => {
        await page.getByRole('combobox').selectOption({ label: 'Price (low to high)' });

        const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
        const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(sortedPrices);
    });

});