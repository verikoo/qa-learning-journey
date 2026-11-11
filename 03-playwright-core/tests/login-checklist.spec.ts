// login-checklist.spec.ts
// Phase 3 checkpoint: a QA login checklist for SauceDemo, using fixtures.

import { test, expect } from '../fixtures/pages';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../test-data/users';

// These tests check the login itself, so they must start logged OUT
test.use({ storageState: { cookies: [], origins: [] } });

interface InvalidLogin {
    name: string;
    username: string;
    password: string;
    expectedError: string;
}

const invalidLogins: InvalidLogin[] = [
    { name: 'empty username', username: '', password: 'secret_sauce', expectedError: 'Username is required' },
    { name: 'empty password', username: 'standard_user', password: '', expectedError: 'Password is required' },
    { name: 'empty username and password', username: '', password: '', expectedError: 'Username is required' },
    { name: 'wrong password', username: 'standard_user', password: 'wrong', expectedError: 'do not match' },
    { name: 'locked out user', username: 'locked_out_user', password: 'secret_sauce', expectedError: 'locked out' },
];

test.describe('Login checklist', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    for (const scenario of invalidLogins) {
        test(`shows error for ${scenario.name}`, async ({ page, loginPage }) => {
            await loginPage.login(scenario.username, scenario.password);

            await expect(loginPage.errorMessage).toContainText(scenario.expectedError);
            await expect(page).toHaveURL('/');
        });
    }

    test('password field hides the typed text', async ({ loginPage }) => {
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('error message can be closed', async ({ loginPage }) => {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage).toBeVisible();

        await loginPage.errorCloseButton.click();

        await expect(loginPage.errorMessage).toBeHidden();
    });

    test('logout returns to the login page', async ({ page, loginPage }) => {
        await loginPage.login(users.standard.username, users.standard.password);

        // Not the inventoryPage fixture: it relies on the saved session, but this file starts logged out
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.title).toHaveText('Products');

        await inventoryPage.logout();

        await expect(page).toHaveURL('/');
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('products page is blocked when logged out', async ({ page, loginPage }) => {
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(loginPage.errorMessage).toContainText('when you are logged in');
    });
});