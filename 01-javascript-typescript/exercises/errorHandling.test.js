// errorHandling.test.js
// Tests that fakeLogin rejects invalid input types with a clear error.
const test = require('node:test');
const assert = require('node:assert');
const { fakeLogin } = require('./warmup');

const expectedError = {
  name: 'TypeError',
  message: 'Username and password must be strings',
};

test('undefined username throws a type error', async () =>{
    await assert.rejects(()=>fakeLogin(undefined,'1234'), expectedError);
});

test('numeric password throws a type error', async()=>{
    await assert.rejects(()=>fakeLogin('admin', 1234), expectedError);
});

test('null username throws a type error', async()=>{
    await assert.rejects(()=>fakeLogin(null, '1234'), expectedError);
});

test('empty strings are valid input, not errors', async()=>{
    const result=await fakeLogin('','');
      assert.strictEqual(result, 'Username and password are required');
})