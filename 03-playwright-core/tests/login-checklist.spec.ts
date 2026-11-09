// login-checklist.spec.ts
// Phase 3 checkpoint: a QA login checklist for SauceDemo, automated.
import { test, expect } from '@playwright/test';

interface InvalidLogin {
    name: string;
    username: string;
    password: string;
    expectedError: string
}

const invalidLogins: InvalidLogin[] =[
    {name: 'empty username', username: '', password: 'secret_sauce', expectedError:'Username is required'},
    {name: 'empty password', username: 'standard_user', password: '', expectedError:'Password is required'},
    {name: 'empty username and password', username: '', password: '', expectedError:'Username is required'},
    {name: 'wrong password', username: 'standard_user', password: 'wrong', expectedError:'do not match'},
    {name: 'locked out user', username: 'locked_out_user', password: 'secret_sauce', expectedError:'locked out'}
];

test.describe('Login checklist', ()=>{
    test.beforeEach(async({page})=>{
        await page.goto('/');
    });

    // Checks 1-5: one test per scenario (data-driven)
    for (const scenario of invalidLogins){
        test(`shows error for ${scenario.name} `, async({page})=>{
            await page.getByLabel('username').fill(scenario.username);
            await page.getByLabel('password').fill(scenario.password);
            await page.getByRole('button', {name: 'Login'}).click();

            await expect(page.getByTestId('error')).toContainText(scenario.expectedError);
            await expect(page).toHaveURL('/')
        });
    }

    // Check 6
    test('password field hides the typed text', async({page})=>{
        await expect(page.getByLabel('password')).toHaveAttribute('type', 'password');
    });

    // Check 7
    test('error message can be closed', async({page})=>{
        await page.getByRole('button', {name: 'Login'}).click();
        const error = page.getByTestId('error');
        await expect(error).toBeVisible();

        await page.getByTestId('error-button').click();

        await expect(error).toBeHidden();
    });

    // Check 8
    test('logout returns to the login page', async({page})=>{
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('password').fill('secret_sauce');
        await page.getByRole('button', {name: 'Login'}).click();
        await expect(page).toHaveURL(/inventory\.html/);

        await page.getByRole('button', {name: 'Open Menu'}).click();
        await page.getByRole('button', {name: 'Logout'}).click();

        await expect(page).toHaveURL('/');
        await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();

    });

    // check 9
    test('products page is blocked when logged out', async({page})=>{
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(page.getByTestId('error')).toContainText('when you are logged in');
    });

});