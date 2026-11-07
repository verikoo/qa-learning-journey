// login.spec.ts
// Login tests for SauceDemo: one happy path and two negative cases.

import { test, expect } from '@playwright/test';

test.describe('Login', () => {

    test('valid user can log in', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('username').fill('standard_user');
        await page.getByLabel('password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('locked out user cannot log in', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('username').fill('locked_out_user');
        await page.getByLabel('password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByTestId('error')).toContainText('locked out');
    });

    test('Wrong password shows error', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('username').fill('standard_user');
        await page.getByLabel('password').fill('wrong_password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByTestId('error')).toContainText('do not match');
        await expect(page).toHaveURL('/');

    })

});

