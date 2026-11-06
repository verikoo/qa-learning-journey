// errorDemo.js
// Learning step: shows how try/catch/finally handles a thrown error
// so the program can continue instead of crashing.


const { fakeLogin } = require('./warmup');

async function main() {
    try {
        const result = await fakeLogin(undefined, '1234');
        console.log('Result', result); // never reached if an error is thrown
    } catch (error) {
        // Every error object has a name (its type) and a message (what went wrong)
        console.log('Caught an error!');
        console.log('Name:', error.name);
        console.log('Message:', error.message);
    } finally {
        console.log('Finally block: always runs');
    }
    console.log('Program continues normally');
}
main();