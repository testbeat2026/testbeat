import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, t.category, MIN(p.b2c_price) as starting_price
      FROM tests t
      LEFT JOIN lab_test_pricing p ON t.id = p.test_id
      GROUP BY t.id ORDER BY t.id ASC
    `);
    return NextResponse.json({ success: true, tests: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
