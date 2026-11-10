// checkout.spec.ts
// End-to-end checkout flow: from login to order confirmation.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { waitForDebugger } from 'node:inspector';

test.describe('Checkout', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.title).toHaveText('Products');

    });

    test('user can buy a product', async ({ page }) => {
        await test.step('Add backpack to cart', async () => {
            await inventoryPage.addToCart('sauce-labs-backpack');
            await expect(inventoryPage.cartBadge).toHaveText('1');

        });

        await test.step('Open cart and start checkout', async () => {

            await inventoryPage.openCart();
            await expect(cartPage.title).toHaveText('Your Cart');
            await expect(cartPage.itemNames).toHaveCount(1);
            await expect(cartPage.itemNames).toHaveText('Sauce Labs Backpack');

            await cartPage.checkout();
            await expect(page).toHaveURL(/checkout-step-one\.html/);
        });

        await test.step('Fill in shipping info', async () => {
            await checkoutPage.fillShippingInfo('veriko', 'Tester', '6000');
            await expect(page).toHaveURL(/checkout-step-two\.html/);
        });

        await test.step('Verify order total', async () => {
            await expect(checkoutPage.subtotalLabel).toContainText('$29.99');
            await expect(checkoutPage.taxLabel).toContainText('$2.40');
            await expect(checkoutPage.totalLabel).toContainText('$32.39');
        });

        await test.step('Finish order', async () => {
            await checkoutPage.finish();
            await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
            await expect(inventoryPage.cartBadge).toBeHidden();
        });
    });

    test('checkout requires a first name', async ({ page }) => {
        await inventoryPage.addToCart('sauce-labs-backpack');
        await inventoryPage.openCart();
        await cartPage.checkout();

        await checkoutPage.fillShippingInfo('', 'Tester', '6000');

        await expect(checkoutPage.errorMessage).toContainText('First Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
});