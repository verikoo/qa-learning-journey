// testUsers.js: LEARNING STEP (not a real test file)
// A homemade mini test runner to practice arrays, objects and loops.
// It shows what a test framework does behind the scenes:
// loop through scenarios, compare actual vs expected, count and print results.
// The real version using Node's test framework is in testUsers.test.js.

// --- 1. Imports ---
const test = require('node:test');      // defines test cases
const assert = require('node:assert');  // compares actual vs expected
const { fakeLogin } = require('./warmup'); // the function we are testing

// --- 2. Test data ---
// Each object = one scenario: a readable name, the inputs, and the expected result.
// To add a new scenario, just add a new line here. No new test code needed!
const testUsers = [
  { name: 'Valid admin', username: 'admin', password: '1234', expected: 'Login successful' },
  { name: 'Wrong password', username: 'admin', password: 'wrong', expected: 'Invalid credentials' },
  { name: 'Unknown user', username: 'guest', password: '1234', expected: 'Invalid credentials' },
  { name: 'Empty username', username: '', password: '1234', expected: 'Username is required' },
  { name: 'Empty password', username: 'admin', password: '', expected: 'Password is required' },
  { name: 'Empty fields', username: '', password: '', expected: 'Username and password are required' },
  { name: 'Uppercase username', username: 'ADMIN', password: '1234', expected: 'Login successful' },
  { name: 'Password with trailing space', username: 'admin', password: '1234 ', expected: 'Invalid credentials' },
];

// --- 3. Create one test per user ---
// The loop runs 7 times, so test() is called 7 times, so we get 7 separate tests.
// user.name becomes the test's name in the output.
for (const user of testUsers) {
  test(user.name, async () => {
    // Act: run the code under test with this user's data
    const actual = await fakeLogin(user.username, user.password);

    // Assert: compare with this user's expected result.
    // No if, no counters, no console.log: the framework handles all of that.
    assert.strictEqual(actual, user.expected);
  });
}