// login.spec.ts
// Login tests for SauceDemo, using the LoginPage page object.


import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('valid user can log in', async ({ page }) => {

        await loginPage.login('standard_user', 'secret_sauce');

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('locked out user cannot log in', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');

        await expect(loginPage.errorMessage).toContainText('locked out');
    });

    test('Wrong password shows error', async ({ page }) => {
        await loginPage.login('standard_user', 'wrong_password');

        await expect(loginPage.errorMessage).toContainText('do not match');
        await expect(page).toHaveURL('/');

    })

});

