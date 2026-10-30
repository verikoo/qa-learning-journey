/*
Exercise 1: Async warm-up (fake login)

Concept: in testing, almost everything takes time:
 page loads, clicks, API calls. 
 JavaScript doesn’t stop and wait by default, 
 so we use async/await to say “wait for this to finish before moving on.” 
 Every Playwright test you write will use await dozens of times.

*/
//--------------------
// warmup.js
// Goal: practice async/await by simulating a login request to a server.

// --- 1. A helper that pauses for a given number of milliseconds ---
// setTimeout(fn, ms) runs a function after a delay, but it does NOT
// return a Promise, so we can't "await" it directly.
// We wrap it in a Promise: the Promise "resolves" (finishes) when the timer ends.

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- 2. The fake login function ---
// "async" lets us use "await" inside this function.
// An async function ALWAYS returns a Promise, even if we return plain text.

async function fakeLogin(username, password) {

    if (username === '' && password === '') {
        return 'Username and password are required';
    }

    if (username === '') {
        return 'Username is required';
    }

    if (password === '') {
        return 'Password is required';
    }




    await wait(1000);// pause 1 second, like waiting for a real server

    if (username === 'admin' && password === '1234') {
        return 'Login successful';
    }

    // If the if-block didn't return, we end up here
    return 'Invalid credentials';
}


// --- 3. Run our test scenarios ---
// We need "await" to get the result out of fakeLogin,
// and "await" only works inside an async function, so we wrap the calls in main().
async function main() {
    const validResult = await fakeLogin('admin', '1234');
    console.log('Valid user:', validResult);

    const invalidResult = await fakeLogin('admin', 'wrong');
    console.log('Wrong password:', invalidResult);

    // Scenario 3: empty username, should return instantly (no 1-second wait)
    const emptyUsernameResult = await fakeLogin('', '1234');
    console.log('Empty username:', emptyUsernameResult);

    // Scenario 4: empty password, should return instantly (no 1-second wait)
    const emptyPasswordResult = await fakeLogin('admin', '');
    console.log('Empty Password:', emptyPasswordResult);

    // Scenario 5: empty username and password, should return instantly (no 1-second wait)
    const emptyFieldsResult = await fakeLogin('', '');
    console.log('Fields are required:', emptyFieldsResult);
}


// Only run main() when this file is run directly (node warmup.js),
// NOT when another file imports it (like our test file).
// Otherwise the demo output would print in the middle of our test results.
if (require.main === module) {
    main();
}

// Export fakeLogin so other files (our tests) can use it.
module.exports = { fakeLogin };



