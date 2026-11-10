// CartPage.ts
// Page Object for the SauceDemo cart page.

import { type Page, type Locator } from "@playwright/test";

export class CartPage {

    readonly page: Page;
    readonly title: Locator;
    readonly itemNames: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }

}