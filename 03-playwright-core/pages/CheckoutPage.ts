// CheckoutPage.ts
// Page Object for the SauceDemo checkout flow: info, overview and complete steps.
import { type Page, type Locator } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    // Step one: shipping info
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;
    // Step two: overview
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;
    // Complete
    readonly completeHeader: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.errorMessage = page.getByTestId('error');
        this.subtotalLabel = page.getByTestId('subtotal-label');
        this.taxLabel = page.getByTestId('tax-label');
        this.totalLabel = page.getByTestId('total-label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.completeHeader = page.getByTestId('complete-header');
    }


    async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}