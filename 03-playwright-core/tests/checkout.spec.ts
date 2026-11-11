// checkout.spec.ts
// End-to-end checkout flow: from login to order confirmation.

import { test, expect } from '../fixtures/pages';
import { products } from '../test-data/products';

test.describe('Checkout', () => {



    test('user can buy a product', { tag: '@smoke' }, async ({ page, inventoryPage, cartPage, checkoutPage }) => {
        await test.step('Add backpack to cart', async () => {
            await inventoryPage.addToCart('sauce-labs-backpack');
            await expect(inventoryPage.cartBadge).toHaveText('1');

        });

        await test.step('Open cart and start checkout', async () => {

            await inventoryPage.openCart();
            await expect(cartPage.title).toHaveText('Your Cart');
            await expect(cartPage.itemNames).toHaveCount(1);
            await expect(cartPage.itemNames).toHaveText(products.backpack.name);

            await cartPage.checkout();
            await expect(page).toHaveURL(/checkout-step-one\.html/);
        });

        await test.step('Fill in shipping info', async () => {
            await checkoutPage.fillShippingInfo('veriko', 'Tester', '6000');
            await expect(page).toHaveURL(/checkout-step-two\.html/);
        });

        await test.step('Verify order total', async () => {
            await expect(checkoutPage.subtotalLabel).toContainText(products.backpack.price);
            await expect(checkoutPage.taxLabel).toContainText('$2.40');
            await expect(checkoutPage.totalLabel).toContainText('$32.39');
        });

        await test.step('Finish order', async () => {
            await checkoutPage.finish();
            await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
            await expect(inventoryPage.cartBadge).toBeHidden();
        });
    });

    test('checkout requires a first name', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addToCart(products.backpack.slug);
        await inventoryPage.openCart();
        await cartPage.checkout();

        await checkoutPage.fillShippingInfo('', 'Tester', '6000');

        await expect(checkoutPage.errorMessage).toContainText('First Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
});