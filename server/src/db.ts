import { Pool } from 'pg';
import { DB_PORT, DB_NAME, DB_PASS } from './utils/config';

const pool = new Pool({
	user: 'matcha_user',
	host: 'dpg-cf39hthgp3jl0q3k9cgg-a.frankfurt-postgres.render.com',
	database: DB_NAME,
	password: DB_PASS,
	port: DB_PORT,
	ssl: true
});

export default pool;
