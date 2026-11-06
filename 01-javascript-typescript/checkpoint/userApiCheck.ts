// userApiCheck.ts
// Phase 1 checkpoint: fetch users from a public test API,
// validate each user's data, and print a PASS/FAIL report.

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// --- 1. Types ---
// Only the fields we check. The API sends more (address, company...),
// but an interface only needs to describe what we use.

interface Geo {
    lat: string;
    lng: string; // The API sends these as strings, not numbers
}

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}


interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
}

interface CheckResult {
    userName: string;
    passed: boolean;
    problems: string[];

}

// --- 2. API client ---
// One class that knows how to talk to the API (same idea as a Page Object,
// but for an API instead of a page).
class UserApiClient {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Fetches all users. Throws if the server does not answer with a success status.
     */
    async getUsers(): Promise<User[]> {
        const response = await fetch(`${this.baseUrl}/users`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        // API data comes from outside, so TypeScript cannot verify it.
        // "as User[]" is our claim about its shape; validateUser() checks it for real.
        return (await response.json()) as User[];
    }
}

// --- 3. Validation ---
// Runtime checks on external data. Collects ALL problems instead of
// stopping at the first one, so the report is complete.

function validateUser(user: User): CheckResult {
    const problems: string[] = [];

    if (typeof user.id !== 'number' || user.id <= 0) {
        problems.push('id must be a positive number')
    }

    if (typeof user.name !== 'string' || user.name.trim() === '') {
        problems.push('name must not be empty');
    }

    if (typeof user.username !== 'string' || user.username.trim() === '') {
        problems.push('username must not be empty');
    }

    if (typeof user.email !== 'string' || !user.email.includes('@')) {
        problems.push('email must contain @');
    }

    // Nested object: check the outer object exists before reading inside it
    if (typeof user.address !== 'object' || user.address === null) {
        problems.push('address is missing')
    } else {
        if (typeof user.address.city !== 'string' || user.address.city.trim() === '') {
            problems.push('address.city must not be empty');
        }

        const lat = Number(user.address.geo?.lat);
        const lng = Number(user.address.geo?.lng);

        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            problems.push('address.geo.lat must be a number between -90 and 90');
        }
        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            problems.push('address.geo.lng must be a number between -180 and 180');
        }
    }

    return {
        userName: user.name,
        passed: problems.length === 0,
        problems,
    };

}

// --- 4 + 5. Run the check with error handling ---
async function main(): Promise<void> {
    const client = new UserApiClient(BASE_URL);

    try {
        const users = await client.getUsers();
        //  users[0].address.geo.lat = '999'; // TEMPORARY: fake bad data to test our checks. Delete after!
        console.log(`Fetched ${users.length} users\n`);

        let passed = 0;
        let failed = 0;

        for (const user of users) {
            const result = validateUser(user);

            if (result.passed) {
                passed++;
                console.log(`PASS: ${result.userName}`);
            } else {
                failed++;
                console.log(`FAIL: ${result.userName}=> ${result.problems.join(',')}`);
            }
        }

        console.log(`\nTotal: ${users.length}, passed: ${passed}, Failed: ${failed}`);
    } catch (error) {
        // In TypeScript, a caught error has type "unknown": check before using it
        const message = error instanceof Error ? error.message : String(error);
        console.log(`Check could not run: ${message} `);
    }
}




main();


export { }; // Make this file a module to avoid global scope pollution