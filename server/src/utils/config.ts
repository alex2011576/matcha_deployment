// const DB_PORT: number = process.env.NODE_ENV === 'test' ? 5433 : 5432;

// const DB_NAME: string = process.env.NODE_ENV === 'test' ? 'matcha-test' : 'matcha';
const DB_PORT = 5432;

const DB_NAME = 'matcha';

const DB_PASS = process.env.DB_PASS;

export { DB_NAME, DB_PORT, DB_PASS };
