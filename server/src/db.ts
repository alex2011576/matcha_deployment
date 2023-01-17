import { Pool } from 'pg';
import { DB_PORT, DB_NAME } from './utils/config';

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: DB_NAME,
	password: process.env.DB_PASSWORD,
	port: DB_PORT,
	ssl: true
});

export default pool;
