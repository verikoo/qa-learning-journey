// users.ts
// Test users. Credentials come from environment variables (.env locally, secrets on CI).

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Create a .env file (see .env.example).`);
  }
  return value;
}

export const users = {
  standard: {
    username: requireEnv('STANDARD_USER'),
    password: requireEnv('PASSWORD'),
  },
  lockedOut: {
    username: requireEnv('LOCKED_USER'),
    password: requireEnv('PASSWORD'),
  },
};