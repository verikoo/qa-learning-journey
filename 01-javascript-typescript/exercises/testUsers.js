// testUsers.js
// Goal: practice arrays, objects and loops by running fakeLogin
// against a LIST of test users (data-driven testing).

// Import fakeLogin from Exercise 1 (same folder, so "./")
const { fakeLogin } = require('./warmup');

// --- 1. Test data: an ARRAY of OBJECTS ---
// [ ]   = array: an ordered list of items
// { }   = object: a group of named values (key: value pairs)
// const = this variable name will never point to something else
//         (but we could still change what's INSIDE the array)
const testUsers = [
  { name: 'Valid admin',    username: 'admin', password: '1234',  expected: 'Login successful' },
  { name: 'Wrong password', username: 'admin', password: 'wrong', expected: 'Invalid credentials' },
  { name: 'Unknown user',   username: 'guest', password: '1234',  expected: 'Invalid credentials' },
  { name: 'Empty username', username: '',      password: '1234',  expected: 'Username is required' },
  { name: 'Empty password', username: 'admin', password: '',      expected: 'Password is required' },
  { name: 'Empty fields', username:'', password:'', expected: 'Username and password are required'},
  { name:'Valid admin 2', username:'ADMIN', password:'1234', expected:'Login successful'}
];

// --- 2. Run every user through fakeLogin and compare results ---
async function runAll() {
  // let = this variable WILL change (we increase it as we go)
  let passed = 0;
  let failed = 0;

  // for...of = take each item from the array, one at a time,
  // and call it "user" inside the loop
  for (const user of testUsers) {
    // Dot notation (user.username) reads a value from an object
    const actual = await fakeLogin(user.username, user.password);

    if (actual === user.expected) {
      passed++; // short for: passed = passed + 1
      // Template literal: backticks ` ` let us insert values with ${ }
      console.log(`✔ PASS: ${user.name}`);
    } else {
      failed++;
      console.log(`✖ FAIL: ${user.name} | expected "${user.expected}" but got "${actual}"`);
    }
  }

  // .length = the number of items in the array
  // \n = a new line, for a blank line before the summary
  console.log(`\nTotal: ${testUsers.length} | Passed: ${passed} | Failed: ${failed}`);
}

// --- 3. Start ---
runAll();