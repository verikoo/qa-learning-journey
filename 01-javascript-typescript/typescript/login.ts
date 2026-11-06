// login.ts
// TypeScript version of the fake login, LoginPage and data-driven checks.
// Types are checked by the compiler before any code runs.


interface TestUser {
    name: string;
    username: string;
    password: string;
    expected: string;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fakeLogin(username: string, password: string): Promise<string> {
    const normalizedUsername = username.toLowerCase();

    if (normalizedUsername === '' && password === '') {
        return 'Username and password are required';
    }

    if (normalizedUsername === '') {
        return 'Username is required';
    }

    if (password === '') {
        return 'Password is required';
    }

    await wait(1000);


    if (normalizedUsername === 'admin' && password === '1234') {
        return 'Login successful';
    }

    return 'Invalid credentials';
}

class LoginPage {
    username: string = '';
    password: string = '';
    message: string = '';

    fillUsername(value: string): void {
        this.username = value
    }

    fillPassword(value: string): void {
        this.password = value
    }

    async clickLoginButton(): Promise<void> {
        this.message = await fakeLogin(this.username, this.password);
    }

    getMessage(): string {
        return this.message;
    }

    async login(username: string, password: string): Promise<void> {
        this.fillUsername(username);
        this.fillPassword(password);
        await this.clickLoginButton();
    }
}

const testUsers: TestUser[] = [
    {
        name: 'Valid admin',
        username: 'admin',
        password: '1234',
        expected: 'Login successful'
    },

    {
        name: 'Wrong password',
        username: 'admin',
        password: 'wrongpassword',
        expected: 'Invalid credentials'
    },

    {
        name: 'Empty Fields',
        username: '',
        password: '',
        expected: 'Username and password are required'
    },

    {
        name: 'UPPERCASE USERNAME',
        username: 'ADMIN',
        password: '1234',
        expected: 'Login successful'
    }
];

async function main(): Promise<void> {
    for (const user of testUsers) {
        const loginPage = new LoginPage();
        await loginPage.login(user.username, user.password);

        const actual = loginPage.getMessage();
        const status = actual === user.expected ? 'PASS' : 'FAIL';
        console.log(`${status}: ${user.name} -> "${actual}"`);


    }
}



main();

export { };