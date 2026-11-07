// checkout.spec.ts
// End-to-end checkout flow: from login to order confirmation.

import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/inventory\.html/);
    });

    test('user can buy a product', async ({ page }) => {
        await test.step('Add backpack to cart', async () => {
            await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
            await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
        });

        await test.step('Open cart and start checkout', async () => {
            await page.getByTestId('shopping-cart-link').click();
            await expect(page).toHaveURL(/cart\.html/);
            await expect(page.getByTestId('title')).toHaveText('Your Cart');

            const cartItems = page.getByTestId('inventory-item-name');
            await expect(cartItems).toHaveCount(1);
            await expect(cartItems).toHaveText('Sauce Labs Backpack');

            await page.getByRole('button', { name: 'Checkout' }).click();
            await expect(page).toHaveURL(/checkout-step-one\.html/);
        });

        await test.step('Fill in shipping info', async () => {
            await page.getByPlaceholder('First Name').fill('Veriko');
            await page.getByPlaceholder('Last Name').fill('Tester');
            await page.getByPlaceholder('Zip/Postal Code').fill('6000');
            await page.getByRole('button', { name: 'Continue' }).click();
            await expect(page).toHaveURL(/checkout-step-two\.html/);
        });

        await test.step('Verify order total', async () => {
            await expect(page.getByTestId('subtotal-label')).toContainText('$29.99');
            await expect(page.getByTestId('tax-label')).toContainText('$2.40');
            await expect(page.getByTestId('total-label')).toContainText('$32.39');
        });

        await test.step('Finish order', async () => {
            await page.getByRole('button', { name: 'Finish' }).click();
            await expect(page).toHaveURL(/checkout-complete\.html/);
            await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
            await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
        });
    });

    test('checkout requires a first name', async ({ page }) => {
        await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
        await page.getByTestId('shopping-cart-link').click();
        await page.getByRole('button', { name: 'Checkout' }).click();

        // First name intentionally left empty
        await page.getByPlaceholder('Last Name').fill('Tester');
        await page.getByPlaceholder('Zip/Postal Code').fill('6000');
        await page.getByRole('button', { name: 'Continue' }).click();

        await expect(page.getByTestId('error')).toContainText('First Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
});