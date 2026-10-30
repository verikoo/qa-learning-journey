// warmup.test.js
// Automated tests for fakeLogin. Instead of reading console output with our eyes,
// each test COMPARES the actual result with the expected one and reports PASS/FAIL.

// test   = defines one test case (a name + a function to run)
// assert = the tool that compares values; if they differ, the test FAILS
const test = require('node:test');
const assert = require('node:assert');

// Import the function we want to test from warmup.js (same folder, so "./")
const { fakeLogin } = require('./warmup');

// Each test is async because fakeLogin is async, so we must "await" it.
test('valid credentials return success message', async () => {
  const result = await fakeLogin('admin', '1234');
  // strictEqual(actual, expected): fails if they are not exactly the same
  assert.strictEqual(result, 'Login successful');
});

test('wrong password returns invalid credentials', async () => {
  const result = await fakeLogin('admin', 'wrong');
  assert.strictEqual(result, 'Invalid credentials');
});

test('empty username returns username required', async () => {
  const result = await fakeLogin('', '1234');
  assert.strictEqual(result, 'Username is required');
});

test('empty password returns password required', async () => {
  const result = await fakeLogin('admin', '');
  assert.strictEqual(result, 'Password is required');
});

test('empty username and password returns both required', async () => {
  const result = await fakeLogin('', '');
  assert.strictEqual(result, 'Username and password are required');
});