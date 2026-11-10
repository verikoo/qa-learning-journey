// login.spec.ts
// Login tests for SauceDemo, using the LoginPage page object.


import { test, expect } from '../fixtures/pages';

import { users } from '../test-data/users';


test.describe('Login', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('valid user can log in', async ({ page, loginPage }) => {

        await loginPage.login(users.standard.username, users.standard.password);

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('locked out user cannot log in', async ({ loginPage }) => {
        await loginPage.login(users.lockedOut.username, users.lockedOut.password);

        await expect(loginPage.errorMessage).toContainText('locked out');
    });

    test('Wrong password shows error', async ({ page, loginPage }) => {
        await loginPage.login('standard_user', 'wrong_password');

        await expect(loginPage.errorMessage).toContainText('do not match');
        await expect(page).toHaveURL('/');

    })

});

