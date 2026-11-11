// login-checklist.spec.ts
// Phase 3 checkpoint: a QA login checklist for SauceDemo, using the LoginPage page object.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// These tests check the login itself, so they must start logged OUT
test.use({ storageState: { cookies: [], origins: [] } });

interface InvalidLogin {
    name: string;
    username: string;
    password: string;
    expectedError: string
}

const invalidLogins: InvalidLogin[] = [
    { name: 'empty username', username: '', password: 'secret_sauce', expectedError: 'Username is required' },
    { name: 'empty password', username: 'standard_user', password: '', expectedError: 'Password is required' },
    { name: 'empty username and password', username: '', password: '', expectedError: 'Username is required' },
    { name: 'wrong password', username: 'standard_user', password: 'wrong', expectedError: 'do not match' },
    { name: 'locked out user', username: 'locked_out_user', password: 'secret_sauce', expectedError: 'locked out' }
];

test.describe('Login checklist', () => {
    let loginPage: LoginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    // Checks 1-5: one test per scenario (data-driven)
    for (const scenario of invalidLogins) {
        test(`shows error for ${scenario.name} `, async ({ page }) => {
            await loginPage.login(scenario.username, scenario.password);

            await expect(loginPage.errorMessage).toContainText(scenario.expectedError);
            await expect(page).toHaveURL('/');
        });
    }

    // Check 6
    test('password field hides the typed text', async () => {
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    // Check 7
    test('error message can be closed', async () => {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage).toBeVisible();

        await loginPage.errorCloseButton.click();

        await expect(loginPage.errorMessage).toBeHidden();

    });

    // Check 8
    test('logout returns to the login page', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);

        await loginPage.login('standard_user', 'secret_sauce');
        await expect(inventoryPage.title).toHaveText('Products');

        await inventoryPage.logout();

        await expect(page).toHaveURL('/');
        await expect(loginPage.loginButton).toBeVisible();
    });

    // check 9
    test('products page is blocked when logged out', async ({ page }) => {
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(loginPage.errorMessage).toContainText('when you are logged in');
    });

});