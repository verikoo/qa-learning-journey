// auth.setup.ts
// Logs in once and saves the session (cookies) for all other tests to reuse.
import {test as setup, expect } from '../fixtures/pages';
import { LoginPage } from '../pages/LoginPage';
import {users} from '../test-data/users';

const authFile = 'playwright/.auth/user.json';

setup('log in as standard user and save the session', async({page, loginPage})=>{
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Save cookies + local storage to a file
    await page.context().storageState({path: authFile});
})
