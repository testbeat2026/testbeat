import { Pool } from 'pg';

let pool: Pool;

// @ts-ignore
if (!global.pgPool) {
  // @ts-ignore
  global.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}
// @ts-ignore
pool = global.pgPool;

export default pool;
