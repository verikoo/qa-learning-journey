// loginPage.test.js
// Tests for the login flow using the LoginPage page object.

const test = require('node:test');
const assert = require('node:assert');
const { LoginPage } = require('./loginPage');

test('valid login shows success message', async () => {
    const loginPage = new LoginPage();

    await loginPage.login('admin', '1234');

    assert.strictEqual(loginPage.getMessage(), 'Login successful');
});

test('empty password showsrequired message', async () => {
    const loginPage = new LoginPage();

    // Partial flow: password is intentionally left empty
    loginPage.fillUsername('admin');
    await loginPage.clickLogin();

    assert.strictEqual(loginPage.getMessage(), 'Password is required');
});

test('page instance do not share state', () => {
    const pageA = new LoginPage();
    const pageB = new LoginPage();

    pageA.fillUsername('admin');

    assert.strictEqual(pageA.username, 'admin');
    assert.strictEqual(pageB.username, '');

});