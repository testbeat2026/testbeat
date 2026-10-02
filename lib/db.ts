import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });
    }
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = getDbPool();
  if (!p) return null;
  return p.query(text, params);
}
