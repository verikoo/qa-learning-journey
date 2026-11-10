// InventoryPage.ts
// Page Object for the SauceDemo products (inventory) page.
import { type Page, type Locator } from '@playwright/test'

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly sortDropdown: Locator;
    readonly menuButton: Locator;
    readonly logoutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.productNames = page.getByTestId('inventory-item-name');
        this.productPrices = page.getByTestId('inventory-item-price');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.sortDropdown = page.getByRole('combobox');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
    }

    addToCartButton(productSlug: string): Locator {
        return this.page.getByTestId(`add-to-cart-${productSlug}`);
    }

    removeButton(productSlug: string): Locator {
        return this.page.getByTestId(`remove-${productSlug}`);
    }

    async addToCart(productSlug: string): Promise<void> {
        await this.addToCartButton(productSlug).click();
    }

    async removeFromCart(productSlug: string): Promise<void> {
        await this.removeButton(productSlug).click();
    }

    async sortBy(label: string): Promise<void> {
        await this.sortDropdown.selectOption({ label });
    }
    /** Returns all product prices as numbers, in the order shown on the page. */
    async getPrices(): Promise<number[]> {
        const texts = await this.productPrices.allTextContents();
        return texts.map((text) => parseFloat(text.replace('$', '')));
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();

    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await this.logoutButton.click();
    }

}
